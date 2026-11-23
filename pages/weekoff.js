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

    isCLMS56() {
        let configuredUrl = '';
        try {
            configuredUrl = require('../utilities/environmentConfig').resolveAppUrl();
        } catch (error) {
            configuredUrl = '';
        }

        const targetUrl = `${this.page.url() || ''} ${configuredUrl}`;
        return /(?:CLMS_5_6|\/CLMS_5_6\/app)/i.test(targetUrl);
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
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        await this.selectDateFromInputAndCalendar(this.effectiveFromInput, today);

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const expectedValue = `${String(today.getDate()).padStart(2, '0')}-${monthNames[today.getMonth()]}-${today.getFullYear()}`;
        const resultingValue = (await this.effectiveFromInput.inputValue().catch(() => '')).trim();

        if (resultingValue !== expectedValue) {
            throw new Error(`CLMS 5.5 Week Off Effective From verification failed: expected "${expectedValue}", got "${resultingValue}"`);
        }
    }

    async setEffectiveFromDate(dateValue) {
        const match = String(dateValue).trim().match(/^([0-3]?\d)-([A-Za-z]{3})-(\d{4})$/);
        if (!match) {
            throw new Error(`CLMS 5.5 Week Off invalid Effective From date: "${dateValue}"`);
        }

        const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        const month = monthNames.indexOf(match[2].toLowerCase());
        if (month < 0) {
            throw new Error(`CLMS 5.5 Week Off invalid month in Effective From date: "${dateValue}"`);
        }

        const targetDate = new Date(Number(match[3]), month, Number(match[1]));
        await this.selectDateFromInputAndCalendar(this.effectiveFromInput, targetDate);

        const resultingValue = (await this.effectiveFromInput.inputValue().catch(() => '')).trim();
        if (resultingValue !== String(dateValue).trim()) {
            throw new Error(`CLMS 5.5 Week Off Effective From verification failed: expected "${dateValue}", got "${resultingValue}"`);
        }
    }

    async selectDateFromInputAndCalendar(inputLocator, targetDate) {
        const swalOverlay = this.page.locator('.swal-overlay, .modal-backdrop').first();
        if (await swalOverlay.isVisible().catch(() => false)) {
            await this.page.keyboard.press('Escape');
        }

        await inputLocator.waitFor({ state: 'visible', timeout: 10000 });
        await inputLocator.scrollIntoViewIfNeeded();
        await inputLocator.click({ force: true });

        const daysPanel = this.page.locator('.datepicker-days:visible').first();
        await daysPanel.waitFor({ state: 'visible', timeout: 10000 });

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const targetMonth = targetDate.getMonth();
        const targetYear = targetDate.getFullYear();
        const targetDay = targetDate.getDate();

        for (let attempt = 0; attempt < 24; attempt++) {
            const headerText = (await daysPanel.locator('th.datepicker-switch').first().innerText().catch(() => '')).trim();
            const headerMatch = headerText.match(/^([A-Za-z]+)\s+(\d{4})$/);

            if (!headerMatch) {
                throw new Error(`CLMS 5.5 Week Off datepicker header could not be parsed: "${headerText}"`);
            }

            const monthIndex = monthNames.findIndex(month => month.toLowerCase().startsWith(headerMatch[1].toLowerCase()));
            const headerYear = Number(headerMatch[2]);

            if (monthIndex === targetMonth && headerYear === targetYear) break;

            const headerValue = headerYear * 12 + monthIndex;
            const targetValue = targetYear * 12 + targetMonth;
            const navigationButton = headerValue > targetValue
                ? daysPanel.locator('th.prev').first()
                : daysPanel.locator('th.next').first();

            await navigationButton.waitFor({ state: 'visible', timeout: 5000 });
            await navigationButton.click({ force: true });
            await this.page.waitForTimeout(300);
        }

        const dayCells = daysPanel.locator('td.day:not(.old):not(.new)');
        const dayCount = await dayCells.count();
        let selected = false;

        for (let i = 0; i < dayCount; i++) {
            const cell = dayCells.nth(i);
            const text = (await cell.innerText().catch(() => '')).trim();
            if (text === String(targetDay)) {
                await cell.click({ force: true });
                selected = true;
                break;
            }
        }

        if (!selected) {
            throw new Error(`CLMS 5.5 Week Off datepicker could not find active-month day ${targetDay}.`);
        }

        await this.page.waitForTimeout(300);
        await inputLocator.evaluate((node) => {
            node.dispatchEvent(new Event('input', { bubbles: true }));
            node.dispatchEvent(new Event('change', { bubbles: true }));
            node.dispatchEvent(new Event('blur', { bubbles: true }));
        });
    }

    async selectFirstTemplate() {
        await this.templateDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await this.templateDropdown.click();
        const options = await this.templateDropdown.locator('option').all();
        if (options.length > 1) {
            const secondOptionValue = await options[1].getAttribute('value');
            await this.templateDropdown.selectOption(secondOptionValue);
            this.selectedTemplateName = (await this.templateDropdown.locator('option:checked').innerText().catch(() => '')).trim();
        }
    }

    async selectFromDateToday() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        await this.selectDateFromInputAndCalendar(this.fromDateInput, today);

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const expectedValue = `${String(today.getDate()).padStart(2, '0')}-${monthNames[today.getMonth()]}-${today.getFullYear()}`;
        await expect(this.fromDateInput).toHaveValue(expectedValue);
    }

    async selectToDateFuture() {
        const futureDate = new Date();
        futureDate.setHours(0, 0, 0, 0);
        futureDate.setDate(futureDate.getDate() + 5);

        await this.selectDateFromInputAndCalendar(this.toDateInput, futureDate);

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const expectedValue = `${String(futureDate.getDate()).padStart(2, '0')}-${monthNames[futureDate.getMonth()]}-${futureDate.getFullYear()}`;
        await expect(this.toDateInput).toHaveValue(expectedValue);
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

        let firstRow;

        if (this.isCLMS56()) {
            const targetRow = this.page.locator('table tbody tr').filter({ hasText: expectedTemplate }).first();
            if (await targetRow.isVisible({ timeout: 15000 }).catch(() => false)) {
                firstRow = targetRow;
            } else {
                const visibleRows = this.page.locator('table tbody tr:visible');
                const rowCount = await visibleRows.count();

                for (let i = 0; i < rowCount; i++) {
                    const candidate = visibleRows.nth(i);
                    const text = (await candidate.innerText().catch(() => '')).trim();
                    if (text.includes(expectedTemplate) || text.includes(expectedFromDate) || text.includes(expectedToDate)) {
                        firstRow = candidate;
                        break;
                    }
                }
            }

            if (!firstRow) {
                throw new Error(`CLMS 5.6 Week Off template row was not found: template="${expectedTemplate}", From="${expectedFromDate}", To="${expectedToDate}"`);
            }
        } else {
            const targetRow = this.page.locator('tr').filter({ hasText: expectedTemplate }).first();
            firstRow = await targetRow.isVisible().catch(() => false)
                ? targetRow
                : this.page.locator('#dtWeekOffTable').last().locator('tbody tr').first();
        }

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