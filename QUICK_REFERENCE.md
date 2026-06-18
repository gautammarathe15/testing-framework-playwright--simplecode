# Quick Reference Guide

## File Structure Overview

```
projectsetup/
├── README.md                              # Main documentation
├── GETTING_STARTED.md                    # Quick start guide
├── PROJECT_COMPLETION.md                 # Project summary
├── package.json                          # Dependencies & scripts
├── playwright.config.js                  # Playwright config
│
├── pages/                                # Page Object Models
│   ├── cinepolisHomePage.js             # Homepage interactions
│   ├── cinepolisLocationPage.js         # Location selection
│   ├── cinepolisShowtimePage.js         # Showtime selection
│   ├── cinepolis​SeatSelectionPage.js    # Seat selection
│   └── cinepolisBookingSummaryPage.js   # Booking summary
│
├── tests/                                # Test Suites
│   ├── cinepolis.moviebrowsing.spec.js  # Movie browsing tests (8 tests)
│   ├── cinepolis.location.spec.js       # Location tests (8 tests)
│   ├── cinepolis.showtime.spec.js       # Showtime tests (8 tests)
│   ├── cinepolis.seatsSelection.spec.js # Seat selection tests (9 tests)
│   ├── cinepolis.bookingflow.spec.js    # Booking flow tests (9 tests)
│   ├── cinepolis.advanced.spec.js       # Advanced/API tests (11 tests)
│   └── cinepolis.e2e.spec.js            # End-to-end tests (18 tests)
│
├── fixtures/                            # Test Fixtures
│   └── fixtures.js                      # All reusable fixtures (8 fixtures)
│
├── utilities/                           # Utilities
│   ├── apiInterceptor.js               # API mocking (10 methods)
│   ├── testUtils.js                    # Common utilities (20 methods)
│   ├── basePage.js                     # Base page class (35+ methods)
│   └── testConfig.json                 # Test data & config
│
├── features/                           # Cucumber feature files (existing)
├── stepdefination/                     # Step definitions (existing)
└── support/                            # Support files (existing)
```

---

## Quick Commands

```bash
# Installation
npm install
npx playwright install

# Run All Tests
npm test

# Run Specific Suite
npm run test:movie
npm run test:location
npm run test:showtime
npm run test:seats
npm run test:booking

# Run with Options
npm run test:headed        # See browser
npm run test:debug         # Debug mode
npm run test:ui            # UI mode

# Reports
npm run test:report        # View HTML report

# Server
npm start                  # Start server
```

---

## Page Objects Quick Reference

### CinepolisHomePage
```javascript
const page = new CinepolisHomePage(page);
- navigateToCinepolis()
- selectCity(cityName)
- searchMovie(movieName)
- getAvailableMovies()
- selectMovieByName(movieName)
- selectMovieByIndex(index)
- getMovieRating(movieName)
- isMovieDisplayed(movieName)
- getPageTitle()
- verifyHomepageLoaded()
```

### CinepolisLocationPage
```javascript
const page = new CinepolisLocationPage(page);
- getAvailableLocations()
- selectLocationByName(locationName)
- selectLocationByIndex(index)
- getTheatersByLocation(locationName)
- selectTheater(theaterName)
- selectTheaterByIndex(index)
- verifyLocationPageLoaded()
- goBack()
- verifyNoShowsAvailable()
- getLocationName(index)
```

### CinepolisShowtimePage
```javascript
const page = new CinepolisShowtimePage(page);
- getAvailableShowtimes()
- getShowtimeByTime(time)
- selectShowtimeByTime(time)
- selectShowtimeByIndex(index)
- getShowtimeFormat(time)
- getShowtimePrice(time)
- verifyShowtimePageLoaded()
- isShowtimeSoldOut(time)
- goBack()
- getAllShowtimesWithDetails()
```

### Cinepolis​SeatSelectionPage
```javascript
const page = new Cinepolis​SeatSelectionPage(page);
- getAvailableSeats()
- selectSeatByNumber(seatNumber)
- selectMultipleSeats(seatNumbers)
- getSelectedSeatsCount()
- getTotalPrice()
- verifySeatLayout()
- clearSelection()
- proceedToSummary()
- verifySeatSelectionPageLoaded()
- trySelectDisabledSeat(seatNumber)
- goBack()
- getSeatLayoutDetails()
- selectRandomSeats(count)
```

