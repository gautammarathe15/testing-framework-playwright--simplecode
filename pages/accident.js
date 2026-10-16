const { expect } = require('@playwright/test');

class EmployeeAccidentPage {
    constructor(page) {
        this.page = page;
        this.accidentRegisterTab = page.locator('#lnkEmployeeAccidentRegister');
        this.createBtn = page.locator('#hrfEmployeeAccidentInfoCreate');
        this.dateOfAccidentInput = page.locator('#EmployeeAccidentInfo_DateOfAccident');
        this.dateOfReportInput = page.locator('#EmployeeAccidentInfo_DateOfReport');
        this.nameOfAccidentInput = page.locator('#EmployeeAccidentInfo_NameOfAccident');
        this.dateOfReturnInput = page.locator('#EmployeeAccidentInfo_DateOfReturn');
        this.noOfDaysInput = page.locator('#EmployeeAccidentInfo_NoOfDays');
        // Save button locator
        this.saveBtn = page.locator('#btnSaveEmployeeAccidentRegister');
    }

    async navigateToAccidentRegister() {
        await this.accidentRegisterTab.waitFor({ state: 'visible', timeout: 10000 });
        await this.accidentRegisterTab.click();
    }

    async clickCreate() {
        await this.createBtn.waitFor({ state: 'visible', timeout: 10000 });
        await this.createBtn.click();
    }

    async selectFirstDayOfCurrentMonth(locator) {
        await locator.waitFor({ state: 'visible', timeout: 10000 });
        await locator.click();
        
        const now = new Date();
        const firstDayStr = `01-${now.toLocaleString('en-US', { month: 'short' })}-${now.getFullYear()}`;
        
        await locator.click();
        await locator.press('Control+A');
        await locator.press('Backspace');
        await locator.type(firstDayStr, { delay: 100 });
        await locator.press('Enter');
        
        await locator.evaluate(el => {
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            el.blur();
        });
    }

    async selectTodayDate(locator) {
        await locator.waitFor({ state: 'visible', timeout: 10000 });
        await locator.click();
        
        const now = new Date();
        const todayStr = `${String(now.getDate()).padStart(2, '0')}-${now.toLocaleString('en-US', { month: 'short' })}-${now.getFullYear()}`;
        
        await locator.click();
        await locator.press('Control+A');
        await locator.press('Backspace');
        await locator.type(todayStr, { delay: 100 });
        await locator.press('Enter');
        
        await locator.evaluate(el => {
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            el.blur();
        });
    }

    async enterNameOfAccident(name) {
        await this.nameOfAccidentInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.nameOfAccidentInput.fill(name);
        await this.nameOfAccidentInput.dispatchEvent('change');
    }

    async getCalculatedDays() {
        let val = '0';
        for (let i = 0; i < 15; i++) {
            await this.page.waitForTimeout(400);
            val = await this.noOfDaysInput.inputValue();
            if (val && val.trim() !== '' && parseInt(val.trim(), 10) > 0) {
                break;
            }
        }
        return parseInt(val.trim() || '0', 10);
    }

    // Save button var click karnari method
    async clickSave() {
        await this.saveBtn.waitFor({ state: 'visible', timeout: 10000 });
        await this.saveBtn.click();
    }
}

module.exports = { EmployeeAccidentPage };