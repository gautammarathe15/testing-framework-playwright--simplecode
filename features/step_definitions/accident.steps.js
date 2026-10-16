const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { EmployeeAccidentPage } = require('../../pages/accident');

let accidentPage;
let accidentName = '';
let calculatedDaysUI = 0;
let expectedCalculatedDays = 0;
let accidentDateStored = '';
let returnDateStored = '';

When('User clicks on Employee Accident Register tab', async function () {
    accidentPage = new EmployeeAccidentPage(this.page);
    await accidentPage.navigateToAccidentRegister();
});

When('User checks the Create option visibility and clicks on it', async function () {
    await accidentPage.clickCreate();
});

When('User selects the 1st date of current month in Date Of Accident', async function () {
    const now = new Date();
    accidentDateStored = `01-${now.toLocaleString('en-US', { month: 'short' })}-${now.getFullYear()}`;
    await accidentPage.selectFirstDayOfCurrentMonth(accidentPage.dateOfAccidentInput);
});

When('User selects the 1st date of current month in Date Of Report', async function () {
    await accidentPage.selectFirstDayOfCurrentMonth(accidentPage.dateOfReportInput);
});

When('User enters Name Of Accident as {string}', async function (name) {
    accidentName = name;
    await accidentPage.enterNameOfAccident(name);
});

When('User selects Todays date in Date Of Return', async function () {
    const now = new Date();
    returnDateStored = `${String(now.getDate()).padStart(2, '0')}-${now.toLocaleString('en-US', { month: 'short' })}-${now.getFullYear()}`;
    await accidentPage.selectTodayDate(accidentPage.dateOfReturnInput);
    
    // Expected calculation (Return Date - Accident Date)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    firstDay.setHours(0, 0, 0, 0);
    
    const diffTime = Math.abs(today - firstDay);
    expectedCalculatedDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
});

Then('User extracts No Of Days from UI and validates calculation correctly', async function () {
    calculatedDaysUI = await accidentPage.getCalculatedDays();
    
    const isMatched = (calculatedDaysUI === expectedCalculatedDays);
    const statusText = isMatched ? '🟢 PASS (Correct )' : '🔴 NO ( Mismatch )';

    const reportText = `
==================================================
          EMPLOYEE ACCIDENT CALCULATION REPORT
==================================================
Accident Date       : ${accidentDateStored}
Return Date         : ${returnDateStored}
--------------------------------------------------
Expected Days       : ${expectedCalculatedDays}
UI Calculated Days  : ${calculatedDaysUI}
--------------------------------------------------
Status Result       : ${statusText}
==================================================
`;

    this.attach(reportText, 'text/plain');
    expect(calculatedDaysUI).toEqual(expectedCalculatedDays);
    if (isMatched) {
        await accidentPage.clickSave();
    }
});