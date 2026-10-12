import { expect, type APIRequestContext } from "@playwright/test"
import { settings } from "../config"

export class DemoblazeApi {
  constructor(private readonly request: APIRequestContext) {}

  async login(username: string, password: string): Promise<string> {
    const response = await this.request.post(`${settings.apiUrl}/login`, {
      data: { username, password: Buffer.from(password).toString("base64") },
    })
    expect(response.status()).toBe(200)
    const payload: unknown = await response.json()
    expect(typeof payload).toBe("string")
    expect(payload).toMatch(/^Auth_token:\s+/)
    return (payload as string).replace(/^Auth_token:\s+/, "")
  }

  async getCart(token: string): Promise<unknown> {
    const response = await this.request.post(`${settings.apiUrl}/viewcart`, {
      data: { cookie: token, flag: true },
    })
    expect(response.status()).toBe(200)
    return response.json()
  }
}