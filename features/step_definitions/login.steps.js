/**
 * --------------------------------------------------------------------------
 * Cucumber Step Definitions for Login Module
 * File: features/step_definitions/login.steps.js
 * --------------------------------------------------------------------------
 */

const { Given, When, Then } = require('@cucumber/cucumber');
const { CLMSLoginPage } = require('../../pages/clmslogin.js');
const { CLMSDashboardPage } = require('../../pages/clmsdashboard.js');
const testData = require('../../utilities/testData.json');

// 1. Open Login Page
Given('User is on the CLMS Login Page', { timeout: 30000 }, async function () {
    this.clmsLoginPage = new CLMSLoginPage(this.page);
    await this.clmsLoginPage.openUrl();
});

Given('User opens the CLMS login application page', { timeout: 30000 }, async function () {
    this.clmsLoginPage = new CLMSLoginPage(this.page);
    await this.clmsLoginPage.openUrl();
});

// 2. Parameterized / Dynamic Login Step
When('User enters username {string} and password {string}', async function (username, password) {
    if (!this.clmsLoginPage) {
        this.clmsLoginPage = new CLMSLoginPage(this.page);
    }

    // Preserve exact strings passed from Cucumber (including empty strings for negative testing)
    const finalUser = username !== undefined ? username : '';
    const finalPass = password !== undefined ? password : '';

    console.log(`🔑 Using provided credentials: Username = "${finalUser}", Password = "${finalPass}"`);

    await this.clmsLoginPage.enterUsername(finalUser);
    await this.clmsLoginPage.enterPassword(finalPass);
});

// 3. Click Login Button
When('User clicks on the Login button', { timeout: 30000 }, async function () {
    if (!this.clmsLoginPage) {
        this.clmsLoginPage = new CLMSLoginPage(this.page);
    }
    await this.clmsLoginPage.clickLoginButton();
});

// 4. UI Validations
Then('User verifies that the Username input field is visible and editable', async function () {
    if (!this.clmsLoginPage) this.clmsLoginPage = new CLMSLoginPage(this.page);
    await this.clmsLoginPage.verifyUsernameFieldVisible();
});

Then('User verifies that the Password input field is visible and editable', async function () {
    if (!this.clmsLoginPage) this.clmsLoginPage = new CLMSLoginPage(this.page);
    await this.clmsLoginPage.verifyPasswordFieldVisible();
});

// 5. Dashboard Navigation Check
Then('User should be navigated to the main application dashboard', { timeout: 30000 }, async function () {
    this.clmsDashboardPage = new CLMSDashboardPage(this.page);
    await this.clmsDashboardPage.verifyDashboardLanding();
});

// 6. Error Message Validation
Then('User should see an appropriate authentication error message', { timeout: 15000 }, async function () {
    if (!this.clmsLoginPage) this.clmsLoginPage = new CLMSLoginPage(this.page);
    await this.clmsLoginPage.verifyErrorMessage();
});