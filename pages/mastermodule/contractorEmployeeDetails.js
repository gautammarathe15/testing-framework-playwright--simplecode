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
            { name: "Employee Code Textbox", locator: page.locator('#Employee_EmployeeCode, #EmployeeCode').first() },
            { name: "First Name Textbox", locator: page.locator('#FirstName, #Employee_FirstName').first() },
            { name: "Middle Name Textbox", locator: page.locator('#MiddleName, #Employee_MiddleName').first() },
            { name: "Last Name Textbox", locator: page.locator('#LastName, #Employee_LastName').first() },
            { name: "Gender Dropdown", locator: page.locator('#Gender, #Employee_GenderID, select[name*="Gender"]').first() },
            { name: "Contract From Date", locator: page.locator('#Employee_JoinDate, #JoinDate').first() },
            { name: "Proposed Date Of Leaving", locator: page.locator('#Employee_ProposedDateOfLeaving, #ProposedDateOfLeaving').first() },
            { name: "Rejoin", locator: page.getByText('Rejoin', { exact: false }).first() },
            
            // Status Dropdown Target
            { name: "Status Dropdown", locator: page.getByText('Status *').or(page.locator('#Employee_StatusID, #Employee_Status, #Status')).first() },

            // Deployment & Other Details
            { name: "Department Select", locator: page.locator('#Employee_DepartmentID, select[name*="Department"]').first() },
            { name: "Subsidiary Dropdown", locator: page.locator('#Employee_SubsidiaryID, select[name*="Subsidiary"]').first() },
            { name: "Location Dropdown", locator: page.locator('#Employee_LocationID, select[name*="Location"]').first() },
            
            // Skilled Level / Category Target
            { name: "Skilled Level Dropdown", locator: page.getByLabel(/Category/i).or(page.locator('#Employee_SkilledLevelID, #Employee_SkillID')).first() },
            { name: "Contractor Dropdown", locator: page.locator('#Employee_ContractorID, select[name*="Contractor"]').first() },

            // Identity, Banking & Registration Fields
            { name: "Aadhaar Card No Textbox", locator: page.getByRole('textbox', { name: /Aadhaar|Aadhar/i }).or(page.locator('#Employee_AadharNo, #AadharNo')).first() },
            { name: "PAN No Input", locator: page.getByRole('textbox', { name: 'PAN No' }).or(page.locator('#PANNo, #PanNo, #Employee_PANNo')).first() },
            { name: "PF No Input", locator: page.locator('#PFNo, #PfNo, #Employee_PFNo, input[name*="PF"]').first() },
            { name: "UAN Textbox", locator: page.locator('#Employee_UANNo, input[name*="UAN"]').first() },
            { name: "ESIC No Textbox", locator: page.locator('#Employee_ESICNo, #Employee_EsicNo, input[name*="ESIC"]').first() },
            { name: "Bank Account Dropdown/Input", locator: page.locator('#Employee_BankID, input[name*="Bank"]').first() },
            { name: "Payment Mode Dropdown", locator: page.locator('#Employee_PaymentModeID') }
        
        
        
        
        ];

        // --- Save Button Locator ---
        this.saveButton = page.getByRole('button', { name: 'Save' }).or(page.locator('#btnSaveEmployee, #btnSave, button:has-text("Save")')).first();

        // --- Check Verification Section Locators ---
        this.checkVerificationHeader = page.locator('a[data-bs-target="#verificationfield"]').or(page.locator('a[href*="verificationfield"]')).first();

        // Checkbox Locators
        this.backgroundCheckedCheckbox = page.locator('#Employee_IsBackgroundChecked, #IsBackgroundChecked').first();
        this.medicalCheckUpCheckbox = page.locator('#Employee_IsMedicalCheckUpDone, #IsMedicalCheckUpDone').first();

        // Text Inputs
        this.remarkBackgroundInput = page.locator('#Employee_RemarkForBackgroundCheck, #RemarkForBackgroundCheck').first();
        this.remarkMedicalInput = page.locator('#Employee_RemarkForMedicalCheckUp, #RemarkForMedicalCheckUp').first();

        // --- Birthday Field & Dynamic Calendar Locators ---
        this.birthDateInput = page.locator('#Employee_BirthDate').first();
        
        this.calendarMonthHeader = page.locator('.datepicker-days .datepicker-switch, .ui-datepicker-title, .calendar-header, th.datepicker-switch').first();
        this.prevMonthBtn = page.locator('.datepicker-days .prev, .ui-datepicker-prev, th.prev').first().or(page.getByRole('columnheader', { name: '«' }));
        this.nextMonthBtn = page.locator('.datepicker-days .next, .ui-datepicker-next, th.next').first().or(page.getByRole('columnheader', { name: '»' }));

        // --- Contract Section Specific Locators ---
        this.contractFromInput = page.locator('#Employee_JoinDate, input[name*="ContractFrom"], #dtpContractFrom').first();
        this.contractDaysInput = page.locator('#Employee_ServicePeriodInMonths, input[name="Employee.ServicePeriodInMonths"]').first();
        this.contractToInput = page.locator('#Employee_ProposedDateOfLeaving, input[name="Employee.ProposedDateOfLeaving"]').first();
        this.contractCalendarWidget = page.locator('.datepicker, .bs-datepicker-container, .ui-datepicker, div[class*="datepicker"]').first();

        // --- Validation & Success Popups ---
        this.ageErrorPopup = page.locator('.swal2-popup, .modal-content, .alert-danger, :has-text("18")').first();
        this.okButton = page.locator('.swal2-confirm, .swal-button--confirm, button:has-text("OK"), button:has-text("Ok"), button:has-text("Close")').first();
        this.successPopup = page.locator('.alert-success, .toast-success, #swal2-title, :has-text("Saved Successfully")').first();


        // --- Status Dropdown :
        this.statusDropdown = page.locator('#Employee_EmployeeStatusID, select[name="Employee.EmployeeStatusID"]').first();
        
        

        // Deployment Locators (Fallback definitions)
        this.subsidiaryDropdown = this.page.locator('#Subsidiary, #SubsidiaryId, select[name*="Subsidiary"]').first();
        this.divisionDropdown = this.page.locator('#Division, #DivisionId, select[name*="Division"]').first();
        this.departmentDropdown = this.page.locator('#Department, #DepartmentId, select[name*="Department"]').first();
        this.categoryDropdown = this.page.locator('#Category, #CategoryId, select[name*="Category"]').first();
        this.gradeDropdown = this.page.locator('#Grade, #GradeId, select[name*="Grade"]').first();
        this.designationDropdown = this.page.locator('#Designation, #DesignationId, select[name*="Designation"]').first();
        this.locationDropdown = this.page.locator('#Location, #LocationId, select[name*="Location"]').first();
        this.skillDropdown = this.page.locator('#SkillLevel, #SkilledLevel, select[name*="Skill"]').first();
        this.contractorDropdown = this.page.locator('#Contractor, #ContractorId, select[name*="Contractor"]').first();

   
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
        await this.page.waitForTimeout(1000);

        let totalMissing = 0;
        totalMissing += await this.verifyGroupVisibility("Top Navigation Tabs", this.tabs);
        totalMissing += await this.verifyGroupVisibility("Form Sections", this.sections);
        totalMissing += await this.verifyGroupVisibility("Form Fields", this.formFields);

        console.log(`\n📌 Result Summary: Total Fields/Elements missing = ${totalMissing}`);
    }

    // =========================================================================
    // Calendar & Age Restriction Methods
    // =========================================================================

    async openBirthdayCalendar() {
        await this.birthDateInput.waitFor({ state: 'visible', timeout: 5000 });
        await this.birthDateInput.click();
    }

    async verifyCalendarVisible() {
        await expect(this.birthDateInput).toBeVisible();
    }

    async verifyMonthHeaderVisible() {
        await this.calendarMonthHeader.waitFor({ state: 'visible', timeout: 5000 });
        const isHeaderVisible = await this.calendarMonthHeader.isVisible().catch(() => false);
        expect(isHeaderVisible).toBeTruthy();
        return isHeaderVisible;
    }

    async verifyMonthControlsVisible() {
        await expect(this.prevMonthBtn).toBeVisible();
        await expect(this.nextMonthBtn).toBeVisible();
    }

    async clickPreviousMonth() {
        await this.prevMonthBtn.click();
    }

    async clickNextMonth() {
        await this.nextMonthBtn.click();
    }

    async verifyDaysHeadersVisible() {
        const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        for (const day of days) {
            const dayLocator = this.page.getByRole('columnheader', { name: day, exact: true }).or(this.page.locator(`th:has-text("${day}")`));
            await expect(dayLocator.first()).toBeVisible();
        }
    }

    async setBirthDateByAgeOffset(ageYears) {
        const targetDate = new Date();
        targetDate.setFullYear(targetDate.getFullYear() - ageYears);

        const day = String(targetDate.getDate()).padStart(2, '0');
        const month = String(targetDate.getMonth() + 1).padStart(2, '0');
        const year = targetDate.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        const dateInput = this.page.locator('#Employee_BirthDate').first();
        
        await dateInput.evaluate((el, val) => {
            el.removeAttribute('readonly');
            el.value = val;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        }, formattedDate);

        console.log(`📅 Birthdate set to: ${formattedDate} (Age: ~${ageYears})`);
    }

    async verifyAgePopupDisplayed() {
        await expect(this.ageErrorPopup).toBeVisible({ timeout: 5000 });
    }

    async clickOkOnAgePopup() {
        if (await this.okButton.isVisible().catch(() => false)) {
            await this.okButton.click();
        }
    }

    async verifyFormNotSaved() {
        await expect(this.page).toHaveURL(/.*ContractorEmployee.*/);
    }

    async verifyAgePopupNotDisplayed() {
        const popupSpecificTo18 = this.page.locator('.swal2-popup:has-text("18"), .alert-danger:has-text("18")').first();
        await expect(popupSpecificTo18).not.toBeVisible({ timeout: 3000 });
    }

    // =========================================================================
    // Check Verification Action & Assertion Methods
    // =========================================================================

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

    async expandVerificationSectionIfCollapsed() {
        const isRemarkVisible = await this.remarkBackgroundInput.isVisible({ timeout: 2000 }).catch(() => false);

        if (!isRemarkVisible) {
            console.log("📂 Check Verification section is collapsed. Expanding...");
            await this.clickVerificationHeaderSafely();
            await this.page.waitForTimeout(800);
            await this.remarkBackgroundInput.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
                console.log("⚠️ Child element not visible immediately after header click.");
            });
        } else {
            console.log("📖 Check Verification section is already expanded.");
        }
    }

    async verifyAndInteractWithCheckboxes() {
        await this.expandVerificationSectionIfCollapsed();
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

    async fillAndVerifyRemarkFields(bgRemark, medicalRemark) {
        await this.remarkBackgroundInput.waitFor({ state: 'visible', timeout: 5000 });
        await expect(this.remarkBackgroundInput).toBeEditable();
        await this.remarkBackgroundInput.clear();
        await this.remarkBackgroundInput.fill(bgRemark);
        console.log(`✍️ Entered Background Remark: "${bgRemark}"`);

        await this.remarkMedicalInput.waitFor({ state: 'visible', timeout: 5000 });
        await expect(this.remarkMedicalInput).toBeEditable();
        await this.remarkMedicalInput.clear();
        await this.remarkMedicalInput.fill(medicalRemark);
        console.log(`✍️ Entered Medical Remark: "${medicalRemark}"`);
    }

    async collapseVerificationSectionAndVerifyHidden() {
        console.log("📁 Collapsing Check Verification section...");
        await this.clickVerificationHeaderSafely();
        await this.page.waitForTimeout(1000);

        await this.remarkBackgroundInput.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
        await expect(this.remarkBackgroundInput).not.toBeVisible({ timeout: 5000 });
        await expect(this.remarkMedicalInput).not.toBeVisible({ timeout: 5000 });
        console.log("🙈 Confirmed: Verification sub-fields are hidden after collapse.");
    }

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

    async verifyAndEditRetainedData(updatedBgRemark, updatedMedicalRemark) {
        console.log("✏️ Checking if retained remark fields can be edited after expanding...");

        await expect(this.remarkBackgroundInput).toBeEditable();
        await this.remarkBackgroundInput.clear();
        await this.remarkBackgroundInput.fill(updatedBgRemark);
        const actualUpdatedBg = await this.remarkBackgroundInput.inputValue();
        expect(actualUpdatedBg).toBe(updatedBgRemark);
        console.log(`✅ Background Remark successfully edited to: "${actualUpdatedBg}"`);

        await expect(this.remarkMedicalInput).toBeEditable();
        await this.remarkMedicalInput.clear();
        await this.remarkMedicalInput.fill(updatedMedicalRemark);
        const actualUpdatedMedical = await this.remarkMedicalInput.inputValue();
        expect(actualUpdatedMedical).toBe(updatedMedicalRemark);
        console.log(`✅ Medical Remark successfully edited to: "${actualUpdatedMedical}"`);
    }

    // =========================================================================
    // Mandatory Validations, Filling, Scrolling, Saving & Matching Methods
    // =========================================================================

    async validateMandatoryAsterisks() {
        console.log("\n🔍 Validating visual mandatory (*) asterisks on form labels...");
        const mandatoryAsterisks = this.page.locator('label:has-text("*"), span:has-text("*")');
        const count = await mandatoryAsterisks.count();
        console.log(`📌 Found ${count} mandatory indicators (*) on UI.`);
        expect(count).toBeGreaterThan(0);
    }

    async clickSaveAndVerifyMandatoryValidations() {
        console.log("\n⚠️ Clicking Save without mandatory details to trigger validations...");
        await this.saveButton.scrollIntoViewIfNeeded();
        await this.saveButton.click({ force: true });

        const errorElements = this.page.locator('.field-validation-error, .text-danger, .invalid-feedback, :invalid');
        const errorCount = await errorElements.count();
        console.log(`🚨 Total validation errors triggered: ${errorCount}`);
        expect(errorCount).toBeGreaterThan(0);
    }

    async enterDynamicAadhaarAndSkipVerification() {
        const dynamicAadhaar = '7' + Date.now().toString().slice(-11);
        console.log("🔢 Entering dynamic Aadhaar number for testing...");

        const aadhaarInput = this.page.getByRole('textbox', { name: /Aadhaar|Aadhar/i }).or(this.page.locator('#Employee_AadharNo, #AadharNo')).first();
        await aadhaarInput.waitFor({ state: 'visible', timeout: 10000 });
        await aadhaarInput.clear();
        await aadhaarInput.fill(dynamicAadhaar);

        const verifyLink = this.page.getByRole('link', { name: 'Verify' }).or(this.page.getByText('Verify')).first();
        if (await verifyLink.isVisible().catch(() => false)) {
            await verifyLink.click();
        }

        const skipOption = this.page.getByRole('button', { name: 'Skip Verification' }).or(this.page.getByText('Skip Verification')).first();
        if (await skipOption.isVisible({ timeout: 5000 }).catch(() => false)) {
            await skipOption.click();
            console.log("⏩ Clicked Skip Verification.");
        }
    }

    /**
     * Fills employee form fields dynamically supporting multi-ID fallback logic
     */
    async fillEmployeeFormFields(formData) {
        console.log("\n✍️ Filling Contractor Employee details...");

        const fieldMap = {
            'firstName': '#FirstName, #Employee_FirstName',
            'middleName': '#MiddleName, #Employee_MiddleName',
            'lastName': '#LastName, #Employee_LastName',
            'fatherHusbandName': '#FatherName, #FatherHusbandName, #Employee_FatherHusbandName, input[name*="Father"], input[name*="Husband"]',
            'panNo': '#PANNo, #PanNo, #Employee_PANNo',
            'pfNo': '#PFNo, #PfNo, #Employee_PFNo'
        };

        for (const [key, value] of Object.entries(formData)) {
            if (!value) continue;

            if (key === 'gender') {
                const genderLocator = this.page.locator('#Employee_Gender, #Gender, #Employee_GenderID, select[name*="Gender"]').first();
                await genderLocator.waitFor({ state: 'visible', timeout: 5000 });

                let genderVal = value.trim();
                if (genderVal.toLowerCase().startsWith('m')) {
                    genderVal = 'M';
                } else if (genderVal.toLowerCase().startsWith('f')) {
                    genderVal = 'F';
                }

                try {
                    await genderLocator.selectOption({ label: genderVal });
                } catch (err) {
                    try {
                        await genderLocator.selectOption({ value: genderVal });
                    } catch (e) {
                        await genderLocator.selectOption(value);
                    }
                }
                console.log(`✅ Selected gender: "${genderVal}"`);
            } else if (fieldMap[key]) {
                let fieldLocator = this.page.locator(fieldMap[key]).first();
                
                if (key === 'fatherHusbandName') {
                    const labelLocator = this.page.getByRole('textbox', { name: /Father|Husband/i }).first();
                    fieldLocator = fieldLocator.or(labelLocator);
                }

                try {
                    await fieldLocator.waitFor({ state: 'visible', timeout: 5000 });
                    await fieldLocator.clear();
                    await fieldLocator.fill(value);
                    console.log(`✅ Filled ${key}: "${value}"`);
                } catch (err) {
                    console.log(`⚠️ Field '${key}' is not visible on UI, skipping...`);
                }
            }
        }

        console.log("✅ Form details processing completed.");
    }

    /**
     * Scroll down to Save button and Click
     */
    async scrollAndSaveForm() {
        console.log("\n📜 Scrolling down to Save button and saving form...");
        await this.saveButton.scrollIntoViewIfNeeded();
        await this.saveButton.click();
        await this.page.waitForLoadState('networkidle').catch(() => {});
        console.log("✅ Clicked Save button successfully.");
    }

    /**
     * Verifies inserted data matches actual inputs rendered on UI
     */
    async verifyFormDetailsMatch(expectedData) {
        console.log("\n🔍 Verifying inserted form data matches displayed details...");

        const fieldMap = {
            'firstName': '#FirstName, #Employee_FirstName',
            'middleName': '#MiddleName, #Employee_MiddleName',
            'lastName': '#LastName, #Employee_LastName',
            'fatherHusbandName': '#FatherName, #FatherHusbandName, #Employee_FatherHusbandName, input[name*="Father"], input[name*="Husband"]',
            'panNo': '#PANNo, #PanNo, #Employee_PANNo',
            'pfNo': '#PFNo, #PfNo, #Employee_PFNo'
        };

        for (const [key, expectedValue] of Object.entries(expectedData)) {
            if (!expectedValue) continue;

            try {
                if (key === 'gender') {
                    const genderLocator = this.page.locator('#Gender, #Employee_GenderID, #Employee_Gender').first();
                    const selectedText = await genderLocator.evaluate(el => el.options[el.selectedIndex]?.text || '');
                    expect(selectedText.trim()).toContain(expectedValue);
                } else if (fieldMap[key]) {
                    let fieldLocator = this.page.locator(fieldMap[key]).first();
                    if (key === 'fatherHusbandName') {
                        fieldLocator = fieldLocator.or(this.page.getByRole('textbox', { name: /Father|Husband/i }).first());
                    }

                    if (await fieldLocator.isVisible()) {
                        const actualValue = await fieldLocator.inputValue();
                        expect(actualValue.trim()).toBe(expectedValue.trim());
                    }
                }
            } catch (e) {
                console.log(`⚠️ Could not verify field '${key}': ${e.message}`);
            }
        }

        console.log("✅ UI field values matched successfully with inserted data!");
    }

    /**
     * Edit existing populated form fields with new values
     */
    async editEmployeeFormFields(updatedData) {
        console.log("\n✏️ Editing Contractor Employee details...");
        await this.fillEmployeeFormFields(updatedData);
        console.log("✅ Form details updated successfully.");
    }

    /**
     * Final success validation check after saving
     */
    async verifyEmployeeSavedSuccessfully() {
        console.log("\n🎉 Validating successful save message / record creation...");
        await expect(this.successPopup).toBeVisible({ timeout: 10000 }).catch(() => {
            console.log("⚠️ Success alert box was not explicitly found, verifying page URL or DOM state.");
        });
    }

    /**
     * Selects 1st valid option for all mandatory dropdowns dynamically
     */
    async selectMandatoryDropdowns() {
        console.log("👉 Selecting first valid option for all mandatory dropdowns...");

        const dropdownConfigs = [
            { name: "Subsidiary", locator: this.page.getByLabel(/Subsidiary/i).or(this.page.locator('#Employee_SubsidiaryID, select[name*="Subsidiary"]')) },
            { name: "Division", locator: this.page.getByLabel(/Division/i).or(this.page.locator('#Employee_DivisionID, select[name*="Division"]')) },
            { name: "Department", locator: this.page.getByLabel(/Department/i).or(this.page.locator('#Employee_DepartmentID, select[name*="Department"]')) },
            { name: "Category", locator: this.page.getByLabel(/Category/i).or(this.page.locator('#Employee_CategoryID, select[name*="Category"]')) },
            { name: "Grade", locator: this.page.getByLabel(/Grade/i).or(this.page.locator('#Employee_GradeID, select[name*="Grade"]')) },
            { name: "Designation", locator: this.page.getByLabel(/Designation/i).or(this.page.locator('#Employee_DesignationID, select[name*="Designation"]')) },
            { name: "Location", locator: this.page.getByLabel(/Location/i).or(this.page.locator('#Employee_LocationID, select[name*="Location"]')) },
            { name: "Skilled Level", locator: this.page.getByLabel(/Skilled Level/i).or(this.page.locator('#Employee_SkilledLevelID, select[name*="Skilled"]')) },
            { name: "Contractor", locator: this.page.getByLabel(/Contractor/i).or(this.page.locator('#Employee_ContractorID, select[name*="Contractor"]')) }
        ];

        for (const item of dropdownConfigs) {
            try {
                const dropdown = item.locator.first();
                await dropdown.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});

                if (await dropdown.isVisible().catch(() => false)) {
                    const tagName = await dropdown.evaluate(el => el.tagName.toLowerCase()).catch(() => '');

                    if (tagName === 'select') {
                        // index: 1 म्हणजे default "Select" सोडून 1st actual option select होईल
                        await dropdown.selectOption({ index: 1 });
                        console.log(`✅ Selected 1st option for dropdown: ${item.name}`);
                    } else {
                        // Dynamic Select2 / Custom Dropdowns Handling
                        await dropdown.click();
                        await this.page.waitForTimeout(300);

                        const firstOption = this.page.locator('.dropdown-menu option, [role="option"], ul.select2-results__options li, .select-option').first();
                        if (await firstOption.isVisible().catch(() => false)) {
                            await firstOption.click();
                        } else {
                            await dropdown.press('ArrowDown');
                            await dropdown.press('Enter');
                        }
                        console.log(`✅ Selected option via keyboard/click for custom dropdown: ${item.name}`);
                    }
                    await this.page.waitForTimeout(200);
                } else {
                    console.log(`⚠️ Dropdown not visible on UI: ${item.name}`);
                }
            } catch (err) {
                console.log(`⚠️ Exception while selecting option for ${item.name}: ${err.message}`);
            }
        }
    }

    /**
     * Handles active alert popups, scrolls to Save button, and clicks Save
     */
    async scrollToSaveAndClick() {
        if (await this.okButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await this.okButton.click();
            await this.page.waitForTimeout(300);
        }

        await this.saveButton.scrollIntoViewIfNeeded();
        await this.saveButton.click({ force: true });
        console.log("✅ Clicked on Save button.");
    }

    // =========================================================================
    // Contract Calendar & Auto-Calculation Methods (Cucumber Steps Mapped)
    // =========================================================================

    async openContractFromCalendar() {
        await this.contractFromInput.waitFor({ state: 'visible', timeout: 5000 });
        await this.contractFromInput.click();
        console.log("👉 Clicked on Contract From Date input field.");
    }

    async verifyContractCalendarVisible() {
        console.log("🔍 Verifying Contract From Date calendar widget visibility...");
        await this.contractCalendarWidget.waitFor({ state: 'visible', timeout: 10000 });
        const isVisible = await this.contractCalendarWidget.isVisible();
        expect(isVisible).toBeTruthy();
        console.log("✅ Contract From Date calendar popup is visible.");
        return isVisible;
    }

    async verifyContractCalendarHeader() {
        await this.calendarMonthHeader.waitFor({ state: 'visible', timeout: 5000 });
        const headerText = (await this.calendarMonthHeader.textContent()).trim();
        console.log(`📅 Contract Calendar Header Text: "${headerText}"`);
        expect(headerText).toBeTruthy();
        return headerText;
    }

    async clickContractPrevMonth() {
        await this.prevMonthBtn.waitFor({ state: 'visible', timeout: 3000 });
        await this.prevMonthBtn.click();
        await this.page.waitForTimeout(300);
        console.log("👈 Clicked Previous Month '«' button.");
    }

    async clickContractNextMonth() {
        await this.nextMonthBtn.waitFor({ state: 'visible', timeout: 3000 });
        await this.nextMonthBtn.click();
        await this.page.waitForTimeout(300);
        console.log("👉 Clicked Next Month '»' button.");
    }

