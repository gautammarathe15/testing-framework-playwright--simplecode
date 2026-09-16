const { Given, When, Then } = require('@cucumber/cucumber');
const { ContractorEmployeeWeekOffPage } = require('../../pages/weekoff.js');

// Helper function to get week off page instance
function getWeekOffPage(page) {
    return new ContractorEmployeeWeekOffPage(page);
}

// --- Navigation & Visibility Steps ---

When('User clicks on the Week Off tab', async function () {
    const weekOffPage = getWeekOffPage(this.page);
    await weekOffPage.clickWeekOffTab();
});

Then('User verifies "Week Off Default Applicable" checkbox and "Effective From" field are visible', async function () {
    const weekOffPage = getWeekOffPage(this.page);
    await weekOffPage.verifyDefaultSectionVisible();
});

Then('User verifies "Week Off and Shift Template" dropdown is visible', async function () {
    const weekOffPage = getWeekOffPage(this.page);
    await weekOffPage.verifyTemplateDropdownVisible();
});

Then('User verifies "From Date" field is visible', async function () {
    const weekOffPage = getWeekOffPage(this.page);
    await weekOffPage.verifyFromDateVisible();
});

Then('User verifies "To Date" field is visible', async function () {
    const weekOffPage = getWeekOffPage(this.page);
    await weekOffPage.verifyToDateVisible();
});

// --- Default Section Actions & Verifications ---

When('On WeekOff Page User selects today\'s date in Effective From field', async function () {
    const weekOffPage = getWeekOffPage(this.page);
    await weekOffPage.selectEffectiveFromToday();
});

When('User clicks on the Update button for week off', async function () {
    const weekOffPage = getWeekOffPage(this.page);
    await weekOffPage.clickWeekOffUpdate(); 
});

When('User unchecks the "Week Off Default Applicable" checkbox', async function () {
    const weekOffPage = getWeekOffPage(this.page);
    await weekOffPage.uncheckWeekOffDefault();
});

When('User enters {string} in the Effective From field', async function (dateStr) {
    const weekOffPage = getWeekOffPage(this.page);
    await weekOffPage.setEffectiveFromDate(dateStr);
});

Then('User verifies the first row in the table shows status {string} and effective date {string}', async function (expectedStatus, expectedDate) {
    const weekOffPage = getWeekOffPage(this.page);
    await weekOffPage.verifyFirstRowTableData(expectedStatus, expectedDate);
});

// --- Template Selection & Save Steps ---

When('User selects the first template from the Week Off and Shift Template dropdown', async function () {
    const weekOffPage = getWeekOffPage(this.page);
    await weekOffPage.selectFirstTemplate();
});

When('User selects today date in From Date field', async function () {
    const weekOffPage = getWeekOffPage(this.page);
    await weekOffPage.selectFromDateToday();
});

When('User selects date after {int} days from today in To Date field', async function (days) {
    const weekOffPage = getWeekOffPage(this.page);
    await weekOffPage.selectToDateFuture();
});

When('User clicks on Save button for template', async function () {
    const weekOffPage = getWeekOffPage(this.page);
    await weekOffPage.clickSaveTemplate();
});

// --- Table Verification Steps ---

Then('User verifies the table displays template expectedTemplate, expectedFromDate and expectedToDate', async function () {
    const weekOffPage = getWeekOffPage(this.page);
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    const todayStr = `${day}-${month}-${year}`;

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    const fDay = String(futureDate.getDate()).padStart(2, '0');
    const fMonth = monthNames[futureDate.getMonth()];
    const fYear = futureDate.getFullYear();
    const futureStr = `${fDay}-${fMonth}-${fYear}`;

    await weekOffPage.verifyTemplateTableData('Week off shift template', todayStr, futureStr);
});

// --- Negative Test Scenario Steps ---

When('User leaves {string} dropdown empty', async function (fieldName) {
    const weekOffPage = getWeekOffPage(this.page);
    await weekOffPage.leaveTemplateDropdownEmpty();
});

When('User leaves {string} field empty', async function (fieldName) {
    const weekOffPage = getWeekOffPage(this.page);
    if (fieldName.toLowerCase().includes('from date')) {
        await weekOffPage.clearFromDate();
    } else if (fieldName.toLowerCase().includes('to date')) {
        await weekOffPage.clearToDate();
    }
});
Then(/^User should see validation popup or message for (.+)$/, async function (targetField) {
    const weekOffPage = getWeekOffPage(this.page);
    await weekOffPage.verifyValidationPopupOrMessage();
});