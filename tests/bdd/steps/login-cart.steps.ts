import { expect } from "@playwright/test"
import { Given, Then, When } from "@cucumber/cucumber"
import { settings } from "../../../src/config"
import { BddWorld, requiredPage } from "../support/world"

Given("a registered customer opens the sign-in form", async function (this: BddWorld) {
  if (!settings.username || !settings.password) {
    throw new Error("Set DEMOBLAZE_USERNAME and DEMOBLAZE_PASSWORD to run this scenario")
  }
  await this.loginPage.open()
})

Given("the sign-in form is open", async function (this: BddWorld) {
  await this.loginPage.open()
})

When("the customer submits valid credentials", async function (this: BddWorld) {
  await this.loginPage.signIn(settings.username!, settings.password!)
})

Then("the storefront welcomes the customer", async function (this: BddWorld) {
  await this.loginPage.expectSignedInAs(settings.username!)
})

When("the customer adds the first catalog item to the cart", async function (this: BddWorld) {
  await this.cartPage.addFirstCatalogItem()
})

When("the customer submits the order", async function (this: BddWorld) {
  await this.cartPage.open()
  this.cartTotal = await this.cartPage.readTotal()
  await this.cartPage.placeOrder()
})

Then("the purchase confirmation shows the cart total", async function (this: BddWorld) {
  const confirmation = requiredPage(this).locator(".sweet-alert")
  await expect(confirmation).toBeVisible()
  await expect(confirmation.locator("h2")).toHaveText("Thank you for your purchase!")
  await expect(confirmation.locator("p")).toContainText(`Amount: ${this.cartTotal} USD`)
  await expect(confirmation.locator("p")).toContainText(`Card Number: ${settings.order.card}`)
  await expect(confirmation.locator("p")).toContainText(`Name: ${settings.order.name}`)
  await confirmation.getByRole("button", { name: "OK" }).click()
})

When("a visitor submits an unknown username", async function (this: BddWorld) {
  const page = requiredPage(this)
  const alert = page.waitForEvent("dialog")
  await this.loginPage.signIn(`unknown-${Date.now()}`, "not-a-valid-password")
  const dialog = await alert
  this.lastAlert = dialog.message()
  await dialog.accept()
})

Then("an account-not-found message is shown", async function (this: BddWorld) {
  expect(this.lastAlert).toContain("User does not exist.")
  await expect(requiredPage(this).locator("#nameofuser")).not.toContainText("Welcome")
})