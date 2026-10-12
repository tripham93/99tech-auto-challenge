import { expect, type Page } from "@playwright/test"
import { settings } from "../config"

export class CartPage {
  constructor(private readonly page: Page) {}

  async addFirstCatalogItem(): Promise<void> {
    await this.page.goto("/")
    await this.page.locator("#tbodyid .hrefch").first().click()
    await this.page.getByRole("link", { name: "Add to cart" }).waitFor()
    const alert = this.page.waitForEvent("dialog")
    await this.page.getByRole("link", { name: "Add to cart" }).click()
    const dialog = await alert
    expect(dialog.message()).toBe("Product added.")
    await dialog.accept()
  }

  async open(): Promise<void> {
    await this.page.getByRole("link", { name: "Cart", exact: true }).click()
    await expect(this.page.locator("#tbodyid tr").first()).toBeVisible()
  }

  async readTotal(): Promise<string> {
    await expect(this.page.locator("#totalp")).not.toBeEmpty()
    return (await this.page.locator("#totalp").innerText()).trim()
  }

  async placeOrder(): Promise<void> {
    await this.page.getByRole("button", { name: "Place Order" }).click()
    await this.page.locator("#name").fill(settings.order.name)
    await this.page.locator("#country").fill(settings.order.country)
    await this.page.locator("#city").fill(settings.order.city)
    await this.page.locator("#card").fill(settings.order.card)
    await this.page.locator("#month").fill(settings.order.month)
    await this.page.locator("#year").fill(settings.order.year)
    await this.page.getByRole("button", { name: "Purchase" }).click()
  }
}