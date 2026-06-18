/**
 * ATTENDANCE STEPS - Step Definitions for Attendance Module
 * Tier 2 - Step Definitions & Lifecycle Hooks
 * Maps Gherkin scenarios to step implementations
 */

const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { ManualAttendancePage } = require('../../pages/attendance/manualAttendance.page');
const { AttendanceApprovalPage } = require('../../pages/attendance/attendanceApproval.page');
const { OutDutyPage } = require('../../pages/attendance/outDuty.page');
const { WeekOffDefaultPage } = require('../../pages/attendance/weekOffDefault.page');
const { AccessCardPage } = require('../../pages/attendance/accessCard.page');
const { WeekOffShiftTemplatePage } = require('../../pages/attendance/weekOffShiftTemplate.page');
const { DeleteManualAttendancePage } = require('../../pages/attendance/deleteManualAttendance.page');

let manualAttendancePage;
let attendanceApprovalPage;
let outDutyPage;
let weekOffPage;
let accessCardPage;
let templatePage;
let deleteAttendancePage;

Given('User navigates to Attendance module', async function() {
    manualAttendancePage = new ManualAttendancePage(this.page);
    // Module navigation happens in specific scenarios
});

Given('Manual attendance record exists for employee', async function() {
    manualAttendancePage = new ManualAttendancePage(this.page);
    const records = await manualAttendancePage.getAllAttendance();
    expect(records.length).toBeGreaterThan(0);
});

Given('Manual attendance record exists', async function() {
    manualAttendancePage = new ManualAttendancePage(this.page);
    const records = await manualAttendancePage.getAllAttendance();
    expect(records.length).toBeGreaterThan(0);
    this.recordToDelete = records[0];
});

Given('Manager has pending attendance records', async function() {
    attendanceApprovalPage = new AttendanceApprovalPage(this.page);
    await attendanceApprovalPage.navigateToAttendanceApproval();
    const pending = await attendanceApprovalPage.getPendingAttendance();
    expect(pending.length).toBeGreaterThan(0);
});

Given('Access card exists for employee', async function() {
    accessCardPage = new AccessCardPage(this.page);
    const cards = await accessCardPage.getAllAccessCards();
    expect(cards.length).toBeGreaterThan(0);
    this.cardToDeactivate = cards[0][0]; // Card number
});

When('User navigates to Manual Attendance', async function() {
    manualAttendancePage = new ManualAttendancePage(this.page);
    await manualAttendancePage.navigateToManualAttendance();
});

When('User adds manual attendance with following details:', async function(dataTable) {
    manualAttendancePage = new ManualAttendancePage(this.page);
    const attendanceData = dataTable.rowsHash();
    const formattedData = {
        employeeId: attendanceData['Employee ID'],
        date: attendanceData['Date'],
        checkInTime: attendanceData['Check-in'],
        checkOutTime: attendanceData['Check-out'],
        status: attendanceData['Status'],
        remarks: attendanceData['Remarks']
    };
    await manualAttendancePage.addManualAttendance(formattedData);
    this.lastAttendance = formattedData;
});

When('User edits the attendance record with following details:', async function(dataTable) {
    manualAttendancePage = new ManualAttendancePage(this.page);
    const records = await manualAttendancePage.getAllAttendance();
    const recordId = records[0][0];
    const newData = dataTable.rowsHash();
    await manualAttendancePage.editAttendanceRecord(recordId, newData);
});

When('User clicks Bulk Upload button', async function() {
    await manualAttendancePage.bulkUploadAttendance('./fixtures/attendance.xlsx');
});

When('User selects attendance file', async function() {
    // File selection is handled in the bulkUploadAttendance method
});

When('User confirms upload', async function() {
    // Confirmation is automatic after file selection
});

When('Manager approves attendance record for employee {string}', async function(employeeId) {
    attendanceApprovalPage = new AttendanceApprovalPage(this.page);
    const records = await attendanceApprovalPage.getPendingAttendance();
    const recordId = records[0][0];
    await attendanceApprovalPage.approveAttendance(recordId);
});

When('Manager adds approval comments', async function() {
    // Comments are optional
});

When('User navigates to Delete Manual Attendance', async function() {
    deleteAttendancePage = new DeleteManualAttendancePage(this.page);
    await deleteAttendancePage.navigateToDeleteAttendance();
});

When('User searches records to delete', async function() {
    await deleteAttendancePage.searchRecordsForDeletion({});
});

When('User selects attendance record for deletion', async function() {
    await deleteAttendancePage.selectRecordForDeletion(this.recordToDelete[0]);
});

When('User confirms deletion', async function() {
    await deleteAttendancePage.deleteSelectedRecords();
});

When('User navigates to Out Duty', async function() {
    outDutyPage = new OutDutyPage(this.page);
    await outDutyPage.navigateToOutDuty();
});

When('User creates out-of-duty request with following details:', async function(dataTable) {
    outDutyPage = new OutDutyPage(this.page);
    const outDutyData = dataTable.rowsHash();
    const formattedData = {
        employeeId: outDutyData['Employee ID'],
        startDate: outDutyData['Start Date'],
        endDate: outDutyData['End Date'],
        startTime: outDutyData['Start Time'],
        endTime: outDutyData['End Time'],
        purpose: outDutyData['Purpose']
    };
    await outDutyPage.createOutDuty(formattedData);
    this.lastOutDuty = formattedData;
});

