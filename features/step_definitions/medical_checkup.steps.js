const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const MedicalCheckupPage = require('../../pages/medical_checkup');

let medicalCheckupPage;
let capturedDate = "";
let capturedDesc = "";
let updatedDate = "";

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

function addDaysToDate(dateStr, days) {
    if (!dateStr) {
        const today = new Date();
        today.setDate(today.getDate() + days);
        const d = String(today.getDate()).padStart(2, '0');
        const mNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${d}-${mNames[today.getMonth()]}-${today.getFullYear()}`;
    }
    let parts = dateStr.split('-');
    if (parts.length < 3) return dateStr; 
    let day = parseInt(parts[0], 10);
    let monthStr = parts[1];
    let year = parseInt(parts[2], 10);
    
    let months = {Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11};
    let dateObj = new Date(year, months[monthStr], day);
    dateObj.setDate(dateObj.getDate() + days);
    
    let d = String(dateObj.getDate()).padStart(2, '0');
    let mNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let m = mNames[dateObj.getMonth()];
    let y = dateObj.getFullYear();
    
    return `${d}-${m}-${y}`;
}

Given('User clicks on the Medical Checkup menu option', async function () {
    medicalCheckupPage = new MedicalCheckupPage(this.page);
    await medicalCheckupPage.navigateToMedicalCheckup();
});

When('User extracts the employee join date', async function () {
    this.extractedJoinDate = await medicalCheckupPage.getJoinDate();
});

When('User clicks on the Create Medical Checkup button', async function () {
    await medicalCheckupPage.clickCreate();
});

When('User selects extracted join date into Checkup Date field', async function () {
    // spnEmployeeJoinDate madhli date extract karun calendar madun select karu
    this.extractedJoinDate = await medicalCheckupPage.getJoinDate();
    this.currentCheckupDate = this.extractedJoinDate; 
    await medicalCheckupPage.setCheckupDate(this.currentCheckupDate);
});

When('User enters description as {string}', async function (baseDesc) {
    this.currentDescription = `${baseDesc} - ${this.extractedJoinDate}`;
    capturedDate = this.currentCheckupDate;
    capturedDesc = this.currentDescription;
    await medicalCheckupPage.setDescription(this.currentDescription);
});

Then('User validates that both Save and Cancel buttons are visible', async function () {
    await medicalCheckupPage.verifyButtonsVisible();
});

When('User clicks on the Save button for medical checkup', async function () {
    await medicalCheckupPage.clickSave();
});

Then('User clicks on OK button on the success popup with message {string}', async function (expectedMsg) {
    const actualMsg = (await medicalCheckupPage.getPopupMessage()).trim();
    const isMatch = actualMsg.includes(expectedMsg) ? "Yes" : "No (Mismatch)";

    const tableText = generateTextTable(
        "Medical Checkup Success Report",
        ["Checkup Date", "Description", "Actual Popup on UI", "Expected Popup", "Match (Yes/No)"],
        [[this.currentCheckupDate, this.currentDescription, actualMsg, expectedMsg, isMatch]]
    );
    await this.attach(tableText, 'text/plain');
});

Then('User should see the saved medical checkup details in the table', async function () {
    await medicalCheckupPage.verifyTableVisible();
});

When('User leaves {string} and enters {string}', async function (dateStatus, descStatus) {
    // Negative test sathi jar 'Empty' dila asel, tar kharch input clear karu
    if (dateStatus === 'Empty') {
        this.currentCheckupDate = "";
        await medicalCheckupPage.checkupDateInput.click();
        await medicalCheckupPage.checkupDateInput.press('Control+A');
        await medicalCheckupPage.checkupDateInput.press('Backspace');
    } else {
        this.extractedJoinDate = await medicalCheckupPage.getJoinDate();
        this.currentCheckupDate = this.extractedJoinDate;
        await medicalCheckupPage.setCheckupDate(this.currentCheckupDate);
    }

    if (descStatus === 'Empty') {
        this.currentDescription = "";
        await medicalCheckupPage.descriptionInput.click();
        await medicalCheckupPage.descriptionInput.press('Control+A');
        await medicalCheckupPage.descriptionInput.press('Backspace');
    } else {
        this.currentDescription = "Automation Auto Fill Data";
        await medicalCheckupPage.setDescription(this.currentDescription);
    }
});

Then('User should see mandatory validation popup with message {string}', async function (expectedMsg) {
    this.actualPopupMsg = (await medicalCheckupPage.getPopupMessage()).trim();
    expect(this.actualPopupMsg).toContain(expectedMsg);
});

Then('Extended report table should display empty field status, entered details, and popup messages', async function () {
    const dateFieldVal = this.currentCheckupDate ? "Filled" : "Empty";
    const descFieldVal = this.currentDescription ? "Filled" : "Empty";
    const expectedMsg = "Fill all mandatory fields with appropriate data";
    const actualMsg = this.actualPopupMsg || "Fill all mandatory fields with appropriate data";
    
    const isMatch = actualMsg.includes(expectedMsg) ? "Yes" : "NO (RED/MISMATCH)";

    const reportTable = generateTextTable(
        "Mandatory Validation Report",
        ["Checkup Date Status", "Description Status", "Actual Popup on UI", "Expected Popup", "Match (Yes/No)"],
        [[dateFieldVal, descFieldVal, actualMsg, expectedMsg, isMatch]]
    );
    await this.attach(reportTable, 'text/plain');
});

When('User captures the filled medical checkup details', async function () {
    // Values are captured during creation
});

Then('User should see the same details correctly displayed in the table', async function () {
    const tableData = await medicalCheckupPage.getTableFirstRowData();
    const isDateMatch = tableData.date.includes(capturedDate) ? "Yes" : "No";
    const isDescMatch = tableData.description.includes(capturedDesc) ? "Yes" : "No";

    const verificationTable = generateTextTable(
        "Table Data Verification Report",
        ["Filled Date", "Table Date", "Date Match", "Filled Desc", "Table Desc", "Desc Match"],
        [[capturedDate, tableData.date, isDateMatch, capturedDesc, tableData.description, isDescMatch]]
    );
    await this.attach(verificationTable, 'text/plain');

    expect(tableData.date).toContain(capturedDate);
    expect(tableData.description).toContain(capturedDesc);
});

When('User clicks on the edit pencil icon for the medical checkup record', async function () {
    await medicalCheckupPage.clickEdit();
});

When('User updates the Checkup Date by adding 6 days to the existing date', async function () {
    const currentTableDate = await medicalCheckupPage.getTableFirstRowData();
    const baseDate = currentTableDate.date || capturedDate || this.extractedJoinDate;
    updatedDate = addDaysToDate(baseDate, 6);
    
    await medicalCheckupPage.setCheckupDate(updatedDate);
});

When('User clicks on the Update button', async function () {
    await medicalCheckupPage.clickUpdate();
});

Then('User clicks on OK button on the update success popup with message {string}', async function (expectedMsg) {
    const actualMsg = (await medicalCheckupPage.getPopupMessage()).trim();
    const isMatch = actualMsg.includes(expectedMsg) ? "Yes" : "No (Mismatch)";

    const tableText = generateTextTable(
        "Medical Checkup Update Report",
        ["Updated Date", "Actual Popup on UI", "Expected Popup", "Match (Yes/No)"],
        [[updatedDate, actualMsg, expectedMsg, isMatch]]
    );
    await this.attach(tableText, 'text/plain');
});

Then('User should see the updated medical checkup details reflected in the table', async function () {
    await medicalCheckupPage.page.waitForFunction(
        (expectedDate) => {
            const firstRowCell = document.querySelector('table tbody tr td');
            return firstRowCell && firstRowCell.innerText.includes(expectedDate);
        },
        updatedDate,
        { timeout: 10000 }
    ).catch(() => console.log("Warning: Timeout waiting for table date to update in DOM"));
    
    const tableData = await medicalCheckupPage.getTableFirstRowData();
    const isUpdatedMatch = tableData.date.includes(updatedDate) ? "Yes" : "No";

    const updateVerificationTable = generateTextTable(
        "Updated Table Reflection Report",
        ["Expected Updated Date", "Table Reflected Date", "Reflection Match (Yes/No)"],
        [[updatedDate, tableData.date, isUpdatedMatch]]
    );
    await this.attach(updateVerificationTable, 'text/plain');

    expect(tableData.date).toContain(updatedDate);
});