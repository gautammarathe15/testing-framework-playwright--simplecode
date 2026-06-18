/**
 * WEEK OFF DEFAULT PAGE - Default Weekly Off Management
 * Tier 3 - Page Object Model Layer
 * Manages default weekly off days for employees
 */

const { BasePage } = require('../base.page');

class WeekOffDefaultPage extends BasePage {
    constructor(page) {
        super(page);
        
        // Week Off Default Selectors
        this.weekOffMenu = '[data-testid="week-off-default-menu"]';
        this.assignWeekOffButton = 'button:has-text("Assign Week Off")';
        this.employeeSelect = 'select[data-testid="employee"]';
        this.daySelect = 'select[data-testid="day"]';
        this.alternateSelect = 'select[data-testid="alternate-day"]';
        this.effectiveDateInput = 'input[type="date"][data-testid="effective-date"]';
        this.saveButton = 'button:has-text("Save")';
        this.weekOffTable = 'table[data-testid="week-off-table"]';
        this.editButton = '[data-testid="edit-week-off"]';
        this.removeButton = '[data-testid="remove-week-off"]';
    }

    /**
     * Navigate to Week Off Default
     */
    async navigateToWeekOffDefault() {
        await this.click(this.weekOffMenu);
        await this.waitForPageLoad();
    }

    /**
     * Assign week off to employee
     */
    async assignWeekOff(weekOffData) {
        await this.click(this.assignWeekOffButton);
        await this.waitForElement(this.employeeSelect);
        
        await this.page.selectOption(this.employeeSelect, weekOffData.employeeId);
        await this.page.selectOption(this.daySelect, weekOffData.day);
        
        if (weekOffData.alternateDay) {
            await this.page.selectOption(this.alternateSelect, weekOffData.alternateDay);
        }
        
        await this.fill(this.effectiveDateInput, weekOffData.effectiveDate);
        await this.click(this.saveButton);
        
        return await this.verifySuccessMessage();
    }

    /**
     * Get all week off assignments
     */
    async getAllWeekOffAssignments() {
        await this.waitForElement(this.weekOffTable);
        return await this.getTableData();
    }

    /**
     * Remove week off assignment
     */
    async removeWeekOff(employeeId) {
        const removeBtn = `${this.tableRows}:has-text("${employeeId}") ${this.removeButton}`;
        await this.click(removeBtn);
        await this.click(this.confirmButton);
        return await this.verifySuccessMessage();
    }
}

module.exports = { WeekOffDefaultPage };
