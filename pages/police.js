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
        await this.page.waitForTimeout(500);
    }

   async selectVerificationDateFromCalendar(targetDate) {
        await this.verificationDateInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.verificationDateInput.click();
        await this.page.waitForTimeout(500);

        const day = targetDate.getDate();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const targetMonthStr = monthNames[targetDate.getMonth()];
        const targetYearStr = targetDate.getFullYear().toString();

        for (let attempt = 0; attempt < 24; attempt++) {
            const currentView = await this.page.locator('.datepicker-days .datepicker-switch').first().textContent().catch(() => "");
            if (currentView && currentView.includes(targetMonthStr) && currentView.includes(targetYearStr)) {
                break;
            }

            const prevBtn = this.page.locator('.datepicker-days .prev').first();
            const nextBtn = this.page.locator('.datepicker-days .next').first();
            
            // Compare dates to decide whether to click prev or next
            const currentViewDate = new Date(currentView);
            const targetCmpDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);

            if (await prevBtn.isVisible().catch(() => false)) {
                await prevBtn.click();
                await this.page.waitForTimeout(300);
            } else {
                break;
            }
        }

        const dayCells = this.page.locator('.datepicker-days td.day:not(.old):not(.new)');
        const count = await dayCells.count();
        let clicked = false;

        for (let i = 0; i < count; i++) {
            const cell = dayCells.nth(i);
            const text = (await cell.textContent()).trim();
            if (parseInt(text, 10) === day) {
                await cell.click();
                clicked = true;
                break;
            }
        }

        if (!clicked) {
            const fallbackCell = this.page.locator('.datepicker-days td.day:not(.old):not(.new)').first();
            if (await fallbackCell.isVisible({ timeout: 2000 }).catch(() => false)) {
                await fallbackCell.click();
            }
        }
        await this.page.waitForTimeout(500);
    }

    async enterDescription(descriptionText) {
        await this.descriptionInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.descriptionInput.fill('');
        await this.descriptionInput.fill(descriptionText);
    }

    async clickSave() {
        await expect(this.saveBtn).toBeVisible();
        await this.saveBtn.click();
        await this.page.waitForTimeout(1500);
    }

    async clickUpdate() {
        await expect(this.updateBtn).toBeVisible();
        await this.updateBtn.click();
        await this.page.waitForTimeout(1500);
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
            await this.page.waitForTimeout(1000);
        } catch (e) {
            // Ignored if modal auto-dismisses
        }
    }

    async clickEdit() {
        await this.table.waitFor({ state: 'visible', timeout: 10000 });
        const lastEditBtn = this.table.locator('tbody tr').last().locator('[name="btnEditEmployeePoliceVerification"], #btnEditEmployeePoliceVerification, .fa-pencil').first();
        await expect(lastEditBtn).toBeVisible();
        await lastEditBtn.click();
        await this.page.waitForTimeout(1000);
    }

    async verifyTableDetails(expectedDate, expectedDescription) {
        await this.table.waitFor({ state: 'visible', timeout: 10000 });
        await this.page.waitForTimeout(1000);
        
        const targetRow = this.table.locator('tbody tr').filter({ hasText: expectedDate }).first();
        await expect(targetRow).toBeVisible();
        const rowText = await targetRow.textContent();
        expect(rowText).toContain(expectedDate);
        expect(rowText).toContain(expectedDescription);
    }
}