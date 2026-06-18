# UI Automation - Cinepolis India Test Suite

## Project Overview

This is a comprehensive UI automation test suite for the Cinepolis India booking website (https://www.cinepolsindia.com) built using **Playwright** with JavaScript. The project implements the **Page Object Model (POM)** pattern for clean, maintainable, and reusable test code.

### Assignment Objectives
- ✅ Design and implement robust UI test automation using Playwright
- ✅ Use Page Object Model pattern
- ✅ Clean and scalable code structure
- ✅ API interception and mocking
- ✅ Fixtures for test setup
- ✅ Comprehensive test scenarios
- ✅ Screenshots and reporting
- ✅ Complete documentation

## Features Implemented

### 1. **Page Object Models**
- `CinepolisHomePage.js` - Movie browsing and selection
- `CinepolisLocationPage.js` - Location and theater selection
- `CinepolisShowtimePage.js` - Showtime display and selection
- `CinepolisSeatsSelectionPage.js` - Seat layout and selection
- `CinepolisBookingSummaryPage.js` - Booking summary and confirmation

### 2. **Test Scenarios**

#### Movie Browsing
- Display available movies on homepage
- Search for movies
- Display movie ratings
- Select movies by name/index
- Handle search with no results
- Negative test cases

#### Location and Theater Selection
- Display available locations
- Select location by name/index
- Select theater by name/index
- Display multiple theaters per location
- Navigate back to previous page
- Handle invalid location selection
- Negative test cases

#### Showtime Selection
- Display available showtimes
- Show format and pricing information
- Select showtime by time/index
- Get showtime details
- Handle sold-out shows
- Navigate back functionality
- Negative test cases

#### Seat Selection
- Display available seats
- Select single/multiple seats
- Calculate total price
- Clear seat selection
- Display seat layout
- Select random seats
- Proceed to booking summary
- Negative test cases

#### Complete Booking Flow
- Navigate through entire booking journey
- Verify booking summary details
- Display price breakdown
- Allow editing booking details
- Cancel booking
- Confirm booking and get booking ID
- Negative test cases

### 3. **Advanced Features**

#### API Interception (`apiInterceptor.js`)
- Mock movie list API responses
- Mock location/theater API
- Mock showtime API
- Mock seat availability API
- Mock booking confirmation API
- Handle API failures and timeouts
- Track intercepted requests and responses
- Verify API calls were made

#### Fixtures (`fixtures.js`)
- Reusable page object fixtures
- API interceptor fixture
- Test data fixture
- Custom browser context setup
- Complete booking flow helper
- Screenshot capture on failure

### 4. **Test Organization**
- `cinepolis.moviebrowsing.spec.js` - Movie browsing tests
- `cinepolis.location.spec.js` - Location selection tests
- `cinepolis.showtime.spec.js` - Showtime selection tests
- `cinepolis.seatsSelection.spec.js` - Seat selection tests
- `cinepolis.bookingflow.spec.js` - Complete booking flow tests

### 5. **Utilities**
- `apiInterceptor.js` - API mocking and interception
- `testData.json` - Test data configuration
- `browserManager.js` - Browser setup and management

## Project Structure

```
projectsetup/
├── pages/
│   ├── cinepolisHomePage.js
│   ├── cinepolisLocationPage.js
│   ├── cinepolisShowtimePage.js
│   ├── cinepolis​SeatSelectionPage.js
│   └── cinepolisBookingSummaryPage.js
├── tests/
│   ├── cinepolis.moviebrowsing.spec.js
│   ├── cinepolis.location.spec.js
│   ├── cinepolis.showtime.spec.js
│   ├── cinepolis.seatsSelection.spec.js
│   └── cinepolis.bookingflow.spec.js
├── fixtures/
│   └── fixtures.js
├── utilities/
│   └── apiInterceptor.js
├── playwright.config.js
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js 14+ or higher
- npm or yarn package manager

### Step 1: Install Dependencies

```bash
# Navigate to project directory
cd g:\Playwright_class\projectsetup

# Install npm dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Step 2: Configure Playwright

The `playwright.config.js` is pre-configured with:
- Chrome browser
- 1366x768 viewport
- 30-second timeout
- Screenshots on failure
- Video recording
- HTML reports

## Running Tests

### Run All Tests

```bash
npx playwright test
```

### Run Specific Test File

```bash
npx playwright test tests/cinepolis.moviebrowsing.spec.js
```

### Run Tests with Specific Tag

```bash
npx playwright test --grep @smoke
```

### Run Tests in Headed Mode (See Browser)

```bash
npx playwright test --headed
```

### Run Tests in Debug Mode

```bash
npx playwright test --debug
```

### Run Tests with UI Mode

```bash
npx playwright test --ui
```

### Generate HTML Report

```bash
npx playwright show-report
```

## Test Coverage

### Positive Test Cases: 30+
- Movie browsing and selection
- Location and theater selection
- Showtime display and selection
- Seat selection and layout
- Complete booking flow
- Price calculations
- Booking confirmation

### Negative Test Cases: 15+
- Invalid movie search
- Invalid location selection
- Sold-out showtime handling
- Disabled seat selection
- Booking without seats
- API failures
- Network timeouts
- Rapid user interactions

### Advanced Scenarios: 10+
- API interception and mocking
- Multiple seat selections
- Price breakdown verification
- Booking cancellation
- Edit booking details
- Random seat selection
- Browser context setup

## Framework Overview

### Page Object Model (POM)
- **BasePage**: Contains common methods (click, fill, getText, navigate, etc.)
- **OneMgPage**: Extends BasePage with 1mg-specific locators and methods
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
