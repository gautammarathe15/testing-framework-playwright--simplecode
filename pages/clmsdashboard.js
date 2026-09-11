class CLMSDashboardPage {
    constructor(page) {
        this.page = page;
        
        // 🎯 Main Navigation Menu Locators
        this.dashboardMenu = this.page.getByRole('link', { name: 'Dashboard' });
        this.mastersMenu = this.page.getByRole('link', { name: 'Masters' });
        this.applicationMenu = this.page.getByRole('link', { name: 'Application' });
        this.administrationMenu = this.page.getByRole('link', { name: 'Administration' });
        this.configurationMenu = this.page.getByRole('link', { name: 'Configuration' });
        this.reportsMenu = this.page.getByRole('link', { name: 'Reports', exact: true });
        this.complianceReportsMenu = this.page.getByRole('link', { name: 'Compliance Reports' });

        // 🎯 Sub-Menu / Specific Options Locators
        this.myDashboardTab = this.page.getByRole('tab', { name: ' My Dashboard' });
        this.organizationOption = this.page.getByRole('link', { name: 'Organization' });
        this.contractorEmployeeOption = this.page.locator('#main-nav').getByText('Contractor Employee My');
        this.userGroupOption = this.page.getByRole('link', { name: 'User Group' });
        this.employeeReportOption = this.page.getByRole('link', { name: 'Employee Report', exact: true });

        // 🎯 Footer Locator
        this.emSphereFooter = this.page.getByRole('link', { name: 'emSphere Technologies Pvt.' });
    }

    async verifyDashboardLanding() {
        console.log("🔍 Verifying Dashboard Landing...");
        await this.page.waitForURL(/.*dashboard/i, { timeout: 15000 });
        await this.dashboardMenu.waitFor({ state: 'visible', timeout: 10000 });
        
        const isVisible = await this.dashboardMenu.isVisible();
        if (!isVisible) {
            throw new Error("❌ Dashboard Landing Failed: Dashboard menu item is not visible.");
        }
        console.log("✅ Dashboard Landing Verified Successfully!");
        return true;
    }

    async validateNavigationMenu() {
        console.log("🔍 Testing Navigation Menu options for Visibility & Real Clickability...");

        const menuItems = [
            { name: 'Dashboard', locator: this.dashboardMenu },
            { name: 'Masters', locator: this.mastersMenu },
            { name: 'Application', locator: this.applicationMenu },
            { name: 'Administration', locator: this.administrationMenu },
            { name: 'Configuration', locator: this.configurationMenu },
            { name: 'Reports', locator: this.reportsMenu },
            { name: 'Compliance Reports', locator: this.complianceReportsMenu }
        ];

        let allValid = true;

        for (const item of menuItems) {
            try {
                await item.locator.waitFor({ state: 'visible', timeout: 5000 });
                const isVisible = await item.locator.isVisible();

                // Trial Click check
                await item.locator.click({ trial: true, timeout: 3000 });

                if (isVisible) {
                    console.log(`  🎯 Menu Option '${item.name}': VISIBLE & CONFIRMED CLICKABLE 🖱️✅`);
                }
            } catch (err) {
                console.log(`  ❌ Menu Option '${item.name}': NOT CLICKABLE or BLOCKED (Error: ${err.message})`);
                allValid = false;
            }
        }

        return allValid;
    }

    /**
     * 🎯 Sub-Menu Page Navigation & Option Visibility Validation
     */
    async validateSubPageOptions() {
        console.log("\n🔍 Navigating & Validating Sub-Page Options...");
        let allOptionsPassed = true;

        // 1️⃣ Dashboard Page: 'My Dashboard' Option Validation
        try {
            await this.dashboardMenu.click();
            await this.myDashboardTab.waitFor({ state: 'visible', timeout: 5000 });
            if (await this.myDashboardTab.isVisible()) {
                console.log("  ✅ [Dashboard Page]: 'My Dashboard' Option VISIBLE -> PASSED!");
            } else {
                console.log("  ❌ [Dashboard Page]: 'My Dashboard' Option NOT VISIBLE -> FAILED!");
                allOptionsPassed = false;
            }
        } catch (err) {
            console.log("  ❌ [Dashboard Page]: 'My Dashboard' Option NOT FOUND -> FAILED!");
            allOptionsPassed = false;
        }

        // 2️⃣ Masters Page: Click 'Masters' -> Check 'Organization' Option
        try {
            await this.mastersMenu.click();
            await this.organizationOption.waitFor({ state: 'visible', timeout: 5000 });
            if (await this.organizationOption.isVisible()) {
                console.log("  ✅ [Masters Page]: 'Organization' Option VISIBLE -> PASSED!");
            } else {
                console.log("  ❌ [Masters Page]: 'Organization' Option NOT VISIBLE -> FAILED!");
                allOptionsPassed = false;
            }
        } catch (err) {
            console.log("  ❌ [Masters Page]: 'Organization' Option NOT FOUND -> FAILED!");
            allOptionsPassed = false;
        }

        // 3️⃣ Application Page: Click 'Application' -> Check 'Contractor Employee' Option
        try {
            await this.applicationMenu.click();
            await this.contractorEmployeeOption.waitFor({ state: 'visible', timeout: 5000 });
            if (await this.contractorEmployeeOption.isVisible()) {
                console.log("  ✅ [Application Page]: 'Contractor Employee' Option VISIBLE -> PASSED!");
            } else {
                console.log("  ❌ [Application Page]: 'Contractor Employee' Option NOT VISIBLE -> FAILED!");
                allOptionsPassed = false;
            }
        } catch (err) {
            console.log("  ❌ [Application Page]: 'Contractor Employee' Option NOT FOUND -> FAILED!");
            allOptionsPassed = false;
        }

        // 4️⃣ Configuration Page: Click 'Configuration' -> Check 'User Group' Option
        try {
            await this.configurationMenu.click();
            await this.userGroupOption.waitFor({ state: 'visible', timeout: 5000 });
            if (await this.userGroupOption.isVisible()) {
                console.log("  ✅ [Configuration Page]: 'User Group' Option VISIBLE -> PASSED!");
            } else {
                console.log("  ❌ [Configuration Page]: 'User Group' Option NOT VISIBLE -> FAILED!");
                allOptionsPassed = false;
            }
        } catch (err) {
            console.log("  ❌ [Configuration Page]: 'User Group' Option NOT FOUND -> FAILED!");
            allOptionsPassed = false;
        }

        // 5️⃣ Reports Page: Click 'Reports' -> Check 'Employee Report' Option
        try {
            await this.reportsMenu.click();
            await this.employeeReportOption.waitFor({ state: 'visible', timeout: 5000 });
            if (await this.employeeReportOption.isVisible()) {
                console.log("  ✅ [Reports Page]: 'Employee Report' Option VISIBLE -> PASSED!");
            } else {
                console.log("  ❌ [Reports Page]: 'Employee Report' Option NOT VISIBLE -> FAILED!");
                allOptionsPassed = false;
            }
        } catch (err) {
            console.log("  ❌ [Reports Page]: 'Employee Report' Option NOT FOUND -> FAILED!");
            allOptionsPassed = false;
        }

        return allOptionsPassed;
    }

    /**
     * Validates overall Dashboard loading state & Sub-Options.
     */
    async isDashboardVisible() {
        try {
            const currentUrl = this.page.url().toLowerCase();
            const isUrlValid = currentUrl.includes('dashboard');

            // 1. Validate Main Navigation Menus
            const isMenuValid = await this.validateNavigationMenu();

            // 2. Click through each main section & validate sub-page options
            const isSubOptionsValid = await this.validateSubPageOptions();

            return isUrlValid && isMenuValid && isSubOptionsValid;
        } catch (error) {
            console.error("⚠️ Dashboard verification failed or timed out:", error.message);
            return false;
        }
    }
}

