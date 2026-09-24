class BankPage {
    constructor(page) {
        this.page = page;
        this.bankDropdown = page.locator('#EmployeeOtherDetail_BankMasterID'); 
        this.ifscInput = page.locator('#IFSCCode'); 
        this.branchInput = page.locator('#EmployeeOtherDetail_BankBranchName');
        this.accountInput = page.locator('#EmployeeOtherDetail_BankAccountNo'); 
        this.updateButton = page.locator('#btnUpdateEmployeeOtherDetail'); 
        this.okButton = page.locator('.swal-button--confirm, .swal2-confirm');
    }

    async selectBank(bankName) {
        await this.bankDropdown.waitFor({ state: 'visible', timeout: 15000 });
        await this.bankDropdown.selectOption({ label: bankName });
    }

    async enterIFSC(ifscValue) {
        await this.ifscInput.waitFor({ state: 'visible', timeout: 15000 });
        await this.ifscInput.scrollIntoViewIfNeeded();
        await this.ifscInput.click();
        
        await this.ifscInput.press('Control+A');
        await this.ifscInput.press('Backspace');
        
        if (ifscValue && ifscValue.trim() !== '') {
            await this.ifscInput.fill(ifscValue);
        }
        
        await this.ifscInput.dispatchEvent('input');
        await this.ifscInput.dispatchEvent('change');
        await this.ifscInput.blur();
    }

    async enterBranchName(branchName) {
        await this.branchInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.branchInput.scrollIntoViewIfNeeded();
        await this.branchInput.click();
        
        await this.branchInput.press('Control+A');
        await this.branchInput.press('Backspace');
        
        if (branchName && branchName.trim() !== '') {
            await this.branchInput.fill(branchName);
        }
        
        await this.branchInput.dispatchEvent('input');
        await this.branchInput.dispatchEvent('change');
        await this.branchInput.blur();
    }

    async enterAccountNumber(accNo) {
        await this.accountInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.accountInput.scrollIntoViewIfNeeded();
        await this.accountInput.click();
     
        await this.accountInput.press('Control+A');
        await this.accountInput.press('Backspace');
        
        if (accNo && accNo.trim() !== '') {
            await this.accountInput.fill(accNo);
        }
   
        await this.accountInput.dispatchEvent('input');
        await this.accountInput.dispatchEvent('change');
        await this.accountInput.blur();
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

module.exports = BankPage;