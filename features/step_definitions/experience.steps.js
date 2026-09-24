const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const ExperiencePage = require('../../pages/experience');

let experiencePage;

When('User clicks on the "Experience" tab', async function () {
    experiencePage = new ExperiencePage(this.page);
    await experiencePage.clickExperienceTab();
});

When('User clicks on the Create option in Experience tab', async function () {
    await experiencePage.clickCreate();
});

When('User enters Company Name {string} in Experience form', async function (companyName) {
    await experiencePage.enterCompanyName(companyName);
});

When('User selects today\'s date in From Date calendar', async function () {
    await experiencePage.selectDates();
});

When('User selects next one year date in To Date calendar', async function () {
});

When('User enters Designation {string}', async function (designation) {
    await experiencePage.enterDesignation(designation);
});

When('User checks the HR Verified checkbox', async function () {
    await experiencePage.checkHRVerified();
});

When('User unchecks the HR Verified checkbox', async function () {
    await experiencePage.uncheckHRVerified();
});

When('User checks the All Skill Set checkbox', async function () {
    await experiencePage.toggleAllSkillSet();
});

When('User unchecks the Low-Skilled checkbox', async function () {
    await experiencePage.uncheckLowSkilled();
});

Then('All skill set checkboxes (High, Low, Mid-Skilled) should be automatically selected', async function () {
    const areChecked = await experiencePage.verifySkillsAutoSelected();
    expect(areChecked).toBeTruthy();
});

When('User clicks on the Save button for Experience', async function () {
    await experiencePage.handleBrowserDialog();
    await experiencePage.clickSave();

    this.attach(JSON.stringify({
        ActionType: "NEW EXPERIENCE ENTRY (ADD)",
        CompanyName: "Nilkamal Furniture",
        Dates: "Dynamic (From 1 year prior to Join Date up to Join Date - 1)",
        Designation: "finance regional manager",
        SkillsSelected: "All (High, Low, Mid-Skilled)",
        HRVerified: "Checked"
    }, null, 2), "application/json");
});

When('User clicks on the Update button for Experience', async function () {
    await experiencePage.handleBrowserDialog();
    await experiencePage.clickUpdate();

    this.attach(JSON.stringify({
        ActionType: "EXPERIENCE UPDATE FLOW",
        ChangesMade: {
            CompanyModifiedTo: "Rayat School",
            LowSkilledCheckbox: "Unchecked",
            HRVerifiedStatus: "Toggled/Unchecked in subsequent step"
        }
    }, null, 2), "application/json");
});

When('User clicks on the Edit icon in Experience grid', async function () {
    await experiencePage.clickEdit();
});

When('User handles the browser confirmation dialog', async function () {
});

When('User clicks on the Cancel button for Experience', async function () {
    await experiencePage.clickCancel();
});

Then('A success popup with message {string} should appear for Experience', async function (expectedMsg) {
    await experiencePage.successPopup.waitFor({ state: 'visible', timeout: 5000 });
    const msg = await experiencePage.successPopup.textContent();
    expect(msg).toContain(expectedMsg);
});

Then('User clicks the {string} button on the Experience popup', async function (btnText) {
    if (await experiencePage.okButton.isVisible()) {
        await experiencePage.okButton.click();
    }
});

Then('User verifies the saved experience details match on the UI for {string}', async function (companyName) {
    await experiencePage.experienceTable.waitFor({ state: 'visible', timeout: 5000 });
    const rowLocator = this.page.locator('#dtEmployeeExperienceList tbody tr');
    const text = await rowLocator.textContent();
    expect(text).toContain(companyName);
});