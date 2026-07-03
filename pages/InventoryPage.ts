import { Page, Locator, expect } from "@playwright/test";

export type SortOption = "az" | "za" | "lohi" | "hilo";

export class InventoryPage {
  readonly page: Page;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;
  readonly inventoryItems: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartLink = page.getByTestId("shopping-cart-link");
    this.cartBadge = page.getByTestId("shopping-cart-badge");
    this.sortDropdown = page.getByTestId("product-sort-container");
    this.inventoryItems = page.locator(".inventory_item");
    this.itemNames = page.locator(".inventory_item_name");
    this.itemPrices = page.locator(".inventory_item_price");
  }

  async addProductToCart(productName: string) {
    const productCard = this.page.locator(".inventory_item", {
      hasText: productName,
    });
    await productCard.getByRole("button", { name: "Add to cart" }).click();
  }

  async removeProductFromCart(productName: string) {
    const productCard = this.page.locator(".inventory_item", {
      hasText: productName,
    });
    await productCard.getByRole("button", { name: "Remove" }).click();
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async getProductCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  async sortBy(option: SortOption) {
    await this.sortDropdown.selectOption(option);
  }

  async getAllProductNames(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  async getAllProductPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((t) => parseFloat(t.replace("$", "")));
  }

  async assertSortedByName(order: "asc" | "desc") {
    const names = await this.getAllProductNames();
    const sorted = [...names].sort((a, b) =>
      order === "asc" ? a.localeCompare(b) : b.localeCompare(a),
    );
    expect(names).toEqual(sorted);
  }

  async assertSortedByPrice(order: "asc" | "desc") {
    const prices = await this.getAllProductPrices();
    const sorted = [...prices].sort((a, b) =>
      order === "asc" ? a - b : b - a,
    );
    expect(prices).toEqual(sorted);
  }
}
