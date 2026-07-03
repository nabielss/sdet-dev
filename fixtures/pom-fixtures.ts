import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { MenuComponent } from '../pages/components/MenuComponent';
import { users } from './users';

type PomFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  menu: MenuComponent;
  loggedInPage: InventoryPage; // page object already past login, ready to use
};

export const test = base.extend<PomFixtures>({
  // Plain page object fixtures — instantiate once per test, no auto-behavior
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  menu: async ({ page }, use) => {
    await use(new MenuComponent(page));
  },

  // Composite fixture: performs login automatically, hands back InventoryPage
  // ready to use. Any test that requests `loggedInPage` skips writing its own
  // goto()/login() boilerplate entirely.
  // Also includes automatic teardown: resets the app state after each test
  // so the next test starts with a clean cart — no `afterEach` boilerplate needed.
  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);

    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);

    // Teardown: reset app state so the next test starts clean.
    // Only runs if the menu button is still visible (i.e. user is still logged in).
    // Uses a quick 1s timeout to avoid hanging on tests that log out.
    // Tests that log out (e.g. auth logout test) won't trigger this teardown.
    const menu = new MenuComponent(page);
    if (await menu.menuButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await menu.resetAppState();
    }
  },
});

export { expect } from '@playwright/test';