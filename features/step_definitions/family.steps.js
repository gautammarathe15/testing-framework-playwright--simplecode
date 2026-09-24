const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const FamilyPage = require('../../pages/family');

let familyPage;
let oldDetails = {};
let updatedDetails = {};

When('User clicks on Family Member link', async function () {
    familyPage = new FamilyPage(this.page);
    await familyPage.clickFamilyMemberTab();
});

Then('User should see the Create Family Member option is visible', async function () {
    await familyPage.verifyCreateOptionVisible();
});

When('User clicks on the Create Family Member option', async function () {
    await familyPage.clickCreateFamilyMember();
});

When('User enters new family member name {string}', async function (name) {
    await familyPage.enterMemberName(name);
    oldDetails.name = name;
});

When('User selects relation option {string} from the Family Relation dropdown', async function (relation) {
    await familyPage.selectRelation(relation);
    if (!oldDetails.relation) {
        oldDetails.relation = relation;
    } else {
        updatedDetails.relation = relation;
    }
});

When('User selects gender {string} from the Gender dropdown', async function (gender) {
    await familyPage.selectGender(gender);
    if (!oldDetails.gender) {
        oldDetails.gender = gender;
    } else {
        updatedDetails.gender = gender;
    }
});

When('User selects family member birthdate {string}', async function (birthdate) {
    await familyPage.selectBirthdate(birthdate);
    if (!oldDetails.birthdate) {
        oldDetails.birthdate = birthdate;
    } else {
        updatedDetails.birthdate = birthdate;
    }
});

Then(/^User should see Family Member validation result message "(.+)"$/, async function (expectedMessage) {
    let actualMessage = await familyPage.getValidationMessage();
    
    if (expectedMessage === "Saved Successfully") {
        console.log("\n==================================================");
        console.log("📋 FAMILY MEMBER - OLD DETAILS EXECUTION REPORT:");
        console.log("- Name       :", oldDetails.name);
        console.log("- Relation   :", oldDetails.relation);
        console.log("- Gender     :", oldDetails.gender);
        console.log("- Birthdate  :", oldDetails.birthdate);
        console.log("- Status     :", actualMessage);
        console.log("==================================================\n");
    } else if (expectedMessage === "Updated Successfully") {
        console.log("\n==================================================");
        console.log("📋 FAMILY MEMBER - UPDATED DETAILS EXECUTION REPORT:");
        console.log("- Name       :", updatedDetails.name || oldDetails.name);
        console.log("- Relation   :", updatedDetails.relation);
        console.log("- Gender     :", updatedDetails.gender);
        console.log("- Birthdate  :", updatedDetails.birthdate);
        console.log("- Status     :", actualMessage);
        console.log("==================================================\n");
    }

    expect(actualMessage).toContain(expectedMessage);
});

Then('User clicks the OK button on the family popup', async function () {
    await familyPage.clickPopupOk();
});

Then('User verifies the newly added family member details exist in the grid with name {string}', async function (name) {
    await familyPage.verifyDetailsInGrid(name, oldDetails.relation, oldDetails.gender, oldDetails.birthdate);
});

When('User clicks on the Edit pencil icon for the family member entry', async function () {
    await familyPage.clickEditIcon();
});

When('User updates family member name to {string}', async function (name) {
    await familyPage.enterMemberName(name);
    updatedDetails.name = name;
});

Then('User verifies the updated family member details match in the grid:', async function (dataTable) {
    const expected = dataTable.hashes()[0];
    await familyPage.verifyDetailsInGrid(
        updatedDetails.name || oldDetails.name, 
        expected.Relation, 
        expected.Gender, 
        expected.Birthdate
    );
}); // <-- हा ब्रॅकेट इथे व्यवस्थित बंद केला आहे

When('User clicks on the Save button for Family Member', async function () {
    await familyPage.clickSave();
});

When('User clicks on the Update button for Family Member', async function () {
    await familyPage.clickUpdate();
});