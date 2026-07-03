import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly checkoutButton: Locator;
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.getByTestId('checkout');
    this.cartItems = page.locator('.cart_item');
    this.cartItemNames = page.locator('.inventory_item_name');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getCartItemNames(): Promise<string[]> {
    return this.cartItemNames.allTextContents();
  }

  async removeItem(productName: string) {
    const item = this.page.locator('.cart_item', { hasText: productName });
    await item.getByRole('button', { name: 'Remove' }).click();
  }
}