/**
 * LEAVE BALANCE PAGE - Leave Balance Management
 * Tier 3 - Page Object Model Layer
 * Handles leave balance tracking and management
 */

const { BasePage } = require('../base.page');

class LeaveBalancePage extends BasePage {
    constructor(page) {
        super(page);
        
        // Leave Balance Selectors
        this.balanceMenu = '[data-testid="leave-balance-menu"]';
        this.balanceTable = 'table[data-testid="balance-table"]';
        this.employeeSelect = 'select[data-testid="employee-filter"]';
        this.yearSelect = 'select[data-testid="year-filter"]';
        this.balanceDetails = '[data-testid="balance-details"]';
        this.adjustBalanceButton = 'button:has-text("Adjust Balance")';
        this.leaveTypeFilter = 'select[data-testid="leave-type-filter"]';
        this.exportButton = 'button:has-text("Export")';
        this.adjustmentHistory = 'table[data-testid="adjustment-history"]';
    }

    /**
     * Navigate to Leave Balance
     */
    async navigateToLeaveBalance() {
        await this.click(this.balanceMenu);
        await this.waitForPageLoad();
    }

    /**
     * Get all leave balances
     */
    async getAllBalances() {
        await this.waitForElement(this.balanceTable);
        return await this.getTableData();
    }

    /**
     * View employee leave balance
     */
    async viewEmployeeBalance(employeeId, year = new Date().getFullYear().toString()) {
        await this.page.selectOption(this.employeeSelect, employeeId);
        await this.page.selectOption(this.yearSelect, year);
        await this.page.waitForTimeout(500);
        
        const balance = await this.page.locator(this.balanceDetails).textContent();
        return balance;
    }

    /**
     * Get balance by leave type
     */
    async getBalanceByLeaveType(leaveType) {
        await this.page.selectOption(this.leaveTypeFilter, leaveType);
        await this.page.waitForTimeout(500);
        return await this.getTableData();
    }

    /**
     * Adjust leave balance
     */
    async adjustLeaveBalance(adjustmentData) {
        await this.click(this.adjustBalanceButton);
        await this.waitForElement('[data-testid="adjustment-form"]');
        
        await this.page.selectOption('[data-testid="adjust-employee"]', adjustmentData.employeeId);
        await this.page.selectOption('[data-testid="adjust-leave-type"]', adjustmentData.leaveType);
        await this.fill('[data-testid="adjust-days"]', adjustmentData.days);
        await this.fill('[data-testid="adjustment-reason"]', adjustmentData.reason);
        
        await this.click('button:has-text("Apply Adjustment")');
        return await this.verifySuccessMessage();
    }

    /**
     * Export balance report
     */
    async exportBalanceReport() {
        await this.click(this.exportButton);
        await this.page.waitForTimeout(1000);
    }

    /**
     * Get adjustment history
     */
    async getAdjustmentHistory() {
        await this.waitForElement(this.adjustmentHistory);
        return await this.getTableData();
    }
}

module.exports = { LeaveBalancePage };
