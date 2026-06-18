/**
 * DELETE MANUAL ATTENDANCE PAGE - Delete Manual Attendance Records
 * Tier 3 - Page Object Model Layer
 * Handles deletion of manual attendance records
 */

const { BasePage } = require('../base.page');

class DeleteManualAttendancePage extends BasePage {
    constructor(page) {
        super(page);
        
        // Delete Manual Attendance Selectors
        this.deleteMenu = '[data-testid="delete-attendance-menu"]';
        this.recordsTable = 'table[data-testid="records-table"]';
        this.dateRangeStart = 'input[type="date"][data-testid="start-date"]';
        this.dateRangeEnd = 'input[type="date"][data-testid="end-date"]';
        this.employeeSelect = 'select[data-testid="employee-select"]';
        this.statusSelect = 'select[data-testid="status-select"]';
        this.searchButton = 'button:has-text("Search")';
        this.selectAllCheckbox = 'input[type="checkbox"][data-testid="select-all"]';
        this.deleteSelectedButton = 'button:has-text("Delete Selected")';
        this.deleteConfirmButton = 'button:has-text("Confirm Delete")';
        this.deletionHistoryTable = 'table[data-testid="deletion-history"]';
    }

    /**
     * Navigate to Delete Manual Attendance
     */
    async navigateToDeleteAttendance() {
        await this.click(this.deleteMenu);
        await this.waitForPageLoad();
    }

    /**
     * Search records for deletion
     */
    async searchRecordsForDeletion(filters) {
        if (filters.startDate) {
            await this.fill(this.dateRangeStart, filters.startDate);
        }
        if (filters.endDate) {
            await this.fill(this.dateRangeEnd, filters.endDate);
        }
        if (filters.employeeId) {
            await this.page.selectOption(this.employeeSelect, filters.employeeId);
        }
        if (filters.status) {
            await this.page.selectOption(this.statusSelect, filters.status);
        }
        
        await this.click(this.searchButton);
        await this.page.waitForTimeout(500);
        return await this.getTableData();
    }

    /**
     * Select all records
     */
    async selectAllRecords() {
        await this.click(this.selectAllCheckbox);
    }

    /**
     * Select specific record for deletion
     */
    async selectRecordForDeletion(recordId) {
        const checkbox = `${this.tableRows}:has-text("${recordId}") input[type="checkbox"]`;
        await this.click(checkbox);
    }

    /**
     * Delete selected records
     */
    async deleteSelectedRecords() {
        await this.click(this.deleteSelectedButton);
        await this.page.waitForSelector('[data-testid="delete-confirmation"]');
        await this.click(this.deleteConfirmButton);
        return await this.verifySuccessMessage();
    }

    /**
     * Get deletion history
     */
    async getDeletionHistory() {
        await this.waitForElement(this.deletionHistoryTable);
        return await this.getTableData();
    }
}

module.exports = { DeleteManualAttendancePage };
