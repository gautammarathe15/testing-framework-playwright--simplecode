const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const PFPage = require('../../pages/otherdetailspage/pf');

let pfPage;

When('User enters PF number {string}', async function (pfValue) {
    pfPage = new PFPage(this.page);
    let finalPfValue = pfValue;

    if (pfValue === '<dynamic_pf>' || pfValue.includes('DYNAMIC')) {
        const timestamp = Date.now().toString();
        const randomDigit = Math.floor(Math.random() * 10).toString();
        finalPfValue = `MHBAN000${timestamp}${randomDigit}`;
    }

    await pfPage.enterPFDetails(finalPfValue);
    this.testedPF = finalPfValue;

    await this.attach(`Generated & Entered PF Number: ${finalPfValue}`, 'text/plain');
});

When('User clicks on the Update or Save button for PF', async function () {
    await pfPage.clickUpdate();
});

Then('User should see PF validation result message {string}', async function (expectedMessage) {
    let actualMessage = await pfPage.getValidationMessage();
    
    const reportLog = `
==================================
PF NUMBER TEST EXECUTION REPORT:
- Tested PF Value     : ${this.testedPF || "(Blank)"}
- Expected Message    : ${expectedMessage}
- Actual Message      : ${actualMessage}
==================================`;

    console.log(reportLog);
    await this.attach(reportLog, 'text/plain');

    const normalizedActual = actualMessage.replace(/\s+/g, ' ').trim();
    const normalizedExpected = expectedMessage.replace(/\s+/g, ' ').trim();

    expect(normalizedActual).toContain(normalizedExpected);
});

Then('User should see PF validation result message "PF Number: {string} Is InValid."', async function (invalidPF) {
    let expectedMessage = `PF Number: "${invalidPF}" Is InValid.`;
    let actualMessage = await pfPage.getValidationMessage();
    
    const reportLog = `
==================================
PF NUMBER TEST EXECUTION REPORT:
- Tested PF Value     : ${invalidPF}
- Expected Message    : ${expectedMessage}
- Actual Message      : ${actualMessage}
==================================`;

    console.log(reportLog);
    await this.attach(reportLog, 'text/plain');

    const normalizedActual = actualMessage.replace(/\s+/g, ' ').trim();
    const normalizedExpected = expectedMessage.replace(/\s+/g, ' ').trim();

    expect(normalizedActual).toContain(normalizedExpected);
});