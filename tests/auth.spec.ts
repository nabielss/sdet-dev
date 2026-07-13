import { test, expect } from '../fixtures/pom-fixtures';
import { users, invalidUser } from '../fixtures/users';

test.describe('Authentication', () => {
  // These tests are ABOUT the login process itself, so they intentionally
  // do NOT use the `loggedInPage` fixture (which logs in automatically) —
  // that fixture is for tests that need to already be past login.
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard_user can log in successfully', async ({ loginPage, page }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('locked_out_user is blocked with an error message', async ({ loginPage, page }) => {
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);
    await expect(page).toHaveURL(/saucedemo.com\/$/);
    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getErrorText()).toContain('locked out');
  });

  test('invalid credentials show an error message', async ({ loginPage }) => {
    await loginPage.login(invalidUser.username, invalidUser.password);
    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getErrorText()).toContain('do not match');
  });

  test('empty username and password shows required-field error', async ({ loginPage }) => {
    await loginPage.loginButton.click();
    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getErrorText()).toContain('Username is required');
  });

  test('empty password shows required-field error', async ({ loginPage }) => {
    await loginPage.usernameInput.fill(users.standard.username);
    await loginPage.loginButton.click();
    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getErrorText()).toContain('Password is required');
  });

  // This test needs to start already logged in, then verify logout — a
  // perfect case for the `loggedInPage` fixture plus the `menu` fixture.
  test('logged in user can log out via menu', async ({ loggedInPage, menu, loginPage, page }) => {
    await expect(page).toHaveURL(/inventory.html/);

    await menu.logout();
    await expect(page).toHaveURL(/saucedemo.com\/$/);
    await expect(loginPage.usernameInput).toBeVisible();
  });

  test('session is invalidated after logout', async ({ loggedInPage, menu, page }) => {
    // Verify logged in
    await expect(page).toHaveURL(/inventory.html/);
    
    // Log out
    await menu.logout();
    await expect(page).toHaveURL(/saucedemo.com\/$/);
    
    // Try to navigate directly to /inventory.html — should redirect to login
    await page.goto('/inventory.html');
    await expect(page).toHaveURL(/saucedemo.com\/$/); // Should be redirected back to login
  });

  test('problem_user can log in successfully', async ({ loginPage, page }) => {
    await loginPage.login(users.problem.username, users.problem.password);
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('performance_glitch_user can log in (with extended load time)', async ({ loginPage, page }) => {
    await loginPage.login(users.performanceGlitch.username, users.performanceGlitch.password);
    // This user is known to have slower page loads, so we use a longer timeout
    await expect(page).toHaveURL(/inventory.html/, { timeout: 30_000 });
  });

  test('error_user can log in successfully', async ({ loginPage, page }) => {
    await loginPage.login(users.errorProne.username, users.errorProne.password);
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('visual_user can log in successfully', async ({ loginPage, page }) => {
    await loginPage.login(users.visual.username, users.visual.password);
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('username is case-sensitive', async ({ loginPage }) => {
    // Try uppercase version of standard_user
    const uppercaseUsername = users.standard.username.toUpperCase();
    await loginPage.login(uppercaseUsername, users.standard.password);
    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getErrorText()).toContain('do not match');
  });

  test('username with leading/trailing whitespace fails or trims', async ({ loginPage, page }) => {
    // This test documents actual behavior — some apps reject, some trim
    const usernameWithSpaces = `  ${users.standard.username}  `;
    await loginPage.login(usernameWithSpaces, users.standard.password);
    
    // SauceDemo likely rejects this or doesn't trim, so we expect error
    if (await loginPage.errorMessage.isVisible()) {
      expect(await loginPage.getErrorText()).toContain('do not match');
    } else {
      // If it logs in (app trims), verify inventory page
      await expect(page).toHaveURL(/inventory.html/);
    }
  });
});
