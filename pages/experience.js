class ExperiencePage {
    constructor(page) {
        this.page = page;
        this.experienceTab = page.locator('#lnkEmployeeExperience');
        this.createBtn = page.locator('#hrfEmployeeExperienceCreate');
        this.companyInput = page.locator('#CompanyName');
        this.fromDateInput = page.locator('#FromDate');
        this.toDateInput = page.locator('#ToDate');
        this.designationInput = page.locator('name="Designation"');
        this.hrVerifiedCheckbox = page.locator('#IsVerified');
        this.allSkillCheckbox = page.locator('#chkAllSkillSet');
        this.highSkilled = page.locator('#chbSkillSetID1');
        this.lowSkilled = page.locator('#chbSkillSetID2');
        this.midSkilled = page.locator('#chbSkillSetID3');
        this.saveButton = page.locator('#btnSaveEmployeeExperience');
        this.updateButton = page.locator('#btnUpdateEmployeeExperience');
        this.editButton = page.locator('a[name="btnEditEmployeeExperience"]').first();
        this.cancelButton = page.locator('#btnCancelEmployeeExperience');
        this.successPopup = page.locator('.swal-text');
        this.okButton = page.locator('.swal-button--confirm, .swal2-confirm');
        this.experienceTable = page.locator('#dtEmployeeExperienceList');
    }

    async clickExperienceTab() {
        await this.experienceTab.waitFor({ state: 'visible', timeout: 10000 });
        await this.experienceTab.click();
    }

    async clickCreate() {
        await this.createBtn.waitFor({ state: 'visible', timeout: 10000 });
        await this.createBtn.click();
    }

    async enterCompanyName(companyName) {
        await this.companyInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.companyInput.click();
        await this.companyInput.press('Control+A');
        await this.companyInput.press('Backspace');
        await this.companyInput.fill(companyName);
    }

    async selectDates() {
        const joinDateText = await this.page.locator('#spnEmployeeJoinDate').textContent();
        
        const parts = joinDateText.trim().split('-');
        const day = parseInt(parts[0], 10);
        const monthStr = parts[1];
        const year = parseInt(parts[2], 10);

        const months = {
            'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
            'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
        };
        const joinDateObj = new Date(year, months[monthStr], day);

        const expToDateObj = new Date(joinDateObj);
        expToDateObj.setDate(expToDateObj.getDate() - 1);

        const expFromDateObj = new Date(expToDateObj);
        expFromDateObj.setFullYear(expFromDateObj.getFullYear() - 1);

        const formatDate = (dateObj) => {
            const y = dateObj.getFullYear();
            const m = String(dateObj.getMonth() + 1).padStart(2, '0');
            const d = String(dateObj.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        };

        const fromDateStr = formatDate(expFromDateObj);
        const toDateStr = formatDate(expToDateObj);

        await this.fromDateInput.evaluate((node, val) => {
            node.value = val;
            node.dispatchEvent(new Event('input', { bubbles: true }));
            node.dispatchEvent(new Event('change', { bubbles: true }));
        }, fromDateStr);

        await this.toDateInput.evaluate((node, val) => {
            node.value = val;
            node.dispatchEvent(new Event('input', { bubbles: true }));
            node.dispatchEvent(new Event('change', { bubbles: true }));
        }, toDateStr);
    }

    async enterDesignation(designation) {
        await this.page.locator('input[name="Designation"]').fill(designation);
    }

    async checkHRVerified() {
        await this.hrVerifiedCheckbox.waitFor({ state: 'visible', timeout: 10000 });
        if (!(await this.hrVerifiedCheckbox.isChecked())) {
            await this.hrVerifiedCheckbox.check();
        }
    }

    async uncheckHRVerified() {
        await this.hrVerifiedCheckbox.waitFor({ state: 'visible', timeout: 10000 });
        if (await this.hrVerifiedCheckbox.isChecked()) {
            await this.hrVerifiedCheckbox.uncheck();
        }
    }

    async toggleAllSkillSet() {
        await this.allSkillCheckbox.click();
    }

    async uncheckLowSkilled() {
        await this.lowSkilled.waitFor({ state: 'visible', timeout: 10000 });
        if (await this.lowSkilled.isChecked()) {
            await this.lowSkilled.uncheck();
        }
    }

    async verifySkillsAutoSelected() {
        return await this.highSkilled.isChecked() && 
               await this.lowSkilled.isChecked() && 
               await this.midSkilled.isChecked();
    }

    async clickSave() {
        await this.saveButton.click();
    }

    async clickUpdate() {
        await this.updateButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.updateButton.click();
    }

    async clickEdit() {
        await this.editButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.editButton.click();
    }

    async clickCancel() {
        if (await this.cancelButton.isVisible()) {
            await this.cancelButton.click();
        }
    }

    async verifyExperienceDetails(companyName) {
        await this.experienceTable.waitFor({ state: 'visible', timeout: 5000 });
        const rowLocator = this.page.locator('#dtEmployeeExperienceList tbody tr');
        const text = await rowLocator.textContent();
        expect(text).toContain(companyName);
    }

    async handleBrowserDialog() {
        this.page.once('dialog', async dialog => {
            await dialog.accept();
        });
    }
}

module.exports = ExperiencePage;