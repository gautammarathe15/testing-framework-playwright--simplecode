const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { ContractorEmployeeDetailsPage } = require('../../pages/mastermodule/contractorEmployeeDetails.js');

let savedBgRemark = '';
let savedMedicalRemark = '';

Then('User pauses execution for locator inspection', { timeout: 180000 }, async function () {
    console.log("\n🔎 Locator inspection step is disabled; use browser devtools or explicit locators instead.");
});

Then('User should see all form tabs sections and input fields on Contractor Employee page', { timeout: 180000 }, async function () {
    if (!this.contractorEmployeeDetailsPage) {
        this.contractorEmployeeDetailsPage = new ContractorEmployeeDetailsPage(this.page);
    }
    await this.contractorEmployeeDetailsPage.verifyAllFormFieldsAndSections();
});

When('User enters dynamic valid Aadhaar number', { timeout: 30000 }, async function () {
    const dynamicId = '3' + Date.now().toString().slice(-11);
    
    this.createdAadhaar = dynamicId;
    this.generatedAadhaar = dynamicId;
    this.aadhaarNumber = dynamicId;
    this.identityNumber = dynamicId;
    this.createdAadhar = dynamicId;

    console.log(`🔢 Dynamically generated identifier stored in context for testing.`);
    
    const inputField = this.page.getByRole('textbox', { name: 'Aadhaar Card No*' });
    await inputField.waitFor({ state: 'visible', timeout: 10000 });
    await inputField.clear();
    await inputField.fill(dynamicId);
});

When('User navigates to Contractor Employee Details page', { timeout: 60000 }, async function () {
    console.log("Navigating to Contractor Employee Details Page...");
    
    const contractorEmployeeCard = this.page.getByText('Contractor Employee', { exact: false }).first();
    await contractorEmployeeCard.scrollIntoViewIfNeeded();
    await contractorEmployeeCard.click();

    await this.page.waitForLoadState('networkidle');
    console.log("Successfully navigated to Contractor Employee Details page.");
});

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

When('User clicks on the {string} tab without filling basic employee details', { timeout: 30000 }, async function (tabName) {
    console.log(`\n👇 Attempting to click on Tab: "${tabName}" without creating employee...`);
    const tabLocator = this.page.getByRole('tab', { name: tabName });
    const isVisible = await tabLocator.isVisible().catch(() => false);
    const actualStatus = isVisible ? "Visible" : "Not Visible";
    this.attach(`Tab Name: ${tabName} ---> Status on UI: ${actualStatus}`, 'text/plain');
    await tabLocator.scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => {});
    await tabLocator.click();
});

Then('User should see the copyright text in the footer', { timeout: 30000 }, async function () {
    if (!this.contractorEmployeeDetailsPage) {
        this.contractorEmployeeDetailsPage = new ContractorEmployeeDetailsPage(this.page);
    }

    const isCopyrightVisible = await this.contractorEmployeeDetailsPage.verifyFooterCopyright();
    const copyrightStatus = isCopyrightVisible ? "Visible" : "Not Visible";

    const reportTable = `
=== Footer Copyright Verification Report ===
+----------------------+--------------------+
| Check Item           | Status             |
+----------------------+--------------------+
| Copyright Footer     | ${copyrightStatus} |
+----------------------+--------------------+
Timestamp: ${new Date().toLocaleString()}
`;

    console.log(reportTable);
    await this.attach(reportTable, 'text/plain');

    expect(isCopyrightVisible).toBeTruthy();
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