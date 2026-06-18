/**
 * LEAVE APPLICATION PAGE - Leave Request Management
 * Tier 3 - Page Object Model Layer
 * Handles leave application creation and management
 */

const { BasePage } = require('../base.page');

class LeaveApplicationPage extends BasePage {
    constructor(page) {
        super(page);
        
        // Leave Application Selectors
        this.leaveMenu = '[data-testid="leave-menu"]';
        this.applyLeaveButton = 'button:has-text("Apply Leave")';
        this.leaveTypeSelect = 'select[data-testid="leave-type"]';
        this.startDateInput = 'input[type="date"][data-testid="start-date"]';
        this.endDateInput = 'input[type="date"][data-testid="end-date"]';
        this.noOfDaysInput = 'input[placeholder="Number of Days"]';
        this.reasonInput = 'textarea[placeholder="Reason for Leave"]';
        this.attachmentInput = 'input[type="file"]';
        this.submitButton = 'button:has-text("Submit Application")';
        this.applicationTable = 'table[data-testid="application-table"]';
        this.editButton = '[data-testid="edit-application"]';
        this.withdrawButton = '[data-testid="withdraw-application"]';
        this.viewDetailsButton = '[data-testid="view-details"]';
    }

    /**
     * Navigate to Leave Application
     */
    async navigateToLeaveApplication() {
        await this.click(this.leaveMenu);
        await this.waitForPageLoad();
    }

    /**
     * Apply for leave
     */
    async applyForLeave(leaveData) {
        await this.click(this.applyLeaveButton);
        await this.waitForElement(this.leaveTypeSelect);
        
        await this.page.selectOption(this.leaveTypeSelect, leaveData.leaveType);
        await this.fill(this.startDateInput, leaveData.startDate);
        await this.fill(this.endDateInput, leaveData.endDate);
        
        if (leaveData.noOfDays) {
            await this.fill(this.noOfDaysInput, leaveData.noOfDays);
        }
        
        await this.fill(this.reasonInput, leaveData.reason);
        
        if (leaveData.attachmentPath) {
            await this.page.setInputFiles(this.attachmentInput, leaveData.attachmentPath);
        }
        
        await this.click(this.submitButton);
        return await this.verifySuccessMessage();
    }

    /**
     * Get all leave applications
     */
    async getAllApplications() {
        await this.waitForElement(this.applicationTable);
        return await this.getTableData();
    }

    /**
     * Withdraw a leave application
     */
    async withdrawApplication(applicationId) {
        const withdrawBtn = `${this.tableRows}:has-text("${applicationId}") ${this.withdrawButton}`;
        await this.click(withdrawBtn);
        await this.click(this.confirmButton);
        return await this.verifySuccessMessage();
    }

    /**
     * View leave application details
     */
    async viewApplicationDetails(applicationId) {
        const viewBtn = `${this.tableRows}:has-text("${applicationId}") ${this.viewDetailsButton}`;
        await this.click(viewBtn);
        await this.waitForElement('[data-testid="application-details"]');
        const details = await this.page.locator('[data-testid="application-details"]').textContent();
        return details;
    }
}

module.exports = { LeaveApplicationPage };
