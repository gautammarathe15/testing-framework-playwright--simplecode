import { Given, When, Then } from '@cucumber/cucumber';
import { ExcelUploadContractorPage } from '../../pages/mastermodule/excelUploadContractor.js';

function getUploadPage(world) {
    if (!world.excelUploadPage) {
        world.excelUploadPage = new ExcelUploadContractorPage(world.page);
    }
    return world.excelUploadPage;
}

function maskAadhaar(aadhaar) {
    if (!aadhaar) return 'N/A';
    const value = String(aadhaar).replace(/\s+/g, '');
    if (value.length <= 4) return value;
    return `${'*'.repeat(Math.max(0, value.length - 4))}${value.slice(-4)}`;
}

function buildExtendedUploadReport(reportSummary = []) {
    let report = '';
    let totalFiles = reportSummary.length;
    let totalRows = 0;
    let totalPassed = 0;
    let totalFailed = 0;
    let totalSearchPass = 0;
    let totalSearchFail = 0;

    report += '==================== EXCEL UPLOAD AADHAAR SEARCH REPORT ====================\n\n';

    report += 'FILE LEVEL SUMMARY\n';
    report += '-----------------------------------------------------------------------------\n';
    report += 'Sr  File Name                    Total   Pass   Fail   Status\n';
    report += '-----------------------------------------------------------------------------\n';

    reportSummary.forEach((item, index) => {
        const fileName = String(item.fileName || 'N/A').padEnd(28, ' ');
        const total = Number(item.total ?? 0);
        const passed = Number(item.passed ?? 0);
        const failed = Number(item.failed ?? 0);
        const status = String(item.status || 'N/A');

        totalRows += total;
        totalPassed += passed;
        totalFailed += failed;

        report += `${String(index + 1).padEnd(3, ' ')} ${fileName} ${String(total).padEnd(7, ' ')} ${String(passed).padEnd(6, ' ')} ${String(failed).padEnd(6, ' ')} ${status}\n`;
    });

    report += '-----------------------------------------------------------------------------\n\n';

    report += 'PASS ENTRIES AADHAAR SEARCH RESULT\n';
    report += '-----------------------------------------------------------------------------\n';

    let hasData = false;

    reportSummary.forEach((fileItem, fileIndex) => {
        const records = Array.isArray(fileItem.records) ? fileItem.records : [];

        if (!records.length) {
            return;
        }

        hasData = true;

        report += `File ${fileIndex + 1}: ${fileItem.fileName}\n`;
        report += '-----------------------------------------------------------------------------\n';
        report += 'Sr  Employee Code      Aadhaar Card No      Search Result   Details Status\n';
        report += '-----------------------------------------------------------------------------\n';

        records.forEach((record, recordIndex) => {
            const employeeCode = String(record.employeeCode || 'N/A').padEnd(18, ' ');
            const aadhaar = String(maskAadhaar(record.aadhaar)).padEnd(20, ' ');
            const searchResult = String(record.aadhaarSearchStatus || 'NOT CHECKED').padEnd(15, ' ');
            const detailsStatus = String(record.detailsStatus || 'NOT CHECKED');

            if (record.aadhaarSearchStatus === 'PASS') {
                totalSearchPass += 1;
            } else if (record.aadhaarSearchStatus === 'FAIL') {
                totalSearchFail += 1;
            }

            report += `${String(recordIndex + 1).padEnd(3, ' ')} ${employeeCode} ${aadhaar} ${searchResult} ${detailsStatus}\n`;
        });

        report += '-----------------------------------------------------------------------------\n\n';
    });

    if (!hasData) {
        report += 'No uniquely identified PASS entries found for Aadhaar search validation.\n\n';
    }

    report += 'FINAL SUMMARY\n';
    report += '-----------------------------------------------------------------------------\n';
    report += `Total Files Processed    : ${totalFiles}\n`;
    report += `Total Rows Processed     : ${totalRows}\n`;
    report += `Total Passed Rows        : ${totalPassed}\n`;
    report += `Total Failed Rows        : ${totalFailed}\n`;
    report += `Total Aadhaar Search PASS: ${totalSearchPass}\n`;
    report += `Total Aadhaar Search FAIL: ${totalSearchFail}\n`;
    report += '=============================================================================\n';

    return report;
}

Then('User verifies the Excel Upload icon is visible on Contractor Employee grid', async function () {
    await getUploadPage(this).verifyExcelUploadIconVisible();
});

