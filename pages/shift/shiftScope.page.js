/**
 * SHIFT SCOPE PAGE - Shift Scope Management
 * Tier 3 - Page Object Model Layer
 * Manages shift scope and coverage areas
 */

const { BasePage } = require('../base.page');

class ShiftScopePage extends BasePage {
    constructor(page) {
        super(page);
        
        // Shift Scope Selectors
        this.scopeMenu = '[data-testid="shift-scope-menu"]';
        this.createScopeButton = 'button:has-text("Create Scope")';
        this.scopeNameInput = 'input[placeholder="Scope Name"]';
        this.departmentSelect = 'select[data-testid="department"]';
        this.employeeSelect = 'select[data-testid="employees"]';
        this.startDateInput = 'input[type="date"][data-testid="start-date"]';
        this.endDateInput = 'input[type="date"][data-testid="end-date"]';
        this.saveScopeButton = 'button:has-text("Save Scope")';
        this.scopeTable = 'table[data-testid="scope-table"]';
        this.editScopeButton = '[data-testid="edit-scope"]';
        this.deleteScopeButton = '[data-testid="delete-scope"]';
    }

    /**
     * Navigate to Shift Scope
     */
    async navigateToShiftScope() {
        await this.click(this.scopeMenu);
        await this.waitForPageLoad();
    }

    /**
     * Create a new shift scope
     */
    async createShiftScope(scopeData) {
        await this.click(this.createScopeButton);
        await this.waitForElement(this.scopeNameInput);
        await this.fill(this.scopeNameInput, scopeData.name);
        
        if (scopeData.department) {
            await this.page.selectOption(this.departmentSelect, scopeData.department);
        }
        
        if (scopeData.employees) {
            for (const emp of scopeData.employees) {
                await this.page.selectOption(this.employeeSelect, emp);
            }
        }
        
        await this.fill(this.startDateInput, scopeData.startDate);
        await this.fill(this.endDateInput, scopeData.endDate);
        
        await this.click(this.saveScopeButton);
        return await this.verifySuccessMessage();
    }

    /**
     * Get all scopes
     */
    async getAllScopes() {
        await this.waitForElement(this.scopeTable);
        return await this.getTableData();
    }

    /**
     * Delete a scope
     */
    async deleteScope(scopeName) {
        const deleteBtn = `${this.tableRows}:has-text("${scopeName}") ${this.deleteScopeButton}`;
        await this.click(deleteBtn);
        await this.click(this.confirmButton);
        return await this.verifySuccessMessage();
    }
}

module.exports = { ShiftScopePage };
