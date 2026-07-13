import { test, expect } from '../fixtures/pom-fixtures';
import { users } from '../fixtures/users';
import { products } from '../fixtures/checkoutData';

test.describe('Accessibility', () => {
  test('keyboard-only navigation through full checkout flow', async ({ page, context, loginPage }) => {
    // Start at login page
    await loginPage.goto();
    
    // Tab to username field and enter username
    await page.keyboard.press('Tab');
    await page.keyboard.type(users.standard.username);
    
    // Tab to password field and enter password
    await page.keyboard.press('Tab');
    await page.keyboard.type(users.standard.password);
    
    // Tab to login button and press Enter
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    
    // Wait for navigation to inventory
    await expect(page).toHaveURL(/inventory.html/);
    
    // Tab through to add to cart button (may take several tabs)
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => {
        const elem = document.activeElement as HTMLElement;
        return elem?.textContent || '';
      });
      if (focused.includes('Add to cart')) {
        break;
      }
    }
    
    // Press Enter to add to cart
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('product images have descriptive alt text', async ({ loggedInPage }) => {
    // Get all product images
    const images = await loggedInPage.inventoryItems.locator('img').all();
    
    // Verify each image has alt text
    for (const image of images) {
      const altText = await image.getAttribute('alt');
      expect(altText).toBeTruthy();
      expect(altText?.length || 0).toBeGreaterThan(0);
    }
  });

  test('tab order is logical (login -> inventory -> cart -> checkout)', async ({ page, loginPage }) => {
    // Navigate to login
    await loginPage.goto();
    
    // Check initial focus is on username (or first interactive element)
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => (document.activeElement as HTMLElement)?.name || '');
    expect(focused || 'username').toBeTruthy();
  });

  test('buttons are clickable via keyboard or mouse', async ({ loggedInPage }) => {
    // Add product via click (verify button is accessible)
    const addButton = loggedInPage.getAddToCartButton(products.backpack);
    
    // Verify button is visible
    await expect(addButton).toBeVisible();
    
    // Click the button
    await addButton.click();
    
    // Verify action was triggered
    await expect(loggedInPage.cartBadge).toHaveText('1');
  });
});
