/**
 * --------------------------------------------------------------------------
 * Step Definitions - Contractor Employee Form Details
 * File: features/step_definitions/contractorEmployeeDetails.steps.js
 * --------------------------------------------------------------------------
 */

const { Given, When, Then } = require('@cucumber/cucumber');
const { ContractorEmployeeDetailsPage } = require('../../pages/mastermodule/contractorEmployeeDetails.js');

let savedBgRemark = '';
let savedMedicalRemark = '';

Then('User pauses execution for locator inspection', { timeout: 180000 }, async function () {
    console.log("\n⏸️ Opening Playwright Inspector for locator inspection...");
    await this.page.pause();
});

Then('User should see all form tabs sections and input fields on Contractor Employee page', { timeout: 180000 }, async function () {
    if (!this.contractorEmployeeDetailsPage) {
        this.contractorEmployeeDetailsPage = new ContractorEmployeeDetailsPage(this.page);
    }
    await this.contractorEmployeeDetailsPage.verifyAllFormFieldsAndSections();
});

// --- Dynamic Input Step (Replaces Hardcoded Values) ---

When('User enters dynamic valid Aadhaar number', { timeout: 30000 }, async function () {
    const dynamicId = '7' + Date.now().toString().slice(-11);
    
    console.log("🔢 Entering dynamically generated identifier for testing...");
    
    const inputField = this.page.getByRole('textbox', { name: 'Aadhaar Card No*' });
    await inputField.waitFor({ state: 'visible', timeout: 10000 });
    await inputField.clear();
    await inputField.fill(dynamicId);
});

// --- Navigation Step ---

When('User navigates to Contractor Employee Details page', { timeout: 60000 }, async function () {
    console.log("Navigating to Contractor Employee Details Page...");
    
    // 1. Locate and click on the Contractor Employee Card / Menu safely
    const contractorEmployeeCard = this.page.getByText('Contractor Employee', { exact: false }).first();
    await contractorEmployeeCard.scrollIntoViewIfNeeded();
    await contractorEmployeeCard.click();

    // 2. Wait for network state to settle after navigation
    await this.page.waitForLoadState('networkidle');
    console.log("Successfully navigated to Contractor Employee Details page.");
});

// --- Check Verification Steps ---

When('User expands the Check Verification section if collapsed', { timeout: 60000 }, async function () {
    if (!this.contractorEmployeeDetailsPage) {
        this.contractorEmployeeDetailsPage = new ContractorEmployeeDetailsPage(this.page);
    }
    await this.contractorEmployeeDetailsPage.expandVerificationSectionIfCollapsed();
});

Then('User verifies and interacts with Background Checked and Medical Check Up fields', { timeout: 60000 }, async function () {
    await this.contractorEmployeeDetailsPage.verifyAndInteractWithCheckboxes();
});

Then('User verifies editable remark fields with dynamic inputs:', { timeout: 60000 }, async function (dataTable) {
    const data = dataTable.rowsHash();
    savedBgRemark = data.remarkBackground;
    savedMedicalRemark = data.remarkMedical;

    await this.contractorEmployeeDetailsPage.fillAndVerifyRemarkFields(savedBgRemark, savedMedicalRemark);
});

When('User collapses the Check Verification section', { timeout: 63000 }, async function () {
    await this.contractorEmployeeDetailsPage.collapseVerificationSectionAndVerifyHidden();
});

Then('Verification sub-fields should not be visible', function () {
    console.log("✅ Verification section successfully collapsed.");
});

When('User expands the Check Verification section again', { timeout: 63000 }, async function () {
    await this.contractorEmployeeDetailsPage.expandAndVerifyRetainedData(savedBgRemark, savedMedicalRemark);
});

Then('Previously entered remark data should be retained', function () {
    console.log("✅ All step assertions passed successfully.");
});

Then('User verifies retained remark fields can be edited with updated inputs:', { timeout: 60000 }, async function (dataTable) {
    const data = dataTable.rowsHash();
    const updatedBg = data.updatedBgRemark;
    const updatedMedical = data.updatedMedicalRemark;

    await this.contractorEmployeeDetailsPage.verifyAndEditRetainedData(updatedBg, updatedMedical);
});

// =========================================================================
// --- Unsaved Employee Tab Validation Steps (New Scenario Outline Steps) ---
// =========================================================================

When('User clicks on the {string} tab without filling basic employee details', { timeout: 30000 }, async function (tabName) {
    console.log(`\n👇 Attempting to click on Tab: "${tabName}" without creating employee...`);
    const tabLocator = this.page.getByRole('tab', { name: tabName });
    await tabLocator.scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => {});
    await tabLocator.click();
});

Then('A validation popup with message {string} should appear', { timeout: 30000 }, async function (expectedMessage) {
    console.log(`🔍 Asserting presence of validation popup with text: "${expectedMessage}"`);
    const popupTextLocator = this.page.getByText(expectedMessage);
    await popupTextLocator.waitFor({ state: 'visible', timeout: 5000 });
});

Then('User clicks the {string} button on the popup to dismiss it', { timeout: 30000 }, async function (buttonName) {
    console.log(`🔘 Clicking "${buttonName}" button to clear popup...`);
    const okButton = this.page.getByRole('button', { name: buttonName });
    await okButton.click();
    await okButton.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
});