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
});
