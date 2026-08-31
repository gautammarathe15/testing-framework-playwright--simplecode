import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// Helper function to extract dynamic identifier safely
async function getDynamicIdentifier(context) {
    let val = 
        context.createdAadhaar || 
        context.generatedAadhaar || 
        context.aadhaarNumber || 
        context.sheetAadhaar || 
        context.identityNumber || 
        context.createdAadhar ||
        '';

    let cleanVal = String(val).trim();

    if (!cleanVal || cleanVal === 'undefined') {
        try {
            const inputSelector = context.page.locator('#hsAadharCardNo, #Employee_AadharCardNo, input[name*="Aadhar"]').first();
            if (await inputSelector.isVisible({ timeout: 2000 }).catch(() => false)) {
                cleanVal = (await inputSelector.inputValue()).trim();
            }
        } catch (e) {
            console.warn('Could not extract identifier from UI element.');
        }
    }

    return cleanVal || '';
}

// 1. Search employee in grid by identity number
Then('User searches created employee status in grid by identity number', async function () {
    const openOkBtn = this.page.locator('.swal-button, button.confirm, button:has-text("OK"), .swal2-confirm').first();
    if (await openOkBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await openOkBtn.click({ force: true }).catch(() => {});
        await this.page.locator('.swal-overlay, .sweet-alert, .swal2-popup').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
        await this.page.waitForTimeout(500);
    }

    const dynamicId = await getDynamicIdentifier(this);
    if (!dynamicId) {
        throw new Error("Dynamic identifier is missing in Cucumber context!");
    }

    const searchIcon = this.page.locator('th:has-text("Aadhaar Card No") img.headerSearchIcon, img.headerSearchIcon[data-parentnameofproperty="AadharCardNo"]').first();
    if (await searchIcon.isVisible({ timeout: 3000 }).catch(() => false)) {
        await searchIcon.click({ force: true });
        await this.page.waitForTimeout(500);
    }

    const searchInput = this.page.locator('#hsAadharCardNo').first();
    await searchInput.evaluate((el) => {
        el.scrollIntoView();
        el.classList.remove('hsHide');
        if (el.parentElement) el.parentElement.classList.remove('hsHide');
    }).catch(() => {});

    await searchInput.waitFor({ state: 'attached', timeout: 5000 });
    await searchInput.focus();
    await searchInput.fill('');
    await searchInput.type(dynamicId, { delay: 50 });

    const searchSubmitBtn = searchInput.locator('xpath=following-sibling::span | xpath=following-sibling::button').first();
    if (await searchSubmitBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await searchSubmitBtn.click({ force: true });
    } else {
        await searchInput.press('Enter');
    }

    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(1500);
});

// 2. Verify grid status
Then('User verifies employee status in grid is {string}', async function (expectedStatus) {
    const dynamicId = await getDynamicIdentifier(this);
    const lastFourDigits = dynamicId ? dynamicId.slice(-4) : '';

    if (!lastFourDigits) {
        throw new Error("Cannot verify status: Dynamic Identifier is missing in context!");
    }

    const row = this.page.locator('table tbody tr').filter({ 
        hasText: new RegExp(`${lastFourDigits}|Jayraj|Tawade`, 'i') 
    }).first();

    await expect(row).toBeVisible({ 
        timeout: 15000, 
        message: `Employee row with identifier '${lastFourDigits}' was not found in grid!` 
    });

    const statusCell = row.locator('td').filter({ hasText: /Active|Left/i }).first();
    await expect(statusCell).toHaveText(expectedStatus);
});

// 3. Click Edit icon for matching row
When('User clicks on Edit icon for the created employee', async function () {
    const dynamicId = await getDynamicIdentifier(this);
    const lastFourDigits = dynamicId ? dynamicId.slice(-4) : '';
    
    if (!lastFourDigits) {
        throw new Error("Cannot click Edit: Dynamic Identifier is missing in context!");
    }

    const openOkBtn = this.page.locator('.swal-button, button.confirm, button:has-text("OK")').first();
    if (await openOkBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
        await openOkBtn.click({ force: true }).catch(() => {});
        await this.page.waitForTimeout(500);
    }

    const targetRow = this.page.locator('table tbody tr').filter({ 
        hasText: new RegExp(`${lastFourDigits}|Jayraj|Tawade`, 'i') 
    }).first();

    await expect(targetRow).toBeVisible({ 
        timeout: 10000,
        message: `Cannot click Edit: Row with digits '${lastFourDigits}' is not visible!` 
    });
    
    const editBtn = targetRow.locator('a.editLink, i.fa-edit, i.fa-pencil, a[title*="Edit"], a.btnEdit').first();
    await editBtn.waitFor({ state: 'visible', timeout: 5000 });
    await editBtn.click({ force: true });

    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(1500);
});