### CinepolisBookingSummaryPage
```javascript
const page = new CinepolisBookingSummaryPage(page);
- verifyBookingSummaryPageLoaded()
- getBookingSummaryDetails()
- verifyMovieDetails(expectedMovie)
- verifyLocationDetails(expectedLocation)
- verifySeatDetails(expectedSeats)
- getPriceBreakdown()
- confirmBooking()
- cancelBooking()
- isBookingSuccessful()
- getBookingId()
- editBookingDetails()
- verifyAllDetailsPresent()
- getTotalAmount()
```

---

## Test Data Available

```javascript
testData = {
  validMovie: 'Avengers: Endgame',
  validLocation: 'Bangalore',
  validTheater: 'Cinepolis Mall of Bangalore',
  validShowtime: '08:00 PM',
  validSeats: ['A1', 'A2', 'A3'],
  invalidMovie: 'NonExistentMovie123',
  invalidLocation: 'InvalidCity'
}
```

---

## API Interception Quick Reference

```javascript
// Mock successful API
await apiInterceptor.mockMovieListAPISuccess();
await apiInterceptor.mockLocationAPI();
await apiInterceptor.mockShowtimeAPI();
await apiInterceptor.mockSeatAvailabilityAPI();
await apiInterceptor.mockBookingConfirmationAPI(true);

// Mock failures
await apiInterceptor.mockAPIFailure('**/api/**');
await apiInterceptor.mockAPITimeout('**/api/movies**');

// Verify API calls
apiInterceptor.verifyAPIWasCalled('movies', 'GET');

// Track requests/responses
const requests = apiInterceptor.getInterceptedRequests();
const responses = apiInterceptor.getInterceptedResponses();
const movieRequests = apiInterceptor.getRequestByUrl('movies');

// Clear data
apiInterceptor.clearInterceptedData();
```

---

## Fixture Usage Examples

### Using Page Objects
```javascript
test('my test', async ({ homePage, locationPage, bookingSummaryPage }) => {
  await homePage.navigateToCinepolis();
  // All page objects are ready to use
});
```

### Using Test Data
```javascript
test('with test data', async ({ testData }) => {
  const movie = testData.validMovie;
  const location = testData.validLocation;
});
```

### Using API Interceptor
```javascript
test('with API mock', async ({ apiInterceptor }) => {
  await apiInterceptor.mockMovieListAPISuccess();
  apiInterceptor.verifyAPIWasCalled('movies');
});
```

### Using Booking Helper
```javascript
test('complete booking', async ({ completeBookingFlow, testData }) => {
  const details = await completeBookingFlow.completeFullBooking(
    testData.validMovie,
    testData.validLocation,
    testData.validTheater,
    testData.validShowtime,
    2
  );
});
```

### Using Screenshots
```javascript
test('with screenshot', async ({ screenshot }) => {
  const filename = await screenshot.capture('my-test');
  const allScreenshots = screenshot.getScreenshots();
});
```

---

## Test Utilities

```javascript
const TestUtils = require('./utilities/testUtils');

// String operations
TestUtils.generateRandomString(10)
TestUtils.capitalize('hello')              // 'Hello'
TestUtils.truncate('long string', 10)
TestUtils.containsSubstring('hello', 'ell')

// Number operations
TestUtils.getRandomNumber(1, 100)
TestUtils.parseCurrency('₹ 500')           // 500
TestUtils.numbersCloseEnough(100, 101, 2)

// Array operations
TestUtils.getRandomItem([1, 2, 3])
TestUtils.arraysEqual([1, 2], [1, 2])

// Async operations
await TestUtils.sleep(1000)
await TestUtils.retryWithBackoff(asyncFn, 3, 1000)

// Date operations
TestUtils.formatDate(new Date())           // '2026-04-29'
TestUtils.getTimestamp()

// Validation
TestUtils.isValidEmail('test@example.com')
TestUtils.isValidPhone('9876543210')

// Utilities
TestUtils.deepClone(obj)
TestUtils.extractNumbers('abc123def456')   // [123, 456]
TestUtils.log('message', 'INFO')
TestUtils.getScreenshotFileName('test')
```

---

## Base Page Methods

