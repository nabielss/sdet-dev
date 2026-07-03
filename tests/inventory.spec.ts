import { test, expect } from '../fixtures/pom-fixtures';
import { products } from '../fixtures/checkoutData';

test.describe('Inventory', () => {
  test('all 6 products are displayed', async ({ loggedInPage }) => {
    expect(await loggedInPage.getProductCount()).toBe(6);
  });

  test('sort products A to Z', async ({ loggedInPage }) => {
    await loggedInPage.sortBy('az');
    await loggedInPage.assertSortedByName('asc');
  });

  test('sort products Z to A', async ({ loggedInPage }) => {
    await loggedInPage.sortBy('za');
    await loggedInPage.assertSortedByName('desc');
  });

  test('sort products price low to high', async ({ loggedInPage }) => {
    await loggedInPage.sortBy('lohi');
    await loggedInPage.assertSortedByPrice('asc');
  });

  test('sort products price high to low', async ({ loggedInPage }) => {
    await loggedInPage.sortBy('hilo');
    await loggedInPage.assertSortedByPrice('desc');
  });

  test('adding a product updates the cart badge to 1', async ({ loggedInPage }) => {
    await loggedInPage.addProductToCart(products.backpack);
    await expect(loggedInPage.cartBadge).toHaveText('1');
  });

  test('adding multiple products updates the cart badge correctly', async ({ loggedInPage }) => {
    await loggedInPage.addProductToCart(products.backpack);
    await loggedInPage.addProductToCart(products.bikeLight);
    await loggedInPage.addProductToCart(products.boltTShirt);
    await expect(loggedInPage.cartBadge).toHaveText('3');
  });

  test('removing a product updates the cart badge', async ({ loggedInPage }) => {
    await loggedInPage.addProductToCart(products.backpack);
    await loggedInPage.addProductToCart(products.bikeLight);
    await expect(loggedInPage.cartBadge).toHaveText('2');

    await loggedInPage.removeProductFromCart(products.backpack);
    await expect(loggedInPage.cartBadge).toHaveText('1');
  });
});