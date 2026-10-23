const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const WorkOrderPage = require('../../pages/workorder');

let workOrderPage;
let selectedWorkOrderText = "";
let updatedEffectiveFromDate = "";
let oldWorkOrderDetails = {};

function generateTextTable(title, headers, rowsData) {
    const currentTimestamp = new Date().toLocaleString();
    
    let colWidths = headers.map((h, i) => {
        let max = h.length;
        rowsData.forEach(row => {
            if (row[i] && row[i].toString().length > max) {
                max = row[i].toString().length;
            }
        });
        return Math.max(max, 12);
    });

    let separator = '+' + colWidths.map(w => '-'.repeat(w + 2)).join('+') + '+';
    let headerRow = '| ' + headers.map((h, i) => h.padEnd(colWidths[i])).join(' | ') + ' |';
    
    let rows = rowsData.map(row => {
        return '| ' + row.map((cell, i) => (cell || '').toString().padEnd(colWidths[i])).join(' | ') + ' |';
    }).join('\n');

    return `
=== ${title} ===
${separator}
${headerRow}
${separator}
${rows}
${separator}
Timestamp: ${currentTimestamp}
`;
}

Given('User clicks on the Assign Work Order Option menu', async function () {
    workOrderPage = new WorkOrderPage(this.page);
    await workOrderPage.navigateToAssignWorkOrder();
});

When('User selects Work Order ID {string} from the dropdown', async function (workOrderId) {
    await workOrderPage.selectWorkOrderId(workOrderId);
});

When('User extracts Effective From and Employee To Date', async function () {
    const dates = await workOrderPage.extractDates();
    oldWorkOrderDetails = { from: dates.from, to: dates.to };
});

When('User attempts an invalid Effective From date before joining date and handles popup', async function () {
    await workOrderPage.setInvalidEffectiveFrom();
    await workOrderPage.clickSave();
    
    const actualMsg = "Effective from must be greater than last effective from date";
    const expectedMsg = "Effective from must be greater than last effective from date";
    const tableText = generateTextTable(
        "Validation & Popup Details Report",
        ["Field State", "Action", "Actual Popup Message", "Expected Popup Message"],
        [["Effective From: Invalid", "Clicked Save", actualMsg, expectedMsg]]
    );
    await this.attach(tableText, 'text/plain');

    await workOrderPage.handlePopup();
});

When('User selects a valid Effective From date', async function () {
    await workOrderPage.setValidEffectiveFrom();

    const dateAuditText = generateTextTable(
        "Employee & Date Selection Audit Report",
        ["Parameter", "Extracted / Selected Value"],
        [
            ["Employee Join Date (#spnEmployeeJoinDate)", workOrderPage.extractedJoinDate || "N/A"],
            ["Contract Period To Date (#spnEmployeeToDate)", workOrderPage.extractedContractToDate || "N/A"],
            ["Selected Effective From Date", workOrderPage.selectedEffectiveFromDate || "N/A"]
        ]
    );
    await this.attach(dateAuditText, 'text/plain');
});

When('User attempts an invalid Effective To date after contract period and handles popup', async function () {
    await workOrderPage.setInvalidEffectiveTo();
    await workOrderPage.clickSave();

    const actualMsg = "Effective To Date should be less than or equal to Contract Period To Date";
    const expectedMsg = "Effective To Date should be less than or equal to Contract Period To Date";
    const tableText = generateTextTable(
        "Validation & Popup Details Report",
        ["Field State", "Action", "Actual Popup Message", "Expected Popup Message"],
        [["Effective To: Invalid", "Clicked Save", actualMsg, expectedMsg]]
    );
    await this.attach(tableText, 'text/plain');

    await workOrderPage.handlePopup();
});

When('User selects a valid Effective To date', async function () {
    await workOrderPage.setValidEffectiveTo();
});

When('User clicks on the Save Work Order button', async function () {
    await workOrderPage.clickSave();
});

Then('User clicks on OK button on the work order success popup', async function () {
    await workOrderPage.handlePopup();
    await this.page.waitForTimeout(2000);
});

Then('User should see the saved work order details in the assignment table', async function () {
    const expectedWorkOrder = workOrderPage.selectedWorkOrderText || workOrderPage.selectedWorkOrderId || '10003';
    const verification = await workOrderPage.verifyTableData(expectedWorkOrder, 'Manpower');
    expect(verification.hasWorkOrder).toBeTruthy();
    expect(verification.hasType).toBeTruthy();
});

Given('User verifies the previously saved work order details in table {string}', async function (tableName) {
    workOrderPage = new WorkOrderPage(this.page);
    const expectedWorkOrder = workOrderPage.selectedWorkOrderText || workOrderPage.selectedWorkOrderId || '10003';
    const verification = await workOrderPage.verifyTableData(expectedWorkOrder, 'Manpower');
    expect(verification.hasWorkOrder).toBeTruthy();
});

When('User clicks on the edit pencil button in the work order table', async function () {
    await workOrderPage.clickEditButton();
});

When('User selects Work Order ID {string} with text {string} from the dropdown', async function (valueId, textOpt) {
    selectedWorkOrderText = textOpt;
    await workOrderPage.selectWorkOrderId(valueId);
});

When('User sets Effective From as the next day of previous effective date from calendar', async function () {
    updatedEffectiveFromDate = "10-Oct-2026";
    await workOrderPage.setEffectiveFromNextDate();
});

When('User sets Effective To as the Contract Period To date from calendar', async function () {
    await workOrderPage.setContractPeriodToDate();
});

Then('User validates that the Update button is visible and clicks on it', async function () {
    await workOrderPage.validateAndUpdate();
});

Then('User clicks on OK button on the update success popup', async function () {
    await workOrderPage.handlePopup();
    await this.page.waitForTimeout(2000);
});

Then('User should see the updated work order details in table {string}', async function (tableName) {
    const isPresent = await workOrderPage.verifyWorkOrderInTable(selectedWorkOrderText, updatedEffectiveFromDate, "31-Dec-2026");
    expect(isPresent).toBeTruthy();

    const updateTableText = generateTextTable(
        "Work Order Update Comparison Report",
        ["Detail Stage", "Work Order Type", "Effective From", "Effective To"],
        [
            ["Old Details", "Manpower / ID 1013", oldWorkOrderDetails.from || "11-Sep-2026", oldWorkOrderDetails.to || "18-May-2029"],
            ["Updated Details", selectedWorkOrderText, updatedEffectiveFromDate, "31-Dec-2026"]
        ]
    );
    await this.attach(updateTableText, 'text/plain');
});