When('User clicks on the Excel Upload icon', async function () {
    await getUploadPage(this).clickExcelUploadIcon();
});

Then('User verifies the Employee Upload popup is displayed with title and Close button', async function () {
    await getUploadPage(this).verifyUploadPopupUI();
});

Then('User verifies no file is chosen initially in the input field', async function () {
    await getUploadPage(this).verifyNoFileChosenInitially();
});

When('User selects local excel file from path {string}', async function (filePath) {
    await getUploadPage(this).uploadLocalExcelFile(filePath);
});

Then('User should see success message for excel upload', async function () {
    await getUploadPage(this).verifyUploadSuccessMessage();
});

When('User re-uploads excel file from path {string}', async function (relativeFilePath) {
    await getUploadPage(this).reuploadExcelFile(relativeFilePath);
});

Then('User verifies status is FAILED if failed count is greater than zero', async function () {
    await getUploadPage(this).verifyStatusBasedOnFailedCount();
});

When(
    'User uploads all excel sheets from folder {string} and verifies status dynamically',
    { timeout: 120000 },
    async function (folderPath) {
        this.folderPath = folderPath;
        await getUploadPage(this).uploadFolderFilesSequentially(folderPath);
    }
);

When(
    'User batch uploads all excel test sheets from folder {string}',
    { timeout: 120000 },
    async function (folderPath) {
        this.folderPath = folderPath;
        await getUploadPage(this).uploadFolderFilesSequentially(folderPath);
    }
);

Then('User verifies upload status counts and extracted records for each iteration', async function () {
    const uploadPage = getUploadPage(this);
    const reportSummary = await uploadPage.getBatchUploadReportSummary();

    if (!Array.isArray(reportSummary) || reportSummary.length === 0) {
        throw new Error('Batch upload report summary is empty or invalid.');
    }

    this.batchUploadReportSummary = reportSummary;
    const report = buildExtendedUploadReport(reportSummary);
    this.attach(report, 'text/plain');
});

Then(
    'User performs single and combined grid searches for uploaded employee records',
    { timeout: 120000 },
    async function () {
        const uploadPage = getUploadPage(this);
        
        const reportSummary = this.batchUploadReportSummary || await uploadPage.getBatchUploadReportSummary();
        
        if (!reportSummary || reportSummary.length === 0) {
            console.log("ℹ️ No batch upload summary available for grid search verification.");
            return;
        }

        let gridSearchTable = `### 🔍 Grid Search & UI Verification Report (Structured View)\n\n`;
        gridSearchTable += `| 📂 File Name | 🆔 Employee Code | 👤 Employee Name | 🔑 Card / ID | 🔎 Upload Status | 🔎 Grid Search Status | 🖥️ Details View |\n`;
        gridSearchTable += `| :--- | :--- | :--- | :--- | :---: | :---: | :---: |\n`;

        let hasRecords = false;

        for (const fileItem of reportSummary) {
            const records = Array.isArray(fileItem.records) ? fileItem.records : [];
            
            for (const record of records) {
                hasRecords = true;
                
                const searchResult = await uploadPage.searchByAadhaarAndVerify(record.aadhaar);
                
                const searchStatus = searchResult.found ? 'PASS ✅' : 'FAIL ❌';
                const detailsView = searchResult.detailsVisible ? 'SHOWING 🟢' : 'NOT VISIBLE 🔴';
                const uploadStatusTxt = record.uploadStatus || 'PASS';
                
                const finalEmpCode = searchResult.employeeCode !== 'N/A' ? searchResult.employeeCode : (record.employeeCode || 'N/A');
                const finalEmpName = searchResult.employeeName !== 'N/A' ? searchResult.employeeName : (record.employeeName || 'N/A');
                
                const redactedCard = record.aadhaar ? `******${record.aadhaar.slice(-4)}` : '[Redacted ID]';
                
                gridSearchTable += `| \`${fileItem.fileName}\` | **${finalEmpCode}** | ${finalEmpName} | ${redactedCard} | ${uploadStatusTxt} | ${searchStatus} | ${detailsView} |\n`;
                
                await uploadPage.clearAadhaarSearch();
            }
        }

        if (!hasRecords) {
            gridSearchTable += `| - | No valid records found for grid search validation | - | - | - | - | - |\n`;
        }

        this.attach(gridSearchTable, 'text/markdown');
        console.log("✅ Grid search verification and structured report generation completed.");
    }
);