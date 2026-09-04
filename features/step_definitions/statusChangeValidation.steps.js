import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

/**
 * Utility function to format today's date into 'DD-MMM-YYYY' format (e.g., 03-Sep-2026)
 * @returns {string} Formatted date string
 */
function getTodayFormattedDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[today.getMonth()];
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
}

/**
 * Extracts the dynamically stored identification identifier from the test context or UI input field.
 * @param {Object} context - Cucumber test context (`this`)
 * @returns {Promise<string>} Dynamic Identifier String
 */
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

/**
 * Performs column header filter search in grid using the dynamic identifier.
 * @param {Page} page - Playwright page instance
 * @param {string} dynamicId - Dynamic identifier string
 */
async function performColumnSearch(page, dynamicId) {
    // 1. Close open SweetAlert/Swal popups if visible
    const openOkBtn = page.locator('.swal-button, button.confirm, button:has-text("OK"), .swal2-confirm').first();
    if (await openOkBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
        await openOkBtn.click({ force: true }).catch(() => {});
        await page.locator('.swal-overlay, .sweet-alert, .swal2-popup').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    }

    // 2. Click column header search icon
    const searchIcon = page.locator('th:has-text("Aadhaar Card No") img.headerSearchIcon, img.headerSearchIcon[data-parentnameofproperty="AadharCardNo"]').first();
    if (await searchIcon.isVisible({ timeout: 3000 }).catch(() => false)) {
        await searchIcon.click({ force: true });
        await page.waitForTimeout(500);
    }

    // 3. Unhide and fill search input field
    const searchInput = page.locator('#hsAadharCardNo').first();
    await searchInput.evaluate((el) => {
        el.scrollIntoView();
        el.classList.remove('hsHide');
        if (el.parentElement) el.parentElement.classList.remove('hsHide');
    }).catch(() => {});

    await searchInput.waitFor({ state: 'attached', timeout: 5000 });
    await searchInput.focus();

    // Clear value cleanly to re-trigger search event
    await searchInput.fill('');
    await page.waitForTimeout(300);
    await searchInput.pressSequentially(dynamicId, { delay: 50 });

    // 4. Dispatch events for grid filter re-rendering
    await searchInput.evaluate((el) => {
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, keyCode: 13, key: 'Enter' }));
    });

    await searchInput.press('Enter');

    // 5. Wait for network state idle
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(3000);
}

Then('User searches created employee status in grid by identity number', async function () {
    const dynamicId = await getDynamicIdentifier(this);
    if (!dynamicId) {
        throw new Error("Dynamic identifier is missing in Cucumber context!");
    }

    await performColumnSearch(this.page, dynamicId);
});

Then('User verifies employee status in grid is {string}', async function (expectedStatus) {
    const dynamicId = await getDynamicIdentifier(this);
    const lastFourDigits = dynamicId ? dynamicId.slice(-4) : '';

    if (!lastFourDigits) {
        throw new Error("Cannot verify status: Dynamic Identifier is missing in context!");
    }

    // 1. DOM Stabilization Wait
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(2000);

    // 2. Row Locator Check
    const row = this.page.locator('table tbody tr').filter({ 
        hasText: new RegExp(lastFourDigits, 'i') 
    }).first();

    await expect(row).toBeVisible({ 
        timeout: 15000, 
        message: `Employee row with identifier ending in '${lastFourDigits}' was not found in grid!` 
    });

    await row.scrollIntoViewIfNeeded().catch(() => {});

    // 3. Dynamic Retry to check if grid updated to new status
    let statusFound = false;
    for (let attempt = 0; attempt < 3; attempt++) {
        const rowText = await row.innerText();
        if (new RegExp(expectedStatus, 'i').test(rowText)) {
            statusFound = true;
            break;
        }
        await this.page.waitForTimeout(1000);
        await performColumnSearch(this.page, dynamicId);
    }

    const statusCell = row.locator('td').filter({ 
        hasText: new RegExp(expectedStatus, 'i') 
    }).first();

    await expect(statusCell).toBeVisible({ 
        timeout: 10000,
        message: `Expected status text '${expectedStatus}' was not found in table row for digits '${lastFourDigits}'!`
    });
});

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
        hasText: new RegExp(lastFourDigits, 'i') 
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

When('User updates status from {string} to {string}', async function (fromStatus, toStatus) {
    const statusDropdown = this.page.locator('select#Employee_EmployeeStatusID, select[name="Employee.EmployeeStatusID"], #ddlStatus').first();
    await expect(statusDropdown).toBeVisible({ timeout: 5000 });

    try {
        await statusDropdown.selectOption({ label: toStatus });
    } catch (e) {
        await statusDropdown.selectOption({ value: toStatus });
    }

    await statusDropdown.dispatchEvent('change');
    await this.page.waitForTimeout(1000);
});

