/**
 * SHIFT POLICY PAGE - Shift Policy Configuration
 * Tier 3 - Page Object Model Layer
 * Handles shift policy rules and configurations
 */

const { BasePage } = require('../base.page');

class ShiftPolicyPage extends BasePage {
    constructor(page) {
        super(page);
        
        // Shift Policy Selectors
        this.policyMenu = '[data-testid="shift-policy-menu"]';
        this.createPolicyButton = 'button:has-text("Create Policy")';
        this.policyNameInput = 'input[placeholder="Policy Name"]';
        this.policyDescInput = 'textarea[placeholder="Policy Description"]';
        this.breakDurationInput = 'input[placeholder="Break Duration"]';
        this.overtimeRuleDropdown = 'select[data-testid="overtime-rule"]';
        this.savePolicyButton = 'button:has-text("Save Policy")';
        this.policyTable = 'table[data-testid="policy-table"]';
        this.editPolicyButton = '[data-testid="edit-policy"]';
        this.deletePolicyButton = '[data-testid="delete-policy"]';
        this.activateToggle = '[data-testid="activate-policy"]';
    }

    /**
     * Navigate to Shift Policy
     */
    async navigateToShiftPolicy() {
        await this.click(this.policyMenu);
        await this.waitForPageLoad();
    }

    /**
     * Create a new shift policy
     */
    async createShiftPolicy(policyData) {
        await this.click(this.createPolicyButton);
        await this.waitForElement(this.policyNameInput);
        await this.fill(this.policyNameInput, policyData.name);
        await this.fill(this.policyDescInput, policyData.description);
        await this.fill(this.breakDurationInput, policyData.breakDuration);
        
        if (policyData.overtimeRule) {
            await this.page.selectOption(this.overtimeRuleDropdown, policyData.overtimeRule);
        }
        
        await this.click(this.savePolicyButton);
        return await this.verifySuccessMessage();
    }

    /**
     * Get all policies
     */
    async getAllPolicies() {
        await this.waitForElement(this.policyTable);
        return await this.getTableData();
    }

    /**
     * Activate a policy
     */
    async activatePolicy(policyName) {
        const toggleSelector = `${this.tableRows}:has-text("${policyName}") ${this.activateToggle}`;
        await this.click(toggleSelector);
        return await this.verifySuccessMessage();
    }

    /**
     * Delete a policy
     */
    async deletePolicy(policyName) {
        const deleteBtn = `${this.tableRows}:has-text("${policyName}") ${this.deletePolicyButton}`;
        await this.click(deleteBtn);
        await this.click(this.confirmButton);
        return await this.verifySuccessMessage();
    }
}

module.exports = { ShiftPolicyPage };
