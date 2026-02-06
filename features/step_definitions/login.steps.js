const { Given, When, Then, Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');

setDefaultTimeout(30000);
const LoginPage = require('../../pages/loginpage');
const Homepage = require('../../pages/hompage');
const testData = require('../../utilities/testData.json');

let browser, page, loginPage, homepage;

Before(async function() {
    browser = await chromium.launch();
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    homepage = new Homepage(page);
});

After(async function() {
    await browser.close();
});

Given('user navigates to the login page', async function() {
    await page.goto('http://localhost:4000');
    await page.waitForLoadState('networkidle');
});

When('user enters email {string}', async function(email) {
    await loginPage.fillEmail(email);
});

When('user enters password {string}', async function(password) {
    await loginPage.fillPassword(password);
});

When('user clicks the login button', async function() {
    await loginPage.clickLoginButton();
});

Then('user should be logged in successfully', async function() {
    await page.waitForTimeout(2000);
    const url = page.url();
    if(!url.includes('home')) {
        throw new Error('Login failed - not redirected to home page');
    }
});

Given('user is logged in', async function() {
    await page.goto('http://localhost:4000');
    await loginPage.loginUser('gautammarathe15@gmail.com', 'Password@15');
    await page.waitForTimeout(2000);
});

Given('user navigates to homepage', async function() {
    await page.goto('http://localhost:4000/home');
    await page.waitForLoadState('networkidle');
});

When('user selects origin for {string}', async function (testNo) {
    const data = testData.find(d => d.TestNo === testNo);
    if (!data) throw new Error(`Test data for TestNo ${testNo} not found`);
    await homepage.selectOrigin(data.OriginCity);
});

When('user selects destination for {string}', async function (testNo) {
    const data = testData.find(d => d.TestNo === testNo);
    if (!data) throw new Error(`Test data for TestNo ${testNo} not found`);
    await homepage.selectDestination(data.DestinationCity);
});

When('user selects date as tomorrow', async function() {
    await homepage.selectDate();
});

When('user clicks search button', async function() {
    await homepage.clickSearchButton();
});

Then('search results should be displayed', async function() {
    await page.waitForTimeout(2000);
    const url = page.url();
    if(!url.includes('results')) {
        throw new Error('Search results page not displayed');
    }
});
