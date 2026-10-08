const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const DisciplinaryPage = require('../../pages/fine.js');

Given('User clicks on the Fine Option menu', async function () {
    this.disciplinaryPage = new DisciplinaryPage(this.page);
    await this.disciplinaryPage.navigateToDisciplinary();
});

When('User clicks on the create disciplinary option', async function () {
    await this.disciplinaryPage.clickCreate();
});

When('User extracts date from employee to date and sets it as Date of Offence', async function () {
    await this.disciplinaryPage.setDateOfOffenceFromToDate();
});

When('User selects Code of Misconduct as Failure to Act', async function () {
    await this.disciplinaryPage.selectCodeOfMisconduct("2");
});

When('User fills the Code of Misconduct details as {string}', async function (issueText) {
    await this.disciplinaryPage.fillIssueDetails(issueText);
});

When('User enters Action taken as MR. MARATHE', async function () {
    await this.disciplinaryPage.fillActionTaken("MR. MARATHE");
});

When('User selects the current month in ForMonth', async function () {
    await this.disciplinaryPage.selectCurrentMonth();
});

When('User clicks on the Save Disciplinary Action button', async function () {
    await this.disciplinaryPage.clickSave();
});

Then('User should see the validation popup with message {string}', async function (expectedMessage) {
    const message = await this.disciplinaryPage.getPopupMessage();
    expect(message.trim()).toContain(expectedMessage);
    await this.disciplinaryPage.handlePopup();
});

Then('User should see successful disciplinary record saved or success message', async function () {
    // Yethu success message kinva table var record disnyachi verification taku shakto
    const message = await this.disciplinaryPage.getPopupMessage();
    // Jar success pop-up yet asel tar tachi check karu shakto kinva direct OK karu shakto
    await this.disciplinaryPage.handlePopup();
});

Then('User clicks on OK button on the success popup', async function () {
    await this.disciplinaryPage.handlePopup();
});

Then('User should see the saved entry with issue {string} and action taken {string} in the disciplinary table', async function (expectedIssue, expectedAction) {
    const validation = await this.disciplinaryPage.verifyRecordInTable(expectedIssue, expectedAction);
    
    expect(validation.hasIssue).toBeTruthy();
    expect(validation.hasAction).toBeTruthy();
});