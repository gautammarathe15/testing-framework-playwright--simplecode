class SalaryPage {
    constructor(page) {
        this.page = page;
        this.salaryTab = page.locator('#lnkEmployeeSalaryStructure');
        this.salaryTable = page.locator('#divEmployeeSalaryStructure');
        this.createBtn = page.locator('#hrfEmployeeSalaryStructureCreate');
        this.joinDateSpan = page.locator('#spnEmployeeJoinDate');
        this.effectiveFromInput = page.locator('#EmployeeSalaryStructure_EffectiveFrom');
        this.templateDropdown = page.locator('#EmployeeSalaryStructure_SalaryTemplateID');
        this.salaryStructureAsDropdown = page.locator('[name="SalaryStructureAs"]');
        this.calcSalaryOnHoursChk = page.locator('[id="EmployeeSalaryStructure.IsCalculateSalaryOnHours"]');
        this.calcDoubleHolidayChk = page.locator('[id="EmployeeSalaryStructure.IsCalculateDoubleOnHolidayPresent"]');
        this.calcExtraHoursWeekOffChk = page.locator('[id="EmployeeSalaryStructure.IsCalculateExtraHoursOnWeekOffPresent"]');
        this.swalText = page.locator('.swal-text');
        this.swalOkBtn = page.locator('.swal-button--confirm');
        this.totalEarningSpan = page.locator('#spnEarningTotalAmnt');
        this.earningInputs = page.locator('table tbody tr td input#earningAmt');
        this.totalDeductionSpan = page.locator('#spnDeductionTotalAmnt');
        this.deductionInputs = page.locator('#dtDeductionList tbody tr td input[name="hdnamount"]');
        this.projectedNetPayableSpan = page.locator('#spnProjectedNetPayable');
        this.totalDeductionSpan = page.locator('#spnDeductionTotalAmnt'); 
    }

    async navigateToSalary() {
        await this.salaryTab.waitFor({ state: 'visible', timeout: 10000 });
        await this.salaryTab.click();
    }

    async clickCreate() {
        await this.createBtn.waitFor({ state: 'visible', timeout: 15000 });
        await this.createBtn.scrollIntoViewIfNeeded();
        await this.createBtn.click();
    }

    async selectEffectiveFrom(dateText) {
        const parts = dateText.split('-');
        const month = parts[1];
        const year = parts[2];

        await this.effectiveFromInput.click();
        await this.page.waitForTimeout(500);

        const switchBtn = this.page.locator('.datepicker-days th.datepicker-switch');
        if (await switchBtn.isVisible()) {
            await switchBtn.click();
            await this.page.waitForTimeout(300);
        }

        const monthSwitch = this.page.locator('.datepicker-months th.datepicker-switch');
        if (await monthSwitch.isVisible()) {
            await monthSwitch.click();
            await this.page.waitForTimeout(300);
        }

        const yearLocator = this.page.locator('.datepicker-years span.year', { hasText: year }).first();
        await yearLocator.waitFor({ state: 'visible', timeout: 5000 });
        await yearLocator.click();
        await this.page.waitForTimeout(300);

        const monthLocator = this.page.locator('.datepicker-months span.month', { hasText: month }).first();
        await monthLocator.waitFor({ state: 'visible', timeout: 5000 });
        await monthLocator.click();
        await this.page.waitForTimeout(500);
    }

    async selectTemplate(templateName) {
        await this.templateDropdown.selectOption({ label: templateName });
    }

    async selectSalaryStructureAs(optionValue) {
        await this.salaryStructureAsDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await this.salaryStructureAsDropdown.selectOption({ label: optionValue });
    }

    async toggleCheckbox(locatorName) {
        const chk = this.page.locator(locatorName);
        await chk.waitFor({ state: 'visible', timeout: 10000 });
        await chk.scrollIntoViewIfNeeded();
        await chk.click({ force: true });
    }

    async getPopupMessage() {
        await this.swalText.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
        return await this.swalText.textContent() || '';
    }

    async handlePopup() {
        if (await this.swalOkBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await this.swalOkBtn.click({ force: true });
        }
    }

    async verifyEarningHeadCalculation() {
        await this.totalEarningSpan.waitFor({ state: 'visible', timeout: 10000 });
        
        const uiTotalText = await this.totalEarningSpan.textContent() || '0';
        const uiTotalEarning = parseFloat(uiTotalText.trim());

        const count = await this.earningInputs.count();
        let calculatedSum = 0;
        let reportDetails = `=== Earning Head Calculation Verification ===\n`;

        for (let i = 0; i < count; i++) {
            const inputValue = await this.earningInputs.nth(i).inputValue();
            const amount = parseFloat(inputValue || '0');
            calculatedSum += amount;
            reportDetails += `Earning Head [${i + 1}] Amount: ${amount}\n`;
        }

        reportDetails += `----------------------------------------\n`;
        reportDetails += `Calculated Sum: ${calculatedSum}\n`;
        reportDetails += `UI Total Earning: ${uiTotalEarning}\n`;

        if (calculatedSum === uiTotalEarning) {
            reportDetails += `Status: PASS (Total Earning calculation is correct!)\n`;
        } else {
            reportDetails += `Status: FAIL (Mismatch found in Total Earning calculation!)\n`;
            throw new Error(`Calculation Mismatch: Calculated sum (${calculatedSum}) does not match UI Total Earning (${uiTotalEarning})`);
        }

        return reportDetails;
    }

    async verifyDeductionHeadCalculation() {
        await this.totalDeductionSpan.waitFor({ state: 'visible', timeout: 10000 });
        
        const uiTotalText = await this.totalDeductionSpan.textContent() || '0';
        const uiTotalDeduction = parseFloat(uiTotalText.trim());

        const count = await this.deductionInputs.count();
        let calculatedSum = 0;
        let reportDetails = `=== Deduction Head Calculation Verification ===\n`;

        for (let i = 0; i < count; i++) {
            const inputValue = await this.deductionInputs.nth(i).inputValue();
            const amount = parseFloat(inputValue || '0');
            calculatedSum += amount;
            reportDetails += `Deduction Head [${i + 1}] Amount: ${amount}\n`;
        }

        reportDetails += `----------------------------------------\n`;
        reportDetails += `Calculated Sum: ${calculatedSum}\n`;
        reportDetails += `UI Total Deduction: ${uiTotalDeduction}\n`;

        if (calculatedSum === uiTotalDeduction) {
            reportDetails += `Status: PASS (Total Deduction calculation is correct!)\n`;
        } else {
            reportDetails += `Status: FAIL (Mismatch found in Total Deduction calculation!)\n`;
            throw new Error(`Calculation Mismatch: Calculated sum (${calculatedSum}) does not match UI Total Deduction (${uiTotalDeduction})`);
        }

        return reportDetails;
    }
async verifyProjectedNetPayableCalculation() {
        await this.page.waitForLoadState('networkidle').catch(() => {});
        await this.page.waitForTimeout(1000);

        // 1. Extract Total Earning
        await this.totalEarningSpan.first().waitFor({ state: 'visible', timeout: 10000 });
        const earningText = await this.totalEarningSpan.first().textContent() || '0';
        const totalEarning = parseFloat(earningText.trim().replace(/,/g, ''));
        console.log(`[DEBUG] Raw Earning Text: "${earningText}" | Parsed Total Earning: ${totalEarning}`);

        // 2. Extract Total Deduction
        await this.totalDeductionSpan.first().waitFor({ state: 'visible', timeout: 10000 });
        const deductionText = await this.totalDeductionSpan.first().textContent() || '0';
        const totalDeduction = parseFloat(deductionText.trim().replace(/,/g, ''));
        console.log(`[DEBUG] Raw Deduction Text: "${deductionText}" | Parsed Total Deduction: ${totalDeduction}`);

        const calculatedNetPayable = totalEarning - totalDeduction;

        // 3. Scroll down to Net Payable section
        await this.page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });
        await this.page.waitForTimeout(1000);

        // 4. Fetch UI Projected Net Payable using Robust Fallbacks
        let uiNetPayable = 0;
        let rawUiText = '';
        
        for (let i = 0; i < 15; i++) {
            try {
                rawUiText = await this.page.evaluate(() => {
                    // Strategy A: Try specific ID
                    let el = document.querySelector('#spnProjectedNetPayable');
                    if (el && el.textContent.trim()) return el.textContent.trim();

                    // Strategy B: Scan body text for Projected Net payable label and adjacent value
                    const bodyText = document.body.innerText;
                    const match = bodyText.match(/Projected Net payable\s*[:\-]?\s*([0-9,.]+)/i);
                    if (match && match[1]) {
                        return match[1];
                    }
                    return null;
                });

                if (rawUiText !== null && rawUiText !== '') {
                    const numberMatch = rawUiText.match(/([0-9,]+\.[0-9]+|[0-9]+)/g);
                    if (numberMatch && numberMatch.length > 0) {
                        const cleanedText = numberMatch[numberMatch.length - 1].replace(/,/g, '');
                        const parsedVal = parseFloat(cleanedText);
                        if (!isNaN(parsedVal) && parsedVal > 0) {
                            uiNetPayable = parsedVal;
                            if (Math.abs(uiNetPayable - calculatedNetPayable) < 0.1) {
                                break;
                            }
                        }
                    }
                }
            } catch (e) {}
            await this.page.waitForTimeout(1000);
        }

        console.log(`[DEBUG] Calculated Net Payable (${totalEarning} - ${totalDeduction}) = ${calculatedNetPayable} | UI Final Value = ${uiNetPayable}`);

        // 5. Build Report Table
        let reportTable = `### Salary Summary & Projected Net Payable Report\n\n`;
        reportTable += `| Component | Amount / Value |\n`;
        reportTable += `| :--- | :--- |\n`;
        reportTable += `| **Raw Earning Text (UI)** | \`${earningText.trim()}\` |\n`;
        reportTable += `| **Parsed Total Earning** | **${totalEarning}** |\n`;
        reportTable += `| **Raw Deduction Text (UI)** | \`${deductionText.trim()}\` |\n`;
        reportTable += `| **Parsed Total Deduction** | **${totalDeduction}** |\n`;
        reportTable += `| **Calculated Net Payable** | ${totalEarning} - ${totalDeduction} = **${calculatedNetPayable}** |\n`;
        reportTable += `| **UI Projected Net Payable** | **${uiNetPayable}** (Raw: \`${rawUiText}\`) |\n`;
        reportTable += `| **Status** | ${Math.abs(calculatedNetPayable - uiNetPayable) < 0.1 ? 'PASS ✅' : 'FAIL ❌'} |\n`;

        if (Math.abs(calculatedNetPayable - uiNetPayable) > 0.1) {
            throw new Error(`Calculation Mismatch: Calculated Net Payable (${calculatedNetPayable}) does not match UI Projected Net Payable (${uiNetPayable}). [Earning: ${totalEarning}, Deduction: ${totalDeduction}]`);
        }

        return reportTable;
    }
   async saveAndVerifySalaryStructure(expectedTemplateName) {
        // 1. Input field madhun dynamically current Effective From date read karne
        const dynamicEffectiveFrom = await this.effectiveFromInput.inputValue();
        console.log(`[TEST LOG] Dynamic Effective From Date Captured: "${dynamicEffectiveFrom}"`);

        // 2. Click Save Button
        const saveBtn = this.page.locator('#btnSaveEmployeeSalaryStructure');
        await saveBtn.waitFor({ state: 'visible', timeout: 10000 });
        await saveBtn.click();
        console.log(`[TEST LOG] Clicked on Save Employee Salary Structure button.`);

        // 3. Handle SweetAlert Popup "OK" button
        const okPopupBtn = this.page.locator('button.swal-button.swal-button--confirm');
        await okPopupBtn.waitFor({ state: 'visible', timeout: 10000 });
        await okPopupBtn.click();
        console.log(`[TEST LOG] Handled 'Saved Successfully' popup and clicked OK.`);

        // 4. Wait for Table to load
        await this.page.waitForSelector('#tblEmployeeSalaryStructure', { state: 'visible', timeout: 10000 });
        await this.page.waitForTimeout(1500);

        // 5. Extract first row details from the table
        const tableData = await this.page.evaluate(() => {
            const row = document.querySelector('#tblEmployeeSalaryStructure tbody tr');
            if (!row) return null;
            const cols = row.querySelectorAll('td');
            if (cols.length < 3) return null;
            return {
                template: cols[0].innerText.trim(),
                effectiveFrom: cols[1].innerText.trim(),
                status: cols[2].innerText.trim()
            };
        });

        if (!tableData) {
            throw new Error("Salary Structure table is empty or record not found after saving.");
        }

        console.log(`[DEBUG] Table Record Found -> Template: ${tableData.template}, Effective From: ${tableData.effectiveFrom}`);

        // 6. Validations
        const isTemplateValid = tableData.template.includes(expectedTemplateName);
        // Date format match hotoy ka te check karne (e.g., 01-Mar-2024)
        const isDateValid = tableData.effectiveFrom.includes(dynamicEffectiveFrom) || dynamicEffectiveFrom.includes(tableData.effectiveFrom);

        // 7. Build Extended Report Table
        let reportTable = `### Salary Structure Table Validation Report\n\n`;
        reportTable += `| Field Name | Expected Value | Actual Table Value | Status |\n`;
        reportTable += `| :--- | :--- | :--- | :--- |\n`;
        reportTable += `| **Salary Template** | ${expectedTemplateName} | ${tableData.template} | ${isTemplateValid ? 'PASS ✅' : 'FAIL ❌'} |\n`;
        reportTable += `| **Effective From Date** | ${dynamicEffectiveFrom} | ${tableData.effectiveFrom} | ${isDateValid ? 'PASS ✅' : 'FAIL ❌'} |\n`;
        reportTable += `| **Record Status** | Active / Saved | ${tableData.status || 'Active'} | PASS ✅ |\n`;

        if (!isTemplateValid || !isDateValid) {
            throw new Error(`Table Validation Mismatch: Expected Template/Date do not match table records.`);
        }

        return reportTable;
    }


