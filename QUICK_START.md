# CLMS Framework - Quick Start Guide

## ⚡ 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your settings
```

### 3. Run Tests
```bash
# All tests
npm run cucumber:all

# Shift Module
npm run cucumber:shift

# Leave Module
npm run cucumber:leave

# Attendance Module
npm run cucumber:attendance
```

### 4. View Reports
```bash
# Cucumber HTML Report
open cucumber-report-extended.html

# Allure Report
npm run allure:report
```

---

## 📋 Common Commands

| Command | Purpose |
|---------|---------|
| `npm run cucumber:all` | Run all test scenarios |
| `npm run cucumber:shift` | Run shift module tests |
| `npm run cucumber:leave` | Run leave module tests |
| `npm run cucumber:attendance` | Run attendance module tests |
| `npm run cucumber:smoke` | Run smoke tests |
| `npm run cucumber:regression` | Run regression tests |
| `npm run cucumber:report` | Generate reports |
| `npm run allure:report` | Generate Allure report |
| `npm run allure:clean` | Clean Allure results |
| `npm run test:debug` | Dry run tests |
| `npm run clean` | Clean all artifacts |

---

## 🏗️ Architecture Overview

### Tier 1: Gherkin Features
**Business-readable test scenarios**
```gherkin
@SHIFT
Scenario: Create a new shift
    When User creates a new shift
    Then Shift should be created successfully
```

### Tier 2: Step Definitions
**Maps Gherkin to code execution**
```javascript
When('User creates a new shift', async function() {
    // Implementation
});
```

### Tier 3: Page Objects
**UI element locators and interactions**
```javascript
class ShiftPage extends BasePage {
    async createNewShift(data) { }
}
```

### Tier 4: Base Page
**Shared methods across all pages**
```javascript
await page.click(selector);
await page.fill(selector, text);
```

---

## 📦 Project Structure

```
features/
├── shift.feature          ← Shift scenarios
├── leave.feature          ← Leave scenarios
├── attendance.feature     ← Attendance scenarios
└── step_definitions/
    ├── shift.steps.js
    ├── leave.steps.js
    ├── attendance.steps.js
    └── support/hooks.js   ← Setup/Teardown

pages/
├── base.page.js           ← Base class
├── shift/
│   ├── shift.page.js
│   ├── shiftPolicy.page.js
│   ├── shiftScope.page.js
│   ├── defaultShift.page.js
│   ├── shiftRotationPattern.page.js
│   └── shiftCorrection.page.js
├── leave/
│   ├── leaveApplication.page.js
│   ├── leaveApproval.page.js
│   ├── leaveBalance.page.js
│   └── holidayList.page.js
└── attendance/
    ├── outDuty.page.js
    ├── accessCard.page.js
    ├── weekOffDefault.page.js
    ├── attendanceApproval.page.js
    ├── manualAttendance.page.js
    ├── deleteManualAttendance.page.js
    └── weekOffShiftTemplate.page.js

cucumber.js               ← Test profiles
generate-report.js        ← Report generation
```

---

## 🎯 Test Tags

### Module Tags
- `@SHIFT` - Shift management tests
- `@LEAVE` - Leave management tests
- `@ATTENDANCE` - Attendance tests

### Test Type Tags
- `@SMOKE` - Smoke tests
- `@REGRESSION` - Regression tests
- `@MODULE` - Module feature tests

### Operation Tags
- `@CREATE` - Creation tests
- `@EDIT` - Edit/Update tests
- `@DELETE` - Deletion tests
- `@APPROVE` - Approval workflow tests

### Run Tests by Tag
```bash
# Specific module
npx cucumber-js --tags "@SHIFT"

# Multiple tags (AND)
npx cucumber-js --tags "@SHIFT and @CREATE"

# Multiple tags (OR)
npx cucumber-js --tags "@SHIFT or @LEAVE"
```

---

## 📊 Reporting

### Cucumber HTML Report
- ✅ Auto-generated after each run
- ✅ Located: `cucumber-report-extended.html`
- ✅ Module-specific reports available

### Allure Report
- ✅ Rich interactive reports
- ✅ Screenshots on failure
- ✅ Network HAR files attached
- ✅ Test execution history
- ✅ Trend analysis

**Generate Allure Report:**
```bash
npm run allure:report
```

---

## 🔍 Creating New Tests

### 1. Add Feature File
```gherkin
# features/myfeature.feature
@MYMODULE
Feature: My Feature

Scenario: My Test
    When User does something
    Then Something happens
```

### 2. Add Step Definitions
```javascript
// features/step_definitions/myfeature.steps.js
When('User does something', async function() {
    // Implementation
});
```

### 3. Add Page Object
```javascript
// pages/mymodule/mypage.page.js
class MyPage extends BasePage {
    async doSomething() { }
}
```

### 4. Run Tests
```bash
npx cucumber-js features/myfeature.feature
```

---

## 🛠️ Debugging

### Enable Debug Mode
```bash
npm run test:debug
```

### View Screenshots
```bash
open ./screenshots/
```

### Check Network Logs
```bash
open ./hars/
```

### Browser Console Logs
- Captured in Allure report
- Also in test execution output

---

## 📱 Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| BASE_URL | http://localhost:3000 | Application URL |
| BROWSER | chromium | Browser to use |
| HEADLESS | true | Run headless |
| PARALLEL | 2 | Parallel scenarios |
| TIMEOUT | 30000 | Test timeout (ms) |
| RECORD_VIDEO | false | Record test video |
| RECORD_HAR | true | Record HAR file |

---

## 🎬 Running Tests Locally

### Development
```bash
# Run with headed browser
export HEADLESS=false
npm run cucumber:all
```

### Continuous Integration
```bash
# Run in CI mode
export HEADLESS=true
npm run cucumber:all
npm run cucumber:report
```

### Debug a Specific Test
```bash
npx cucumber-js features/shift.feature --name "Create a new shift successfully"
```

---

## 📚 Learning Resources

- [Cucumber Gherkin Syntax](https://cucumber.io/docs/gherkin/reference/)
- [Playwright API](https://playwright.dev/docs/api/class-page)
- [Page Object Model](https://playwright.dev/docs/pom/)
- [Allure Reports](https://docs.qameta.io/allure-report/)

---

## ✅ Checklist for New Setup

- [ ] Node.js installed (v14+)
- [ ] `npm install` executed
- [ ] `.env` file created from `.env.example`
- [ ] BASE_URL configured
- [ ] `npm run cucumber:shift` runs successfully
- [ ] `cucumber-report-extended.html` generated
- [ ] Allure reports accessible (optional)

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Tests not found | Check feature file path |
| Page not loading | Verify BASE_URL in .env |
| Timeouts | Increase TIMEOUT value |
| Report not generating | Run `npm run cucumber:report` |
| Allure not working | Install `allure-commandline` globally |

---

## 📞 Support

For issues or questions:
1. Check FRAMEWORK_GUIDE.md for detailed documentation
2. Review test logs in console
3. Check screenshots and HAR files
4. Review step definitions in features/step_definitions/

---

**Happy Testing! 🚀**
