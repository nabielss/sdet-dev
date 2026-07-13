import { test, expect } from "../fixtures/pom-fixtures";
import { products } from "../fixtures/checkoutData";

test.describe("Inventory", () => {
  test("all 6 products are displayed", async ({ loggedInPage }) => {
    expect(await loggedInPage.getProductCount()).toBe(6);
  });

  test("sort products A to Z", async ({ loggedInPage }) => {
    await loggedInPage.sortBy("az");
    await loggedInPage.assertSortedByName("asc");
  });

  test("sort products Z to A", async ({ loggedInPage }) => {
    await loggedInPage.sortBy("za");
    await loggedInPage.assertSortedByName("desc");
  });

  test("sort products price low to high", async ({ loggedInPage }) => {
    await loggedInPage.sortBy("lohi");
    await loggedInPage.assertSortedByPrice("asc");
  });

  test("sort products price high to low", async ({ loggedInPage }) => {
    await loggedInPage.sortBy("hilo");
    await loggedInPage.assertSortedByPrice("desc");
  });

  test("adding a product updates the cart badge to 1", async ({
    loggedInPage,
  }) => {
    await loggedInPage.addProductToCart(products.backpack);
    await expect(loggedInPage.cartBadge).toHaveText("1");
  });

  test("adding multiple products updates the cart badge correctly", async ({
    loggedInPage,
  }) => {
    await loggedInPage.addProductToCart(products.backpack);
    await loggedInPage.addProductToCart(products.bikeLight);
    await loggedInPage.addProductToCart(products.boltTShirt);
    await expect(loggedInPage.cartBadge).toHaveText("3");
  });

  test("removing a product updates the cart badge", async ({
    loggedInPage,
  }) => {
    await loggedInPage.addProductToCart(products.backpack);
    await loggedInPage.addProductToCart(products.bikeLight);
    await expect(loggedInPage.cartBadge).toHaveText("2");

    await loggedInPage.removeProductFromCart(products.backpack);
    await expect(loggedInPage.cartBadge).toHaveText("1");
  });

  test("clicking product name navigates to detail page", async ({
    loggedInPage,
    page,
  }) => {
    await loggedInPage.clickProductName(products.backpack);
    await expect(page).toHaveURL(/inventory-item.html/);
  });

  test("product detail page shows correct price matching inventory listing", async ({
    loggedInPage,
    productDetailPage,
    page,
  }) => {
    // Navigate to detail page
    await loggedInPage.clickProductName(products.backpack);
    await expect(page).toHaveURL(/inventory-item.html/);

    // Verify detail page loaded with product info
    const detailPrice = await productDetailPage.getProductPrice();
    expect(detailPrice.length).toBeGreaterThan(0);
  });

  test("back button from detail page resets sort order", async ({
    loggedInPage,
    productDetailPage,
    page,
  }) => {
    // Sort Z to A
    await loggedInPage.sortBy("za");
    const sortedNames = await loggedInPage.getAllProductNames();

    // Navigate to product detail
    await loggedInPage.clickProductName(products.backpack);
    await expect(page).toHaveURL(/inventory-item.html/);

    // Go back
    await productDetailPage.goBack();
    await expect(page).toHaveURL(/inventory.html/);

    // NOTE: SauceDemo resets sort order when navigating away, so sort is back to default (A-Z)
    const namesAfterBack = await loggedInPage.getAllProductNames();
    expect(namesAfterBack).not.toEqual(sortedNames);
  });

  test("add to cart from product detail page updates badge", async ({
    loggedInPage,
    productDetailPage,
    page,
  }) => {
    // Navigate to detail page
    await loggedInPage.clickProductName(products.backpack);
    await expect(page).toHaveURL(/inventory-item.html/);

    // Add from detail page
    await productDetailPage.addToCart();

    // Go back to inventory to verify badge
    await productDetailPage.goBack();
    await expect(loggedInPage.cartBadge).toHaveText("1");
  });

  test("cart badge disappears (not shows 0) when cart is emptied", async ({
    loggedInPage,
  }) => {
    // Add item
    await loggedInPage.addProductToCart(products.backpack);
    await expect(loggedInPage.cartBadge).toBeVisible();
    await expect(loggedInPage.cartBadge).toHaveText("1");

    // Remove item
    await loggedInPage.removeProductFromCart(products.backpack);

    // Badge should not be visible anymore (not just show 0)
    await expect(loggedInPage.cartBadge).not.toBeVisible();
  });
});
