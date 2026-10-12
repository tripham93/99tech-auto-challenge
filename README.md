# DemoBlaze QA Checks

A small TypeScript and Playwright project for the DemoBlaze login and cart challenge. Browser interactions, API requests, environment configuration, and performance checks are separated so each layer can change independently.

## Project Layout

```text
src/
  api/                 API client for account and cart operations
  pages/               Page objects for login and cart workflows
  config.ts            Environment-backed URLs and test data
tests/
  api/                 API checks
  ui/                  Cross-browser purchase journey
  bdd/
    features/          Gherkin scenarios
    steps/             Cucumber step definitions
    support/           Browser lifecycle and video attachments
manual/                Excel-compatible manual test case sheets
performance/           Opt-in k6 login workload
.github/workflows/     GitHub Actions browser matrix
```

Playwright projects cover Chromium, Firefox, and WebKit. The browser tests use page objects; API tests use a small client. Playwright retries failed tests once and retains failure video, screenshots, and traces. The Cucumber suite also retries once, attaches screenshots and video for failed attempts to Allure, and removes video files for passing scenarios.

## Setup

Requirements: Node.js 20 or later and npm. Install dependencies and browser binaries:

```bash
./install.sh
```

Copy `.env.example` to `.env` and set a dedicated DemoBlaze test account. Do not commit `.env`. Checkout fields can be overridden with environment variables.

## Run

```bash
npm test                 # all configured browser and API projects
npm run test:ui          # UI journeys
npm run test:api         # API checks
npm run test:bdd         # Gherkin scenarios, Chromium by default
npm run test:all         # Playwright and BDD suites
npm run test:headed      # run browsers visibly
npm run report           # open the latest HTML report
```

Small runner scripts are also available:

```bash
./run-playwright.sh
./run-playwright.sh --browser chrome --headed
./run-playwright.sh --browser firefox --headless --grep "login"
./run-playwright.sh --browser all
./run-cucumber.sh
./run-cucumber.sh --browser safari --headed
./run-api.sh
./run-api.sh --grep "cart"
./run-k6.sh
```

Omitted options use Chromium/headless for Playwright and Cucumber, all API tests for the API runner, and the staged arrival-rate profile in `performance/login-smoke.js` for k6. Install Grafana k6 separately before using `run-k6.sh`.

Select one browser or test type directly:

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
npx playwright test --grep @regression
BROWSER=firefox npm run test:bdd
npm run test:bdd -- --tags "not @credentials"
```

The UI demo and the `@credentials` BDD scenario sign in, add the first catalog item, and place an order. Use an account intended for test orders. The unknown-account BDD scenario does not require credentials. Playwright writes HTML reports to `playwright-report/` and failure artifacts to `test-results/`.

## Allure

Both Playwright and Cucumber write results beneath `allure-results/`. Generate and open the combined report with:

```bash
npm run report:allure
npm run report:allure:open
```

The Allure command line requires Java. Keep the raw results directory when combining runs; `report:allure` cleans the generated report output, not the input results.

## API and Performance

API tests target `API_URL` (default `https://api.demoblaze.com`). Set it in `.env` to use another approved environment.

k6 is optional and is not part of `npm ci`. Run it with the values in `.env`:

```bash
./run-k6.sh
```

The scenario ramps from 1 to 50 requests per second over 5 seconds, holds 50 for 20 seconds, then ramps down to 10 and 0. It prints a text summary and writes an HTML report to `performance/reports/k6-summary.html`. Confirm the target is appropriate before running load against it.

## CI

GitHub Actions has four independent manual workflows: [API Tests](.github/workflows/api-tests.yml), [Playwright UI Tests](.github/workflows/playwright-ui.yml), [BDD Tests](.github/workflows/bdd-tests.yml), and [k6 Performance Test](.github/workflows/k6-performance.yml). They run only when dispatched from the Actions tab. UI and BDD use Chromium only. Add `DEMOBLAZE_USERNAME` and `DEMOBLAZE_PASSWORD` as repository secrets for authenticated scenarios, and configure `BASE_URL` and `API_URL` as repository variables if needed. The k6 workflow requires a dedicated `PERFORMANCE_TARGET` repository variable and skips the run with a notice when it points to the shared DemoBlaze domain. Reports are uploaded as workflow artifacts.
