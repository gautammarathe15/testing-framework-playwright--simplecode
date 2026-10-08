const { expect } = require('@playwright/test');

class FamilyPage {
    constructor(page) {
        this.page = page;
        this.lnkFamilyMember = page.locator('#lnkFamilyMember');
        this.btnCreateFamilyMember = page.locator('#hrfFamilyMemberCreate');
        this.inputMemberName = page.locator('#MemberName');
        this.dropdownRelation = page.locator('#FamilyRelationID');
        this.dropdownGender = page.locator('#Gender');
        this.inputBirthdate = page.locator('#MemberBirthdate');
        this.btnSaveUpdate = page.locator('#btnUpdateFamilyMember, button:has-text("Save"), button:has-text("Update")').first();
        
        this.popupMessage = page.locator('.swal-text').first();
        this.btnPopupOk = page.locator('.swal-button--confirm, button:has-text("OK"), button:has-text("Close")').first();
        this.familyTableRows = page.locator('#dtFamilyMemberList tbody tr, table#dtFamilyMemberList tr');
    }

    async clickFamilyMemberTab() {
        await this.lnkFamilyMember.click();
    }

    async verifyCreateOptionVisible() {
        await expect(this.btnCreateFamilyMember).toBeVisible();
    }

    async clickCreateFamilyMember() {
        await this.btnCreateFamilyMember.click();
    }

    async enterMemberName(name) {
        await this.inputMemberName.click();
        await this.inputMemberName.fill('');
        await this.inputMemberName.fill(name);
    }

    async selectRelation(relationText) {
        await this.dropdownRelation.selectOption({ label: relationText });
    }

    async selectGender(genderText) {
        await this.dropdownGender.selectOption({ value: genderText });
    }

    async selectBirthdate(dateStr) {
        await this.inputBirthdate.click();
        await this.inputBirthdate.fill('');
        await this.inputBirthdate.fill(dateStr);
        await this.page.keyboard.press('Tab').catch(() => {});
    }

async clickSave() {
        const saveBtn = this.page.locator('#btnSaveFamilyMember, #btnSave, button:has-text("Save"), input[value*="Save"]').first();
        await saveBtn.waitFor({ state: 'visible', timeout: 15000 });
        await saveBtn.click({ force: true });
    }

    async clickUpdate() {
       
        const updateBtn = this.page.locator('#btnUpdateFamilyMember, input[value="Update"]:not(#btnUpdateEmployee)').first();
        
   
        await updateBtn.waitFor({ state: 'visible', timeout: 7300 });
        
        
        await updateBtn.click({ force: true });
    }

    async getValidationMessage() {
        const msgLocator = this.page.locator('.swal-text').first();
        await msgLocator.waitFor({ state: 'visible', timeout: 15000 });
        return await msgLocator.textContent();
    }

    async clickPopupOk() {
        const okButton = this.page.locator('button.swal-button--confirm').first();
        try {
            await okButton.waitFor({ state: 'visible', timeout: 10000 });
            await okButton.click({ force: true });
        } catch (e) {
            await this.page.keyboard.press('Enter');
        }
        await this.page.locator('.swal-overlay').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    }

   async clickEditIcon(memberName = "Rahul Darvitkar") {
        const table = this.page.locator('#dtFamilyMemberList, table').first();
        await table.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});

        const row = this.page.locator('#dtFamilyMemberList tr, table tr').filter({ hasText: memberName }).last();
        const editButton = row.locator('.fa-pencil, button:has(.fa-pencil), [name="btnEditFamilyMember"]').first();
        
        await editButton.waitFor({ state: 'visible', timeout: 15000 });
        await editButton.click({ force: true });
    }

    async verifyDetailsInGrid(expectedName, expectedRelation, expectedGender, expectedDate) {
        const rowText = await this.familyTableRows.allTextContents();
        const combinedText = rowText.join(' ');
        expect(combinedText).toContain(expectedName);
        if (expectedRelation) expect(combinedText).toContain(expectedRelation);
        if (expectedGender) expect(combinedText).toContain(expectedGender);
    }
}

module.exports = FamilyPage;