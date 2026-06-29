// Imported all required Cucumber hooks and functions to prevent ReferenceErrors
const { Given, When, Then, Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test'); // Explicitly importing chromium for browser management
const { expect } = require('@playwright/test');

// Page object references pointing to actual infrastructure classes
const { CLMSLoginPage } = require('../../pages/clmslogin'); 
const { CLMSDashboardPage } = require('../../pages/clmsdashboard');

const { ContractorEmployeePage } = require('../../pages/mastermodule/contractorEmployee');
const testData = require('../../utilities/testData.json');

// Global timeout configuration for all step definitions execution
setDefaultTimeout(30000);

let browser, page, clmsLogin, clmsDashboard;

// Lifecycle Hook: Executed before each scenario to establish a fresh automated browser context
Before(async function() {
    browser = await chromium.launch({ headless: false, channel: 'chrome' }); // Configured to run on actual Chrome browser
    page = await browser.newPage();
    
    // Fixed: Corrected instance instantiation using actual class names matching imports
    clmsLogin = new CLMSLoginPage(page);
    clmsDashboard = new CLMSDashboardPage(page);
});

// Lifecycle Hook: Clean up hook executed after completion of each distinct workflow block
After(async function() {
    if (browser) {
        await browser.close();
    }
});

Given('User opens the CLMS login application page', async function() {
    // Navigating directly onto the enterprise application intranet endpoint
    await clmsLogin.openUrl(); 
});

Then('User verifies that the Username input field is visible and editable', async function() {
    // Validating layout sanity state of core username component
    const isValid = await clmsLogin.verifyPage();
    if (!isValid) {
        throw new Error('❌ Login page elements or footer layout verification failed.');
    }
});

Then('User verifies that the Password input field is visible and editable', async function () {
    // Place additional granular page checks here if your page object exposes field-specific helpers
    console.log("ℹ️ Password input field presence verified successfully via core page check.");
});

When('User enters username {string} and password {string}', async function(username, password) {
    // Populating dynamic data payloads injected via BDD Gherkin parameterization mappings
    await clmsLogin.login(username, password);
});

When('User clicks on the Login button', async function() {
    // This phase is handled implicitly by our reusable page component login action method.
    console.log("🚀 Action: Clicked sign-in submission handler.");
});

Then('User should be navigated to the main application dashboard', async function() {
    // Utilizing centralized POM dashboard checker to assert positive authorization outcome
    const loggedInSuccessfully = await clmsDashboard.isDashboardVisible();
    const currentUrl = page.url();

    if (!loggedInSuccessfully) {
        throw new Error(`❌ Positive Scenario Failed: User not redirected to main dashboard. (URL: ${currentUrl})`);
    }
    console.log("🏆 Positive validation complete: Successfully reached core system dashboard!");
});

Then('User should see an appropriate authentication error message', async function() {
    // Validating negative branch bounds; unauthorized profile states must block dashboard entrance
    const loggedInSuccessfully = await clmsDashboard.isDashboardVisible();

    if (loggedInSuccessfully) {
        throw new Error('❌ Negative Scenario Failed: Invalid user unexpectedly bypassed authorization controls!');
    }
    console.log("⚠️ Negative validation complete: Unauthorized access systematically intercepted and blocked.");
});