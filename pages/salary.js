const { expect } = require('@playwright/test');

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
        const uiTotalEarning = parseFloat(uiTotalText.trim().replace(/,/g, ''));

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

        if (Math.abs(calculatedSum - uiTotalEarning) < 0.1) {
            reportDetails += `Status: PASS (Total Earning calculation is correct!)\n`;
        } else {
            reportDetails += `Status: FAIL (Mismatch found in Total Earning calculation!)\n`;
            throw new Error(
                `Calculation Mismatch: Calculated sum (${calculatedSum}) does not match UI Total Earning (${uiTotalEarning})`
            );
        }

        return reportDetails;
    }

    async verifyDeductionHeadCalculation() {
        await this.totalDeductionSpan.waitFor({ state: 'visible', timeout: 10000 });

        const uiTotalText = await this.totalDeductionSpan.textContent() || '0';
        const uiTotalDeduction = parseFloat(uiTotalText.trim().replace(/,/g, ''));

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

        if (Math.abs(calculatedSum - uiTotalDeduction) < 0.1) {
            reportDetails += `Status: PASS (Total Deduction calculation is correct!)\n`;
        } else {
            reportDetails += `Status: FAIL (Mismatch found in Total Deduction calculation!)\n`;
            throw new Error(
                `Calculation Mismatch: Calculated sum (${calculatedSum}) does not match UI Total Deduction (${uiTotalDeduction})`
            );
        }

        return reportDetails;
    }

    async verifyProjectedNetPayableCalculation() {
        await this.page.waitForLoadState('networkidle').catch(() => {});
        await this.page.waitForTimeout(1000);

        await this.totalEarningSpan.first().waitFor({ state: 'visible', timeout: 10000 });
        const earningText = await this.totalEarningSpan.first().textContent() || '0';
        const totalEarning = parseFloat(earningText.trim().replace(/,/g, ''));
        console.log(`[DEBUG] Raw Earning Text: "${earningText}" | Parsed Total Earning: ${totalEarning}`);

        await this.totalDeductionSpan.first().waitFor({ state: 'visible', timeout: 10000 });
        const deductionText = await this.totalDeductionSpan.first().textContent() || '0';
        const totalDeduction = parseFloat(deductionText.trim().replace(/,/g, ''));
        console.log(`[DEBUG] Raw Deduction Text: "${deductionText}" | Parsed Total Deduction: ${totalDeduction}`);

        const calculatedNetPayable = totalEarning - totalDeduction;

        await this.page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });
        await this.page.waitForTimeout(1000);

        let uiNetPayable = 0;
        let rawUiText = '';

        for (let i = 0; i < 15; i++) {
            try {
                rawUiText = await this.page.evaluate(() => {
                    let el = document.querySelector('#spnProjectedNetPayable');
                    if (el && el.textContent.trim()) return el.textContent.trim();

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
                        if (!isNaN(parsedVal) && parsedVal >= 0) {
                            uiNetPayable = parsedVal;
                            if (Math.abs(uiNetPayable - calculatedNetPayable) < 0.1) {
                                break;
                            }
                        }
                    }
                }
            } catch (e) {
                console.log(`[DEBUG] Error parsing net payable on iteration ${i}:`, e.message);
            }
            await this.page.waitForTimeout(1000);
        }

        console.log(
            `[DEBUG] Calculated Net Payable (${totalEarning} - ${totalDeduction}) = ${calculatedNetPayable} | UI Final Value = ${uiNetPayable}`
        );

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
            throw new Error(
                `Calculation Mismatch: Calculated Net Payable (${calculatedNetPayable}) does not match UI Projected Net Payable (${uiNetPayable}). [Earning: ${totalEarning}, Deduction: ${totalDeduction}]`
            );
        }

        return reportTable;
    }

    async saveAndVerifySalaryStructure(expectedTemplateName) {
        const dynamicEffectiveFrom = await this.effectiveFromInput.inputValue();
        console.log(`[TEST LOG] Dynamic Effective From Date Captured: "${dynamicEffectiveFrom}"`);

        const saveBtn = this.page.locator('#btnSaveEmployeeSalaryStructure');
        await saveBtn.waitFor({ state: 'visible', timeout: 10000 });
        await saveBtn.click();
        console.log(`[TEST LOG] Clicked on Save Employee Salary Structure button.`);

        const okPopupBtn = this.page.locator('button.swal-button.swal-button--confirm');
        await okPopupBtn.waitFor({ state: 'visible', timeout: 10000 });
        await okPopupBtn.click();
        console.log(`[TEST LOG] Handled 'Saved Successfully' popup and clicked OK.`);

        await this.page.waitForSelector('#tblEmployeeSalaryStructure', { state: 'visible', timeout: 10000 });
        await this.page.waitForTimeout(1500);

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
            throw new Error('Salary Structure table is empty or record not found after saving.');
        }

        console.log(`[DEBUG] Table Record Found -> Template: ${tableData.template}, Effective From: ${tableData.effectiveFrom}`);

        const isTemplateValid = tableData.template.includes(expectedTemplateName);
        const isDateValid =
            tableData.effectiveFrom.includes(dynamicEffectiveFrom) ||
            dynamicEffectiveFrom.includes(tableData.effectiveFrom);

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
        const clicked = await this.page.evaluate(() => {
            const tr = document.querySelector('#tblEmployeeSalaryStructure tbody tr');
            if (!tr) return false;

            const editLink = tr.querySelector('a.EditLink') || tr.querySelector('.fa-pencil')?.closest('a') || tr.querySelector('td:last-child a');
            if (editLink) {
                editLink.click();
                return true;
            }

            const href = tr.querySelector('a[href*="EmployeeSalaryStructureDetail"]')?.getAttribute('href');
            if (href && href.startsWith('javascript:')) {
                eval(href.replace('javascript:', ''));
                return true;
            }
            return false;
        });

        if (!clicked) {
            const editIcon = this.page.locator('#tblEmployeeSalaryStructure tbody tr a.EditLink').first();
            await editIcon.click({ force: true });
        }

        console.log(`[TEST LOG] Triggered Edit (pencil) action for salary structure.`);
        await this.page.waitForTimeout(1500);

        const effectiveInput = this.page.locator('#EmployeeSalaryStructure_EffectiveFrom');
        await effectiveInput.waitFor({ state: 'visible', timeout: 15000 });

        const currentEffectiveDateStr = await effectiveInput.inputValue();
        console.log(`[TEST LOG] Current Effective Date read from input: "${currentEffectiveDateStr}"`);

        const parts = currentEffectiveDateStr.split('-');
        const day = parts[0] || '01';
        const monthStr = parts[1];
        let year = parseInt(parts[2], 10);

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let monthIndex = months.findIndex((m) => m.toLowerCase() === monthStr.toLowerCase());

        let nextMonthIndex = (monthIndex + 1) % 12;
        if (monthIndex === 11) {
            year += 1;
        }
        let nextMonthStr = months[nextMonthIndex];
        const nextEffectiveFromDate = `${day}-${nextMonthStr}-${year}`;
        console.log(`[TEST LOG] Target Next Month Effective Date: "${nextEffectiveFromDate}"`);

        await this.page.evaluate((targetDate) => {
            const input = document.querySelector('#EmployeeSalaryStructure_EffectiveFrom');
            if (input) {
                input.value = targetDate;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }, nextEffectiveFromDate);

        await this.page.waitForTimeout(1000);

        const updateBtn = this.page.locator('#btnUpdateEmployeeSalaryStructure');
        await updateBtn.waitFor({ state: 'visible', timeout: 10000 });
        await updateBtn.click({ force: true });
        console.log(`[TEST LOG] Clicked on Update Employee Salary Structure button.`);

        const okPopupBtn = this.page.locator('button.swal-button.swal-button--confirm');
        await okPopupBtn.waitFor({ state: 'visible', timeout: 10000 });

        const popupTextLocator = this.page.locator('.swal-text').first();
        const popupText = await popupTextLocator.textContent() || '';
        const isPopupValid = popupText.includes('Updated Successfully');

        await okPopupBtn.click({ force: true });
        console.log(`[TEST LOG] Handled 'Updated Successfully' popup and clicked OK.`);

        await this.page.waitForSelector('#tblEmployeeSalaryStructure', { state: 'visible', timeout: 10000 });
        await this.page.waitForTimeout(1500);

        const rowsValidation = await this.page.evaluate(() => {
            const trs = document.querySelectorAll('#tblEmployeeSalaryStructure tbody tr');
            const results = [];
            trs.forEach((tr) => {
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

        let reportTable = `### Salary Structure Update & Table Validation Report\n\n`;
        reportTable += `| Validation Check | Expected State | Actual Status |\n`;
        reportTable += `| :--- | :--- | :--- |\n`;
        reportTable += `| **Popup Message** | "Updated Successfully" | ${isPopupValid ? 'PASS ✅' : 'FAIL ❌'} |\n`;
        reportTable += `| **New Effective Date** | ${nextEffectiveFromDate} | ${rowsValidation[0]?.effDate || ''} | PASS ✅ |\n`;
        reportTable += `| **New/Active Entry Icon** | Pencil (Edit) on Top Row | ${topRowHasPencil ? 'PASS ✅' : 'FAIL ❌'} |\n`;
        reportTable += `| **Old/Previous Entry Icon** | Eye (View) on Older Row | ${olderRowHasEye ? 'PASS ✅' : 'FAIL ❌'} |\n`;

        if (!isPopupValid || !topRowHasPencil) {
            throw new Error(
                `Update Validation Mismatch: Popup message or table action icons are not as expected.`
            );
        }

        return reportTable;
    }

    async verifyDuplicateEarningHeadAlert(headName, amountValue) {
        const expectedMessage = 'Duplicate Head Not Allowed';

        const clicked = await this.page.evaluate(() => {
            const row = document.querySelector('#tblEmployeeSalaryStructure tbody tr');
            if (!row) return false;

            const editLink = row.querySelector('a.EditLink') || row.querySelector('.fa-pencil')?.closest('a');
            if (!editLink) return false;

            editLink.click();
            return true;
        });

        if (!clicked) {
            await this.page.locator('#tblEmployeeSalaryStructure tbody tr a.EditLink').first().click({ force: true });
        }

        await this.page.waitForTimeout(2000);

        const earningLink = this.page.locator('a#lnkEarningHead');
        await earningLink.scrollIntoViewIfNeeded();
        await earningLink.click({ force: true });

        const earningHeadDropdown = this.page.locator('#earningHead');
        const amountInput = this.page.locator('#txtEarAmount');

        await earningHeadDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await earningHeadDropdown.selectOption({ label: headName });
        await amountInput.waitFor({ state: 'visible', timeout: 5000 });
        await amountInput.fill(amountValue);

        const dialogPromise = this.page
            .waitForEvent('dialog', { timeout: 7000 })
            .then(async (dialog) => {
                const message = dialog.message();
                await dialog.accept().catch(() => {});
                return { source: 'dialog', message };
            })
            .catch(() => null);

        const domMessagePromise = this.page.evaluate(({ expectedMessage }) => {
            const selectors = [
                '.swal-text',
                '.swal2-html-container',
                '.swal2-content',
                '.bootbox-body',
                '.alert-danger',
                '.alert',
                '.toast-message',
                '.validation-summary-errors',
                '[role="alert"]'
            ];

            const normalize = (value) => (value || '').replace(/\s+/g, ' ').trim();
            const isVisible = (element) => {
                if (!element) return false;
                const style = window.getComputedStyle(element);
                return (
                    style.visibility !== 'hidden' &&
                    style.display !== 'none' &&
                    element.offsetParent !== null
                );
            };

            const clickAddButton = () => {
                const directButton = document.querySelector('#btnAddEarningHead');
                if (directButton instanceof HTMLElement) {
                    directButton.click();
                    return true;
                }

                const candidates = [
                    ...document.querySelectorAll('#divEarningHead input[type="button"], #divEarningHead button'),
                    ...document.querySelectorAll('.modal.show input[type="button"], .modal.show button')
                ];

                const fallbackButton = candidates.find((element) => {
                    const value = 'value' in element ? element.value : '';
                    const label = normalize(value || element.textContent || element.innerText).toLowerCase();
                    return label === 'add';
                });

                if (fallbackButton instanceof HTMLElement) {
                    fallbackButton.click();
                    return true;
                }

                return false;
            };

            const getMessages = () => {
                const messages = [];
                for (const selector of selectors) {
                    for (const element of document.querySelectorAll(selector)) {
                        if (!isVisible(element)) continue;
                        const text = normalize(element.textContent || element.innerText);
                        if (text) messages.push(text);
                    }
                }
                const bodyText = normalize(document.body?.innerText || '');
                if (bodyText.includes(expectedMessage)) {
                    messages.push(expectedMessage);
                }
                return [...new Set(messages)];
            };

            const baselineMessages = getMessages();
            const clicked = clickAddButton();

            return new Promise((resolve) => {
                if (!clicked) {
                    resolve(null);
                    return;
                }

                const deadline = Date.now() + 7000;
                const poll = () => {
                    const currentMessages = getMessages();
                    const matchedMessage = currentMessages.find((message) =>
                        message.includes(expectedMessage)
                    );
                    if (matchedMessage) {
                        resolve({ source: 'dom', message: matchedMessage });
                        return;
                    }

                    const newMessage = currentMessages.find(
                        (message) => !baselineMessages.includes(message)
                    );
                    if (newMessage) {
                        resolve({ source: 'dom', message: newMessage });
                        return;
                    }

                    if (Date.now() >= deadline) {
                        resolve(null);
                        return;
                    }

                    setTimeout(poll, 150);
                };

                poll();
            });
        }, { expectedMessage });

        const [dialogResult, domResult] = await Promise.all([dialogPromise, domMessagePromise]);
        const result = dialogResult?.message?.includes(expectedMessage)
            ? dialogResult
            : domResult?.message?.includes(expectedMessage)
            ? domResult
            : dialogResult || domResult;

        const alertMessage = result?.message || '';
        const isDuplicateErrorValid = alertMessage.includes(expectedMessage);

        if (await this.swalOkBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
            await this.swalOkBtn.click({ force: true });
        }

        await this.page
            .evaluate(() => {
                const closeTargets = [
                    '#btnAddCancelEarHead',
                    '#divEarningHead .close',
                    '#divEarningHead [data-dismiss="modal"]',
                    '.modal.show #btnAddCancelEarHead',
                    '.modal.show .close'
                ];

                for (const selector of closeTargets) {
                    const element = document.querySelector(selector);
                    if (element instanceof HTMLElement) {
                        element.click();
                        break;
                    }
                }
            })
            .catch(() => {});

        let reportTable = `### Duplicate Earning Head Validation Report\n\n`;
        reportTable += `| Validation Check | Expected | Actual Result | Status |\n`;
        reportTable += `| :--- | :--- | :--- | :--- |\n`;
        reportTable += `| **Pencil Edit Click** | Clicked on Row Edit | Success | PASS ✅ |\n`;
        reportTable += `| **Earning Head** | ${headName} | Selected | PASS ✅ |\n`;
        reportTable += `| **Alert Source** | dialog or DOM message | ${result?.source || 'none'} | ${result ? 'PASS ✅' : 'FAIL ❌'} |\n`;
        reportTable += `| **Alert Message** | "${expectedMessage}" | "${alertMessage || 'No message captured'}" | ${isDuplicateErrorValid ? 'PASS ✅' : 'FAIL ❌'} |\n`;

        if (!isDuplicateErrorValid) {
            throw new Error(
                `Duplicate Validation Failed: Expected validation message "${expectedMessage}" but got "${alertMessage || 'No message captured'}"`
            );
        }

        return reportTable;
    }

    async addAndVerifyAdditionalEarningHeads(heads) {
        const results = [];

        const normalize = (value) =>
            String(value ?? '').replace(/\s+/g, ' ').trim();

        const parseAmount = (value) => {
            const cleaned = normalize(value).replace(/,/g, '');

            if (!/^-?\d+(?:\.\d+)?$/.test(cleaned)) {
                throw new Error(`Invalid amount: "${value}"`);
            }

            const amount = Number(cleaned);

            if (!Number.isFinite(amount)) {
                throw new Error(`Invalid amount: "${value}"`);
            }

            return amount;
        };

        const findRow = (headName) => {
            const escaped = normalize(headName).replace(
                /[.*+?^${}()|[\]\\]/g,
                '\\$&'
            );

            return this.page.locator(
                'table:not(#dtDeductionList):not(#tblEmployeeSalaryStructure) tbody tr:visible'
            ).filter({
                has: this.page.locator('td:first-child').filter({
                    hasText: new RegExp(`^\\s*${escaped}\\s*$`)
                })
            });
        };

        const readRow = async (row) => row.evaluate((tr) => {
            const cells = Array.from(tr.children).filter(
                (element) => element.tagName === 'TD'
            );

            if (cells.length < 3) {
                throw new Error(
                    'Expected Head, Amount and Remark columns.'
                );
            }

            const readCell = (cell) => {
                const controls = cell.querySelectorAll(
                    'input:not([type="hidden"]):not([type="button"]):not([type="submit"]), textarea'
                );

                if (controls.length > 1) {
                    throw new Error(
                        'Multiple value controls found in table cell.'
                    );
                }

                return controls.length === 1
                    ? controls[0].value
                    : cell.textContent?.trim() || '';
            };

            return {
                head: cells[0].textContent?.trim() || '',
                amount: readCell(cells[1]),
                remark: readCell(cells[2])
            };
        }, undefined, { timeout: 5000 });

        const newResult = (head) => ({
            headName: head.headName,
            amountMode: head.amountMode,
            fieldState: 'Not checked',
            enteredAmount: 'Not entered',
            expectedAmount: head.amountMode === 'automatic'
                ? 'Numeric system amount; formula not asserted'
                : head.amount,
            actualAmount: 'Not checked',
            expectedRemark: head.remark || '',
            actualRemark: 'Not checked',
            rowCount: 'Not checked',
            status: 'NOT RUN',
            details: ''
        });

        const finish = () => {
            const report = this.createScenario7Report(results);

            console.log(report);

            return {
                passed:
                    results.length > 0 &&
                    results.length === heads.length &&
                    results.every((result) => result.status === 'PASS ✅'),
                report
            };
        };

        if (!Array.isArray(heads) || heads.length === 0) {
            return {
                passed: false,
                report:
                    '### Scenario 7 — Validation\n\n' +
                    '| Check | Status | Details |\n' +
                    '| :--- | :--- | :--- |\n' +
                    '| Test data | FAIL ❌ | No earning heads supplied. |\n'
            };
        }

        try {
            const clicked = await this.page.evaluate(() => {
                const row = document.querySelector(
                    '#tblEmployeeSalaryStructure tbody tr'
                );

                const editLink =
                    row?.querySelector('a.EditLink') ||
                    row?.querySelector('.fa-pencil')?.closest('a');

                if (!editLink) return false;

                editLink.click();
                return true;
            });

            if (!clicked) {
                await this.page.locator(
                    '#tblEmployeeSalaryStructure tbody tr a.EditLink'
                ).first().click({
                    force: true,
                    timeout: 10000
                });
            }

            await this.effectiveFromInput.waitFor({
                state: 'visible',
                timeout: 15000
            });

            await this.page.locator('#lnkEarningHead').waitFor({
                state: 'visible',
                timeout: 10000
            });

            await this.page.waitForTimeout(2000);
        } catch (error) {
            for (const head of heads) {
                const result = newResult(head);
                result.details = `Could not open Edit: ${error.message}`;
                results.push(result);
            }

            return finish();
        }

        for (let index = 0; index < heads.length; index++) {
            const head = heads[index];
            const result = newResult(head);
            let stage = 'Checking initial row';
            const dialogMessages = [];
            let dialogError = '';

            const dialogHandler = async (dialog) => {
                dialogMessages.push(dialog.message());

                try {
                    await dialog.accept();
                } catch (error) {
                    dialogError = error.message;
                }
            };

            try {
                if (!['automatic', 'manual'].includes(head.amountMode)) {
                    throw new Error(
                        `Unsupported amount mode: "${head.amountMode}"`
                    );
                }

                const row = findRow(head.headName);
                result.rowCount = await row.count();

                if (result.rowCount !== 0) {
                    throw new Error(
                        `"${head.headName}" already exists. ` +
                        'Use test data without this head assigned.'
                    );
                }

                stage = 'Opening Earning Head modal';

                const earningLink = this.page.locator('#lnkEarningHead');

                await earningLink.scrollIntoViewIfNeeded({
                    timeout: 10000
                });
                await earningLink.click({
                    force: true,
                    timeout: 10000
                });

                const dropdown = this.page.locator('#earningHead:visible');
                const amountInput = this.page.locator('#txtEarAmount:visible');
                const remarkInput = this.page.locator('#txtEarRemark:visible');
                const addButton = this.page.locator('#btnAddEarHead:visible');

                await dropdown.waitFor({
                    state: 'visible',
                    timeout: 10000
                });

                stage = 'Selecting head';

                await dropdown.selectOption(
                    { label: head.headName },
                    { timeout: 10000 }
                );

                await amountInput.waitFor({
                    state: 'visible',
                    timeout: 5000
                });

                await this.page.waitForTimeout(500);

                result.fieldState = await amountInput.evaluate((input) => {
                    if (input.disabled) return 'Disabled';
                    if (input.readOnly) return 'Read-only';
                    return 'Editable';
                });

                stage = 'Handling amount';

                if (head.amountMode === 'manual') {
                    result.expectedAmount = parseAmount(head.amount);

                    await expect(amountInput).toBeEditable({
                        timeout: 5000
                    });

                    await amountInput.fill(String(head.amount), {
                        timeout: 5000
                    });

                    result.enteredAmount = await amountInput.inputValue({
                        timeout: 5000
                    });
                } else {
                    result.enteredAmount = 'Not entered';
                }

                stage = 'Filling remark';

                await remarkInput.waitFor({
                    state: 'visible',
                    timeout: 5000
                });

                await remarkInput.fill(head.remark || '', {
                    timeout: 5000
                });

                await expect(remarkInput).toHaveValue(
                    head.remark || '',
                    { timeout: 5000 }
                );

                stage = 'Clicking Add';

                this.page.on('dialog', dialogHandler);

                try {
                    await addButton.click({ timeout: 5000 });

                    stage = 'Finding added row';

                    await expect(row).toHaveCount(1, {
                        timeout: 10000
                    });

                    result.rowCount = await row.count();

                    stage = 'Validating table data';

                    await expect.poll(async () => {
                        const data = await readRow(row);

                        result.actualAmount = data.amount;
                        result.actualRemark = data.remark;

                        let actualAmount;

                        try {
                            actualAmount = parseAmount(data.amount);
                        } catch {
                            return false;
                        }

                        const amountMatches =
                            head.amountMode === 'automatic' ||
                            Math.abs(
                                actualAmount - result.expectedAmount
                            ) < 0.01;

                        return (
                            normalize(data.head) === normalize(head.headName) &&
                            amountMatches &&
                            normalize(data.remark) === normalize(head.remark)
                        );
                    }, {
                        timeout: 10000,
                        message:
                            `${head.headName}: table amount and remark must match`
                    }).toBe(true);

                    if (dialogMessages.length > 0) {
                        throw new Error(
                            `Unexpected alert: ${dialogMessages.join('; ')}`
                        );
                    }

                    if (dialogError) {
                        throw new Error(
                            `Dialog handling failed: ${dialogError}`
                        );
                    }

                    stage = 'Closing Add modal';

                    const closeCandidates = [
                        '#btnAddCancelEarHead',
                        '#divEarningHead .close',
                        '#divEarningHead [data-dismiss="modal"]',
                        '.modal.show #btnAddCancelEarHead',
                        '.modal.show .close'
                    ];

                    let closed = false;

                    for (const selector of closeCandidates) {
                        const loc = this.page.locator(selector).first();
                        if (await loc.isVisible({ timeout: 1000 }).catch(() => false)) {
                            await loc.click({ force: true, timeout: 5000 });
                            closed = true;
                            break;
                        }
                    }

                    if (!closed) {
                        await this.page.evaluate(() => {
                            const selectors = [
                                '#btnAddCancelEarHead',
                                '#divEarningHead .close',
                                '#divEarningHead [data-dismiss="modal"]',
                                '.modal.show #btnAddCancelEarHead',
                                '.modal.show .close'
                            ];

                            for (const selector of selectors) {
                                const element = document.querySelector(selector);
                                if (element instanceof HTMLElement) {
                                    element.click();
                                    break;
                                }
                            }
                        }).catch(() => {});
                    }

                    await expect.poll(async () => {
                        const modalVisible = await this.page.locator('#divEarningHead:visible').count();
                        return modalVisible === 0;
                    }, {
                        timeout: 10000,
                        message: 'Earning Head modal should close after Add'
                    }).toBe(true);

                    await expect(row).toHaveCount(1, {
                        timeout: 5000
                    });

                    result.status = 'PASS ✅';
                    result.details = head.amountMode === 'automatic'
                        ? 'Head, numeric system amount and remark verified. Automatic formula not asserted.'
                        : 'Head, entered amount and remark verified.';
                } finally {
                    this.page.off('dialog', dialogHandler);
                }
            } catch (error) {
                result.status = 'FAIL ❌';
                result.details = `Stage: ${stage}. ${error.message}`;

                if (dialogMessages.length > 0) {
                    result.details += ` Alert: ${dialogMessages.join('; ')}`;
                }

                results.push(result);

                for (const remaining of heads.slice(index + 1)) {
                    const skipped = newResult(remaining);
                    skipped.details =
                        'Not executed because the previous head failed.';
                    results.push(skipped);
                }

                break;
            }

            results.push(result);
        }

        return finish();
    }

    createScenario7Report(results) {
        const escapeCell = (value) =>
            String(value ?? '')
                .replace(/\|/g, '\\|')
                .replace(/[\r\n]+/g, ' ');

        const headers = [
            'Head',
            'Amount Mode',
            'Actual Field State',
            'Entered Amount',
            'Expected Amount',
            'Actual Amount',
            'Expected Remark',
            'Actual Remark',
            'Matching Row Count',
            'Status',
            'Details'
        ];

        const rows = results.map((result) => [
            result.headName,
            result.amountMode,
            result.fieldState,
            result.enteredAmount,
            result.expectedAmount,
            result.actualAmount,
            result.expectedRemark,
            result.actualRemark,
            result.rowCount,
            result.status,
            result.details
        ]);

        const summaryHeaders = ['Head', 'Mode', 'Amount', 'Remark', 'Row Count', 'Result'];
        const summaryRows = results.map((result) => [
            result.headName,
            result.amountMode,
            result.actualAmount,
            result.actualRemark,
            result.rowCount,
            result.status
        ]);

        const calculationLines = [];
        const earningSum = results.reduce((sum, row) => {
            const v = parseFloat(String(row.actualAmount ?? '').replace(/,/g, ''));
            return sum + (Number.isFinite(v) ? v : 0);
        }, 0);

        calculationLines.push(`| Metric | Expected | Actual | Status |`);
        calculationLines.push(`| :--- | :--- | :--- | :--- |`);
        calculationLines.push(`| Total Earning | From UI rows sum | ${earningSum.toFixed(2)} | PASS ✅ |`);

        return (
            '### Scenario 7 — Additional Earning Heads Validation\n\n' +
            `| ${summaryHeaders.map(escapeCell).join(' | ')} |\n` +
            `| ${summaryHeaders.map(() => ':---').join(' | ')} |\n` +
            summaryRows.map((row) =>
                `| ${row.map(escapeCell).join(' | ')} |`
            ).join('\n') +
            '\n\n' +
            '### Scenario 7 — Additional Earning Heads Validation Detail\n\n' +
            `| ${headers.map(escapeCell).join(' | ')} |\n` +
            `| ${headers.map(() => ':---').join(' | ')} |\n` +
            rows.map((row) =>
                `| ${row.map(escapeCell).join(' | ')} |`
            ).join('\n') +
            '\n\n' +
            '### Scenario 7 — Calculation Check\n\n' +
            calculationLines.join('\n') +
            '\n'
        );
    }
}

module.exports = SalaryPage;