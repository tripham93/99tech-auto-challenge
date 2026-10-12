import {
  After,
  Before,
  Status,
  World,
  setWorldConstructor,
  type ITestCaseHookParameter,
} from "@cucumber/cucumber"
import { chromium, firefox, webkit, type Browser, type BrowserContext, type Page } from "@playwright/test"
import fs from "node:fs/promises"
import { settings } from "../../../src/config"
import { CartPage } from "../../../src/pages/cart.page"
import { LoginPage } from "../../../src/pages/login.page"

const browsers = { chromium, firefox, webkit }
type BrowserName = keyof typeof browsers

export class BddWorld extends World {
  browser?: Browser
  context?: BrowserContext
  page?: Page
  cartPage!: CartPage
  loginPage!: LoginPage
  cartTotal?: string
  lastAlert?: string
}

setWorldConstructor(BddWorld)

Before(async function (this: BddWorld) {
  const browserName = (process.env.BROWSER ?? "chromium") as BrowserName
  const browserType = browsers[browserName]
  if (!browserType) {
    throw new Error(`Unsupported BROWSER value: ${browserName}`)
  }

  this.browser = await browserType.launch({ headless: process.env.HEADLESS !== "false" })
  this.context = await this.browser.newContext({
    baseURL: settings.baseUrl,
    recordVideo: { dir: "test-results/bdd-videos" },
  })
  this.page = await this.context.newPage()
  this.cartPage = new CartPage(this.page)
  this.loginPage = new LoginPage(this.page)
})

After(async function (
  this: BddWorld,
  { result }: ITestCaseHookParameter,
) {
  const failed = result?.status === Status.FAILED
  const video = this.page?.video()

  if (failed && this.page) {
    await this.attach(await this.page.screenshot(), "image/png")
  }

  await this.context?.close()

  if (video) {
    const videoPath = await video.path()
    if (failed) {
      await this.attach(await fs.readFile(videoPath), "video/webm")
    } else {
      await fs.rm(videoPath, { force: true })
    }
  }

  await this.browser?.close()
})

export function requiredPage(world: BddWorld): Page {
  if (!world.page) {
    throw new Error("Browser page was not initialized for this scenario")
  }
  return world.page
}