import { expect, test } from "@playwright/test"
import { settings } from "../../src/config"
import { CartPage } from "../../src/pages/cart.page"
import { LoginPage } from "../../src/pages/login.page"

test.describe("Login and purchase journey", () => {
  test("signs in with a valid account", async ({ page }) => {
    test.skip(!settings.username || !settings.password, "Set DemoBlaze credentials in .env")
    const login = new LoginPage(page)
    await login.open()
    await login.signIn(settings.username!, settings.password!)
    await login.expectSignedInAs(settings.username!)
  })

  test("adds a catalog item and completes checkout", async ({ page }) => {
    test.skip(!settings.username || !settings.password, "Set DemoBlaze credentials in .env")
    const login = new LoginPage(page)
    await login.open()
    await login.signIn(settings.username!, settings.password!)
    await login.expectSignedInAs(settings.username!)

    const cart = new CartPage(page)
    await cart.addFirstCatalogItem()
    await cart.open()
    const total = await cart.readTotal()
    await cart.placeOrder()

    const confirmation = page.locator(".sweet-alert")
    await expect(confirmation).toBeVisible()
    await expect(confirmation.locator("h2")).toHaveText("Thank you for your purchase!")
    await expect(confirmation.locator("p")).toContainText(`Amount: ${total} USD`)
    await expect(confirmation.locator("p")).toContainText(`Card Number: ${settings.order.card}`)
    await expect(confirmation.locator("p")).toContainText(`Name: ${settings.order.name}`)
    await confirmation.getByRole("button", { name: "OK" }).click()
  })
})