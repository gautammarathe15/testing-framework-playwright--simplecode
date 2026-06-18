/**
 * ACCESS CARD PAGE - Access Card Management
 * Tier 3 - Page Object Model Layer
 * Handles employee access card issuance and management
 */

const { BasePage } = require('../base.page');

class AccessCardPage extends BasePage {
    constructor(page) {
        super(page);
        
        // Access Card Selectors
        this.accessCardMenu = '[data-testid="access-card-menu"]';
        this.issueCardButton = 'button:has-text("Issue Access Card")';
        this.employeeSelect = 'select[data-testid="employee"]';
        this.cardNumberInput = 'input[placeholder="Card Number"]';
        this.cardTypeSelect = 'select[data-testid="card-type"]';
        this.issueDateInput = 'input[type="date"][data-testid="issue-date"]';
        this.expiryDateInput = 'input[type="date"][data-testid="expiry-date"]';
        this.saveButton = 'button:has-text("Save Card")';
        this.cardTable = 'table[data-testid="card-table"]';
        this.editButton = '[data-testid="edit-card"]';
        this.deactivateButton = '[data-testid="deactivate-card"]';
        this.activateButton = '[data-testid="activate-card"]';
        this.printButton = '[data-testid="print-card"]';
    }

    /**
     * Navigate to Access Card
     */
    async navigateToAccessCard() {
        await this.click(this.accessCardMenu);
        await this.waitForPageLoad();
    }

    /**
     * Issue a new access card
     */
    async issueAccessCard(cardData) {
        await this.click(this.issueCardButton);
        await this.waitForElement(this.employeeSelect);
        
        await this.page.selectOption(this.employeeSelect, cardData.employeeId);
        await this.fill(this.cardNumberInput, cardData.cardNumber);
        await this.page.selectOption(this.cardTypeSelect, cardData.cardType);
        await this.fill(this.issueDateInput, cardData.issueDate);
        await this.fill(this.expiryDateInput, cardData.expiryDate);
        
        await this.click(this.saveButton);
        return await this.verifySuccessMessage();
    }

    /**
     * Get all access cards
     */
    async getAllAccessCards() {
        await this.waitForElement(this.cardTable);
        return await this.getTableData();
    }

    /**
     * Deactivate an access card
     */
    async deactivateCard(cardNumber) {
        const deactivateBtn = `${this.tableRows}:has-text("${cardNumber}") ${this.deactivateButton}`;
        await this.click(deactivateBtn);
        await this.click(this.confirmButton);
        return await this.verifySuccessMessage();
    }

    /**
     * Activate an access card
     */
    async activateCard(cardNumber) {
        const activateBtn = `${this.tableRows}:has-text("${cardNumber}") ${this.activateButton}`;
        await this.click(activateBtn);
        return await this.verifySuccessMessage();
    }

    /**
     * Print access card
     */
    async printAccessCard(cardNumber) {
        const printBtn = `${this.tableRows}:has-text("${cardNumber}") ${this.printButton}`;
        await this.click(printBtn);
        await this.page.waitForTimeout(1000);
    }
}

module.exports = { AccessCardPage };
