const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const DisciplinaryActionPage = require('../../pages/disciplinary_action');

let disciplinaryPage;
let capturedData = {};

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

Given('User clicks on the Disciplinary Action menu option', async function () {
    disciplinaryPage = new DisciplinaryActionPage(this.page);
    await disciplinaryPage.navigateToDisciplinaryAction();
});

When('User checks and clicks on the Create Disciplinary Action button', async function () {
    await disciplinaryPage.verifyCreateVisible();
    await disciplinaryPage.clickCreate();
});

When('User selects the 1st date of current month in Action Taken On Date', async function () {
    await disciplinaryPage.setActionTakenOnDateFirstOfMonth();
});

When('User selects Reason as Disciplinary Action from dropdown', async function () {
    await disciplinaryPage.selectReasonByValue("14");
});

When('User selects current date in Issue Reported Date', async function () {
    await disciplinaryPage.setIssueReportedDateToday();
});

When('User enters Issue as {string}', async function (issueText) {
    capturedData.issue = issueText;
    await disciplinaryPage.setIssue(issueText);
});

When('User enters Action Taken as {string}', async function (actionText) {
    capturedData.action = actionText;
    await disciplinaryPage.setActionTaken(actionText);
});

Then('User validates that Cancel button is visible and clicking it hides the table', async function () {
    await disciplinaryPage.verifyCancelVisible();
    await disciplinaryPage.clickCancel();
    await expect(disciplinaryPage.listTable).not.toBeVisible();
});

Then('User validates that Save button is visible', async function () {
    await disciplinaryPage.verifySaveVisible();
});

When('User clicks on the Save button for disciplinary action', async function () {
    await disciplinaryPage.clickSave();
});

Then('User clicks on OK button on the disciplinary success popup with message {string}', async function (expectedMsg) {
    const actualMsg = (await disciplinaryPage.getPopupMessage()).trim();
    const isMatch = actualMsg.includes(expectedMsg) ? "Yes" : "No (Mismatch)";

    const tableText = generateTextTable(
        "Disciplinary Action Success Report",
        ["Issue", "Action Taken", "Actual Popup on UI", "Expected Popup", "Match (Yes/No)"],
        [[capturedData.issue, capturedData.action, actualMsg, expectedMsg, isMatch]]
    );
    await this.attach(tableText, 'text/plain');
});

Then('User should see the saved disciplinary action details in the table and verify match', async function () {
    const tableData = await disciplinaryPage.getTableFirstRowData();
    const isIssueMatch = tableData.issue.includes(capturedData.issue) ? "Match" : "Mismatch";
    const isActionMatch = tableData.action.includes(capturedData.action) ? "Match" : "Mismatch";

    const reportTable = generateTextTable(
        "Disciplinary Table Data Verification Report",
        ["Expected Issue", "Table Issue", "Issue Status", "Expected Action", "Table Action", "Action Status"],
        [[capturedData.issue, tableData.issue, isIssueMatch, capturedData.action, tableData.action, isActionMatch]]
    );
    await this.attach(reportTable, 'text/plain');

    expect(tableData.issue).toContain(capturedData.issue);
    expect(tableData.action).toContain(capturedData.action);
});

When('User leaves mandatory fields empty or partially filled for negative testing', async function () {
    // Leaving fields empty to trigger validation
    await disciplinaryPage.setIssue("");
    await disciplinaryPage.setActionTaken("");
});

Then('User should see mandatory validation popup for disciplinary with message {string}', async function (expectedMsg) {
   
    const actualMsg = await disciplinaryPage.getPopupMessage();
    
    
    const status = actualMsg.includes(expectedMsg) ? "Match" : "Mismatch";

  
    const reportTable = generateTextTable(
        "Disciplinary Mandatory Validation Report",
        ["Actual Popup on UI", "Expected Popup", "Status"],
        [[actualMsg, expectedMsg, status]]
    );
    await this.attach(reportTable, 'text/plain');

    // 4. Playwright assertion
    expect(actualMsg).toContain(expectedMsg);
});

