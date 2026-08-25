import { Given, When, Then } from '@cucumber/cucumber';
import { ExcelUploadContractorPage } from '../../pages/mastermodule/excelUploadContractor.js';

let excelUploadPage;

Then('User verifies the Excel Upload icon is visible on Contractor Employee grid', async function () {
    excelUploadPage = new ExcelUploadContractorPage(this.page);
    await excelUploadPage.verifyExcelUploadIconVisible();
});

When('User clicks on the Excel Upload icon', async function () {
    await excelUploadPage.clickExcelUploadIcon();
});

Then('User verifies the Employee Upload popup is displayed with title and Close button', async function () {
    await excelUploadPage.verifyUploadPopupUI();
});

Then('User verifies no file is chosen initially in the input field', async function () {
    await excelUploadPage.verifyNoFileChosenInitially();
});

When('User selects local excel file from path {string}', async function (filePath) {
    await excelUploadPage.uploadLocalExcelFile(filePath);
});

Then('User should see success message for excel upload', async function () {
    await excelUploadPage.verifyUploadSuccessMessage();
});

When('User re-uploads excel file from path {string}', async function (relativeFilePath) {
    const uploadPage = new ExcelUploadContractorPage(this.page);
    await uploadPage.reuploadExcelFile(relativeFilePath);
});

Then('User verifies status is FAILED if failed count is greater than zero', async function () {
    const uploadPage = new ExcelUploadContractorPage(this.page);
    await uploadPage.verifyStatusBasedOnFailedCount();
});

When('User uploads all excel sheets from folder {string} and verifies status dynamically', { timeout: 84000 }, async function (folderPath) {
    const uploadPage = new ExcelUploadContractorPage(this.page);
    await uploadPage.uploadFolderFilesSequentially(folderPath);
});

When('User batch uploads all excel test sheets from folder {string}', async function (folderPath) {
    this.folderPath = folderPath;
});

Then('User verifies upload status counts and extracted records for each iteration', async function () {
});

Then('User performs single and combined grid searches for uploaded employee records', async function () {
    await this.excelUploadPage.uploadFolderFilesSequentially(this.folderPath);
});