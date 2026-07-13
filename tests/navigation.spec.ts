import { test, expect } from "../fixtures/pom-fixtures";

test.describe("Navigation & Menu", () => {
  test("all items link navigates to inventory from cart", async ({
    loggedInPage,
    page,
    menu,
  }) => {
    // Add item and go to cart
    await loggedInPage.addProductToCart("Sauce Labs Backpack");
    await loggedInPage.goToCart();
    await expect(page).toHaveURL(/cart.html/);

    // Open menu and click All Items
    await menu.open();
    await menu.allItemsLink.click();

    // Should navigate to inventory
    await expect(page).toHaveURL(/inventory.html/);
  });

  test("menu closes via close button", async ({ loggedInPage, menu }) => {
    // Open menu
    await menu.open();
    await expect(menu.closeButton).toBeVisible();

    // Close menu
    await menu.close();
    await expect(menu.closeButton).not.toBeVisible();
  });

  test("reset app state clears cart badge", async ({ loggedInPage, menu }) => {
    // Add items to cart
    await loggedInPage.addProductToCart("Sauce Labs Backpack");
    await loggedInPage.addProductToCart("Sauce Labs Bike Light");
    await expect(loggedInPage.cartBadge).toBeVisible();
    await expect(loggedInPage.cartBadge).toHaveText("2");

    // Open menu and wait for reset link to be visible before clicking
    await menu.open();
    await menu.resetLink.waitFor({ state: "visible" });
    await menu.resetLink.click();
    await menu.close();

    // Cart badge should be gone
    await expect(loggedInPage.cartBadge).not.toBeVisible();
  });
});
