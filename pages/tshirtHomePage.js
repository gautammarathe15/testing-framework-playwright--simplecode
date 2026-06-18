// pages/tshirtHomePage.js

class TshirtHomePage {
    constructor(page) {
        this.page = page;
        this.menCategory = page.getByRole('link', { name: '  Men' });
        this.tshirtsSubCategory = page.locator('a[href="/category_products/3"]');
        this.allProductPrices = page.locator('.productinfo h2');
        this.viewProductButtons = page.locator('.choose a');
    }

    async selectTshirtCategory() {
        // Requirement 2: Click on Men and select the Tshirt
        await this.menCategory.click();
        await this.tshirtsSubCategory.click();
    }

    async clickViewProductOnCheapestItem() {
        // Requirement 3: Auto select the lowest price Shirt
        const priceStrings = await this.allProductPrices.allInnerTexts();
        
        // Convert "Rs. 400" strings to numbers
        const prices = priceStrings.map(p => parseFloat(p.replace(/\D/g, '')));
        
        const minPrice = Math.min(...prices);
        const cheapestIndex = prices.indexOf(minPrice);

        // Click "View Product" for the cheapest item found
        await this.viewProductButtons.nth(cheapestIndex).click();
    }
}

module.exports = { TshirtHomePage };