/**
 * SHIFT CORRECTION PAGE - Shift Correction & Amendments
 * Tier 3 - Page Object Model Layer
 * Handles shift corrections and amendments
 */

const { BasePage } = require('../base.page');

class ShiftCorrectionPage extends BasePage {
    constructor(page) {
        super(page);
        
        // Shift Correction Selectors
        this.correctionMenu = '[data-testid="shift-correction-menu"]';
        this.createCorrectionButton = 'button:has-text("Create Correction")';
        this.employeeSelect = 'select[data-testid="employee"]';
        this.dateInput = 'input[type="date"][data-testid="correction-date"]';
        this.originalShiftInput = 'input[placeholder="Original Shift"]';
        this.newShiftInput = 'input[placeholder="New Shift"]';
        this.reasonInput = 'textarea[placeholder="Reason for Correction"]';
        this.approverSelect = 'select[data-testid="approver"]';
        this.saveCorrectionButton = 'button:has-text("Save Correction")';
        this.correctionTable = 'table[data-testid="correction-table"]';
        this.editCorrectionButton = '[data-testid="edit-correction"]';
        this.deleteCorrectionButton = '[data-testid="delete-correction"]';
        this.approveCorrectionButton = '[data-testid="approve-correction"]';
        this.rejectCorrectionButton = '[data-testid="reject-correction"]';
    }

    /**
     * Navigate to Shift Correction
     */
    async navigateToShiftCorrection() {
        await this.click(this.correctionMenu);
        await this.waitForPageLoad();
    }

    /**
     * Create a shift correction
     */
    async createShiftCorrection(correctionData) {
        await this.click(this.createCorrectionButton);
        await this.waitForElement(this.employeeSelect);
        
        await this.page.selectOption(this.employeeSelect, correctionData.employeeId);
        await this.fill(this.dateInput, correctionData.date);
        await this.fill(this.originalShiftInput, correctionData.originalShift);
        await this.fill(this.newShiftInput, correctionData.newShift);
        await this.fill(this.reasonInput, correctionData.reason);
        
        if (correctionData.approverId) {
            await this.page.selectOption(this.approverSelect, correctionData.approverId);
        }
        
        await this.click(this.saveCorrectionButton);
        return await this.verifySuccessMessage();
    }

    /**
     * Get all corrections
     */
    async getAllCorrections() {
        await this.waitForElement(this.correctionTable);
        return await this.getTableData();
    }

    /**
     * Approve a correction
     */
    async approveCorrection(employeeName) {
        const approveBtn = `${this.tableRows}:has-text("${employeeName}") ${this.approveCorrectionButton}`;
        await this.click(approveBtn);
        await this.click(this.confirmButton);
        return await this.verifySuccessMessage();
    }

    /**
     * Reject a correction
     */
    async rejectCorrection(employeeName, rejectReason = '') {
        const rejectBtn = `${this.tableRows}:has-text("${employeeName}") ${this.rejectCorrectionButton}`;
        await this.click(rejectBtn);
        
        if (rejectReason) {
            await this.fill('textarea[placeholder="Rejection Reason"]', rejectReason);
        }
        
        await this.click(this.confirmButton);
        return await this.verifySuccessMessage();
    }
}

module.exports = { ShiftCorrectionPage };
