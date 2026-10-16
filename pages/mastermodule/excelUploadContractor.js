import { expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import ExcelJS from 'exceljs';

export class ExcelUploadContractorPage {
    constructor(page) {
        this.page = page;

        this.excelUploadIcon = this.page.locator('a[href="#divEmployeeUpload"], #btnExport, a#btnExport').first();
        this.popupModal = this.page.locator('#divEmployeeUpload');
        this.popupTitle = this.page.locator('#myModalLabel3');
        this.headerCloseBtn = this.page.locator('#divEmployeeUpload button.close');
        this.footerCloseBtn = this.page.locator('#divEmployeeUpload .modal-footer button').first();

        this.fileInput = this.page.locator('input#documentFile[type="file"], #divEmployeeUpload input[type="file"]').first();
        this.uploadBtn = this.page.locator('input#btnUploadEmployee');
        this.successCount = this.page.locator('#spnSuccess');
        this.failedCount = this.page.locator('#spnFailed');

        this.failedTable = this.page.locator('#dtFailedStatusEmpList');
        this.failedStatusRows = this.page.locator('#dtFailedStatusEmpList tbody tr');
        this.failedStatusCell = this.page.locator('#dtFailedStatusEmpList tbody tr td').nth(2);

        this.aadhaarSearchIcon = this.page.locator(
            'th:has-text("Aadhaar") img.headerSearchIcon, th:has-text("Adhaar") img.headerSearchIcon, img[data-parentnameofproperty="AadharCardNo"]'
        ).first();
        this.aadhaarSearchInput = this.page.locator('#hsAadharCardNo');
        this.aadhaarSearchSubmitBtn = this.page.locator(
            'button[name="AadharCardNo"], img[data-parentnameofproperty="AadharCardNo"] + span button, th:has-text("Aadhaar") button'
        ).first();

        this.gridRows = this.page.locator('#divEmployeeList table tbody tr, table.dataTable tbody tr, table.table tbody tr');
        this.noRecordMsg = this.page.locator('table tbody tr td:has-text("No matching records found"), table tbody tr.dataTables_empty');

        this.batchUploadReportSummary = [];
        this.currentExcelEmployees = [];
    }

    async verifyExcelUploadIconVisible() {
        await this.excelUploadIcon.waitFor({ state: 'visible', timeout: 15000 });
        await expect(this.excelUploadIcon).toBeVisible();
    }

    async clickExcelUploadIcon() {
        await this.excelUploadIcon.click();
    }

    async verifyUploadPopupUI() {
        await this.popupModal.waitFor({ state: 'visible', timeout: 10000 });
        await expect(this.popupTitle).toHaveText('Employee Upload');
        await expect(this.footerCloseBtn).toBeVisible();
    }

    async verifyNoFileChosenInitially() {
        const fileInputValue = await this.fileInput.inputValue();
        expect(fileInputValue).toBe('');
    }

    async uploadLocalExcelFile(filePath) {
        const absoluteFilePath = path.isAbsolute(filePath)
            ? filePath
            : path.resolve(process.cwd(), filePath);

        await this.uploadSingleFile(absoluteFilePath);
    }

    async verifyUploadSuccessMessage() {
        await this.successCount.waitFor({ state: 'visible', timeout: 15000 });
        const successNum = parseInt((await this.successCount.textContent())?.trim() || '0', 10);
        expect(successNum).toBeGreaterThan(0);
    }

    async reuploadExcelFile(relativeFilePath) {
        const absoluteFilePath = path.isAbsolute(relativeFilePath)
            ? relativeFilePath
            : path.resolve(process.cwd(), relativeFilePath);

        await this.uploadSingleFile(absoluteFilePath);
    }

    async verifyStatusBasedOnFailedCount() {
        await this.failedCount.waitFor({ state: 'visible', timeout: 15000 });

        const failedNum = parseInt((await this.failedCount.textContent())?.trim() || '0', 10);

        if (failedNum > 0) {
            await expect(this.failedTable).toBeVisible();
            const rowCount = await this.failedStatusRows.count();

            for (let i = 0; i < rowCount; i++) {
                const text = (await this.failedStatusRows.nth(i).locator('td').nth(2).textContent().catch(() => ''))?.trim() || '';
                if (text) {
                    expect(text).toContain('FAILED');
                }
            }
        }
    }

    async uploadSingleFile(absoluteFilePath) {
        await this.openPopupIfNotOpen();
        await this.fileInput.setInputFiles([]);
        await this.fileInput.setInputFiles(absoluteFilePath);

        await this.uploadBtn.waitFor({ state: 'visible', timeout: 10000 });
        await this.uploadBtn.click();

        await this.successCount.waitFor({ state: 'visible', timeout: 15000 });
        await this.failedCount.waitFor({ state: 'visible', timeout: 15000 });
        await this.page.waitForTimeout(1500);
    }

    async closePopupIfOpen() {
        if (await this.popupModal.isVisible().catch(() => false)) {
            await this.footerCloseBtn.click();
            await this.popupModal.waitFor({ state: 'hidden', timeout: 5000 });
        }
    }

    async openPopupIfNotOpen() {
        if (!(await this.popupModal.isVisible().catch(() => false))) {
            await this.excelUploadIcon.click();
            await this.popupModal.waitFor({ state: 'visible', timeout: 10000 });
        }
    }

    normalizeHeader(value) {
        return String(value ?? '')
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '');
    }

    async readExcelEmployees(filePath) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);

        const worksheet = workbook.worksheets[0];
        if (!worksheet) {
            throw new Error(`No worksheet found in file: ${path.basename(filePath)}`);
        }

        const headers = new Map();

        worksheet.getRow(1).eachCell((cell, colNumber) => {
            headers.set(this.normalizeHeader(cell.text), colNumber);
        });

        const findColumn = aliases => {
            for (const alias of aliases) {
                if (headers.has(alias)) return headers.get(alias);
            }
            return null;
        };

        const aadhaarCol = findColumn([
            'aadharcardno',
            'aadhaarcardno',
            'adhaarcardno',
            'aadharno',
            'aadhaarno',
            'cardnumber',
            'cardno'
        ]);

        const codeCol = findColumn(['employeecode', 'empcode', 'code', 'employeeid']);
        const nameCol = findColumn(['employeename', 'empname', 'name', 'firstname']);

        if (!aadhaarCol) {
            throw new Error(`Aadhaar/Card Number column not found in Excel: ${path.basename(filePath)}`);
        }

        const employees = [];

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;

            const readCell = col => {
                if (!col) return '';
                const value = row.getCell(col).value;
                const text = typeof value === 'object'
                    ? (value?.text || value?.result || '')
                    : (value ?? '');
                return String(text).trim();
            };

            const aadhaar = readCell(aadhaarCol).replace(/[^0-9]/g, '').trim();
            const employeeCode = codeCol ? readCell(codeCol) : 'N/A';
            const employeeName = nameCol ? readCell(nameCol) : 'N/A';

            if (!aadhaar) return;

            employees.push({
                rowNumber,
                employeeCode,
                employeeName,
                aadhaar
            });
        });

        return employees;
    }

    async extractFailedAadhaarValuesFromPopup() {
        const failedAadhaars = [];
        const rowCount = await this.failedStatusRows.count();

        for (let i = 0; i < rowCount; i++) {
            const row = this.failedStatusRows.nth(i);
            const cells = row.locator('td');
            const cellCount = await cells.count();

            for (let c = 0; c < cellCount; c++) {
                const text = (await cells.nth(c).textContent().catch(() => ''))?.trim() || '';
                const digits = text.replace(/[^0-9]/g, '').trim();

                if (digits.length >= 4) {
                    failedAadhaars.push(digits);
                }
            }
        }

        return [...new Set(failedAadhaars)];
    }

    async searchByAadhaarAndVerify(aadhaar) {
        await this.closePopupIfOpen();
        await this.page.waitForTimeout(1000);

        if (await this.aadhaarSearchIcon.isVisible().catch(() => false)) {
            await this.aadhaarSearchIcon.click();
            await this.page.waitForTimeout(800);
        }

        await this.aadhaarSearchInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.aadhaarSearchInput.fill('');
        await this.aadhaarSearchInput.fill(aadhaar);

        if (await this.aadhaarSearchSubmitBtn.isVisible().catch(() => false)) {
            await this.aadhaarSearchSubmitBtn.click();
        } else {
            await this.aadhaarSearchInput.press('Enter');
        }

        await this.page.waitForTimeout(2500);

        const isNoRecord = await this.noRecordMsg.isVisible().catch(() => false);

        if (isNoRecord) {
            return {
                found: false,
                detailsVisible: false,
                employeeCode: 'N/A',
                employeeName: 'N/A'
            };
        }

        const last4Digits = String(aadhaar).slice(-4);
        const matchingRow = this.gridRows.filter({ hasText: last4Digits }).first();
        const rowVisible = await matchingRow.isVisible().catch(() => false);

        let extractedCode = 'N/A';
        let extractedName = 'N/A';

        if (rowVisible) {
            const cells = matchingRow.locator('td');
            const cellCount = await cells.count();

            if (cellCount >= 5) {
                const codeText = await cells.nth(0).textContent().catch(() => '');
                const firstNameText = await cells.nth(3).textContent().catch(() => '');
                const lastNameText = await cells.nth(4).textContent().catch(() => '');

                extractedCode = codeText ? codeText.trim() : 'N/A';
                const firstName = firstNameText ? firstNameText.trim() : '';
                const lastName = lastNameText ? lastNameText.trim() : '';
                extractedName = `${firstName} ${lastName}`.trim() || 'N/A';
            }
        }

        return {
            found: rowVisible,
            detailsVisible: rowVisible,
            employeeCode: extractedCode,
            employeeName: extractedName
        };
    }

    async clearAadhaarSearch() {
        if (await this.aadhaarSearchIcon.isVisible().catch(() => false)) {
            await this.aadhaarSearchIcon.click();
            await this.page.waitForTimeout(500);
        }
        await this.aadhaarSearchInput.fill('');
        if (await this.aadhaarSearchSubmitBtn.isVisible().catch(() => false)) {
            await this.aadhaarSearchSubmitBtn.click();
        } else {
            await this.aadhaarSearchInput.press('Enter');
        }
        await this.page.waitForTimeout(1000);
    }

    async verifyDynamicStatus(fileName, filePath) {
        await this.failedCount.waitFor({ state: 'visible', timeout: 15000 });

        const successNum = parseInt((await this.successCount.textContent()).trim(), 10) || 0;
        const failedNum = parseInt((await this.failedCount.textContent()).trim(), 10) || 0;

        const summary = {
            fileName,
            total: successNum + failedNum,
            passed: successNum,
            failed: failedNum,
            status: 'PASS',
            records: []
        };

        const excelEmployees = Array.isArray(this.currentExcelEmployees) ? this.currentExcelEmployees : [];
        const failedIdentifiers = await this.extractFailedAadhaarValuesFromPopup();

        for (const emp of excelEmployees) {
            const cleanCard = String(emp.aadhaar || '').replace(/[^0-9]/g, '').trim();
            const isFailedInPopup = failedIdentifiers.some(failVal => cleanCard.endsWith(failVal) || failVal.endsWith(cleanCard));

            summary.records.push({
                employeeName: emp.employeeName || 'N/A',
                employeeCode: emp.employeeCode || 'N/A',
                aadhaar: emp.aadhaar,
                uploadStatus: isFailedInPopup ? 'FAIL' : 'PASS',
                aadhaarSearchStatus: 'NOT CHECKED',
                detailsStatus: 'NOT CHECKED'
            });
        }

        await this.closePopupIfOpen();
        await this.page.waitForTimeout(1000);

        if (summary.records.length > 0) {
            for (const record of summary.records) {
                const result = await this.searchByAadhaarAndVerify(record.aadhaar);

                if (record.uploadStatus === 'PASS') {
                    if (result.found && result.detailsVisible) {
                        record.aadhaarSearchStatus = 'PASS ✅';
                        record.detailsStatus = 'SHOWING 🟢';
                        if (result.employeeCode !== 'N/A') record.employeeCode = result.employeeCode;
                        if (result.employeeName !== 'N/A') record.employeeName = result.employeeName;
                    } else {
                        record.aadhaarSearchStatus = 'FAIL ❌';
                        record.detailsStatus = 'NOT SHOWING 🔴';
                        summary.status = 'FAIL';
                    }
                } else {
                    if (!result.found) {
                        record.aadhaarSearchStatus = 'PASS (Not in Grid) ✅';
                        record.detailsStatus = 'NOT SHOWN 🟢';
                    } else {
                        record.aadhaarSearchStatus = 'FAIL (Found in Grid) ❌';
                        record.detailsStatus = 'SHOWING 🔴';
                        summary.status = 'FAIL';
                    }
                }

                await this.clearAadhaarSearch();
            }
        }

        this.batchUploadReportSummary.push(summary);
    }

    async getBatchUploadReportSummary() {
        return this.batchUploadReportSummary;
    }

    async uploadFolderFilesSequentially(relativeFolderPath) {
        const folderPath = path.resolve(process.cwd(), relativeFolderPath);
        const files = fs.readdirSync(folderPath)
            .filter(file => file.endsWith('.xlsx') && !file.startsWith('~$'));

        this.batchUploadReportSummary = [];

        for (let i = 0; i < files.length; i++) {
            const fileName = files[i];
            const filePath = path.join(folderPath, fileName);

            await this.closePopupIfOpen();

            this.currentExcelEmployees = await this.readExcelEmployees(filePath);

            await this.uploadSingleFile(filePath);
            await this.verifyDynamicStatus(fileName, filePath);
        }
    }
}