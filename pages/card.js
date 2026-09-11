import { expect } from '@playwright/test';

export class ContractorEmployeeCardPage {
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
        const gridSearchIcon = this.page.locator('th.w-172 img.headerSearchIcon, img.headerSearchIcon').first();

        try {
            await gridSearchIcon.waitFor({ state: 'visible', timeout: 5000 });
            await gridSearchIcon.click({ force: true });
        } catch (e) {
            try {
                await this.page.locator('th.w-172').click({ force: true });
            } catch (err) {}
        }

        const gridSearchInput = this.page.locator('.input-group.hsHide input, th.w-172 input, input.form-control').last();
        await gridSearchInput.waitFor({ state: 'visible', timeout: 15000 });
        await gridSearchInput.click({ force: true });
        await gridSearchInput.clear();
        await gridSearchInput.fill(searchTerm);
        await gridSearchInput.press('Enter');
        await this.page.waitForTimeout(3000);
    }

    async verifyAllocateButtonVisible() {
        await this.page.waitForTimeout(3000);
        await this.allocateTempCardBtn.waitFor({ state: 'visible', timeout: 20000 });
        await expect(this.allocateTempCardBtn).toBeVisible();
    }

    async verifyCardNumberFieldVisible() {
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
        await this.cardNumberInput.fill('');
        await this.cardNumberInput.fill(dynamicCardNum);
        
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

        const today = new Date().toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
        }).replace(/ /g, '-'); 
        
        await this.effectiveFromInput.fill('');
        await this.effectiveFromInput.fill(today);
        
        await this.effectiveFromInput.evaluate((node, val) => {
            node.value = val;
            node.dispatchEvent(new Event('input', { bubbles: true }));
            node.dispatchEvent(new Event('change', { bubbles: true }));
            node.dispatchEvent(new Event('blur', { bubbles: true }));
        }, today);

        await this.page.keyboard.press('Tab');
        await this.page.waitForTimeout(1000);
    }

    async enterInvalidDateRange() {
        const swalOverlay = this.page.locator('.swal-overlay, .modal-backdrop').first();
        if (await swalOverlay.isVisible().catch(() => false)) {
            await this.page.keyboard.press('Escape');
        }

        await this.effectiveFromInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.effectiveFromInput.fill('15-Aug-2026');
        await this.effectiveToInput.fill('10-Aug-2026');
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
        
        await this.page.waitForTimeout(2000);
    }

    async clickAllocateTemporaryCard() {
        const swalOverlay = this.page.locator('.swal-overlay').first();
        if (await swalOverlay.isVisible().catch(() => false)) {
            await this.page.keyboard.press('Escape');
            await this.page.waitForTimeout(1000);
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
}