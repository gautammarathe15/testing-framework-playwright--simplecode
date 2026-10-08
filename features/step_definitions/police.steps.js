const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { PoliceVerificationPage } = require('../../pages/police');

let selectedDateStored = '';
let currentOldDetails = 'New Creation / Table Record';
let currentNewDetails = '-';
let actualPopupCaptured = '-';
let expectedPopupCaptured = '-';

When('User clicks on Police Tab', async function () {
    this.policePage = new PoliceVerificationPage(this.page);
    await this.policePage.navigateToPoliceTab();
});

When('User checks visibility of create button and clicks on it', async function () {
    currentOldDetails = 'New Creation Form';
    await this.policePage.clickCreate();
});

When('User selects the current month 1st date in Verification Date textbox', async function () {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    
    selectedDateStored = firstDay.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
    }).replace(/ /g, '-');

    await this.policePage.selectVerificationDateFromCalendar(firstDay);
});

When('User selects current date minus 1 in Verification Date textbox', async function () {
    const now = new Date();
    now.setDate(now.getDate() - 1);
    
    selectedDateStored = now.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
    }).replace(/ /g, '-');

    await this.policePage.selectVerificationDateFromCalendar(now);
});

When('User selects Todays date in Verification Date textbox', async function () {
    const now = new Date();
    
    selectedDateStored = now.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
    }).replace(/ /g, '-');

    await this.policePage.selectVerificationDateFromCalendar(now);
});

When('User leaves Verification Date blank', async function () {
    await this.policePage.verificationDateInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.policePage.verificationDateInput.fill('');
    currentNewDetails = 'Verification Date Blank';
});

When('User leaves Description blank', async function () {
    await this.policePage.descriptionInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.policePage.descriptionInput.fill('');
    currentNewDetails = 'Description Blank';
});

When('User enters description as Verification done by Automation Tester with selected date', async function () {
    const descriptionText = `Verification done by Automation Tester on ${selectedDateStored}`;
    this.lastDescription = descriptionText;
    currentNewDetails = `Date: ${selectedDateStored}, Desc: ${descriptionText}`;
    await this.policePage.enterDescription(descriptionText);
});

When('User checks visibility of Save option and clicks on it', async function () {
    await this.policePage.clickSave();
});

Then('User should see popup message {string} and clicks OK', async function (expectedMessage) {
    expectedPopupCaptured = expectedMessage;
    const msg = await this.policePage.getPopupMessage();
    actualPopupCaptured = msg.trim();
    
    const isPassed = actualPopupCaptured.includes(expectedMessage);
    expect(isPassed).toBeTruthy();
    
    // Markdown table format waparla ki report madhe ekdam clean structured table disto
    const structuredMarkdownReport = `
### Police Verification Execution Report
| Validation Check | Expected State | Actual State | Status |
| :--- | :--- | :--- | :--- |
| **Old Details** | - | ${currentOldDetails} | INFO ℹ️ |
| **New Details** | - | ${currentNewDetails} | INFO ℹ️ |
| **Popup Message** | ${expectedPopupCaptured} | ${actualPopupCaptured} | ${isPassed ? 'PASSED ✅' : 'FAILED ❌'} |
`;
    this.attach(structuredMarkdownReport, 'text/markdown');

    await this.policePage.handlePopup();
});

Then('User verifies saved details correctly display in table', async function () {
    await this.policePage.verifyTableDetails(selectedDateStored, this.lastDescription);
    
    const tableMarkdownReport = `
### Table Verification Report
| Validation Field | Expected Value | Actual Value | Status |
| :--- | :--- | :--- | :--- |
| **Verification Date** | ${selectedDateStored} | ${selectedDateStored} | PASSED ✅ |
| **Description** | ${this.lastDescription} | ${this.lastDescription} | PASSED ✅ |
`;
    this.attach(tableMarkdownReport, 'text/markdown');
});

When('User checks pencil icon visibility and clicks on it for edit', async function () {
    currentOldDetails = 'Existing Record in Table';
    await this.policePage.clickEdit();
});

When('User checks visibility of Update option and clicks on it', async function () {
    await this.policePage.clickUpdate();
});