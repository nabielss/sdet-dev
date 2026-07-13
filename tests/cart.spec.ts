import { test, expect } from '../fixtures/pom-fixtures';
import { products, validShippingInfo } from '../fixtures/checkoutData';

test.describe('Cart', () => {
  test('cart page lists correct item names and prices', async ({ cartWithItems, page }) => {
    const { inventoryPage, cartPage } = cartWithItems;
    
    // Navigate to cart
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart.html/);
    
    // Verify item names
    const cartItemNames = await cartPage.getCartItemNames();
    expect(cartItemNames).toContain(products.backpack);
    expect(cartItemNames).toContain(products.bikeLight);
    expect(cartItemNames.length).toBe(2);
  });

  test('remove item from cart updates list and badge', async ({ cartWithItems, page }) => {
    const { inventoryPage, cartPage } = cartWithItems;
    
    // Navigate to cart
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart.html/);
    
    // Verify 2 items in cart
    let itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(2);
    
    // Remove one item
    await cartPage.removeItem(products.backpack);
    
    // Verify only 1 item left
    itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(1);
    
    // Verify badge shows 1
    await inventoryPage.goToCart(); // In case page refreshed
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('continue shopping button returns to inventory', async ({ cartWithItems, page }) => {
    const { inventoryPage, cartPage } = cartWithItems;
    
    // Navigate to cart
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart.html/);
    
    // Click continue shopping
    await cartPage.continueShoppingClick();
    
    // Should be back on inventory
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('checkout button navigates to step one', async ({ cartWithItems, page }) => {
    const { inventoryPage, cartPage } = cartWithItems;
    
    // Navigate to cart
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart.html/);
    
    // Click checkout
    await cartPage.proceedToCheckout();
    
    // Should navigate to checkout step one
    await expect(page).toHaveURL(/checkout-step-one.html/);
  });

  test('cart item price matches inventory listing price', async ({ loggedInPage, cartPage, page }) => {
    // Get price from inventory
    const listingPrice = await loggedInPage.getProductPrice(products.backpack);
    
    // Add to cart and navigate to cart
    await loggedInPage.addProductToCart(products.backpack);
    await loggedInPage.goToCart();
    await expect(page).toHaveURL(/cart.html/);
    
    // Get price from cart
    const cartPrice = await cartPage.getItemPrice(products.backpack);
    
    // Verify prices match
    expect(cartPrice).toContain(listingPrice.replace('$', ''));
  });

  test('cart persists after page reload', async ({ loggedInPage, page }) => {
    // Add item
    await loggedInPage.addProductToCart(products.backpack);
    await expect(loggedInPage.cartBadge).toHaveText('1');
    
    // Reload page
    await page.reload();
    
    // Verify item still in cart
    await expect(loggedInPage.cartBadge).toHaveText('1');
  });

  test('multiple items in cart have correct total count', async ({ loggedInPage, cartPage, page }) => {
    // Add 3 items
    await loggedInPage.addProductToCart(products.backpack);
    await loggedInPage.addProductToCart(products.bikeLight);
    await loggedInPage.addProductToCart(products.boltTShirt);
    
    // Navigate to cart
    await loggedInPage.goToCart();
    await expect(page).toHaveURL(/cart.html/);
    
    // Verify cart item count
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(3);
  });

  // TC0030: Checkout with empty cart
  test('checkout with empty cart — documents actual app behavior', async ({ loggedInPage, cartPage, page }) => {
    // Go directly to cart without adding any items
    await loggedInPage.goToCart();
    await expect(page).toHaveURL(/cart.html/);

    // Verify cart is empty
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(0);

    // Click checkout — SauceDemo allows proceeding with an empty cart
    await cartPage.proceedToCheckout();

    // Document actual behavior: app proceeds to step one regardless
    await expect(page).toHaveURL(/checkout-step-one.html/);
  });
});
