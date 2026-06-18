/**
 * BASE PAGE - Shared UI Locators & Actions
 * Tier 3 - Page Object Model Layer
 * Contains common UI elements and interactions used across all modules
 */

class BasePage {
    constructor(page) {
        this.page = page;
        
        // Common UI Elements
        this.loginButton = 'button:has-text("Login")';
        this.logoutButton = 'button:has-text("Logout")';
        this.menuToggle = '[data-testid="menu-toggle"]';
        this.errorMessage = '.error-message, .alert-danger';
        this.successMessage = '.success-message, .alert-success';
        this.loadingSpinner = '[data-testid="loading"], .spinner';
        this.modal = '.modal, [role="dialog"]';
        this.submitButton = 'button:has-text("Submit"), button:has-text("Save")';
        this.cancelButton = 'button:has-text("Cancel")';
        this.searchInput = 'input[placeholder*="Search"], input[type="search"]';
        this.tableRows = 'table tbody tr';
        this.confirmButton = 'button:has-text("Confirm"), button:has-text("Yes")';
    }

    /**
     * Navigate to URL
     */
    async goto(url) {
        await this.page.goto(url, { waitUntil: 'networkidle' });
    }

    /**
     * Wait for element to be visible
     */
    async waitForElement(selector, timeout = 5000) {
        await this.page.waitForSelector(selector, { timeout });
    }

    /**
     * Click on element
     */
    async click(selector) {
        await this.page.click(selector);
    }

    /**
     * Fill input field
     */
    async fill(selector, text) {
        await this.page.fill(selector, text);
    }

    /**
     * Get text from element
     */
    async getText(selector) {
        return await this.page.textContent(selector);
    }

    /**
     * Check if element is visible
     */
    async isVisible(selector) {
        return await this.page.isVisible(selector);
    }

    /**
     * Wait and check for success message
     */
    async verifySuccessMessage(timeout = 5000) {
        await this.waitForElement(this.successMessage, timeout);
        return await this.getText(this.successMessage);
    }

    /**
     * Wait and check for error message
     */
    async verifyErrorMessage(timeout = 5000) {
        await this.waitForElement(this.errorMessage, timeout);
        return await this.getText(this.errorMessage);
    }

    /**
     * Wait for page to load
     */
    async waitForPageLoad(timeout = 5000) {
        await this.page.waitForLoadState('networkidle', { timeout });
    }

    /**
     * Take screenshot
     */
    async takeScreenshot(name) {
        await this.page.screenshot({ path: `./screenshots/${name}.png`, fullPage: true });
    }

    /**
     * Get table data
     */
    async getTableData() {
        const rows = await this.page.locator(this.tableRows).count();
        const data = [];
        for (let i = 0; i < rows; i++) {
            const cells = await this.page.locator(`${this.tableRows}:nth-child(${i + 1}) td`).allTextContents();
            data.push(cells);
        }
        return data;
    }
}

module.exports = { BasePage };
