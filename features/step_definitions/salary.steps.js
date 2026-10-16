const { Given, When, Then } = require('@cucumber/cucumber');
const SalaryPage = require('../../pages/salary');
const { expect } = require('@playwright/test');

Given('User clicks on the Employee Salary Structure menu option', async function () {
    this.salaryPage = new SalaryPage(this.page);
    await this.salaryPage.navigateToSalary();
});

Given('User verifies salary structure table is empty for the first-time allocation', async function () {
    await this.salaryPage.salaryTable.waitFor({ state: 'visible', timeout: 10000 });
});

When('User clicks on the Create Salary Structure button', async function () {
    await this.salaryPage.clickCreate();
});

When('User reads the employee joining date from the profile', async function () {
    await this.salaryPage.joinDateSpan.waitFor({ state: 'visible', timeout: 10000 });
    this.employeeJoinDate = await this.salaryPage.joinDateSpan.textContent();
    console.log("📅 Employee Joining Date:", this.employeeJoinDate);
});

When('User selects an Effective From date before the joining date', async function () {
    const wrongDate = '01-Aug-2023';
    console.log("📅 [TEST LOG] Selecting Wrong/Before Joining Date from Calendar:", wrongDate);
    await this.salaryPage.selectEffectiveFrom(wrongDate);
});

Then('User should see salary popup message {string}', async function (expectedMessage) {
    const msg = await this.salaryPage.getPopupMessage();
    console.log("💬 Popup Message Found:", msg);
    expect(msg).toContain(expectedMessage);
});

Then('User clicks OK on the salary popup', async function () {
    await this.salaryPage.handlePopup();
});

Then('User selects the correct Effective From date matching the joining date month', async function () {
    const correctDate = this.employeeJoinDate ? this.employeeJoinDate.trim() : '25-Jan-2024';
    console.log("📅 [TEST LOG] Selecting Correct Effective From Date from Calendar:", correctDate);
    await this.salaryPage.selectEffectiveFrom(correctDate);
});

When('User selects Assign Template as {string}', async function (templateName) {
    this.selectedTemplate = templateName;
    await this.salaryPage.selectTemplate(templateName);
});

When('User selects Salary Structure As {string}', async function (structureValue) {
    await this.salaryPage.selectSalaryStructureAs(structureValue);
});

When('User toggles the {string} checkbox', async function (checkboxLabel) {
    let locator = '';
    if (checkboxLabel.includes('Hours')) {
        locator = '[id="EmployeeSalaryStructure.IsCalculateSalaryOnHours"]';
    } else if (checkboxLabel.includes('Double')) {
        locator = '[id="EmployeeSalaryStructure.IsCalculateDoubleOnHolidayPresent"]';
    } else if (checkboxLabel.includes('WeekOff')) {
        locator = '[id="EmployeeSalaryStructure.IsCalculateExtraHoursOnWeekOffPresent"]';
    }
    if (locator) {
        await this.salaryPage.toggleCheckbox(locator);
    }
});

Then('User extracts all Earning Head amounts, calculates the sum, and verifies it with Total Earning', async function () {
    this.earningReportText = await this.salaryPage.verifyEarningHeadCalculation();
    console.log(this.earningReportText);
});

Then('User attaches the earning calculation breakdown to the cucumber report', async function () {
    await this.attach(this.earningReportText, 'text/plain');
});

When('User extracts all Deduction Head amounts, calculates the sum, and verifies it with Total Deduction', async function () {
    this.deductionReportText = await this.salaryPage.verifyDeductionHeadCalculation();
    console.log(this.deductionReportText);
});

When('User attaches the deduction calculation breakdown to the cucumber report', async function () {
    await this.attach(this.deductionReportText, 'text/plain');
});

When('User calculates Projected Net payable as Total Earning minus Total Deduction and verifies it with UI', async function () {
    this.netPayableReportText = await this.salaryPage.verifyProjectedNetPayableCalculation();
    console.log("Projected Net Payable Verified Successfully!");
});

When('User attaches the salary summary breakdown in a table format to the cucumber report', async function () {
    await this.attach(this.netPayableReportText, 'text/markdown');
});

When('User clicks on the Save button and verifies the record in the salary structure table', async function () {
    const templateName = this.selectedTemplate || "Salary GG";
    const reportTable = await this.salaryPage.saveAndVerifySalaryStructure(templateName);
    await this.attach(reportTable, 'text/markdown');
});

When('User updates the salary structure with next month effective date and verifies table records', async function () {
    const reportTable = await this.salaryPage.updateAndVerifySalaryStructure();
    await this.attach(reportTable, 'text/markdown');
});


Then(
    'User verifies duplicate alert when assigning existing earning head {string} with amount {string}',
    async function (headName, amount) {
        const reportTable =
            await this.salaryPage.verifyDuplicateEarningHeadAlert(headName, amount);

        await this.attach(reportTable, 'text/markdown');
    }
);


When(
    'User adds additional earning heads and verifies their table details',
    { timeout: 120000 },
    async function (dataTable) {
        const result =
            await this.salaryPage.addAndVerifyAdditionalEarningHeads(
                dataTable.hashes()
            );

        console.log(result.report);

        await this.attach(result.report, 'text/markdown');

        expect(
            result.passed,
            `Scenario 7 failed.\n${result.report}`
        ).toBe(true);
    }
);