class WorkOrderPage {
    constructor(page) {
        this.page = page;
        this.assignWorkOrderTab = page.locator('#lnkEmployeeWorkorder');
        this.workOrderDropdown = page.locator('#EmployeeWorkOrder_WorkOrderId');
        this.effectiveFromInput = page.locator('#EmployeeWorkOrder_EffectiveFrom');
        this.effectiveToInput = page.locator('[name="EmployeeWorkOrder.EffectiveTo"]');
        this.effectiveFromHidden = page.locator('#EffectiveFrom');
        this.employeeToDateSpan = page.locator('#spnEmployeeToDate');
        this.saveBtn = page.locator('#btnSaveEmployeeWorkOrder');
        this.swalText = page.locator('.swal-text');
        this.swalOkBtn = page.locator('.swal-button--confirm');
        this.updateBtn = page.locator('#btnUpdateEmployeeWorkOrder');
        this.editBtn = page.locator('table#dtWorkOrderList a[name="btnEditEmployeeTraining"], a.EditLink').first();
        this.workOrderTable = page.locator('#dtWorkOrderList');
    }

    async navigateToAssignWorkOrder() {
        await this.assignWorkOrderTab.waitFor({ state: 'visible', timeout: 10000 });
        await this.assignWorkOrderTab.click();
        await this.page.waitForTimeout(1000);
    }

    async selectWorkOrderId(valueOption) {
        await this.workOrderDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await this.workOrderDropdown.selectOption({ value: valueOption });
        await this.page.waitForTimeout(2000);
    }

    async extractDates() {
        let fromDateVal = "";
        try {
            await this.effectiveFromHidden.waitFor({ state: 'attached', timeout: 5000 });
            fromDateVal = await this.effectiveFromHidden.inputValue() || await this.effectiveFromHidden.getAttribute('value') || "";
        } catch (e) {
            fromDateVal = await this.effectiveFromInput.inputValue().catch(() => "");
        }

        await this.employeeToDateSpan.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
        const toDateVal = await this.employeeToDateSpan.textContent().catch(() => "") || "";

        console.log(`--- Extracted Effective From: ${fromDateVal}, Contract To Date: ${toDateVal} ---`);
        return {
            from: fromDateVal.trim(),
            to: toDateVal.trim()
        };
    }

    async setInvalidEffectiveFrom() {
        await this.effectiveFromInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.effectiveFromInput.click();
        await this.page.waitForTimeout(500);

        const prevYearBtn = this.page.locator('.datepicker-days .prev').first();
        if (await prevYearBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await prevYearBtn.click();
            await this.page.waitForTimeout(300);
        }
        const anyDay = this.page.locator('.datepicker-days td.day:not(.old):not(.new)').first();
        if (await anyDay.isVisible({ timeout: 2000 }).catch(() => false)) {
            await anyDay.click();
            await this.page.waitForTimeout(300);
        }
    }

    async setValidEffectiveFrom() {
        await this.effectiveFromInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.effectiveFromInput.click();
        await this.page.waitForTimeout(500);

        const todayCell = this.page.locator('.datepicker-days td.day.today, .datepicker-days td.day:not(.old):not(.new)').first();
        if (await todayCell.isVisible({ timeout: 2000 }).catch(() => false)) {
            await todayCell.click();
            await this.page.waitForTimeout(300);
        }
    }

    async setInvalidEffectiveTo() {
        await this.effectiveToInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.effectiveToInput.click();
        await this.page.waitForTimeout(500);

        const nextYearBtn = this.page.locator('.datepicker-days .next').first();
        if (await nextYearBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await nextYearBtn.click();
            await this.page.waitForTimeout(300);
        }
        const futureDay = this.page.locator('.datepicker-days td.day:not(.old):not(.new)').last();
        if (await futureDay.isVisible({ timeout: 2000 }).catch(() => false)) {
            await futureDay.click();
            await this.page.waitForTimeout(300);
        }
    }

    async setValidEffectiveTo() {
        await this.effectiveToInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.effectiveToInput.click();
        await this.page.waitForTimeout(500);

        const normalDay = this.page.locator('.datepicker-days td.day:not(.old):not(.new)').first();
        if (await normalDay.isVisible({ timeout: 2000 }).catch(() => false)) {
            await normalDay.click();
            await this.page.waitForTimeout(300);
        }
    }

    async clickSave() {
        await this.saveBtn.waitFor({ state: 'visible', timeout: 10000 });
        await this.saveBtn.click();
        await this.page.waitForTimeout(1500);
    }

