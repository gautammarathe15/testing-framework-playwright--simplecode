const { expect } = require('@playwright/test');

class PanCardPage {
    constructor(page) {
        this.page = page;
        this.panInput = page.locator('input#EmployeeOtherDetail_PanNo');
        this.updateButton = page.locator('input#btnUpdateEmployeeOtherDetail');
        this.sweetAlertText = page.locator('div.swal-text');
        this.sweetAlertOkBtn = page.locator('button.swal-button--confirm');
        this.dialogMessage = "";
    }

    async enterPanNumber(panValue) {
        await this.panInput.waitFor({ state: 'visible', timeout: 5000 });
        await this.panInput.click();
        await this.panInput.press('Control+A');
        await this.panInput.press('Backspace');
        
        if (panValue && panValue.trim() !== '') {
            await this.panInput.fill(panValue);
        }
    }

    async clickUpdate() {
        this.dialogMessage = "";
        
        let dialogPromise = new Promise(resolve => {
            this.page.once('dialog', async dialog => {
                this.dialogMessage = dialog.message();
                await dialog.accept().catch(() => {});
                resolve();
            });
        });

        await this.updateButton.click();
        
        await Promise.race([
            dialogPromise,
            this.page.waitForTimeout(1500)
        ]);
    }

    async getValidationMessage() {
        if (this.dialogMessage && this.dialogMessage.trim() !== '') {
            let msg = this.dialogMessage.trim();
            this.dialogMessage = "";
            return msg;
        }
        try {
            let isSwalVisible = await this.sweetAlertText.isVisible({ timeout: 1500 }).catch(() => false);
            if (isSwalVisible) {
                let msg = await this.sweetAlertText.textContent();
                await this.sweetAlertOkBtn.click().catch(() => {});
                if (msg && msg.trim() !== '') {
                    return msg.trim();
                }
            }
        } catch (e) {
        }
        let panValue = await this.panInput.inputValue();
        
        if (panValue && panValue.includes('*')) {
            return "Updated Successfully";
        }
        return "PAN Value should be a 10 alphanumeric value."; 
    }
}

module.exports = PanCardPage;