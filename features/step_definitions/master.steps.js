/**
 * --------------------------------------------------------------------------
 * Cucumber Step Definitions for Master Module
 * File: features/step_definitions/master.steps.js
 * --------------------------------------------------------------------------
 */

const { Given, When, Then } = require('@cucumber/cucumber');
const { ContractorEmployeePage } = require('../../pages/mastermodule/contractorEmployee.js');

When('User clicks on the Contractor Employee menu option', { timeout: 120000 }, async function () {
    const currentUrl = this.page.url();
    let targetUrl;

    if (currentUrl.includes('/app/')) {
        const baseUrl = currentUrl.substring(0, currentUrl.indexOf('/app/'));
        targetUrl = `${baseUrl}/app/Employee/Index`;
    } else {
        targetUrl = 'http://192.168.40.115/CLMS_ENT_5.5/app/Employee/Index';
    }

    await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    this.contractorEmployeePage = new ContractorEmployeePage(this.page);
});

When('User clicks on the Create button', { timeout: 60000 }, async function () {
    if (!this.contractorEmployeePage) {
        this.contractorEmployeePage = new ContractorEmployeePage(this.page);
    }
    await this.contractorEmployeePage.clickCreateButton();
});

Then('User should see the Create and Upload options on the Contractor Employee page', async function () {
    await this.contractorEmployeePage.verifyCreateAndUploadOptionsVisible();
});

// Pop-up Steps
When('User clicks on the Close symbol on popup', async function () {
    await this.contractorEmployeePage.clickCloseSymbol();
});

When('User clicks on the Close button on popup', async function () {
    await this.contractorEmployeePage.clickCloseButton();
});

Then('User should see the Create button on the Contractor Employee page', async function () {
    await this.contractorEmployeePage.verifyCreateButtonVisible();
});

Then('User should see the Upload button on the Contractor Employee page', async function () {
    await this.contractorEmployeePage.verifyUploadButtonVisible();
});

// Dynamic Aadhaar Input Steps
Then('User verifies Aadhaar Card input field is visible', async function () {
    await this.contractorEmployeePage.verifyAadhaarInputVisible();
});

When('User enters Aadhaar number {string}', async function (aadhaarNo) {
    if (!this.contractorEmployeePage) {
        this.contractorEmployeePage = new ContractorEmployeePage(this.page);
    }
    await this.contractorEmployeePage.enterAadhaarNumber(aadhaarNo);
});

When('User clicks on the Verify link if visible', async function () {
    await this.contractorEmployeePage.clickVerifyLinkIfVisible();
});

// Submit आणि Skip Verification व्हॅलिडेशन स्टेप
Then('User should see Submit and Skip Verification options and click Skip Verification', async function () {
    if (!this.contractorEmployeePage) {
        this.contractorEmployeePage = new ContractorEmployeePage(this.page);
    }
    await this.contractorEmployeePage.verifyButtonsAndClickSkipVerification();
});

Then('Playwright Inspector should open for further recording', { timeout: 300000 }, async function () {
    console.log("⏸️ Opening Playwright Inspector...");
    await this.page.pause();
});