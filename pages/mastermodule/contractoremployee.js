import { expect } from '@playwright/test';

export class ContractorEmployeePage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        // Main UI Locators
        this.createButton = this.page.locator('#hrfEmployeeCreate');
        this.uploadButton = this.page.locator('#btnExport');

        // Pop-up Locators
        this.closeSymbol = this.page.getByRole('button', { name: 'Close' });
        this.closeButton = this.page.getByRole('link', { name: 'Close' });
        this.aadhaarInput = this.page.getByRole('textbox', { name: 'Aadhaar Card No*' });
        this.verifyButton = this.page.getByRole('link', { name: 'Verify' });

        // Post-Verify Flexible Locators
        this.submitButton = this.page.locator('a, button, input').filter({ hasText: /^Submit$/i }).first();
        this.skipVerificationButton = this.page.locator('a, button, input').filter({ hasText: /Skip Verification/i }).first();

        // Mandatory Dropdown Locators List
        this.mandatoryDropdownsList = [
            this.page.getByLabel('Subsidiary*'),
            this.page.getByLabel('Division*'),
            this.page.getByLabel('Department*'),
            this.page.getByLabel('Category*'),
            this.page.getByLabel('Grade*'),
            this.page.getByLabel('Designation*'),
            this.page.getByLabel('Location*'),
            this.page.getByLabel('Skilled Level*'),
            this.page.getByLabel('Contractor*')
        ];

        // Calendar Locators
        this.contractFromInput = this.page.locator('input[name*="ContractFrom"], input[id*="ContractFrom"], #dtpContractFrom').first();
        this.contractToInput = this.page.locator('input[name*="ContractTo"], input[id*="ContractTo"], #dtpContractTo').first();
        this.contractDaysInput = this.page.locator('input[name*="ContractPeriod"], input[id*="ContractPeriod"], #txtContractDays').first();

        this.calendarWidget = this.page.locator('.datepicker, .bs-datepicker-container, .ui-datepicker').first();
        this.calendarHeader = this.page.locator('.datepicker-switch, .bs-datepicker-head button.current, .ui-datepicker-title').first();
        this.prevMonthBtn = this.page.locator('.datepicker-days .prev, button.previous, .ui-datepicker-prev').first();
        this.nextMonthBtn = this.page.locator('.datepicker-days .next, button.next, .ui-datepicker-next').first();
    }

    async searchByAadhaarNumber(identityNumber) {
        await this.page.waitForLoadState('domcontentloaded');

        if (!identityNumber || identityNumber === 'undefined') {
            throw new Error("❌ Grid search failed: Provided identityNumber is undefined or empty!");
        }

        const cleanId = String(identityNumber).trim();

        const searchInput = this.page.locator('#hsAadharCardNo');
        const searchIcon = this.page.locator('img.headerSearchIcon').first();
        const searchBtn = this.page.locator('button[name="AadharCardNo"]').first();

        console.log("🔍 Checking grid search input field visibility...");

        if (!(await searchInput.isVisible({ timeout: 2000 }).catch(() => false))) {
            if (await searchIcon.isVisible({ timeout: 2000 }).catch(() => false)) {
                console.log("👉 Search input is hidden. Clicking on header search icon to expand...");
                await searchIcon.click();
                await this.page.waitForTimeout(300);
            }
        }

        await searchInput.waitFor({ state: 'visible', timeout: 10000 });
        await searchInput.clear();
        await searchInput.fill(cleanId);
        await searchInput.dispatchEvent('input');
        await searchInput.dispatchEvent('keyup');

        console.log(`✍️ Entered identity number into grid search input.`);

        if (await searchBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await searchBtn.click();
        } else {
            await searchInput.press('Enter');
        }

        await this.page.waitForLoadState('networkidle').catch(() => {});
    }

    async verifyAadhaarInGrid(expectedIdentity) {
        if (!expectedIdentity || expectedIdentity === 'undefined') {
            throw new Error("❌ Cannot verify grid: Provided expectedIdentity is undefined!");
        }

        console.log(`🔍 Verifying record presence in grid for ID...`);
        
        await this.searchByAadhaarNumber(expectedIdentity);

        const lastFourDigits = String(expectedIdentity).trim().slice(-4);
        console.log(`🔎 Searching table row with masked identity ending in: ${lastFourDigits}`);

        const matchedRow = this.page.locator('table tbody tr')
            .filter({ hasText: lastFourDigits })
            .first();

        try {
            await matchedRow.waitFor({ state: 'visible', timeout: 15000 });
            console.log(`✅ Record verified successfully in grid with masked identity ending in ${lastFourDigits}.`);
        } catch (error) {
            throw new Error(`❌ Record with identity ending in ${lastFourDigits} was not found in table grid!`);
        }
    }

    async verifyCreateAndUploadOptionsVisible() {
        await this.createButton.waitFor({ state: 'visible', timeout: 20000 });
        await expect(this.createButton).toBeVisible();
        await this.uploadButton.waitFor({ state: 'visible', timeout: 20000 });
        await expect(this.uploadButton).toBeVisible();
    }

    async clickCreateButton() {
        await this.createButton.waitFor({ state: 'visible', timeout: 20000 });
        await this.createButton.click();
        console.log("✅ Clicked on '+Create' button.");
    }

    async clickCloseSymbol() {
        await this.closeSymbol.waitFor({ state: 'visible', timeout: 10000 });
        await this.closeSymbol.click();
        console.log("✅ Clicked on Close (x) symbol.");
    }

    async clickCloseButton() {
        await this.closeButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.closeButton.click();
        console.log("✅ Clicked on Close button.");
    }

    async verifyAadhaarInputVisible() {
        await this.aadhaarInput.waitFor({ state: 'visible', timeout: 10000 });
        await expect(this.aadhaarInput).toBeVisible();
        console.log("✅ Card input field is visible.");
    }

    async enterAadhaarNumber(aadhaarNo) {
        await this.aadhaarInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.aadhaarInput.clear();
        await this.aadhaarInput.fill(aadhaarNo);
        console.log(`✅ Entered identity number into text field.`);
    }

    async clickVerifyLinkIfVisible() {
        await this.verifyButton.waitFor({ state: 'visible', timeout: 10000 });
        if (await this.verifyButton.isVisible()) {
            await this.verifyButton.click();
            console.log("✅ Clicked on Verify link.");
        }
    }

    async verifyButtonsAndClickSkipVerification() {
        console.log("🔍 Checking visibility of 'Submit' and 'Skip Verification' buttons...");
        await this.skipVerificationButton.waitFor({ state: 'visible', timeout: 15000 });
        await this.skipVerificationButton.scrollIntoViewIfNeeded();
        await expect(this.skipVerificationButton).toBeVisible();

        try {
            await this.submitButton.waitFor({ state: 'visible', timeout: 5000 });
            await expect(this.submitButton).toBeVisible();
        } catch (e) {
            console.log("⚠️ Submit button did not appear within expected window, proceeding with Skip Verification.");
        }

        try {
            await this.skipVerificationButton.click({ timeout: 5000 });
        } catch (e) {
            await this.skipVerificationButton.click({ force: true });
        }
    }

    async selectMandatoryDropdowns() {
        console.log("🔽 Selecting options for all mandatory dropdowns...");
        for (const dropdown of this.mandatoryDropdownsList) {
            if (await dropdown.isVisible().catch(() => false)) {
                await dropdown.click();
                await this.page.waitForTimeout(200);

                const tagName = await dropdown.evaluate(el => el.tagName.toLowerCase()).catch(() => '');
                if (tagName === 'select') {
                    await dropdown.selectOption({ index: 1 });
                } else {
                    const firstOption = this.page.locator('.dropdown-menu option, [role="option"], ul.select2-results__options li').first();
                    if (await firstOption.isVisible().catch(() => false)) {
                        await firstOption.click();
                    } else {
                        await dropdown.press('ArrowDown');
                        await dropdown.press('Enter');
                    }
                }
                await this.page.waitForTimeout(200);
            }
        }
    }

    async scrollToSaveAndClick() {
        const okButton = this.page.locator('.swal-button--confirm, button:has-text("OK")').first();
        if (await okButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await okButton.click();
            await this.page.waitForTimeout(300);
        }

        const saveBtn = this.page.locator('#btnSave, button:has-text("Save")').first();
        await saveBtn.scrollIntoViewIfNeeded();
        await saveBtn.click({ force: true });
        console.log("✅ Clicked on Save button.");
    }

    async verifyCreateButtonVisible() {
        await expect(this.createButton).toBeVisible();
    }

    async verifyUploadButtonVisible() {
        await expect(this.uploadButton).toBeVisible();
    }

    async openContractFromCalendar() {
        const inputLocator = this.page.locator('#Employee_JoinDate, input[name*="ContractFrom"], #dtpContractFrom').first();
        await inputLocator.click();
    }

    async verifyContractCalendarVisible() {
        await expect(this.calendarWidget).toBeVisible({ timeout: 7100 });
    }

    async verifyContractCalendarHeader() {
        await this.calendarHeader.waitFor({ state: 'visible' });
        const headerText = await this.calendarHeader.textContent();
        return headerText.trim();
    }

    async clickContractPrevMonth() {
        await this.prevMonthBtn.click();
    }

    async clickContractNextMonth() {
        await this.nextMonthBtn.click();
    }

    async fillContractFromDate(dateStr) {
        await this.contractFromInput.fill(dateStr);
        await this.contractFromInput.press('Tab');
    }

    async fillContractDays(days) {
        await this.contractDaysInput.fill(days);
        await this.contractDaysInput.press('Tab');
    }

    async verifyContractToIsReadonly() {
        await expect(this.contractToInput).toHaveAttribute('readonly');
    }

    async verifyAutoCalculatedContractToDate(expectedDate) {
        await expect(this.contractToInput).toHaveValue(expectedDate);
    }
} 