import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('User captures the current Active Count and Total Count from UI header', { timeout: 60000 }, async function () {
    const activeLocator = this.page.locator('#spnActiveRecordCount');
    const leftLocator = this.page.locator('#spnLeftRecordCount'); // 👈 Left Count Locator
    const totalLocator = this.page.locator('#spnTopRecordCount');

    await activeLocator.waitFor({ state: 'visible' });
    await totalLocator.waitFor({ state: 'visible' });

    // Left Count DOM मध्ये लोड होण्याची वाट पहा
    if (await leftLocator.isVisible({ timeout: 3000 }).catch(() => false)) {
        await leftLocator.waitFor({ state: 'visible' });
    }

    await this.page.waitForFunction((selector) => {
        const el = document.querySelector(selector);
        if (!el) return false;
        const digits = el.innerText.replace(/[^0-9]/g, '');
        return digits.length >= 3;
    }, '#spnTopRecordCount');

    const activeText = await activeLocator.innerText();
    const leftText = await leftLocator.innerText().catch(() => '0'); // 👈 Fetch Left Text
    const totalText = await totalLocator.innerText();

    // Context मधील सर्व Counts सेव्ह केले
    this.initialActiveCount = parseInt(activeText.replace(/[^0-9]/g, ''), 10) || 0;
    this.initialLeftCount = parseInt(leftText.replace(/[^0-9]/g, ''), 10) || 0; // 👈 initialLeftCount Captured!
    this.initialTotalCount = parseInt(totalText.replace(/[^0-9]/g, ''), 10) || 0;

    console.log(`📌 Initial Captured -> Active: ${this.initialActiveCount}, Left: ${this.initialLeftCount}, Total: ${this.initialTotalCount}`);
});

// 🔹 Single Form Creation साठी (जुन्या सिनेरिओसाठी)
Then('User verifies Total Count increased by {int}', { timeout: 30000 }, async function (expectedTotalIncrease) {
    const expectedTotal = this.initialTotalCount + expectedTotalIncrease;

    await this.page.waitForFunction(
        ({ selector, expected }) => {
            const el = document.querySelector(selector);
            if (!el) return false;
            const currentVal = parseInt(el.innerText.replace(/[^0-9]/g, ''), 10) || 0;
            return currentVal === expected;
        },
        { selector: '#spnTopRecordCount', expected: expectedTotal },
        { timeout: 15000 }
    ).catch(() => {});

    const currentTotalText = await this.page.locator('#spnTopRecordCount').innerText();
    const currentTotalCount = parseInt(currentTotalText.replace(/[^0-9]/g, ''), 10) || 0;

    expect(currentTotalCount).toBe(expectedTotal);
});
/*
Then('User verifies Active Count increased by {int}', { timeout: 30000 }, async function (expectedActiveIncrease) {
    const expectedActive = this.initialActiveCount + expectedActiveIncrease;

    await this.page.waitForFunction(
        ({ selector, expected }) => {
            const el = document.querySelector(selector);
            if (!el) return false;
            const currentVal = parseInt(el.innerText.replace(/[^0-9]/g, ''), 10) || 0;
            return currentVal === expected;
        },
        { selector: '#spnActiveRecordCount', expected: expectedActive },
        { timeout: 15000 }
    ).catch(() => {});

    const currentActiveText = await this.page.locator('#spnActiveRecordCount').innerText();
    const currentActiveCount = parseInt(currentActiveText.replace(/[^0-9]/g, ''), 10) || 0;

    expect(currentActiveCount).toBe(expectedActive);
});
*/

// 🔹 Bulk Excel Upload साठी DYNAMIC STEP (नव्या सिनेरिओसाठी)
Then('User verifies Total and Active Count increased by total successful uploaded records', { timeout: 30000 }, async function () {
    const totalPassed = this.totalSuccessUploadedCount || 0;
    console.log(`📊 Validating dynamically for ${totalPassed} successful records.`);

    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await this.page.waitForTimeout(2000);

    const expectedTotal = this.initialTotalCount + totalPassed;
    const expectedActive = this.initialActiveCount + totalPassed;

    await this.page.waitForFunction(
        ({ selector, expected }) => {
            const el = document.querySelector(selector);
            if (!el) return false;
            const currentVal = parseInt(el.innerText.replace(/[^0-9]/g, ''), 10) || 0;
            return currentVal === expected;
        },
        { selector: '#spnTopRecordCount', expected: expectedTotal },
        { timeout: 15000 }
    ).catch(() => {});

    const currentTotalText = await this.page.locator('#spnTopRecordCount').innerText();
    const currentActiveText = await this.page.locator('#spnActiveRecordCount').innerText();

    const actualTotalCount = parseInt(currentTotalText.replace(/[^0-9]/g, ''), 10) || 0;
    const actualActiveCount = parseInt(currentActiveText.replace(/[^0-9]/g, ''), 10) || 0;

    console.log(`🔍 Dynamic Check -> Expected Total: ${expectedTotal}, Actual: ${actualTotalCount}`);
    console.log(`🔍 Dynamic Check -> Expected Active: ${expectedActive}, Actual: ${actualActiveCount}`);

    expect(actualTotalCount).toBe(expectedTotal);
    expect(actualActiveCount).toBe(expectedActive);
});