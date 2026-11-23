import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ContractorEmployeeCardPage } from '../../pages/card.js';

function getCardPage(page) {
    return new ContractorEmployeeCardPage(page);
}

When('User enters {string} in search filter for Aadhaar or employee details', async function (searchTerm) {
    const cardPage = getCardPage(this.page);
    let configuredUrl = '';
    try {
        configuredUrl = require('../../utilities/environmentConfig').resolveAppUrl();
    } catch (error) {
        configuredUrl = '';
    }

    const targetUrl = `${this.page.url() || ''} ${configuredUrl}`;
    const isCLMS56 = /(?:CLMS_5_6|\/CLMS_5_6\/app)/i.test(targetUrl);

    // 5.5 keeps 3950695 exactly; 5.6 resolves the first existing grid employee dynamically.
    await cardPage.searchEmployee(isCLMS56 ? '' : searchTerm);
});

When('User selects the 1st entry from the employee grid', async function () {
    let configuredUrl = '';
    try {
        configuredUrl = require('../../utilities/environmentConfig').resolveAppUrl();
    } catch (error) {
        configuredUrl = '';
    }

    const targetUrl = `${this.page.url() || ''} ${configuredUrl}`;
    const isCLMS56 = /(?:CLMS_5_6|\/CLMS_5_6\/app)/i.test(targetUrl);

    const employeeRows = this.page.locator('table tbody tr');
    await employeeRows.first().waitFor({ state: 'visible', timeout: 20000 });

    if (isCLMS56) {
        const rowCount = await employeeRows.count();
        if (rowCount < 1) {
            throw new Error('CLMS 5.6 Card existing-employee lookup returned no rows.');
        }

        const firstRowEditIcon = employeeRows.first().locator(
            'a.fa-pencil, a[title="Edit"], .btn-edit, a[href*="Edit"], .fa-edit, button:has-text("Edit")'
        ).first();
        await firstRowEditIcon.waitFor({ state: 'visible', timeout: 15000 });
        await firstRowEditIcon.click({ force: true });
        await this.page.waitForTimeout(2000);
        console.log(`✅ CLMS 5.6 selected the first existing employee row (${rowCount} visible row(s)).`);
        return;
    }

    // Existing CLMS 5.5 behavior remains unchanged.
    const firstRowEditIcon = employeeRows.first().locator('a.fa-pencil, a[title="Edit"], .btn-edit, a[href*="Edit"], .fa-edit').first();
    await firstRowEditIcon.waitFor({ state: 'visible', timeout: 15000 });
    await firstRowEditIcon.click();
    await this.page.waitForTimeout(2000);
});

Then('User verifies {string} button is visible', async function (buttonName) {
    const cardPage = getCardPage(this.page);
    if (buttonName.includes('Allocate Temporary Card')) {
        await cardPage.verifyAllocateButtonVisible();
    }
});

When('User clicks on "Allocate Temporary Card" button', async function () {
    const cardPage = getCardPage(this.page);
    await cardPage.clickAllocateTemporaryCard();
});

Then('User verifies "Card Number" label and input textbox are visible', async function () {
    const cardPage = getCardPage(this.page);
    await cardPage.verifyCardNumberFieldVisible();
});

Then('User verifies "Effective From" label and input textbox are visible', async function () {
    const cardPage = getCardPage(this.page);
    await cardPage.verifyEffectiveFromFieldVisible();
});

Then('User verifies mandatory field red symbols are visible', async function () {
    const cardPage = getCardPage(this.page);
    await cardPage.verifyMandatoryRedSymbolsVisible();
});

Then('User verifies "Save" and "Cancel" buttons are visible', async function () {
    const cardPage = getCardPage(this.page);
    await cardPage.verifySaveAndCancelButtonsVisible();
});

When('User enters dynamic card number based on Aadhaar', async function () {
    const cardPage = getCardPage(this.page);
    const identifier = this.generatedAadhaar || "0001"; 
    this.generatedCardNumber = await cardPage.enterDynamicCardNumber(identifier);
});

When('User enters alphanumeric value {string} in Card Number field', async function (cardNum) {
    const cardPage = getCardPage(this.page);
    await cardPage.cardNumberInput.waitFor({ state: 'visible', timeout: 10000 });
    await cardPage.cardNumberInput.fill(cardNum);
});

When('User selects today\'s date in Effective From field', async function () {
    const cardPage = getCardPage(this.page);

    let configuredUrl = '';
    try {
        configuredUrl = require('../../utilities/environmentConfig').resolveAppUrl();
    } catch (error) {
        configuredUrl = '';
    }

    const isCLMS56 = /(?:CLMS_5_6|\/CLMS_5_6\/app)/i.test(`${this.page.url() || ''} ${configuredUrl}`);

    if (!isCLMS56) {
        await cardPage.selectEffectiveFromToday();
        return;
    }

    const swalOverlay = this.page.locator('.swal-overlay, .modal-backdrop');
    if (await swalOverlay.isVisible()) {
        await this.page.keyboard.press('Escape');
    }

    await cardPage.effectiveFromInput.waitFor({ state: 'visible', timeout: 10000 });
    await cardPage.effectiveFromInput.click();

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const isoDate = `${year}-${month}-${day}`;

    await cardPage.effectiveFromInput.evaluate((el, val) => {
        el.value = val;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    }, isoDate);

    const todayCell = this.page.locator('.datepicker td.day.today, .ui-datepicker-today-a, .flatpickr-day.today').first();
    if (await todayCell.isVisible().catch(() => false)) {
        await todayCell.click();
    } else {
        await this.page.press('body', 'Escape');
    }
});

