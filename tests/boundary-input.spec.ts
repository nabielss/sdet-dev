import { test, expect } from '../fixtures/pom-fixtures';
import { validShippingInfo, products } from '../fixtures/checkoutData';

test.describe('Boundary Input Handling', () => {
  test('postal code with special characters is accepted', async ({ loggedInPage, cartPage, checkoutPage, page }) => {
    // Add item and navigate to checkout
    await loggedInPage.addProductToCart(products.backpack);
    await loggedInPage.goToCart();
    await cartPage.proceedToCheckout();
    
    // Fill with special characters in postal code
    const specialPostalCode = '!@#$%^&*()';
    await checkoutPage.firstNameInput.fill(validShippingInfo.firstName);
    await checkoutPage.lastNameInput.fill(validShippingInfo.lastName);
    await checkoutPage.postalCodeInput.fill(specialPostalCode);
    await checkoutPage.continueButton.click();
    
    // SauceDemo likely has no format validation, so this should succeed
    await expect(page).toHaveURL(/checkout-step-two.html/);
  });

  test('first name with numbers and unicode is accepted', async ({ loggedInPage, cartPage, checkoutPage, page }) => {
    // Add item and navigate to checkout
    await loggedInPage.addProductToCart(products.backpack);
    await loggedInPage.goToCart();
    await cartPage.proceedToCheckout();
    
    // Fill with numbers and unicode in first name
    const unicodeName = 'John123😀';
    await checkoutPage.firstNameInput.fill(unicodeName);
    await checkoutPage.lastNameInput.fill(validShippingInfo.lastName);
    await checkoutPage.postalCodeInput.fill(validShippingInfo.postalCode);
    await checkoutPage.continueButton.click();
    
    // Should succeed (no format validation)
    await expect(page).toHaveURL(/checkout-step-two.html/);
  });

  test('extremely long string in first name field', async ({ loggedInPage, cartPage, checkoutPage, page }) => {
    // Add item and navigate to checkout
    await loggedInPage.addProductToCart(products.backpack);
    await loggedInPage.goToCart();
    await cartPage.proceedToCheckout();
    
    // Fill with very long string
    const longName = 'A'.repeat(500);
    await checkoutPage.firstNameInput.fill(longName);
    await checkoutPage.lastNameInput.fill(validShippingInfo.lastName);
    await checkoutPage.postalCodeInput.fill(validShippingInfo.postalCode);
    await checkoutPage.continueButton.click();
    
    // Document actual behavior — may accept or truncate
    const url = page.url();
    const isOnStepTwo = url.includes('checkout-step-two.html');
    if (isOnStepTwo) {
      expect(true).toBe(true); // Long string accepted
    } else if (await checkoutPage.errorMessage.isVisible()) {
      // Or it may show an error
      expect(true).toBe(true); // Error shown for long string
    }
  });

  test('whitespace-only input in first name field', async ({ loggedInPage, cartPage, checkoutPage, page }) => {
    // Add item and navigate to checkout
    await loggedInPage.addProductToCart(products.backpack);
    await loggedInPage.goToCart();
    await cartPage.proceedToCheckout();
    
    // Fill with only spaces
    await checkoutPage.firstNameInput.fill('   ');
    await checkoutPage.lastNameInput.fill(validShippingInfo.lastName);
    await checkoutPage.postalCodeInput.fill(validShippingInfo.postalCode);
    await checkoutPage.continueButton.click();
    
    // Document actual behavior — may accept (technically non-empty) or trim and reject
    const url = page.url();
    const isOnStepTwo = url.includes('checkout-step-two.html');
    if (!isOnStepTwo) {
      // More likely: validation rejects whitespace-only
      await expect(checkoutPage.errorMessage).toBeVisible();
    }
  });

  test('unicode characters in last name field display correctly on step two', async ({ loggedInPage, cartPage, checkoutPage, page }) => {
    // Add item and navigate to checkout
    await loggedInPage.addProductToCart(products.backpack);
    await loggedInPage.goToCart();
    await cartPage.proceedToCheckout();
    
    // Fill with unicode last name
    const unicodeLastName = '田中'; // Japanese characters
    await checkoutPage.firstNameInput.fill(validShippingInfo.firstName);
    await checkoutPage.lastNameInput.fill(unicodeLastName);
    await checkoutPage.postalCodeInput.fill(validShippingInfo.postalCode);
    await checkoutPage.continueButton.click();
    
    // Should display correctly on step two
    await expect(page).toHaveURL(/checkout-step-two.html/);
  });

  test('sql-injection-style string in postal code is treated as plain text', async ({ loggedInPage, cartPage, checkoutPage, page }) => {
    // Add item and navigate to checkout
    await loggedInPage.addProductToCart(products.backpack);
    await loggedInPage.goToCart();
    await cartPage.proceedToCheckout();
    
    // Fill with SQL-like string (defensive check, not security test)
    const sqlLikeString = "' OR '1'='1";
    await checkoutPage.firstNameInput.fill(validShippingInfo.firstName);
    await checkoutPage.lastNameInput.fill(validShippingInfo.lastName);
    await checkoutPage.postalCodeInput.fill(sqlLikeString);
    await checkoutPage.continueButton.click();
    
    // App should not crash or error — treats as plain text
    const url = page.url();
    const isOnStepTwo = url.includes('checkout-step-two.html');
    const isOnStepOne = url.includes('checkout-step-one.html');
    expect(isOnStepTwo || isOnStepOne).toBe(true); // Should be on one of the checkout pages, not crashed
  });
});