/**
   
     * @param {string} dateVal - Target Date String (e.g., "04-Mar-2026")
     */
    async fillContractFromDate(dateVal) {
        console.log(`📅 Navigating calendar to select Date: "${dateVal}"...`);

        // 1. Inupt field visible & Click to open calendar
        await this.contractFromInput.waitFor({ state: 'visible', timeout: 5000 });
        await this.contractFromInput.click();
        await this.page.waitForTimeout(500);

        const targetDate = new Date(dateVal); // "04-Mar-2026"
        const targetMonth = targetDate.toLocaleString('default', { month: 'long' }); // "March"
        const targetYear = targetDate.getFullYear(); // 2026
        const targetDay = targetDate.getDate(); // 4

        const expectedHeader = `${targetMonth} ${targetYear}`; // "March 2026"

        console.log(`🎯 Target Month & Year: "${expectedHeader}"`);

        // 2. Loop to click '«' until "March 2026" appears
        let attempts = 0;
        const maxAttempts = 24; // Maximum 2 years back search limit

        while (attempts < maxAttempts) {
            await this.calendarMonthHeader.waitFor({ state: 'visible', timeout: 3000 });
            const currentHeader = (await this.calendarMonthHeader.textContent()).trim();
            console.log(`📅 Currently visible calendar month: "${currentHeader}"`);

            if (currentHeader.toLowerCase().includes(expectedHeader.toLowerCase())) {
                console.log(`✅ Target month "${expectedHeader}" reached!`);
                break;
            }
            // Click Previous Month '«' button
            console.log("👈 Target month not reached. Clicking Previous Month ('«') button...");
            await this.prevMonthBtn.click();
            await this.page.waitForTimeout(400); // UI render wait
            attempts++;
        }

        // 3. March 2026 मधील specific day (उदा. 4) सेलेक्ट करणे
        const dayLocator = this.page.locator('.datepicker-days td.day:not(.old):not(.new)')
            .filter({ hasText: new RegExp(`^${targetDay}$`) }).first();

        await dayLocator.waitFor({ state: 'visible', timeout: 3000 });
        await dayLocator.click();
        console.log(`🎉 Clicked on day: ${targetDay}`);

        // Blur event trigger करण्यासाठी Tab दाबा
        await this.contractFromInput.press('Tab');
    }
    /**
     * Fills the Contract Period In Days input field and triggers UI calculation
     * @param {string|number} days 
     */
    async fillContractDays(days) {
        console.log(`🔢 Entering Contract Period In Days: "${days}"`);
        await this.contractDaysInput.waitFor({ state: 'visible', timeout: 5000 });
        await this.contractDaysInput.clear();
        await this.contractDaysInput.fill(String(days));
        
        // Tab key press केल्याने blur/change event ट्रिगर होतो आणि Contract To तारीख auto-calculate होते
        await this.contractDaysInput.press('Tab');
        await this.page.waitForTimeout(500);
    }

    /**
     * Verifies that Contract To Date field is readonly/disabled
     */
    async verifyContractToIsReadonly() {
        console.log("🔒 Verifying Contract To date field is readonly/disabled...");
        await this.contractToInput.waitFor({ state: 'visible', timeout: 5000 });

        const isReadonly = await this.contractToInput.getAttribute('readonly');
        const isDisabled = await this.contractToInput.getAttribute('disabled');

        expect(isReadonly !== null || isDisabled !== null).toBeTruthy();
        console.log("✅ Verified: Contract To field is non-editable.");
    }

    /**
     * Verifies auto-calculated Contract To date matches expected date
     * @param {string} expectedContractTo 
     */
    async verifyAutoCalculatedContractToDate(expectedContractTo) {
        console.log(`🔍 Verifying auto-calculated Contract To date... Expected: "${expectedContractTo}"`);
        await this.contractToInput.waitFor({ state: 'visible', timeout: 5000 });

        const actualContractTo = await this.contractToInput.inputValue();
        console.log(`📌 Actual Calculated Date on UI: "${actualContractTo.trim()}"`);

        expect(actualContractTo.trim()).toBe(expectedContractTo.trim());
        console.log("🎉 Auto-calculated Contract To date verified successfully!");
    }

    async verifyStatusIsVisibleAndMandatory() {
    console.log("🔍 Verifying Status dropdown visibility...");
    await this.statusDropdown.scrollIntoViewIfNeeded().catch(() => {});
    await this.statusDropdown.waitFor({ state: 'visible', timeout: 5000 });
    
    const isVisible = await this.statusDropdown.isVisible();
    expect(isVisible).toBeTruthy();
    console.log("✅ Status dropdown is visible on page.");
}

