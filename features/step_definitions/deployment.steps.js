import { Given, When, Then } from '@cucumber/cucumber';
import { ContractorEmployeeDeploymentPage } from '../../pages/deployment.js';

let updatedDeploymentData = {};

When('User clicks on "Deployment" tab in employee profile', { timeout: 60000 }, async function () {
    const deploymentPage = new ContractorEmployeeDeploymentPage(this.page);
    await deploymentPage.clickDeploymentTab();
    // 📸 initial values कॅप्चर करण्यासाठी:
    await deploymentPage.captureInitialDetails();
});

Then('User verifies deployment fields match initial created details Subsidiary {string}, Division {string}, Department {string}, Category {string}, Grade {string}, Designation {string}, Location {string}, Skilled Level {string}, and Contractor {string}', 
{ timeout: 60000 }, 
async function (subsidiary, division, department, category, grade, designation, location, skill, contractor) {
    const deploymentPage = new ContractorEmployeeDeploymentPage(this.page);
    
    // 1. मूळ व्हेरिफिकेशन
    await deploymentPage.verifySelectedValues({
        subsidiary,
        division,
        department,
        category,
        grade,
        designation,
        location,
        skill,
        contractor
    });

    // 2. 📊 Terminal आणि HTML Report मध्ये Chart Log करण्यासाठी:
    await deploymentPage.logFinalComparisonChart(this);
});

When('User modifies deployment fields with temporary values', { timeout: 70000 }, async function () {
    const deploymentPage = new ContractorEmployeeDeploymentPage(this.page);
    await deploymentPage.modifyDeploymentFields();
});

When('User modifies deployment fields with new values', { timeout: 65000 }, async function () {
    const deploymentPage = new ContractorEmployeeDeploymentPage(this.page);
    updatedDeploymentData = await deploymentPage.modifyDeploymentFields();
});

When('User clicks on Cancel button in deployment form', { timeout: 60000 }, async function () {
    const deploymentPage = new ContractorEmployeeDeploymentPage(this.page);
    await deploymentPage.clickCancel();
});

When('User clicks on Update button in deployment form', { timeout: 75000 }, async function () {
    const deploymentPage = new ContractorEmployeeDeploymentPage(this.page);
    await deploymentPage.clickUpdate();
});

Then('User verifies deployment update success message appears', { timeout: 70000 }, async function () {
    const deploymentPage = new ContractorEmployeeDeploymentPage(this.page);
    await deploymentPage.handleUpdateSuccessAlert();
});

Then('User verifies deployment fields match newly updated values', { timeout: 70000 }, async function () {
    const deploymentPage = new ContractorEmployeeDeploymentPage(this.page);
    await deploymentPage.verifySelectedValues(updatedDeploymentData);
});