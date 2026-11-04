# CLMS Automation Framework Guide

## 1. Overview

This repository is a Playwright + Cucumber BDD automation project for validating CLMS employee master and HR-related workflows in the browser.

The application under test is:

```text
http://192.168.40.115/CLMS_ENT_5.5/app
```

The suite focuses on end-to-end employee lifecycle flows, including:

- employee creation and master data updates
- personal, address, family, and document details
- qualifications, experience, bank, salary, and card validations
- deployment, status change, and reporting manager workflows
- work order, document, and bulk upload validation
- search and verification of updated records in the grid
- screenshot capture and fail analysis

---

## 2. Framework Purpose

This project uses a layered automation design:

- Feature files define business-readable test scenarios in Gherkin
- Step definition files bind scenarios to actual UI interactions
- Page object classes hold selectors and reusable page methods
- Support hooks manage browser lifecycle, retries, screenshots, and Allure metadata
- Utilities and config files store runtime setup and environment values
- Reporting scripts generate HTML/JSON/JUnit results and can trigger Allure output

The main goal is to automate real CLMS workflows with high maintainability and clear failure evidence.

---

## 3. Project Structure

```text
.
├── features/
│   ├── *.feature                           # Business scenarios
│   ├── step_definitions/                  # Cucumber step implementations
│   └── support/
│       └── hooks.js                       # Browser setup, scenario lifecycle, screenshots
├── pages/
│   ├── base.page.js                      # Shared page actions
│   ├── clmslogin.js                      # Login page object
│   ├── clmsdashboard.js                  # Dashboard navigation object
│   ├── launch.js                         # App launch helpers
│   ├── address.js                        # Address module page object
│   ├── bank.js                           # Bank validation page object
│   ├── card.js                           # Card validation page object
│   ├── deployment.js                     # Deployment workflow page object
│   ├── disciplinary_action.js            # Disciplinary action page object
│   ├── document.js                       # Document module page object
│   ├── family.js                         # Family details page object
│   ├── experience.js                    # Experience page object
│   ├── qualification.js                  # Qualification page object
│   ├── salary.js                         # Salary page object
│   ├── statuschange.js                   # Status change page object
│   ├── workorder.js                      # Work order page object
│   └── ...
├── utilities/
│   ├── testConfig.js                     # Runtime config defaults
│   ├── testConfig.json                   # Configuration JSON
│   ├── testData.json                     # Shared test data
│   └── ...
├── playwright.config.js                  # Playwright browser configuration
├── cucumber.js                           # Cucumber profiles and report format setup
├── generate-report.js                    # Aggregates report outputs
├── package.json                          # Scripts and dependencies
├── README.md                             # Project intro and quick usage
├── FRAMEWORK_GUIDE.md                    # This guide
├── screenshots/                          # Failure screenshots
├── test-results/                         # JUnit and JSON artifacts
├── playwright-report/                    # Playwright HTML report output
├── allure-results/                       # Allure result files
├── cucumber-report.html                  # Default Cucumber HTML report
├── cucumber-report.json                  # Default JSON report
├── cucumber-results.xml                  # JUnit XML report
└── .
```

---

## 4. Key Technology Stack

This project uses the following stack:

- Node.js
- Playwright for browser automation
- Cucumber.js for BDD scenarios
- JavaScript Page Object Model structure
- ExcelJS for Excel-based data handling
- Allure for richer test reporting
- Cucumber HTML / JUnit / JSON reporters for CI and debug visibility

Relevant versions from the project configuration:

- Playwright: 1.40.0
- @playwright/test: 1.40.0
- @cucumber/cucumber: 9.5.0
- exceljs: 4.4.0
- allure-commandline: 2.25.0

---

## 5. Execution Model

The framework is driven by Cucumber, and each scenario creates an isolated Playwright browser context and page.

The browser lifecycle is defined in `features/support/hooks.js`:

- `BeforeAll` launches a browser instance
- `Before` creates a new browser context and page for each scenario
- `After` closes the page/context and captures screenshot on failure
- `AfterAll` closes the browser

This keeps scenarios isolated and reduces state leakage between tests.

---

## 6. Environment Configuration

The project reads runtime values from environment variables and defaults defined in the config files.

### Important variables

```bash
BASE_URL=http://192.168.40.115/CLMS_ENT_5.5/app
BROWSER=chromium
HEADLESS=true
RECORD_VIDEO=false
```

### Defaults used in the repo

- `BASE_URL`: default application URL
- `BROWSER`: `chromium` by default; also supports `firefox` and `webkit`
- `HEADLESS`: `true` by default unless explicitly disabled
- `RECORD_VIDEO`: optional when enabled for failed scenarios

For example:

```bash
BASE_URL=http://192.168.40.115/CLMS_ENT_5.5/app BROWSER=firefox HEADLESS=true npx cucumber-js --profile default
```

---

## 7. Available Test Commands

The real commands defined in `package.json` are:

### Run all tests

```bash
npm run cucumber:all
```

### Run default suite

```bash
npm test
```

### Run a specific profile

```bash
npx cucumber-js --profile default
npx cucumber-js --profile smoke
npx cucumber-js --profile regression
```

### Run by tag

```bash
npx cucumber-js --profile default --tags "@login"
npx cucumber-js --profile default --tags "@master"
npx cucumber-js --profile default --tags "@Regression"
```

### Debug / dry run

```bash
npm run test:debug
```

### Report generation only

```bash
node generate-report.js
```

### Clean generated outputs

```bash
npm run clean
```

---

## 8. Real Feature Coverage in This Repository

This repository is not a generic shift/leave/attendance-only framework. The actual feature set is centered on CLMS employee master modules and validations.

Examples of real feature files in the repo:

