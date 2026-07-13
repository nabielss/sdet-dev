import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { MenuComponent } from '../pages/components/MenuComponent';
import { users } from './users';

type PomFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  productDetailPage: ProductDetailPage;
  menu: MenuComponent;
  loggedInPage: InventoryPage; // page object already past login, ready to use
  loggedInAsProblemUser: InventoryPage;
  loggedInAsErrorUser: InventoryPage;
  loggedInAsVisualUser: InventoryPage;
  loggedInAsPerformanceUser: InventoryPage;
  cartWithItems: { inventoryPage: InventoryPage; cartPage: CartPage };
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

  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
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

  // User-specific login fixtures for alternate user types
  loggedInAsProblemUser: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.problem.username, users.problem.password);

    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);

    const menu = new MenuComponent(page);
    if (await menu.menuButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await menu.resetAppState();
    }
  },

  loggedInAsErrorUser: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.errorProne.username, users.errorProne.password);

    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);

    const menu = new MenuComponent(page);
    if (await menu.menuButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await menu.resetAppState();
    }
  },

  loggedInAsVisualUser: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.visual.username, users.visual.password);

    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);

    const menu = new MenuComponent(page);
    if (await menu.menuButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await menu.resetAppState();
    }
  },

  loggedInAsPerformanceUser: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.performanceGlitch.username, users.performanceGlitch.password);

    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);

    const menu = new MenuComponent(page);
    if (await menu.menuButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await menu.resetAppState();
    }
  },

  // Composite fixture: logs in standard user, adds 2 items to cart, provides both pages
  cartWithItems: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');

    const cartPage = new CartPage(page);
    await use({ inventoryPage, cartPage });

    const menu = new MenuComponent(page);
    if (await menu.menuButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await menu.resetAppState();
    }
  },
});

export { expect } from '@playwright/test';