# CLMS Automation Framework - Getting Started

This project is a Playwright + Cucumber automation suite for CLMS employee master and HR validation flows.

It covers real user journeys such as employee creation, form updates, bank and salary validation, document management, search checks, Excel upload verification, and status-based workflow validation.

---

## 1. Prerequisites

Before running the suite, make sure the following are available:

- Node.js 18+ or a compatible LTS version
- npm
- Git
- Access to the CLMS application URL
- Chrome/Chromium installed if using the default browser

---

## 2. Install dependencies

From the repository root:

```bash
npm install
```

Optional browser installation if needed:

```bash
npx playwright install
```

---

## 3. Application URL

The project uses:

```text
http://192.168.40.115/CLMS_ENT_5.5/app
```

You can override it with the `BASE_URL` environment variable.

---

## 4. Run the default suite

```bash
npx cucumber-js --profile default
```

Or use the npm script:

```bash
npm run cucumber:all
```

---

## 5. Run targeted subsets

Smoke tests:

```bash
npm run cucumber:smoke
```

Regression tests:

```bash
npm run cucumber:regression
```

Custom tag filters:

```bash
npx cucumber-js --profile default --tags "@login"
npx cucumber-js --profile default --tags "@Regression"
```

---

## 6. Repository structure

This project is organized around real CLMS workflows:

- `features/` contains Gherkin scenarios
- `features/step_definitions/` contains the JavaScript bindings for step execution
- `pages/` contains page objects for each module
- `features/support/hooks.js` handles browser lifecycle, retries, and screenshots
- `cucumber.js` defines Cucumber profiles and output settings
- `playwright.config.js` defines browser and reporting defaults
- `generate-report.js` assembles final reports

---

## 7. Real repo facts

This is not a generic shift/leave/attendance framework. The actual project focuses on employee master workflows, including:

- login and navigation
- contractor employee master flow
- address, family, qualification, and experience details
- bank, salary, document, and card validation
- deployment, work order, and status change processes
- bulk Excel upload and grid verification

The repo currently contains:

- 33 feature files
- 32 step definition files
- 23 page object files

---

## 8. Reports

Generate reports after test execution:

```bash
node generate-report.js
```

Additional commands:

```bash
npm run allure:report
npm run allure:clean
```

Generated outputs:

- `cucumber-report.html`
- `cucumber-report.json`
- `cucumber-results.xml`
- `playwright-report/`
- `allure-results/`
- `screenshots/`

---

## 9. Useful environment variables

```bash
BASE_URL=http://192.168.40.115/CLMS_ENT_5.5/app
BROWSER=chromium
HEADLESS=true
```

Example:

```bash
BASE_URL=http://192.168.40.115/CLMS_ENT_5.5/app BROWSER=firefox HEADLESS=true npx cucumber-js --profile default
```

---

## 10. Troubleshooting

- If a feature is not found, confirm the file name under `features/`
- If browsers fail to launch, run `npx playwright install`
- If the app is down or the URL is invalid, update `BASE_URL`
- If a scenario fails repeatedly, check the screenshot in `screenshots/` and the generated report

This guide is intentionally aligned to the actual project state and removes the stale generic template details.

For more information, see [README.md](README.md).
