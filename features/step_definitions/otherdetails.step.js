const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { getOtherDetailsPage } = require('../../pages/otherdetailspage/otherdetails');

When('User clicks on the Other Details tab', async function () {
    this.otherDetailsPage = getOtherDetailsPage(this.page);
    await this.otherDetailsPage.clickOtherDetailsTab();
});

Then('User verifies all Other Details form elements and visibility status', async function () {
    if (!this.otherDetailsPage) {
        this.otherDetailsPage = getOtherDetailsPage(this.page);
    }
    this.elementStatusReport = await this.otherDetailsPage.verifyAllElementsAndCollectData();
});

Then('Extended Report should display table with columns {string}', async function (columnHeaders) {
    console.log(`\n==================================================================================`);
    console.log(` EXTENDED REPORT: ${columnHeaders}`);
    console.log(`==================================================================================`);

    if (this.elementStatusReport && this.elementStatusReport.length > 0) {
        for (const row of this.elementStatusReport) {
            console.log(` ${row.optionName} | ${row.status} | ${row.currentDetails} `);
        }
    } else {
        console.log(` No elements data found to display in report.`);
    }
    console.log(`==================================================================================\n`);
    
    expect(this.elementStatusReport.length).toBeGreaterThan(0);
});