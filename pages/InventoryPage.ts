import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  // Component-style reusable action: works for ANY product by name
  async addProductToCart(productName: string) {
    const productCard = this.page.locator('.inventory_item', { hasText: productName });
    await productCard.getByRole('button', { name: 'Add to cart' }).click();
  }

  async goToCart() {
    await this.cartLink.click();
  }
}
