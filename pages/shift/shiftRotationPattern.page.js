/**
 * SHIFT ROTATION PATTERN PAGE - Rotation Pattern Management
 * Tier 3 - Page Object Model Layer
 * Manages shift rotation patterns and schedules
 */

const { BasePage } = require('../base.page');

class ShiftRotationPatternPage extends BasePage {
    constructor(page) {
        super(page);
        
        // Rotation Pattern Selectors
        this.rotationMenu = '[data-testid="shift-rotation-menu"]';
        this.createPatternButton = 'button:has-text("Create Pattern")';
        this.patternNameInput = 'input[placeholder="Pattern Name"]';
        this.cycleTypeSelect = 'select[data-testid="cycle-type"]';
        this.cycleLengthInput = 'input[placeholder="Cycle Length (days)"]';
        this.shiftSequenceInput = 'textarea[placeholder="Shift Sequence"]';
        this.savePatternButton = 'button:has-text("Save Pattern")';
        this.patternTable = 'table[data-testid="pattern-table"]';
        this.editPatternButton = '[data-testid="edit-pattern"]';
        this.deletePatternButton = '[data-testid="delete-pattern"]';
        this.applyPatternButton = '[data-testid="apply-pattern"]';
    }

    /**
     * Navigate to Shift Rotation Pattern
     */
    async navigateToRotationPattern() {
        await this.click(this.rotationMenu);
        await this.waitForPageLoad();
    }

    /**
     * Create a new rotation pattern
     */
    async createRotationPattern(patternData) {
        await this.click(this.createPatternButton);
        await this.waitForElement(this.patternNameInput);
        await this.fill(this.patternNameInput, patternData.name);
        
        await this.page.selectOption(this.cycleTypeSelect, patternData.cycleType);
        await this.fill(this.cycleLengthInput, patternData.cycleLength);
        await this.fill(this.shiftSequenceInput, patternData.shiftSequence);
        
        await this.click(this.savePatternButton);
        return await this.verifySuccessMessage();
    }

    /**
     * Get all rotation patterns
     */
    async getAllPatterns() {
        await this.waitForElement(this.patternTable);
        return await this.getTableData();
    }

    /**
     * Apply rotation pattern to employee/department
     */
    async applyPattern(patternName, targetData) {
        const applyBtn = `${this.tableRows}:has-text("${patternName}") ${this.applyPatternButton}`;
        await this.click(applyBtn);
        await this.waitForElement('[data-testid="apply-target-select"]');
        
        await this.page.selectOption('[data-testid="apply-target-select"]', targetData.targetId);
        await this.click(this.confirmButton);
        
        return await this.verifySuccessMessage();
    }

    /**
     * Delete rotation pattern
     */
    async deletePattern(patternName) {
        const deleteBtn = `${this.tableRows}:has-text("${patternName}") ${this.deletePatternButton}`;
        await this.click(deleteBtn);
        await this.click(this.confirmButton);
        return await this.verifySuccessMessage();
    }
}

module.exports = { ShiftRotationPatternPage };
