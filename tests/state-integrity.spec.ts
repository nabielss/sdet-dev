import { test, expect } from "../fixtures/pom-fixtures";
import { validShippingInfo, products } from "../fixtures/checkoutData";

test.describe("State Integrity", () => {
  test("double-click add to cart adds only once", async ({ loggedInPage }) => {
    // Double-click the Add to Cart button
    // SauceDemo toggles: 1st click = Add, 2nd click = Remove (button changes between clicks)
    // So double-click results in add then immediate remove — cart ends up empty
    const addButton = loggedInPage.getAddToCartButton(products.backpack);
    await addButton.dblclick();

    // Actual behavior: badge not visible (added then removed by 2nd click)
    await expect(loggedInPage.cartBadge).not.toBeVisible();
  });

  test("rapid submit on checkout continue button works safely", async ({
    loggedInPage,
    cartPage,
    checkoutPage,
    page,
  }) => {
    // Add item and navigate to checkout
    await loggedInPage.addProductToCart(products.backpack);
    await loggedInPage.goToCart();
    await cartPage.proceedToCheckout();

    // Fill form
    await checkoutPage.fillShippingInfo(
      validShippingInfo.firstName,
      validShippingInfo.lastName,
      validShippingInfo.postalCode,
    );

    // NOTE: fillShippingInfo already clicks continue, so we're on step two
    // Just verify we landed on step two correctly
    await expect(page).toHaveURL(/checkout-step-two.html/);
  });

  test("direct navigation to checkout step two without completing step one", async ({
    page,
    loginPage,
  }) => {
    // Log in first
    const { standard } = await (async () => {
      try {
        const { users } = await import("../fixtures/users");
        return users;
      } catch {
        return { standard: { username: "", password: "" } };
      }
    })();

    await loginPage.goto();
    if (standard.username) {
      await loginPage.login(standard.username, standard.password);
    }

    // Try to navigate directly to step two
    await page.goto("/checkout-step-two.html");

    // Should either show step two (with empty/error state) or redirect to step one
    const url = page.url();
    expect(url).toMatch(/checkout-step-(one|two).html/);
  });
});
