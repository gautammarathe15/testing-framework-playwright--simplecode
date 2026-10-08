class FinePage {
    constructor(page) {
        this.page = page;
        this.disciplinaryTab = page.locator('#lnkEmployeeDisciplinaryAction');
        this.createBtn = page.locator('#hrfEmployeeDisciplinaryActionCreate');
        this.employeeJoinDateSpan = page.locator('#spnEmployeeJoinDate');
        this.employeeToDateSpan = page.locator('#spnEmployeeToDate');
        this.dateOfOffenceInput = page.locator('#DateOfOffence');
        this.misconductDropdown = page.locator('#OmissionID');
        this.issueInput = page.locator('#Issue');
        this.actionTakenInput = page.locator('[name="ActionTaken"]');
        this.forMonthInput = page.locator('#ForMonth');
        this.saveBtn = page.locator('#btnSaveEmployeeDisciplinaryAction');
        this.swalText = page.locator('.swal-text');
        this.swalOkBtn = page.locator('.swal-button--confirm');
    }

    async navigateToDisciplinary() {
        await this.disciplinaryTab.waitFor({ state: 'visible', timeout: 10000 });
        await this.disciplinaryTab.click();
    }

    async clickCreate() {
        await this.createBtn.waitFor({ state: 'visible', timeout: 15000 });
        await this.createBtn.click();
    }

    async setDateOfOffenceFromToDate() {
        // Ajchya date chya aadhichi valid date sathi Join Date extract karu (e.g., "01-Jan-2025")
        await this.employeeJoinDateSpan.waitFor({ state: 'visible', timeout: 10000 });
        const joinDateText = await this.employeeJoinDateSpan.textContent() || '';
        const trimmedDate = joinDateText.trim(); 
        console.log("--- Extracted Employee Join Date (Valid Past Date): ---", trimmedDate);

        const parts = trimmedDate.split(/[-/]/);
        if (parts.length === 3) {
            const day = parts[0];
            const monthName = parts[1]; // e.g., "Jan"
            const year = parts[2]; // e.g., "2025"

            // 1. Open Date of Offence calendar
            await this.dateOfOffenceInput.waitFor({ state: 'visible', timeout: 10000 });
            await this.dateOfOffenceInput.click();
            await this.page.waitForTimeout(500);

            // 2. Navigate calendar views (Days -> Months -> Years)
            const switchBtn = this.page.locator('.datepicker-days .datepicker-switch');
            if (await switchBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                await switchBtn.click();
                await this.page.waitForTimeout(400);

                const monthSwitch = this.page.locator('.datepicker-months .datepicker-switch');
                if (await monthSwitch.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await monthSwitch.click();
                    await this.page.waitForTimeout(400);

                    // Select Year
                    const yearCell = this.page.locator('.datepicker-years span.year', { hasText: year });
                    if (await yearCell.isVisible({ timeout: 2000 }).catch(() => false)) {
                        await yearCell.click();
                        await this.page.waitForTimeout(400);
                    }
                }

                // Select Month
                const monthCell = this.page.locator('.datepicker-months span.month', { hasText: monthName });
                if (await monthCell.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await monthCell.click();
                    await this.page.waitForTimeout(400);
                }
            }

            // 3. Select Day
            const dayNum = parseInt(day, 10);
            const dayCell = this.page.locator('.datepicker-days tr td.day:not(.old):not(.new)', { hasText: new RegExp(`^${dayNum}$`) }).first();
            if (await dayCell.isVisible({ timeout: 2000 }).catch(() => false)) {
                await dayCell.click();
                await this.page.waitForTimeout(500);
            }
        }
    }

    async selectCodeOfMisconduct(valueOption) {
        await this.misconductDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await this.misconductDropdown.selectOption({ value: valueOption });
    }

    async fillIssueDetails(issueText) {
        await this.issueInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.issueInput.fill(issueText);
    }

    async fillActionTaken(actionText) {
        await this.actionTakenInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.actionTakenInput.fill(actionText);
    }

    async selectCurrentMonth() {
        await this.forMonthInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.forMonthInput.scrollIntoViewIfNeeded();
        await this.forMonthInput.click({ force: true });
        await this.page.waitForTimeout(500);

        const currentMonthCell = this.page.locator('.datepicker-months span.month.active, .datepicker-months span.month').first();
        if (await currentMonthCell.isVisible({ timeout: 3000 }).catch(() => false)) {
            await currentMonthCell.click({ force: true });
        }
        await this.page.waitForTimeout(500);
    }

    async clickSave() {
        await this.saveBtn.waitFor({ state: 'visible', timeout: 10000 });
        await this.saveBtn.click();
        await this.page.waitForTimeout(2000);
    }

    async handlePopup() {
        if (await this.swalOkBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await this.swalOkBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1500);
    }

    async verifyRecordInTable(expectedIssue, expectedAction) {
        const tableContainer = this.page.locator('#divEmployeeDisciplinaryAction');
        await tableContainer.waitFor({ state: 'visible', timeout: 15000 });

        const tableText = await tableContainer.textContent();
        const cleanedTableText = tableText ? tableText.replace(/\s+/g, ' ').trim() : '';
        
        return {
            hasIssue: cleanedTableText.toLowerCase().includes(expectedIssue.toLowerCase()),
            hasAction: cleanedTableText.toLowerCase().includes(expectedAction.toLowerCase())
        };
    }

    async getPopupMessage() {
        await this.swalText.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
        return await this.swalText.textContent() || '';
    }
}

module.exports = FinePage;