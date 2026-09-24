export class QualificationPage {
    constructor(page) {
        this.page = page;
        
        // Locators
        this.lnkQualification = page.locator('#lnkEmployeeEducation');
        this.btnCreate = page.locator('#hrfEmployeeEducationCreate');
        this.educationTitleDropdown = page.locator('[name="EmployeeEducation.EducationTitleID"]');
        this.courseDegreeDropdown = page.locator('#EmployeeEducation_CourseDegreeID');
        this.streamInput = page.locator('#EmployeeEducation_Stream');
        this.hrVerifiedCheckbox = page.locator('#EmployeeEducation_IsVerified');
        this.universityDropdown = page.locator('#ddlEmployeeEducation_UniversityID');
        this.passingMonthDropdown = page.locator('#ddlEmployeeEducation_PassingMonth');
        this.passingYearInput = page.locator('#EmployeeEducation_PassingYear');
        this.saveButton = page.locator('#btnSaveEmployeeEducation');
        
        // Popups and Messages
        this.swalText = page.locator('.swal-text');
        this.okButton = page.locator('.swal-button');
    }

    async clickQualificationTab() {
        await this.lnkQualification.waitFor({ state: 'visible', timeout: 10000 });
        await this.lnkQualification.click();
    }

    async clickCreateQualification() {
        await this.btnCreate.waitFor({ state: 'visible', timeout: 10000 });
        await this.btnCreate.click();
        await this.educationTitleDropdown.waitFor({ state: 'visible', timeout: 15000 });
    }

    async selectEducationTitle(title) {
        await this.educationTitleDropdown.waitFor({ state: 'visible' });
        if (title === 'Graduate') {
            await this.educationTitleDropdown.selectOption({ value: '4' });
        } else {
            await this.educationTitleDropdown.selectOption({ label: title });
        }
    }

    async selectCourseDegree(degree) {
        await this.courseDegreeDropdown.waitFor({ state: 'visible' });
        if (degree === 'Test') {
            await this.courseDegreeDropdown.selectOption({ value: '2' });
        } else {
            await this.courseDegreeDropdown.selectOption({ label: degree });
        }
    }

    async enterStream(stream) {
        await this.streamInput.waitFor({ state: 'visible' });
        await this.streamInput.fill(stream);
    }

    async checkHrVerified() {
        if (await this.hrVerifiedCheckbox.isVisible()) {
            await this.hrVerifiedCheckbox.check();
        }
    }

    async selectUniversity(universityText) {
        await this.universityDropdown.waitFor({ state: 'visible', timeout: 20000 });
        
        try {
            // पहिले अचूक लेबल शोधण्याचा प्रयत्न करेल
            await this.universityDropdown.selectOption({ label: universityText });
        } catch (e) {
            // जर अचूक मिळाले नाही, तर पार्शियल मॅच किंवा उपलब्ध ऑप्शन्स तपासेल
            const options = await this.universityDropdown.locator('option').allTextContents();
            console.log("⚠️ Available University Options in Dropdown:", options);
            
            const matchingOption = options.find(opt => 
                opt.trim().toLowerCase().includes(universityText.toLowerCase()) || 
                universityText.toLowerCase().includes(opt.trim().toLowerCase())
            );
            
            if (matchingOption) {
                await this.universityDropdown.selectOption({ label: matchingOption });
            } else {
                throw new Error(`University matching "${universityText}" not found. Available options: ${options.join(', ')}`);
            }
        }
    }

    async selectPassingMonth(month) {
        await this.passingMonthDropdown.waitFor({ state: 'visible' });
        if (month === 'December') {
            await this.passingMonthDropdown.selectOption({ value: '12' });
        } else {
            await this.passingMonthDropdown.selectOption({ label: month });
        }
    }

    async enterPassingYear(year) {
        await this.passingYearInput.waitFor({ state: 'visible' });
        await this.passingYearInput.fill(year);
    }

    async clickSave() {
        await this.saveButton.scrollIntoViewIfNeeded();
        await this.saveButton.click();
    }

    async getPopupMessage() {
        await this.swalText.waitFor({ state: 'visible', timeout: 15000 });
        return await this.swalText.textContent();
    }

    async clickOkButton() {
        await this.okButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.okButton.click();
    }

    async clickEditQualification() {
        // Qualification table madhil Edit link/pencil icon sathi अचूक locator
        const editBtn = this.page.locator('table tbody tr').first().locator('a.EditLink[href*="EmpEducationDetails"]');
        await editBtn.waitFor({ state: 'visible', timeout: 15000 });
        await editBtn.click();
    }

    async clickUpdateQualification() {
        const updateBtn = this.page.locator('#btnUpdateEmployeeEducation, button:has-text("Update")');
        await updateBtn.first().waitFor({ state: 'visible', timeout: 15000 });
        await updateBtn.first().click();
    }
}