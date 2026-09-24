class PFPage {
    constructor(page) {
        this.page = page;
        this.pfInput = page.locator('#EmployeeOtherDetail_PFNo'); 
        this.updateButton = page.locator('#btnUpdateEmployeeOtherDetail'); 
    }

    async enterPFDetails(pfValue) {
        await this.pfInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.pfInput.click();
        await this.pfInput.clear();
        if (pfValue && pfValue.trim() !== '') {
            await this.pfInput.fill(pfValue);
        }
    }

    async clickUpdate() {
        await this.updateButton.click();
    }

    async getValidationMessage() {
        await this.page.waitForTimeout(1000);
        try {
            const alertLocator = this.page.locator('.swal-text, .swal2-html-container');
            await alertLocator.waitFor({ state: 'visible', timeout: 5000 });
            return await alertLocator.textContent();
        } catch (e) {
            return "";
        }
    }
}

module.exports = PFPage;