/**
 * --------------------------------------------------------------------------
 * CLMS Master Module - Contractor Employee Form Details Page Object Class
 * File: pages/mastermodule/contractorEmployeeDetails.js
 * --------------------------------------------------------------------------
 */

const { expect } = require('@playwright/test');

class ContractorEmployeeDetailsPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        // --- Top Navigation Tabs ---
        this.tabs = [
            { name: "Details Tab", locator: page.getByRole('tab', { name: 'Details' }) },
            { name: "Deployment Tab", locator: page.getByRole('tab', { name: 'Deployment' }) },
            { name: "Reporting Manager Tab", locator: page.getByRole('tab', { name: 'Reporting Manager' }) },
            { name: "Shift Tab", locator: page.getByRole('tab', { name: 'Shift' }) },
            { name: "Card Tab", locator: page.getByRole('tab', { name: 'Card' }) },
            { name: "Address Tab", locator: page.getByRole('tab', { name: 'Address' }) },
            { name: "Family Member Tab", locator: page.getByRole('tab', { name: 'Family Member' }) },
            { name: "Document Tab", locator: page.getByRole('tab', { name: 'Document' }) }
        ];

        // --- Section Headings ---
        this.sections = [
            { name: "Personal Information Section", locator: page.locator('#employeeDetails').getByText('Personal Information') },
            { name: "Deployment Section", locator: page.locator('#employeeDetails, body').getByText('Deployment', { exact: false }).first() },
            { name: "Employee Other Details Section", locator: page.getByText('Employee Other Details', { exact: true }) },
            { name: "Reporting Manager Section", locator: page.locator('#employeeDetails, body').getByText('Reporting Manager', { exact: false }).first() },
            { name: "Shift Section", locator: page.locator('strong, h4, h5, div').filter({ hasText: /^Shift$/i }).first() }
        ];

        // --- Form Fields ---
        this.formFields = [
            // Personal Information
            { name: "Employee Code Textbox", locator: page.locator('#Employee_EmployeeCode') },
            { name: "First Name Textbox", locator: page.locator('#Employee_FirstName') },
            { name: "Middle Name Textbox", locator: page.locator('#Employee_MiddleName') },
            { name: "Last Name Textbox", locator: page.locator('#Employee_LastName') },
            { name: "Gender Dropdown", locator: page.locator('#Employee_GenderID, select[name*="Gender"], [id*="Gender"]').first() },
            { name: "Contract From Date", locator: page.locator('#Employee_JoinDate') },
            { name: "Proposed Date Of Leaving", locator: page.locator('#Employee_ProposedDateOfLeaving') },
            { name: "Rejoin", locator: page.getByText('Rejoin', { exact: false }).first() },
            
            // Status Dropdown Target
            { name: "Status Dropdown", locator: page.getByText('Status *').or(page.locator('#Employee_StatusID, #Employee_Status')).first() },

            // Deployment & Other Details
            { name: "Department Select", locator: page.locator('#Employee_DepartmentID, select[name*="Department"]').first() },
            { name: "Subsidiary Dropdown", locator: page.locator('#Employee_SubsidiaryID, select[name*="Subsidiary"]').first() },
            { name: "Location Dropdown", locator: page.locator('#Employee_LocationID, select[name*="Location"]').first() },
            
            // Skilled Level / Category Target
            { name: "Skilled Level Dropdown", locator: page.getByLabel('Category*').or(page.locator('#Employee_SkilledLevelID, #Employee_SkillID')).first() },
            { name: "Contractor Dropdown", locator: page.locator('#Employee_ContractorID, select[name*="Contractor"]').first() },

            // Identity, Banking & Registration Fields
            { name: "Aadhaar Card No Textbox", locator: page.getByRole('textbox', { name: 'Aadhaar Card No' }).or(page.locator('#Employee_AadharNo')).first() },
            { name: "PAN No Input", locator: page.getByRole('textbox', { name: 'PAN No' }).or(page.locator('#Employee_PANNo')).first() },
            { name: "PF No Input", locator: page.locator('#Employee_PFNo, input[name*="PF"]').first() },
            { name: "UAN Textbox", locator: page.locator('#Employee_UANNo, input[name*="UAN"]').first() },
            { name: "ESIC No Textbox", locator: page.locator('#Employee_ESICNo, #Employee_EsicNo, input[name*="ESIC"]').first() },
            { name: "Bank Account Dropdown/Input", locator: page.locator('#Employee_BankID, input[name*="Bank"]').first() },
            { name: "Payment Mode Dropdown", locator: page.locator('#Employee_PaymentModeID') }
        ];

        // --- Check Verification Section Locators ---
        // Bootstrap 5 data-bs-target selector used as primary locator
        this.checkVerificationHeader = page.locator('a[data-bs-target="#verificationfield"]').or(page.locator('a[href*="verificationfield"]')).first();

        // Specific Checkbox Locators
        this.backgroundCheckedCheckbox = page.locator('#Employee_IsBackgroundChecked');
        this.medicalCheckUpCheckbox = page.locator('#Employee_IsMedicalCheckUpDone');

        // Text Inputs
        this.remarkBackgroundInput = page.locator('#Employee_RemarkForBackgroundCheck');
        this.remarkMedicalInput = page.locator('#Employee_RemarkForMedicalCheckUp');
    }

    /**
     * Fast Parallel Visibility Checker with Auto-Scroll Fallback
     */
    async verifyGroupVisibility(groupName, items) {
        console.log(`\n🔍 Checking visibility for: ${groupName}...`);

        const results = await Promise.all(
            items.map(async (item, i) => {
                let isVisible = false;
                try {
                    isVisible = await item.locator.isVisible({ timeout: 1500 });
                    
                    // Fallback check: try scrolling into view if not immediately visible
                    if (!isVisible) {
                        const count = await item.locator.count();
                        if (count > 0) {
                            await item.locator.first().scrollIntoViewIfNeeded({ timeout: 1000 }).catch(() => {});
                            isVisible = await item.locator.first().isVisible({ timeout: 1000 });
                        }
                    }
                } catch (e) {
                    isVisible = false;
                }
                return {
                    "No": i + 1,
                    "Field Name": item.name,
                    "Status": isVisible ? "Visible" : "Not Visible",
                    isVisible
                };
            })
        );

        const reportData = results.map(({ No, "Field Name": name, Status }) => ({ "No": No, "Field Name": name, "Status": Status }));
        const missingCount = results.filter(r => !r.isVisible).length;

        console.log(`\n📊 --- ${groupName} Visibility Report ---`);
        console.table(reportData);

        return missingCount;
    }

    /**
     * Complete Form UI Verification
     */
    async verifyAllFormFieldsAndSections() {
        await this.page.waitForTimeout(2000);

        let totalMissing = 0;
        totalMissing += await this.verifyGroupVisibility("Top Navigation Tabs", this.tabs);
        totalMissing += await this.verifyGroupVisibility("Form Sections", this.sections);
        totalMissing += await this.verifyGroupVisibility("Form Fields", this.formFields);

        console.log(`\n📌 Result Summary: Total Fields/Elements missing = ${totalMissing}`);
    }

    // =========================================================================
    // Check Verification Action & Assertion Methods
    // =========================================================================

    /**
     * Safe Click Helper with Fallbacks for Dynamic Headers / Accordions
     */
    async clickVerificationHeaderSafely() {
        console.log("📂 Interacting with Check Verification section header...");
        try {
            await this.checkVerificationHeader.scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => {});
            await this.checkVerificationHeader.click({ timeout: 3000 });
            console.log("✅ Clicked on Check Verification header.");
        } catch (e) {
            console.log("⚠️ Standard click failed, applying direct JS click dispatch...");
            await this.page.evaluate(() => {
                const el = document.querySelector('a[data-bs-target="#verificationfield"]') ||
                           document.querySelector('a[href*="verificationfield"]') ||
                           document.querySelector('#verificationfield');
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    el.click();
                }
            });
        }
    }

    /**
     * 1. Check if Verification section child element is attached/visible; expand if collapsed
     */
    async expandVerificationSectionIfCollapsed() {
        const isRemarkVisible = await this.remarkBackgroundInput.isVisible({ timeout: 2000 }).catch(() => false);

        if (!isRemarkVisible) {
            console.log("📂 Check Verification section is collapsed. Expanding...");
            await this.clickVerificationHeaderSafely();

            // Allow Bootstrap expansion animation to complete
            await this.page.waitForTimeout(800);
            await this.remarkBackgroundInput.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
                console.log("⚠️ Child element not visible immediately after header click.");
            });
        } else {
            console.log("📖 Check Verification section is already expanded.");
        }
    }

    /**
     * 2 & 3. Verify specific checkboxes exist and interact with them safely
     */
    async verifyAndInteractWithCheckboxes() {
        await this.expandVerificationSectionIfCollapsed();

        // Wait for DOM attachment
        await this.backgroundCheckedCheckbox.waitFor({ state: 'attached', timeout: 10000 });

        const isBgChecked = await this.backgroundCheckedCheckbox.isChecked().catch(() => false);
        if (!isBgChecked) {
            await this.backgroundCheckedCheckbox.check({ force: true });
            console.log("✔️ Checked 'Background Checked' checkbox.");
        }

        await this.medicalCheckUpCheckbox.waitFor({ state: 'attached', timeout: 10000 });
        const isMedicalChecked = await this.medicalCheckUpCheckbox.isChecked().catch(() => false);
        if (!isMedicalChecked) {
            await this.medicalCheckUpCheckbox.check({ force: true });
            console.log("✔️ Checked 'Is Medical Check Up Done' checkbox.");
        }
    }

    /**
     * 4 & 5. Fill dynamic input data into editable remark fields
     */
    async fillAndVerifyRemarkFields(bgRemark, medicalRemark) {
        // Remark For Background Check
        await this.remarkBackgroundInput.waitFor({ state: 'visible', timeout: 5000 });
        await expect(this.remarkBackgroundInput).toBeEditable();
        await this.remarkBackgroundInput.clear();
        await this.remarkBackgroundInput.fill(bgRemark);
        console.log(`✍️ Entered Background Remark: "${bgRemark}"`);

        // Remark For Medical CheckUp
        await this.remarkMedicalInput.waitFor({ state: 'visible', timeout: 5000 });
        await expect(this.remarkMedicalInput).toBeEditable();
        await this.remarkMedicalInput.clear();
        await this.remarkMedicalInput.fill(medicalRemark);
        console.log(`✍️ Entered Medical Remark: "${medicalRemark}"`);
    }

    /**
     * 6. Collapse Check Verification section and verify sub-fields become invisible
     */
    async collapseVerificationSectionAndVerifyHidden() {
        console.log("📁 Collapsing Check Verification section...");
        await this.clickVerificationHeaderSafely();
        
        // Wait for Bootstrap collapse animation to conclude
        await this.page.waitForTimeout(1000);

        await this.remarkBackgroundInput.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
        await expect(this.remarkBackgroundInput).not.toBeVisible({ timeout: 5000 });
        await expect(this.remarkMedicalInput).not.toBeVisible({ timeout: 5000 });
        console.log("🙈 Confirmed: Verification sub-fields are hidden after collapse.");
    }

    /**
     * 7. Expand again and verify old entered data is retained
     */
    async expandAndVerifyRetainedData(expectedBgRemark, expectedMedicalRemark) {
        console.log("📂 Expanding Check Verification section again...");
        await this.expandVerificationSectionIfCollapsed();
        
        await this.remarkBackgroundInput.waitFor({ state: 'visible', timeout: 5000 });

        const actualBgRemark = await this.remarkBackgroundInput.inputValue();
        const actualMedicalRemark = await this.remarkMedicalInput.inputValue();

        expect(actualBgRemark).toBe(expectedBgRemark);
        expect(actualMedicalRemark).toBe(expectedMedicalRemark);

        console.log("🎉 Data retention verified successfully: Entered text was preserved!");
    }

    /**
     * 8. Verify that retained remark fields are still editable and accept new inputs
     */
    async verifyAndEditRetainedData(updatedBgRemark, updatedMedicalRemark) {
        console.log("✏️ Checking if retained remark fields can be edited after expanding...");

        // Background Remark Edit Check
        await expect(this.remarkBackgroundInput).toBeEditable();
        await this.remarkBackgroundInput.clear();
        await this.remarkBackgroundInput.fill(updatedBgRemark);
        const actualUpdatedBg = await this.remarkBackgroundInput.inputValue();
        expect(actualUpdatedBg).toBe(updatedBgRemark);
        console.log(`✅ Background Remark successfully edited to: "${actualUpdatedBg}"`);

        // Medical Remark Edit Check
        await expect(this.remarkMedicalInput).toBeEditable();
        await this.remarkMedicalInput.clear();
        await this.remarkMedicalInput.fill(updatedMedicalRemark);
        const actualUpdatedMedical = await this.remarkMedicalInput.inputValue();
        expect(actualUpdatedMedical).toBe(updatedMedicalRemark);
        console.log(`✅ Medical Remark successfully edited to: "${actualUpdatedMedical}"`);
    }
}

module.exports = { ContractorEmployeeDetailsPage };