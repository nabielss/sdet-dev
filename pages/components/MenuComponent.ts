import { Page, Locator } from "@playwright/test";

export class MenuComponent {
  readonly page: Page;
  readonly menuButton: Locator;
  readonly closeButton: Locator;
  readonly logoutLink: Locator;
  readonly resetLink: Locator;
  readonly allItemsLink: Locator;
  readonly aboutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuButton = page.getByRole("button", { name: "Open Menu" });
    this.closeButton = page.getByRole("button", { name: "Close Menu" });
    this.logoutLink = page.getByTestId("logout-sidebar-link");
    this.resetLink = page.getByTestId("reset-sidebar-link");
    this.allItemsLink = page.getByTestId("inventory-sidebar-link");
    this.aboutLink = page.getByTestId("about-sidebar-link");
  }

  async open() {
    await this.menuButton.click();
  }

  async close() {
    await this.closeButton.click();
  }

  async logout() {
    await this.open();
    await this.logoutLink.click();
  }

  async resetAppState() {
    await this.open();
    await this.resetLink.click();
    await this.close();
  }
}
