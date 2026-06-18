# Cinepolis UI Automation - Getting Started Guide

## Overview
This is a professional-grade UI automation test suite for the Cinepolis India website using Playwright with JavaScript, following the Page Object Model (POM) pattern.

## Quick Start (5 Minutes)

```bash
# 1. Navigate to project directory
cd g:\Playwright_class\projectsetup

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install

# 4. Run all tests
npx playwright test

# 5. View HTML report
npx playwright show-report
```

## Directory Structure

```
projectsetup/
├── pages/                          # Page Object Models
│   ├── cinepolisHomePage.js
│   ├── cinepolisLocationPage.js
│   ├── cinepolisShowtimePage.js
│   ├── cinepolis​SeatSelectionPage.js
│   └── cinepolisBookingSummaryPage.js
│
├── tests/                          # Test Files
│   ├── cinepolis.moviebrowsing.spec.js
│   ├── cinepolis.location.spec.js
│   ├── cinepolis.showtime.spec.js
│   ├── cinepolis.seatsSelection.spec.js
│   ├── cinepolis.bookingflow.spec.js
│   ├── cinepolis.advanced.spec.js
│   └── cinepolis.e2e.spec.js
│
├── fixtures/                       # Test Fixtures
│   └── fixtures.js
│
├── utilities/                      # Utilities
│   ├── apiInterceptor.js           # API mocking
│   ├── testUtils.js                # Common utilities
│   └── basePage.js                 # Base page class
│
├── playwright.config.js            # Playwright configuration
├── package.json                    # Dependencies and scripts
└── README.md                       # Documentation
```

## Available Commands

### Run Tests
```bash
npm test                           # Run all tests
npm run test:headed                # Run in headed mode (see browser)
npm run test:debug                 # Debug mode with inspector
npm run test:ui                    # UI mode (interactive)
```

### Run Specific Test Suites
```bash
npm run test:movie                 # Movie browsing tests
npm run test:location              # Location selection tests
npm run test:showtime              # Showtime selection tests
npm run test:seats                 # Seat selection tests
npm run test:booking               # Booking flow tests
```

### Reports
```bash
npm run test:report                # View HTML report
```

## What's Tested

### ✅ Movie Browsing (8 tests)
- Display available movies
- Search functionality
- Movie ratings
- Movie selection
- Search with no results
- Page title verification

### ✅ Location & Theater Selection (8 tests)
- Display available locations
- Select location by name/index
- Select theater by name/index
- Display multiple theaters
- Navigate back functionality
- Invalid location handling

### ✅ Showtime Selection (9 tests)
- Display available showtimes
- Showtime format and pricing
- Select showtime by time/index
- Showtime details retrieval
- Sold-out show handling
- Navigate back functionality

### ✅ Seat Selection (9 tests)
- Display available seats
- Single seat selection
- Multiple seat selection
- Price calculation
- Clear selection
- Seat layout display
- Random seat selection

### ✅ Booking Flow (9 tests)
- Complete booking journey
- Booking summary verification
- Price breakdown
- Edit booking details
- Cancel booking
- Booking confirmation
- Booking ID generation

### ✅ Advanced Features (11 tests)
- API mocking and interception
- Fixture integration
- API response validation
- Request tracking

### ✅ End-to-End Scenarios (18 tests)
- Complete user journeys
- Data validation
- User interaction flows
- Multi-step workflows

## Page Object Model Structure

### CinepolisHomePage
```javascript
const homePage = new CinepolisHomePage(page);
await homePage.navigateToCinepolis();
await homePage.selectMovieByName('Avengers');
const movieCount = await homePage.getAvailableMovies();
```

### CinepolisLocationPage
```javascript
const locationPage = new CinepolisLocationPage(page);
await locationPage.selectLocationByName('Bangalore');
const theaterCount = await locationPage.getTheatersByLocation('Bangalore');
await locationPage.selectTheater('Cinepolis Mall');
```

### CinepolisShowtimePage
```javascript
const showtimePage = new CinepolisShowtimePage(page);
const showtimeCount = await showtimePage.getAvailableShowtimes();
await showtimePage.selectShowtimeByTime('08:00 PM');
const price = await showtimePage.getShowtimePrice('08:00 PM');
```

### CinepolisSeatsSelectionPage
```javascript
const seatPage = new Cinepolis​SeatSelectionPage(page);
const availableSeats = await seatPage.getAvailableSeats();
await seatPage.selectMultipleSeats(['A1', 'A2', 'A3']);
const totalPrice = await seatPage.getTotalPrice();
await seatPage.proceedToSummary();
```

### CinepolisBookingSummaryPage
```javascript
const summaryPage = new CinepolisBookingSummaryPage(page);
const details = await summaryPage.getBookingSummaryDetails();
await summaryPage.verifyMovieDetails('Avengers');
const total = await summaryPage.getTotalAmount();
```

## Using Fixtures

### Page Object Fixtures
```javascript
test('my test', async ({ homePage, locationPage, testData }) => {
  await homePage.navigateToCinepolis();
  await homePage.selectMovieByName(testData.validMovie);
  // Test code here
});
```

