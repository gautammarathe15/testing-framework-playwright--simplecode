/**
 * ATTENDANCE APPROVAL PAGE - Attendance Record Approval
 * Tier 3 - Page Object Model Layer
 * Handles attendance record approvals and corrections
 */

const { BasePage } = require('../base.page');

class AttendanceApprovalPage extends BasePage {
    constructor(page) {
        super(page);
        
        // Attendance Approval Selectors
        this.approvalMenu = '[data-testid="attendance-approval-menu"]';
        this.pendingTable = 'table[data-testid="pending-attendance"]';
        this.approveButton = '[data-testid="approve-attendance"]';
        this.rejectButton = '[data-testid="reject-attendance"]';
        this.commentTextarea = 'textarea[placeholder="Comments"]';
        this.submitButton = 'button:has-text("Submit")';
        this.approvalHistoryTable = 'table[data-testid="approval-history"]';
        this.dateRangeStart = 'input[type="date"][data-testid="start-date"]';
        this.dateRangeEnd = 'input[type="date"][data-testid="end-date"]';
        this.employeeFilter = 'select[data-testid="employee-filter"]';
        this.statusFilter = 'select[data-testid="status-filter"]';
    }

    /**
     * Navigate to Attendance Approval
     */
    async navigateToAttendanceApproval() {
        await this.click(this.approvalMenu);
        await this.waitForPageLoad();
    }

    /**
     * Get pending attendance records
     */
    async getPendingAttendance() {
        await this.waitForElement(this.pendingTable);
        return await this.getTableData();
    }

    /**
     * Approve attendance record
     */
    async approveAttendance(recordId, comments = '') {
        const approveBtn = `${this.tableRows}:has-text("${recordId}") ${this.approveButton}`;
        await this.click(approveBtn);
        
        if (comments) {
            await this.fill(this.commentTextarea, comments);
        }
        
        await this.click(this.submitButton);
        return await this.verifySuccessMessage();
    }

    /**
     * Reject attendance record
     */
    async rejectAttendance(recordId, reason) {
        const rejectBtn = `${this.tableRows}:has-text("${recordId}") ${this.rejectButton}`;
        await this.click(rejectBtn);
        
        await this.fill(this.commentTextarea, reason);
        await this.click(this.submitButton);
        
        return await this.verifySuccessMessage();
    }

    /**
     * Filter by date range
     */
    async filterByDateRange(startDate, endDate) {
        await this.fill(this.dateRangeStart, startDate);
        await this.fill(this.dateRangeEnd, endDate);
        await this.page.waitForTimeout(500);
        return await this.getTableData();
    }

    /**
     * Filter by employee
     */
    async filterByEmployee(employeeId) {
        await this.page.selectOption(this.employeeFilter, employeeId);
        await this.page.waitForTimeout(500);
        return await this.getTableData();
    }

    /**
     * Get approval history
     */
    async getApprovalHistory() {
        await this.waitForElement(this.approvalHistoryTable);
        return await this.getTableData();
    }
}

module.exports = { AttendanceApprovalPage };
