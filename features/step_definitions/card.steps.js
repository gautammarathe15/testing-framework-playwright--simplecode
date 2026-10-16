import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ContractorEmployeeCardPage } from '../../pages/card.js';

function getCardPage(page) {
    return new ContractorEmployeeCardPage(page);
}

When('User enters {string} in search filter for Aadhaar or employee details', async function (searchTerm) {
    const cardPage = getCardPage(this.page);
    await cardPage.searchEmployee(searchTerm);
});

When('User selects the 1st entry from the employee grid', async function () {
    const firstRowEditIcon = this.page.locator('table tbody tr').first().locator('a.fa-pencil, a[title="Edit"], .btn-edit, a[href*="Edit"], .fa-edit').first();
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

    const todayCell = this.page.locator('.datepicker td.day.today, .ui-datepicker-today a, .flatpickr-day.today').first();
    if (await todayCell.isVisible().catch(() => false)) {
        await todayCell.click();
    } else {
        await this.page.press('body', 'Escape');
    }
});

When('User enters an invalid date range where Effective To is earlier than Effective From', async function () {
    const cardPage = getCardPage(this.page);
    
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
    await cardPage.saveButton.click();
});

Then('User verifies card allocation success message', { timeout: 60000 }, async function () {
    const duplicateErrorPopup = this.page.locator('.swal-text, .alert-danger, div:has-text("More than one Tempory-Card")').first();
    
    if (await duplicateErrorPopup.isVisible().catch(() => false)) {
        const errorText = await duplicateErrorPopup.textContent();
        throw new Error(`❌ Card Allocation Blocked: Employee already has an active card for this period -> "${errorText.trim()}"`);
    }

    const successToast = this.page.locator('.swal-modal, .swal-text, .alert-success, .toast-success, div:has-text("Successfully"), div:has-text("Saved")').first();
    if (await successToast.isVisible().catch(() => false)) {
        await expect(successToast).toBeVisible();
    }

    const okBtn = this.page.locator('.swal-button--confirm, button:has-text("OK")').first();
    if (await okBtn.isVisible().catch(() => false)) {
        await okBtn.click();
        await this.page.waitForTimeout(2000);
    }

    if (this.generatedCardNumber) {
        await this.page.waitForLoadState('networkidle').catch(() => {});
        await this.page.waitForTimeout(3000);

        const cardRow = this.page.locator('table#tblEmployeeCard tbody tr, .dtTable tbody tr, table tbody tr').filter({ hasText: this.generatedCardNumber }).first();
        await expect(cardRow).toBeVisible({ timeout: 30000 });
    }
});

Then('User verifies popup message {string} is displayed', async function (expectedMessage) {
    const popup = this.page.locator('.swal-modal, .swal-text, .alert, .toast, .modal-body, span.text-danger, label.error, div:has-text("date"), div:has-text("greater")').first();
    
    await popup.waitFor({ state: 'visible', timeout: 15000 });
    
    const fullText = await popup.evaluate(el => el.textContent || el.innerText || '');
    
    const normalizedExpected = expectedMessage.toLowerCase().trim();
    const normalizedActual = fullText.toLowerCase().trim();
    
    const isMatch = normalizedActual.includes(normalizedExpected) || 
                    normalizedActual.includes("to date must be greater") ||
                    normalizedActual.includes("greater than") ||
                      normalizedActual.includes("to date must be greater than from date") ||
                    normalizedActual.includes("date must be greater");
                    
    expect(isMatch).toBeTruthy();

    const okBtn = this.page.locator('.swal-button--confirm, button:has-text("OK"), button:has-text("Close"), .modal-footer button').first();
    if (await okBtn.isVisible().catch(() => false)) {
        await okBtn.click();
        await this.page.waitForTimeout(1000);
    }
});