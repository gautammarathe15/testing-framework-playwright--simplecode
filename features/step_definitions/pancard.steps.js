const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const PanCardPage = require('../../pages/otherdetailspage/pancard');

let generatedPanForLog = "";

function generateUniquePan() {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const randomAlphabet = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    return `GAUTA${randomDigits}${randomAlphabet}`;
}

When('User enters PAN number {string} in PAN input field', async function (panNumber) {
    this.panPage = new PanCardPage(this.page);
    
    let finalPan = panNumber;
    const isStandardValidFormat = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber);
    
    if (isStandardValidFormat || panNumber === "ABCDE1234F" || panNumber === "abcde1234f" || panNumber === "ABCDP1234Z") {
        finalPan = generateUniquePan();
        console.log(`Generated Unique PAN for testing: ${finalPan}`);
    }

    generatedPanForLog = finalPan;
    await this.panPage.enterPanNumber(finalPan);
});

When('User clicks on the Update or Save button for PAN', async function () {
    await this.panPage.clickUpdate();
});

Then('User should see validation result message {string}', async function (expectedMessage) {
    const currentPanValue = await this.panPage.panInput.inputValue();
    
    const isSaved = currentPanValue && currentPanValue.includes('*');
    const actualMessage = isSaved ? "Updated Successfully" : await this.panPage.getValidationMessage();
    
    let employeeAadhaar = "Grid Selected Employee";

    const executionReportLog = `
    ==================================================
    📋 PAN CARD TEST EXECUTION REPORT:
    - Employee Aadhaar / ID   : ${employeeAadhaar}
    - Tested PAN Number       : ${generatedPanForLog}
    - System Input PAN Value  : ${currentPanValue}
    - Expected Message        : ${expectedMessage}
    - Save Status             : ${isSaved ? "Updated Successfully" : "⚠️ Validation Handled"}
    ==================================================
    `;

    if (typeof this.attach === 'function') {
        this.attach(executionReportLog, 'text/plain');
    }
    console.log(executionReportLog);

    if (expectedMessage === "success") {
        expect(isSaved, "Expected PAN to be saved with masked digits").toBeTruthy();
    } else {
        expect(actualMessage).toContain(expectedMessage);
    }
});