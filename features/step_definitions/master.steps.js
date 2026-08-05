/**
 * --------------------------------------------------------------------------
 * Cucumber Step Definitions for Master Module
 * File: features/step_definitions/master.steps.js
 * --------------------------------------------------------------------------
 */

const { Given, When, Then } = require('@cucumber/cucumber');
const { CLMSDashboardPage } = require('../../pages/clmsdashboard.js');
const { ContractorEmployeePage } = require('../../pages/mastermodule/contractorEmployee.js');

When('User clicks on the Contractor Employee menu option', { timeout: 120000 }, async function () {
    console.log("👉 Preparing to navigate to Contractor Employee section...");

    if (!this.clmsDashboardPage) {
        this.clmsDashboardPage = new CLMSDashboardPage(this.page);
    }

    // 🎯 १. Contractor Employee वर नेव्हिगेट होण्याआधीच इथे पॉझ होईल आणि Playwright Inspector उघडेल
    console.log("⏸️ Execution paused BEFORE navigation/click. Playwright Inspector is now open...");
    await this.page.pause();

    // 🎯 २. Inspector मधील Resume (▶️) दबाल्ल्यावर ही पुढे नेव्हिगेट होईल
    const currentUrl = this.page.url();
    const baseUrl = currentUrl.substring(0, currentUrl.indexOf('/app/')); 
    const targetUrl = `${baseUrl}/app/Employee/Index`;

    console.log(`🌐 Direct Navigating to: ${targetUrl}`);
    await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    console.log("✅ Successfully navigated to Contractor Employee Page!");

    // Page object इनिशियलाईझ करा
    this.contractorEmployeePage = new ContractorEmployeePage(this.page);
});

Then('User should see the Create and Upload options on the Contractor Employee page', { timeout: 60000 }, async function () {
    console.log("🔍 Verifying Create and Upload options...");

    if (!this.contractorEmployeePage) {
        this.contractorEmployeePage = new ContractorEmployeePage(this.page);
    }

    await this.contractorEmployeePage.verifyCreateAndUploadOptionsVisible();
});