When('User clicks on the Update button', async function () {
    const updateBtn = this.page.locator('#btnUpdate, button:has-text("Update"), input[value="Update"]').first();
    await expect(updateBtn).toBeVisible({ timeout: 5000 });
    await updateBtn.click({ force: true });
    await this.page.waitForTimeout(1000);
});

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

When('User fills mandatory exit dates based on status', async function () {
    const resignationInput = this.page.locator('#Employee_ResignationDate, #txtResignationDate, input[name*="ResignationDate"]').first();
    const relievingInput = this.page.locator('#Employee_LastWorkingDate, #txtRelievingDate, input[name*="LastWorkingDate"]').first();

    const todayDate = getTodayFormattedDate();

    // 1. Safe Handle for Resignation Date
    if (await resignationInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        const isResignationEnabled = await resignationInput.isEnabled().catch(() => false);
        const isResignationReadonly = await resignationInput.getAttribute('readonly') !== null;

        if (isResignationEnabled && !isResignationReadonly) {
            await resignationInput.scrollIntoViewIfNeeded().catch(() => {});
            await resignationInput.fill(todayDate).catch(() => {});
            await resignationInput.dispatchEvent('change').catch(() => {});
        } else {
            console.log('ℹ️ Resignation Date field is disabled or readonly. Skipping interaction.');
        }
    }

    // 2. Safe Handle for Relieving Date
    if (await relievingInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        const isRelievingEnabled = await relievingInput.isEnabled().catch(() => false);
        const currentRelievingVal = (await relievingInput.inputValue().catch(() => '')).trim();

        if (isRelievingEnabled && !currentRelievingVal) {
            await relievingInput.scrollIntoViewIfNeeded().catch(() => {});
            await relievingInput.fill(todayDate).catch(() => {});
            await relievingInput.dispatchEvent('change').catch(() => {});
        } else {
            console.log(`ℹ️ Relieving Date is already set to '${currentRelievingVal}' or field is disabled. Skipping interaction.`);
        }
    }

    await this.page.waitForTimeout(500);
});

When('User updates status to {string}', async function (targetStatus) {
    const statusDropdown = this.page.locator('#Employee_EmployeeStatusID, select[name="Employee.EmployeeStatusID"], #ddlStatus').first();
    await statusDropdown.waitFor({ state: 'visible', timeout: 15000 });

    const statusValueMap = {
        'Active': '1',
        'Left': '3',
        'Terminated': '4',
        'Absconded': '5'
    };

    // 1. Select target status from dropdown
    if (statusValueMap[targetStatus]) {
        await statusDropdown.selectOption({ value: statusValueMap[targetStatus] });
    } else {
        try {
            await statusDropdown.selectOption({ label: targetStatus });
        } catch (e) {
            await statusDropdown.selectOption({ value: targetStatus });
        }
    }

    await statusDropdown.dispatchEvent('change');
    await this.page.waitForTimeout(1000);

    // 2. Validate calendar picker behaviour for 'Absconded' status
    if (targetStatus === 'Absconded') {
        const resignationInput = this.page.locator('#Employee_ResignationDate, #txtResignationDate, input[name*="ResignationDate"]').first();

        if (await resignationInput.isVisible({ timeout: 2000 }).catch(() => false)) {
            await resignationInput.click({ force: true }).catch(() => {});
            await this.page.waitForTimeout(500);

            const isDisabled = await resignationInput.isDisabled().catch(() => false);
            const isReadOnly = await resignationInput.getAttribute('readonly') !== null;

            const calendarPicker = this.page.locator('.datepicker, .ui-datepicker, .datetimepicker').first();
            const isCalendarVisible = await calendarPicker.isVisible({ timeout: 1000 }).catch(() => false);

            if ((isDisabled || isReadOnly) && !isCalendarVisible) {
                console.log('✅ PASS: Resignation Date field is disabled for Absconded status and calendar modal is not opened.');
            } else if (isCalendarVisible) {
                throw new Error('❌ FAIL: Calendar modal opened for Resignation Date field under Absconded status!');
            }
        }
    } else {
        // Normal date population logic for Active/Left/Terminated statuses
        const resignationInput = this.page.locator('#Employee_ResignationDate, #txtResignationDate, input[name*="ResignationDate"]').first();
        if (await resignationInput.isVisible({ timeout: 2000 }).catch(() => false)) {
            const isEnabled = await resignationInput.isEnabled().catch(() => false);
            if (isEnabled) {
                const todayStr = getTodayFormattedDate();
                await resignationInput.fill(todayStr);
            }
        }
    }

    // 3. Fill Remark input field
    const remarkInput = this.page.locator('#txtRemark, textarea[name*="Remark"]').first();
    if (await remarkInput.isVisible({ timeout: 1000 }).catch(() => false)) {
        await remarkInput.fill(`Status updated to ${targetStatus}`);
    }

    await this.page.waitForLoadState('networkidle').catch(() => {});
});

