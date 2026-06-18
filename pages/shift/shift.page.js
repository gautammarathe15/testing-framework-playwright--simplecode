/**
 * SHIFT PAGE - Shift Module Main Page
 * Tier 3 - Page Object Model Layer
 * Handles shift navigation and main shift page interactions
 */

const { BasePage } = require('../base.page');

class ShiftPage extends BasePage {
    constructor(page) {
        super(page);
        
        // Shift Page Selectors
        this.shiftMenu = '[data-testid="shift-menu"]';
        this.createShiftButton = 'button:has-text("Create Shift")';
        this.shiftTable = 'table[data-testid="shift-table"]';
        this.shiftNameInput = 'input[placeholder="Shift Name"]';
        this.startTimeInput = 'input[placeholder="Start Time"]';
        this.endTimeInput = 'input[placeholder="End Time"]';
        this.shiftDescription = 'textarea[placeholder="Description"]';
        this.saveShiftButton = 'button:has-text("Save Shift")';
        this.editShiftButton = '[data-testid="edit-shift"]';
        this.deleteShiftButton = '[data-testid="delete-shift"]';
        this.shiftDetailsPanel = '[data-testid="shift-details"]';
    }

    /**
     * Navigate to Shift Module
     */
    async navigateToShift() {
        await this.click(this.shiftMenu);
        await this.waitForPageLoad();
    }

    /**
     * Create a new shift
     */
    async createNewShift(shiftData) {
        await this.click(this.createShiftButton);
        await this.waitForElement(this.shiftNameInput);
        await this.fill(this.shiftNameInput, shiftData.name);
        await this.fill(this.startTimeInput, shiftData.startTime);
        await this.fill(this.endTimeInput, shiftData.endTime);
        if (shiftData.description) {
            await this.fill(this.shiftDescription, shiftData.description);
        }
        await this.click(this.saveShiftButton);
        return await this.verifySuccessMessage();
    }

    /**
     * Get all shifts from table
     */
    async getAllShifts() {
        await this.waitForElement(this.shiftTable);
        return await this.getTableData();
    }

    /**
     * Edit specific shift
     */
    async editShift(shiftName, newData) {
        const editBtn = `${this.tableRows}:has-text("${shiftName}") ${this.editShiftButton}`;
        await this.click(editBtn);
        await this.waitForElement(this.shiftNameInput);
        
        if (newData.name) {
            await this.page.fill(this.shiftNameInput, newData.name);
        }
        if (newData.startTime) {
            await this.page.fill(this.startTimeInput, newData.startTime);
        }
        if (newData.endTime) {
            await this.page.fill(this.endTimeInput, newData.endTime);
        }
        
        await this.click(this.saveShiftButton);
        return await this.verifySuccessMessage();
    }

    /**
     * Delete a shift
     */
    async deleteShift(shiftName) {
        const deleteBtn = `${this.tableRows}:has-text("${shiftName}") ${this.deleteShiftButton}`;
        await this.click(deleteBtn);
        await this.click(this.confirmButton);
        return await this.verifySuccessMessage();
    }

    /**
     * Search for a shift
     */
    async searchShift(shiftName) {
        await this.fill(this.searchInput, shiftName);
        await this.page.waitForTimeout(500);
        const results = await this.getTableData();
        return results;
    }
}

module.exports = { ShiftPage };
