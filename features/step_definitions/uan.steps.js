const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const UANPage = require('../../pages/otherdetailspage/uan');

let uanPage;

When('User enters UAN number {string}', async function (uanValue) {
    uanPage = new UANPage(this.page);
    
    let finalUan = uanValue;
    if (uanValue === "UNIQUE") {
        const randomSuffix = Math.floor(1000000 + Math.random() * 9000000);
        finalUan = `10150${randomSuffix}`;
    }

    await uanPage.enterUANDetails(finalUan);
    this.testedUAN = finalUan;
});
When('User clicks on the Update or Save button for UAN', async function () {
    await uanPage.clickUpdate();
});

Then(/^User should see UAN validation result message "(.+)"$/, async function (expectedMessage) {
    let actualMessage = await uanPage.getValidationMessage();
    
    console.log("\n==================================");
    console.log("📋 UAN NUMBER TEST EXECUTION REPORT:");
    console.log("- Tested UAN Value    :", this.testedUAN || "(Blank)");
    console.log("- Expected Message    :", expectedMessage);
    console.log("- Actual Message      :", actualMessage);
    console.log("==================================\n");

    const normalizedActual = actualMessage.replace(/\s+/g, ' ').trim();
    const normalizedExpected = expectedMessage.replace(/\s+/g, ' ').trim();

    expect(normalizedActual).toContain(normalizedExpected);
});