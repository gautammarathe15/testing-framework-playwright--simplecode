# Cucumber BDD Test Suite - Cinepolis India

## Overview

This is a comprehensive Behavior Driven Development (BDD) test suite for the Cinepolis India movie booking system using Cucumber.js with Playwright.

## What is BDD?

**Behavior-Driven Development** focuses on test scenarios written in plain English (Gherkin language) that describe how the application should behave from a user's perspective.

### Benefits
- ✅ Tests are readable by non-technical stakeholders
- ✅ Clear documentation of expected behavior
- ✅ Easier to maintain and update
- ✅ Bridges gap between business and development

## File Structure

```
features/
├── cinepolisindia.feature          # All test scenarios (57 scenarios)
└── step_definitions/
    └── cinepolisindia.steps.js     # Step implementations
    
support/
└── hooks.js                        # Browser setup/cleanup
```

## Feature File Statistics

- **Total Scenarios**: 57
- **Total Steps**: 200+
- **Test Coverage**:
  - Movie Browsing: 4 scenarios
  - Location Selection: 4 scenarios
  - Showtime Selection: 8 scenarios
  - Seat Selection: 9 scenarios
  - Booking Summary: 5 scenarios
  - End-to-End: 5 scenarios
  - API Integration: 4 scenarios
  - Negative Cases: 5 scenarios
  - Accessibility: 2 scenarios
  - Performance: 2 scenarios
  - Security: 2 scenarios
  - User Experience: 2 scenarios

## Test Tags

Tests are organized by tags for easy execution:

```bash
@smoke              # Quick sanity tests
@regression         # Full regression suite
@movie-browsing     # Movie selection tests
@location-selection # Location selection tests
@showtime-selection # Showtime selection tests
@seat-selection     # Seat selection tests
@booking-summary    # Booking summary tests
@end-to-end         # Complete user journeys
@api-integration    # API functionality tests
@negative           # Negative/error scenarios
@accessibility      # Accessibility compliance
@performance        # Performance tests
@security           # Security tests
```

## Running Tests

### Run All Cucumber Tests
```bash
npm run cucumber:all
```

### Run Smoke Tests Only
```bash
npm run cucumber:smoke
```

### Run Regression Tests
```bash
npm run cucumber:regression
```

### Run API Tests
```bash
npm run cucumber:api
```

### Run Negative Test Cases
```bash
npm run cucumber:negative
```

### Run Accessibility Tests
```bash
npm run cucumber:accessibility
```

### Run Specific Feature
```bash
npm run cucumber:movie          # Movie browsing tests
npm run cucumber:booking        # End-to-end booking tests
```

### Run with Debug Profile
```bash
npm run cucumber:debug
```

### Run Specific Scenario
```bash
npx cucumber-js features/cinepolisindia.feature --name "Complete booking flow"
```

### Generate Reports
```bash
npm run cucumber:report
```

## Scenario Structure

### Background (Runs before each scenario)
```gherkin
Background:
  Given I am on the Cinepolis homepage
  And I have a stable internet connection
  And the website is accessible
```

### Example Scenario
```gherkin
@smoke @movie-browsing
Scenario: Customer browses available movies
  When I navigate to the movies section
  Then I should see a list of available movies
  And each movie should display the rating
  And each movie should display the format information
```

## Key Scenarios

### 1. Movie Browsing (4 scenarios)
- Browse available movies
- Search for specific movies
- Select a movie
- Handle search with no results

### 2. Location Selection (4 scenarios)
- View available locations
- Select a location
- Select a theater
- Navigate back from location page

### 3. Showtime Selection (8 scenarios)
- View available showtimes
- Select a showtime
- View pricing for different formats
- Handle sold-out shows
- View all showtimes with details

### 4. Seat Selection (9 scenarios)
- View seat layout
- Select single seat
- Select multiple seats
- Calculate price correctly
- Clear selection
- Handle booked seats
- Handle proceeding without seats

### 5. Booking Summary (5 scenarios)
- View booking summary
- View price breakdown
- Confirm booking
- Edit booking details
- Cancel booking

### 6. End-to-End Scenarios (5 scenarios)
- Complete standard booking flow
- Premium format booking
- Booking with maximum seats
- Data validation
- User interaction flows

