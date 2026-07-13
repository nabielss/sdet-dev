import { test, expect } from '@playwright/test';

test.describe('Unauthorized Access', () => {
  test('direct navigation to inventory without login redirects to login', async ({ page }) => {
    // Navigate directly to inventory without logging in
    await page.goto('/inventory.html');
    
    // Should redirect to login page
    await expect(page).toHaveURL(/saucedemo.com\/$/);
  });

  test('direct navigation to cart without login redirects to login', async ({ page }) => {
    // Navigate directly to cart without logging in
    await page.goto('/cart.html');
    
    // Should redirect to login page
    await expect(page).toHaveURL(/saucedemo.com\/$/);
  });

  test('direct navigation to checkout step one without login redirects to login', async ({ page }) => {
    // Navigate directly to checkout step one without logging in
    await page.goto('/checkout-step-one.html');
    
    // Should redirect to login page
    await expect(page).toHaveURL(/saucedemo.com\/$/);
  });

  test('direct navigation to checkout step two without login redirects to login', async ({ page }) => {
    // Navigate directly to checkout step two without logging in
    await page.goto('/checkout-step-two.html');
    
    // Should redirect to login page
    await expect(page).toHaveURL(/saucedemo.com\/$/);
  });

  test('direct navigation to checkout complete without login redirects to login', async ({ page }) => {
    // Navigate directly to checkout complete without logging in
    await page.goto('/checkout-complete.html');
    
    // Should redirect to login page
    await expect(page).toHaveURL(/saucedemo.com\/$/);
  });
});
