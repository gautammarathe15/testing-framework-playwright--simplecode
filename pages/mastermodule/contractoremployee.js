
const { expect } = require('@playwright/test');

class ContractorEmployeePage {
  constructor(page) {
    this.page = page;

    // --- प्रकार १ चे लोकेटर्स (Header/Master Flow) ---
    this.masterMenuHeader = page.locator('text=Master'); 
    this.employeeSubMenu = page.locator('text=Employee');
    this.contractorEmployeeHeaderOpt = page.locator('text=Contractor Employee');

    // --- प्रकार २ चे लोकेटर्स (Dashboard Sector Flow) ---
    this.employeeSectorWidget = page.locator('.employee-sector-widget, #employeeSector'); 
    this.contractorEmployeeDashboardBtn = page.locator('button:has-text("Contractor Employee"), a:has-text("Contractor Employee")');

    // --- प्रकार ३ चे लोकेटर्स (Toggle/Sidebar Flow) ---
    this.menuToggleBtn = page.locator('#menuToggleBtn, .menu-toggle'); 
    this.sidebarDashboardOpt = page.locator('.sidebar text=Dashboard, #sidebarDashboard');
    this.sidebarMasterOpt = page.locator('.sidebar text=Master, #sidebarMaster');
  }

  // --- प्रकार १ चे ॲक्शन्स ---
  async clickMasterHeader() {
    await this.masterMenuHeader.waitFor({ state: 'visible', timeout: 10000 });
    await this.masterMenuHeader.click();
  }

  async verifyEmployeeAndContractorInHeader() {
    await expect(this.employeeSubMenu).toBeVisible({ timeout: 5000 });
    await expect(this.contractorEmployeeHeaderOpt).toBeVisible({ timeout: 5000 });
  }

  // --- प्रकार २ चे ॲक्शन्स ---
  async verifyDashboardSectorAndBtn() {
    await expect(this.employeeSectorWidget).toBeVisible({ timeout: 7000 });
    await expect(this.contractorEmployeeDashboardBtn).toBeVisible({ timeout: 5000 });
  }

  // --- प्रकार ३ चे ॲक्शन्स ---
  async clickMenuToggle() {
    await this.menuToggleBtn.waitFor({ state: 'visible' });
    await this.menuToggleBtn.click();
  }

  async verifySidebarOptions() {
    await expect(this.sidebarDashboardOpt).toBeVisible({ timeout: 5000 });
    await expect(this.sidebarMasterOpt).toBeVisible({ timeout: 5000 });
  }

  async clickDashboardFromSidebar() {
    await this.sidebarDashboardOpt.click();
  }

  async clickMasterFromSidebar() {
    await this.sidebarMasterOpt.click();
  }
}

module.exports = { ContractorEmployeePage };