- `login.feature`
- `contractoremployee.feature`
- `contractorEmployeeDetails.feature`
- `contractorEmployeeFormOperations.feature`
- `address.feature`
- `family.feature`
- `qualification.feature`
- `experience.feature`
- `bank.feature`
- `card.feature`
- `salary.feature`
- `document.feature`
- `deployment.feature`
- `workorder.feature`
- `statuschange.feature`
- `excelUploadContractor.feature`
- `gridcountvalidation.feature`

Examples of tag usage seen in the repo:

- `@login`
- `@master`
- `@Address`
- `@bank_validation`
- `@card_module`
- `@family_module`
- `@Regression`
- `@Smoke`
- `@count_validation`
- `@excelUpload`

This is important because the framework is built for employee master validation scenarios rather than a pure generic module template.

---

## 9. Reporting

The repo generates multiple reporting artifacts after execution.

### Default report files

- `cucumber-report.html`
- `cucumber-report.json`
- `cucumber-results.xml`
- `playwright-report/`
- `allure-results/`

### Report generation commands

```bash
npm run cucumber:report
npm run allure:report
npm run allure:clean
```

### Notes

- `cucumber.js` defines the Cucumber HTML/JSON/JUnit output format
- `playwright.config.js` defines Playwright HTML, JUnit, and JSON reports
- `generate-report.js` consolidates report generation and can open generated output when available
- failure screenshots are stored under `screenshots/`

---

## 10. Best Practices for This Project

1. Keep page objects focused on a single screen or module.
2. Reuse common actions from `base.page.js` instead of duplicating selectors.
3. Add scenario tags for smoke, regression, module, or validation categories.
4. Prefer stable locators and wait strategies over brittle fixed sleeps.
5. Use meaningful feature names and validation tags to identify failing workflows quickly.
6. Keep environment-specific values in environment variables rather than hardcoding URLs or credentials.
7. Preserve screenshot capture for failed scenarios to support debugging and defect evidence.

---

## 11. Quick Start

```bash
npm install
npx cucumber-js --profile default
```

Optional:

```bash
node generate-report.js
BROWSER=firefox HEADLESS=true npx cucumber-js --profile default
```

---

## 12. Important Conclusion

This documentation was cleaned up to match the actual repository instead of a generic sample framework.

The real project is an employee master automation suite for CLMS, using Playwright + Cucumber, with module-specific page objects, scenario-driven validation, and multi-format reporting. The most important details to remember are:

- actual app URL is `http://192.168.40.115/CLMS_ENT_5.5/app`
- primary runner is Cucumber JS
- browser config is in `playwright.config.js`
- cucumber profiles are in `cucumber.js`
- feature coverage is employee master / HR validation, not a generic shift-only framework
- report outputs are generated in root artifacts and under `playwright-report/` and `allure-results/`

### Example: Running Specific Tags
```bash
npx cucumber-js --tags "@SHIFT and @CREATE"
```

---

## 📦 Page Object Model

### Base Page (Shared Methods)
```javascript
// All pages inherit from BasePage
class ShiftPage extends BasePage {
    async navigateToShift() { }
    async createNewShift(data) { }
    async getAllShifts() { }
}
```

### Using Pages in Step Definitions
```javascript
When('User creates a new shift', async function() {
    const shiftPage = new ShiftPage(this.page);
    await shiftPage.createNewShift(data);
});
```

---

## 🎬 Hooks & Lifecycle

### Before Each Test
✅ Launch browser
✅ Create new context
✅ Navigate to base URL
✅ Initialize Allure tracking
✅ Set viewport size

### After Each Test
✅ Capture screenshots on failure
✅ Attach HAR files
✅ Record console logs
✅ Close page and context
✅ Add test metadata

---

## 🔧 Utilities

### Test Configuration
Access configuration via:
```javascript
const config = require('./utilities/testConfig');
console.log(config.appConfig.baseUrl);
```

### Base Page Methods
```javascript
// Common methods available in all pages
await page.goto(url);
await page.click(selector);
await page.fill(selector, text);
await page.getText(selector);
await page.isVisible(selector);
await page.verifySuccessMessage();
await page.getTableData();
```

---

## 📈 Test Metrics

### Current Test Coverage

| Module    | Feature Files | Scenarios | Status |
|-----------|---------------|-----------|--------|
| Shift     | 1             | 10        | ✅     |
| Leave     | 1             | 11        | ✅     |
| Attendance| 1             | 16        | ✅     |
| **Total** | **3**         | **37**    | ✅     |

---

## 🐛 Troubleshooting

### Tests Failing
1. Check console logs in `allure-report/`
2. Review screenshots in `./screenshots/`
3. Check HAR files in `./hars/`
4. Verify BASE_URL is correct

### Allure Report Not Generating
```bash
npm install -g allure-commandline@latest
```

### Dependency Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Additional Resources

- [Cucumber Documentation](https://cucumber.io/docs/cucumber/)
- [Playwright Documentation](https://playwright.dev/)
- [Allure Documentation](https://docs.qameta.io/allure/)
- [Page Object Model](https://playwright.dev/docs/pom)

---

## 👥 Contributing

1. Create a feature branch
2. Make changes following the framework structure
3. Add tests for new features
4. Submit a pull request

---

## 📝 License

ISC License - See LICENSE file for details

---

## 👨‍💻 Author

QA Automation Team

---

## 🎯 Roadmap

- [ ] API testing integration
- [ ] Performance testing
- [ ] Visual regression testing
- [ ] Cloud integration (BrowserStack/Sauce Labs)
- [ ] CI/CD pipeline setup
- [ ] Database testing
- [ ] Mobile testing support

---

**Happy Testing! 🚀**