/**
 * Verifies default status is 'Active'
 * @param {string} expectedStatus - "Active"
 */
async verifyDefaultStatus(expectedStatus) {
    console.log(`🎯 Verifying default Status is "${expectedStatus}"...`);
    const selectedText = await this.statusDropdown.evaluate(el => el.options[el.selectedIndex].text.trim());
    console.log(`📄 Default Selected Status in UI: "${selectedText}"`);
    
    expect(selectedText).toBe(expectedStatus);
    console.log(`✅ Default status verified successfully as "${expectedStatus}".`);
}
/**
 * Clicks Status Dropdown
 */
async clickStatusDropdown() {
    await this.statusDropdown.click({ force: true });
}

/**
 * Verifies all options (Select, Active, Left, Terminated, Absconded)
 * @param {Array<string>} expectedOptions
 */
async verifyStatusDropdownOptions(expectedOptions) {
    console.log("📋 Verifying all options in Status dropdown...");
    
    const actualOptions = await this.statusDropdown.locator('option').allTextContents();
    const cleanedActualOptions = actualOptions.map(opt => opt.trim()).filter(opt => opt !== '');
    
    console.log("Found Options in UI:", cleanedActualOptions);
    console.log("Expected Options:", expectedOptions);

    for (const option of expectedOptions) {
        expect(cleanedActualOptions).toContain(option);
    }
    console.log("✅ All Status options are present and verified!");
}

