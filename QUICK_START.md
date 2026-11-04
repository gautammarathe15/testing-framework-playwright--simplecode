# CLMS Quick Start Guide

## 1. Install dependencies

```bash
npm install
```

If Playwright browsers are not installed yet:

```bash
npx playwright install
```

---

## 2. Run the default suite

```bash
npx cucumber-js --profile default
```

Or:

```bash
npm run cucumber:all
```

---

## 3. Run targeted subsets

Smoke tests:

```bash
npm run cucumber:smoke
```

Regression tests:

```bash
npm run cucumber:regression
```

Run by tag:

```bash
npx cucumber-js --profile default --tags "@login"
npx cucumber-js --profile default --tags "@Regression"
```

---

## 4. Environment variables

Common variables used in the project:

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

## 5. View reports

After execution:

```bash
node generate-report.js
```

Allure report:

```bash
npm run allure:report
```

Generated outputs:

- `cucumber-report.html`
- `cucumber-report.json`
- `cucumber-results.xml`
- `playwright-report/`
- `allure-results/`
- `screenshots/`

---

## 6. Current execution model

This suite is currently configured for stable serial execution. The browser lifecycle is managed in `features/support/hooks.js`, and each scenario gets its own Playwright context and page.

This keeps the run predictable and helps with failure debugging and screenshot capture.

---

## 7. Important repo folders

- `features/` - Gherkin scenarios
- `features/step_definitions/` - step bindings
- `pages/` - page objects and module logic
- `features/support/` - hooks and lifecycle logic
- `cucumber.js` - execution profiles and outputs
- `playwright.config.js` - browser timing and report settings

This repository focuses on employee master validation workflows rather than a generic template for unrelated modules.

