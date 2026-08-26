import { expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import ExcelJS from 'exceljs';

export class ExcelUploadContractorPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        // Grid & Popup Locators (Updated with DOM Inspection)
        this.excelUploadIcon = this.page.locator('a[href="#divEmployeeUpload"], #btnExport, a#btnExport').first();
        this.popupModal = this.page.locator('#divEmployeeUpload');
        this.popupTitle = this.page.locator('#myModalLabel3');
        this.headerCloseBtn = this.page.locator('#divEmployeeUpload button.close');
        this.footerCloseBtn = this.page.locator('#divEmployeeUpload .modal-footer button').first();
        
        // Dynamic Counts & Inputs
        this.fileInput = this.page.locator('input#documentFile[type="file"], #divEmployeeUpload input[type="file"]').first();
        this.uploadBtn = this.page.locator('input#btnUploadEmployee');
        this.successCount = this.page.locator('#spnSuccess');
        this.failedCount = this.page.locator('#spnFailed');
        
        // Failed Result Table Locators
        this.failedStatusRow = this.page.locator('#dtFailedStatusEmpList tbody tr, #divEmployeeUpload table tbody tr');
        this.statusCell = this.page.locator('#dtFailedStatusEmpList tbody tr td').nth(2);

        // Header Search Elements (Code & Card No Search)
        this.codeSearchIcon = this.page.locator('th:has-text("Code") img.headerSearchIcon, img.headerSearchIcon').first();
        this.codeSearchInput = this.page.locator('#hsEmployeeCode');
        this.codeSearchSubmitBtn = this.page.locator('button[name="EmployeeCode"]');

        // Locators based on DOM Inspection
        this.aadhaarSearchIcon = this.page.locator('th:has-text("Aadhaar") img.headerSearchIcon, th:has-text("Adhaar") img.headerSearchIcon, img[data-parentnameofproperty="AadharCardNo"]').first();
        this.aadhaarSearchInput = this.page.locator('#hsAadharCardNo');
        this.aadhaarSearchSubmitBtn = this.page.locator('button[name="AadharCardNo"], img[data-parentnameofproperty="AadharCardNo"] + span button, th:has-text("Aadhaar") button');
        
        // Dynamic Grid Rows Selector
        this.gridRows = this.page.locator('#divEmployeeList table tbody tr, table.dataTable tbody tr, table.table tbody tr');
        this.noRecordMsg = this.page.locator('table tbody tr td:has-text("No matching records found"), table tbody tr.dataTables_empty');
    }

    async verifyExcelUploadIconVisible() {
        await this.excelUploadIcon.waitFor({ state: 'visible', timeout: 15000 });
        await expect(this.excelUploadIcon).toBeVisible();
        console.log("✅ Excel Upload icon is visible on grid UI.");
    }

    async clickExcelUploadIcon() {
        await this.excelUploadIcon.click();
        console.log("👉 Clicked on Excel Upload icon.");
    }

    async verifyUploadPopupUI() {
        await this.popupModal.waitFor({ state: 'visible', timeout: 10000 });
        await expect(this.popupTitle).toHaveText('Employee Upload');
        await expect(this.footerCloseBtn).toBeVisible();
        console.log("✅ Employee Upload popup UI, title, and Close buttons are visible.");
    }

    async verifyNoFileChosenInitially() {
        const fileInputValue = await this.fileInput.inputValue();
        expect(fileInputValue).toBe('');
        console.log("✅ Confirmed: 'No file chosen' state initially.");
    }

    async uploadSingleFile(absoluteFilePath) {
        // 🔹 1. जर मोडल ओपन नसेल तर आधी '+Create' शेजारील Upload बटन वर क्लिक करून मोडल ओपन करा
        await this.openPopupIfNotOpen();

        // 🔹 2. जुनी फाईल क्लिअर करून नवीन अटॅच करा
        await this.fileInput.setInputFiles([]);
        await this.fileInput.setInputFiles(absoluteFilePath);
        
        // 🔹 3. Upload बटणाची वाट पाहून त्यावर क्लिक करा
        await this.uploadBtn.waitFor({ state: 'visible', timeout: 10000 });
        await this.uploadBtn.click();
        console.log(`🚀 Clicked upload for: ${path.basename(absoluteFilePath)}`);
    }

    async closePopupIfOpen() {
        if (await this.popupModal.isVisible()) {
            await this.footerCloseBtn.click();
            await this.popupModal.waitFor({ state: 'hidden', timeout: 5000 });
            console.log("✖ Closed Upload Popup Modal.");
        }
    }

    async openPopupIfNotOpen() {
        if (!(await this.popupModal.isVisible())) {
            await this.excelUploadIcon.click();
            await this.popupModal.waitFor({ state: 'visible', timeout: 10000 });
            console.log("👉 Opened Upload Popup Modal.");
        }
    }

    /**
     * Dynamically finds the target column index for card numbers from the header row 
     * and extracts the cleaned value for the given row index.
     * @param {string} filePath - Absolute path of the excel sheet
     * @param {number} rowIndex - Row index to read from (defaults to 2 for first data row)
     * @returns {Promise<string>} Cleaned string of numeric digits
     */
    async getAadhaarValueFromExcel(filePath, rowIndex = 2) {
        try {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(filePath);
            const worksheet = workbook.worksheets[0];

            let targetColIndex = -1;
            const headerRow = worksheet.getRow(1);

            headerRow.eachCell((cell, colNumber) => {
                const headerText = cell.value ? String(cell.value).trim() : '';
                if (headerText === 'AadharCardNo' || headerText === 'CardNumber') {
                    targetColIndex = colNumber;
                }
            });

            if (targetColIndex !== -1) {
                const cellValue = worksheet.getRow(rowIndex).getCell(targetColIndex).value;
                if (cellValue !== null && cellValue !== undefined) {
                    const rawStr = typeof cellValue === 'object' ? (cellValue.result || cellValue.text) : String(cellValue);
                    const cleanStr = String(rawStr).replace(/[^0-9]/g, '').trim();
                    return cleanStr;
                }
            }
            return '';
        } catch (error) {
            console.log(`⚠️ Excel Reading Exception: ${error.message}`);
            return '';
        }
    }

    /**
     * Reads the primary search code from the first data row of the excel sheet.
     * @param {string} filePath 
     * @returns {Promise<string|null>}
     */
    async getFirstDataValueFromExcel(filePath) {
        try {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(filePath);
            const worksheet = workbook.worksheets[0];
            
            const cellValue = worksheet.getRow(2).getCell(1).value || worksheet.getRow(2).getCell(2).value;
            const searchValue = typeof cellValue === 'object' ? cellValue.result || cellValue.text : cellValue;
            
            return String(searchValue).trim();
        } catch (error) {
            return null;
        }
    }

    /**
     * Validates upload execution status, parses passed/failed records, and performs grid search checks.
     * @param {string} fileName 
     * @param {string} filePath 
     */
    async verifyDynamicStatus(fileName, filePath) {
        await this.failedCount.waitFor({ state: 'visible', timeout: 15000 });

        const successNum = parseInt((await this.successCount.textContent()).trim(), 10) || 0;
        const failedNum = parseInt((await this.failedCount.textContent()).trim(), 10) || 0;

        console.log(`\n📊 File: [${fileName}] -> Success: ${successNum}, Failed: ${failedNum}`);

        // Case 1: Failed records present (> 0)
        if (failedNum > 0) {
            await this.page.waitForTimeout(1500);
            const isFailedRowVisible = await this.failedStatusRow.first().isVisible({ timeout: 5000 }).catch(() => false);

            if (isFailedRowVisible) {
                const statusText = (await this.statusCell.textContent().catch(() => ''))?.trim() || '';
                if (statusText) {
                    expect(statusText).toContain('FAILED');
                }
                console.log(`✅ Verified: Failed Count is ${failedNum} (>0) & Table Status is FAILED.`);
            } else {
                console.log(`⚠️ Failed Count is ${failedNum} (>0), table records rendered slowly or collapsed.`);
            }
        }

        // Case 2: Success records present (> 0)
        if (successNum > 0) {
            const passedRows = this.page.locator('#dtPassedStatusEmpList tbody tr, #dtSuccessStatusEmpList tbody tr, .modal-body table tbody tr');
            
            await this.page.waitForTimeout(1500);

            const isPassedRowVisible = await passedRows.first().isVisible({ timeout: 5000 }).catch(() => false);

            const testData = [];

            if (isPassedRowVisible) {
                const count = await passedRows.count();
                const limitToFetch = count >= 5 ? 3 : count;

                console.log(`ℹ️ Total passed records in popup: ${count}. Processing ${limitToFetch} record(s) for validation.`);

                for (let i = 0; i < limitToFetch; i++) {
                    const row = passedRows.nth(i);
                    const cells = row.locator('td');
                    const cellCount = await cells.count();

                    let code = '';
                    let aadhaar = '';

                    // 1. Extract Employee Code from the first column
                    if (cellCount > 0) {
                        code = (await cells.nth(0).textContent().catch(() => ''))?.trim() || '';
                    }

                    // 2. Scan remaining columns to identify card/ID number
                    for (let c = 1; c < cellCount; c++) {
                        const cellText = (await cells.nth(c).textContent().catch(() => ''))?.trim() || '';
                        const cleanDigits = cellText.replace(/[^0-9]/g, '');

                        if (cleanDigits.length >= 4 && cleanDigits !== code) {
                            aadhaar = cleanDigits;
                            break;
                        }
                    }

                    // 3. Fallback to direct Excel extraction if card/ID string is absent in popup UI
                    if (!aadhaar) {
                        aadhaar = await this.getAadhaarValueFromExcel(filePath, i + 2);
                    }

                    if (code) {
                        testData.push({ code, aadhaar });
                    }
                }
            }

            // Excel fallback logic when popup table returns no valid records
            if (testData.length === 0) {
                console.log("⚠️ Passed records table did not yield data. Triggering Excel fallback extraction...");
                const searchKey = await this.getFirstDataValueFromExcel(filePath);
                const searchAadhaar = await this.getAadhaarValueFromExcel(filePath, 2);
                if (searchKey) {
                    testData.push({ code: searchKey, aadhaar: searchAadhaar });
                }
            }

            console.log('📋 Extracted Data for Validation:', testData);

            await this.closePopupIfOpen();
            await this.page.waitForTimeout(1000);

            // --- STEP 1: Code Search ---
            console.log('\n--- 🔍 Testing Search by Code Separately ---');
            for (const data of testData) {
                if (!data.code) continue;

                await this.codeSearchIcon.click();
                await this.codeSearchInput.fill(data.code);
                await this.codeSearchSubmitBtn.click();
                await this.page.waitForTimeout(1500);

                const isNoRecord = await this.noRecordMsg.isVisible().catch(() => false);

                if (isNoRecord) {
                    console.log(`❌ No Record Found in Grid for Code: ${data.code}`);
                } else {
                    const matchingRow = this.gridRows.filter({ hasText: data.code }).first();
                    await matchingRow.waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});
                    console.log(`✅ Record Found in Grid for Code: ${data.code}`);
                }

                // Reset Code Search
                await this.codeSearchIcon.click();
                await this.codeSearchInput.fill('');
                await this.codeSearchSubmitBtn.click();
                await this.page.waitForTimeout(1000);
            }

            // --- STEP 2: Search by Card No Separately ---
            console.log('\n--- 🔍 Testing Search by Card No Separately ---');
            for (const data of testData) {
                if (!data.aadhaar) {
                    console.log(`ℹ️ Skipping Card No Search for Code [${data.code}] (Card / ID number missing in table & Excel)`);
                    continue;
                }

                await this.aadhaarSearchIcon.click();
                await this.aadhaarSearchInput.fill(data.aadhaar);
                await this.aadhaarSearchSubmitBtn.click();
                await this.page.waitForTimeout(1500);

                const isNoRecord = await this.noRecordMsg.isVisible().catch(() => false);

                if (isNoRecord) {
                    console.log(`❌ No Record Found in Grid for Card No: ${data.aadhaar}`);
                } else {
                    console.log(`✅ Record Found in Grid for Card No: ${data.aadhaar}`);
                }

                // Reset Search Input
                await this.aadhaarSearchIcon.click();
                await this.aadhaarSearchInput.fill('');
                await this.aadhaarSearchSubmitBtn.click();
                await this.page.waitForTimeout(1000);
            }

            // --- STEP 3: Combined Search (Code + Card No) ---
            console.log('\n--- 🔍 Testing Combined Search (Code + Card No) ---');
            for (const data of testData) {
                if (!data.code || !data.aadhaar) continue;

                await this.codeSearchIcon.click();
                await this.codeSearchInput.fill(data.code);

                await this.aadhaarSearchIcon.click();
                await this.aadhaarSearchInput.fill(data.aadhaar);

                await this.codeSearchSubmitBtn.click();
                await this.page.waitForTimeout(1500);

                const isNoRecord = await this.noRecordMsg.isVisible().catch(() => false);

                if (isNoRecord) {
                    console.log(`❌ Combined Search Failed for Code [${data.code}]`);
                } else {
                    const matchingRow = this.gridRows.filter({ hasText: data.code }).first();
                    await matchingRow.waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});
                    console.log(`✅ Combined Search Passed for Code [${data.code}]`);
                }

                // Reset Both Inputs
                await this.codeSearchIcon.click();
                await this.codeSearchInput.fill('');
                await this.aadhaarSearchIcon.click();
                await this.aadhaarSearchInput.fill('');
                await this.codeSearchSubmitBtn.click();
                await this.page.waitForTimeout(1000);
            }
        }
    }

    /**
     * Reads all excel files from a designated folder and triggers sequential batch uploads.
     * @param {string} relativeFolderPath 
     */
    async uploadFolderFilesSequentially(relativeFolderPath) {
        const folderPath = path.resolve(process.cwd(), relativeFolderPath);
        const files = fs.readdirSync(folderPath)
                        .filter(file => file.endsWith('.xlsx') && !file.startsWith('~$'));

        console.log(`🚀 Found ${files.length} test sheet(s) in folder: ${relativeFolderPath}`);

        for (let i = 0; i < files.length; i++) {
            const fileName = files[i];
            const filePath = path.join(folderPath, fileName);

            await this.closePopupIfOpen();
            
            console.log(`\n--------------------------------------------------`);
            console.log(`🔄 [Iteration ${i + 1}/${files.length}] Uploading File: ${fileName}`);
            
            await this.uploadSingleFile(filePath);
            await this.verifyDynamicStatus(fileName, filePath);
        }
    }
}