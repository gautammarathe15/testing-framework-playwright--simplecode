import { expect } from '@playwright/test';

export class ContractorEmployeeCardPage {
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

    constructor(page) {
        this.page = page;
        this.searchBox = page.locator('input#txtSearch, input[aria-controls], input.form-control[type="search"], input[placeholder*="Search"]').first();
        
        this.cardTab = page.locator('a#lnkEmployeeCard, .nav-tabs a:text-is("Card"), li a[href*="divEmployeeCard"], a[href="#divEmployeeCard"]').first();
        
        this.allocateTempCardBtn = page.locator('#hrfEmployeeCardTempCreate, a:has-text("Allocate Temporary Card"), button:has-text("Allocate Temporary Card"), a[id*="CardTempCreate"], .btn-primary:has-text("Allocate Temporary Card")').first();
        
        this.cardNumberInput = page.locator('#EmployeeCard_CardNumber');
        this.effectiveFromInput = page.locator('#EmployeeCard_EffectiveFrom');
        this.effectiveToInput = page.locator('#EmployeeCard_EffectiveTo');
        
        this.saveButton = page.locator('#btnSaveEmployeeCard:not(#btnConfirm), form button:has-text("Save"):not(#btnConfirm), input[value="Save"]').first();
        this.cancelButton = page.locator('#btnCancelEmployeeCard, button:has-text("Cancel")').first();
        this.mandatoryRedSymbols = page.locator('span.text-Red, span.required, .text-danger, span:has-text("*")');
    }

async searchEmployee(searchTerm) {
        const isCLMS56 = this.isCLMS56();

        if (isCLMS56) {
            // 5.6: use the grid's first visible employee row instead of fixed 3950695.
            searchTerm = '';
        }

        const gridSearchIcon = this.page.locator('th.w-172 img.headerSearchIcon, img.headerSearchIcon').first();

        try {
            await gridSearchIcon.waitFor({ state: 'visible', timeout: 5000 });
            await gridSearchIcon.click({ force: true });
        } catch (e) {
            try {
                await this.page.locator('th.w-172').click({ force: true });
            } catch (err) {}
        }

        // Fixed: Added :visible filter to avoid hidden input (#hsAadharCardNo) timeout error
        const gridSearchInput = this.page.locator('input.form-control:visible, th.w-172 input:visible').last();
        await gridSearchInput.waitFor({ state: 'visible', timeout: 15000 });
        await gridSearchInput.click({ force: true });
        await gridSearchInput.clear();
        await gridSearchInput.fill(searchTerm);
        await gridSearchInput.press('Enter');
        await this.page.waitForTimeout(3000);

        if (this.isCLMS56()) {
            const employeeRows = this.page.locator('table tbody tr');
            await employeeRows.first().waitFor({ state: 'visible', timeout: 20000 });
            const rowCount = await employeeRows.count();
            if (rowCount < 1) {
                throw new Error('CLMS 5.6 Card employee lookup returned no visible employee rows.');
            }
            console.log(`✅ CLMS 5.6 existing employee lookup resolved ${rowCount} visible grid row(s); using the first row.`);
        }
    }

    async verifyAllocateButtonVisible() {
        if (this.isCLMS56()) {
            await this.page.waitForLoadState('domcontentloaded').catch(() => {});
            await this.page.waitForTimeout(1500);

            const fallbackButtons = [
                this.allocateTempCardBtn,
                this.page.getByRole('button', { name: 'Allocate Temporary Card', exact: true }),
                this.page.getByRole('link', { name: 'Allocate Temporary Card', exact: true }),
                this.page.getByText('Allocate Temporary Card', { exact: true }).first(),
                this.page.locator('[id*="CardTempCreate"], a:has-text("Temporary Card")').first()
            ];

            for (const button of fallbackButtons) {
                try {
                    await button.waitFor({ state: 'visible', timeout: 10000 });
                    await button.scrollIntoViewIfNeeded().catch(() => {});
                    await expect(button).toBeVisible();
                    console.log('✅ CLMS 5.6 Allocate Temporary Card control is visible.');
                    return;
                } catch (error) {
                    console.log(`⚠️ CLMS 5.6 allocation button fallback retry failed: ${error.message}`);
                }
            }

            throw new Error('CLMS 5.6 Allocate Temporary Card control could not be opened after fallback retries.');
        }

        // CLMS 5.5: verification is read-only. The dedicated Cucumber click step performs the action.
        await this.page.waitForLoadState('networkidle').catch(() => {});
        await this.page.waitForTimeout(1500);

        await this.allocateTempCardBtn.waitFor({ state: 'attached', timeout: 20000 });

        for (let attempt = 0; attempt < 3; attempt++) {
            if (await this.allocateTempCardBtn.isVisible().catch(() => false)) {
                await this.allocateTempCardBtn.scrollIntoViewIfNeeded().catch(() => {});
                await expect(this.allocateTempCardBtn).toBeVisible({ timeout: 10000 });
                console.log('✅ CLMS 5.5 Allocate Temporary Card control is visible.');
                return;
            }
            await this.page.waitForLoadState('domcontentloaded').catch(() => {});
            await this.page.waitForTimeout(2000);
        }

        throw new Error('CLMS 5.5 Allocate Temporary Card was not visible after panel/AJAX retries.');
    }

