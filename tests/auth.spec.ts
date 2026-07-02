import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { MenuComponent } from "../pages/components/MenuComponent";
import { users, invalidUser } from "../fixtures/users";

test.describe("Authentication", () => {
  test("standard_user can log in successfully", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory.html/);
  });

  test("locked_out_user is blocked with an error message", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);
    await expect(page).toHaveURL(/saucedemo.com\/$/);
    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getErrorText()).toContain("locked out");
  });

  test("invalid credentials show an error message", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(invalidUser.username, invalidUser.password);
    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getErrorText()).toContain("do not match");
  });

  test("empty username and password shows required-field error", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginButton.click();
    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getErrorText()).toContain("Username is required");
  });

  test("empty password shows required-field error", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.usernameInput.fill(users.standard.username);
    await loginPage.loginButton.click();
    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getErrorText()).toContain("Password is required");
  });

  test("logged in user can log out via menu", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const menu = new MenuComponent(page);

    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory.html/);

    await menu.logout();
    await expect(page).toHaveURL(/saucedemo.com\/$/);
    await expect(loginPage.usernameInput).toBeVisible();
  });
});