```javascript
const BasePage = require('./utilities/basePage');

class MyPage extends BasePage {
  async myMethod() {
    await this.navigate('url');
    await this.click(selector);
    await this.fill(selector, 'text');
    const text = await this.getText(selector);
    const visible = await this.isVisible(selector);
    await this.waitForElement(selector);
    const count = await this.getElementCount(selector);
    await this.takeScreenshot('filename');
    const url = await this.getCurrentURL();
    const title = await this.getPageTitle();
    await this.scrollToElement(selector);
    await this.scrollToTop();
    await this.scrollToBottom();
    await this.hover(selector);
    const value = await this.getInputValue(selector);
    await this.selectOption(selector, 'value');
    await this.pressKey('Enter');
    await this.typeText('text', 100);
    const result = await this.evaluateScript('js code');
    // 35+ methods available
  }
}
```

---

## Configuration Details

### Browser Settings
- **Browser**: Chromium
- **Viewport**: 1366x768
- **Timeout**: 30 seconds
- **User Agent**: Chrome on Windows

### Reporting
- **HTML**: Yes
- **JUnit**: Yes
- **JSON**: Yes
- **Screenshots**: On failure
- **Video**: On failure
- **Trace**: On first retry

### Retry Policy
- **Retries**: 0 (local), 2 (CI)
- **Parallel**: Yes
- **Workers**: Auto

---

## Test Execution Flow

```
1. Tests Start
   ↓
2. Fixtures Loaded (Page Objects, Test Data, API Interceptor)
   ↓
3. Browser Context Created
   ↓
4. Test Execution
   ├── Navigate to page
   ├── Interact with elements
   ├── Verify expectations
   └── Take screenshots (if failure)
   ↓
5. Cleanup
   ├── Close browser
   ├── Clear data
   └── Generate reports
   ↓
6. Reports Generated
   ├── HTML Report
   ├── Videos (on failure)
   └── Screenshots (on failure)
```

---

## Troubleshooting Checklist

| Issue | Solution |
|-------|----------|
| Selector not found | Update selector in page object |
| Test timeout | Increase timeout in config |
| API mock not working | Check route pattern |
| Screenshots failing | Create screenshots directory |
| Fixture not injected | Check fixture name in test |
| Element not visible | Use scrollIntoViewIfNeeded |
| Navigation fails | Check URL in baseURL config |
| Assertion fails | Verify expected value |

---

## Key Assumptions

- Tests run against: https://www.cinepolsindia.com
- Valid test data exists: 'Avengers: Endgame' movie, 'Bangalore' location
- Multiple locations and showtimes available
- No payment processing required
- Stable network connectivity
- JavaScript enabled in browser
- Tests are independent and order-agnostic

---

## Performance Tips

1. **Use headless mode** (default): Faster execution
2. **Parallel execution**: Tests run in parallel
3. **API mocking**: Speeds up test execution
4. **Fixtures**: Reuse setup code
5. **Selective tests**: Run only needed tests

---

## Common Patterns

### Pattern 1: Complete Booking
```javascript
await homePage.navigateToCinepolis();
await homePage.selectMovieByName(movie);
await locationPage.selectLocationByName(location);
await locationPage.selectTheater(theater);
await showtimePage.selectShowtimeByTime(time);
await seatSelectionPage.selectMultipleSeats(seats);
await seatSelectionPage.proceedToSummary();
```

### Pattern 2: Negative Testing
```javascript
try {
  await action();
  expect(false).toBe(true);  // Should not reach here
} catch (error) {
  expect(error).toBeTruthy();
}
```

### Pattern 3: Data Verification
```javascript
const details = await bookingSummaryPage.getBookingSummaryDetails();
expect(details.movieName).toContain(expectedMovie);
expect(details.location).toContain(expectedLocation);
```

---

## Documentation Files

| File | Purpose |
|------|---------|
| README.md | Main documentation |
| GETTING_STARTED.md | Quick start guide |
| PROJECT_COMPLETION.md | Project summary |
| QUICK_REFERENCE.md | This file |

---

## Support Information

**Version**: 1.0.0
**Last Updated**: 2026-04-29
**Playwright Version**: Latest
**Node**: 14+
**Status**: ✅ Production Ready

---

## Next Steps

1. Read [GETTING_STARTED.md](GETTING_STARTED.md) for setup
2. Install dependencies: `npm install`
3. Run tests: `npm test`
4. View reports: `npm run test:report`
5. Explore test files for understanding
6. Customize selectors if UI changes

---

For more details, see the main [README.md](README.md)
