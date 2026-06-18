/**
 * LEAVE APPROVAL PAGE - Leave Request Approval
 * Tier 3 - Page Object Model Layer
 * Handles leave request approval workflow
 */

const { BasePage } = require('../base.page');

class LeaveApprovalPage extends BasePage {
    constructor(page) {
        super(page);
        
        // Leave Approval Selectors
        this.approvalMenu = '[data-testid="leave-approval-menu"]';
        this.pendingApplicationsTable = 'table[data-testid="pending-applications"]';
        this.approveButton = '[data-testid="approve-leave"]';
        this.rejectButton = '[data-testid="reject-leave"]';
        this.commentTextarea = 'textarea[placeholder="Comments"]';
        this.submitApprovalButton = 'button:has-text("Submit")';
        this.approvalHistoryTable = 'table[data-testid="approval-history"]';
        this.filterByStatus = 'select[data-testid="status-filter"]';
        this.searchBox = 'input[placeholder="Search Applications"]';
    }

    /**
     * Navigate to Leave Approval
     */
    async navigateToLeaveApproval() {
        await this.click(this.approvalMenu);
        await this.waitForPageLoad();
    }

    /**
     * Get pending leave applications
     */
    async getPendingApplications() {
        await this.waitForElement(this.pendingApplicationsTable);
        return await this.getTableData();
    }

    /**
     * Approve a leave application
     */
    async approveLeaveApplication(applicationId, comments = '') {
        const approveBtn = `${this.tableRows}:has-text("${applicationId}") ${this.approveButton}`;
        await this.click(approveBtn);
        
        if (comments) {
            await this.fill(this.commentTextarea, comments);
        }
        
        await this.click(this.submitApprovalButton);
        return await this.verifySuccessMessage();
    }

    /**
     * Reject a leave application
     */
    async rejectLeaveApplication(applicationId, rejectionReason) {
        const rejectBtn = `${this.tableRows}:has-text("${applicationId}") ${this.rejectButton}`;
        await this.click(rejectBtn);
        
        await this.fill(this.commentTextarea, rejectionReason);
        await this.click(this.submitApprovalButton);
        
        return await this.verifySuccessMessage();
    }

    /**
     * Get approval history
     */
    async getApprovalHistory() {
        await this.waitForElement(this.approvalHistoryTable);
        return await this.getTableData();
    }

    /**
     * Filter applications by status
     */
    async filterByApplicationStatus(status) {
        await this.page.selectOption(this.filterByStatus, status);
        await this.page.waitForTimeout(500);
        return await this.getTableData();
    }

    /**
     * Search for application
     */
    async searchApplication(searchTerm) {
        await this.fill(this.searchBox, searchTerm);
        await this.page.waitForTimeout(500);
        return await this.getTableData();
    }
}

module.exports = { LeaveApprovalPage };
