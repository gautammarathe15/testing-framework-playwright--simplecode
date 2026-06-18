/**
 * DEFAULT SHIFT PAGE - Default Shift Configuration
 * Tier 3 - Page Object Model Layer
 * Manages default shift assignments for employees
 */

const { BasePage } = require('../base.page');

class DefaultShiftPage extends BasePage {
    constructor(page) {
        super(page);
        
        // Default Shift Selectors
        this.defaultShiftMenu = '[data-testid="default-shift-menu"]';
        this.assignShiftButton = 'button:has-text("Assign Default Shift")';
        this.employeeSelect = 'select[data-testid="employee"]';
        this.shiftSelect = 'select[data-testid="shift"]';
        this.effectiveDateInput = 'input[type="date"][data-testid="effective-date"]';
        this.assignButton = 'button:has-text("Assign")';
        this.assignmentTable = 'table[data-testid="assignment-table"]';
        this.editAssignmentButton = '[data-testid="edit-assignment"]';
        this.removeAssignmentButton = '[data-testid="remove-assignment"]';
    }

    /**
     * Navigate to Default Shift
     */
    async navigateToDefaultShift() {
        await this.click(this.defaultShiftMenu);
        await this.waitForPageLoad();
    }

    /**
     * Assign a default shift to employee
     */
    async assignDefaultShift(assignmentData) {
        await this.click(this.assignShiftButton);
        await this.waitForElement(this.employeeSelect);
        
        await this.page.selectOption(this.employeeSelect, assignmentData.employeeId);
        await this.page.selectOption(this.shiftSelect, assignmentData.shiftId);
        await this.fill(this.effectiveDateInput, assignmentData.effectiveDate);
        
        await this.click(this.assignButton);
        return await this.verifySuccessMessage();
    }

    /**
     * Get all shift assignments
     */
    async getAllAssignments() {
        await this.waitForElement(this.assignmentTable);
        return await this.getTableData();
    }

    /**
     * Remove shift assignment
     */
    async removeShiftAssignment(employeeName) {
        const removeBtn = `${this.tableRows}:has-text("${employeeName}") ${this.removeAssignmentButton}`;
        await this.click(removeBtn);
        await this.click(this.confirmButton);
        return await this.verifySuccessMessage();
    }
}

module.exports = { DefaultShiftPage };
