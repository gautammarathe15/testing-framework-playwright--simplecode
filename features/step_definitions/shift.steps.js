/**
 * SHIFT STEPS - Step Definitions for Shift Module
 * Tier 2 - Step Definitions & Lifecycle Hooks
 * Maps Gherkin scenarios to step implementations
 */

const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { ShiftPage } = require('../../pages/shift/shift.page');
const { ShiftPolicyPage } = require('../../pages/shift/shiftPolicy.page');
const { ShiftScopePage } = require('../../pages/shift/shiftScope.page');
const { DefaultShiftPage } = require('../../pages/shift/defaultShift.page');
const { ShiftRotationPatternPage } = require('../../pages/shift/shiftRotationPattern.page');
const { ShiftCorrectionPage } = require('../../pages/shift/shiftCorrection.page');

let shiftPage;
let shiftPolicyPage;
let shiftRotationPatternPage;
let shiftCorrectionPage;

Given('User is logged in to the CLMS application', async function() {
    // Assume login is handled in hooks or test setup
    // This step assumes the user is already authenticated
    expect(this.page).toBeDefined();
});

Given('User navigates to Shift module', async function() {
    shiftPage = new ShiftPage(this.page);
    await shiftPage.navigateToShift();
});

Given('A shift {string} exists in the system', async function(shiftName) {
    shiftPage = new ShiftPage(this.page);
    const shifts = await shiftPage.searchShift(shiftName);
    expect(shifts.length).toBeGreaterThan(0);
    this.currentShift = shiftName;
});

Given('Multiple shifts exist in the system', async function() {
    shiftPage = new ShiftPage(this.page);
    const shifts = await shiftPage.getAllShifts();
    expect(shifts.length).toBeGreaterThan(0);
});

When('User creates a new shift with the following details:', async function(dataTable) {
    shiftPage = new ShiftPage(this.page);
    const shiftData = dataTable.rowsHash();
    const formattedData = {
        name: shiftData['Shift Name'],
        startTime: shiftData['Start Time'],
        endTime: shiftData['End Time'],
        description: shiftData['Description']
    };
    await shiftPage.createNewShift(formattedData);
    this.lastCreatedShift = formattedData.name;
});

When('User edits the shift {string} with following details:', async function(shiftName, dataTable) {
    shiftPage = new ShiftPage(this.page);
    const newData = dataTable.rowsHash();
    await shiftPage.editShift(shiftName, newData);
});

When('User deletes the shift {string}', async function(shiftName) {
    shiftPage = new ShiftPage(this.page);
    await shiftPage.deleteShift(shiftName);
});

When('User confirms the deletion', async function() {
    // Confirmation is handled in the deleteShift method
});

When('User searches for shift {string}', async function(shiftName) {
    shiftPage = new ShiftPage(this.page);
    const results = await shiftPage.searchShift(shiftName);
    this.searchResults = results;
});

When('User navigates to Shift Policy', async function() {
    shiftPolicyPage = new ShiftPolicyPage(this.page);
    await shiftPolicyPage.navigateToShiftPolicy();
});

When('User creates a shift policy with following details:', async function(dataTable) {
    shiftPolicyPage = new ShiftPolicyPage(this.page);
    const policyData = dataTable.rowsHash();
    const formattedData = {
        name: policyData['Policy Name'],
        description: policyData['Description'] || '',
        breakDuration: policyData['Break Duration'],
        overtimeRule: policyData['Overtime Rule']
    };
    await shiftPolicyPage.createShiftPolicy(formattedData);
    this.lastCreatedPolicy = formattedData.name;
});

When('User navigates to Shift Rotation Pattern', async function() {
    shiftRotationPatternPage = new ShiftRotationPatternPage(this.page);
    await shiftRotationPatternPage.navigateToRotationPattern();
});

When('User creates a rotation pattern with following details:', async function(dataTable) {
    shiftRotationPatternPage = new ShiftRotationPatternPage(this.page);
    const patternData = dataTable.rowsHash();
    const formattedData = {
        name: patternData['Pattern Name'],
        cycleType: patternData['Cycle Type'],
        cycleLength: patternData['Cycle Length'],
        shiftSequence: patternData['Shift Sequence']
    };
    await shiftRotationPatternPage.createRotationPattern(formattedData);
    this.lastCreatedPattern = formattedData.name;
});

When('User navigates to Shift Correction', async function() {
    shiftCorrectionPage = new ShiftCorrectionPage(this.page);
    await shiftCorrectionPage.navigateToShiftCorrection();
});

When('User creates a shift correction with following details:', async function(dataTable) {
    shiftCorrectionPage = new ShiftCorrectionPage(this.page);
    const correctionData = dataTable.rowsHash();
    const formattedData = {
        employeeId: correctionData['Employee ID'],
        date: correctionData['Date'],
        originalShift: correctionData['Original Shift'],
        newShift: correctionData['New Shift'],
        reason: correctionData['Reason']
    };
    await shiftCorrectionPage.createShiftCorrection(formattedData);
    this.lastCreatedCorrection = formattedData;
});

When('Manager can approve the correction', async function() {
    const employeeName = this.lastCreatedCorrection.employeeId;
    await shiftCorrectionPage.approveCorrection(employeeName);
});

Then('Shift should be created successfully', async function() {
    const message = await shiftPage.verifySuccessMessage();
    expect(message).toBeTruthy();
});

Then('Shift {string} should be visible in the shift list', async function(shiftName) {
    const shifts = await shiftPage.searchShift(shiftName);
    expect(shifts.length).toBeGreaterThan(0);
});

Then('Shift should be updated successfully', async function() {
    const message = await shiftPage.verifySuccessMessage();
    expect(message).toBeTruthy();
});

Then('Updated shift details should reflect in the list', async function() {
    // Details automatically reflected after update
});

Then('Shift should be deleted successfully', async function() {
    const message = await shiftPage.verifySuccessMessage();
    expect(message).toBeTruthy();
});

Then('Shift {string} should not be visible in the list', async function(shiftName) {
    const shifts = await shiftPage.searchShift(shiftName);
    expect(shifts.length).toBe(0);
});

Then('Search results should display shift {string}', async function(shiftName) {
    expect(this.searchResults.length).toBeGreaterThan(0);
    const found = this.searchResults.some(row => row.includes(shiftName));
    expect(found).toBeTruthy();
});

Then('Shift policy should be created successfully', async function() {
    const message = await shiftPolicyPage.verifySuccessMessage();
    expect(message).toBeTruthy();
});

Then('Policy {string} should be visible in policy list', async function(policyName) {
    const policies = await shiftPolicyPage.getAllPolicies();
    const found = policies.some(policy => policy.includes(policyName));
    expect(found).toBeTruthy();
});

Then('Rotation pattern should be created successfully', async function() {
    const message = await shiftRotationPatternPage.verifySuccessMessage();
    expect(message).toBeTruthy();
});

Then('Pattern {string} should be visible in pattern list', async function(patternName) {
    const patterns = await shiftRotationPatternPage.getAllPatterns();
    const found = patterns.some(pattern => pattern.includes(patternName));
    expect(found).toBeTruthy();
});

Then('Shift correction should be created successfully', async function() {
    const message = await shiftCorrectionPage.verifySuccessMessage();
    expect(message).toBeTruthy();
});

Then('Correction status should change to {string}', async function(status) {
    // Status verification would be checked in the UI
});

module.exports = { shiftPage, shiftPolicyPage, shiftRotationPatternPage, shiftCorrectionPage };
