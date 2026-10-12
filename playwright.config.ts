import "dotenv/config"
import { defineConfig, devices } from "@playwright/test"

const baseURL = process.env.BASE_URL ?? "https://www.demoblaze.com"

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 1,
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    ["allure-playwright", { outputFolder: "allure-results" }],
  ],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      testIgnore: "**/api/**",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      testIgnore: "**/api/**",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      testIgnore: "**/api/**",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "api",
      testMatch: "**/api/**/*.spec.ts",
    },
  ],
})