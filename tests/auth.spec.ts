import { test, expect } from "../fixtures/pom-fixtures";
import { users, invalidUser } from "../fixtures/users";

test.describe("Authentication", () => {
  // These tests are ABOUT the login process itself, so they intentionally
  // do NOT use the `loggedInPage` fixture (which logs in automatically) —
  // that fixture is for tests that need to already be past login.
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test("standard_user can log in successfully", async ({ loginPage, page }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory.html/);
  });

  test("locked_out_user is blocked with an error message", async ({
    loginPage,
    page,
  }) => {
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);
    await expect(page).toHaveURL(/saucedemo.com\/$/);
    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getErrorText()).toContain("locked out");
  });

  test("invalid credentials show an error message", async ({ loginPage }) => {
    await loginPage.login(invalidUser.username, invalidUser.password);
    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getErrorText()).toContain("do not match");
  });

  test("empty username and password shows required-field error", async ({
    loginPage,
  }) => {
    await loginPage.loginButton.click();
    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getErrorText()).toContain("Username is required");
  });

  test("empty password shows required-field error", async ({ loginPage }) => {
    await loginPage.usernameInput.fill(users.standard.username);
    await loginPage.loginButton.click();
    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getErrorText()).toContain("Password is required");
  });

  // This test needs to start already logged in, then verify logout — a
  // perfect case for the `loggedInPage` fixture plus the `menu` fixture.
  test("logged in user can log out via menu", async ({
    loggedInPage,
    menu,
    loginPage,
    page,
  }) => {
    await expect(page).toHaveURL(/inventory.html/);

    await menu.logout();
    await expect(page).toHaveURL(/saucedemo.com\/$/);
    await expect(loginPage.usernameInput).toBeVisible();
  });

  test("session is invalidated after logout", async ({
    loggedInPage,
    menu,
    page,
  }) => {
    // Verify logged in
    await expect(page).toHaveURL(/inventory.html/);

    // Log out
    await menu.logout();
    await expect(page).toHaveURL(/saucedemo.com\/$/);

    // Try to navigate directly to /inventory.html — should redirect to login
    await page.goto("/inventory.html");
    await expect(page).toHaveURL(/saucedemo.com\/$/); // Should be redirected back to login
  });

  test("username is case-sensitive", async ({ loginPage }) => {
    // Try uppercase version of standard_user
    const uppercaseUsername = users.standard.username.toUpperCase();
    await loginPage.login(uppercaseUsername, users.standard.password);
    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getErrorText()).toContain("do not match");
  });

  // TC0017: SQL-style special-character string as username
  test("sql-style username is rejected gracefully without crash", async ({
    loginPage,
    page,
  }) => {
    await loginPage.login("' OR '1'='1", users.standard.password);
    // Should show error, not crash or log in
    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getErrorText()).toContain("do not match");
    await expect(page).not.toHaveURL(/inventory.html/);
  });

  // TC0018: Excessively long username
  test("500-char username is rejected gracefully without crash", async ({
    loginPage,
    page,
  }) => {
    const longUsername = "a".repeat(500);
    await loginPage.login(longUsername, users.standard.password);
    // Should show error without UI overflow or crash
    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getErrorText()).toContain("do not match");
    await expect(page).not.toHaveURL(/inventory.html/);
  });

  // TC0020: Password field masks input
  test("password field type is password (characters masked)", async ({
    loginPage,
  }) => {
    const inputType = await loginPage.passwordInput.getAttribute("type");
    expect(inputType).toBe("password");
  });

  // TC0021: Repeated failed logins do not lock standard_user
  test("standard_user is not locked after 3 consecutive failed attempts", async ({
    loginPage,
    page,
  }) => {
    // Fail 3 times
    for (let i = 0; i < 3; i++) {
      await loginPage.login(users.standard.username, "wrong_password");
      await expect(loginPage.errorMessage).toBeVisible();
    }
    // 4th attempt with correct password should succeed
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory.html/);
  });
});
