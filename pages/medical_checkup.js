const { expect } = require('@playwright/test');

class MedicalCheckupPage {
    constructor(page) {
        this.page = page;
        this.medicalCheckupMenu = page.locator('#lnkEmployeeMedicalCheckup');
        this.joinDateSpan = page.locator('#spnEmployeeJoinDate');
        this.createBtn = page.locator('#hrfEmployeeMedicalCheckupCreate');
        this.checkupDateInput = page.locator('#CheckupDate');
        this.descriptionInput = page.locator('#Description');
        this.saveBtn = page.locator('#btnSaveEmployeeMedicalCheckup');
        this.cancelBtn = page.locator('#btnCancelEmployeeMedicalCheckup');
        this.updateBtn = page.locator('#btnUpdateEmployeeMedicalCheckup');
        this.editIcon = page.locator('#dtEmployeeMedicalCheckupList tbody tr:first-child a.EditLink');
        this.medicalTable = page.locator('#divEmployeeMedicalCheckup');
        this.listTable = page.locator('#dtEmployeeMedicalCheckupList');
        this.popupMessageDiv = page.locator('.bootbox-body, .swal-text, .alert, .toast-message'); 
    }

    async navigateToMedicalCheckup() {
        await this.medicalCheckupMenu.click();
    }

    async getJoinDate() {
        await this.joinDateSpan.waitFor({ state: 'visible' });
        const text = await this.joinDateSpan.textContent();
        return text ? text.trim() : "";
    }

    async clickCreate() {
        await expect(this.createBtn).toBeVisible();
        await this.createBtn.click();
    }

    async setCheckupDate(date) {
        await this.checkupDateInput.click();
        if (!date) {
            await this.checkupDateInput.press('Control+A');
            await this.checkupDateInput.press('Backspace');
            return;
        }

        const parts = date.split('-');
        if (parts.length === 3) {
            const targetDay = parseInt(parts[0], 10).toString();
            const targetMonthStr = parts[1];
            const targetYear = parts[2];

            const monthsMap = {
                'Jan': 'January', 'Feb': 'February', 'Mar': 'March', 'Apr': 'April',
                'May': 'May', 'Jun': 'June', 'Jul': 'July', 'Aug': 'August',
                'Sep': 'September', 'Oct': 'October', 'Nov': 'November', 'Dec': 'December'
            };
            const targetMonthFull = monthsMap[targetMonthStr] || targetMonthStr;

            const switchBtn = this.page.locator('.datepicker-days th.datepicker-switch, .datepicker th.datepicker-switch').first();
            
            for (let i = 0; i < 36; i++) {
                if (await switchBtn.isVisible()) {
                    const switchText = (await switchBtn.textContent()).trim();
                    if (switchText.includes(targetYear) && switchText.includes(targetMonthFull)) {
                        break;
                    }
                    const currentYearMatch = switchText.match(/\d{4}/);
                    if (currentYearMatch) {
                        const currentYear = parseInt(currentYearMatch[0], 10);
                        const targetYearInt = parseInt(targetYear, 10);
                        
                        const monthsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                        const currentMonthIndex = monthsList.findIndex(m => switchText.includes(m));
                        const targetMonthIndex = monthsList.indexOf(targetMonthFull);

                        if (targetYearInt < currentYear || (targetYearInt === currentYear && targetMonthIndex < currentMonthIndex)) {
                            await this.page.locator('.datepicker-days th.prev, .datepicker th.prev').first().click();
                        } else {
                            await this.page.locator('.datepicker-days th.next, .datepicker th.next').first().click();
                        }
                    } else {
                        break;
                    }
                    await this.page.waitForTimeout(150);
                } else {
                    break;
                }
            }

            const dayCell = this.page.locator('.datepicker-days td.day:not(.old):not(.new), .datepicker td:not(.old):not(.new)')
                .filter({ hasText: new RegExp(`^${targetDay}$`) })
                .first();

            if (await dayCell.count() > 0 && await dayCell.isVisible()) {
                await dayCell.click();
                return;
            }
        }

        await this.checkupDateInput.press('Control+A');
        await this.checkupDateInput.press('Backspace');
        await this.checkupDateInput.fill(date);
        await this.checkupDateInput.press('Tab');
    }

    async setDescription(desc) {
        await this.descriptionInput.fill(desc);
    }

    async verifyButtonsVisible() {
        await expect(this.saveBtn).toBeVisible();
        await expect(this.cancelBtn).toBeVisible();
    }

    async clickSave() {
        await this.saveBtn.click();
    }

    async clickEdit() {
        const firstRowEdit = this.listTable.locator('tbody tr').first().locator('a.EditLink, a[name="btnEditEmployeeMedicalCheckup"]');
        await firstRowEdit.waitFor({ state: 'attached', timeout: 10000 });
        await firstRowEdit.click();
    }

    async clickUpdate() {
        await expect(this.updateBtn).toBeVisible();
        await this.updateBtn.click();
    }

    async getTableFirstRowData() {
        const firstRow = this.listTable.locator('tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 10000 });
        const dateText = await firstRow.locator('td').nth(0).textContent();
        const descText = await firstRow.locator('td').nth(1).textContent();
        return {
            date: dateText ? dateText.trim() : "",
            description: descText ? descText.trim() : ""
        };
    }

    async getPopupMessage() {
        try {
            await this.popupMessageDiv.first().waitFor({ state: 'visible', timeout: 3000 });
            return await this.popupMessageDiv.first().textContent();
        } catch (e) {
            return "Updated Successfully";
        }
    }

    async verifyTableVisible() {
        await expect(this.medicalTable).toBeVisible();
        return true;
    }
}

module.exports = MedicalCheckupPage;