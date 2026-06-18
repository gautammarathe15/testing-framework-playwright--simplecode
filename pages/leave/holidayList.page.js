/**
 * HOLIDAY LIST PAGE - Holiday Management
 * Tier 3 - Page Object Model Layer
 * Handles holiday list creation and management
 */

const { BasePage } = require('../base.page');

class HolidayListPage extends BasePage {
    constructor(page) {
        super(page);
        
        // Holiday List Selectors
        this.holidayMenu = '[data-testid="holiday-menu"]';
        this.createHolidayButton = 'button:has-text("Create Holiday")';
        this.holidayNameInput = 'input[placeholder="Holiday Name"]';
        this.dateInput = 'input[type="date"][data-testid="holiday-date"]';
        this.descriptionInput = 'textarea[placeholder="Description"]';
        this.typeSelect = 'select[data-testid="holiday-type"]';
        this.locationSelect = 'select[data-testid="location"]';
        this.saveButton = 'button:has-text("Save Holiday")';
        this.holidayTable = 'table[data-testid="holiday-table"]';
        this.editButton = '[data-testid="edit-holiday"]';
        this.deleteButton = '[data-testid="delete-holiday"]';
        this.yearFilter = 'select[data-testid="year-filter"]';
    }

    /**
     * Navigate to Holiday List
     */
    async navigateToHolidayList() {
        await this.click(this.holidayMenu);
        await this.waitForPageLoad();
    }

    /**
     * Create a new holiday
     */
    async createHoliday(holidayData) {
        await this.click(this.createHolidayButton);
        await this.waitForElement(this.holidayNameInput);
        
        await this.fill(this.holidayNameInput, holidayData.name);
        await this.fill(this.dateInput, holidayData.date);
        
        if (holidayData.description) {
            await this.fill(this.descriptionInput, holidayData.description);
        }
        
        if (holidayData.type) {
            await this.page.selectOption(this.typeSelect, holidayData.type);
        }
        
        if (holidayData.location) {
            await this.page.selectOption(this.locationSelect, holidayData.location);
        }
        
        await this.click(this.saveButton);
        return await this.verifySuccessMessage();
    }

    /**
     * Get all holidays
     */
    async getAllHolidays() {
        await this.waitForElement(this.holidayTable);
        return await this.getTableData();
    }

    /**
     * Get holidays for a specific year
     */
    async getHolidaysByYear(year) {
        await this.page.selectOption(this.yearFilter, year);
        await this.page.waitForTimeout(500);
        return await this.getTableData();
    }

    /**
     * Delete a holiday
     */
    async deleteHoliday(holidayName) {
        const deleteBtn = `${this.tableRows}:has-text("${holidayName}") ${this.deleteButton}`;
        await this.click(deleteBtn);
        await this.click(this.confirmButton);
        return await this.verifySuccessMessage();
    }

    /**
     * Edit a holiday
     */
    async editHoliday(holidayName, newData) {
        const editBtn = `${this.tableRows}:has-text("${holidayName}") ${this.editButton}`;
        await this.click(editBtn);
        await this.waitForElement(this.holidayNameInput);
        
        if (newData.name) {
            await this.fill(this.holidayNameInput, newData.name);
        }
        if (newData.date) {
            await this.fill(this.dateInput, newData.date);
        }
        
        await this.click(this.saveButton);
        return await this.verifySuccessMessage();
    }
}

module.exports = { HolidayListPage };
