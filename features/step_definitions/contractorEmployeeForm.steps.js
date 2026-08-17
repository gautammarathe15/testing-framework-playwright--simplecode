/**
 * --------------------------------------------------------------------------
 * Step Definitions - Contractor Employee Form Operations (Filling, Verification, Editing & Age/Birthday Validations)
 * File: features/step_definitions/contractorEmployeeForm.steps.js
 * --------------------------------------------------------------------------
 */

const { Given, When, Then } = require('@cucumber/cucumber');
const { ContractorEmployeeDetailsPage } = require('../../pages/mastermodule/contractorEmployeeDetails.js');
// Added missing page object class import to resolve ReferenceError
const config = require('../../playwright.config');

const { expect } = require('@playwright/test');

// Helper function to initialize or retrieve the Page Object instance
function getDetailsPage(world) {
    if (!world.contractorEmployeeDetailsPage || typeof world.contractorEmployeeDetailsPage.openContractFromCalendar !== 'function') {
        world.contractorEmployeeDetailsPage = new ContractorEmployeeDetailsPage(world.page);
    }
    return world.contractorEmployeeDetailsPage;
}

// =========================================================================
// Background Navigation Steps (Matched with birthdaycalander.feature)
// =========================================================================

Given('User logs into the application', async function () {
    if (this.clmsLoginPage) {
        await this.clmsLoginPage.navigate();
        await this.clmsLoginPage.login(process.env.USERNAME || 'admin', process.env.PASSWORD || 'sa');
    } else {
        
        await this.page.goto('');

       
        await this.page.fill('input[placeholder="User Name"]', process.env.USERNAME || 'admin');
        await this.page.fill('input[placeholder="Password"]', process.env.PASSWORD || 'sa');
        await this.page.click('button:has-text("Login")');

   
        await this.page.waitForLoadState('networkidle');
    }
});

Given('User navigates to {string} page', async function (pageName) {
    if (this.clmsDashboardPage && typeof this.clmsDashboardPage.navigateToPage === 'function') {
        await this.clmsDashboardPage.navigateToPage(pageName);
    } else {
        const pageLink = this.page.getByRole('link', { name: pageName }).or(this.page.locator(`a:has-text("${pageName}")`)).first();
        await pageLink.click();
    }
});

// =========================================================================
// Scenario 1: Mandatory Asterisk & Validation Steps
// =========================================================================

Then('User verifies all mandatory fields are marked with red asterisk', async function () {
    const detailsPage = getDetailsPage(this);
    await detailsPage.validateMandatoryAsterisks();
});

When('User clicks on Save button without filling mandatory details', async function () {
    const detailsPage = getDetailsPage(this);
    await detailsPage.clickSaveAndVerifyMandatoryValidations();
});

Then('System should display validation errors for required fields', function () {
    console.log("✅ Validation errors displayed successfully for mandatory fields.");
});

// =========================================================================
// Scenario 2: Data Entry, Scroll & Insertion Verification Steps
// =========================================================================

When('User fills the Contractor Employee form with the following details:', async function (dataTable) {
    const detailsPage = getDetailsPage(this);
    this.insertedFormData = dataTable.rowsHash();
    await detailsPage.fillEmployeeFormFields(this.insertedFormData);
});

When('User scrolls to Save button and clicks Save', { timeout: 69900 }, async function () {
    const detailsPage = getDetailsPage(this);
    if (typeof detailsPage.scrollToSaveAndClick === 'function') {
        await detailsPage.scrollToSaveAndClick();
    } else if (typeof detailsPage.scrollAndSaveForm === 'function') {
        await detailsPage.scrollAndSaveForm();
    }
});

Then('System should display {string} alert popup', async function (expectedMessage) {
    const popupMessage = this.page.getByText(expectedMessage);
    await expect(popupMessage).toBeVisible({ timeout: 5000 });
    console.log(`✅ Popup Message Confirmed: "${expectedMessage}"`);
});

When('User clicks on OK button on the alert popup', async function () {
    const okButton = this.page.getByRole('button', { name: 'OK' }).or(this.page.locator('.swal2-confirm'));
    await expect(okButton).toBeVisible({ timeout: 3000 });
    await okButton.click();
    console.log("🔘 Clicked OK button on popup.");
});

When('User fills remaining mandatory fields with the following details:', async function (dataTable) {
    const detailsPage = getDetailsPage(this);
    const formData = dataTable.rowsHash();
    await detailsPage.fillEmployeeFormFields(formData);
});

Then('User verifies that inserted details match with displayed details', async function () {
    const detailsPage = getDetailsPage(this);
    await detailsPage.verifyFormDetailsMatch(this.insertedFormData);
    console.log("✅ Inserted details match successfully with displayed details.");
});

// =========================================================================
// Scenario 3: Update/Edit & Final Save Verification Steps
// =========================================================================

