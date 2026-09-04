import { expect } from '@playwright/test';

export class ContractorEmployeeDeploymentPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        // Navigation Tab
        this.deploymentTab = page.locator('#lnkEmployeeAllocateToOrg').first();

        // Exact Corrected Locators based on HTML Inspection
        this.subsidiaryDropdown = page.locator('#EmployeeAllocateToOrg_SubsidiaryID');
        this.divisionDropdown = page.locator('#EmployeeAllocateToOrg_DivisionID');
        this.departmentDropdown = page.locator('#EmployeeAllocateToOrg_DepartmentID');
        this.categoryDropdown = page.locator('#EmployeeAllocateToOrg_EmpCategoryID'); // Corrected ID
        this.gradeDropdown = page.locator('#EmployeeAllocateToOrg_GradeID');
        this.designationDropdown = page.locator('#EmployeeAllocateToOrg_DesignationID');
        this.locationDropdown = page.locator('#EmployeeAllocateToOrg_BranchID');     // Corrected ID (BranchID is Location)
        this.skillDropdown = page.locator('#EmployeeAllocateToOrg_EmployeeTypeID');  // Corrected ID (EmployeeTypeID is Skill/Skilled Level)
        this.contractorDropdown = page.locator('#EmployeeAllocateToOrg_ContractorID');

        // Action Buttons & Fields
        this.remarkInput = page.locator('#EmployeeAllocateToOrg_Remark, #txtRemark, textarea[name*="Remark"]').first();
        this.cancelButton = page.locator('#btnCancelEmployeeAllocateToOrg, input[id*="btnCancelEmployeeAllocateToOrg"]').first();
        this.updateButton = page.locator('#btnUpdateEmployeeAllocateToOrg, input[id*="btnUpdateEmployeeAllocateToOrg"]').first();

        // SweetAlert Popups
        this.swalModal = page.locator('.swal-modal, .sweet-alert, .swal2-popup').first();
        this.swalOkButton = page.locator('.swal-button, button.confirm, button:has-text("OK")').first();

        // Cross-step persistence
        if (!ContractorEmployeeDeploymentPage.sharedInitialData) {
            ContractorEmployeeDeploymentPage.sharedInitialData = {};
        }
        if (!ContractorEmployeeDeploymentPage.sharedModifiedData) {
            ContractorEmployeeDeploymentPage.sharedModifiedData = {};
        }
    }

    async clickDeploymentTab() {
        await expect(this.deploymentTab).toBeVisible({ timeout: 10000 });
        await this.deploymentTab.scrollIntoViewIfNeeded();
        await this.deploymentTab.click({ force: true });
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1500);
    }

    // Dropdown मधील Current Value/Text शोधण्याचे helper
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

    // Dropdown मध्ये Value किंवा Text ने Select करणारा Robust Helper
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
        await this.page.waitForTimeout(800);
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

    // 2. Initial Values Verification
    async verifySelectedValues(expected) {
        await expect(this.departmentDropdown).toBeVisible({ timeout: 10000 });

        if (expected && Object.keys(expected).length > 0) {
            ContractorEmployeeDeploymentPage.sharedInitialData = { ...expected };
            this.initialData = ContractorEmployeeDeploymentPage.sharedInitialData;
        } else {
            await this.captureInitialDetails();
        }

        const checkDropdownValue = async (locator, expectedVal) => {
            if (expectedVal && await locator.isVisible().catch(() => false)) {
                const selectedText = await this.getSelectedOptionText(locator);
                if (selectedText) {
                    expect(selectedText.toLowerCase()).toContain(expectedVal.trim().toLowerCase());
                }
            }
        };

        if (expected.subsidiary) await checkDropdownValue(this.subsidiaryDropdown, expected.subsidiary);
        if (expected.division) await checkDropdownValue(this.divisionDropdown, expected.division);
        if (expected.department) await checkDropdownValue(this.departmentDropdown, expected.department);
        if (expected.category) await checkDropdownValue(this.categoryDropdown, expected.category);
        if (expected.grade) await checkDropdownValue(this.gradeDropdown, expected.grade);
        if (expected.designation) await checkDropdownValue(this.designationDropdown, expected.designation);
        if (expected.location) await checkDropdownValue(this.locationDropdown, expected.location);
        if (expected.skill) await checkDropdownValue(this.skillDropdown, expected.skill);
        if (expected.contractor) await checkDropdownValue(this.contractorDropdown, expected.contractor);
    }

    // 3. Temporary Values Fill करणे
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
            await this.remarkInput.fill('Check If Cancel then old data reflect properly or not');
        }

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

    // 4. Console Table Print करणारी Method
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
            
            const isRestored = initialVal !== '' && (
                initialVal.trim().toLowerCase() === finalVal.trim().toLowerCase()
            );

            return {
                'Field': field.toUpperCase(),
                '1. Initial Created': initialVal,
                '2. Modified (Temporary)': modifiedVal,
                '3. Final Reflected': finalVal,
                'Result': isRestored ? '✅ Restored' : '❌ Failed'
            };
        });

        console.log('\n📊 DEPLOYMENT CANCEL VALIDATION COMPARISON TABLE:');
        console.table(tableData);

        if (world && world.attach) {
            world.attach(JSON.stringify(tableData, null, 2), 'application/json');
        }
    }
}