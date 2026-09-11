import { expect } from '@playwright/test';

export class ContractorEmployeeReportingManagerPage {
    constructor(page) {
        this.page = page;

        this.reportingManagerTab = page.locator('#lnkEmployeeReporting').first();

        this.searchButtons = {
            M1: page.locator('#SearchM1, a[id="SearchM1"]').first(),
            M2: page.locator('#SearchM2, a[id="SearchM2"]').first(),
            M3: page.locator('#SearchM3, a[id="SearchM3"]').first(),
            M4: page.locator('#SearchM4, a[id="SearchM4"]').first()
        };

        this.employeeSearchModal = page.locator('.select-single-emp-model, #divSelectSingleEmployee, .modal-dialog').filter({ hasText: 'Employee Search' }).first();
        
        this.popupEmpCodeInput = this.employeeSearchModal.locator('#employeeCodeCnt');
        this.popupSubsidiaryDropdown = this.employeeSearchModal.locator('#SubsidiaryIDCnt').first();
        this.popupDivisionDropdown = this.employeeSearchModal.locator('#DivisionIDCnt').first();
        this.popupDepartmentDropdown = this.employeeSearchModal.locator('#DepartmentIDCnt').first();
        this.popupSearchButton = this.employeeSearchModal.locator('#btnSearchCnt, #btnSearchSingleCnt, button:has-text("Search")').first();

        this.tempManagerData = {
            M1: '',
            M2: '',
            M3: '',
            M4: ''
        };

        this.updatedSelectedManager = '';
    }

    getManagerDisplayLocator(managerType) {
        return this.page.locator(`input[name*="${managerType}"]:not([type="hidden"]), #txt${managerType}Name, #spnName${managerType}, input[id*="${managerType}"]:not([type="hidden"])`).first();
    }

   async clickReportingManagerTab() {
    const tabLocator = this.page.locator('#lnkEmployeeReporting').first();
    await tabLocator.waitFor({ state: 'attached', timeout: 15000 });
    await tabLocator.scrollIntoViewIfNeeded().catch(() => {});
    
    try {
        await tabLocator.click({ force: true, timeout: 5000 });
    } catch {
        
        await tabLocator.evaluate(el => el.click());
    }
    
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(1000);
}

    async openSearchPopupFor(managerType) {
    const cleanType = managerType.trim();
    const searchIcon = this.page.locator(`#Search${cleanType}, a[id="Search${cleanType}"]`).first();
    
    await searchIcon.scrollIntoViewIfNeeded();
    await searchIcon.waitFor({ state: 'visible', timeout: 20000 });
    await searchIcon.click({ force: true });
    
    await expect(this.employeeSearchModal).toBeVisible({ timeout: 15000 });
    await this.page.waitForTimeout(500);
}

    async filterPopupSearch(subsidiary, division, department) {
        if (subsidiary) {
            await this.popupSubsidiaryDropdown.waitFor({ state: 'visible', timeout: 10000 });
            await this.popupSubsidiaryDropdown.click({ force: true }).catch(() => {});
            await this.popupSubsidiaryDropdown.selectOption({ label: subsidiary }).catch(async () => {
                await this.popupSubsidiaryDropdown.selectOption(subsidiary);
            });
            await this.popupSubsidiaryDropdown.dispatchEvent('change').catch(() => {});
            await this.page.waitForLoadState('networkidle').catch(() => {});
            await this.page.waitForTimeout(1000);
        }

        if (division) {
            await expect(this.popupDivisionDropdown).toBeEnabled({ timeout: 10000 });
            await this.popupDivisionDropdown.selectOption({ label: division });
            await this.popupDivisionDropdown.dispatchEvent('change').catch(() => {});
            await this.page.waitForLoadState('networkidle').catch(() => {});
            await this.page.waitForTimeout(1000);
        }

        if (department) {
            await expect(this.popupDepartmentDropdown).toBeEnabled({ timeout: 10000 });
            await this.popupDepartmentDropdown.selectOption({ label: department });
            await this.popupDepartmentDropdown.dispatchEvent('change').catch(() => {});
            await this.page.waitForTimeout(500);
        }

        await this.popupSearchButton.click({ force: true });
        await this.page.waitForLoadState('networkidle').catch(() => {});
        await this.page.waitForTimeout(1000);
    }

