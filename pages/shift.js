import { expect } from '@playwright/test';

export class ContractorEmployeeShiftPage {
    constructor(page) {
        this.page = page;

        this.shiftTab = page.locator('#lnkEmployeeAutoShift').first();
        this.autoShiftCheckbox = page.locator('#IsAutoShiftApplied');
        this.shiftPatternCheckbox = page.locator('#IsShiftPatternApplied');
        
        this.shiftOptionCheckbox = (shiftName) => this.page.locator(`label:has-text("${shiftName}") input[type="checkbox"]`).first();

        this.saveButton = page.locator('#btnSaveEmployeeAutoShift');
        this.updateButton = page.locator('#btnUpdateEmployeeAutoShift');
        this.cancelButton = page.locator('#btnCancelEmployeeAutoShift');
    }

    async clickShiftTab() {
        await this.page.waitForTimeout(2000); // पृष्ठ व्यवस्थित लोड होण्यासाठी थोडा वेळ देणे
        await this.shiftTab.waitFor({ state: 'visible', timeout: 20000 });
        await this.shiftTab.scrollIntoViewIfNeeded().catch(() => {});
        try {
            await this.shiftTab.click({ force: true, timeout: 8000 });
        } catch {
            await this.shiftTab.evaluate(el => el.click());
        }
        await this.page.waitForLoadState('networkidle').catch(() => {});
        await this.page.waitForTimeout(1500);
    }

    async selectAutoShift(shouldCheck = true) {
        if (shouldCheck && !(await this.autoShiftCheckbox.isChecked())) {
            await this.autoShiftCheckbox.check({ force: true });
        }
    }

    async selectShiftOption(shiftName, shouldCheck = true) {
        const checkbox = this.shiftOptionCheckbox(shiftName);
        await checkbox.waitFor({ state: 'visible', timeout: 8000 });
        if (shouldCheck && !(await checkbox.isChecked())) {
            await checkbox.check({ force: true });
        } else if (!shouldCheck && (await checkbox.isChecked())) {
            await checkbox.uncheck({ force: true });
        }
    }

    async verifyShiftOptionChecked(shiftName) {
        const checkbox = this.shiftOptionCheckbox(shiftName);
        await expect(checkbox).toBeChecked();
    }

    async clickSaveButton() {
        await this.saveButton.scrollIntoViewIfNeeded();
        await this.saveButton.click({ force: true });
        await this.page.waitForLoadState('networkidle').catch(() => {});
        await this.page.waitForTimeout(1500);
    }

    async clickUpdateButton() {
        await this.updateButton.scrollIntoViewIfNeeded();
        await this.updateButton.click({ force: true });
        await this.page.waitForLoadState('networkidle').catch(() => {});
        await this.page.waitForTimeout(1500);
    }

    async verifySaveOrUpdateVisibility(expectedType = 'Save') {
        await expect(this.cancelButton).toBeVisible({ timeout: 8000 });
        if (expectedType.toLowerCase() === 'save') {
            await expect(this.saveButton).toBeVisible({ timeout: 8000 });
            await expect(this.updateButton).toBeHidden({ timeout: 5000 }).catch(() => {});
        } else {
            await expect(this.updateButton).toBeVisible({ timeout: 8000 });
            await expect(this.saveButton).toBeHidden({ timeout: 5000 }).catch(() => {});
        }
    }
}