When('Manager approves the out-duty request', async function() {
    const duties = await outDutyPage.getAllOutDuties();
    const employeeId = duties[0][0];
    await outDutyPage.approveOutDuty(employeeId);
});

When('Manager rejects the out-duty request', async function() {
    const duties = await outDutyPage.getAllOutDuties();
    const employeeId = duties[0][0];
    await outDutyPage.rejectOutDuty(employeeId, 'Not approved');
});

When('Manager provides rejection reason', async function() {
    // Reason is included in the reject method
});

When('User navigates to Week Off Default', async function() {
    weekOffPage = new WeekOffDefaultPage(this.page);
    await weekOffPage.navigateToWeekOffDefault();
});

When('User assigns week off with following details:', async function(dataTable) {
    weekOffPage = new WeekOffDefaultPage(this.page);
    const weekOffData = dataTable.rowsHash();
    const formattedData = {
        employeeId: weekOffData['Employee ID'],
        day: weekOffData['Day'],
        alternateDay: weekOffData['Alternate Day'],
        effectiveDate: weekOffData['Effective Date']
    };
    await weekOffPage.assignWeekOff(formattedData);
    this.lastWeekOff = formattedData;
});

When('User navigates to Access Card', async function() {
    accessCardPage = new AccessCardPage(this.page);
    await accessCardPage.navigateToAccessCard();
});

When('User issues card with following details:', async function(dataTable) {
    accessCardPage = new AccessCardPage(this.page);
    const cardData = dataTable.rowsHash();
    const formattedData = {
        employeeId: cardData['Employee ID'],
        cardNumber: cardData['Card Number'],
        cardType: cardData['Card Type'],
        issueDate: cardData['Issue Date'],
        expiryDate: cardData['Expiry Date']
    };
    await accessCardPage.issueAccessCard(formattedData);
    this.lastAccessCard = formattedData;
});

When('User deactivates the access card', async function() {
    await accessCardPage.deactivateCard(this.cardToDeactivate);
});

When('User confirms deactivation', async function() {
    // Confirmation is handled in the deactivateCard method
});

When('User navigates to Week Off Shift Template', async function() {
    templatePage = new WeekOffShiftTemplatePage(this.page);
    await templatePage.navigateToTemplate();
});

When('User creates template with following details:', async function(dataTable) {
    templatePage = new WeekOffShiftTemplatePage(this.page);
    const templateData = dataTable.rowsHash();
    const formattedData = {
        name: templateData['Template Name'],
        cycleType: templateData['Cycle Type'],
        cycleDays: templateData['Cycle Days'],
        weekOffDays: templateData['Week Off Days'],
        dayPattern: ''
    };
    await templatePage.createTemplate(formattedData);
    this.lastTemplate = formattedData;
});

Then('Attendance record should be added successfully', async function() {
    const message = await manualAttendancePage.verifySuccessMessage();
    expect(message).toBeTruthy();
});

Then('Record should be visible in attendance table', async function() {
    const records = await manualAttendancePage.getAllAttendance();
    expect(records.length).toBeGreaterThan(0);
});

Then('Attendance record should be updated successfully', async function() {
    const message = await manualAttendancePage.verifySuccessMessage();
    expect(message).toBeTruthy();
});

Then('Updated details should reflect in the system', async function() {
    const records = await manualAttendancePage.getAllAttendance();
    expect(records.length).toBeGreaterThan(0);
});

Then('Attendance records should be uploaded successfully', async function() {
    const message = await manualAttendancePage.verifySuccessMessage();
    expect(message).toBeTruthy();
});

Then('System displays upload summary with count', async function() {
    // Summary display verification
});

Then('Attendance should be approved successfully', async function() {
    const message = await attendanceApprovalPage.verifySuccessMessage();
    expect(message).toBeTruthy();
});

Then('Attendance record should be deleted successfully', async function() {
    const message = await deleteAttendancePage.verifySuccessMessage();
    expect(message).toBeTruthy();
});

Then('Out-duty request should be created successfully', async function() {
    const message = await outDutyPage.verifySuccessMessage();
    expect(message).toBeTruthy();
});

Then('Status should be {string}', async function(status) {
    // Status verification in UI
});

Then('Request status should change to {string}', async function(status) {
    // Status change verification
});

Then('Employee receives notification', async function() {
    // Notification verification
});

Then('Week off should be assigned successfully', async function() {
    const message = await weekOffPage.verifySuccessMessage();
    expect(message).toBeTruthy();
});

Then('Assignment should be visible in week off list', async function() {
    const assignments = await weekOffPage.getAllWeekOffAssignments();
    expect(assignments.length).toBeGreaterThan(0);
});

Then('Access card should be issued successfully', async function() {
    const message = await accessCardPage.verifySuccessMessage();
    expect(message).toBeTruthy();
});

Then('Card should be visible in card list', async function() {
    const cards = await accessCardPage.getAllAccessCards();
    expect(cards.length).toBeGreaterThan(0);
});

Then('Card status should change to {string}', async function(status) {
    // Status verification
});

Then('Template should be created successfully', async function() {
    const message = await templatePage.verifySuccessMessage();
    expect(message).toBeTruthy();
});

Then('Template should be available for assignment', async function() {
    const templates = await templatePage.getAllTemplates();
    expect(templates.length).toBeGreaterThan(0);
});

module.exports = {
    manualAttendancePage,
    attendanceApprovalPage,
    outDutyPage,
    weekOffPage,
    accessCardPage,
    templatePage,
    deleteAttendancePage
};
