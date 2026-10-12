import { expect, test } from "@playwright/test"
import { settings } from "../../src/config"
import { DemoblazeApi } from "../../src/api/demoblaze.api"

test.describe("Account and cart API", () => {
  test("rejects credentials for an unknown account", async ({ request }) => {
    const response = await request.post(`${settings.apiUrl}/login`, {
      data: {
        username: `missing-${Date.now()}`,
        password: Buffer.from("not-a-real-password").toString("base64"),
      },
    })
    expect(response.status()).toBe(200)
    expect(await response.text()).toContain("User does not exist.")
  })

  test("returns a cart for a valid account", async ({ request }) => {
    test.skip(!settings.username || !settings.password, "Set DemoBlaze credentials in .env")
    const api = new DemoblazeApi(request)
    const token = await api.login(settings.username!, settings.password!)
    const cart = await api.getCart(token)
    expect(cart).toHaveProperty("Items")
    expect(Array.isArray((cart as { Items: unknown[] }).Items)).toBe(true)
  })
})