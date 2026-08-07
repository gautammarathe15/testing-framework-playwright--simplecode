/**
 * --------------------------------------------------------------------------
 * Cucumber Step Definitions for Master Module
 * File: features/step_definitions/master.steps.js
 * --------------------------------------------------------------------------
 */

const { Given, When, Then } = require('@cucumber/cucumber');
const { CLMSDashboardPage } = require('../../pages/clmsdashboard.js');
const { ContractorEmployeePage } = require('../../pages/mastermodule/contractorEmployee.js');

// १. Contractor Employee पेजवर नेव्हिगेट करणे
When('User clicks on the Contractor Employee menu option', { timeout: 120000 }, async function () {
    console.log("👉 Navigating to Contractor Employee section...");

    if (!this.clmsDashboardPage) {
        this.clmsDashboardPage = new CLMSDashboardPage(this.page);
    }

    const currentUrl = this.page.url();
    const baseUrl = currentUrl.substring(0, currentUrl.indexOf('/app/')); 
    const targetUrl = `${baseUrl}/app/Employee/Index`;

    console.log(`🌐 Direct Navigating to: ${targetUrl}`);
    await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    console.log("✅ Successfully navigated to Contractor Employee Page!");

    // Page object इनिशियलाईझ करा
    this.contractorEmployeePage = new ContractorEmployeePage(this.page);
});

// २. फक्त '+Create' आणि Upload बटणे Visible आहेत का ते तपासणे
Then('User should see the Create and Upload options on the Contractor Employee page', { timeout: 60000 }, async function () {
    console.log("🔍 Verifying Create and Upload options visibility...");

    if (!this.contractorEmployeePage) {
        this.contractorEmployeePage = new ContractorEmployeePage(this.page);
    }

    await this.contractorEmployeePage.verifyCreateAndUploadOptionsVisible();
    console.log("✅ Visibility verified successfully!");
});

// ३. '+Create' बटणावर क्लिक करणे (नवीन सिनेरियोसाठी)
When('User clicks on the Create button', { timeout: 60000 }, async function () {
    console.log("👆 Clicking on '+Create' button...");

    if (!this.contractorEmployeePage) {
        this.contractorEmployeePage = new ContractorEmployeePage(this.page);
    }

    await this.contractorEmployeePage.clickCreateButton();
});

// ४. क्लिक केल्यावर Playwright Inspector उघडणे
Then('Playwright Inspector should open for further recording', { timeout: 300000 }, async function () {
    console.log("⏸️ Clicked on '+' button. Playwright Inspector is now open...");
    
    // इथे Playwright Inspector विंडो उघडेल
    await this.page.pause();
});