import { expect } from '@playwright/test';

export class ContractorEmployeeWeekOffPage {
    constructor(page) {
        this.page = page;
        this.weekOffTab = page.locator('a#lnkEmployeeWeekOff, .nav-tabs a:text-is("Week Off"), a[href="#divEmployeeWeekOff"]').first();
        this.okButton = page.locator('.swal-button.swal-button--confirm, button:text-is("OK")').first();
     
        this.weekOffDefaultCheckbox = page.locator('#EmployeeWeekOff_IsWeekOffDefaultApplicable, input[id*="IsWeekOffDefaultApplicable"], input[name*="IsWeekOffDefaultApplicable"]').first();
        
        this.effectiveFromInput = page.locator('#EmployeeWeekOff_EffectiveFrom, input[name*="EffectiveFrom"]').first();
        this.templateDropdown = page.locator('#EmployeeWeekOffShiftTemplate_WeekOffShiftTemplateID, select[name*="WeekOffShiftTemplateID"]').first();
        this.fromDateInput = page.locator('#EmployeeWeekOffShiftTemplate_FromDate').first();
        this.toDateInput = page.locator('#EmployeeWeekOffShiftTemplate_ToDate').first();
        this.updateButton = page.locator('#btnUpdateEmployeeWeekOff, input[name="btnUpdateEmployeeWeekOff"]').first();
        this.saveTemplateButton = page.locator('#btnSaveTemplateDetails, input[name="SaveTemplateDetails"], button:text-is("Save")').first();
    }

    async clickWeekOffTab() {
        const swalOverlay = this.page.locator('.swal-overlay').first();
        if (await swalOverlay.isVisible().catch(() => false)) {
            if (await this.okButton.isVisible().catch(() => false)) {
                await this.okButton.click({ force: true }).catch(() => {});
            } else {
                await this.page.keyboard.press('Escape');
            }
            await this.page.waitForTimeout(1000);
        }
        await swalOverlay.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
        await this.weekOffTab.waitFor({ state: 'visible', timeout: 20000 });
        await this.weekOffTab.scrollIntoViewIfNeeded();
        try {
            await this.weekOffTab.click({ timeout: 5000 });
        } catch (e) {
            await this.weekOffTab.click({ force: true });
        }
        await this.page.waitForTimeout(2000);
        await this.templateDropdown.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    }

    async verifyDefaultSectionVisible() {
        await expect(this.weekOffDefaultCheckbox).toBeVisible({ timeout: 15000 });
        await expect(this.effectiveFromInput).toBeVisible({ timeout: 15000 });
    }

    async verifyTemplateDropdownVisible() {
        await expect(this.templateDropdown).toBeVisible({ timeout: 15000 });
    }

    async verifyFromDateVisible() {
        await expect(this.fromDateInput).toBeVisible({ timeout: 15000 });
    }

    async verifyToDateVisible() {
        await expect(this.toDateInput).toBeVisible({ timeout: 15000 });
    }

async uncheckWeekOffDefault() {
        await this.weekOffDefaultCheckbox.waitFor({ state: 'visible', timeout: 10000 });
        if (await this.weekOffDefaultCheckbox.isChecked()) {
          
            const labelLocator = this.page.locator('label[for="EmployeeWeekOff_IsWeekOffDefaultApplicable"]').first();
            if (await labelLocator.isVisible().catch(() => false)) {
                await labelLocator.click({ force: true }).catch(() => {});
            }
            
            
            if (await this.weekOffDefaultCheckbox.isChecked()) {
                await this.page.evaluate(() => {
                    const cb = document.querySelector('#EmployeeWeekOff_IsWeekOffDefaultApplicable');
                    if (cb) {
                        cb.checked = false;
                        cb.dispatchEvent(new Event('change', { bubbles: true }));
                        cb.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                });
            }
        }
    }

    async selectEffectiveFromToday() {
        const now = new Date();
        const day = String(now.getDate());
        await this.selectDateFromInputAndCalendar(this.effectiveFromInput, day);
    }

    async setEffectiveFromDate(dateValue) {
        let dayText = String(dateValue);
        if (dateValue.includes('-')) {
            dayText = dateValue.split('-')[0];
        }
        await this.selectDateFromInputAndCalendar(this.effectiveFromInput, dayText);
    }

    async selectDateFromInputAndCalendar(inputLocator, dayText) {
        const swalOverlay = this.page.locator('.swal-overlay, .modal-backdrop');
        if (await swalOverlay.isVisible().catch(() => false)) {
            await this.page.keyboard.press('Escape');
        }
        await inputLocator.waitFor({ state: 'visible', timeout: 10000 });
        await inputLocator.click();
        const calendarWidget = this.page.locator('.datepicker, .bootstrap-datetimepicker-widget').first();
        if (!(await calendarWidget.isVisible().catch(() => false))) {
            const parentGroup = inputLocator.locator('xpath=ancestor::div[contains(@class, "input-group")]').first();
            const addon = parentGroup.locator('.input-group-addon, span, i').first();
            if (await addon.isVisible().catch(() => false)) {
                await addon.click().catch(() => {});
            }
        }
        await calendarWidget.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
        const calendarDay = calendarWidget.locator('td.day:not(.old):not(.new)').filter({ hasText: dayText }).first();
        await calendarDay.waitFor({ state: 'visible', timeout: 5000 });
        await calendarDay.click();
    }

    async selectFirstTemplate() {
        await this.templateDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await this.templateDropdown.click();
        const options = await this.templateDropdown.locator('option').all();
        if (options.length > 1) {
            const secondOptionValue = await options[1].getAttribute('value');
            await this.templateDropdown.selectOption(secondOptionValue);
        }
    }

    async selectFromDateToday() {
        const now = new Date();
        const day = String(now.getDate());
        await this.selectDateFromInputAndCalendar(this.fromDateInput, day);
    }

    async selectToDateFuture() {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 5);
        const day = String(futureDate.getDate());
        await this.selectDateFromInputAndCalendar(this.toDateInput, day);
    }

