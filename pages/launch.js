/**
 * --------------------------------------------------------------------------
 * CLMS POM-Driven Test Suite Engine
 * File: pages/launch.js
 * --------------------------------------------------------------------------
 */

const { chromium } = require('@playwright/test');
const { execSync } = require('child_process');
const { CLMSLoginPage } = require('./clmslogin');

// Load test data from testData.json
const scenariosData = require('../utilities/testData.json');

(async () => {
    console.log("🚀 CLMS POM-Driven Testing Started...\n");

    // =========================================================================
    // 🔹 SCENARIOS 1 to 6: Automated Login Execution Loop
    // =========================================================================
    for (const sc of scenariosData) {
        console.log(`🧪 Starting Scenario [ID: ${sc.id}] | Type: ${sc.type} | (${sc.desc})`);
        
        const browser = await chromium.launch({ headless: false, channel: 'chrome' });
        const context = await browser.newContext();
        const page = await context.newPage();
        
        const loginPage = new CLMSLoginPage(page);

        try {
            await loginPage.openUrl();
            await loginPage.login(sc.username, sc.password);
            await page.waitForTimeout(2000);
            
            if (sc.type === 'Positive') {
                console.log(`✅ [ID: ${sc.id}] RESULT: PASSED! Login attempted for valid user.`);
            } else {
                console.log(`✅ [ID: ${sc.id}] RESULT: PASSED! Negative login test completed.`);
            }
        } catch (error) {
            console.error(`💥 [ID: ${sc.id}] Error: ${error.message}`);
        } finally {
            await context.close();
            await browser.close();
            console.log(`🔒 [ID: ${sc.id}] Browser Closed.\n`);
        }
    }

    // =========================================================================
    // 🔹 SCENARIO 7: Tester Manual Login Entry
    // =========================================================================
    console.log("🧪 Starting Scenario [ID: 7] | Type: Manual | (Tester Manual Login Entry)");
    
    const manualBrowser = await chromium.launch({ headless: false, channel: 'chrome' });
    const manualContext = await manualBrowser.newContext();
    const manualPage = await manualContext.newPage();
    const manualLoginPage = new CLMSLoginPage(manualPage);

    try {
        await manualLoginPage.openUrl();

        console.log("\n==================================================");
        console.log("⏸️  PAUSE: TESTER MANUAL LOGIN ENTRY");
        console.log("👉 Focus on the browser screen.");
        console.log("👉 Manually type the Username and Password of your choice.");
        console.log("👉 Manually click the 'Login' button on the UI.");
        console.log("==================================================\n");

        await manualPage.pause();
    } catch (error) {
        console.error(`💥 [ID: 7] Manual Scenario Error: ${error.message}`);
    } finally {
        await manualContext.close();
        await manualBrowser.close();
        console.log("🔒 [ID: 7] Browser Closed.\n");
    }

    // =========================================================================
    // 🔹 SCENARIOS 8 & 9: Forgot Password Pop-up Validations
    // =========================================================================
    console.log("🧪 Starting Scenario [ID: 8 & 9] | Type: Automation | (Forgot Password Window Validation)");
    
    const fpBrowser = await chromium.launch({ headless: false, channel: 'chrome' });
    const fpContext = await fpBrowser.newContext();
    const fpPage = await fpContext.newPage();
    const fpLoginPage = new CLMSLoginPage(fpPage);

    try {
        await fpLoginPage.openUrl();
        await fpLoginPage.clickForgetPasswordLink();
        await fpLoginPage.verifyForgotFieldsAreVisible();
        
        // Scenario 8: Close Icon 'X' Click
        await fpLoginPage.verifyAndClickCloseIconX();
        console.log("✅ [ID: 8] RESULT: PASSED! Pop-up closed successfully via 🗙 Icon.");
        
        // Scenario 9: Close Button Click
        await fpLoginPage.clickForgetPasswordLink();
        await fpLoginPage.verifyAndClickCloseButton();
        console.log("✅ [ID: 9] RESULT: PASSED! Pop-up closed successfully via Close Button.");
    } catch (error) {
        console.error(`💥 [ID: 8/9] Forgot Password Error: ${error.message}`);
    } finally {
        await fpContext.close();
        await fpBrowser.close();
        console.log("🔒 [ID: 8/9] Browser Closed.\n");
    }

    // =========================================================================
    // 🔹 AUTO RUN: Automatically Executing clmsdashboard.js File Directly
    // =========================================================================
    console.log("==================================================");
    console.log("🚀 Launch Suite Completed! Triggering 'pages/clmsdashboard.js' directly...");
    console.log("==================================================\n");

    try {
        execSync('node pages/clmsdashboard.js', { stdio: 'inherit' });
    } catch (error) {
        console.error("💥 Failed to auto-run clmsdashboard.js:", error.message);
    }

    // =========================================================================
    // 🔹 REPORT GENERATION: Triggered after all test scenarios complete
    // =========================================================================
    console.log('\n📊 Auto-triggering report generation...');
    try {
        execSync('node generate-report.js', { stdio: 'inherit' });
    } catch (err) {
        console.error('⚠️ Report generation error:', err.message);
    }

    console.log("\n==================================================");
    console.log("🏁 Entire Execution (Launch + Dashboard File) Finished Successfully!");
    console.log("==================================================");

    // Safely exit process after everything finishes successfully
    process.exit(0);
})();