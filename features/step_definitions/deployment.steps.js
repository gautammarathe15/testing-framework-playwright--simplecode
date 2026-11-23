import { Given, When, Then } from '@cucumber/cucumber';
import { ContractorEmployeeDeploymentPage } from '../../pages/deployment.js';

let updatedDeploymentData = {};

function isCLMS56(page) {
    let configuredUrl = '';
    try {
        configuredUrl = require('../../utilities/environmentConfig').resolveAppUrl();
    } catch (error) {
        configuredUrl = '';
    }

    const targetUrl = `${page.url() || ''} ${configuredUrl}`;
    return /(?:CLMS_5_6|\/CLMS_5_6\/app)/i.test(targetUrl);
}

Then('User verifies deployment fields match initial created details Subsidiary {string}, Division {string}, Department {string}, Category {string}, Grade {string}, Designation {string}, Location {string}, Skilled Level {string}, and Contractor {string}', 
{ timeout: 60000 }, 
async function (subsidiary, division, department, category, grade, designation, location, skill, contractor) {
    const deploymentPage = new ContractorEmployeeDeploymentPage(this.page);
    
    const expectedData = isCLMS56(this.page) ? {
        subsidiary: 'Emsphere',
        division: 'Andheri',
        department: 'Testing',
        category: 'Contract Worker',
        grade: 'G1',
        designation: 'Jr Engineer',
        location: 'Pune',
        skill: 'Skilled',
        contractor: 'ROOT-1313'
    } : {
        subsidiary,
        division,
        department,
        category,
        grade,
        designation,
        location,
        skill,
        contractor
    };

    await deploymentPage.verifySelectedValues(expectedData);
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