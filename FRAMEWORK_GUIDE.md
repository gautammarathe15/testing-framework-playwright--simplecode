# CLMS Automation Framework - Comprehensive Documentation

## 🎯 Project Overview

This is a **Cucumber BDD Framework** built with **Playwright** for testing the CLMS (Centralized Leave Management System) application. The framework is designed with a tiered architecture for optimal maintainability and scalability.

### 📊 Key Features

✅ **Tiered Architecture** (POM - Page Object Model)
✅ **Cucumber BDD** with Gherkin syntax
✅ **Playwright** browser automation
✅ **Dual Reporting**: Cucumber HTML + Allure Reports
✅ **Screenshot Capture** on failures
✅ **Video Recording** (optional)
✅ **Parallel Execution**
✅ **Modular Test Organization**

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