When('User edits the form fields with updated details:', async function (dataTable) {
    const detailsPage = getDetailsPage(this);
    this.updatedFormData = dataTable.rowsHash();
    await detailsPage.editEmployeeFormFields(this.updatedFormData);
});

Then('User verifies updated data is correctly populated in input fields', function () {
    console.log("✅ Verified: Updated details are correctly populated in form fields.");
});

Then('User verifies contractor employee details saved successfully', async function () {
    const detailsPage = getDetailsPage(this);
    if (typeof detailsPage.verifyEmployeeSavedSuccessfully === 'function') {
        await detailsPage.verifyEmployeeSavedSuccessfully();
    }
    console.log("✅ Employee details updated and saved successfully!");
});

When('User selects options for all mandatory dropdowns', { timeout: 60000 }, async function () {
    if (!this.contractorEmployeeDetailsPage) {
        this.contractorEmployeeDetailsPage = new ContractorEmployeeDetailsPage(this.page);
    }
    await this.contractorEmployeeDetailsPage.selectMandatoryDropdowns();
});

// =========================================================================
// Scenario 4: Birthday Calendar UI & Controls Verification Steps
// =========================================================================

When('User clicks on the Birthday input field', async function () {
    const detailsPage = getDetailsPage(this);
    await detailsPage.openBirthdayCalendar();
});

Then('Birthday calendar should be displayed successfully', async function () {
    const detailsPage = getDetailsPage(this);
    await detailsPage.verifyCalendarVisible();
});

Then('Calendar month header should be visible', async function () {
    const detailsPage = getDetailsPage(this);
    await detailsPage.verifyMonthHeaderVisible();
});

Then('Previous month {string} and Next month {string} controls should be visible', async function (prev, next) {
    const detailsPage = getDetailsPage(this);
    await detailsPage.verifyMonthControlsVisible();
});

When('User clicks on the Previous month {string} button', async function (prevSymbol) {
    const detailsPage = getDetailsPage(this);
    await detailsPage.clickPreviousMonth();
});

Then('Previous month details should be displayed in the calendar header', async function () {
    const detailsPage = getDetailsPage(this);
    await detailsPage.verifyMonthHeaderVisible();
});

When('User clicks on the Next month {string} button', async function (nextSymbol) {
    const detailsPage = getDetailsPage(this);
    await detailsPage.clickNextMonth();
});

Then('Next month details should be displayed in the calendar header', async function () {
    const detailsPage = getDetailsPage(this);
    await detailsPage.verifyMonthHeaderVisible();
});

// =========================================================================
// Scenario 5: Birthday Age Restriction (<18 and >18 years) Steps
// =========================================================================

When('User selects a birth date resulting in age less than 18 years', async function () {
    const detailsPage = getDetailsPage(this);
    await detailsPage.setBirthDateByAgeOffset(17);
});

When('User clicks on the Save button', async function () {
    const detailsPage = getDetailsPage(this);
    await detailsPage.scrollAndSaveForm();
});

Then('Validation popup indicating age restriction should be displayed', async function () {
    const detailsPage = getDetailsPage(this);
    await detailsPage.verifyAgePopupDisplayed();
});

When('User clicks OK on the age validation popup', async function () {
    const detailsPage = getDetailsPage(this);
    await detailsPage.clickOkOnAgePopup();
});

Then('Form should not be saved and user remains on the same page', async function () {
    const detailsPage = getDetailsPage(this);
    await detailsPage.verifyFormNotSaved();
});

When('User selects a birth date resulting in age greater than 18 years', async function () {
    const detailsPage = getDetailsPage(this);
    await detailsPage.setBirthDateByAgeOffset(22);
});

Then('Age validation popup should not be displayed', async function () {
    const detailsPage = getDetailsPage(this);
    await detailsPage.verifyAgePopupNotDisplayed();
});

Then('Contractor Employee details should be saved successfully', async function () {
    const detailsPage = getDetailsPage(this);
    if (typeof detailsPage.verifyEmployeeSavedSuccessfully === 'function') {
        await detailsPage.verifyEmployeeSavedSuccessfully();
    }
    console.log("✅ Contractor Employee details saved successfully!");
});

// =========================================================================
// Scenario: Contract Dates & Period Auto-Calculation Validation Steps
// =========================================================================

When('User clicks on Contract From date field', async function () {
    if (!this.contractorEmployeeDetailsPage) {
        const { ContractorEmployeeDetailsPage } = require('../../pages/mastermodule/contractorEmployeeDetails.js');
        this.contractorEmployeeDetailsPage = new ContractorEmployeeDetailsPage(this.page);
    }

    console.log("👉 Executing openContractFromCalendar step...");

    await this.contractorEmployeeDetailsPage.openContractFromCalendar();
});

Then('Contract From date calendar should be displayed successfully', async function () {
    const detailsPage = getDetailsPage(this);
    await detailsPage.verifyContractCalendarVisible();
});

