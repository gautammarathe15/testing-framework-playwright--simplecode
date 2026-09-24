class UANPage {
    constructor(page) {
        this.page = page;
        this.uanInput = page.locator('#EmployeeOtherDetail_UAN'); 
        this.updateButton = page.locator('#btnUpdateEmployeeOtherDetail'); 
        this.okButton = page.locator('.swal-button--confirm, .swal2-confirm');
    }

    async enterUANDetails(uanValue) {
        await this.uanInput.waitFor({ state: 'visible', timeout: 15000 });
        await this.uanInput.scrollIntoViewIfNeeded();
        await this.uanInput.click();
        await this.uanInput.clear();
        if (uanValue && uanValue.trim() !== '') {
            await this.uanInput.fill(uanValue);
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
            let message = await alertLocator.textContent();
            
            if (await this.okButton.isVisible()) {
                await this.okButton.click();
            }
            
            return message;
        } catch (e) {
            return "";
        }
    }
}

module.exports = UANPage;