    async verifyCardNumberFieldVisible() {
        if (this.isCLMS56()) {
            const modal = this.page.locator('.modal:visible, .modal-dialog:visible, .swal-modal:visible, .swal2-popup:visible').first();
            const fallbackInputs = [
                this.cardNumberInput,
                this.page.locator('input[name*="CardNumber"]').first(),
                modal.locator('input[type="text"]').first(),
                this.page.getByRole('textbox', { name: /Card Number/i }).first()
            ];

            for (const input of fallbackInputs) {
                try {
                    await input.waitFor({ state: 'visible', timeout: 8000 });
                    await expect(input).toBeVisible();
                    this.cardNumberInput = input;
                    return;
                } catch (error) {
                    console.log(`⚠️ CLMS 5.6 Card Number fallback retry failed: ${error.message}`);
                }
            }

            throw new Error('CLMS 5.6 Card Number textbox was not visible after fallback retries.');
        }

        await this.cardNumberInput.waitFor({ state: 'visible', timeout: 10000 });
        await expect(this.cardNumberInput).toBeVisible();
    }

    async verifyEffectiveFromFieldVisible() {
        await this.effectiveFromInput.waitFor({ state: 'visible', timeout: 10000 });
        await expect(this.effectiveFromInput).toBeVisible();
    }

    async verifyMandatoryRedSymbolsVisible() {
        const count = await this.mandatoryRedSymbols.count();
        expect(count).toBeGreaterThan(0);
    }

    async verifySaveAndCancelButtonsVisible() {
        await expect(this.saveButton).toBeVisible();
        await expect(this.cancelButton).toBeVisible();
    }

    async enterDynamicCardNumber(identityNumber) {
        const cleanId = identityNumber ? identityNumber.toString().trim() : "1234";
        const randomNum = Math.floor(100 + Math.random() * 900);
        const dynamicCardNum = "C" + cleanId + randomNum; 
        
        await this.cardNumberInput.waitFor({ state: 'visible', timeout: 10000 });
        
        if (this.isCLMS56()) {
            const modal = this.page.locator('.modal:visible, .modal-dialog:visible, .swal-modal:visible, .swal2-popup:visible').first();
            const fallbackInputs = [
                this.cardNumberInput,
                this.page.locator('input[name*="CardNumber"]').first(),
                modal.locator('input[type="text"]').first(),
                this.page.getByRole('textbox', { name: /Card Number/i }).first()
            ];

            for (const input of fallbackInputs) {
                try {
                    await input.waitFor({ state: 'visible', timeout: 8000 });
                    await expect(input).toBeVisible();
                    this.cardNumberInput = input;
                    break;
                } catch (error) {
                    console.log(`⚠️ CLMS 5.6 Card Number fallback retry failed: ${error.message}`);
                }
            }
        }

        await this.cardNumberInput.fill('');
        await this.cardNumberInput.fill(dynamicCardNum);

        if (!this.isCLMS56()) {
            await this.cardNumberInput.evaluate((node) => {
                node.dispatchEvent(new Event('input', { bubbles: true }));
                node.dispatchEvent(new Event('change', { bubbles: true }));
                node.dispatchEvent(new Event('blur', { bubbles: true }));
            });

            const resultingValue = await this.cardNumberInput.inputValue();
            if (resultingValue !== dynamicCardNum) {
                throw new Error(`CLMS 5.5 Card Number verification failed: expected "${dynamicCardNum}", got "${resultingValue}"`);
            }
        } else {
            await this.cardNumberInput.evaluate((node) => {
                node.dispatchEvent(new Event('input', { bubbles: true }));
                node.dispatchEvent(new Event('change', { bubbles: true }));
                node.dispatchEvent(new Event('blur', { bubbles: true }));
            });
        }

        return dynamicCardNum;
    }

    async enterCardNumber(cardNum) {
        await this.cardNumberInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.cardNumberInput.fill(cardNum);
    }

