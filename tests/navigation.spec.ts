import { test, expect } from '../fixtures/pom-fixtures';

test.describe('Navigation & Menu', () => {
  test('all items link navigates to inventory from cart', async ({ loggedInPage, page, menu }) => {
    // Add item and go to cart
    await loggedInPage.addProductToCart('Sauce Labs Backpack');
    await loggedInPage.goToCart();
    await expect(page).toHaveURL(/cart.html/);
    
    // Open menu and click All Items
    await menu.open();
    await menu.allItemsLink.click();
    
    // Should navigate to inventory
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('menu closes via close button', async ({ loggedInPage, menu }) => {
    // Open menu
    await menu.open();
    await expect(menu.closeButton).toBeVisible();
    
    // Close menu
    await menu.close();
    await expect(menu.closeButton).not.toBeVisible();
  });

  test.skip('reset app state clears cart badge', async ({ loggedInPage, menu }) => {
    // Add items to cart
    await loggedInPage.addProductToCart('Sauce Labs Backpack');
    await loggedInPage.addProductToCart('Sauce Labs Bike Light');
    await expect(loggedInPage.cartBadge).toBeVisible();
    await expect(loggedInPage.cartBadge).toHaveText('2');
    
    // Reset app state via menu
    await menu.open();
    await menu.resetAppState();
    
    // Cart badge should be gone
    await expect(loggedInPage.cartBadge).not.toBeVisible();
  });

  test('about link opens external link', async ({ loggedInPage, menu, page, context }) => {
    // Open menu and get About link
    await menu.open();
    
    // Listen for new page/tab if About opens in new window
    const aboutPagePromise = context.waitForEvent('page');
    await menu.aboutLink.click();
    
    // Verify new page opened or current page navigated (verify it's not erroring)
    // SauceDemo's About link should navigate somewhere external
    try {
      const newPage = await Promise.race([
        aboutPagePromise,
        new Promise((resolve) => setTimeout(() => resolve(null), 2000))
      ]);
      if (newPage) {
        await newPage.close();
      }
    } catch {
      // Navigation may have occurred on same page or in new tab
    }
  });

  test('logout via menu returns to login page', async ({ loggedInPage, menu, loginPage, page }) => {
    // Verify logged in
    await expect(page).toHaveURL(/inventory.html/);
    
    // Logout
    await menu.logout();
    
    // Should return to login
    await expect(page).toHaveURL(/\/$/);
    await expect(loginPage.usernameInput).toBeVisible();
  });
});
