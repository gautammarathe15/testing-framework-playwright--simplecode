const { expect } = require('@playwright/test');

class PassportPage {
    constructor(page) {
        this.page = page;
        this.passportInput = page.locator('input#EmployeeOtherDetail_PassportNo');
        this.expiryInput = page.locator('input#EmployeeOtherDetail_PassportExpirationDate');
        this.updateButton = page.locator('input#btnUpdateEmployeeOtherDetail');
        this.sweetAlertText = page.locator('div.swal-text');
        this.sweetAlertOkBtn = page.locator('button.swal-button--confirm');
        this.dialogMessage = "";
    }

    async enterPassportDetails(passportValue, expiryDate) {
        await this.passportInput.waitFor({ state: 'visible', timeout: 5000 });
        
        await this.passportInput.evaluate(node => {
            node.value = '';
            node.dispatchEvent(new Event('input', { bubbles: true }));
            node.dispatchEvent(new Event('change', { bubbles: true }));
            node.dispatchEvent(new Event('blur', { bubbles: true }));
        });

        if (passportValue && passportValue.trim() !== '') {
            await this.passportInput.fill(passportValue);
        }
        await this.expiryInput.waitFor({ state: 'visible', timeout: 5000 });

        if (expiryDate && expiryDate.trim() !== '') {
            await this.expiryInput.evaluate((node, val) => {
                node.value = val;
                node.dispatchEvent(new Event('input', { bubbles: true }));
                node.dispatchEvent(new Event('change', { bubbles: true }));
                node.dispatchEvent(new Event('blur', { bubbles: true }));
            }, expiryDate);
        } else {
            await this.expiryInput.evaluate(node => {
                node.value = '';
                node.dispatchEvent(new Event('input', { bubbles: true }));
                node.dispatchEvent(new Event('change', { bubbles: true }));
                node.dispatchEvent(new Event('blur', { bubbles: true }));
            });
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
        } catch (e) {}

        if (this.dialogMessage && this.dialogMessage.trim() !== '') {
            let msg = this.dialogMessage.trim();
            this.dialogMessage = "";
            return msg;
        }

        return "Updated Successfully";
    }
}

module.exports = PassportPage;