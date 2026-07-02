import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { users } from "../fixtures/users";

test.describe("Inventory", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory.html/);
  });

  test("all 6 products are displayed", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    expect(await inventoryPage.getProductCount()).toBe(6);
  });

  test("sort products A to Z", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortBy("az");
    const names = await inventoryPage.getAllProductNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test("sort products Z to A", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortBy("za");
    const names = await inventoryPage.getAllProductNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test("sort products price low to high", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortBy("lohi");
    const prices = await inventoryPage.getAllProductPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test("sort products price high to low", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortBy("hilo");
    const prices = await inventoryPage.getAllProductPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  test("adding a product updates the cart badge to 1", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addProductToCart("Sauce Labs Backpack");
    await expect(inventoryPage.cartBadge).toHaveText("1");
  });

  test("adding multiple products updates the cart badge correctly", async ({
    page,
  }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addProductToCart("Sauce Labs Backpack");
    await inventoryPage.addProductToCart("Sauce Labs Bike Light");
    await inventoryPage.addProductToCart("Sauce Labs Bolt T-Shirt");
    await expect(inventoryPage.cartBadge).toHaveText("3");
  });

  test("removing a product updates the cart badge", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addProductToCart("Sauce Labs Backpack");
    await inventoryPage.addProductToCart("Sauce Labs Bike Light");
    await expect(inventoryPage.cartBadge).toHaveText("2");

    await inventoryPage.removeProductFromCart("Sauce Labs Backpack");
    await expect(inventoryPage.cartBadge).toHaveText("1");
  });
});
