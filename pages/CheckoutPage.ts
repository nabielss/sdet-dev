import { Page, Locator } from "@playwright/test";

export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly completeHeader: Locator;
  readonly errorMessage: Locator;
  readonly cancelButton: Locator;
  readonly backHomeButton: Locator;
  readonly itemTotal: Locator;
  readonly taxAmount: Locator;
  readonly totalAmount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByTestId("firstName");
    this.lastNameInput = page.getByTestId("lastName");
    this.postalCodeInput = page.getByTestId("postalCode");
    this.continueButton = page.getByTestId("continue");
    this.finishButton = page.getByTestId("finish");
    this.completeHeader = page.getByTestId("complete-header");
    this.errorMessage = page.getByTestId("error");
    this.cancelButton = page.getByTestId("cancel");
    this.backHomeButton = page.getByTestId("back-to-products");
    this.itemTotal = page.locator(".summary_subtotal_label");
    this.taxAmount = page.locator(".summary_tax_label");
    this.totalAmount = page.locator(".summary_total_label");
  }

  async fillShippingInfo(
    firstName: string,
    lastName: string,
    postalCode: string,
  ) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async finishOrder() {
    await this.finishButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async backHome() {
    await this.backHomeButton.click();
  }

  async getItemTotal(): Promise<string> {
    return (await this.itemTotal.textContent()) ?? "";
  }

  async getTaxAmount(): Promise<string> {
    return (await this.taxAmount.textContent()) ?? "";
  }

  async getTotalAmount(): Promise<string> {
    return (await this.totalAmount.textContent()) ?? "";
  }

  async getErrorText(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? "";
  }
}
