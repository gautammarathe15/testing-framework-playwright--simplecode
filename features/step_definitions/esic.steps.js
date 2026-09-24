const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const EsicPage = require('../../pages/otherdetailspage/esicpage');

When('User enters ESIC number {string} in ESIC input field', async function (esicValue) {
    this.esicPage = new EsicPage(this.page);
    await this.esicPage.enterEsicNumber(esicValue);
    this.testedEsic = esicValue;
});

When('User clicks on the Update or Save button for ESIC', async function () {
    await this.esicPage.clickUpdate();
});

Then('User should see ESIC validation result message {string}', async function (expectedMessage) {
    let actualMessage = await this.esicPage.getValidationMessage();
    
    console.log("\n==================================");
    console.log("📋 ESIC TEST EXECUTION REPORT:");
    console.log("- Tested ESIC Number   :", this.testedEsic || "(Blank)");
    console.log("- Expected Message     :", expectedMessage);
    console.log("- Actual Message       :", actualMessage);
    console.log("==================================\n");

    expect(actualMessage).toContain(expectedMessage);
});