### 7. API Integration (4 scenarios)
- Fetch movie data from API
- Fetch showtime data from API
- Send booking confirmation to API
- Handle API failures

### 8. Negative Cases (5 scenarios)
- Handle API failures
- Handle API timeouts
- Handle network interruptions
- Invalid selections

## Step Definitions

All steps are implemented in `features/step_definitions/cinepolisindia.steps.js`:

### Example Step Implementation
```javascript
Given('I am on the Cinepolis homepage', async function () {
  await homePage.navigateToCinepolis();
  await homePage.verifyHomepageLoaded();
});

When('I search for {string}', async function (movieName) {
  await homePage.searchMovie(movieName);
  this.searchedMovie = movieName;
});

Then('the search results should display {string}', async function (movieName) {
  const isDisplayed = await homePage.isMovieDisplayed(movieName);
  expect(isDisplayed).toBe(true);
});
```

## Test Data Storage

Context data is stored in `this` object for reuse across steps:

```javascript
// Store data
this.selectedMovie = 'Avengers: Endgame';
this.selectedLocation = 'Bangalore';
this.selectedSeats = ['A1', 'A2', 'A3'];

// Retrieve data
const movie = this.selectedMovie;
```

## Hooks

Hooks handle browser setup and cleanup:

```javascript
Before(async function () {
  // Initialize browser and context
  browser = await chromium.launch();
  context = await browser.newContext();
  page = await context.newPage();
});

After(async function () {
  // Clean up
  await context.close();
  await browser.close();
});
```

## Reports

### Generated Reports
- **HTML Report**: `cucumber-report.html`
- **JSON Report**: `cucumber-report.json`
- **JUnit Report**: `cucumber-results.xml`
- **Usage Report**: `usage.txt`

### View Reports
```bash
npm run cucumber:report
```

## Configuration Profiles

### Default Profile
```bash
npm run cucumber:all
```
- Runs all scenarios
- Parallel execution (2 workers)
- Generates HTML, JSON, and JUnit reports

### Smoke Profile
```bash
npm run cucumber:smoke
```
- Runs only @smoke tagged scenarios
- Quick sanity check
- Parallel execution

### Regression Profile
```bash
npm run cucumber:regression
```
- Runs @regression and @end-to-end tagged scenarios
- Full regression suite
- Parallel execution

### API Profile
```bash
npm run cucumber:api
```
- Runs only @api-integration tagged scenarios
- Tests API functionality

### Negative Profile
```bash
npm run cucumber:negative
```
- Runs only @negative tagged scenarios
- Tests error handling
- Sequential execution for clarity

### Accessibility Profile
```bash
npm run cucumber:accessibility
```
- Runs only @accessibility tagged scenarios
- Tests compliance and usability

## Gherkin Syntax

### Keywords
```gherkin
Feature:        Main feature description
Scenario:       Individual test case
Given:          Initial context/setup
When:           User action
Then:           Expected result
And:            Additional step (can follow any keyword)
But:            Alternative/negative step (can follow any keyword)

@tag            Tags for organizing/filtering scenarios
Background:     Steps that run before each scenario
```

### Example with Multiple Keywords
```gherkin
@end-to-end @smoke
Scenario: Complete booking flow
  Given I am on the Cinepolis homepage
  When I search for "Avengers: Endgame"
  And I select the movie
  And I select the location "Bangalore"
  Then I should be on the location page
  And the location should be highlighted
```

### Data Tables
```gherkin
Then the summary should display:
  | Field          | Value                 |
  | Movie Name     | Avengers: Endgame     |
  | Location       | Bangalore             |
  | Selected Seats | A1, A2, A3            |
  | Total Amount   | ₹1050                 |
```

### Scenario Outline
```gherkin
Scenario Outline: Booking with different seat counts
  When I select <seats> seats at <price> rupees each
  Then the total price should be <total>

  Examples:
    | seats | price | total |
    | 1     | 300   | 300   |
    | 2     | 300   | 600   |
    | 3     | 300   | 900   |
```

## Best Practices

