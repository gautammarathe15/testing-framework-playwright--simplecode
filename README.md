# CLMS Automation Framework

A modern Playwright + Cucumber BDD automation framework for validating CLMS employee and HR workflows.

## Overview

This repository automates the **Employee Master** module of the CLMS application using a structured **Page Object Model (POM)** and behavior-driven test design. It is built to validate real-world employee lifecycle workflows with reusable UI interactions, dynamic data generation, and thorough reporting.

The application under test is configured at:

```text
http://192.168.40.115/CLMS_ENT_5.5/app
```

## What this framework covers

- Employee creation and profile updates
- Personal, address, and family details
- Qualifications, experience, and bank-related data
- Document validation and upload flows
- Salary, card, and employee status-related validations
- Search and verification of updated employee records
- Bulk Excel upload checks and validation logic
- Failure analysis through screenshots and detailed reports

## Workflow

1. Launch the CLMS application using the configured URL.
2. Log in and navigate to the employee-related screens.
3. Create or update records across multiple sections.
4. Validate success states, required fields, and record visibility.
5. Capture screenshots and test evidence on failure.
6. Generate HTML, JSON, JUnit, and Allure reports.

## Browser and Browser Context model

This framework follows the standard Playwright browser lifecycle used by modern automation suites.

- Browser: the actual browser process (`chromium`, `firefox`, or `webkit`)
- BrowserContext: a fresh isolated session for each scenario; cookies, storage, permissions, and session state are isolated
- Page: a tab or window inside a browser context

The main lifecycle is implemented in `features/support/hooks.js`:

```js
BeforeAll(async function() {
  // launch one browser instance
});

Before(async function() {
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
});
```

This means each scenario gets a separate browser context, which gives better isolation and avoids state leakage across scenarios.

### Browser support matrix

| Browser type | Playwright support | Status in this framework | Notes |
| :--- | :--- | :--- | :--- |
| Chromium | Yes | Supported | Default browser for the repo and Chrome-based execution |
| Firefox | Yes | Supported | Controlled via `BROWSER=firefox` |
| WebKit | Yes | Supported | Playwright WebKit engine, not real Safari app |
| Microsoft Edge app | No (not as a separate Playwright browser engine) | Not directly supported | Edge is usually run through Chromium channel support |
| Safari app | No | Not directly supported | Real Safari is not launched by Playwright; WebKit is the supported engine |

### Browser selection examples

```bash
# Default / Chromium
npx cucumber-js --profile default

# Firefox
BROWSER=firefox npx cucumber-js --profile default

# WebKit
BROWSER=webkit npx cucumber-js --profile default
```

For report generation after execution:

```bash
BROWSER=firefox npx cucumber-js --profile default && node generate-report.js
```

## Framework structure

This project is organized in a layered architecture:

- Feature files for business scenarios
- Step definitions for mapping Gherkin to automation steps
- Page objects for UI interactions and locators
- Utilities and config for runtime behavior
- Support hooks for browser setup, retries, and screenshots
- Reporting modules for HTML and Allure outputs

## Reporting

The framework uses:

- Cucumber HTML report
- JUnit XML report
- JSON report
- Playwright HTML report
- Allure reporting integration

## Tech stack and versions

| Component | Version | Purpose |
| --- | --- | --- |
| Node.js | LTS-compatible version | JavaScript runtime |
| Playwright | 1.40.0 | Browser automation |
| @playwright/test | 1.40.0 | Playwright test runner |
| Cucumber.js | 9.5.0 | BDD scenario execution |
| ExcelJS | 4.4.0 | Excel upload validation |
| Allure Commandline | 2.25.0 | Allure report generation |
| Allure Playwright | 2.9.2 | Allure integration |
| Cucumber HTML Reporter | 7.2.0 | HTML reporting support |
| Jenkins | CI pipeline ready | Continuous integration |

## Quick start

```bash
npm install
npx cucumber-js --profile default
node generate-report.js
```

For full project documentation, see [FRAMEWORK_GUIDE.md](FRAMEWORK_GUIDE.md).
