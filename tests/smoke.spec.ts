import { test, expect } from '../fixtures/pom-fixtures';
import { validShippingInfo, products } from '../fixtures/checkoutData';

test.describe('SauceDemo Smoke Test - Purchase Flow', () => {
  test('user can login, add product to cart, and complete checkout', async ({
    loggedInPage,
    cartPage,
    checkoutPage,
    page,
  }) => {
    await expect(page).toHaveURL(/inventory.html/);

    await loggedInPage.addProductToCart(products.backpack);
    await expect(loggedInPage.cartBadge).toHaveText('1');

    await loggedInPage.goToCart();
    await expect(page).toHaveURL(/cart.html/);
    await expect(page.getByText(products.backpack)).toBeVisible();

    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one.html/);

    await checkoutPage.fillShippingInfo(
      validShippingInfo.firstName,
      validShippingInfo.lastName,
      validShippingInfo.postalCode
    );
    await expect(page).toHaveURL(/checkout-step-two.html/);

    await checkoutPage.finishOrder();
    await expect(page).toHaveURL(/checkout-complete.html/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });
});