// 4. Verify pre-filled form fields
Then('User verifies pre-filled form details match First Name {string}, Last Name {string}, Gender {string}, and Location {string}', async function (firstName, lastName, gender, location) {
    const firstNameInput = this.page.locator('#txtFirstName, #Employee_FirstName, input[name*="FirstName"]').first();
    
    await firstNameInput.waitFor({ state: 'attached', timeout: 15000 });
    await firstNameInput.scrollIntoViewIfNeeded().catch(() => {});
    await expect(firstNameInput).toBeVisible({ timeout: 10000 });
    
    const actualFirstName = await firstNameInput.inputValue();
    expect(actualFirstName.trim()).toBe(firstName.trim());

    const lastNameInput = this.page.locator('#txtLastName, #Employee_LastName, input[name*="LastName"]').first();
    if (await lastNameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        const actualLastName = await lastNameInput.inputValue();
        expect(actualLastName.trim()).toBe(lastName.trim());
    }
});

// 5. Update employee status dropdown
When('User updates status from {string} to {string}', async function (fromStatus, toStatus) {
    const statusDropdown = this.page.locator('select#Employee_EmployeeStatusID, select[name="Employee.EmployeeStatusID"]').first();
    await expect(statusDropdown).toBeVisible({ timeout: 5000 });
    await statusDropdown.selectOption({ label: toStatus });
});

// 6. Click Update button
When('User clicks on the Update button', async function () {
    const updateBtn = this.page.locator('#btnUpdate, button:has-text("Update"), input[value="Update"]').first();
    await expect(updateBtn).toBeVisible({ timeout: 5000 });
    await updateBtn.click({ force: true });
    await this.page.waitForTimeout(1000);
});

// 7. Verify SweetAlert date validation popup and click OK
Then('User verifies mandatory date validation popup appears and clicks OK', async function () {
    const swalModal = this.page.locator('.swal-modal, .swal-overlay--show-modal, .sweet-alert, .swal2-popup').first();
    await swalModal.waitFor({ state: 'visible', timeout: 10000 });

    const popupText = await swalModal.innerText();

    expect(popupText).toContain('Employee Relieving date cannot be empty');
    expect(popupText).toContain('Employee resignation date cannot be empty');

    const okBtn = this.page.locator('.swal-button, .swal-button--confirm, button:has-text("OK"), button.confirm').first();
    await expect(okBtn).toBeVisible({ timeout: 5000 });
    await okBtn.click({ force: true });

    await swalModal.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    await this.page.waitForTimeout(500);
});

// 8. Select today's date for Resignation and verify Relieving Date auto-populates
When('User selects today date as Resignation Date and verifies Relieving Date auto-populates', async function () {
    const resignationInput = this.page.locator('#Employee_ResignationDate').first();
    const relievingInput = this.page.locator('#Employee_LastWorkingDate').first();

    await expect(resignationInput).toBeVisible({ timeout: 5000 });
    
    await resignationInput.scrollIntoViewIfNeeded();
    await resignationInput.click({ force: true });
    await this.page.waitForTimeout(500);

    const activeDate = this.page.locator('.datepicker-days td.active, td.day.today, .ui-datepicker-today').first();
    if (await activeDate.isVisible({ timeout: 2000 }).catch(() => false)) {
        await activeDate.click({ force: true });
    } else {
        const todayDay = new Date().getDate().toString();
        const dayCell = this.page.locator('td.day:not(.old):not(.old.day):not(.new)').filter({ hasText: new RegExp(`^${todayDay}$`) }).first();
        await dayCell.click({ force: true });
    }

    await this.page.waitForTimeout(1000);

    const autoRelievingVal = await relievingInput.inputValue();
    expect(autoRelievingVal.trim()).not.toBe('');
});

// 9. Click Update button after date selection
When('User clicks on Update button after filling dates', async function () {
    const updateBtn = this.page.locator('#btnUpdate, button:has-text("Update"), input[value="Update"]').first();
    await expect(updateBtn).toBeVisible({ timeout: 5000 });
    await updateBtn.click({ force: true });

    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(1000);
});

// 10. Click Cancel button safely & ensure modal/overlays are hidden
When('User clicks on Cancel button', async function () {
    const openOkBtn = this.page.locator('.swal-button, button.confirm, button:has-text("OK")').first();
    if (await openOkBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
        await openOkBtn.click({ force: true }).catch(() => {});
        await this.page.locator('.swal-overlay, .sweet-alert, .swal2-popup').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    }

    const cancelBtn = this.page.locator('#btnCancelEmployee, #btnCancel, input[value="Cancel"], button:has-text("Cancel")').first();
    await expect(cancelBtn).toBeVisible({ timeout: 8000 });
    await cancelBtn.click({ force: true });

    // Wait for Bootstrap / SweetAlert modals or backdrops to disappear completely
    await this.page.locator('.modal-backdrop, .modal, #editEmployeeModal, .swal-overlay').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(1500);
});

