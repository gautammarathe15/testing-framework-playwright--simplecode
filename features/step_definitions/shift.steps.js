import { When, Then } from '@cucumber/cucumber';
import { ContractorEmployeeShiftPage } from '../../pages/shift.js';
import { ContractorEmployeeDeploymentPage } from '../../pages/deployment.js';
import { ContractorEmployeeReportingManagerPage } from '../../pages/reportingmanager.js';
import { ContractorEmployeeCardPage } from '../../pages/card.js'; // 1. कार्ड पेज इम्पोर्ट करा

function getShiftPage(page) {
    return new ContractorEmployeeShiftPage(page);
}

function getDeploymentPage(page) {
    return new ContractorEmployeeDeploymentPage(page);
}

function getReportingPage(page) {
    return new ContractorEmployeeReportingManagerPage(page);
}

function getCardPage(page) {
    return new ContractorEmployeeCardPage(page); 
}

When('User clicks on {string} tab in employee profile', async function (tabName) {
    await this.page.waitForTimeout(1000); 
    const tabLower = tabName.toLowerCase();
    
    if (tabLower === 'shift') {
        const shiftPage = getShiftPage(this.page);
        await shiftPage.clickShiftTab();
    } else if (tabLower === 'deployment') {
        const deploymentPage = getDeploymentPage(this.page);
        await deploymentPage.clickDeploymentTab();
        await deploymentPage.captureInitialDetails();
    } else if (tabLower === 'reporting manager') {
        const reportingPage = getReportingPage(this.page);
        await reportingPage.clickReportingManagerTab();
    } else if (tabLower === 'card') {
        const cardPage = getCardPage(this.page); // 3. 'Card' टॅबसाठी लॉजिक जोडा
        await cardPage.clickCardTab();
    }
});

When('User selects "Auto Shift Applied" checkbox', async function () {
    const shiftPage = getShiftPage(this.page);
    await shiftPage.selectAutoShift(true);
});

When('User selects shift option {string}', async function (shiftName) {
    const shiftPage = getShiftPage(this.page);
    await shiftPage.selectShiftOption(shiftName, true);
});

Then('User should see Save button and Cancel button visible for first time entry', async function () {
    const shiftPage = getShiftPage(this.page);
    await shiftPage.verifySaveOrUpdateVisibility('Save');
});

Then('User should see Update button and Cancel button visible', async function () {
    const shiftPage = getShiftPage(this.page);
    await shiftPage.verifySaveOrUpdateVisibility('Update');
});

When('User clicks on the Shift Save button', async function () {
    const shiftPage = getShiftPage(this.page);
    await shiftPage.clickSaveButton();
});

When('User clicks on the Shift Update button', async function () {
    const shiftPage = getShiftPage(this.page);
    await shiftPage.clickUpdateButton();
});

Then('Shift option {string} should be checked on UI', async function (shiftName) {
    const shiftPage = getShiftPage(this.page);
    await shiftPage.verifyShiftOptionChecked(shiftName);
});

Then('Shift option {string} and shift option {string} should be checked on UI', async function (shift1, shift2) {
    const shiftPage = getShiftPage(this.page);
    await shiftPage.verifyShiftOptionChecked(shift1);
    await shiftPage.verifyShiftOptionChecked(shift2);
});