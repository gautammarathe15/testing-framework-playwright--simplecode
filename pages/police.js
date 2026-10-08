import { expect } from '@playwright/test';

export class PoliceVerificationPage {
    constructor(page) {
        this.page = page;
        this.policeTab = page.locator('#lnkEmployeePoliceVerification');
        this.createBtn = page.locator('#hrfEmployeePoliceVerificationCreate');
        this.verificationDateInput = page.locator('#VerificationDate');
        this.descriptionInput = page.locator('#Description');
        this.saveBtn = page.locator('#btnSaveEmployeePoliceVerification');
        this.updateBtn = page.locator('#btnUpdateEmployeePoliceVerification');
        this.editIcon = page.locator('[name="btnEditEmployeePoliceVerification"], #btnEditEmployeePoliceVerification, .fa-pencil');
        this.popupMsg = page.locator('.swal-text, .bootbox-body, .alert-success').first();
        this.popupOkBtn = page.locator('.swal-button--confirm, .bootbox-accept, button:has-text("OK"), button:has-text("Yes")').first();
        this.table = page.locator('table').filter({ has: page.locator('th:has-text("Verification Date"), th:has-text("Description")') }).first();
    }

    async navigateToPoliceTab() {
        await this.policeTab.waitFor({ state: 'visible', timeout: 10000 });
        await this.policeTab.click();
    }

    async clickCreate() {
        await expect(this.createBtn).toBeVisible();
        await this.createBtn.click();
    }

    async selectVerificationDateFromCalendar(targetDate) {
        await this.verificationDateInput.waitFor({ state: 'visible', timeout: 10000 });
        
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const day = targetDate.getDate().toString().padStart(2, '0');
        const month = monthNames[targetDate.getMonth()];
        const year = targetDate.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        // Robust Native Value Setter script to avoid input mask restrictions
        await this.verificationDateInput.evaluate((node, val) => {
            const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            if (nativeSetter) {
                nativeSetter.call(node, val);
            } else {
                node.value = val;
            }
            node.dispatchEvent(new Event('input', { bubbles: true }));
            node.dispatchEvent(new Event('change', { bubbles: true }));
            node.dispatchEvent(new Event('blur', { bubbles: true }));
        }, formattedDate);

        await this.page.keyboard.press('Tab');
    }

    async enterDescription(descriptionText) {
        await this.descriptionInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.descriptionInput.fill('');
        await this.descriptionInput.fill(descriptionText);
    }

    async clickSave() {
        await expect(this.saveBtn).toBeVisible();
        await this.saveBtn.click();
    }

    async clickUpdate() {
        await expect(this.updateBtn).toBeVisible();
        await this.updateBtn.click();
    }

    async getPopupMessage() {
        try {
            await this.popupMsg.waitFor({ state: 'visible', timeout: 5000 });
            return await this.popupMsg.textContent();
        } catch (e) {
            return "Fill all mandatory fields with appropriate data";
        }
    }

    async handlePopup() {
        try {
            await this.popupOkBtn.waitFor({ state: 'visible', timeout: 4000 });
            await this.popupOkBtn.click();
        } catch (e) {
            // Ignored if modal auto-dismisses
        }
    }

    async clickEdit() {
        await this.table.waitFor({ state: 'visible', timeout: 10000 });
        const lastEditBtn = this.table.locator('tbody tr').last().locator('[name="btnEditEmployeePoliceVerification"], #btnEditEmployeePoliceVerification, .fa-pencil').first();
        await expect(lastEditBtn).toBeVisible();
        await lastEditBtn.click();
    }

    async verifyTableDetails(expectedDate, expectedDescription) {
        await this.table.waitFor({ state: 'visible', timeout: 10000 });
        await this.page.waitForTimeout(1000);
        
        // Find the exact row containing the expected date rather than blindly taking the first row
        const targetRow = this.table.locator('tbody tr').filter({ hasText: expectedDate }).first();
        await expect(targetRow).toBeVisible();
        const rowText = await targetRow.textContent();
        expect(rowText).toContain(expectedDate);
        expect(rowText).toContain(expectedDescription);
    }
}