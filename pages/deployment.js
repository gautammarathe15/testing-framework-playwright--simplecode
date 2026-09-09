import { expect } from '@playwright/test';

export class ContractorEmployeeDeploymentPage {
    // Cross-step persistence साठी Static variables
    static sharedInitialData = {};
    static sharedModifiedData = {};

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        // Navigation Tab
        this.deploymentTab = page.locator('#lnkEmployeeAllocateToOrg').first();

        // Exact Locators based on HTML Inspection
        this.subsidiaryDropdown = page.locator('#EmployeeAllocateToOrg_SubsidiaryID');
        this.divisionDropdown = page.locator('#EmployeeAllocateToOrg_DivisionID');
        this.departmentDropdown = page.locator('#EmployeeAllocateToOrg_DepartmentID');
        this.categoryDropdown = page.locator('#EmployeeAllocateToOrg_EmpCategoryID');
        this.gradeDropdown = page.locator('#EmployeeAllocateToOrg_GradeID');
        this.designationDropdown = page.locator('#EmployeeAllocateToOrg_DesignationID');
        this.locationDropdown = page.locator('#EmployeeAllocateToOrg_BranchID');
        this.skillDropdown = page.locator('#EmployeeAllocateToOrg_EmployeeTypeID');
        this.contractorDropdown = page.locator('#EmployeeAllocateToOrg_ContractorID');

        // Action Buttons & Fields
        this.remarkInput = page.locator('#EmployeeAllocateToOrg_Remark, #txtRemark, textarea[name*="Remark"]').first();
        this.cancelButton = page.locator('#btnCancelEmployeeAllocateToOrg, input[id*="btnCancelEmployeeAllocateToOrg"]').first();
        this.updateButton = page.locator('#btnUpdateEmployeeAllocateToOrg, input[id*="btnUpdateEmployeeAllocateToOrg"]').first();

