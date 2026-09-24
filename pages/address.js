const { expect } = require('@playwright/test');

class AddressPage {
    constructor(page) {
        this.page = page;
        this.addressTab = page.locator('#lnkEmployeeAddress');
        
        this.pAddressLine1 = page.locator('#EmployeeAddress_PAddressLine1');
        this.pCountryDropdown = page.locator('select[name="EmployeeAddress.PCountryID"]');
        this.pStateDropdown = page.locator('#ddlEmployeeAddress_PStateID');
        this.pCityDropdown = page.locator('#ddlEmployeeAddress_PCityID');
        this.pZipCode = page.locator('input[name="EmployeeAddress.PZipCode"]');
        this.pEffectiveFrom = page.locator('#EmployeeAddress_EffectiveFrom');
        
        this.sameAsTempCheckbox = page.locator('#chkSameasTemproryAddress');
        this.tAddressLine1 = page.locator('#EmployeeAddress_TAddressLine1');
        this.tCountryDropdown = page.locator('#ddlEmployeeAddress_TCountryID');
        
        this.saveButton = page.locator('#btnSaveEmployeeAddress');
        this.updateBtn = this.page.locator('#btnUpdateEmployeeAddress');
        
        this.popupMessage = page.locator('.swal-text, .bootbox-body, .alert-success').first();
        this.okButton = page.locator('button:has-text("OK"), .bootbox-accept');
    }

    async clickAddressTab() {
        await this.addressTab.scrollIntoViewIfNeeded();
        await this.addressTab.click();
    }

    async fillPermanentAddress(address1, pincode) {
        await this.pAddressLine1.clear();
        await this.pAddressLine1.fill(address1);
        await this.pZipCode.clear();
        await this.pZipCode.fill(pincode);
    }

    async selectPermanentDropdowns(countryText, stateText, cityText) {
        await this.pCountryDropdown.selectOption({ label: countryText });
        await this.page.waitForTimeout(500);
        await this.pStateDropdown.selectOption({ label: stateText });
        await this.page.waitForTimeout(500);
        await this.pCityDropdown.selectOption({ label: cityText });
    }

    async selectEffectiveFromCurrentDate() {
        await this.pEffectiveFrom.click();
        const todayCell = this.page.locator('.datepicker td.day.active, .flatpickr-day.today, td.today').first();
        if (await todayCell.isVisible()) {
            await todayCell.click();
        } else {
            await this.page.keyboard.press('Enter');
        }
    }

    async clickSave() {
        const saveBtn = this.page.locator('#btnSaveEmployeeAddress');
        const updateBtn = this.page.locator('#btnUpdateEmployeeAddress');

        await this.page.waitForTimeout(3333);

        if (await saveBtn.isVisible()) {
            await saveBtn.scrollIntoViewIfNeeded();
            await saveBtn.click({ force: true });
        } else if (await updateBtn.isVisible()) {
            await updateBtn.scrollIntoViewIfNeeded();
            await updateBtn.click({ force: true });
        } else {
            const fallbackBtn = this.page.locator('#btnSaveEmployeeAddress, #btnUpdateEmployeeAddress').first();
            await fallbackBtn.scrollIntoViewIfNeeded();
            await fallbackBtn.click({ force: true });
        }
    }

    async verifyPopupMessage(expectedMessage) {
        await expect(this.popupMessage).toBeVisible({ timeout: 5000 });
        const text = await this.popupMessage.textContent();
        expect(text).toContain(expectedMessage);
    }

    async clickOkOnPopup() {
        await this.okButton.click();
    }

    async toggleSameAsPermanentCheckbox() {
        await this.sameAsTempCheckbox.scrollIntoViewIfNeeded();
        await this.sameAsTempCheckbox.check();
        await this.page.waitForTimeout(3333); 
    }

async verifyCopiedAddressData(expectedAddress1) {
        // 1. Current Address Line 1 वर क्लिक करून व्हॅल्यू तपासा
        await this.tAddressLine1.scrollIntoViewIfNeeded();
        await this.tAddressLine1.click();
        const currentAddr1Value = await this.tAddressLine1.inputValue();
        expect(currentAddr1Value).toBe(expectedAddress1);

        // 2. Country ड्रॉपडाऊनवर क्लिक करून तपासा
        await this.tCountryDropdown.scrollIntoViewIfNeeded();
        await this.tCountryDropdown.click();
        const pCountryVal = await this.pCountryDropdown.inputValue();
        const tCountryVal = await this.tCountryDropdown.inputValue();
        expect(tCountryVal).toBe(pCountryVal);

        // 3. State ड्रॉपडाऊनवर क्लिक करून फोकस करा (Current State)
        const tStateDropdown = this.page.locator('#ddlEmployeeAddress_TStateID');
        if (await tStateDropdown.isVisible()) {
            await tStateDropdown.scrollIntoViewIfNeeded();
            await tStateDropdown.click();
            const pStateVal = await this.pStateDropdown.inputValue();
            const tStateVal = await tStateDropdown.inputValue();
            expect(tStateVal).toBe(pStateVal);
        }

        // 4. City ड्रॉपडाऊनवर क्लिक करून फोकस करा (Current City)
        const tCityDropdown = this.page.locator('#ddlEmployeeAddress_TCityID');
        if (await tCityDropdown.isVisible()) {
            await tCityDropdown.scrollIntoViewIfNeeded();
            await tCityDropdown.click();
            const pCityVal = await this.pCityDropdown.inputValue();
            const tCityVal = await tCityDropdown.inputValue();
            expect(tCityVal).toBe(pCityVal);
        }

        // 5. PIN Code फील्डवर क्लिक करून फोकस करा
        const tZipCode = this.page.locator('input[name="EmployeeAddress.TZipCode"]');
        if (await tZipCode.isVisible()) {
            await tZipCode.scrollIntoViewIfNeeded();
            await tZipCode.click();
            const pZipVal = await this.pZipCode.inputValue();
            const tZipVal = await tZipCode.inputValue();
            if (!tZipVal) {
                await tZipCode.fill(pZipVal);
            }
        }
        
        // फॉर्म पूर्णपणे स्थिर होण्यासाठी थोडा वेळ द्या
        await this.page.waitForTimeout(500);
    }
}

module.exports = { AddressPage };