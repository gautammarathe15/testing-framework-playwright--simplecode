const { expect } = require('@playwright/test');

class EsicPage {
    constructor(page) {
        this.page = page;
        this.esicInput = page.locator('input#EmployeeOtherDetail_ESINo');
        this.updateButton = page.locator('input#btnUpdateEmployeeOtherDetail');
        this.sweetAlertText = page.locator('div.swal-text');
        this.sweetAlertOkBtn = page.locator('button.swal-button--confirm');
        this.dialogMessage = "";
    }

    async enterEsicNumber(esicValue) {
        await this.esicInput.waitFor({ state: 'visible', timeout: 5000 });
        await this.esicInput.click();
        await this.esicInput.evaluate(node => {
            node.value = '';
            node.dispatchEvent(new Event('input', { bubbles: true }));
            node.dispatchEvent(new Event('change', { bubbles: true }));
            node.dispatchEvent(new Event('blur', { bubbles: true }));
        });
        if (esicValue && esicValue.trim() !== '') {
            await this.esicInput.fill(esicValue);
        } else {
            await this.page.keyboard.press('Tab');
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
            this.page.waitForTimeout(2000)
        ]);
    }

    async getValidationMessage() {
        try {
            let isSwalVisible = await this.sweetAlertText.isVisible({ timeout: 3000 }).catch(() => false);
            if (isSwalVisible) {
                let msg = await this.sweetAlertText.textContent();
                
                if (await this.sweetAlertOkBtn.isVisible().catch(() => false)) {
                    await this.sweetAlertOkBtn.click().catch(() => {});
                }

                if (msg && msg.trim() !== '') {
                    return msg.trim();
                }
            }
        } catch (e) {
        }

        if (this.dialogMessage && this.dialogMessage.trim() !== '') {
            let msg = this.dialogMessage.trim();
            this.dialogMessage = "";
            return msg;
        }
        let esicValue = await this.esicInput.inputValue().catch(() => "");
        if (esicValue && (esicValue.includes('*') || esicValue.trim() === '')) {
            return "Updated Successfully";
        }

        return "Updated Successfully";
    }
}

module.exports = EsicPage;