        // SweetAlert Popups
        this.swalModal = page.locator('.swal-modal, .sweet-alert, .swal2-popup').first();
        this.swalOkButton = page.locator('.swal-button, button.confirm, button:has-text("OK")').first();
    }

    async clickDeploymentTab() {
        await expect(this.deploymentTab).toBeVisible({ timeout: 10000 });
        await this.deploymentTab.scrollIntoViewIfNeeded();
        await this.deploymentTab.click({ force: true });
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1500);
    }

    // Dropdown मधील Current Selected Text शोधणारा सुरक्षित Helper
    async getSelectedOptionText(locator) {
        if (await locator.isVisible().catch(() => false)) {
            return await locator.evaluate(sel => {
                if (!sel || sel.selectedIndex < 0) return '';
                const opt = sel.options[sel.selectedIndex];
                return opt ? opt.text.trim() : '';
            }).catch(() => '');
        }
        return '';
    }

    // Dropdown मध्ये Value/Label निवडून DOM Event Trigger करणारा Helper
    async selectDropdownRobust(locator, searchText) {
        if (!searchText || !(await locator.isVisible().catch(() => false))) return;

        try {
            await locator.selectOption({ label: searchText }, { timeout: 2000 });
        } catch (e) {
            const valToSelect = await locator.evaluate((sel, txt) => {
                const options = Array.from(sel.options);
                const exactMatch = options.find(o => o.text.trim().toLowerCase() === txt.toLowerCase());
                if (exactMatch) return exactMatch.value;

                const partialMatch = options.find(o => o.text.trim().toLowerCase().includes(txt.toLowerCase()));
                if (partialMatch) return partialMatch.value;

                return options.length > 1 ? options[1].value : null;
            }, searchText);

            if (valToSelect) {
                await locator.selectOption(valToSelect);
            }
        }

        await locator.dispatchEvent('change').catch(() => {});
        await locator.dispatchEvent('blur').catch(() => {});
        await this.page.waitForTimeout(500);
    }

    // 1. Initial Values Capture करणे
    async captureInitialDetails() {
        await expect(this.departmentDropdown).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);

        ContractorEmployeeDeploymentPage.sharedInitialData = {
            subsidiary: await this.getSelectedOptionText(this.subsidiaryDropdown),
            division: await this.getSelectedOptionText(this.divisionDropdown),
            department: await this.getSelectedOptionText(this.departmentDropdown),
            category: await this.getSelectedOptionText(this.categoryDropdown),
            grade: await this.getSelectedOptionText(this.gradeDropdown),
            designation: await this.getSelectedOptionText(this.designationDropdown),
            location: await this.getSelectedOptionText(this.locationDropdown),
            skill: await this.getSelectedOptionText(this.skillDropdown),
            contractor: await this.getSelectedOptionText(this.contractorDropdown)
        };
        this.initialData = ContractorEmployeeDeploymentPage.sharedInitialData;
    }

    // 2. Deployment Values Verify करणे (Null/Undefined Safety सह)
    async verifySelectedValues(expectedData) {
        await expect(this.departmentDropdown).toBeVisible({ timeout: 10000 });

        // जर parameter दिला नसेल, तर static variable किंवा initial capture वापरणे
        const targetData = expectedData || this.modifiedData || ContractorEmployeeDeploymentPage.sharedModifiedData || ContractorEmployeeDeploymentPage.sharedInitialData;

        if (!targetData || Object.keys(targetData).length === 0) {
            throw new Error("❌ Validation Error: Verification साठी कोणताही अपेक्षित डेटा (expectedData) मिळालेला नाही.");
        }

        const checkDropdownValue = async (locator, expectedVal) => {
            if (expectedVal && await locator.isVisible().catch(() => false)) {
                const selectedText = await this.getSelectedOptionText(locator);
                if (selectedText) {
                    expect(selectedText.toLowerCase().trim()).toContain(expectedVal.trim().toLowerCase());
                }
            }
        };

        if (targetData.subsidiary) await checkDropdownValue(this.subsidiaryDropdown, targetData.subsidiary);
        if (targetData.division) await checkDropdownValue(this.divisionDropdown, targetData.division);
        if (targetData.department) await checkDropdownValue(this.departmentDropdown, targetData.department);
        if (targetData.category) await checkDropdownValue(this.categoryDropdown, targetData.category);
        if (targetData.grade) await checkDropdownValue(this.gradeDropdown, targetData.grade);
        if (targetData.designation) await checkDropdownValue(this.designationDropdown, targetData.designation);
        if (targetData.location) await checkDropdownValue(this.locationDropdown, targetData.location);
        if (targetData.skill) await checkDropdownValue(this.skillDropdown, targetData.skill);
        if (targetData.contractor) await checkDropdownValue(this.contractorDropdown, targetData.contractor);
    }

    // 3. Temporary Values Modify आणि Capture करणे (Delay सह)
    async modifyDeploymentFields() {
        await expect(this.departmentDropdown).toBeVisible({ timeout: 10000 });

        await this.selectDropdownRobust(this.subsidiaryDropdown, 'yashodhan pvt');
        await this.selectDropdownRobust(this.divisionDropdown, 'Support');
        await this.selectDropdownRobust(this.departmentDropdown, 'Hardware');
        await this.selectDropdownRobust(this.categoryDropdown, 'Staff Employee');
        await this.selectDropdownRobust(this.gradeDropdown, 'B');
        await this.selectDropdownRobust(this.designationDropdown, 'Developer');
        await this.selectDropdownRobust(this.locationDropdown, 'Baner');
        await this.selectDropdownRobust(this.skillDropdown, 'Skilled');

        if (await this.remarkInput.isVisible().catch(() => false)) {
            await this.remarkInput.fill('Check Update persistence logic');
        }

        // DOM मध्ये नवी निवड सेट होण्यासाठी १ सेकंदाचा विराम
        await this.page.waitForTimeout(1000);

        ContractorEmployeeDeploymentPage.sharedModifiedData = {
            subsidiary: await this.getSelectedOptionText(this.subsidiaryDropdown),
            division: await this.getSelectedOptionText(this.divisionDropdown),
            department: await this.getSelectedOptionText(this.departmentDropdown),
            category: await this.getSelectedOptionText(this.categoryDropdown),
            grade: await this.getSelectedOptionText(this.gradeDropdown),
            designation: await this.getSelectedOptionText(this.designationDropdown),
            location: await this.getSelectedOptionText(this.locationDropdown),
            skill: await this.getSelectedOptionText(this.skillDropdown),
            contractor: await this.getSelectedOptionText(this.contractorDropdown)
        };
        this.modifiedData = ContractorEmployeeDeploymentPage.sharedModifiedData;
    }

    async clickCancel() {
        await expect(this.cancelButton).toBeVisible({ timeout: 10000 });
        await this.cancelButton.click({ force: true });
        await this.page.waitForTimeout(2500);
    }

    async clickUpdate() {
        await expect(this.updateButton).toBeVisible({ timeout: 10000 });
        await this.updateButton.click({ force: true });
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1500);
    }

    async handleUpdateSuccessAlert() {
        if (await this.swalModal.isVisible({ timeout: 5000 }).catch(() => false)) {
            if (await this.swalOkButton.isVisible({ timeout: 3000 }).catch(() => false)) {
                await this.swalOkButton.click({ force: true });
            }
        }
        await this.page.waitForTimeout(1000);
    }

    // 4. Final Comparison Chart Logging
    async logFinalComparisonChart(world) {
        await this.page.waitForTimeout(1000);

        const finalData = {
            subsidiary: await this.getSelectedOptionText(this.subsidiaryDropdown),
            division: await this.getSelectedOptionText(this.divisionDropdown),
            department: await this.getSelectedOptionText(this.departmentDropdown),
            category: await this.getSelectedOptionText(this.categoryDropdown),
            grade: await this.getSelectedOptionText(this.gradeDropdown),
            designation: await this.getSelectedOptionText(this.designationDropdown),
            location: await this.getSelectedOptionText(this.locationDropdown),
            skill: await this.getSelectedOptionText(this.skillDropdown),
            contractor: await this.getSelectedOptionText(this.contractorDropdown)
        };

        const initial = ContractorEmployeeDeploymentPage.sharedInitialData || {};
        const modified = ContractorEmployeeDeploymentPage.sharedModifiedData || {};

        const fields = ['subsidiary', 'division', 'department', 'category', 'grade', 'designation', 'location', 'skill', 'contractor'];

        const tableData = fields.map(field => {
            const initialVal = initial[field] || '';
            const modifiedVal = modified[field] || '';
            const finalVal = finalData[field] || '';
            
            const isMatched = finalVal !== '' && (
                finalVal.trim().toLowerCase() === (modifiedVal || initialVal).trim().toLowerCase()
            );

            return {
                'Field': field.toUpperCase(),
                '1. Initial Created': initialVal,
                '2. Modified (Temporary)': modifiedVal,
                '3. Final Reflected': finalVal,
                'Result': isMatched ? '✅ Matched' : '❌ Mismatched'
            };
        });

        console.log('\n📊 DEPLOYMENT VALIDATION COMPARISON TABLE:');
        console.table(tableData);

        if (world && world.attach) {
            world.attach(JSON.stringify(tableData, null, 2), 'application/json');
        }
    }
}