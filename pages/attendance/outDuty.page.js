/**
 * OUT DUTY PAGE - Out Duty Management
 * Tier 3 - Page Object Model Layer
 * Handles out-of-duty assignments and approvals
 */

const { BasePage } = require('../base.page');

class OutDutyPage extends BasePage {
    constructor(page) {
        super(page);
        
        // Out Duty Selectors
        this.outDutyMenu = '[data-testid="out-duty-menu"]';
        this.createOutDutyButton = 'button:has-text("Create Out Duty")';
        this.employeeSelect = 'select[data-testid="employee"]';
        this.startDateInput = 'input[type="date"][data-testid="start-date"]';
        this.endDateInput = 'input[type="date"][data-testid="end-date"]';
        this.startTimeInput = 'input[type="time"]';
        this.endTimeInput = 'input[type="time"]';
        this.purposeInput = 'textarea[placeholder="Purpose"]';
        this.saveButton = 'button:has-text("Save Out Duty")';
        this.outDutyTable = 'table[data-testid="out-duty-table"]';
        this.editButton = '[data-testid="edit-out-duty"]';
        this.deleteButton = '[data-testid="delete-out-duty"]';
        this.approveButton = '[data-testid="approve-out-duty"]';
        this.rejectButton = '[data-testid="reject-out-duty"]';
    }

    /**
     * Navigate to Out Duty
     */
    async navigateToOutDuty() {
        await this.click(this.outDutyMenu);
        await this.waitForPageLoad();
    }

    /**
     * Create out duty request
     */
    async createOutDuty(outDutyData) {
        await this.click(this.createOutDutyButton);
        await this.waitForElement(this.employeeSelect);
        
        await this.page.selectOption(this.employeeSelect, outDutyData.employeeId);
        await this.fill(this.startDateInput, outDutyData.startDate);
        await this.fill(this.endDateInput, outDutyData.endDate);
        
        if (outDutyData.startTime) {
            await this.fill(this.startTimeInput, outDutyData.startTime);
        }
        if (outDutyData.endTime) {
            await this.fill(this.endTimeInput, outDutyData.endTime);
        }
        
        await this.fill(this.purposeInput, outDutyData.purpose);
        await this.click(this.saveButton);
        
        return await this.verifySuccessMessage();
    }

    /**
     * Get all out duty requests
     */
    async getAllOutDuties() {
        await this.waitForElement(this.outDutyTable);
        return await this.getTableData();
    }

    /**
     * Approve out duty
     */
    async approveOutDuty(employeeId) {
        const approveBtn = `${this.tableRows}:has-text("${employeeId}") ${this.approveButton}`;
        await this.click(approveBtn);
        await this.click(this.confirmButton);
        return await this.verifySuccessMessage();
    }

    /**
     * Reject out duty
     */
    async rejectOutDuty(employeeId, reason = '') {
        const rejectBtn = `${this.tableRows}:has-text("${employeeId}") ${this.rejectButton}`;
        await this.click(rejectBtn);
        
        if (reason) {
            await this.fill('textarea[placeholder="Rejection Reason"]', reason);
        }
        
        await this.click(this.confirmButton);
        return await this.verifySuccessMessage();
    }

    /**
     * Delete out duty
     */
    async deleteOutDuty(employeeId) {
        const deleteBtn = `${this.tableRows}:has-text("${employeeId}") ${this.deleteButton}`;
        await this.click(deleteBtn);
        await this.click(this.confirmButton);
        return await this.verifySuccessMessage();
    }
}

module.exports = { OutDutyPage };
