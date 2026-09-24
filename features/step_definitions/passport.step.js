const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const PassportPage = require('../../pages/otherdetailspage/passport');

let passportPage;

When('User enters Passport number {string} with expiry date {string}', async function (passportValue, expiryDate) {
    passportPage = new PassportPage(this.page);
    await passportPage.enterPassportDetails(passportValue, expiryDate);
    this.testedPassport = passportValue;
});

When('User clicks on the Update or Save button for Passport', async function () {
    await passportPage.clickUpdate();
});

Then('User should see Passport validation result message {string}', async function (expectedMessage) {
    let actualMessage = await passportPage.getValidationMessage();
    
    console.log("\n==================================");
    console.log("📋 PASSPORT TEST EXECUTION REPORT:");
    console.log("- Tested Passport     :", this.testedPassport || "(Blank)");
    console.log("- Expected Message    :", expectedMessage);
    console.log("- Actual Message      :", actualMessage);
    console.log("==================================\n");

    expect(actualMessage).toContain(expectedMessage);
});


Then('User should see Passport validation result message "Passport Number: {string} Is InValid"', async function (invalidPassport) {
    let expectedMessage = `Passport Number: "${invalidPassport}"  Is InValid.`; 
    let actualMessage = await passportPage.getValidationMessage();
    
    console.log("\n==================================");
    console.log("📋 PASSPORT TEST EXECUTION REPORT:");
    console.log("- Tested Passport     :", invalidPassport);
    console.log("- Expected Message    :", expectedMessage);
    console.log("- Actual Message      :", actualMessage);
    console.log("==================================\n");

    expect(actualMessage.trim()).toBe(expectedMessage.trim()); 
});