// =========================================================================
// 🎯 STANDALONE / AUTO-EXECUTION BLOCK
// =========================================================================
if (require.main === module) {
    const { chromium } = require('@playwright/test');
    const testData = require('../utilities/testData.json');
    const { CLMSLoginPage } = require('./clmslogin');

    (async () => {
        console.log("⚡ [clmsdashboard.js] Auto-Execution Started...");
        const browser = await chromium.launch({ headless: false, channel: 'chrome' });
        const context = await browser.newContext();
        const page = await context.newPage();

        try {
            const loginPage = new CLMSLoginPage(page);
            const dashboardPage = new CLMSDashboardPage(page);

            await loginPage.openUrl();
            await loginPage.login(testData[0].username, testData[0].password);
            
            await page.waitForTimeout(3000);

            // Verify Landing First
            await dashboardPage.verifyDashboardLanding();

            console.log("\n🔍 [clmsdashboard.js] Validating Dashboard UI Elements & Navigation Options...");
            const isVisible = await dashboardPage.isDashboardVisible();

            if (isVisible) {
                console.log("\n✅ [clmsdashboard.js] RESULT: PASSED! Dashboard menu items & sub-options are VERIFIED SUCCESSFULLY.");
                
                console.log("\n==================================================");
                console.log("⏸️  PAUSE: DASHBOARD PLAYWRIGHT INSPECTOR OPENED!");
                console.log("==================================================\n");

                await page.pause();

            } else {
                console.log("\n❌ [clmsdashboard.js] RESULT: FAILED! One or more options validation failed.");
            }
        } catch (err) {
            console.error("💥 [clmsdashboard.js] Error during execution:", err.message);
        } finally {
            await context.close();
            await browser.close();
            console.log("🔒 [clmsdashboard.js] Dashboard Browser Closed.\n");
        }
    })();
}

module.exports = { CLMSDashboardPage };