    async selectFirstEmployeeFromGridAndStore(managerType) {
        const firstRow = this.employeeSearchModal.locator('table tbody tr').first();
        await expect(firstRow).toBeVisible({ timeout: 15000 });

        const fName = (await firstRow.locator('td').nth(2).innerText().catch(() => '')).trim();
        const lName = (await firstRow.locator('td').nth(3).innerText().catch(() => '')).trim();
        const fullManagerName = `${fName} ${lName}`.trim();

        this.tempManagerData[managerType] = fullManagerName;

        const selectBtn = firstRow.locator('.btn-success, button:has-text("Select"), button[name="btnSelectCnt"]').first();
        await selectBtn.click({ force: true });
        await expect(this.employeeSearchModal).toBeHidden({ timeout: 10000 });
    }

    async searchByEmployeeCode(empCode) {
        await expect(this.popupEmpCodeInput).toBeVisible({ timeout: 5000 });
        await this.popupEmpCodeInput.fill('');
        await this.popupEmpCodeInput.fill(empCode);

        await expect(this.popupSearchButton).toBeVisible({ timeout: 5000 });
        await this.popupSearchButton.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    async clickSaveButton() {
        const saveBtn = this.page.locator('input#btnSaveEmployeeReporting[value="Save"], input[name="btnSaveEmployeeReporting"]').first();

        await saveBtn.scrollIntoViewIfNeeded().catch(() => {});
        await this.page.waitForTimeout(500);

        try {
            await saveBtn.click({ force: true, timeout: 5000 });
        } catch {
            await saveBtn.evaluate(el => el.click());
        }
        
        await this.page.waitForLoadState('networkidle').catch(() => {});
        await this.page.waitForTimeout(1000);
    }

    async clickUpdateButton() {
        const updateBtn = this.page.locator('input#btnUpdateEmployeeReporting').first();

        await updateBtn.waitFor({ state: 'visible', timeout: 15000 });
        await updateBtn.scrollIntoViewIfNeeded().catch(() => {});
        await this.page.waitForTimeout(500);

        try {
            await updateBtn.click({ force: true, timeout: 10000 });
        } catch {
            await updateBtn.evaluate(el => el.click());
        }

        await this.page.waitForLoadState('networkidle').catch(() => {});
        await this.page.waitForTimeout(1000);
    }

    // 🔹 जुनी ऑटोमॅटिक मेथड (जर इतरत्र कुठे वापरायची असेल तर ठेवली आहे)
    async clickSaveOrUpdateButton() {
        const updateBtn = this.page.locator('input#btnUpdateEmployeeReporting, input[value="Update"]').first();
        const saveBtn = this.page.locator('input#btnSaveEmployeeReporting, input[value="Save"]').first();

        let targetBtn = saveBtn;
        if (await updateBtn.isVisible().catch(() => false)) {
            targetBtn = updateBtn;
        } else {
            targetBtn = saveBtn;
        }

        await targetBtn.scrollIntoViewIfNeeded().catch(() => {});
        await this.page.waitForTimeout(500);

        try {
            await targetBtn.click({ force: true, timeout: 5000 });
        } catch {
            await targetBtn.evaluate(el => el.click());
        }

        await this.page.waitForLoadState('networkidle').catch(() => {});
        await this.page.waitForTimeout(1000);
    }

    async getDisplayedManagerValue(managerType) {
        const displayLocator = this.getManagerDisplayLocator(managerType);
        
        await expect(displayLocator).toBeVisible({ timeout: 10000 }).catch(async () => {
            console.log(`⚠️ Warning: Direct visible locator for ${managerType} not found directly, checking fallback value...`);
        });
        
        let text = '';
        try {
            text = await displayLocator.inputValue();
        } catch {
            text = await displayLocator.innerText().catch(() => '');
        }
        
        return text ? text.trim() : '';
    }
}