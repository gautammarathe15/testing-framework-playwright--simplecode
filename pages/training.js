class TrainingPage {
    constructor(page) {
        this.page = page;
        this.trainingTab = page.locator('#lnkEmployeeTraining');
        this.createTrainingBtn = page.locator('#hrfEmployeeTrainingCreate');
        this.programDropdown = page.locator('select#ProgramID, select[name="ProgramID"]');
        this.fromDateInput = page.locator('#FromDate');
        this.toDateInput = page.locator('#ToDate');
        this.totalDaysInput = page.locator('#TotalDays');
        this.hoursInput = page.locator('#HoursPerDay');
        this.conductedByInput = page.locator('input[name="ConductedBy"]');
        this.conductedCompanyInput = page.locator('input[name="ConductedCompany"]');
        this.saveBtn = page.locator('#btnSaveEmployeeTraining');
        this.swalText = page.locator('.swal-text');
        this.swalOkBtn = page.locator('.swal-button--confirm');
        this.joiningDateSpan = page.locator('span#spnEmployeeJoinDate');
        this.trainingTable = page.locator('#dtEmployeeTrainingList');
    }

    async navigateToTraining() {
        await this.trainingTab.waitFor({ state: 'visible', timeout: 10000 });
        await this.trainingTab.click();
    }

    async clickCreate() {
        await this.createTrainingBtn.waitFor({ state: 'visible', timeout: 10000 });
        await this.createTrainingBtn.click();
    }

    async selectProgram(value) {
        await this.programDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await this.programDropdown.selectOption(value);
    }

    async enterDates(fromDate, toDate) {
        if (fromDate) {
            await this.fromDateInput.waitFor({ state: 'visible', timeout: 10000 });
            await this.fromDateInput.evaluate((el, val) => {
                el.value = val;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
                el.dispatchEvent(new Event('blur', { bubbles: true }));
            }, fromDate);
        }
        if (toDate) {
            await this.toDateInput.waitFor({ state: 'visible', timeout: 10000 });
            await this.toDateInput.evaluate((el, val) => {
                el.value = val;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
                el.dispatchEvent(new Event('blur', { bubbles: true }));
            }, toDate);
        }
    }

    async enterDetails(hours, conductedBy, conductedCompany) {
        if (hours !== null) {
            await this.hoursInput.waitFor({ state: 'visible', timeout: 10000 });
            await this.hoursInput.evaluate((el, val) => {
                el.value = val;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
            }, hours);
        }
        if (conductedBy !== null) {
            await this.conductedByInput.waitFor({ state: 'visible', timeout: 10000 });
            await this.conductedByInput.fill('');
            if (conductedBy !== '') await this.conductedByInput.fill(conductedBy);
        }
        if (conductedCompany !== null) {
            await this.conductedCompanyInput.waitFor({ state: 'visible', timeout: 10000 });
            await this.conductedCompanyInput.fill('');
            if (conductedCompany !== '') await this.conductedCompanyInput.fill(conductedCompany);
        }
    }

    async clickSave() {
        await this.saveBtn.waitFor({ state: 'visible', timeout: 5000 });
       
        await this.saveBtn.click({ force: true });
    }

    async handlePopup() {
        
        const okBtn = this.swalOkBtn;
        if (await okBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
           
            await okBtn.click({ force: true });
        }
    }

    async getPopupMessage() {
        await this.swalText.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
        return await this.swalText.textContent() || '';
    }

   
    async getJoiningDate() {
        await this.joiningDateSpan.waitFor({ state: 'visible', timeout: 10000 });
        const text = await this.joiningDateSpan.textContent();
        return text ? text.trim() : '';
    }

    async getContractEndDate() {
        try {
            const bodyText = await this.page.locator('body').textContent();
            const match = bodyText.match(/Contract Period\s*:\s*[0-9]{1,2}-[A-Za-z]{3}-[0-9]{4}\s*-\s*([0-9]{1,2}-[A-Za-z]{3}-[0-9]{4})/);
            if (match && match[1]) {
                const dateObj = new Date(match[1].trim());
                if (!isNaN(dateObj)) {
                    let month = '' + (dateObj.getMonth() + 1);
                    let day = '' + dateObj.getDate();
                    const year = dateObj.getFullYear();
                    if (month.length < 2) month = '0' + month;
                    if (day.length < 2) day = '0' + day;
                    return [year, month, day].join('-');
                }
            }
        } catch (e) {}
        
        // Fallback: use current joining date year end or today if contract period not found
        const joinDateStr = await this.getJoiningDate();
        if (joinDateStr) {
            const d = new Date(joinDateStr);
            if (!isNaN(d)) {
                d.setFullYear(d.getFullYear() + 1);
                let month = '' + (d.getMonth() + 1);
                let day = '' + d.getDate();
                const year = d.getFullYear();
                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;
                return [year, month, day].join('-');
            }
        }
        return '2026-12-31';
    }
}

module.exports = TrainingPage;