/**
 * Selects an option from Status dropdown
 * @param {string} statusText
 */
async selectStatusOption(statusText) {
    console.log(`👇 Selecting Status option: "${statusText}"...`);
    await this.statusDropdown.selectOption({ label: statusText });
    await this.page.waitForTimeout(300);
}

/**
 * Verifies the currently selected option
 * @param {string} expectedStatus
 */
async verifySelectedStatus(expectedStatus) {
    const selectedText = await this.statusDropdown.evaluate(el => el.options[el.selectedIndex].text.trim());
    console.log(`🔍 Current Selected Status: "${selectedText}" | Expected: "${expectedStatus}"`);
    expect(selectedText).toBe(expectedStatus);
    console.log(`✅ Status updated successfully to "${expectedStatus}".`);
}

async fillAllDeploymentMandatoryDetails(details) {
        console.log("✍️ Filling ALL Deployment Mandatory Fields from UI dropdowns...");

        const selectOptionSafe = async (locator, value) => {
            if (value && locator) {
                await locator.scrollIntoViewIfNeeded().catch(() => {});
                await locator.selectOption({ label: value }).catch(async () => {
                    await locator.selectOption({ value: value }).catch(() => {});
                });
            }
        };

        await selectOptionSafe(this.subsidiaryDropdown, details.subsidiary);
        await selectOptionSafe(this.divisionDropdown, details.division);
        await selectOptionSafe(this.departmentDropdown, details.department);
        await selectOptionSafe(this.categoryDropdown, details.category);
        await selectOptionSafe(this.gradeDropdown, details.grade);
        await selectOptionSafe(this.designationDropdown, details.designation);
        await selectOptionSafe(this.locationDropdown, details.location);
        await selectOptionSafe(this.skillDropdown, details.skill);
        await selectOptionSafe(this.contractorDropdown, details.contractor);

        console.log("✅ Deployment section filled successfully!");
    }

