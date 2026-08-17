/**
 * --------------------------------------------------------------------------
 * CLMS Master Module - Contractor Employee Page Object Class
 * File: pages/mastermodule/contractorEmployee.js
 * --------------------------------------------------------------------------
 */

const { expect } = require('@playwright/test');

class ContractorEmployeePage {
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

        // Post-Verify Flexible Locators (Matches <a>, <button>, or <input>)
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

        // 🎯 Calendar Locators (Constructor मध्ये जोडा)
        this.contractFromInput = this.page.locator('input[name*="ContractFrom"], input[id*="ContractFrom"], #dtpContractFrom').first();
        this.contractToInput = this.page.locator('input[name*="ContractTo"], input[id*="ContractTo"], #dtpContractTo').first();
        this.contractDaysInput = this.page.locator('input[name*="ContractPeriod"], input[id*="ContractPeriod"], #txtContractDays').first();

        // 🗓️ Calendar Locators
        this.calendarWidget = this.page.locator('.datepicker, .bs-datepicker-container, .ui-datepicker').first();
        this.calendarHeader = this.page.locator('.datepicker-switch, .bs-datepicker-head button.current, .ui-datepicker-title').first();
        this.prevMonthBtn = this.page.locator('.datepicker-days .prev, button.previous, .ui-datepicker-prev').first();
        this.nextMonthBtn = this.page.locator('.datepicker-days .next, button.next, .ui-datepicker-next').first();

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

    // Pop-up Methods
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
        console.log("✅ Aadhaar Card No input field is visible.");
    }

    /**
     * Enters Aadhaar number dynamically provided by the test scenario
     * @param {string} aadhaarNo - Dynamic input string
     */
    async enterAadhaarNumber(aadhaarNo) {
        await this.aadhaarInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.aadhaarInput.clear();
        await this.aadhaarInput.fill(aadhaarNo);
        console.log(`✅ Entered provided Aadhaar number into text field.`);
    }

    async clickVerifyLinkIfVisible() {
        await this.verifyButton.waitFor({ state: 'visible', timeout: 10000 });
        if (await this.verifyButton.isVisible()) {
            await this.verifyButton.click();
            console.log("✅ Clicked on Verify link.");
        }
    }

    /**
     * Safely verifies visibility of Submit and Skip Verification options, then clicks Skip Verification
     */
    async verifyButtonsAndClickSkipVerification() {
        console.log("🔍 Checking visibility of 'Submit' and 'Skip Verification' buttons...");

        // Wait for Skip Verification button to appear
        await this.skipVerificationButton.waitFor({ state: 'visible', timeout: 15000 });
        await this.skipVerificationButton.scrollIntoViewIfNeeded();
        await expect(this.skipVerificationButton).toBeVisible();

        // Verify Submit button if visible
        try {
            await this.submitButton.waitFor({ state: 'visible', timeout: 5000 });
            await expect(this.submitButton).toBeVisible();
        } catch (e) {
            console.log("⚠️ Submit button did not appear as link/button tag within expected window, proceeding with Skip Verification.");
        }

        console.log("✅ 'Skip Verification' option verified.");
        console.log("👆 Clicking on 'Skip Verification' button...");
        
        try {
            await this.skipVerificationButton.click({ timeout: 5000 });
        } catch (e) {
            console.log("⚠️ Standard click failed on Skip Verification button, applying force click...");
            await this.skipVerificationButton.click({ force: true });
        }
    }

    /**
     * Selects options for all mandatory dropdowns dynamically
     */
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
        console.log("✅ Selected options in all mandatory dropdowns.");
    }

    /**
     * Handles active alert popups, scrolls to Save button, and clicks Save
     */
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

    // --------------------------------------------------------------------------
    // 🗓️ Calendar & Date Methods (Constructor च्या बाहेर क्लासच्या आत जोडा)
    // --------------------------------------------------------------------------

    /**
     * Open Contract From Calendar
     */
    
    async openContractFromCalendar() {

        await this.page.pause();

        const inputLocator = this.page.locator('#Employee_JoinDate, input[name*="ContractFrom"], #dtpContractFrom').first();
        await inputLocator.click();
        //await this.contractFromInput.click();
    }

    /**
     * Verify Calendar is Visible
     */
    async verifyContractCalendarVisible() {
        await expect(this.calendarWidget).toBeVisible({timeout: 7100});
    }

    /**
     * Get and verify Calendar Header text
     */
    async verifyContractCalendarHeader() {
        await this.calendarHeader.waitFor({ state: 'visible' });
        const headerText = await this.calendarHeader.textContent();
        return headerText.trim();
        //return (await this.calendarHeader.textContent()).trim();
    }

    /**
     * Click Previous Month (<<)
     */
    async clickContractPrevMonth() {
        await this.prevMonthBtn.click();
    }

    /**
     * Click Next Month (>>)
     */
    async clickContractNextMonth() {
        await this.nextMonthBtn.click();
    }

    /**
     * Fill Contract From Date directly
     */
    async fillContractFromDate(dateStr) {
        await this.contractFromInput.fill(dateStr);
        await this.contractFromInput.press('Tab');
    }

    /**
     * Fill Contract Period in Days
     */
    async fillContractDays(days) {
        await this.contractDaysInput.fill(days);
        await this.contractDaysInput.press('Tab');
    }

    /**
     * Verify Contract To field is readonly
     */
    async verifyContractToIsReadonly() {
        await expect(this.contractToInput).toHaveAttribute('readonly');
    }

    /**
     * Verify auto-calculated Contract To Date
     */
    async verifyAutoCalculatedContractToDate(expectedDate) {
        await expect(this.contractToInput).toHaveValue(expectedDate);
    }
}

module.exports = { ContractorEmployeePage };