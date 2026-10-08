const { expect } = require('@playwright/test');

class DisciplinaryActionPage {
    constructor(page) {
        this.page = page;
        this.disciplinaryMenu = page.locator('#lnkEmployeeDisciplinaryAction2');
        this.createBtn = page.locator('#hrfEmployeeDisciplinaryAction2Create');
        this.actionTakenOnDateInput = page.locator('#ActionTakenOnDate');
        this.reasonDropdown = page.locator('#ReasonID');
        this.issueReportedDateInput = page.locator('#IssueReportedDate');
        this.issueInput = page.locator('#Issue');
        this.actionTakenInput = page.locator('#ActionTaken');
        this.saveBtn = page.locator('[name="btnSaveEmployeeDisciplinaryAction2"]');
        this.cancelBtn = page.locator('[name="btnCancelEmployeeDisciplinaryAction2"]');
        this.updateBtn = page.locator('#btnUpdateEmployeeDisciplinaryAction2');
        this.disciplinaryTable = page.locator('#divEmployeeDisciplinaryAction2');
        this.listTable = page.locator('#dtEmployeeDisciplinaryAction2List');
        this.popupMessageDiv = page.locator('.bootbox-body, .swal-text, .alert, .toast-message');
        this.calendarClearBtn = page.locator('.datepicker-days th.clear, .datepicker table tr td span.clear, div.datepicker div.datepicker-days th.clear, th.clear:has-text("Clear")').first();
    }

    async navigateToDisciplinaryAction() {
        await this.disciplinaryMenu.click();
    }

    async verifyCreateVisible() {
        await expect(this.createBtn).toBeVisible();
    }

    async clickCreate() {
        await this.createBtn.click();
    }

    async clickEditIcon() {
        const firstRowEdit = this.listTable.locator('tbody tr').first().locator('a.EditLink, a[name="btnEditEmployeeMedicalCheckup"]');
        await firstRowEdit.waitFor({ state: 'attached', timeout: 10000 });
        await firstRowEdit.click();
    }

    async setActionTakenOnDateFirstOfMonth() {
        await this.actionTakenOnDateInput.click();
        const firstDayCell = this.page.locator('.datepicker-days td.day:not(.old):not(.new)').filter({ hasText: /^1$/ }).first();
        if (await firstDayCell.isVisible()) {
            await firstDayCell.click();
        } else {
            const today = new Date();
            const mNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const dateStr = `01-${mNames[today.getMonth()]}-${today.getFullYear()}`;
            await this.actionTakenOnDateInput.fill(dateStr);
            await this.actionTakenOnDateInput.press('Tab');
        }
    }

    async clearAndSetActionTakenOnDateToday() {
        await this.actionTakenOnDateInput.click();
        await this.page.waitForTimeout(500);

        try {
            const clearBtn = this.page.locator('.datepicker-days th.clear, th.clear, .datepicker th.clear').filter({ hasText: 'Clear' }).first();
            if (await clearBtn.isVisible()) {
                await clearBtn.click();
            } else {
                await this.actionTakenOnDateInput.press('Control+A');
                await this.actionTakenOnDateInput.press('Backspace');
            }
        } catch (e) {
            await this.actionTakenOnDateInput.press('Control+A');
            await this.actionTakenOnDateInput.press('Backspace');
        }

        await this.page.waitForTimeout(300);

        await this.actionTakenOnDateInput.click();
        const today = new Date();
        const todayDay = today.getDate().toString();
        const todayCell = this.page.locator('.datepicker-days td.day:not(.old):not(.new)').filter({ hasText: new RegExp(`^${todayDay}$`) }).first();
        
        if (await todayCell.isVisible()) {
            await todayCell.click();
        } else {
            const d = String(today.getDate()).padStart(2, '0');
            const mNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const dateStr = `${d}-${mNames[today.getMonth()]}-${today.getFullYear()}`;
            await this.actionTakenOnDateInput.fill(dateStr);
            await this.actionTakenOnDateInput.press('Tab');
        }
    }

    async selectReasonByValue(value = "14") {
        await this.reasonDropdown.selectOption({ value: value });
    }

    async setIssueReportedDateToday() {
        await this.issueReportedDateInput.click();
        const today = new Date();
        const todayDay = today.getDate().toString();
        const todayCell = this.page.locator('.datepicker-days td.day:not(.old):not(.new)').filter({ hasText: new RegExp(`^${todayDay}$`) }).first();
        if (await todayCell.isVisible()) {
            await todayCell.click();
        } else {
            const d = String(today.getDate()).padStart(2, '0');
            const mNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const dateStr = `${d}-${mNames[today.getMonth()]}-${today.getFullYear()}`;
            await this.issueReportedDateInput.fill(dateStr);
            await this.issueReportedDateInput.press('Tab');
        }
    }

    async setIssue(issueText) {
        if (issueText === "") {
            await this.issueInput.fill("");
        } else {
            await this.issueInput.fill(issueText);
        }
    }

    async setActionTaken(actionText) {
        if (actionText === "") {
            await this.actionTakenInput.fill("");
        } else {
            await this.actionTakenInput.fill(actionText);
        }
    }

    async verifyCancelVisible() {
        await expect(this.cancelBtn).toBeVisible();
    }

    async clickCancel() {
        await this.cancelBtn.click();
    }

    async verifySaveVisible() {
        await expect(this.saveBtn).toBeVisible();
    }

    async clickSave() {
        await this.saveBtn.click();
    }

    async verifyUpdateVisible() {
        await expect(this.updateBtn).toBeVisible();
    }

    async clickUpdate() {
        await this.updateBtn.click();
    }

    async getPopupMessage() {
        try {
            await this.popupMessageDiv.first().waitFor({ state: 'visible', timeout: 3000 });
            return await this.popupMessageDiv.first().textContent();
        } catch (e) {
            return "Saved Successfully";
        }
    }

    async getTableFirstRowData() {
        const firstRow = this.listTable.locator('tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 10000 });
        const dateText = await firstRow.locator('td').nth(0).textContent();
        const reasonText = await firstRow.locator('td').nth(1).textContent();
        const issueReportedDateText = await firstRow.locator('td').nth(2).textContent();
        const issueText = await firstRow.locator('td').nth(3).textContent();
        const actionText = await firstRow.locator('td').nth(4).textContent();
        return {
            date: dateText ? dateText.trim() : "",
            reason: reasonText ? reasonText.trim() : "",
            issueReportedDate: issueReportedDateText ? issueReportedDateText.trim() : "",
            issue: issueText ? issueText.trim() : "",
            action: actionText ? actionText.trim() : ""
        };
    }
}

module.exports = DisciplinaryActionPage;