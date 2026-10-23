# CLMS Automation Framework - Comprehensive Documentation

## 🎯 Project Overview

This repository is a modern **CLMS automation framework** built with **Playwright** and **Cucumber BDD** for end-to-end validation of employee lifecycle and HR workflows. It follows a structured **Page Object Model (POM)** architecture to keep UI automation maintainable, reusable, and easy to scale.

The project specifically automates the **Employee Master** module of the CLMS application, targeting the base URL:

```text
http://192.168.40.115/CLMS_ENT_5.5/app
```

It validates core employee data operations such as employee creation, profile updates, personal and communication details, address and family information, qualifications, experience, banking and salary-related data, documents, deployment, status changes, and verification of updated records in the grid.

### 📊 Key Features

✅ **Playwright-powered browser automation**
✅ **Cucumber BDD with Gherkin scenarios**
✅ **Page Object Model for reusable UI interactions**
✅ **Employee Master workflow automation**
✅ **Dynamic test data generation** for CLMS workflows
✅ **Excel upload and validation automation**
✅ **HTML + Allure reporting** for execution visibility
✅ **Screenshot capture** for failed scenarios
✅ **Jenkins-ready CI pipeline**
✅ **Modular, enterprise-friendly test organization**

### 🔄 Workflow Overview

1. Launch the CLMS application using the configured URL.
2. Log in and navigate to the Employee Master / employee-related screens.
3. Create or update employee records and required details.
4. Fill sections such as personal information, address, family data, qualifications, bank details, and documents.
5. Validate success messages, mandatory field behavior, and record visibility in the grid.
6. Capture screenshots and test evidence on failure.
7. Generate HTML, JSON, JUnit, and Allure reports for result analysis.

### 🧩 Framework Structure

The framework is organized in a layered design:

- **Feature files** for business-readable scenarios
- **Step definitions** for mapping Gherkin to automation logic
- **Page Object Model** for reusable locators and interactions
- **Utilities and config** for browser and environment parameters
- **Support hooks** for setup, teardown, retries, and screenshots
- **Reporting layer** for Cucumber, Playwright, and Allure outputs

### 📈 Reporting

The project uses a combination of reporting tools to provide execution visibility, including:

- Cucumber HTML report
- JUnit XML report
- JSON output
- Playwright HTML report
- Allure reporting integration

---

## 📁 Framework Structure

```
TIER 1: GHERKIN FEATURES (Business Language)
├── features/
│   ├── shift.feature           ← Shift management scenarios
│   ├── leave.feature           ← Leave management scenarios
│   └── attendance.feature      ← Attendance management scenarios

TIER 2: STEP DEFINITIONS & LIFECYCLE HOOKS
├── step_definitions/
│   ├── shift.steps.js          ← Maps shift scenarios to code
│   ├── leave.steps.js          ← Maps leave scenarios to code
│   ├── attendance.steps.js     ← Maps attendance scenarios to code
│   └── support/
│       └── hooks.js            ← Setup/Teardown with Allure integration

TIER 3: PAGE OBJECT MODEL LAYER
├── pages/
│   ├── base.page.js            ← Shared UI elements & actions
│   ├── shift/                  ← Shift module pages
│   │   ├── shift.page.js
│   │   ├── shiftPolicy.page.js
│   │   ├── shiftScope.page.js
│   │   ├── defaultShift.page.js
│   │   ├── shiftRotationPattern.page.js
│   │   └── shiftCorrection.page.js
│   ├── leave/                  ← Leave module pages
│   │   ├── leaveApplication.page.js
│   │   ├── leaveApproval.page.js
│   │   ├── leaveBalance.page.js
│   │   └── holidayList.page.js
│   └── attendance/             ← Attendance module pages
│       ├── outDuty.page.js
│       ├── accessCard.page.js
│       ├── weekOffDefault.page.js
│       ├── attendanceApproval.page.js
│       ├── manualAttendance.page.js
│       ├── deleteManualAttendance.page.js
│       └── weekOffShiftTemplate.page.js

TIER 4: UTILITIES & CONFIGURATION
├── utilities/
│   ├── testConfig.js           ← Configuration management
│   ├── basePage.js             ← Base page utilities
│   └── testData.json           ← Test data repository
├── fixtures/                   ← Test data files
├── cucumber.js                 ← Cucumber profiles
└── generate-report.js          ← Report generation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd projectsetup
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Allure CLI (optional for Allure reports)**
   ```bash
   npm install -g allure-commandline
   ```

### Environment Configuration

Create a `.env` file in the root directory:

```env
# Application
BASE_URL=http://localhost:3000
ENV=staging

# Browser
BROWSER=chromium
HEADLESS=true

# Testing
PARALLEL=2
RETRY=0
TIMEOUT=30000

# Reporting
RECORD_VIDEO=false
RECORD_HAR=true

# Credentials
TEST_USER=testuser@example.com
TEST_PASSWORD=password123
```

---

## 📝 Running Tests

### Run All Tests
```bash
npm run cucumber:all
```

### Run Module-Specific Tests

**Shift Management**
```bash
npm run cucumber:shift
```

**Leave Management**
```bash
npm run cucumber:leave
```

**Attendance Management**
```bash
npm run cucumber:attendance
```

### Run Tests with Tags

**Smoke Tests**
```bash
npm run cucumber:smoke
```

**Regression Tests**
```bash
npm run cucumber:regression
```

### Run Specific Feature
```bash
npx cucumber-js features/shift.feature
```

### Debug Mode
```bash
npm run test:debug
```

---

## 📊 Reports

### Cucumber HTML Report
Generated after test execution:
```bash
open cucumber-report-extended.html
```

### Allure Report

Generate Allure report:
```bash
npm run allure:report
```

Clean Allure results:
```bash
npm run allure:clean
```

### Report Generation
```bash
npm run cucumber:report
```

This generates:
- ✅ `cucumber-report-extended.html` - Main report
- ✅ Module-specific reports
- ✅ Allure report (if installed)

---

## 🧪 Test Organization

### Feature Files

Each feature file contains related scenarios organized by tags:

- `@SHIFT` - Shift module tests
- `@SHIFT_CREATE` - Create shift scenarios
- `@SHIFT_EDIT` - Edit shift scenarios
- `@LEAVE` - Leave module tests
- `@ATTENDANCE` - Attendance module tests
- `@SMOKE` - Smoke tests
- `@REGRESSION` - Regression tests

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
