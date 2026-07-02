import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { users } from "../fixtures/users";
import { validShippingInfo, sampleProduct } from "../fixtures/checkoutData";

test.describe("SauceDemo Smoke Test - Purchase Flow", () => {
  test("user can login, add product to cart, and complete checkout", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory.html/);

    await inventoryPage.addProductToCart(sampleProduct);
    await expect(inventoryPage.cartBadge).toHaveText("1");

    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart.html/);
    await expect(page.getByText(sampleProduct)).toBeVisible();

    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one.html/);

    await checkoutPage.fillShippingInfo(
      validShippingInfo.firstName,
      validShippingInfo.lastName,
      validShippingInfo.postalCode,
    );
    await expect(page).toHaveURL(/checkout-step-two.html/);

    await checkoutPage.finishOrder();
    await expect(page).toHaveURL(/checkout-complete.html/);
    await expect(checkoutPage.completeHeader).toHaveText(
      "Thank you for your order!",
    );
  });
});
