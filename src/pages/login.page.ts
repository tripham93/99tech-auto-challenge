import { expect, type Page } from "@playwright/test"

export class LoginPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto("/")
    await this.page.getByRole("link", { name: "Log in" }).click()
    await expect(this.page.locator("#loginusername")).toBeVisible()
  }

  async signIn(username: string, password: string): Promise<void> {
    await this.page.locator("#loginusername").fill(username)
    await this.page.locator("#loginpassword").fill(password)
    await this.page.locator('#logInModal button[onclick="logIn()"]')
      .click()
  }

  async expectSignedInAs(username: string): Promise<void> {
    await expect(this.page.locator("#nameofuser")).toHaveText(
      `Welcome ${username}`,
    )
  }
}