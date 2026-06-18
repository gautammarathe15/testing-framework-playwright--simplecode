const { Before, After, Given, Then, When } = require('@cucumber/cucumber');
const BrowserManager = require('../utilities/browserManager');
const OneMgPage = require('../pages/oneMgPage');

let oneMgPage;

Before(async function () {
  // Launch browser before each scenario
  await BrowserManager.launchBrowser();
  oneMgPage = new OneMgPage();
  await oneMgPage.initPage();
});

After(async function () {
  // Close browser after each scenario
  await BrowserManager.closeBrowser();
});

/**
 * Step Definition: User navigates to 1mg website
 */
Given('User navigates to 1mg website', async function () {
  await oneMgPage.navigateToHomepage();
  console.log('✓ Successfully navigated to 1mg.com');
});

/**
 * Step Definition: User should see 1mg homepage loaded successfully
 */
Then('User should see 1mg homepage loaded successfully', async function () {
  const isLoaded = await oneMgPage.isHomepageLoaded();
  
  if (!isLoaded) {
    throw new Error('Homepage did not load successfully');
  }

  // Additional validations
  const pageTitle = await oneMgPage.getPageTitle();
  const currentUrl = await oneMgPage.getCurrentUrl();
  const isSearchVisible = await oneMgPage.isSearchBoxVisible();

  console.log(`✓ Page Title: ${pageTitle}`);
  console.log(`✓ Current URL: ${currentUrl}`);
  console.log(`✓ Search Box Visible: ${isSearchVisible}`);
  console.log('✓ 1mg homepage loaded successfully');
});

/**
 * Optional: Additional step definitions for future use
 */
When('User searches for {string}', async function (searchTerm) {
  const searchBox = await oneMgPage.findElement(oneMgPage.SEARCH_BOX_SELECTOR);
  await searchBox.fill(searchTerm);
  await oneMgPage.page.press(oneMgPage.SEARCH_BOX_SELECTOR, 'Enter');
  console.log(`✓ Searched for: ${searchTerm}`);
});