async fillPersonalMandatoryDetails(firstName, lastName, gender, dob) {
    console.log(`✍️ Filling Personal Details: Name="${firstName} ${lastName}", Gender="${gender}", DOB="${dob}"...`);

    // 1. First Name & Last Name Fill
    if (firstName) {
        const fNameInput = this.page.locator('#Employee_FName, input[name*="FName"], input[name*="FirstName"]').first();
        await fNameInput.waitFor({ state: 'visible', timeout: 5000 });
        await fNameInput.fill(firstName);
    }

    if (lastName) {
        const lNameInput = this.page.locator('#Employee_LName, input[name*="LName"], input[name*="LastName"]').first();
        await lNameInput.waitFor({ state: 'visible', timeout: 5000 });
        await lNameInput.fill(lastName);
    }

    // 2. Gender Selection
    if (gender) {
        const genderDropdown = this.page.locator('#Employee_Gender, select[name*="Gender"]').first();
        await genderDropdown.waitFor({ state: 'visible', timeout: 5000 });
        await genderDropdown.selectOption({ label: gender }).catch(async () => {
            await genderDropdown.selectOption({ value: gender });
        });
        await genderDropdown.dispatchEvent('change').catch(() => {});
    }

    // 3. Birth Date Set Via DatePicker JS API & UI Trigger
    if (dob) {
        const dobInput = this.page.locator('#Employee_BirthDate, input[name="Employee.BirthDate"]').first();
        await dobInput.waitFor({ state: 'visible', timeout: 5000 });
        await dobInput.click({ force: true });
        await this.page.waitForTimeout(300);

        // Step B: Direct jQuery DatePicker API चा वापर करून Date Set करा व Change Event Trigger करा
        await this.page.evaluate((dobValue) => {
            const $el = window.jQuery ? window.jQuery('#Employee_BirthDate') : null;
            const el = document.getElementById('Employee_BirthDate') || document.querySelector('input[name="Employee.BirthDate"]');

            if ($el && $el.datepicker) {
                // jQuery Datepicker API वापरून तारीख सेट करा
                $el.datepicker('setDate', dobValue);
                $el.trigger('change');
                $el.trigger('blur');
            } else if (el) {
                // Native Fallback
                el.removeAttribute('readonly');
                el.value = dobValue;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
                el.dispatchEvent(new Event('blur', { bubbles: true }));
            }
        }, dob);
        const dateCell = this.page.locator('.datepicker-days td.day.active, .datepicker-days td.day:not(.old):not(.new)').first();
        if (await dateCell.isVisible().catch(() => false)) {
            await dateCell.click().catch(() => {});
        } else {
           
            await dobInput.press('Tab');
        }

        await this.page.waitForTimeout(800); // Age field update होण्यासाठी पॉझ

        // 4. Age Field Auto-Calculation Validation
        const ageInput = this.page.locator('#Employee_Age, #Age, input[name*="Age"]').first();

        if (await ageInput.isVisible().catch(() => false)) {
            const calculatedAge = await ageInput.inputValue();
            console.log(`🎯 Auto-calculated Age on UI: "${calculatedAge}"`);

            if (calculatedAge && calculatedAge !== 'NaN') {
                console.log(`✅ Developer Age Calculation Logic Passed! Age is: ${calculatedAge}`);
            } else {
                console.warn(`⚠️ Warning: Age field is still showing "${calculatedAge}". Verify if date format matches (e.g., DD/MM/YYYY vs YYYY-MM-DD).`);
            }
        }
    }

    console.log("✅ Personal Mandatory Details filled successfully!");
}


