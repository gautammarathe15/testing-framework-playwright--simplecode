const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const TrainingPage = require('../../pages/training');

function formatDate(date) {
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    const year = date.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
}

When('User navigates to Training tab', async function () {
    this.trainingPage = new TrainingPage(this.page);
    await this.trainingPage.navigateToTraining();
});

When('User clicks on Create New Training tab', async function () {
    await this.trainingPage.clickCreate();
});

When('User selects Program as {string}', async function (programName) {
    if (programName === 'Manual testing') {
        await this.trainingPage.selectProgram('2');
    } else if (programName === 'Select') {
        await this.trainingPage.selectProgram('');
    }
});

When('User sets From Date less than employee joining date', async function () {
    const joinDateStr = await this.trainingPage.getJoiningDate();
    const joinDate = new Date(joinDateStr.trim());
    
    // Invalid From Date: 1 year prior to joining date
    const lesserDateObj = new Date(joinDate);
    lesserDateObj.setFullYear(lesserDateObj.getFullYear() - 1);
    const lesserDate = formatDate(lesserDateObj);

    const validToDate = await this.trainingPage.getContractEndDate();

    await this.trainingPage.enterDates(lesserDate, validToDate);
});

When('User enters Hours as {string}', async function (hours) {
    await this.trainingPage.enterDetails(hours, 'HR Pannel', 'Zaroda Infotech');
});

When('User clicks on Save Training button', async function () {
    await this.trainingPage.clickSave();
});

Then('User should see popup message {string}', async function (expectedMessage) {
    const message = await this.trainingPage.getPopupMessage();
    expect(message.trim()).toContain(expectedMessage);
    await this.trainingPage.handlePopup();
});

When('User selects valid From Date and To Date', async function () {
    const joinDateStr = await this.trainingPage.getJoiningDate();
    const joinDate = new Date(joinDateStr.trim());
    const fromDateStr = formatDate(joinDate);
    const toDateStr = await this.trainingPage.getContractEndDate();

    await this.trainingPage.enterDates(fromDateStr, toDateStr);
});

When('User clears the Hours field', async function () {
    await this.trainingPage.enterDetails('', 'HR Pannel', 'Zaroda Infotech');
});

When('User keeps Program as {string}', async function (prog) {
    const joinDateStr = await this.trainingPage.getJoiningDate();
    const joinDate = new Date(joinDateStr.trim());
    const fromDateStr = formatDate(joinDate);
    const toDateStr = await this.trainingPage.getContractEndDate();

    await this.trainingPage.selectProgram('');
    await this.trainingPage.enterDates(fromDateStr, toDateStr);
    await this.trainingPage.enterDetails('3', 'HR Pannel', 'Zaroda Infotech');
});

When('User selects valid dates and fills valid details', async function () {
    const joinDateStr = await this.trainingPage.getJoiningDate();
    const joinDate = new Date(joinDateStr.trim());
    const fromDateStr = formatDate(joinDate);
    const toDateStr = await this.trainingPage.getContractEndDate();

    await this.trainingPage.enterDates(fromDateStr, toDateStr);
    await this.trainingPage.enterDetails('3', 'HR Pannel', 'Zaroda Infotech');
});

When('User selects valid dates and fills other details leaving Conducted By empty', async function () {
    const joinDateStr = await this.trainingPage.getJoiningDate();
    const joinDate = new Date(joinDateStr.trim());
    const fromDateStr = formatDate(joinDate);
    const toDateStr = await this.trainingPage.getContractEndDate();

    await this.trainingPage.enterDates(fromDateStr, toDateStr);
    await this.trainingPage.enterDetails('3', '', 'Zaroda Infotech');
});

When('User enters Conducted By as {string} and Conducted Company as {string}', async function (by, comp) {
    const joinDateStr = await this.trainingPage.getJoiningDate();
    const joinDate = new Date(joinDateStr.trim());
    const fromDateStr = formatDate(joinDate);
    const toDateStr = await this.trainingPage.getContractEndDate();

    await this.trainingPage.enterDates(fromDateStr, toDateStr);
    await this.trainingPage.enterDetails('3', by, comp);
});
When('User clicks OK on the popup', async function () {
    await this.trainingPage.handlePopup();
});

Then('User verifies training details in the list table', async function () {
    await this.trainingPage.trainingTable.waitFor({ state: 'visible', timeout: 10000 });
    const firstRowText = await this.trainingPage.trainingTable.locator('tbody tr').first().textContent();
    expect(firstRowText).toContain('Manual testing');
    expect(firstRowText).toContain('HR Pannel');
    expect(firstRowText).toContain('Zaroda Infotech');
});