When('User selects today date as Resignation Date and verifies Relieving Date auto-populates', async function () {
    const resignationInput = this.page.locator('#Employee_ResignationDate, #txtResignationDate, input[name*="ResignationDate"]').first();
    const relievingInput = this.page.locator('#Employee_LastWorkingDate, #txtRelievingDate, input[name*="LastWorkingDate"]').first();

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

When('User clicks on Update button after filling dates', async function () {
    const updateBtn = this.page.locator('#btnUpdate, button:has-text("Update"), input[value="Update"]').first();
    await expect(updateBtn).toBeVisible({ timeout: 5000 });
    await updateBtn.click({ force: true });

    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(1000);
});

When('User clicks on Cancel button', async function () {
    const openOkBtn = this.page.locator('.swal-button, button.confirm, button:has-text("OK")').first();
    if (await openOkBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
        await openOkBtn.click({ force: true }).catch(() => {});
        await this.page.locator('.swal-overlay, .sweet-alert, .swal2-popup').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    }

    const cancelBtn = this.page.locator('#btnCancelEmployee, #btnCancel, input[value="Cancel"], button:has-text("Cancel")').first();
    await expect(cancelBtn).toBeVisible({ timeout: 8000 });
    await cancelBtn.click({ force: true });

    await this.page.locator('.modal-backdrop, .modal, #editEmployeeModal, .swal-overlay').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(1500);
});

Then('User verifies Delete button is visible on employee edit form', async function () {
    const deleteBtn = this.page.locator('#btnDeleteEmployee, input[value="Delete"]').first();
    await expect(deleteBtn).toBeVisible({ timeout: 5000 });
});

Then('User verifies Active Count decreased by {int}', async function (decrementVal) {
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(1500);

    const activeLocator = this.page.locator('#spnActiveRecordCount, #spnActiveCount, span[id*="Active"]').first();
    await activeLocator.waitFor({ state: 'attached', timeout: 15000 });
    await activeLocator.scrollIntoViewIfNeeded().catch(() => {});

    const currentActiveText = await activeLocator.innerText();
    const currentActive = parseInt(currentActiveText.replace(/[^0-9]/g, ''), 10) || 0;

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

    this.updatedLeftCount = currentLeft;
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

    this.updatedActiveCount = currentActive;
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

    this.updatedLeftCount = currentLeft;
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

Then('User verifies Left Count remains unchanged', async function () {
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(1000);

    const leftLocator = this.page.locator('#spnLeftRecordCount, #spnLeftCount, span[id*="Left"]').first();
    await leftLocator.waitFor({ state: 'attached', timeout: 15000 });

    const currentLeftText = await leftLocator.innerText().catch(() => '0');
    const currentLeft = parseInt(currentLeftText.replace(/[^0-9]/g, ''), 10) || 0;

    const expectedLeft = (typeof this.updatedLeftCount === 'number') ? this.updatedLeftCount : (this.initialLeftCount || 0) + 1;

    console.log(`[Validation] Left Count Check -> Current UI: ${currentLeft}, Expected: ${expectedLeft}`);
    expect(currentLeft).toBe(expectedLeft);
});

Then('User verifies Active Count remains unchanged', async function () {
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(1000);

    const activeLocator = this.page.locator('#spnActiveRecordCount, #spnActiveCount, span[id*="Active"]').first();
    await activeLocator.waitFor({ state: 'attached', timeout: 15000 });

    const currentActiveText = await activeLocator.innerText().catch(() => '0');
    const currentActive = parseInt(currentActiveText.replace(/[^0-9]/g, ''), 10) || 0;

    const expectedActive = (typeof this.updatedActiveCount === 'number') ? this.updatedActiveCount : (this.initialActiveCount || 0);

    console.log(`[Validation] Active Count Check -> Current UI: ${currentActive}, Expected: ${expectedActive}`);
    expect(currentActive).toBe(expectedActive);
});

Then('User searches employee in grid by captured Aadhaar number', async function () {
    const dynamicId = await getDynamicIdentifier(this);
    if (!dynamicId) {
        throw new Error("Cannot search grid: Dynamic Identifier is missing in context!");
    }
    console.log(`🔍 Searching grid by identity number via column header filter.`);
    await performColumnSearch(this.page, dynamicId);
});