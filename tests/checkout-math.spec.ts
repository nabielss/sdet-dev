import { test, expect } from '../fixtures/pom-fixtures';
import { products, validShippingInfo } from '../fixtures/checkoutData';

test.describe('Checkout Math Verification', () => {
  // Helper to get numeric value from price strings like "$29.99"
  const getPriceNumber = (priceStr: string): number => {
    return parseFloat(priceStr.replace('$', ''));
  };

  // Helper to extract numeric value from total labels like "Item total: $29.99"
  const extractAmount = (labelStr: string): number => {
    const match = labelStr.match(/\$[\d.]+/);
    if (!match) return 0;
    return parseFloat(match[0].replace('$', ''));
  };

  test('single item total math correct — Sauce Labs Backpack', async ({ loggedInPage, cartPage, checkoutPage, page }) => {
    // Add backpack and go to checkout step two
    await loggedInPage.addProductToCart(products.backpack);
    await loggedInPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo(validShippingInfo.firstName, validShippingInfo.lastName, validShippingInfo.postalCode);
    
    // Get amounts
    const itemTotalText = await checkoutPage.getItemTotal();
    const taxText = await checkoutPage.getTaxAmount();
    const totalText = await checkoutPage.getTotalAmount();
    
    const itemTotal = extractAmount(itemTotalText);
    const tax = extractAmount(taxText);
    const total = extractAmount(totalText);
    
    // Verify math: total = itemTotal + tax
    expect(total).toBeCloseTo(itemTotal + tax, 2);
  });

  test('single item total math correct — Sauce Labs Bike Light', async ({ loggedInPage, cartPage, checkoutPage, page }) => {
    // Add bike light and go to checkout step two
    await loggedInPage.addProductToCart(products.bikeLight);
    await loggedInPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo(validShippingInfo.firstName, validShippingInfo.lastName, validShippingInfo.postalCode);
    
    // Get amounts
    const itemTotalText = await checkoutPage.getItemTotal();
    const taxText = await checkoutPage.getTaxAmount();
    const totalText = await checkoutPage.getTotalAmount();
    
    const itemTotal = extractAmount(itemTotalText);
    const tax = extractAmount(taxText);
    const total = extractAmount(totalText);
    
    // Verify math
    expect(total).toBeCloseTo(itemTotal + tax, 2);
  });

  test('single item total math correct — Sauce Labs Bolt T-Shirt', async ({ loggedInPage, cartPage, checkoutPage, page }) => {
    // Add bolt t-shirt and go to checkout step two
    await loggedInPage.addProductToCart(products.boltTShirt);
    await loggedInPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo(validShippingInfo.firstName, validShippingInfo.lastName, validShippingInfo.postalCode);
    
    // Get amounts
    const itemTotalText = await checkoutPage.getItemTotal();
    const taxText = await checkoutPage.getTaxAmount();
    const totalText = await checkoutPage.getTotalAmount();
    
    const itemTotal = extractAmount(itemTotalText);
    const tax = extractAmount(taxText);
    const total = extractAmount(totalText);
    
    // Verify math
    expect(total).toBeCloseTo(itemTotal + tax, 2);
  });

  test('single item total math correct — Sauce Labs Fleece Jacket', async ({ loggedInPage, cartPage, checkoutPage, page }) => {
    // Add fleece jacket and go to checkout step two
    await loggedInPage.addProductToCart(products.fleeceJacket);
    await loggedInPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo(validShippingInfo.firstName, validShippingInfo.lastName, validShippingInfo.postalCode);
    
    // Get amounts
    const itemTotalText = await checkoutPage.getItemTotal();
    const taxText = await checkoutPage.getTaxAmount();
    const totalText = await checkoutPage.getTotalAmount();
    
    const itemTotal = extractAmount(itemTotalText);
    const tax = extractAmount(taxText);
    const total = extractAmount(totalText);
    
    // Verify math
    expect(total).toBeCloseTo(itemTotal + tax, 2);
  });

  test('single item total math correct — Sauce Labs Onesie', async ({ loggedInPage, cartPage, checkoutPage, page }) => {
    // Add onesie and go to checkout step two
    await loggedInPage.addProductToCart(products.onesie);
    await loggedInPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo(validShippingInfo.firstName, validShippingInfo.lastName, validShippingInfo.postalCode);
    
    // Get amounts
    const itemTotalText = await checkoutPage.getItemTotal();
    const taxText = await checkoutPage.getTaxAmount();
    const totalText = await checkoutPage.getTotalAmount();
    
    const itemTotal = extractAmount(itemTotalText);
    const tax = extractAmount(taxText);
    const total = extractAmount(totalText);
    
    // Verify math
    expect(total).toBeCloseTo(itemTotal + tax, 2);
  });

  test('single item total math correct — Test.allTheThings() T-Shirt', async ({ loggedInPage, cartPage, checkoutPage, page }) => {
    // Add test.allThethings t-shirt and go to checkout step two
    await loggedInPage.addProductToCart(products.testAllTheThings);
    await loggedInPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo(validShippingInfo.firstName, validShippingInfo.lastName, validShippingInfo.postalCode);
    
    // Get amounts
    const itemTotalText = await checkoutPage.getItemTotal();
    const taxText = await checkoutPage.getTaxAmount();
    const totalText = await checkoutPage.getTotalAmount();
    
    const itemTotal = extractAmount(itemTotalText);
    const tax = extractAmount(taxText);
    const total = extractAmount(totalText);
    
    // Verify math
    expect(total).toBeCloseTo(itemTotal + tax, 2);
  });

  test('multi-item cart total math correct', async ({ loggedInPage, cartPage, checkoutPage, page }) => {
    // Add 3 items
    await loggedInPage.addProductToCart(products.backpack);
    await loggedInPage.addProductToCart(products.bikeLight);
    await loggedInPage.addProductToCart(products.boltTShirt);
    
    // Go to checkout step two
    await loggedInPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo(validShippingInfo.firstName, validShippingInfo.lastName, validShippingInfo.postalCode);
    
    // Get amounts
    const itemTotalText = await checkoutPage.getItemTotal();
    const taxText = await checkoutPage.getTaxAmount();
    const totalText = await checkoutPage.getTotalAmount();
    
    const itemTotal = extractAmount(itemTotalText);
    const tax = extractAmount(taxText);
    const total = extractAmount(totalText);
    
    // Verify math: total = itemTotal + tax
    expect(total).toBeCloseTo(itemTotal + tax, 2);
    
    // Verify item total > 0 (more than one item)
    expect(itemTotal).toBeGreaterThan(20);
  });
});
