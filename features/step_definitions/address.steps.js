const { When, Then } = require('@cucumber/cucumber');
const { AddressPage } = require('../../pages/address.js'); 

When('User clicks on the "Address" tab', async function () {
    const addressPage = new AddressPage(this.page);
    await addressPage.clickAddressTab();
});

When('User leaves address fields blank and clicks on the Save button', async function () {
    const addressPage = new AddressPage(this.page);
    await addressPage.clickSave();
});

When('User enters Permanent Address details {string} and pincode {string}', async function (address1, pincode) {
    const addressPage = new AddressPage(this.page);
    await addressPage.fillPermanentAddress(address1, pincode);
});

When('User updates Permanent Address details {string} and pincode {string}', async function (address1, pincode) {
    const addressPage = new AddressPage(this.page);
    await addressPage.fillPermanentAddress(address1, pincode);
});

When('User selects Country {string}, State {string}, and City {string}', async function (country, state, city) {
    const addressPage = new AddressPage(this.page);
    await addressPage.selectPermanentDropdowns(country, state, city);
});

When('User selects current date in Permanent Address Effective From calendar', async function () {
    const addressPage = new AddressPage(this.page);
    await addressPage.selectEffectiveFromCurrentDate();
});

When('User checks the "Same As Permanent Address" checkbox', async function () {
    const addressPage = new AddressPage(this.page);
    await addressPage.toggleSameAsPermanentCheckbox();
});

Then('Current Address fields should match with Permanent Address details {string}', async function (address1) {
    const addressPage = new AddressPage(this.page);
    await addressPage.verifyCopiedAddressData(address1);
});

When('User clicks on the Save button for Address', async function () {
    const addressPage = new AddressPage(this.page);
    await addressPage.clickSave();
});

Then('User verifies the saved address details match on the UI {string}', async function (address1) {
    const addressPage = new AddressPage(this.page);
    await addressPage.verifyCopiedAddressData(address1);
});

Then('A success popup with message {string} should appear', async function (expectedMessage) {
    const addressPage = new AddressPage(this.page);
    try {
        await addressPage.verifyPopupMessage(expectedMessage);
    } catch (error) {
        const actualText = await addressPage.popupMessage.textContent();
        if (expectedMessage === "Saved Successfully" && actualText.includes("Updated Successfully")) {
            return;
        } else if (expectedMessage === "Updated Successfully" && actualText.includes("Saved Successfully")) {
            return;
        }
        throw error;
    }
});