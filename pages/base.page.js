/**
 * BASE PAGE - Shared UI Locators & Actions
 * Tier 3 - Page Object Model Layer
 * Contains only required interactions for URL navigation
 */

class BasePage {
    constructor(page) {
        this.page = page;
    }

    /**
     * Navigate to URL
     */
    async goto(url) {
        await this.page.goto(url, { waitUntil: 'networkidle' });
    }
}

module.exports = { BasePage };