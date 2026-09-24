const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const PFPage = require('../../pages/otherdetailspage/pf');

let pfPage;

When('User enters PF number {string}', async function (pfValue) {
    pfPage = new PFPage(this.page);
    await pfPage.enterPFDetails(pfValue);
    this.testedPF = pfValue;
});

When('User clicks on the Update or Save button for PF', async function () {
    await pfPage.clickUpdate();
});

Then('User should see PF validation result message {string}', async function (expectedMessage) {
    let actualMessage = await pfPage.getValidationMessage();
    
    console.log("\n==================================");
    console.log("📋 PF NUMBER TEST EXECUTION REPORT:");
    console.log("- Tested PF Value     :", this.testedPF || "(Blank)");
    console.log("- Expected Message    :", expectedMessage);
    console.log("- Actual Message      :", actualMessage);
    console.log("==================================\n");

    const normalizedActual = actualMessage.replace(/\s+/g, ' ').trim();
    const normalizedExpected = expectedMessage.replace(/\s+/g, ' ').trim();

    expect(normalizedActual).toContain(normalizedExpected);
});

Then('User should see PF validation result message "PF Number: {string} Is InValid."', async function (invalidPF) {
    let expectedMessage = `PF Number: "${invalidPF}" Is InValid.`;
    let actualMessage = await pfPage.getValidationMessage();
    
    console.log("\n==================================");
    console.log("📋 PF NUMBER TEST EXECUTION REPORT:");
    console.log("- Tested PF Value     :", invalidPF);
    console.log("- Expected Message    :", expectedMessage);
    console.log("- Actual Message      :", actualMessage);
    console.log("==================================\n");

    const normalizedActual = actualMessage.replace(/\s+/g, ' ').trim();
    const normalizedExpected = expectedMessage.replace(/\s+/g, ' ').trim();

    expect(normalizedActual).toContain(normalizedExpected);
});