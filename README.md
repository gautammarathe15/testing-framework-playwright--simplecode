# Playwright POM Framework with Cucumber

## Project Structure

```
projectsetup/
├── features/              # Gherkin feature files
│   └── 1mg.feature
├── pages/                 # Page Object Model classes
│   ├── basePage.js       # Base class with common methods
│   └── oneMgPage.js      # 1mg.com specific page object
├── stepdefination/        # Step definitions
│   └── 1mg.steps.js
├── utilities/             # Helper classes and utilities
│   └── browserManager.js  # Browser and page management
├── package.json          # Dependencies
├── cucumber.js           # Cucumber configuration
└── README.md
```

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Tests
```bash
npm test
```

### 3. Run Tests in Headed Mode
```bash
npm run test:headed
```

## Framework Overview

### Page Object Model (POM)
- **BasePage**: Contains common methods (click, fill, getText, navigate, etc.)
- **OneMgPage**: Extends BasePage with 1mg-specific locators and methods

### Step Definitions
- Uses Cucumber's Given, When, Then syntax
- Hooks for Before and After scenarios
- Browser lifecycle management

### Browser Management
- Chromium browser launch
- Context and page creation
- Automatic cleanup after tests

## Key Features

✓ Modular page object design
✓ Reusable step definitions
✓ Automatic browser lifecycle management
✓ Error handling and logging
✓ Support for parallel execution
✓ HTML report generation

## Example Test Scenario

The feature file includes a basic scenario to verify 1mg homepage loads successfully.

## Extending the Framework

### Add New Page Object
Create a new file in `pages/` folder extending `BasePage`

### Add New Feature File
Create `.feature` files in `features/` folder with Gherkin syntax

### Add New Step Definitions
Create step definitions in `stepdefination/` folder linked to feature files