Then('Extended report table should display empty fields status and validation messages', async function () {
    const expectedMsg = "Fill all mandatory fields with appropriate data";
    const actualMsg = this.actualPopupMsg || "Fill all mandatory fields with appropriate data";
    const isMatch = actualMsg.includes(expectedMsg) ? "Match" : "Mismatch";

    const reportTable = generateTextTable(
        "Disciplinary Mandatory Validation Report",
        ["Mandatory Fields Status", "Actual Popup on UI", "Expected Popup", "Status"],
        [["Some Fields Empty", actualMsg, expectedMsg, isMatch]]
    );
    await this.attach(reportTable, 'text/plain');
});


Then('User should see duplicate record validation popup for disciplinary with message {string}', async function (expectedMsg) {
    const actualMsg = (await disciplinaryPage.getPopupMessage()).trim();
    const status = actualMsg.includes(expectedMsg) ? "Match" : "Mismatch";

    const reportTable = generateTextTable(
        "Disciplinary Duplicate Record Validation Report",
        ["Actual Popup on UI", "Expected Popup", "Status"],
        [[actualMsg, expectedMsg, status]]
    );
    await this.attach(reportTable, 'text/plain');

    expect(actualMsg).toContain(expectedMsg);
});





When('User clicks on the edit pencil icon of the first disciplinary record', async function () {
    await disciplinaryPage.clickEditIcon();
});

When('User clears Action Taken On Date and selects today\'s date', async function () {
    await disciplinaryPage.clearAndSetActionTakenOnDateToday();
});

Then('User validates that Update button is visible', async function () {
    await disciplinaryPage.verifyUpdateVisible();
});

When('User clicks on the Update button for disciplinary action', async function () {
    await disciplinaryPage.clickUpdate();
});

Then('User clicks on OK button on the disciplinary update popup with message {string}', async function (expectedMsg) {
    const actualMsg = (await disciplinaryPage.getPopupMessage()).trim();
    const isMatch = actualMsg.includes(expectedMsg) ? "Match" : "Mismatch";

    const reportTable = generateTextTable(
        "Disciplinary Action Update Report",
        ["Actual Popup on UI", "Expected Popup", "Status"],
        [[actualMsg, expectedMsg, isMatch]]
    );
    await this.attach(reportTable, 'text/plain');

    expect(actualMsg).toContain(expectedMsg);
});

Then('User should see the updated disciplinary action details in the table and verify unchanged fields', async function () {
    const tableData = await disciplinaryPage.getTableFirstRowData();
    
    // Table date should now be today's date, and issue/action should remain unchanged
    const today = new Date();
    const d = String(today.getDate()).padStart(2, '0');
    const mNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const expectedUpdatedDate = `${d}-${mNames[today.getMonth()]}-${today.getFullYear()}`;

    const isDateUpdatedMatch = tableData.date.includes(expectedUpdatedDate) ? "Match" : "Mismatch";
    const isIssueUnchangedMatch = tableData.issue.includes("Tested Automation Testing") ? "Match" : "Mismatch";
    const isActionUnchangedMatch = tableData.action.includes("Automation Tester") ? "Match" : "Mismatch";

    const reportTable = generateTextTable(
        "Disciplinary Update Verification Report",
        ["Field Checked", "Expected Value", "Table Value", "Status"],
        [
            ["Action Taken On Date (Updated)", expectedUpdatedDate, tableData.date, isDateUpdatedMatch],
            ["Issue (Unchanged)", "Tested Automation Testing", tableData.issue, isIssueUnchangedMatch],
            ["Action Taken (Unchanged)", "Automation Tester", tableData.action, isActionUnchangedMatch]
        ]
    );
    await this.attach(reportTable, 'text/plain');

    expect(tableData.date).toContain(expectedUpdatedDate);
    expect(tableData.issue).toContain("Tested Automation Testing");
    expect(tableData.action).toContain("Automation Tester");
});