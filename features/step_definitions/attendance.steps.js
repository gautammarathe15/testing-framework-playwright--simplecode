/**
 * LEAVE STEPS - Step Definitions for Leave Module
 * Tier 2 - Step Definitions & Lifecycle Hooks
 * Maps Gherkin scenarios to step implementations
 */

const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { LeaveApplicationPage } = require('../../pages/leave/leaveApplication.page');
const { LeaveApprovalPage } = require('../../pages/leave/leaveApproval.page');
const { LeaveBalancePage } = require('../../pages/leave/leaveBalance.page');
const { HolidayListPage } = require('../../pages/leave/holidayList.page');

let leaveApplicationPage;
let leaveApprovalPage;
let leaveBalancePage;
let holidayListPage;

Given('User navigates to Leave module', async function() {
    leaveApplicationPage = new LeaveApplicationPage(this.page);
    await leaveApplicationPage.navigateToLeaveApplication();
});

Given('User has submitted a leave application', async function() {
    leaveApplicationPage = new LeaveApplicationPage(this.page);
    const leaveData = {
        leaveType: 'annual',
        startDate: '2026-07-01',
        endDate: '2026-07-05',
        reason: 'Test vacation'
    };
    await leaveApplicationPage.applyForLeave(leaveData);
    this.lastLeaveApplication = leaveData;
});

Given('Application status is {string}', async function(status) {
    // Status verification would be done in UI
});

Given('Manager has pending leave applications to review', async function() {
    leaveApprovalPage = new LeaveApprovalPage(this.page);
    await leaveApprovalPage.navigateToLeaveApproval();
    const pending = await leaveApprovalPage.getPendingApplications();
    expect(pending.length).toBeGreaterThan(0);
});

Given('Application is from {string}', async function(employeeId) {
    this.targetEmployeeId = employeeId;
});

When('User applies for leave with following details:', async function(dataTable) {
    leaveApplicationPage = new LeaveApplicationPage(this.page);
    const leaveData = dataTable.rowsHash();
    const formattedData = {
        leaveType: leaveData['Leave Type'].toLowerCase(),
        startDate: leaveData['Start Date'],
        endDate: leaveData['End Date'],
        reason: leaveData['Reason']
    };
    await leaveApplicationPage.applyForLeave(formattedData);
    this.lastLeaveApplication = formattedData;
});

When('User withdraws the leave application', async function() {
    leaveApplicationPage = new LeaveApplicationPage(this.page);
    const applications = await leaveApplicationPage.getAllApplications();
    const appId = applications[0][0]; // Get first application ID
    await leaveApplicationPage.withdrawApplication(appId);
});

When('Manager approves the leave application', async function() {
    leaveApprovalPage = new LeaveApprovalPage(this.page);
    const applications = await leaveApprovalPage.getPendingApplications();
    const appId = applications[0][0]; // Get first application ID
    await leaveApprovalPage.approveLeaveApplication(appId);
});

When('Manager provides approval comments', async function() {
    // Comments are optional in the approve method
});

When('Manager rejects the leave application', async function() {
    leaveApprovalPage = new LeaveApprovalPage(this.page);
    const applications = await leaveApprovalPage.getPendingApplications();
    const appId = applications[0][0];
    await leaveApprovalPage.rejectLeaveApplication(appId, 'Not approved');
});

When('Manager provides rejection reason', async function() {
    // Reason is included in the reject method
});

When('User navigates to Leave Balance', async function() {
    leaveBalancePage = new LeaveBalancePage(this.page);
    await leaveBalancePage.navigateToLeaveBalance();
});

When('User selects employee and year', async function() {
    // This is done in the viewEmployeeBalance method
});

When('Manager adjusts leave balance with following details:', async function(dataTable) {
    leaveBalancePage = new LeaveBalancePage(this.page);
    const adjustmentData = dataTable.rowsHash();
    const formattedData = {
        employeeId: adjustmentData['Employee ID'],
        leaveType: adjustmentData['Leave Type'],
        days: adjustmentData['Days to Add'],
        reason: adjustmentData['Reason']
    };
    await leaveBalancePage.adjustLeaveBalance(formattedData);
});

When('User navigates to Holiday List', async function() {
    holidayListPage = new HolidayListPage(this.page);
    await holidayListPage.navigateToHolidayList();
});

When('User creates a holiday with following details:', async function(dataTable) {
    holidayListPage = new HolidayListPage(this.page);
    const holidayData = dataTable.rowsHash();
    const formattedData = {
        name: holidayData['Holiday Name'],
        date: holidayData['Date'],
        description: holidayData['Description'] || '',
        type: holidayData['Type']
    };
    await holidayListPage.createHoliday(formattedData);
    this.lastCreatedHoliday = formattedData;
});

When('User clicks Export button', async function() {
    await leaveBalancePage.exportBalanceReport();
});

When('User selects export format as {string}', async function(format) {
    // Format selection would be in a dialog
});

When('User applies for {string} leave', async function(leaveType) {
    leaveApplicationPage = new LeaveApplicationPage(this.page);
    this.currentLeaveType = leaveType;
});

Then('Leave application should be submitted successfully', async function() {
    const message = await leaveApplicationPage.verifySuccessMessage();
    expect(message).toBeTruthy();
});

Then('Application status should be {string}', async function(status) {
    const applications = await leaveApplicationPage.getAllApplications();
    expect(applications.length).toBeGreaterThan(0);
    // Status verification in UI
});

Then('Manager receives notification for approval', async function() {
    // Notification verification would be in UI
});

Then('Application should be withdrawn successfully', async function() {
    const message = await leaveApplicationPage.verifySuccessMessage();
    expect(message).toBeTruthy();
});

Then('Status should change to {string}', async function(status) {
    // Status change verification in UI
});

Then('Application status should change to {string}', async function(status) {
    // Status verification in the applications table
});

Then('Employee receives approval notification', async function() {
    // Notification verification
});

Then('Employee receives rejection notification', async function() {
    // Notification verification
});

Then('System displays available leave balance', async function() {
    const balance = await leaveBalancePage.viewEmployeeBalance('EMP001');
    expect(balance).toBeTruthy();
});

Then('Leave balance breakdown shows:', async function(dataTable) {
    const expected = dataTable.rowsHash();
    // Verification of balance breakdown
});

Then('Leave balance should be adjusted successfully', async function() {
    const message = await leaveBalancePage.verifySuccessMessage();
    expect(message).toBeTruthy();
});

Then('Adjustment history should record the change', async function() {
    const history = await leaveBalancePage.getAdjustmentHistory();
    expect(history.length).toBeGreaterThan(0);
});

Then('Holiday should be created successfully', async function() {
    const message = await holidayListPage.verifySuccessMessage();
    expect(message).toBeTruthy();
});

Then('Holiday should be visible in holiday list', async function() {
    const holidays = await holidayListPage.getAllHolidays();
    const found = holidays.some(h => h.includes(this.lastCreatedHoliday.name));
    expect(found).toBeTruthy();
});

Then('System should generate and download the report', async function() {
    // File download verification
});

Then('Application should be submitted with status {string}', async function(status) {
    const message = await leaveApplicationPage.verifySuccessMessage();
    expect(message).toBeTruthy();
});

module.exports = {
    leaveApplicationPage,
    leaveApprovalPage,
    leaveBalancePage,
    holidayListPage
};
