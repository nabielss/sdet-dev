import { test, expect } from "../fixtures/pom-fixtures";
import { products, validShippingInfo } from "../fixtures/checkoutData";

test.describe("Checkout", () => {
  test("empty first name shows validation error", async ({
    loggedInPage,
    cartPage,
    checkoutPage,
    page,
  }) => {
    // Add item and navigate to checkout
    await loggedInPage.addProductToCart(products.backpack);
    await loggedInPage.goToCart();
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one.html/);

    // Leave first name empty, fill other fields
    await checkoutPage.lastNameInput.fill(validShippingInfo.lastName);
    await checkoutPage.postalCodeInput.fill(validShippingInfo.postalCode);
    await checkoutPage.continueButton.click();

    // Should show error
    await expect(checkoutPage.errorMessage).toBeVisible();
    const errorText = await checkoutPage.getErrorText();
    expect(errorText).toContain("First Name is required");
  });

  test("empty last name shows validation error", async ({
    loggedInPage,
    cartPage,
    checkoutPage,
    page,
  }) => {
    // Add item and navigate to checkout
    await loggedInPage.addProductToCart(products.backpack);
    await loggedInPage.goToCart();
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one.html/);

    // Leave last name empty, fill other fields
    await checkoutPage.firstNameInput.fill(validShippingInfo.firstName);
    await checkoutPage.postalCodeInput.fill(validShippingInfo.postalCode);
    await checkoutPage.continueButton.click();

    // Should show error
    await expect(checkoutPage.errorMessage).toBeVisible();
    const errorText = await checkoutPage.getErrorText();
    expect(errorText).toContain("Last Name is required");
  });

  test("empty postal code shows validation error", async ({
    loggedInPage,
    cartPage,
    checkoutPage,
    page,
  }) => {
    // Add item and navigate to checkout
    await loggedInPage.addProductToCart(products.backpack);
    await loggedInPage.goToCart();
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one.html/);

    // Leave postal code empty, fill other fields
    await checkoutPage.firstNameInput.fill(validShippingInfo.firstName);
    await checkoutPage.lastNameInput.fill(validShippingInfo.lastName);
    await checkoutPage.continueButton.click();

    // Should show error
    await expect(checkoutPage.errorMessage).toBeVisible();
    const errorText = await checkoutPage.getErrorText();
    expect(errorText).toContain("Postal Code is required");
  });

  test("cancel on step one returns to cart", async ({
    loggedInPage,
    cartPage,
    checkoutPage,
    page,
  }) => {
    // Add item and navigate to checkout
    await loggedInPage.addProductToCart(products.backpack);
    await loggedInPage.goToCart();
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one.html/);

    // Click cancel
    await checkoutPage.cancel();

    // Should return to cart
    await expect(page).toHaveURL(/cart.html/);
  });

  test("cancel on step two returns to inventory", async ({
    loggedInPage,
    cartPage,
    checkoutPage,
    page,
  }) => {
    // Add item and proceed to checkout step two
    await loggedInPage.addProductToCart(products.backpack);
    await loggedInPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo(
      validShippingInfo.firstName,
      validShippingInfo.lastName,
      validShippingInfo.postalCode,
    );
    await expect(page).toHaveURL(/checkout-step-two.html/);

    // Click cancel
    await checkoutPage.cancel();

    // Should return to inventory
    await expect(page).toHaveURL(/inventory.html/);
  });

  test("finish button completes order and shows confirmation", async ({
    loggedInPage,
    cartPage,
    checkoutPage,
    page,
  }) => {
    // Complete full checkout flow
    await loggedInPage.addProductToCart(products.backpack);
    await loggedInPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo(
      validShippingInfo.firstName,
      validShippingInfo.lastName,
      validShippingInfo.postalCode,
    );

    // Click finish
    await checkoutPage.finishOrder();

    // Should show confirmation page
    await expect(page).toHaveURL(/checkout-complete.html/);
    await expect(checkoutPage.completeHeader).toContainText(
      "Thank you for your order!",
    );
  });

  test("back home from confirmation returns to inventory and empties cart", async ({
    loggedInPage,
    cartPage,
    checkoutPage,
    page,
  }) => {
    // Complete full checkout flow
    await loggedInPage.addProductToCart(products.backpack);
    await loggedInPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo(
      validShippingInfo.firstName,
      validShippingInfo.lastName,
      validShippingInfo.postalCode,
    );
    await checkoutPage.finishOrder();
    await expect(page).toHaveURL(/checkout-complete.html/);

    // Click back home
    await checkoutPage.backHome();

    // Should return to inventory
    await expect(page).toHaveURL(/inventory.html/);

    // Cart should be emptied (badge not visible)
    await expect(loggedInPage.cartBadge).not.toBeVisible();
  });
});