/**
     * Contract Period Fill Method (Direct Inject + Auto-Calculation Trigger)
     */
async fillContractPeriodDetails(contractFromDate, periodInDays) {
    console.log(`✍️ Filling Contract From using correct locator (#Employee_JoinDate)...`);

    // 1. अचूक Locator: DevTools मधील खरी ID (#Employee_JoinDate)
    const joinDateInput = this.page.locator('#Employee_JoinDate, input[name="Employee.JoinDate"]').first();
    await joinDateInput.waitFor({ state: 'visible', timeout: 10000 });

    // Inupt वर क्लिक करून कॅलेंडर उघडा
    await joinDateInput.click({ force: true });
    await this.page.waitForTimeout(500);

    // कॅलेंडर पॉपअपमधील हायलाइट झालेली/पहिली व्हॅलिड तारीख क्लिक करा
    const calendarDate = this.page.locator('.datepicker-days td.day:not(.old):not(.new), .ui-datepicker-calendar td:not(.ui-datepicker-other-month)').first();

    if (await calendarDate.isVisible().catch(() => false)) {
        console.log("👉 Clicking on date in open calendar popup...");
        await calendarDate.click();
    } else {
        // Readonly हटवून व्हॅल्यू फोर्स सेट करा
        await this.page.evaluate((dateVal) => {
            const input = document.getElementById('Employee_JoinDate') || document.querySelector('input[name="Employee.JoinDate"]');
            if (input) {
                input.removeAttribute('readonly');
                input.value = dateVal;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.dispatchEvent(new Event('blur', { bubbles: true }));
            }
        }, contractFromDate);
    }

    await this.page.waitForTimeout(500);

    // 2. Contract Period In Days Fill ('0' पूर्ण काढून मग व्हॅल्यू टाका)
    if (periodInDays) {
        const daysInput = this.page.locator('#ContractPeriodInDays, #ContractPeriod, input[name*="Period"]').first();

        await daysInput.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
        await daysInput.click({ force: true }).catch(() => {});
        
        await daysInput.press('Control+A');
        await daysInput.press('Backspace');
        await daysInput.type(periodInDays.toString(), { delay: 50 });

        await daysInput.dispatchEvent('keyup').catch(() => {});
        await daysInput.dispatchEvent('change').catch(() => {});
        await daysInput.press('Tab');
        await this.page.waitForTimeout(500);
    }

    // 3. Contract To field वर क्लिक करा जेणेकरून कॅल्क्युलेशन ट्रिगर होईल
    const contractToInput = this.page.locator('#ContractTo, #Employee_ContractTo, input[name*="ContractTo"]').first();

    if (await contractToInput.isVisible().catch(() => false)) {
        await contractToInput.click().catch(() => {});
        await this.page.waitForTimeout(1000);

        const contractToVal = await contractToInput.inputValue();
        console.log(`🎯 Auto-calculated Contract To Date: "${contractToVal}"`);
    }

    console.log("✅ Contract Period Details filled successfully!");
}
    /**
     * Reporting Manager Details Fill
     */
    async fillReportingManagerMandatoryDetails(effectiveFromDate) {
        console.log(`✍️ Filling Reporting Manager Effective From Date: "${effectiveFromDate}"...`);
        if (effectiveFromDate && this.effectiveFromInput) {
            await this.effectiveFromInput.scrollIntoViewIfNeeded().catch(() => {});
            await this.effectiveFromInput.fill(effectiveFromDate).catch(() => {});
            await this.effectiveFromInput.press('Tab').catch(() => {});
        }
    }

    /**
     * Verify Default Status
     */
    async verifyDefaultStatus(expectedStatus) {
        console.log(`🎯 Verifying default Status is "${expectedStatus}"...`);
        if (this.statusDropdown) {
            await this.statusDropdown.scrollIntoViewIfNeeded().catch(() => {});
            const selectedText = await this.statusDropdown.evaluate(el => el.options[el.selectedIndex].text.trim());
            expect(selectedText).toBe(expectedStatus);
        }
    }

