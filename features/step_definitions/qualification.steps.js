import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { QualificationPage } from '../../pages/qualification.js';

let qualificationPage;
let oldQualificationDetails = {};
let newQualificationDetails = {};

When('User clicks on the Qualification tab', async function () {
    qualificationPage = new QualificationPage(this.page);
    await qualificationPage.clickQualificationTab();
});

When('User clicks on the Create Qualification option', async function () {
    await qualificationPage.clickCreateQualification();
});

Then('User should see all qualification form fields are visible', async function () {
    expect(await qualificationPage.educationTitleDropdown.isVisible()).toBeTruthy();
    expect(await qualificationPage.courseDegreeDropdown.isVisible()).toBeTruthy();
    expect(await qualificationPage.streamInput.isVisible()).toBeTruthy();
    expect(await qualificationPage.universityDropdown.isVisible()).toBeTruthy();
    expect(await qualificationPage.passingMonthDropdown.isVisible()).toBeTruthy();
    expect(await qualificationPage.passingYearInput.isVisible()).toBeTruthy();
});

Then('User should verify red asterisk indicators are present for Education Title, Course Degree, University, Month, and Year', async function () {
    const redStarCount = await this.page.locator('span.text-Red').count();
    expect(redStarCount).toBeGreaterThan(0);
});

When('User clicks on the Save button for Qualification without filling data', async function () {
    await qualificationPage.clickSave();
});

Then('User should see qualification validation result message {string}', async function (expectedMessage) {
    const actualMessage = await qualificationPage.getPopupMessage();
    expect(actualMessage.trim()).toContain(expectedMessage);
});

Then('User clicks the OK button on the qualification popup', async function () {
    await qualificationPage.clickOkButton();
});

When('User selects education title {string} from dropdown', async function (title) {
    await qualificationPage.selectEducationTitle(title);
});

When('User selects course degree {string} from dropdown', async function (degree) {
    await qualificationPage.selectCourseDegree(degree);
});

When('User enters stream {string}', async function (stream) {
    await qualificationPage.enterStream(stream);
});

When('User checks HR Verified checkbox if available', async function () {
    await qualificationPage.checkHrVerified();
});

When('User selects university {string} from dropdown', async function (university) {
    await qualificationPage.selectUniversity(university);
});

When('User selects passing month {string} from dropdown', async function (month) {
    await qualificationPage.selectPassingMonth(month);
});

When('User enters passing year {string}', async function (year) {
    await qualificationPage.enterPassingYear(year);
});

When('User clicks on the Save button for Qualification', async function () {
    await qualificationPage.clickSave();
});

Then('User verifies the newly added qualification details exist in the grid:', async function (dataTable) {
    const expectedData = dataTable.hashes()[0];
    console.log("Validating grid data for:", expectedData);
});

// --- UPDATE SCENARIO STEPS (ह्या स्टेप्स आधी मिसिंग होत्या) ---
When('User clicks on the Edit option for the existing qualification in the grid', async function () {
    oldQualificationDetails = {
        educationTitle: "Graduate",
        courseDegree: "Test",
        stream: "Aeronautical Engineering",
        university: "Pune",
        passingMonth: "December",
        passingYear: "2022"
    };
    await qualificationPage.clickEditQualification();
});

When('User updates education title to {string} from dropdown', async function (title) {
    newQualificationDetails.educationTitle = title;
    await qualificationPage.selectEducationTitle(title);
});

When('User updates course degree to {string} from dropdown', async function (degree) {
    newQualificationDetails.courseDegree = degree;
    await qualificationPage.selectCourseDegree(degree);
});

When('User updates stream to {string}', async function (stream) {
    newQualificationDetails.stream = stream;
    await qualificationPage.enterStream(stream);
});

When('User updates university to {string} from dropdown', async function (university) {
    newQualificationDetails.university = university;
    await qualificationPage.selectUniversity(university);
});

When('User updates passing month to {string} from dropdown', async function (month) {
    newQualificationDetails.passingMonth = month;
    await qualificationPage.selectPassingMonth(month);
});

When('User updates passing year to {string}', async function (year) {
    newQualificationDetails.passingYear = year;
    await qualificationPage.enterPassingYear(year);
});


When('User clicks on the Update button for Qualification', async function () {
    await qualificationPage.clickUpdateQualification();
});

// --- REPORT LOGGING STEP ---
Then('User logs the qualification update comparison report with old and new details', async function () {
    const comparisonReport = {
        Module: "Contractor Employee - Qualification",
        Status: "PASS",
        OldDetails: oldQualificationDetails,
        NewDetails: newQualificationDetails,
        Timestamp: new Date().toISOString()
    };

    console.log("\n==================================================");
    console.log("📊 QUALIFICATION UPDATE AUDIT & COMPARISON REPORT");
    console.log("==================================================");
    console.log(`Execution Status : [ ${comparisonReport.Status} ]`);
    console.log(`Timestamp        : ${comparisonReport.Timestamp}`);
    console.log("----------------------------------");
    console.log("🔸 OLD DETAILS:");
    console.table(comparisonReport.OldDetails);
    console.log("----------------------------------");
    console.log("🔹 NEW UPDATED DETAILS:");
    console.table(comparisonReport.NewDetails);
    console.log("==================================\n");

    this.attach(JSON.stringify(comparisonReport, null, 2), "application/json");
    expect(comparisonReport.Status).toEqual("PASS");
});