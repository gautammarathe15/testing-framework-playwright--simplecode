// pages/productDetailsPage.js
const { expect } = require('@playwright/test');

class ProductDetailsPage {
    constructor(page) {
        this.page = page;
        this.availabilityInfo = page.locator('p:has-text("Availability:")');
        this.conditionInfo = page.locator('p:has-text("Condition:")');
        this.addToCartBtn = page.locator('button.cart');
        this.successPopup = page.locator('.modal-content');
    }

    async verifyAndAdd() {
        const availability = await this.availabilityInfo.innerText();
        const condition = await this.conditionInfo.innerText();

        const isAvailable = availability.includes('In Stock');
        const isNew = condition.includes('New');

        if (isAvailable && isNew) {
            await this.addToCartBtn.click();
        } else {
            // Requirement 4: Extended report message if mismatch
            console.log(`Validation Failed: Stock is ${isAvailable}, Condition is ${isNew}`);
            throw new Error("Product is not in stock or condition is not New");
        }
    }

    async validatePopup() {
        // Requirement 5: Validate order placed/added popup
        await expect(this.successPopup).toBeVisible();
    }
}

module.exports = { ProductDetailsPage };