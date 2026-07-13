import { Page, Locator } from "@playwright/test";

export class ProductDetailPage {
  readonly page: Page;
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productName = page.locator('[data-test="inventory-item-name"]');
    this.productPrice = page.locator('[data-test="inventory-item-price"]');
    this.productDescription = page.locator('[data-test="inventory-item-desc"]');
    this.addToCartButton = page.getByRole("button", { name: "Add to cart" });
    this.removeButton = page.getByRole("button", { name: "Remove" });
    this.backButton = page.getByTestId("back-to-products");
  }

  async getProductName(): Promise<string> {
    return (await this.productName.textContent()) ?? "";
  }

  async getProductPrice(): Promise<string> {
    return (await this.productPrice.textContent()) ?? "";
  }

  async getProductDescription(): Promise<string> {
    return (await this.productDescription.textContent()) ?? "";
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async remove() {
    await this.removeButton.click();
  }

  async goBack() {
    await this.backButton.click();
  }

  async isAddToCartVisible(): Promise<boolean> {
    return this.addToCartButton.isVisible();
  }

  async isRemoveVisible(): Promise<boolean> {
    return this.removeButton.isVisible();
  }
}