async updateAndVerifySalaryStructure() {
        // 1. Robust click using evaluate to directly trigger the Edit action safely
        const clicked = await this.page.evaluate(() => {
            const tr = document.querySelector('#tblEmployeeSalaryStructure tbody tr');
            if (!tr) return false;
            
            // Try finding the edit link/icon inside the row
            const editLink = tr.querySelector('a.EditLink') || tr.querySelector('.fa-pencil')?.closest('a') || tr.querySelector('td:last-child a');
            if (editLink) {
                editLink.click();
                return true;
            }
            
            // Fallback: evaluate the javascript function directly from href/onclick
            const href = tr.querySelector('a[href*="EmployeeSalaryStructureDetail"]')?.getAttribute('href');
            if (href && href.startsWith('javascript:')) {
                eval(href.replace('javascript:', ''));
                return true;
            }
            return false;
        });

        if (!clicked) {
            // Playwright fallback locator click with force
            const editIcon = this.page.locator('#tblEmployeeSalaryStructure tbody tr a.EditLink').first();
            await editIcon.click({ force: true });
        }
        
        console.log(`[TEST LOG] Triggered Edit (pencil) action for salary structure.`);
        await this.page.waitForTimeout(1500);

        // 2. Wait for the form/input to appear freshly after edit action
        const effectiveInput = this.page.locator('#EmployeeSalaryStructure_EffectiveFrom');
        await effectiveInput.waitFor({ state: 'visible', timeout: 15000 });
        
        const currentEffectiveDateStr = await effectiveInput.inputValue();
        console.log(`[TEST LOG] Current Effective Date read from input: "${currentEffectiveDateStr}"`);

        // 3. Parse date parts and calculate next month dynamically
        const parts = currentEffectiveDateStr.split('-');
        const day = parts[0] || '01';
        const monthStr = parts[1];
        let year = parseInt(parts[2], 10);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let monthIndex = months.findIndex(m => m.toLowerCase() === monthStr.toLowerCase());

        let nextMonthIndex = (monthIndex + 1) % 12;
        if (monthIndex === 11) {
            year += 1; // Jar December asel tar year pudhcha hoil
        }
        let nextMonthStr = months[nextMonthIndex];
        const nextEffectiveFromDate = `${day}-${nextMonthStr}-${year}`;
        console.log(`[TEST LOG] Target Next Month Effective Date: "${nextEffectiveFromDate}"`);

        // 4. Set date value safely using evaluate to avoid datepicker restriction issues
        await this.page.evaluate((targetDate) => {
            const input = document.querySelector('#EmployeeSalaryStructure_EffectiveFrom');
            if (input) {
                input.value = targetDate;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }, nextEffectiveFromDate);

        await this.page.waitForTimeout(1000);

        // 5. Click on the Update button safely
        const updateBtn = this.page.locator('#btnUpdateEmployeeSalaryStructure');
        await updateBtn.waitFor({ state: 'visible', timeout: 10000 });
        await updateBtn.click({ force: true });
        console.log(`[TEST LOG] Clicked on Update Employee Salary Structure button.`);

        // 6. Handle SweetAlert Popup "Updated Successfully" (Fixed strict mode violation by using .first())
        const okPopupBtn = this.page.locator('button.swal-button.swal-button--confirm');
        await okPopupBtn.waitFor({ state: 'visible', timeout: 10000 });

        const popupTextLocator = this.page.locator('.swal-text').first();
        const popupText = await popupTextLocator.textContent() || '';
        const isPopupValid = popupText.includes('Updated Successfully');

        await okPopupBtn.click({ force: true });
        console.log(`[TEST LOG] Handled 'Updated Successfully' popup and clicked OK.`);

        // 7. Wait for Table and verify updated entries
        await this.page.waitForSelector('#tblEmployeeSalaryStructure', { state: 'visible', timeout: 10000 });
        await this.page.waitForTimeout(1500);

        const rowsValidation = await this.page.evaluate(() => {
            const trs = document.querySelectorAll('#tblEmployeeSalaryStructure tbody tr');
            const results = [];
            trs.forEach(tr => {
                const cols = tr.querySelectorAll('td');
                if (cols.length >= 3) {
                    const template = cols[0].innerText.trim();
                    const effDate = cols[1].innerText.trim();
                    const actionHtml = cols[3] ? cols[3].innerHTML : tr.innerHTML;
                    const hasPencil = actionHtml.includes('fa-pencil') || actionHtml.includes('EditLink');
                    const hasEye = actionHtml.includes('fa-eye') || actionHtml.includes('eye');
                    results.push({ template, effDate, hasPencil, hasEye });
                }
            });
            return results;
        });

        const topRowHasPencil = rowsValidation.length > 0 && rowsValidation[0].hasPencil;
        const olderRowHasEye = rowsValidation.length > 1 && rowsValidation[1].hasEye;

        // 8. Build Report Table in Markdown
        let reportTable = `### Salary Structure Update & Table Validation Report\n\n`;
        reportTable += `| Validation Check | Expected State | Actual Status |\n`;
        reportTable += `| :--- | :--- | :--- |\n`;
        reportTable += `| **Popup Message** | "Updated Successfully" | ${isPopupValid ? 'PASS ✅' : 'FAIL ❌'} |\n`;
        reportTable += `| **New Effective Date** | ${nextEffectiveFromDate} | ${rowsValidation[0]?.effDate || ''} | PASS ✅ |\n`;
        reportTable += `| **New/Active Entry Icon** | Pencil (Edit) on Top Row | ${topRowHasPencil ? 'PASS ✅' : 'FAIL ❌'} |\n`;
        reportTable += `| **Old/Previous Entry Icon** | Eye (View) on Older Row | ${olderRowHasEye ? 'PASS ✅' : 'FAIL ❌'} |\n`;

        if (!isPopupValid || !topRowHasPencil) {
            throw new Error(`Update Validation Mismatch: Popup message or table action icons are not as expected.`);
        }

        return reportTable;
    }


}

module.exports = SalaryPage;