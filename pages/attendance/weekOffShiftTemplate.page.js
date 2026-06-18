/**
 * WEEK OFF SHIFT TEMPLATE PAGE - Week Off Shift Template Management
 * Tier 3 - Page Object Model Layer
 * Manages week off shift templates for various patterns
 */

const { BasePage } = require('../base.page');

class WeekOffShiftTemplatePage extends BasePage {
    constructor(page) {
        super(page);
        
        // Week Off Shift Template Selectors
        this.templateMenu = '[data-testid="week-off-shift-template-menu"]';
        this.createTemplateButton = 'button:has-text("Create Template")';
        this.templateNameInput = 'input[placeholder="Template Name"]';
        this.dayPatternInput = 'textarea[placeholder="Day Pattern"]';
        this.cycleTypeSelect = 'select[data-testid="cycle-type"]';
        this.cycleDaysInput = 'input[placeholder="Cycle Days"]';
        this.weekOffDaysInput = 'input[placeholder="Week Off Days"]';
        this.saveButton = 'button:has-text("Save Template")';
        this.templateTable = 'table[data-testid="template-table"]';
        this.editButton = '[data-testid="edit-template"]';
        this.deleteButton = '[data-testid="delete-template"]';
        this.applyButton = '[data-testid="apply-template"]';
    }

    /**
     * Navigate to Week Off Shift Template
     */
    async navigateToTemplate() {
        await this.click(this.templateMenu);
        await this.waitForPageLoad();
    }

    /**
     * Create a new template
     */
    async createTemplate(templateData) {
        await this.click(this.createTemplateButton);
        await this.waitForElement(this.templateNameInput);
        
        await this.fill(this.templateNameInput, templateData.name);
        await this.fill(this.dayPatternInput, templateData.dayPattern);
        await this.page.selectOption(this.cycleTypeSelect, templateData.cycleType);
        await this.fill(this.cycleDaysInput, templateData.cycleDays);
        await this.fill(this.weekOffDaysInput, templateData.weekOffDays);
        
        await this.click(this.saveButton);
        return await this.verifySuccessMessage();
    }

    /**
     * Get all templates
     */
    async getAllTemplates() {
        await this.waitForElement(this.templateTable);
        return await this.getTableData();
    }

    /**
     * Apply template to employee/department
     */
    async applyTemplate(templateName, targetData) {
        const applyBtn = `${this.tableRows}:has-text("${templateName}") ${this.applyButton}`;
        await this.click(applyBtn);
        await this.waitForElement('[data-testid="apply-target-select"]');
        
        await this.page.selectOption('[data-testid="apply-target-select"]', targetData.targetId);
        await this.click(this.confirmButton);
        
        return await this.verifySuccessMessage();
    }

    /**
     * Delete template
     */
    async deleteTemplate(templateName) {
        const deleteBtn = `${this.tableRows}:has-text("${templateName}") ${this.deleteButton}`;
        await this.click(deleteBtn);
        await this.click(this.confirmButton);
        return await this.verifySuccessMessage();
    }
}

module.exports = { WeekOffShiftTemplatePage };
