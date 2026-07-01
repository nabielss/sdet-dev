import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";

test.describe("SauceDemo Smoke Test - Purchase Flow", () => {
  test("user can login, add product to cart, and complete checkout", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // 1. Login
    await loginPage.goto();
    await loginPage.login("standard_user", "secret_sauce");
    await expect(page).toHaveURL(/inventory.html/);

    // 2. Add product to cart
    await inventoryPage.addProductToCart("Sauce Labs Backpack");
    await expect(inventoryPage.cartBadge).toHaveText("1");

    // 3. Go to cart and verify item is there
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart.html/);
    await expect(page.getByText("Sauce Labs Backpack")).toBeVisible();

    // 4. Proceed to checkout
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one.html/);

    // 5. Fill shipping info
    await checkoutPage.fillShippingInfo("John", "Doe", "12345");
    await expect(page).toHaveURL(/checkout-step-two.html/);

    // 6. Finish order
    await checkoutPage.finishOrder();
    await expect(page).toHaveURL(/checkout-complete.html/);
    await expect(checkoutPage.completeHeader).toHaveText(
      "Thank you for your order!",
    );
  });
});
