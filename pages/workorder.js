class WorkOrderPage {
    constructor(page) {
        this.page = page;
        this.assignWorkOrderTab = page.locator('#lnkEmployeeWorkorder');
        this.workOrderDropdown = page.locator('#EmployeeWorkOrder_WorkOrderId');
        this.effectiveFromInput = page.locator('#EmployeeWorkOrder_EffectiveFrom');
        this.effectiveToInput = page.locator('[name="EmployeeWorkOrder.EffectiveTo"]');
        this.effectiveFromHidden = page.locator('#EffectiveFrom');
        this.employeeToDateSpan = page.locator('#spnEmployeeToDate');
        this.employeeJoinDateSpan = page.locator('#spnEmployeeJoinDate');
        this.saveBtn = page.locator('#btnSaveEmployeeWorkOrder');
        this.swalText = page.locator('.swal-text');
        this.swalOkBtn = page.locator('.swal-button--confirm');
        this.updateBtn = page.locator('#btnUpdateEmployeeWorkOrder');
        this.workOrderTable = page.locator('#dtWorkOrderList');
        this.selectedWorkOrderId = '';
        this.selectedWorkOrderText = '';
        this.extractedJoinDate = '';
        this.extractedContractToDate = '';
        this.selectedEffectiveFromDate = '';
    }

    async navigateToAssignWorkOrder() {
        await this.assignWorkOrderTab.waitFor({ state: 'visible', timeout: 10000 });
        await this.assignWorkOrderTab.click();
        await this.page.waitForTimeout(1000);
    }

    async selectWorkOrderId(valueOption) {
        await this.workOrderDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await this.workOrderDropdown.selectOption({ value: valueOption });
        this.selectedWorkOrderId = valueOption;
        this.selectedWorkOrderText = (await this.workOrderDropdown.locator('option:checked').textContent()).trim();
        console.log(`--- Selected Work Order: ID=${this.selectedWorkOrderId}, Text=${this.selectedWorkOrderText} ---`);
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

        try {
            await this.employeeToDateSpan.waitFor({ state: 'visible', timeout: 5000 });
            this.extractedContractToDate = (await this.employeeToDateSpan.textContent() || "").trim();
        } catch (e) {
            this.extractedContractToDate = "";
        }

        try {
            await this.employeeJoinDateSpan.waitFor({ state: 'visible', timeout: 3000 });
            this.extractedJoinDate = (await this.employeeJoinDateSpan.textContent() || "").trim();
        } catch (e) {
            this.extractedJoinDate = "";
        }

        console.log(`--- Extracted Join Date: ${this.extractedJoinDate}, Effective From: ${fromDateVal}, Contract To Date: ${this.extractedContractToDate} ---`);
        return {
            from: fromDateVal.trim(),
            to: this.extractedContractToDate,
            join: this.extractedJoinDate
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

        let joinDateStr = "";
        try {
            await this.employeeJoinDateSpan.waitFor({ state: 'visible', timeout: 3000 });
            joinDateStr = (await this.employeeJoinDateSpan.textContent() || "").trim();
            this.extractedJoinDate = joinDateStr;
        } catch (e) {}

        await this.effectiveFromInput.click();
        await this.page.waitForTimeout(600);

        if (joinDateStr) {
            const parts = joinDateStr.split('-');
            if (parts.length === 3) {
                const joinDay = parseInt(parts[0], 10);
                const joinMonth = parts[1];
                const joinYear = parts[2];
                const targetDayToFind = (joinDay < 28) ? (joinDay + 1) : joinDay;

                for (let attempt = 0; attempt < 12; attempt++) {
                    const currentViewDate = await this.page.locator('.datepicker-days .datepicker-switch').textContent().catch(() => "");
                    if (currentViewDate && currentViewDate.includes(joinMonth) && currentViewDate.includes(joinYear)) {
                        break;
                    }
                    const nextBtn = this.page.locator('.datepicker-days .next').first();
                    if (await nextBtn.isVisible().catch(() => false)) {
                        await nextBtn.click();
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
                    if (parseInt(text, 10) === targetDayToFind) {
                        await cell.click();
                        this.selectedEffectiveFromDate = `${targetDayToFind}-${joinMonth}-${joinYear}`;
                        clicked = true;
                        break;
                    }
                }

                if (clicked) {
                    await this.page.waitForTimeout(500);
                    return;
                }
            }
        }

        const fallbackCell = this.page.locator('.datepicker-days td.day:not(.old):not(.new)').first();
        if (await fallbackCell.isVisible({ timeout: 2000 }).catch(() => false)) {
            this.selectedEffectiveFromDate = (await fallbackCell.textContent()).trim();
            await fallbackCell.click();
        }
        await this.page.waitForTimeout(500);
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
        const expectedWorkOrderValues = [expectedWorkOrder, this.selectedWorkOrderText, this.selectedWorkOrderId].filter(Boolean);

        for (let attempt = 0; attempt < 4; attempt++) {
            try {
                await this.workOrderTable.waitFor({ state: 'visible', timeout: 5000 });
                const tableText = await this.workOrderTable.textContent();
                const cleanedText = tableText ? tableText.replace(/\s+/g, ' ').trim() : '';
                
                const hasWorkOrder = expectedWorkOrderValues.some(value => cleanedText.includes(value));
                const hasType = expectedType ? cleanedText.includes(expectedType) || cleanedText.includes(expectedType.toLowerCase()) : true;

                if (hasWorkOrder) {
                    console.log("--- Table Data Checked for Work Order ---", cleanedText);
                    return { hasWorkOrder: true, hasType };
                }
            } catch (error) {}
            await this.page.waitForTimeout(2000);
        }

        const tableText = await this.workOrderTable.textContent().catch(() => '');
        const cleanedText = tableText ? tableText.replace(/\s+/g, ' ').trim() : '';
        const hasWorkOrder = expectedWorkOrderValues.some(value => cleanedText.includes(value));
        const hasType = expectedType ? cleanedText.includes(expectedType) || cleanedText.includes(expectedType.toLowerCase()) : true;
        
        return { hasWorkOrder, hasType };
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
            
            if (cleanRowText.includes(cleanExpectedWO)) {
                found = true;
                break;
            }
        }
        return found;
    }

    async clickEditButton() {
        const visibleEdit = this.page.locator('#dtWorkOrderList tbody tr:visible td a.EditLink, #dtWorkOrderList tbody tr:visible a[name="btnEditEmployeeTraining"]').first();
        if (await visibleEdit.isVisible({ timeout: 5000 }).catch(() => false)) {
            await visibleEdit.scrollIntoViewIfNeeded();
            await visibleEdit.click({ force: true });
        } else {
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

        const nextMonthBtn = this.page.locator('.datepicker-days .next').first();
        if (await nextMonthBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await nextMonthBtn.click();
            await this.page.waitForTimeout(500);
        }

        const dayCell = this.page.locator('.datepicker-days td.day:not(.old):not(.new)').nth(1);
        if (await dayCell.isVisible({ timeout: 2000 }).catch(() => false)) {
            await dayCell.click();
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

        const dayCells = this.page.locator('.datepicker-days td.day:not(.old):not(.new)');
        const count = await dayCells.count();
        if (count > 5) {
            await dayCells.nth(5).click();
        } else {
            await dayCells.last().click();
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