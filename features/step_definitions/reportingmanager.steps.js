import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ContractorEmployeeReportingManagerPage } from '../../pages/reportingmanager.js';

function getReportingPage(page) {
    return new ContractorEmployeeReportingManagerPage(page);
}

When('User clicks on "Reporting Manager" tab in employee profile', async function () {
    const reportingPage = getReportingPage(this.page);
    await reportingPage.clickReportingManagerTab();
});

When('User opens search popup for {string}', async function (managerType) {
    const reportingPage = getReportingPage(this.page);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1000);
    await reportingPage.openSearchPopupFor(managerType);
});

When('User filters popup search with Subsidiary {string}, Division {string}, and Department {string}', async function (subsidiary, division, department) {
    const reportingPage = getReportingPage(this.page);
    await reportingPage.filterPopupSearch(subsidiary, division, department);
});

When('User selects the first employee from the search result grid', async function () {
    const reportingPage = getReportingPage(this.page);
    
    const modalContainer = this.page.locator('.select-single-emp-model, .modal-dialog').filter({ hasText: 'Employee Search' }).first();
    const firstRow = modalContainer.locator('#tblEmpSearchResultCnt tbody tr, table tbody tr').first();
    await firstRow.waitFor({ state: 'visible', timeout: 10000 });

    const empCode = (await firstRow.locator('td').nth(1).textContent()).trim();
    const fName = (await firstRow.locator('td').nth(2).textContent()).trim();
    const lName = (await firstRow.locator('td').nth(3).textContent().catch(() => '')).trim();
    
    reportingPage.initialSelectedManager = `${fName} ${lName} [${empCode}]`.trim();
    reportingPage.initialEmpCode = empCode;

    const selectBtn = firstRow.locator('button[name="btnSelectCnt"], button.btn-select, .btn-success').first();
    await selectBtn.click({ force: true });
    await this.page.waitForTimeout(500);
});

When('User searches by Employee Code {string} in popup search', async function (empCode) {
    const reportingPage = getReportingPage(this.page);
    await reportingPage.searchByEmployeeCode(empCode);
});

When('User stores first result details and clicks Select button', async function () {
    const reportingPage = getReportingPage(this.page);
    const modalContainer = this.page.locator('.select-single-emp-model, .modal-dialog').filter({ hasText: 'Employee Search' }).first();
    const firstRow = modalContainer.locator('#tblEmpSearchResultCnt tbody tr, table tbody tr').first();
    await firstRow.waitFor({ state: 'visible', timeout: 10000 });

    const empCode = (await firstRow.locator('td').nth(1).textContent()).trim();
    const fName = (await firstRow.locator('td').nth(2).textContent()).trim();
    const lName = (await firstRow.locator('td').nth(3).textContent().catch(() => '')).trim();
    
    reportingPage.updatedSelectedManager = `${fName} ${lName} [${empCode}]`.trim();
    reportingPage.updatedEmpCode = empCode;

    const selectBtn = firstRow.locator('button[name="btnSelectCnt"], button.btn-select, .btn-success').first();
    await selectBtn.click({ force: true });
    await this.page.waitForTimeout(500);
});

When('User clicks on Save button in Reporting Manager tab', async function () {
    const reportingPage = getReportingPage(this.page);
    await reportingPage.clickSaveButton();
});

When('User clicks on Update button in Reporting Manager tab', async function () {
    const reportingPage = getReportingPage(this.page);
    await reportingPage.clickUpdateButton();
});

Then('User verifies selected employee name is populated in {string} field', async function (managerType) {
    const reportingPage = getReportingPage(this.page);
    const displayedValue = await reportingPage.getDisplayedManagerValue(managerType);
    const expectedManager = reportingPage.initialSelectedManager || reportingPage.updatedSelectedManager;
    const expectedCode = reportingPage.initialEmpCode || reportingPage.updatedEmpCode;
    
    const isMatch = displayedValue.includes(expectedCode) || displayedValue.includes(expectedManager.split(' ')[0]);
    expect(isMatch).toBeTruthy();
});

Then('User compares old details with updated details for {string} and logs comparison chart in extent report', async function (managerType) {
    const reportingPage = getReportingPage(this.page);
    const actualDisplayedValue = await reportingPage.getDisplayedManagerValue(managerType);
    
    const oldDetails = reportingPage.initialSelectedManager || 'N/A';
    const updatedDetails = reportingPage.updatedSelectedManager || actualDisplayedValue;
    const expectedCode = reportingPage.updatedEmpCode || '';

    const isMatch = actualDisplayedValue.includes(expectedCode) || actualDisplayedValue.includes(updatedDetails);
    const verifyStatus = isMatch ? 'PASSED' : 'FAILED';
    const statusColor = isMatch ? '#28a745' : '#dc3545';

    expect(isMatch).toBeTruthy();

    const comparisonChartHtml = `
    <div style="margin-top: 10px; font-family: Arial, sans-serif;">
        <h4 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 5px;">
            <b>Reporting Manager Update & Comparison Chart (<span style="color: #007bff;">${managerType}</span>)</b>
        </h4>
        <table border="1" style="border-collapse: collapse; width: 100%; text-align: center; font-size: 14px;">
            <tr style="background-color: #343a40; color: white;">
                <th style="padding: 8px;">Manager Designation</th>
                <th style="padding: 8px;">Old Details (Initial Save - Filter Search)</th>
                <th style="padding: 8px;">Updated Details (Update Flow - Code Search)</th>
                <th style="padding: 8px;">Verify Status</th>
            </tr>
            <tr style="background-color: #f8f9fa;">
                <td style="padding: 8px;"><b>${managerType}</b></td>
                <td style="padding: 8px; color: #6c757d;">${oldDetails}</td>
                <td style="padding: 8px; color: #007bff; font-weight: bold;">${actualDisplayedValue}</td>
                <td style="padding: 8px; background-color: ${statusColor}; color: white; font-weight: bold;">${verifyStatus}</td>
            </tr>
        </table>
    </div>`;

    this.attach(comparisonChartHtml, 'text/html');
});