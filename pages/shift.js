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

    mapShiftNameForEnvironment(shiftName) {
        if (!this.isCLMS56()) return shiftName;

        const mappedName = {
            'Night Shift': 'Night',
            'Second': 'Morning'
        }[shiftName] || shiftName;

        if (!['Afternoon', 'Morning', 'Night'].includes(mappedName)) {
            throw new Error(`CLMS 5.6 unsupported shift "${shiftName}" -> "${mappedName}". Valid options: Afternoon, Morning, Night.`);
        }
        return mappedName;
    }

    async getExactShiftCheckbox(shiftName) {
        const labels = this.page.locator('label').filter({ has: this.page.locator('input[type="checkbox"]') });
        const count = await labels.count();

        for (let index = 0; index < count; index++) {
            const label = labels.nth(index);
            const text = (await label.innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
            if (text === shiftName) {
                return label.locator('input[type="checkbox"]').first();
            }
        }

        throw new Error(`CLMS 5.6 shift checkbox with exact visible text "${shiftName}" was not found.`);
    }

    async clickShiftTab() {
        await this.page.waitForTimeout(2000);

        if (this.isCLMS56()) {
            await this.page.waitForLoadState('domcontentloaded').catch(() => {});

            const fallbackTabs = [
                this.shiftTab,
                this.page.getByRole('tab', { name: 'Shift', exact: true }),
                this.page.getByText('Shift', { exact: true }).first()
            ];

            for (const tab of fallbackTabs) {
                try {
                    await tab.waitFor({ state: 'visible', timeout: 10000 });
                    await tab.scrollIntoViewIfNeeded().catch(() => {});
                    await tab.click({ force: true, timeout: 8000 }).catch(async () => {
                        await tab.evaluate(el => el.click());
                    });
                    await this.page.waitForLoadState('networkidle').catch(() => {});
                    await this.page.waitForTimeout(1500);
                    console.log('✅ CLMS 5.6 Shift tab opened successfully.');
                    return;
                } catch (error) {
                    console.log(`⚠️ CLMS 5.6 Shift tab locator retry failed: ${error.message}`);
                }
            }

            throw new Error('CLMS 5.6 Shift tab could not be opened after retrying available locators.');
        }

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
        let checkbox;

        if (this.isCLMS56()) {
            const mappedName = this.mapShiftNameForEnvironment(shiftName);
            checkbox = await this.getExactShiftCheckbox(mappedName);
            console.log(`✅ CLMS 5.6 shift mapping: "${shiftName}" -> "${mappedName}"`);
        } else {
            checkbox = this.shiftOptionCheckbox(shiftName);
        }

        await checkbox.waitFor({ state: 'visible', timeout: 8000 });
        if (shouldCheck && !(await checkbox.isChecked())) {
            await checkbox.check({ force: true });
        } else if (!shouldCheck && (await checkbox.isChecked())) {
            await checkbox.uncheck({ force: true });
        }
    }

    async verifyShiftOptionChecked(shiftName) {
        let checkbox;

        if (this.isCLMS56()) {
            const mappedName = this.mapShiftNameForEnvironment(shiftName);
            checkbox = await this.getExactShiftCheckbox(mappedName);
        } else {
            checkbox = this.shiftOptionCheckbox(shiftName);
        }

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

    async selectShiftPattern(shouldCheck = true) {
        if (shouldCheck && !(await this.shiftPatternCheckbox.isChecked())) {
            await this.shiftPatternCheckbox.check({ force: true });
        }
    }

    async verifyShiftPatternChecked() {
        await expect(this.shiftPatternCheckbox).toBeChecked();
    }
}