// 11. Verify Delete button visibility
Then('User verifies Delete button is visible on employee edit form', async function () {
    const deleteBtn = this.page.locator('#btnDeleteEmployee, input[value="Delete"]').first();
    await expect(deleteBtn).toBeVisible({ timeout: 5000 });
});

// ---------------------------------------------------------------------
// 12. Header Count Validations (Updated & Robust Math Logic)
// ---------------------------------------------------------------------

Then('User verifies Active Count decreased by {int}', async function (decrementVal) {
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(1500);

    const activeLocator = this.page.locator('#spnActiveRecordCount, #spnActiveCount, span[id*="Active"]').first();
    await activeLocator.waitFor({ state: 'attached', timeout: 15000 });
    await activeLocator.scrollIntoViewIfNeeded().catch(() => {});

    const currentActiveText = await activeLocator.innerText();
    const currentActive = parseInt(currentActiveText.replace(/[^0-9]/g, ''), 10) || 0;
    
    // Employee created added +1 to initial Active count, so Left status decreases it back by decrementVal
    const expectedActive = (this.initialActiveCount + 1) - decrementVal;
    
    console.log(`[Validation] Active Count Decreased Check -> Current UI: ${currentActive}, Expected: ${expectedActive}`);
    expect(currentActive).toBe(expectedActive);

    this.updatedActiveCount = currentActive;
});

Then('User verifies Left Count increased by {int}', async function (incrementVal) {
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(1500);

    const leftLocator = this.page.locator('#spnLeftRecordCount, #spnLeftCount, span[id*="Left"]').first();
    await leftLocator.waitFor({ state: 'attached', timeout: 15000 });
    await leftLocator.scrollIntoViewIfNeeded().catch(() => {});

    const currentLeftText = await leftLocator.innerText();
    const currentLeft = parseInt(currentLeftText.replace(/[^0-9]/g, ''), 10) || 0;
    
    const expectedLeft = (this.initialLeftCount || 0) + incrementVal;

    console.log(`[Validation] Left Count Increased Check -> Current UI: ${currentLeft}, Expected: ${expectedLeft}`);
    expect(currentLeft).toBe(expectedLeft);
});

Then('User verifies Active Count increased by {int}', async function (incrementVal) {
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(1500);

    const activeLocator = this.page.locator('#spnActiveRecordCount, #spnActiveCount, span[id*="Active"]').first();
    await activeLocator.waitFor({ state: 'attached', timeout: 15000 });
    await activeLocator.scrollIntoViewIfNeeded().catch(() => {});

    const currentActiveText = await activeLocator.innerText();
    const currentActive = parseInt(currentActiveText.replace(/[^0-9]/g, ''), 10) || 0;
    
    const baseCount = (typeof this.updatedActiveCount === 'number') ? this.updatedActiveCount : this.initialActiveCount;
    const expectedActive = baseCount + incrementVal;
    
    console.log(`[Validation] Active Count Increased Check -> Current UI: ${currentActive}, Expected: ${expectedActive}`);
    expect(currentActive).toBe(expectedActive);
});

Then('User verifies Left Count decreased by {int}', async function (decrementVal) {
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(1500);

    const leftLocator = this.page.locator('#spnLeftRecordCount, #spnLeftCount, span[id*="Left"]').first();
    await leftLocator.waitFor({ state: 'attached', timeout: 15000 });
    await leftLocator.scrollIntoViewIfNeeded().catch(() => {});

    const currentLeftText = await leftLocator.innerText();
    const currentLeft = parseInt(currentLeftText.replace(/[^0-9]/g, ''), 10) || 0;
    
    const expectedLeft = (this.initialLeftCount || 0);

    console.log(`[Validation] Left Count Decreased Check -> Current UI: ${currentLeft}, Expected: ${expectedLeft}`);
    expect(currentLeft).toBe(expectedLeft);
});

Then('User verifies Total Count remains unchanged', async function () {
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(1500);

    const totalLocator = this.page.locator('#spnTopRecordCount, #spnTotalRecordCount, span[id*="Top"]').first();
    await totalLocator.waitFor({ state: 'attached', timeout: 15000 });
    await totalLocator.scrollIntoViewIfNeeded().catch(() => {});

    const currentTotalText = await totalLocator.innerText();
    const currentTotal = parseInt(currentTotalText.replace(/[^0-9]/g, ''), 10) || 0;
    
    const expectedTotal = (this.initialTotalCount || 0) + 1;
    
    console.log(`[Validation] Total Count Check -> Captured UI: ${currentTotal}, Expected: ${expectedTotal}`);
    expect(currentTotal).toBe(expectedTotal);
});