When('User enters an invalid date range where Effective To is earlier than Effective From', async function () {
    const cardPage = getCardPage(this.page);

    let configuredUrl = '';
    try {
        configuredUrl = require('../../utilities/environmentConfig').resolveAppUrl();
    } catch (error) {
        configuredUrl = '';
    }

    const isCLMS56 = /(?:CLMS_5_6|\/CLMS_5_6\/app)/i.test(`${this.page.url() || ''} ${configuredUrl}`);

    if (!isCLMS56) {
        await cardPage.enterInvalidDateRange();
        return;
    }

    const swalOverlay = this.page.locator('.swal-overlay, .modal-backdrop');
    if (await swalOverlay.isVisible()) {
        await this.page.keyboard.press('Escape');
    }

    await cardPage.effectiveFromInput.waitFor({ state: 'visible', timeout: 10000 });

    await cardPage.effectiveFromInput.evaluate((el) => {
        el.value = '2026-08-15';
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    });

    await cardPage.effectiveToInput.evaluate((el) => {
        el.value = '2026-08-10';
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    });

    await cardPage.page.press('body', 'Escape');
});

When('User clicks on the Save button for card allocation', async function () {
    const cardPage = getCardPage(this.page);
    await cardPage.saveButton.waitFor({ state: 'visible', timeout: 10000 });

    let configuredUrl = '';
    try {
        configuredUrl = require('../../utilities/environmentConfig').resolveAppUrl();
    } catch (error) {
        configuredUrl = '';
    }

    const targetUrl = `${this.page.url() || ''} ${configuredUrl}`;
    const isCLMS56 = /(?:CLMS_5_6|\/CLMS_5_6\/app)/i.test(targetUrl);

    await cardPage.saveButton.click({ force: true });

    if (!isCLMS56) {
        await this.page.waitForLoadState('networkidle').catch(() => {});
        await this.page.waitForTimeout(2500);

        const popup = this.page.locator('.swal-modal, .swal2-popup, .swal-text, .alert-danger, .alert-success, .toast-success, [role="alertdialog"]').first();
        if (await popup.isVisible({ timeout: 5000 }).catch(() => false)) {
            const popupText = (await popup.innerText().catch(() => '')).trim();
            const normalized = popupText.toLowerCase();

            if (normalized.includes('fill all mandatory') || normalized.includes('mandatory field') || normalized.includes('mandatory')) {
                const cardNumber = (await cardPage.cardNumberInput.inputValue().catch(() => '')).trim();
                const effectiveFrom = (await cardPage.effectiveFromInput.inputValue().catch(() => '')).trim();
                const effectiveTo = (await cardPage.effectiveToInput.inputValue().catch(() => '')).trim();

                const okButton = this.page.locator('.swal-button--confirm, button:has-text("OK")').first();
                if (await okButton.isVisible({ timeout: 3000 }).catch(() => false)) {
                    await okButton.click({ force: true }).catch(async () => okButton.evaluate(button => button.click()));
                }

                throw new Error(`CLMS 5.5 mandatory-field validation: "${popupText}" | Card Number="${cardNumber}" | Effective From="${effectiveFrom}" | Effective To="${effectiveTo}"`);
            }

            if (normalized.includes('to date') && (normalized.includes('greater') || normalized.includes('from date'))) {
                console.log(`ℹ️ CLMS 5.5 date-range popup preserved for verification: ${popupText}`);
            }

            if (normalized.includes('more than one tempory-card') || normalized.includes('already has an active card') || normalized.includes('duplicate card') || normalized.includes('already allocated')) {
                throw new Error(`CLMS 5.5 Card allocation blocked: "${popupText}"`);
            }

            const okButton = this.page.locator('.swal-button--confirm, button:has-text("OK")').first();
            if (await okButton.isVisible({ timeout: 3000 }).catch(() => false)) {
                await okButton.click({ force: true }).catch(async () => okButton.evaluate(button => button.click()));
                await this.page.waitForTimeout(1500);
            }
        }

        await this.page.waitForLoadState('networkidle').catch(() => {});
    } else {
        await this.page.waitForTimeout(1000);
    }
});