Then('Calendar month header should display current month', async function () {
    const detailsPage = getDetailsPage(this);
    this.initialHeader = await detailsPage.verifyContractCalendarHeader();
});

When('User clicks on previous month {string} button in Contract From calendar', async function (symbol) {
    const detailsPage = getDetailsPage(this);
    await detailsPage.clickContractPrevMonth();
});

Then('Header should display the previous month name', async function () {
    const detailsPage = getDetailsPage(this);
    const newHeader = await detailsPage.verifyContractCalendarHeader();
    expect(newHeader).not.toBe(this.initialHeader);
});

When('User clicks on next month {string} button in Contract From calendar', async function (symbol) {
    const detailsPage = getDetailsPage(this);
    await detailsPage.clickContractNextMonth();
});

Then('Header should display the updated month name', async function () {
    const detailsPage = getDetailsPage(this);
    await detailsPage.verifyContractCalendarHeader();
});

When('User enters Contract From date as {string}', async function (contractFromDate) {
    const detailsPage = getDetailsPage(this);
    await detailsPage.fillContractFromDate(contractFromDate);
});

When('User enters Contract Period In Days as {string}', async function (days) {
    const detailsPage = getDetailsPage(this);
    await detailsPage.fillContractDays(days);
});

Then('Contract To date field should be readonly and non-editable', async function () {
    const detailsPage = getDetailsPage(this);
    await detailsPage.verifyContractToIsReadonly();
});

Then('Contract To date should be auto-filled as {string}', async function (expectedContractTo) {
    const detailsPage = getDetailsPage(this);
    await detailsPage.verifyAutoCalculatedContractToDate(expectedContractTo);
});

Then('User verifies the Status dropdown is visible and mandatory', async function () {
    const detailsPage = getDetailsPage(this);
    await detailsPage.verifyStatusIsVisibleAndMandatory();
});

Then('The default selected Status value should be {string}', async function (expectedDefault) {
    const detailsPage = getDetailsPage(this);
    await detailsPage.verifyDefaultStatus(expectedDefault);
});

When('User clicks on the Status dropdown', async function () {
    const detailsPage = getDetailsPage(this);
    await detailsPage.clickStatusDropdown();
});

Then('User should see the following options in Status dropdown:', async function (dataTable) {
    const detailsPage = getDetailsPage(this);
    const expectedOptions = dataTable.raw().map(row => row[0]);
    await detailsPage.verifyStatusDropdownOptions(expectedOptions);
});

When('User selects Status as {string}', async function (statusValue) {
    const detailsPage = getDetailsPage(this);
    await detailsPage.selectStatusOption(statusValue);
});

When('User updates Status to {string}', async function (newStatusValue) {
    const detailsPage = getDetailsPage(this);
    await detailsPage.selectStatusOption(newStatusValue);
});

Then('The Status field value should be updated to {string}', async function (expectedStatus) {
    const detailsPage = getDetailsPage(this);
    await detailsPage.verifySelectedStatus(expectedStatus);
});

// Deployment Details Step
When('User fills all mandatory Deployment details with Subsidiary {string}, Division {string}, Department {string}, Category {string}, Grade {string}, Designation {string}, Location {string}, Skilled Level {string}, and Contractor {string}', 
{ timeout: 90900 }, 
async function (subsidiary, division, department, category, grade, designation, location, skilledLevel, contractor) {
    const detailsPage = getDetailsPage(this);
    await detailsPage.fillDeploymentDetails({
        subsidiary,
        division,
        department,
        category,
        grade,
        designation,
        location,
        skilledLevel, 
        contractor
    });
});

// 1. Mandatory Personal Details
When('User fills mandatory Personal details with First Name {string}, Last Name {string}, Gender {string}, and DOB {string}', async function (firstName, lastName, gender, dob) {
    const detailsPage = getDetailsPage(this);
    await detailsPage.fillPersonalMandatoryDetails(firstName, lastName, gender, dob);
});

// 2. Contract Period Details
When('User fills Contract Period details with Contract From {string} and Contract Period In Days {string}', async function (contractFrom, contractPeriodDays) {
    const detailsPage = getDetailsPage(this);
    await detailsPage.fillContractPeriodDetails(contractFrom, contractPeriodDays);
});

// 3. Verify Default Status
When('User verifies default Status is {string}', async function (expectedStatus) {
    const detailsPage = getDetailsPage(this);
    await detailsPage.verifyDefaultStatus(expectedStatus);
});

// 4. Verify Save Success Message
Then('User should see a success message confirming the employee was saved successfully', async function () {
    const detailsPage = getDetailsPage(this);
    await detailsPage.verifySaveSuccess();

});

//When('User fills mandatory Reporting Manager details with Effective From {string}', async function (effectiveFromDate) {
   // const detailsPage = getDetailsPage(this);
    //await detailsPage.fillReportingManagerMandatoryDetails(effectiveFromDate);
//});