    async handlePopup() {
        if (await this.swalOkBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            const msg = await this.swalText.textContent().catch(() => "");
            console.log("--- Popup Message Handled: ---", msg);
            await this.swalOkBtn.click({ force: true });
            await this.page.waitForTimeout(1000);
        }
    }

    async verifyTableData(expectedWorkOrder, expectedType) {
        await this.workOrderTable.waitFor({ state: 'visible', timeout: 15000 });
        const tableText = await this.workOrderTable.textContent();
        const cleanedText = tableText ? tableText.replace(/\s+/g, ' ').trim() : '';
        console.log("--- Table Data Checked for Work Order ---", cleanedText);
        return {
            hasWorkOrder: cleanedText.includes(expectedWorkOrder),
            hasType: cleanedText.includes(expectedType)
        };
    }

    async verifyWorkOrderInTable(expectedWorkOrderText, expectedFromDate, expectedToDate) {
        const rows = this.page.locator('#dtWorkOrderList tbody tr');
        const rowCount = await rows.count();
        
        const cleanExpectedWO = expectedWorkOrderText.replace(/\s+/g, '');
        const cleanExpectedDate = expectedFromDate.replace(/\s+/g, '');
        
        let found = false;
        for (let i = 0; i < rowCount; i++) {
            const rawRowText = await rows.nth(i).textContent();
            const cleanRowText = rawRowText ? rawRowText.replace(/\s+/g, '') : '';
            
            if (cleanRowText.includes(cleanExpectedWO) && cleanRowText.includes(cleanExpectedDate)) {
                found = true;
                break;
            }
        }
        return found;
    }

  async clickEditButton() {
        // Table madhil visible edit button/icon shodhun click karne
        const visibleEdit = this.page.locator('#dtWorkOrderList tbody tr:visible td a.EditLink, #dtWorkOrderList tbody tr:visible a[name="btnEditEmployeeTraining"]').first();
        if (await visibleEdit.isVisible({ timeout: 5000 }).catch(() => false)) {
            await visibleEdit.scrollIntoViewIfNeeded();
            await visibleEdit.click({ force: true });
        } else {
            // Fallback general selector
            const fallbackEdit = this.page.locator('#dtWorkOrderList a.EditLink:visible').first();
            await fallbackEdit.waitFor({ state: 'visible', timeout: 10000 });
            await fallbackEdit.click({ force: true });
        }
        await this.page.waitForTimeout(1500);
    }

    async setEffectiveFromNextDate() {
        await this.effectiveFromInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.effectiveFromInput.click();
        await this.page.waitForTimeout(500);

        // Next month button click karu jevha update kartana date greater asavi lagte
        const nextMonthBtn = this.page.locator('.datepicker-days .next').first();
        if (await nextMonthBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await nextMonthBtn.click();
            await this.page.waitForTimeout(500);
        }

        // Next month madhil valid day select karne (e.g. 10th day)
        const nextDayCell = this.page.locator('.datepicker-days td.day:not(.old):not(.new)').nth(9);
        if (await nextDayCell.isVisible({ timeout: 2000 }).catch(() => false)) {
            await nextDayCell.click();
        } else {
            const anyDay = this.page.locator('.datepicker-days td.day:not(.old):not(.new)').first();
            await anyDay.click();
        }
        await this.page.waitForTimeout(500);
    }

    async setContractPeriodToDate() {
        const contractToDateStr = await this.employeeToDateSpan.textContent().catch(() => "") || "";
        console.log("--- Contract Period To Date Extracted: ---", contractToDateStr.trim());

        await this.effectiveToInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.effectiveToInput.click();
        await this.page.waitForTimeout(500);

        const targetDay = this.page.locator('.datepicker-days td.day:not(.old):not(.new)').last();
        if (await targetDay.isVisible({ timeout: 2000 }).catch(() => false)) {
            await targetDay.click();
        }
        await this.page.waitForTimeout(500);
    }

    async validateAndUpdate() {
        await this.updateBtn.waitFor({ state: 'visible', timeout: 10000 });
        const isUpdateVisible = await this.updateBtn.isVisible();
        console.log("--- Update Button Visible Status: ---", isUpdateVisible);
        if (isUpdateVisible) {
            await this.updateBtn.click();
            await this.page.waitForTimeout(2000);
        }
    }
}

module.exports = WorkOrderPage;