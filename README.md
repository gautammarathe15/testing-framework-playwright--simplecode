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
