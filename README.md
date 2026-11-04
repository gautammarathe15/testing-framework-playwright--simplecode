# CLMS Automation Framework

A Playwright + Cucumber BDD automation project for validating CLMS employee master and HR workflows.

## Overview

This repository automates the main employee lifecycle and validation flows in the CLMS application, including:

- login and navigation
- employee creation and master data updates
- personal, address, family, qualification, and experience details
- bank, salary, document, card, and status validations
- reporting manager, deployment, work order, and upload checks
- grid validation and failure analysis through screenshots and reports

Target application URL:

```text
http://192.168.40.115/CLMS_ENT_5.5/app
```

---

## Tech stack

- Playwright
- Cucumber.js
- JavaScript / Node.js
- ExcelJS
- Allure
- HTML / JSON / JUnit reporting

---

## Quick start

```bash
npm install
npx cucumber-js --profile default
```

Optional report generation:

```bash
node generate-report.js
```

Or:

```bash
npm run cucumber:all
```

---

## Useful commands

```bash
npm run cucumber:smoke
npm run cucumber:regression
npm run allure:report
npm run test:debug
```

---

## Project structure

```text
features/
features/step_definitions/
features/support/
pages/
utilities/
playwright.config.js
cucumber.js
generate-report.js
package.json
```

---

## Important note

This repo is a real employee-master automation project, not a generic shift/leave/attendance-only template. For the most accurate implementation details, use:

- [FRAMEWORK_GUIDE.md](FRAMEWORK_GUIDE.md)
- [GETTING_STARTED.md](GETTING_STARTED.md)
- [QUICK_START.md](QUICK_START.md)
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)

---

## Reporting

The suite produces:

- Cucumber HTML report
- Cucumber JSON report
- JUnit XML output
- Playwright HTML report
- Allure results for richer execution analysis