### 1. Clear Step Names
```gherkin
✅ GOOD:   When I select seats "A1", "A2", and "A3"
❌ BAD:    When I select seats
```

### 2. Use Parameters
```gherkin
✅ GOOD:   When I search for {string}
❌ BAD:    When I search for Avengers
```

### 3. One Scenario = One Behavior
```gherkin
✅ GOOD:   Scenario: Customer successfully books tickets
❌ BAD:    Scenario: Customer browses, searches, and books tickets
```

### 4. Avoid Technical Details
```gherkin
✅ GOOD:   When I click on the booking button
❌ BAD:    When I click on the button with id="booking-btn"
```

### 5. Use Appropriate Tags
```gherkin
✅ GOOD:   @smoke @movie-browsing
           Scenario: Browse available movies

❌ BAD:    Scenario: Browse available movies
           (Missing tags for filtering)
```

## Troubleshooting

### No Test Results
**Solution**: Ensure feature file path is correct in profiles

### Steps not Found
**Solution**: Check step name matches exactly in step definitions

### Browser Not Starting
**Solution**: Install Playwright browsers: `npx playwright install`

### Tests Timing Out
**Solution**: Increase timeout in cucumber.js configuration

### Context Issues
**Solution**: Ensure hooks are properly set up in `features/support/hooks.js`

## Integration with CI/CD

### GitHub Actions Example
```yaml
name: Cucumber Tests
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
      - run: npm run cucumber:all
      - uses: actions/upload-artifact@v2
        if: failure()
        with:
          name: cucumber-report
          path: cucumber-report.html
```

## Comparison: Playwright vs Cucumber

| Feature | Playwright | Cucumber |
|---------|-----------|----------|
| Syntax | JavaScript | Gherkin (English) |
| Learning Curve | Moderate | Steep |
| Non-Technical Support | Low | High |
| Flexibility | High | Medium |
| Reporting | Built-in | Can be enhanced |
| Test Execution | Direct | Via Step Definitions |

## Command Reference

```bash
# Run all tests
npm run cucumber:all

# Run specific profile
npm run cucumber:smoke
npm run cucumber:regression
npm run cucumber:api
npm run cucumber:negative
npm run cucumber:accessibility
npm run cucumber:debug

# Run specific scenario
npm run cucumber:movie
npm run cucumber:booking

# Generate reports
npm run cucumber:report

# Custom command
npx cucumber-js features/cinepolisindia.feature --tags @smoke
npx cucumber-js --profile smoke --retry 2
npx cucumber-js --dry-run
```

## Feature File Highlights

### 57 Total Scenarios

**Positive Tests**: 35
- Movie browsing and selection
- Location and theater selection
- Showtime display and selection
- Seat selection and booking
- Complete user journeys

**Negative Tests**: 10
- Invalid selections
- API failures
- Network errors
- Session timeout
- Security checks

**API & Integration Tests**: 4
- API data fetching
- Booking confirmation
- Error handling

**Advanced Tests**: 8
- Accessibility
- Performance
- Security
- User experience

## Next Steps

1. **Install Dependencies**
   ```bash
   npm install
   npx playwright install
   ```

2. **Run Smoke Tests**
   ```bash
   npm run cucumber:smoke
   ```

3. **View Reports**
   ```bash
   npm run cucumber:report
   ```

4. **Run All Tests**
   ```bash
   npm run cucumber:all
   ```

5. **Add New Scenarios**
   - Edit `features/cinepolisindia.feature`
   - Add step implementations in `features/step_definitions/cinepolisindia.steps.js`

## Resources

- [Cucumber.js Documentation](https://github.com/cucumber/cucumber-js)
- [Gherkin Syntax Guide](https://cucumber.io/docs/gherkin/)
- [Playwright Documentation](https://playwright.dev/)
- [BDD Best Practices](https://cucumber.io/docs/bdd/)

## Support

For issues or questions:
1. Check feature file for scenario description
2. Review step implementations
3. Check browser console for errors
4. Review HTML report for failed steps
5. Run in debug mode: `npm run cucumber:debug`

---

**Version**: 1.0.0
**Last Updated**: 2026-04-29
**Test Framework**: Cucumber.js + Playwright
**Status**: ✅ Production Ready
