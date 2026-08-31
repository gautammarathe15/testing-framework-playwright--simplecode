/**
 * --------------------------------------------------------------------------
 * Cucumber Step Definitions for Master Module
 * File: features/step_definitions/master.steps.js
 * --------------------------------------------------------------------------
 */

const { Given, When, Then } = require('@cucumber/cucumber');
const { ContractorEmployeePage } = require('../../pages/mastermodule/contractorEmployee.js');
const { ContractorEmployeeDetailsPage } = require('../../pages/mastermodule/contractorEmployeeDetails.js');
// Helper function to safely retrieve or initialize the ContractorEmployeePage instance
function getPageInstance(world) {
    if (!world.contractorEmployeePage) {
        world.contractorEmployeePage = new ContractorEmployeePage(world.page);
    }
    return world.contractorEmployeePage;
}

function getDetailsPageInstance(world) {
    if (!world.contractorEmployeeDetailsPage) {
        world.contractorEmployeeDetailsPage = new ContractorEmployeeDetailsPage(world.page);
    }
    return world.contractorEmployeeDetailsPage;
}

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
    const pageInstance = getPageInstance(this);
    await pageInstance.clickCreateButton();
});

Then('User should see the Create and Upload options on the Contractor Employee page', async function () {
    const pageInstance = getPageInstance(this);
    await pageInstance.verifyCreateAndUploadOptionsVisible();
});

// Pop-up Navigation Steps
When('User clicks on the Close symbol on popup', async function () {
    const pageInstance = getPageInstance(this);
    await pageInstance.clickCloseSymbol();
});

When('User clicks on the Close button on popup', async function () {
    const pageInstance = getPageInstance(this);
    await pageInstance.clickCloseButton();
});

Then('User should see the Create button on the Contractor Employee page', async function () {
    const pageInstance = getPageInstance(this);
    await pageInstance.verifyCreateButtonVisible();
});

Then('User should see the Upload button on the Contractor Employee page', async function () {
    const pageInstance = getPageInstance(this);
    await pageInstance.verifyUploadButtonVisible();
});

// Identity Card & Verification Field Steps
Then('User verifies identity card input field is visible', async function () {
    const pageInstance = getPageInstance(this);
    await pageInstance.verifyAadhaarInputVisible();
});

Then('User verifies Aadhaar Card input field is visible', async function () {
    const pageInstance = getPageInstance(this);
    await pageInstance.verifyAadhaarInputVisible();
});

When('User enters identity number {string}', async function (identityNumber) {
    let finalIdNumber = identityNumber;
    
    // Auto-generate a 12-digit number starting specifically with '88'
    if (identityNumber === '[Auto_Generated]') {
        const random10Digits = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        finalIdNumber = `80${random10Digits}`;
    }
    this.createdIdentityNumber = finalIdNumber;
    
    console.log(`🔑 Generated Identity Number starting with 88: ${finalIdNumber}`);
    
    const pageInstance = getPageInstance(this);
    await pageInstance.enterAadhaarNumber(finalIdNumber);
});

When('User enters Aadhaar number {string}', async function (aadhaarNo) {
    const pageInstance = getPageInstance(this);
    await pageInstance.enterAadhaarNumber(aadhaarNo);
});

When('User clicks on the Verify link if visible', async function () {
    const pageInstance = getPageInstance(this);
    await pageInstance.clickVerifyLinkIfVisible();
});

// Form Options & Verification Steps
Then('User should see Submit and Skip Verification options and click Skip Verification', async function () {
    const pageInstance = getPageInstance(this);
    await pageInstance.verifyButtonsAndClickSkipVerification();
});

// ==========================================================================
// NEW STEPS: End-to-End Form Submission & Grid Search Verification (FIXED)
// ==========================================================================
When('User fills all required deployment details and submits the form', async function () {
    const detailsPage = getDetailsPageInstance(this);

    await detailsPage.fillPersonalMandatoryDetails('TestUser', 'Automation', 'M', '18/11/2001');
    await detailsPage.fillContractPeriodDetails('18-03-2026', 30);
    await detailsPage.selectMandatoryDropdowns();
    await detailsPage.scrollToSaveAndClick();
    
    await detailsPage.verifySaveSuccess();
});

Then('User searches created employee by identity number in grid', { timeout: 90000 }, async function () {
    const pageInstance = getPageInstance(this);
    await pageInstance.searchByAadhaarNumber(this.createdIdentityNumber);
});

Then('The grid should display employee record matching created identity number', { timeout: 90000 }, async function () {
    const verifyId = this.createdIdentityNumber;
    console.log(`✅ Verifying record in grid for identity number: ${verifyId}`);
    
    const pageInstance = getPageInstance(this);
    await pageInstance.verifyAadhaarInGrid(verifyId);
});
When('User clicks on OK button on success popup', async function () {
    
    const okButton = this.page.locator('button.swal2-confirm, button:has-text("OK"), div.sa-button-container button.confirm').first();
    
    if (await okButton.isVisible({ timeout: 5000 })) {
        await okButton.click({ force: true });
        await this.page.waitForTimeout(1000); 
    }
});