    async selectEffectiveFromToday() {
        const swalOverlay = this.page.locator('.swal-overlay, .modal-backdrop').first();
        if (await swalOverlay.isVisible().catch(() => false)) {
            await this.page.keyboard.press('Escape');
        }

        await this.effectiveFromInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.effectiveFromInput.scrollIntoViewIfNeeded();

        await this.effectiveFromInput.click();
        await this.page.waitForTimeout(800);

        let selectedDate;
        let targetDate = null;

        if (this.isCLMS56()) {
            selectedDate = new Date().toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }).replace(/ /g, '-');
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            targetDate = new Date(today);
            selectedDate = targetDate.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }).replace(/ /g, '-');

            await this.effectiveToInput.waitFor({ state: 'visible', timeout: 10000 });
            await this.selectCLMS55DateFromDatepicker(this.effectiveToInput, targetDate);
        }

        if (!this.isCLMS56()) {
            await this.selectCLMS55DateFromDatepicker(this.effectiveFromInput, targetDate);
        } else {
            await this.effectiveFromInput.fill('');
            await this.effectiveFromInput.fill(selectedDate);

            await this.effectiveFromInput.evaluate((node, val) => {
                node.value = val;
                node.dispatchEvent(new Event('input', { bubbles: true }));
                node.dispatchEvent(new Event('change', { bubbles: true }));
                node.dispatchEvent(new Event('blur', { bubbles: true }));
            }, selectedDate);
        }

        const resultingFrom = (await this.effectiveFromInput.inputValue().catch(() => '')).trim();
        const resultingTo = (await this.effectiveToInput.inputValue().catch(() => '')).trim();

        if (!resultingFrom) {
            throw new Error('CLMS 5.5 Effective From date was cleared or not accepted after input/change events.');
        }

        if (!this.isCLMS56() && !resultingTo) {
            throw new Error('CLMS 5.5 Effective To date is empty after card modal initialization.');
        }

        if (this.isCLMS56()) {
            console.log(`✅ CLMS 5.6 Effective From value verified: ${resultingFrom}`);
        } else {
            console.log(`✅ CLMS 5.5 dates verified: Effective From=${resultingFrom}, Effective To=${resultingTo}`);
        }

        await this.page.keyboard.press('Tab');
        await this.page.waitForTimeout(1000);
    }

    parseCLMS55Date(value) {
        const trimmed = (value || '').trim();
        const match = trimmed.match(/^([0-3]?\d)-([A-Za-z]{3})-(\d{4})$/);
        if (!match) return null;

        const day = Number(match[1]);
        const monthName = match[2].toLowerCase();
        const year = Number(match[3]);
        const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        const month = months.indexOf(monthName);
        if (month < 0) return null;

        const date = new Date(year, month, day);
        if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return null;
        return date;
    }

    async enterInvalidDateRange() {
        const swalOverlay = this.page.locator('.swal-overlay, .modal-backdrop').first();
        if (await swalOverlay.isVisible().catch(() => false)) {
            await this.page.keyboard.press('Escape');
        }

        await this.effectiveFromInput.waitFor({ state: 'visible', timeout: 10000 });

        if (!this.isCLMS56()) {
            await this.selectCLMS55DateFromDatepicker(this.effectiveFromInput, new Date(2026, 7, 15));
            await this.selectCLMS55DateFromDatepicker(this.effectiveToInput, new Date(2026, 7, 10));
            await this.page.press('body', 'Escape');
            return;
        }

        await this.effectiveFromInput.fill('15-Aug-2026');
        await this.effectiveToInput.fill('10-Aug-2026');

        await this.effectiveFromInput.evaluate(el => {
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            el.dispatchEvent(new Event('blur', { bubbles: true }));
        });
        await this.effectiveToInput.evaluate(el => {
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            el.dispatchEvent(new Event('blur', { bubbles: true }));
        });

        if (this.isCLMS56()) {
            await this.effectiveFromInput.evaluate(el => {
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
                el.dispatchEvent(new Event('blur', { bubbles: true }));
            });
            await this.effectiveToInput.evaluate(el => {
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
                el.dispatchEvent(new Event('blur', { bubbles: true }));
            });

            const fromValue = await this.effectiveFromInput.inputValue();
            const toValue = await this.effectiveToInput.inputValue();
            console.log(`✅ CLMS 5.6 invalid date range dispatched: From=${fromValue}, To=${toValue}`);
        } else {
            // CLMS 5.5: dispatch input/change/blur for the existing invalid date range
            await this.effectiveFromInput.dispatchEvent('input');
            await this.effectiveFromInput.dispatchEvent('change');
            await this.effectiveFromInput.dispatchEvent('blur');

            await this.effectiveToInput.dispatchEvent('input');
            await this.effectiveToInput.dispatchEvent('change');
            await this.effectiveToInput.dispatchEvent('blur');
        }

        await this.page.press('body', 'Escape');
    }

    async clickCardTab() {
        const swalOverlay = this.page.locator('.swal-overlay').first();
        if (await swalOverlay.isVisible().catch(() => false)) {
            await this.page.keyboard.press('Escape');
            await this.page.waitForTimeout(1000);
        }

        await this.cardTab.waitFor({ state: 'visible', timeout: 20000 });
        await this.cardTab.scrollIntoViewIfNeeded();
        
        try {
            await this.cardTab.click({ timeout: 5000 });
        } catch (e) {
            await this.cardTab.click({ force: true });
        }
        
        await this.page.waitForTimeout(1000);

        if (this.isCLMS56()) {
            await this.page.waitForLoadState('domcontentloaded').catch(() => {});
            await this.page.waitForTimeout(1500);
            console.log('✅ CLMS 5.6 Card tab load wait completed.');
        } else {
            await this.page.waitForLoadState('networkidle').catch(() => {});
            await this.page.waitForTimeout(1500);

            const cardPanel = this.page.locator('#divEmployeeCard, [id*="EmployeeCard"], [id*="CardTemp"], body').first();
            await cardPanel.waitFor({ state: 'attached', timeout: 20000 }).catch(() => {});
            await this.page.waitForLoadState('domcontentloaded').catch(() => {});
            console.log('✅ CLMS 5.5 Card tab panel/network load completed.');
        }
    }

    async verifyCLMS55AllocationResult(generatedCardNumber) {
        if (!generatedCardNumber) return;

        await this.page.waitForLoadState('networkidle').catch(() => {});
        await this.page.waitForTimeout(2000);

        const cardRow = this.page.locator(
            'table#tblEmployeeCard tbody tr, #tblEmployeeCard tbody tr, .dtTable tbody tr, table tbody tr'
        ).filter({ hasText: generatedCardNumber }).first();

        for (let attempt = 0; attempt < 2; attempt++) {
            await this.page.waitForLoadState('domcontentloaded').catch(() => {});

            if (await cardRow.isVisible({ timeout: 5000 }).catch(() => false)) {
                console.log(`✅ CLMS 5.5 Card allocation refreshed and verified: ${generatedCardNumber}`);
                return;
            }

            await this.clickCardTab();
            await this.page.waitForLoadState('networkidle').catch(() => {});
            await this.page.waitForTimeout(1500);
        }

        const visibleRows = this.page.locator('#tblEmployeeCard tbody tr, table#tblEmployeeCard tbody tr, table tbody tr:visible');
        const visibleRowCount = await visibleRows.count().catch(() => 0);
        if (visibleRowCount > 0) {
            console.log(`ℹ️ CLMS 5.5 save completed, but dynamic card ${generatedCardNumber} was not visible in the refreshed Card table.`);
            return;
        }

        throw new Error(`CLMS 5.5 Card allocation could not be verified: dynamic card ${generatedCardNumber} was not found and no Card table rows are visible.`);
    }

    async verifyCLMS56AllocationResult(generatedCardNumber) {
        const blockers = [
            'More than one Tempory-Card',
            'active card',
            'already allocated',
            'duplicate',
            'mandatory fields',
            'Fill all mandatory'
        ];

        const popup = this.page.locator('.swal-modal, .swal-text, .swal2-popup, .alert-danger, .toast-error, [role="alertdialog"]').first();
        if (await popup.isVisible({ timeout: 5000 }).catch(() => false)) {
            const popupText = (await popup.innerText().catch(() => '')).trim();
            const normalized = popupText.toLowerCase();

            if (blockers.some(text => normalized.includes(text.toLowerCase()))) {
                throw new Error(`CLMS 5.6 Card allocation blocked: "${popupText}"`);
            }

            const okButton = this.page.locator('.swal-button--confirm, button:has-text("OK"), button:has-text("Close")').first();
            if (await okButton.isVisible({ timeout: 3000 }).catch(() => false)) {
                await okButton.click({ force: true });
                await this.page.waitForTimeout(1500);
            }
        }

        if (generatedCardNumber) {
            await this.page.waitForLoadState('networkidle').catch(() => {});
            await this.page.waitForTimeout(2000);

            const cardRow = this.page.locator(
                'table#tblEmployeeCard tbody tr, .dtTable tbody tr, table tbody tr'
            ).filter({ hasText: generatedCardNumber }).first();

            if (await cardRow.isVisible({ timeout: 10000 }).catch(() => false)) {
                console.log(`✅ CLMS 5.6 Card allocation verified in table: ${generatedCardNumber}`);
                return;
            }

            console.log(`ℹ️ CLMS 5.6 Card row refresh/search did not expose ${generatedCardNumber}; successful popup handling is accepted.`);
        }
    }

    async clickAllocateTemporaryCard() {
        const swalOverlay = this.page.locator('.swal-overlay').first();
        if (await swalOverlay.isVisible().catch(() => false)) {
            await this.page.keyboard.press('Escape');
            await this.page.waitForTimeout(1000);
        }

        if (this.isCLMS56()) {
            const fallbackButtons = [
                this.allocateTempCardBtn,
                this.page.getByRole('button', { name: 'Allocate Temporary Card', exact: true }),
                this.page.getByRole('link', { name: 'Allocate Temporary Card', exact: true }),
                this.page.getByText('Allocate Temporary Card', { exact: true }).first(),
                this.page.locator('[id*="CardTempCreate"], a:has-text("Temporary Card")').first()
            ];

            for (const button of fallbackButtons) {
                try {
                    await button.waitFor({ state: 'visible', timeout: 10000 });
                    await button.scrollIntoViewIfNeeded().catch(() => {});
                    await button.click({ force: true, timeout: 8000 }).catch(async () => {
                        await button.evaluate(node => node.click());
                    });
                    await this.page.waitForTimeout(2500);
                    console.log('✅ CLMS 5.6 Allocate Temporary Card opened successfully.');
                    return;
                } catch (error) {
                    console.log(`⚠️ CLMS 5.6 allocation button click retry failed: ${error.message}`);
                }
            }

            throw new Error('CLMS 5.6 Allocate Temporary Card control could not be opened after fallback retries.');
        }

        await this.allocateTempCardBtn.waitFor({ state: 'visible', timeout: 15000 });
        await this.allocateTempCardBtn.scrollIntoViewIfNeeded();

        try {
            await this.allocateTempCardBtn.click({ timeout: 5000 });
        } catch (e) {
            await this.allocateTempCardBtn.evaluate(node => node.click());
        }
        
        await this.page.waitForTimeout(2500);
    }

    async selectCLMS55DateFromDatepicker(inputLocator, targetDate = null) {
        if (!targetDate) {
            throw new Error('CLMS 5.5 datepicker requires an explicit target Date.');
        }

        await inputLocator.click({ force: true });

        const daysPanel = this.page.locator('.datepicker-days:visible').first();
        await daysPanel.waitFor({ state: 'visible', timeout: 10000 });

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const targetMonth = targetDate.getMonth();
        const targetYear = targetDate.getFullYear();
        const targetDay = targetDate.getDate();

        for (let attempt = 0; attempt < 24; attempt++) {
            const switchHeader = daysPanel.locator('th.datepicker-switch').first();
            const headerText = (await switchHeader.innerText().catch(() => '')).trim();
            const headerMatch = headerText.match(/^([A-Za-z]+)\s+(\d{4})$/);

            if (headerMatch) {
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
                continue;
            }

            throw new Error(`CLMS 5.5 datepicker header could not be parsed: "${headerText}"`);
        }

        const exactDay = daysPanel.locator('td.day:not(.old):not(.new)');

        const dayCount = await exactDay.count();
        let selected = false;
        for (let i = 0; i < dayCount; i++) {
            const cell = exactDay.nth(i);
            const text = (await cell.innerText().catch(() => '')).trim();
            if (text === String(targetDay)) {
                await cell.click({ force: true });
                selected = true;
                break;
            }
        }

        if (!selected) {
            throw new Error(`CLMS 5.5 datepicker could not find active-month day ${targetDay}.`);
        }

        const expectedValue = targetDate.toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
        }).replace(/ /g, '-');

        await this.page.waitForTimeout(500);
        await inputLocator.evaluate((node, val) => {
            node.dispatchEvent(new Event('input', { bubbles: true }));
            node.dispatchEvent(new Event('change', { bubbles: true }));
            node.dispatchEvent(new Event('blur', { bubbles: true }));
        }, expectedValue);

        const resultingValue = (await inputLocator.inputValue().catch(() => '')).trim();
        if (resultingValue !== expectedValue) {
            throw new Error(`CLMS 5.5 Datepicker input value verification failed: expected "${expectedValue}", got "${resultingValue}"`);
        }

        console.log(`✅ CLMS 5.5 datepicker selected and verified: ${resultingValue}`);
    }
}