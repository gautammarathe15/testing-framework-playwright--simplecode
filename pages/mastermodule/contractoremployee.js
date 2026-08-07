/**
 * --------------------------------------------------------------------------
 * CLMS Master Module - Contractor Employee Page Object Class
 * File: pages/mastermodule/contractorEmployee.js
 * --------------------------------------------------------------------------
 */

const { expect } = require('@playwright/test');

class ContractorEmployeePage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        // DOM Element Locators
        this.createButton = this.page.locator('#hrfEmployeeCreate');
        this.uploadButton = this.page.locator('#btnExport');
    }

    /**
     * Verifies the visibility of both +Create and Upload options on the Contractor Employee page
     */
    async verifyCreateAndUploadOptionsVisible() {
        console.log("🔍 Verifying visibility for '+Create' and 'Upload' buttons...");

        // 1. Wait for DOM network idle / page load
        await this.page.waitForLoadState('networkidle').catch(() => {});

        // 2. Validate +Create Button Visibility (#hrfEmployeeCreate)
        await this.createButton.waitFor({ state: 'attached', timeout: 20000 });
        await this.createButton.waitFor({ state: 'visible', timeout: 20000 });
        await expect(this.createButton).toBeVisible();
        console.log("✅ '+Create' button (#hrfEmployeeCreate) is visible on UI.");

        // 3. Validate Upload Button Visibility (#btnExport)
        await this.uploadButton.waitFor({ state: 'attached', timeout: 20000 });
        await this.uploadButton.waitFor({ state: 'visible', timeout: 20000 });
        await expect(this.uploadButton).toBeVisible();
        console.log("✅ 'Upload' button (#btnExport) is visible on UI.");
    }

    /**
     * Clicks on the +Create button (#hrfEmployeeCreate)
     */
    async clickCreateButton() {
        console.log("👆 Clicking on '+Create' button...");
        await this.createButton.waitFor({ state: 'visible', timeout: 20000 });
        await this.createButton.click();
        console.log("✅ Clicked on '+Create' button successfully.");
    }
}

module.exports = { ContractorEmployeePage };