### API Interception Fixture
```javascript
test('mock API', async ({ apiInterceptor, homePage }) => {
  await apiInterceptor.mockMovieListAPISuccess();
  await homePage.navigateToCinepolis();
  apiInterceptor.verifyAPIWasCalled('movies', 'GET');
});
```

### Complete Booking Helper
```javascript
test('end-to-end', async ({ completeBookingFlow, testData }) => {
  const details = await completeBookingFlow.completeFullBooking(
    testData.validMovie,
    testData.validLocation,
    testData.validTheater,
    testData.validShowtime,
    2  // number of seats
  );
});
```

## Configuration

### playwright.config.js Key Settings
```javascript
- baseURL: 'https://www.cinepolsindia.com'
- timeout: 30000 (30 seconds)
- viewport: 1366x768
- Screenshots: on failure
- Video: on failure
- Browsers: Chromium (others can be enabled)
```

### Test Data (in fixtures.js)
```javascript
const testData = {
  validMovie: 'Avengers: Endgame',
  validLocation: 'Bangalore',
  validTheater: 'Cinepolis Mall of Bangalore',
  validShowtime: '08:00 PM',
  validSeats: ['A1', 'A2', 'A3'],
  invalidMovie: 'NonExistentMovie123',
  invalidLocation: 'InvalidCity',
};
```

## Best Practices Used

1. **Page Object Model (POM)**
   - Separation of concerns
   - Centralized selectors
   - Reusable methods

2. **Fixtures**
   - Automatic setup/teardown
   - Dependency injection
   - Code reusability

3. **API Mocking**
   - Network request interception
   - Mock response simulation
   - Error scenario handling

4. **Test Organization**
   - Logical grouping with describe blocks
   - Descriptive test names
   - beforeEach hooks for setup

5. **Error Handling**
   - Try-catch blocks
   - Graceful degradation
   - Meaningful error messages

## Troubleshooting

### Tests Timeout
**Solution**: Increase timeout in playwright.config.js
```javascript
timeout: 60000  // 60 seconds
```

### Selectors Not Working
1. Check if application UI changed
2. Update selectors in page object files
3. Use debug mode: `npx playwright test --debug`
4. Inspect elements in browser to verify selectors

### API Mocking Not Working
1. Verify route patterns match actual API calls
2. Check Network tab in browser DevTools
3. Ensure routes are registered before page navigation
4. Check for CORS or other network issues

### Screenshot Issues
1. Create screenshots directory if missing
2. Check file permissions
3. Ensure disk space available

### Test Failures
1. Check network connectivity
2. Verify application is accessible
3. Check selector updates
4. Review test data in fixtures
5. Check browser compatibility

## Advanced Features

### API Interception
```javascript
// Mock successful API
await apiInterceptor.mockMovieListAPISuccess();

// Mock API failure
await apiInterceptor.mockAPIFailure('**/api/**');

// Mock API timeout
await apiInterceptor.mockAPITimeout('**/api/movies**');

// Verify API was called
apiInterceptor.verifyAPIWasCalled('movies', 'GET');
```

### Test Utilities
```javascript
const TestUtils = require('./utilities/testUtils');

TestUtils.sleep(1000);
TestUtils.generateRandomString(10);
TestUtils.getRandomNumber(1, 100);
TestUtils.formatDate(new Date());
TestUtils.parseCurrency('₹ 500');  // Returns 500
TestUtils.retryWithBackoff(asyncFn, 3, 1000);
```

### Base Page Utilities
```javascript
const BasePage = require('./utilities/basePage');

class MyPage extends BasePage {
  constructor(page) {
    super(page);
  }

  async myMethod() {
    await this.navigate('https://example.com');
    await this.click('#button');
    const text = await this.getText('#element');
    await this.scrollToElement('#target');
  }
}
```

## Continuous Integration

### GitHub Actions Example
```yaml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npx playwright install
      - run: npm test
      - uses: actions/upload-artifact@v2
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

## File Descriptions

| File | Purpose |
|------|---------|
| `cinepolisHomePage.js` | Movie selection page interactions |
| `cinepolisLocationPage.js` | Location and theater selection |
| `cinepolisShowtimePage.js` | Showtime display and selection |
| `cinepolis​SeatSelectionPage.js` | Seat layout and selection |
| `cinepolisBookingSummaryPage.js` | Booking summary and confirmation |
| `apiInterceptor.js` | API mocking and request tracking |
| `testUtils.js` | Common utility functions |
| `basePage.js` | Base page methods for all pages |
| `fixtures.js` | Test fixtures and setup |
| `playwright.config.js` | Playwright configuration |

## Support and Maintenance

**Version**: 1.0.0
**Last Updated**: 2026-04-29
**Playwright Version**: Latest
**Node Version**: 14+

## Next Steps

1. **Install dependencies**: `npm install`
2. **Run tests**: `npm test`
3. **View report**: `npm run test:report`
4. **Explore fixtures**: Check `fixtures/fixtures.js`
5. **Update selectors**: If UI changes, update page objects
6. **Add new tests**: Create new test files following existing patterns

## Tips

- Use `--headed` flag to see tests running
- Use `--debug` flag for step-by-step debugging
- Check HTML report for detailed results and screenshots
- Use page object methods instead of raw selectors
- Keep test data in fixtures for easy maintenance
- Use API mocking for testing error scenarios

---

For more information, see [README.md](README.md)