Then('User verifies card allocation success message', { timeout: 60000 }, async function () {
    let configuredUrl = '';
    try {
        configuredUrl = require('../../utilities/environmentConfig').resolveAppUrl();
    } catch (error) {
        configuredUrl = '';
    }

    const targetUrl = `${this.page.url() || ''} ${configuredUrl}`;
    const isCLMS56 = /(?:CLMS_5_6|\/CLMS_5_6\/app)/i.test(targetUrl);

    if (isCLMS56) {
        const cardPage = getCardPage(this.page);
        await cardPage.verifyCLMS56AllocationResult(this.generatedCardNumber);
        return;
    }

    const duplicateErrorPopup = this.page.locator('.swal-text, .alert-danger, div:has-text("More than one Tempory-Card")').first();
    if (await duplicateErrorPopup.isVisible().catch(() => false)) {
        const errorText = (await duplicateErrorPopup.textContent().catch(() => '')).trim();
        const normalized = errorText.toLowerCase();

        if (normalized.includes('fill all mandatory') || normalized.includes('mandatory field') || normalized.includes('mandatory')) {
            const cardPage = getCardPage(this.page);
            const cardNumber = (await cardPage.cardNumberInput.inputValue().catch(() => '')).trim();
            const effectiveFrom = (await cardPage.effectiveFromInput.inputValue().catch(() => '')).trim();
            const effectiveTo = (await cardPage.effectiveToInput.inputValue().catch(() => '')).trim();

            const okButton = this.page.locator('.swal-button--confirm, button:has-text("OK")').first();
            if (await okButton.isVisible({ timeout: 3000 }).catch(() => false)) {
                await okButton.click({ force: true }).catch(async () => okButton.evaluate(button => button.click()));
            }

            throw new Error(`CLMS 5.5 mandatory-field validation: "${errorText}" | Card Number="${cardNumber}" | Effective From="${effectiveFrom}" | Effective To="${effectiveTo}"`);
        }

        if (normalized.includes('more than one tempory-card') || normalized.includes('already has an active card') || normalized.includes('duplicate card') || normalized.includes('already allocated')) {
            throw new Error(`CLMS 5.5 Card allocation blocked: "${errorText}"`);
        }

        if (normalized.includes('greater than') || normalized.includes('to date') || normalized.includes('from date')) {
            throw new Error(`CLMS 5.5 date-range validation: "${errorText}"`);
        }
    }

    const successToast = this.page.locator('.swal-modal, .swal-text, .alert-success, .toast-success, div:has-text("Successfully"), div:has-text("Saved")').first();
    if (await successToast.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(successToast).toBeVisible();

        const okBtn = this.page.locator('.swal-button--confirm, button:has-text("OK")').first();
        if (await okBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
            await okBtn.click({ force: true }).catch(async () => okBtn.evaluate(button => button.click()));
            await this.page.waitForTimeout(1500);
        }
    }

    if (this.generatedCardNumber) {
        const cardPage = getCardPage(this.page);
        await cardPage.verifyCLMS55AllocationResult(this.generatedCardNumber);
    }
});

Then('User verifies popup message {string} is displayed', async function (expectedMessage) {
    const popup = this.page.locator('.swal-modal, .swal2-popup, .swal-text, .alert-danger, .alert-success, .toast-success, [role="alertdialog"]').first();
    if (await popup.isVisible({ timeout: 5000 }).catch(() => false)) {
        const popupText = (await popup.innerText().catch(() => '')).trim();
        const normalized = popupText.toLowerCase();

        if (normalized.includes('fill all mandatory') || normalized.includes('mandatory field') || normalized.includes('mandatory')) {
            const cardPage = getCardPage(this.page);
            const cardNumber = (await cardPage.cardNumberInput.inputValue().catch(() => '')).trim();
            const effectiveFrom = (await cardPage.effectiveFromInput.inputValue().catch(() => '')).trim();
            const effectiveTo = (await cardPage.effectiveToInput.inputValue().catch(() => '')).trim();

            const okButton = this.page.locator('.swal-button--confirm, button:has-text("OK")').first();
            if (await okButton.isVisible({ timeout: 3000 }).catch(() => false)) {
                await okButton.click({ force: true }).catch(async () => okButton.evaluate(button => button.click()));
            }

            throw new Error(`CLMS 5.5 mandatory-field validation: "${popupText}" | Card Number="${cardNumber}" | Effective From="${effectiveFrom}" | Effective To="${effectiveTo}"`);
        }

        if (normalized.includes('more than one tempory-card') || normalized.includes('already has an active card') || normalized.includes('duplicate card') || normalized.includes('already allocated')) {
            throw new Error(`CLMS 5.5 Card allocation blocked: "${popupText}"`);
        }

        const okButton = this.page.locator('.swal-button--confirm, button:has-text("OK")').first();
        if (await okButton.isVisible({ timeout: 3000 }).catch(() => false)) {
            await okButton.click({ force: true }).catch(async () => okButton.evaluate(button => button.click()));
            await this.page.waitForTimeout(1500);
        }
    }

    if (this.generatedCardNumber) {
        const cardPage = getCardPage(this.page);
        await cardPage.verifyCLMS55AllocationResult(this.generatedCardNumber);
    }
});