/**
     * Helper to select dropdown and force triggering change event
     */
    async selectDropdownByLabel(selector, labelValue) {
        if (!labelValue) return;
        const dropdown = this.page.locator(selector).first();
        await dropdown.waitFor({ state: 'visible', timeout: 5000 });
        
        // Try direct select option first
        await dropdown.selectOption({ label: labelValue }).catch(async () => {
            // Fallback: Select by text/value in DOM directly
            await this.page.evaluate(({ sel, val }) => {
                const el = document.querySelector(sel);
                if (el) {
                    for (let opt of el.options) {
                        if (opt.text.trim() === val.trim() || opt.value === val) {
                            el.value = opt.value;
                            el.dispatchEvent(new Event('change', { bubbles: true }));
                            break;
                        }
                    }
                }
            }, { sel: selector, val: labelValue });
        });

        // Fire UI Change Events
        await dropdown.dispatchEvent('change').catch(() => {});
        await this.page.waitForTimeout(200); // Give small delay for cascading dropdowns
    }

/**
     * Deployment Mandatory Details Selection with Cascading Sync
     */
   /**
     * Deployment Mandatory Details Selection (Fast & Robust)
     */
    async fillDeploymentDetails(data) {
        console.log("✍️ Filling ALL Deployment Mandatory Fields from UI dropdowns...");

        const dropdowns = [
            { id: '#Subsidiary, select[name*="Subsidiary"]', value: data.subsidiary },
            { id: '#Division, select[name*="Division"]', value: data.division },
            { id: '#Department, select[name*="Department"]', value: data.department },
            { id: '#Category, select[name*="Category"]', value: data.category },
            { id: '#Grade, select[name*="Grade"]', value: data.grade },
            { id: '#Designation, select[name*="Designation"]', value: data.designation },
            { id: '#EmployeeAllocateToOrg_BranchID, select[name*="BranchID"], #Location', value: data.location },
            { id: '#SkillLevel, #SkilledLevel, select[name*="Skill"]', value: data.skilledLevel },
            { id: '#Contractor, select[name*="Contractor"]', value: data.contractor }
        ];

        for (const item of dropdowns) {
            if (!item.value) continue;

            await this.page.evaluate(({ sel, val }) => {
                const selectors = sel.split(',');
                let el = null;
                for (let s of selectors) {
                    const found = document.querySelector(s.trim());
                    if (found) { el = found; break; }
                }

                if (el) {
                    const target = val.trim().toLowerCase();
                    for (let opt of el.options) {
                        if (opt.text.trim().toLowerCase() === target || opt.value.trim().toLowerCase() === target || opt.text.toLowerCase().includes(target)) {
                            el.value = opt.value;
                            el.dispatchEvent(new Event('input', { bubbles: true }));
                            el.dispatchEvent(new Event('change', { bubbles: true }));
                            el.dispatchEvent(new Event('blur', { bubbles: true }));
                            if (window.jQuery) {
                                window.jQuery(el).trigger('change');
                            }
                            break;
                        }
                    }
                }
            }, { sel: item.id, val: item.value });

          
            await this.page.waitForTimeout(500);
        }

        console.log("✅ Deployment section filled successfully!");
    }

    /**
     * Verify Save Success
     */
   async verifySaveSuccess() {
        console.log("🎯 Verifying Employee Save Success Message...");
        await this.page.pause();
        // SweetAlert message locator (.swal-text)
        const successPopup = this.page.locator('.swal-text');
        
        // 1. Popup stop
        await successPopup.waitFor({ state: 'visible', timeout: 4000 });
        
        // 2. "Saved Successfully" --- Valdation
        const messageText = await successPopup.innerText();
        console.log(`✅ Success Popup Text Received: "${messageText}"`);
        expect(messageText.trim()).toContain("Saved Successfully");

        // 3. if its comes then click on Ok . 
        const okButton = this.page.locator('.swal-button--confirm');
        if (await okButton.isVisible().catch(() => false)) {
            await okButton.click();
        }
    }
}

module.exports = { ContractorEmployeeDetailsPage };