    async clickSaveTemplate() {
        await this.page.evaluate(() => window.scrollBy(0, 500));
        await this.page.waitForTimeout(1000);
        try {
            await this.saveTemplateButton.waitFor({ state: 'visible', timeout: 8000 });
            await this.saveTemplateButton.click({ force: true });
        } catch (e) {
            await this.page.evaluate(() => {
                const btn = document.querySelector('#btnSaveTemplateDetails');
                if (btn) btn.click();
            });
        }
        await this.page.waitForTimeout(2000);
    }

async verifyTemplateTableData(expectedTemplate, expectedFromDate, expectedToDate) {
        
        await this.page.waitForTimeout(2000);
        
        const templateTableRows = this.page.locator('table tr').filter({ has: this.page.locator('td .icon-pencil, td .fa-pencil, td i.fa, td a.btn, td img[alt*="Edit"], td .glyphicon-pencil, td a i') });
        
       
        const targetRow = this.page.locator('tr').filter({ hasText: expectedTemplate }).first();
        
       
        const firstRow = await targetRow.isVisible().catch(() => false) 
            ? targetRow 
            : this.page.locator('#dtWeekOffTable').last().locator('tbody tr').first(); // किंवा उजव्या टेबलची पहिली रो

        await firstRow.waitFor({ state: 'visible', timeout: 15000 });
        
        const templateCell = firstRow.locator('td').nth(0);
        const fromDateCell = firstRow.locator('td').nth(1);
        const toDateCell = firstRow.locator('td').nth(2);
        
        await expect(templateCell).toContainText(expectedTemplate);
        await expect(fromDateCell).toContainText(expectedFromDate);
        await expect(toDateCell).toContainText(expectedToDate);
    }

    async verifyFirstRowTableData(expectedStatus, expectedDate) {
        const firstRow = this.page.locator('.dtTable table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 10000 });
        const statusCell = firstRow.locator('td').nth(0);
        const dateCell = firstRow.locator('td').nth(1);
        await expect(statusCell).toContainText(expectedStatus);
        await expect(dateCell).toContainText(expectedDate);
    }

    async clickWeekOffUpdate() {
        await this.updateButton.waitFor({ state: 'visible', timeout: 10000 });
        try {
            await this.updateButton.click({ timeout: 5000, force: true });
        } catch (e) {
            await this.updateButton.click({ force: true });
        }
    }

    // Leave 'Week Off and Shift Template' dropdown empty (select default 'Select' or index 0)
    async leaveTemplateDropdownEmpty() {
        await this.templateDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await this.templateDropdown.selectOption({ index: 0 });
    }

    // Clear 'From Date' input field
    async clearFromDate() {
        await this.fromDateInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.fromDateInput.fill('');
    }

    // Clear 'To Date' input field
    async clearToDate() {
        await this.toDateInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.toDateInput.fill('');
    }

 async verifyValidationPopupOrMessage() {
    
    const possibleLocators = [
        '.swal-modal', 
        '.swal-text', 
        'div.swal-overlay', 
        '.alert-danger', 
        '.text-danger', 
        '.validation-summary-errors',
        'text=Please select Template', 
        'text=Please select'
    ];

    let found = false;
    for (const selector of possibleLocators) {
        const element = this.page.locator(selector).first();
        try {
            await element.waitFor({ state: 'visible', timeout: 3000 });
            found = true;
            console.log(`Validation message/popup found using selector: ${selector}`);
            break;
        } catch (e) {
        
        }
    }

    if (!found) {
        throw new Error("Validation popup or message was not visible on the screen!");
    }
}


}