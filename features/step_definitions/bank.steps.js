const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const BankPage = require('../../pages/otherdetailspage/bank');

let bankPage;

When('User selects bank option {string} from the Bank dropdown', async function (bankName) {
    bankPage = new BankPage(this.page);
    await bankPage.selectBank(bankName);
    this.selectedBank = bankName;
});

When('User enters IFSC code {string}', async function (ifscValue) {
    await bankPage.enterIFSC(ifscValue);
    this.testedIFSC = ifscValue;
});

When('User clicks on the Update or Save button for Bank details', async function () {
    await bankPage.clickUpdate();
});

Then(/^User should see Bank validation result message "(.+)"$/, async function (expectedMessage) {
    let actualMessage = await bankPage.getValidationMessage();
    
    console.log("\n==================================");
    console.log("📋 BANK & IFSC TEST EXECUTION REPORT:");
    console.log("- Selected Bank       :", this.selectedBank);
    console.log("- Tested IFSC Code    :", this.testedIFSC || "(Blank)");
    console.log("- Tested Account No   :", this.testedAccountNo || "(Blank)");
    console.log("- Expected Message    :", expectedMessage);
    console.log("- Actual Message      :", actualMessage);
    console.log("==================================\n");

    const normalizedActual = actualMessage.replace(/\s+/g, ' ').trim();
    const normalizedExpected = expectedMessage.replace(/\s+/g, ' ').trim();

    expect(normalizedActual).toContain(normalizedExpected);
});


When('User enters Bank Account number {string}', async function (accountNo) {
    let finalAccountNo = accountNo;

   
    if (accountNo === "UNIQUE" || accountNo.length < 5) {
        const uniqueDigits = Date.now().toString().slice(-6);
        finalAccountNo = `1515${uniqueDigits}000`;
    }

    await bankPage.enterAccountNumber(finalAccountNo);
    this.testedAccountNo = finalAccountNo;
});

When('User enters branch name {string}', async function (branchName) {
    await bankPage.enterBranchName(branchName);
});