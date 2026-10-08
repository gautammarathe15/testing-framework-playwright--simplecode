const path = require('path');

class DocumentPage {
    constructor(page) {
        this.page = page;
        this.documentTab = page.locator('#lnkEmployeeDocument');
        this.createDocumentBtn = page.locator('#hrfEmployeeDocumentCreate');
        this.categoryDropdown = page.locator('#EmployeeDocument_DocumentCategoryID');
        this.documentTypeDropdown = page.locator('#EmployeeDocument_DocumentTypeID');
        this.fileInput = page.locator('#documentFile');
        this.validFormatText = page.locator('span.help-block:has-text("Valid File Format"):visible').first();
        this.saveBtn = page.locator('#btnSaveEmployeeDocument');
        this.updateBtn = page.locator('#btnUpdateEmployeeDocument');
        this.cancelBtn = page.locator('#btnCancelEmployeeDocument');
        this.swalText = page.locator('.swal-text');
        this.swalOkBtn = page.locator('.swal-button--confirm');
        this.documentTable = page.locator('#tblEmployeeDocument');
        this.editIcon = page.locator('#tblEmployeeDocument a.EditLink').first();
    }

    async navigateToDocument() {
        await this.documentTab.waitFor({ state: 'visible', timeout: 10000 });
        await this.documentTab.click();
    }

    async clickCreate() {
        await this.createDocumentBtn.waitFor({ state: 'visible', timeout: 10000 });
        await this.createDocumentBtn.click();
        await this.validFormatText.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    }

    async clickEdit() {
        await this.editIcon.waitFor({ state: 'visible', timeout: 10000 });
        await this.editIcon.scrollIntoViewIfNeeded();
        await this.editIcon.click();
    }

    async clickDelete() {
        const deleteIcon = this.page.locator('#btnDelete').first();
        await deleteIcon.waitFor({ state: 'visible', timeout: 10000 });
        await deleteIcon.scrollIntoViewIfNeeded();
        await deleteIcon.click();
    }

    async clickSweetAlertCancel() {
        const cancelBtn = this.page.locator('.swal-button--cancel');
        await cancelBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
        if (await cancelBtn.isVisible()) {
            await cancelBtn.click({ force: true });
        }
    }

    async clickSweetAlertConfirm() {
        const confirmBtn = this.page.locator('.swal-button--confirm');
        await confirmBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
        if (await confirmBtn.isVisible()) {
            await confirmBtn.click({ force: true });
        }
    }

    async selectCategory(value) {
        await this.categoryDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await this.categoryDropdown.selectOption(value);
    }

    async selectDocumentType(docType) {
        const dropdown = this.documentTypeDropdown;
        await dropdown.waitFor({ state: 'visible', timeout: 15000 });
        await this.page.waitForTimeout(1000);
        
        if (await dropdown.isVisible().catch(() => false)) {
            await dropdown.selectOption({ label: docType }).catch(async () => {
                await dropdown.selectOption({ index: 1 });
            });
        }
    }

    async uploadFile(fileName) {
        const absolutePath = path.resolve(process.cwd(), 'features', 'testdata', fileName);
        await this.fileInput.waitFor({ state: 'attached', timeout: 10000 });
        await this.fileInput.setInputFiles(absolutePath);
        await this.page.waitForTimeout(1000);
    }

    async clickSave() {
        await this.saveBtn.waitFor({ state: 'visible', timeout: 10000 });
        await this.saveBtn.click({ force: true });
    }

    async clickUpdate() {
        await this.updateBtn.waitFor({ state: 'visible', timeout: 10000 });
        await this.updateBtn.scrollIntoViewIfNeeded();
        await this.updateBtn.click({ force: true });
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
}

module.exports = DocumentPage;