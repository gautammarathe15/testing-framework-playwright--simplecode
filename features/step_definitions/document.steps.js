const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const DocumentPage = require('../../pages/document');
const path = require('path');
const fs = require('fs');

let oldDetails = {};

When('User navigates to Document tab', async function () {
    this.documentPage = new DocumentPage(this.page);
    await this.documentPage.navigateToDocument();
});

When('User clicks on Create New Document tab', async function () {
    await this.documentPage.clickCreate();
});

Then('User should see valid file format text {string} is visible', async function (expectedText) {
    await expect(this.documentPage.validFormatText).toBeVisible();
    const text = await this.documentPage.validFormatText.textContent();
    expect(text).toContain(expectedText);
});

Then('User should see Save and Cancel buttons are visible', async function () {
    await expect(this.documentPage.saveBtn).toBeVisible();
    await expect(this.documentPage.cancelBtn).toBeVisible();
});

When('User clicks on Save Document button', async function () {
    await this.documentPage.clickSave();
});

When('User clicks on Update Document button', async function () {
    await this.documentPage.clickUpdate();
});

Then('User should see document popup message {string}', async function (expectedMessage) {
    const message = await this.documentPage.getPopupMessage();
    expect(message.trim()).toContain(expectedMessage);
});

Then('User clicks OK on document popup', async function () {
    await this.documentPage.handlePopup();
});

When('User selects Document Category as {string}', async function (categoryName) {
    if (categoryName === 'Salary') {
        await this.documentPage.selectCategory('9');
    } else if (categoryName === 'Permanent address proof') {
        await this.documentPage.selectCategory('1');
    } else {
        await this.documentPage.selectCategory({ label: categoryName }).catch(() => {});
    }
});

When('User selects Document Type as {string}', async function (docType) {
    await this.documentPage.selectDocumentType(docType);
});

When('User uploads invalid file format with .xlsx extension', async function () {
    const fileName = 'contractor_employee.xlsx';
    const absolutePath = path.resolve(__dirname, '../../testdata', fileName);
    if (!fs.existsSync(absolutePath)) {
        fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
        fs.writeFileSync(absolutePath, 'dummy text content');
    }
    await this.documentPage.uploadFile(fileName);
});

When('User uploads a valid file {string}', async function (fileName) {
    await this.documentPage.uploadFile(fileName); 
});

Then('User verifies document details in the list table', async function () {
    await this.documentPage.documentTable.waitFor({ state: 'visible', timeout: 10000 });
    const firstRowText = await this.documentPage.documentTable.locator('tbody tr').first().textContent();
    expect(firstRowText).toContain('Identity proof');
    expect(firstRowText).toContain('Passport');
});

When('User captures current document details as old details', async function () {
    await this.documentPage.documentTable.waitFor({ state: 'visible', timeout: 10000 });
    const cells = this.documentPage.documentTable.locator('tbody tr').first().locator('td');
    oldDetails.category = await cells.nth(0).textContent() || '';
    oldDetails.type = await cells.nth(1).textContent() || '';
    oldDetails.date = await cells.nth(2).textContent() || '';
});

When('User checks if edit pencil icon is visible and clicks on it', async function () {
    await expect(this.documentPage.editIcon).toBeVisible();
    await this.documentPage.clickEdit();
});

Then('User verifies updated document details in the list table and generates comparison report', async function () {
    await this.documentPage.documentTable.waitFor({ state: 'visible', timeout: 10000 });
    const cells = this.documentPage.documentTable.locator('tbody tr').first().locator('td');
    const newCategory = (await cells.nth(0).textContent() || '').trim();
    const newType = (await cells.nth(1).textContent() || '').trim();
    const newDate = (await cells.nth(2).textContent() || '').trim();

    expect(newCategory).toContain('Permanent address proof');
    expect(newType).toContain('Passport');

    console.log('\n==================================================');
    console.log('         DOCUMENT UPDATE COMPARISON REPORT          ');
    console.log('==================================================');
    console.log('| Field           | Old Details          | New Details          |');
    console.log('|-----------------|----------------------|----------------------|');
    console.log(`| Document Cat.   | ${oldDetails.category.trim().padEnd(20)} | ${newCategory.padEnd(20)} |`);
    console.log(`| Document Type   | ${oldDetails.type.trim().padEnd(20)} | ${newType.padEnd(20)} |`);
    console.log(`| Date / File     | ${oldDetails.date.trim().padEnd(20)} | ${newDate.padEnd(20)} |`);
    console.log('==================================================\n');
});

When('User checks if delete icon is visible and clicks on it', async function () {
    const deleteBtn = this.documentPage.page.locator('#btnDelete').first();
    await expect(deleteBtn).toBeVisible();
    await this.documentPage.clickDelete();
    await this.documentPage.clickSweetAlertCancel();
});

Then('User verifies document details still exist in the list table', async function () {
    await this.documentPage.documentTable.waitFor({ state: 'visible', timeout: 10000 });
    const rowCount = await this.documentPage.documentTable.locator('tbody tr').count();
    expect(rowCount).toBeGreaterThan(0);
});

When('User clicks on delete icon again and accepts the alert', async function () {
    this.page.once('dialog', async dialog => {
        await dialog.accept();
    });
    
    // Fixed: used this.documentPage.clickDelete() instead of undefined documentPage.clickDeleteIcon()
    await this.documentPage.clickDelete();
    
    const confirmBtn = this.page.locator('.bootbox-accept, .swal-button--confirm, button:has-text("OK"), button:has-text("Yes")').first();
    if (await confirmBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await confirmBtn.click();
    }
});

Then('User verifies document details are removed from the list table', async function () {
    await this.page.waitForTimeout(2000);
    const rowCount = await this.documentPage.documentTable.locator('tbody tr').count();
    if (rowCount > 0) {
        const text = await this.documentPage.documentTable.locator('tbody tr').first().textContent();
        expect(text).not.toContain('Permanent address proof');
    } else {
        expect(rowCount).toBe(0);
    }
});