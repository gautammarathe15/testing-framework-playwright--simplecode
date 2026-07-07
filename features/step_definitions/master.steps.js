const { Given, When, Then } = require('@cucumber/cucumber');
const { CLMSDashboardPage } = require('../../pages/clmsdashboard');
const { ContractorEmployeePage } = require('../../pages/mastermodule/contractorEmployee');

// ==========================================
// 🔹 Type 1: Master Menu Navigation
// ==========================================
When('user clicks on the {string} menu in the header', async function (menuName) {
  const contractorPage = new ContractorEmployeePage(this.page);
  if (menuName === 'Master') {
    await contractorPage.clickMasterHeader();
  }
});

// Fixed: Removed the extra "then" keyword from the matching string
Then('user should see {string} option visible', async function (subMenuName) {
  const contractorPage = new ContractorEmployeePage(this.page);
  await contractorPage.employeeSubMenu.waitFor({ state: 'visible' });
});

Then('the {string} option should be visible inside Employee section', async function (optName) {
  const contractorPage = new ContractorEmployeePage(this.page);
  await contractorPage.verifyEmployeeAndContractorInHeader();
});


// ==========================================
// 🔹 Type 2: Dashboard Quick Sector Navigation
// ==========================================
When('user is on the main dashboard', async function () {
  const dashboardPage = new CLMSDashboardPage(this.page);
  await this.page.waitForLoadState('networkidle');
  await dashboardPage.verifyEmsphereIsVisible();
});

Then('the {string} widget\/section should be visible', async function (sectionName) {
  const contractorPage = new ContractorEmployeePage(this.page);
  await contractorPage.employeeSectorWidget.waitFor({ state: 'visible' });
});

Then('the {string} button should be visible inside it', async function (btnName) {
  const contractorPage = new ContractorEmployeePage(this.page);
  await contractorPage.verifyDashboardSectorAndBtn();
});


// ==========================================
// 🔹 Type 3: Menu Toggle Sidebar Navigation
// ==========================================
When('user clicks on the {string} to open sidebar', async function (btnName) {
  const contractorPage = new ContractorEmployeePage(this.page);
  await contractorPage.clickMenuToggle();
});

Then('the {string} and {string} options should be visible in the sidebar menu', async function (opt1, opt2) {
  const contractorPage = new ContractorEmployeePage(this.page);
  await contractorPage.verifySidebarOptions();
});

When('user clicks on {string} from sidebar', async function (sidebarMenu) {
  const contractorPage = new ContractorEmployeePage(this.page);
  if (sidebarMenu === 'Dashboard') {
    await contractorPage.clickDashboardFromSidebar();
  } else if (sidebarMenu === 'Master') {
    await contractorPage.clickMasterFromSidebar();
  }
});

Then('user should see the same Dashboard page with {string} sector button', async function (btnName) {
  const contractorPage = new ContractorEmployeePage(this.page);
  const dashboardPage = new CLMSDashboardPage(this.page);
  
  await dashboardPage.verifyEmsphereIsVisible();
  await contractorPage.verifyDashboardSectorAndBtn();
});

Then('user should see the {string} option under header master flow', async function (optName) {
  const contractorPage = new ContractorEmployeePage(this.page);
  await contractorPage.verifyEmployeeAndContractorInHeader();
});