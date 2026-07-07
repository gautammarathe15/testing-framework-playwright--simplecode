const { chromium } = require('playwright');
const { CLMSLoginPage } = require('./clmslogin'); 
const { CLMSDashboardPage } = require('./clmsdashboard'); 
const testScenarios = require('../utilities/testData.json');

// ==========================================================
// 🔹 1. Standard Login Scenario Loop (Automated from JSON)
// ==========================================================
async function runSingleScenario(scenario) {
    console.log(`🧪 Starting Scenario [ID: ${scenario.id}] | Type: ${scenario.type} | (${scenario.desc})`);
    
    const browser = await chromium.launch({ headless: false, channel: 'chrome' });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const clmsLogin = new CLMSLoginPage(page);
    const clmsDashboard = new CLMSDashboardPage(page);

    try {
        await clmsLogin.openUrl();
        const isPageValid = await clmsLogin.verifyPage();

        if (isPageValid) {
            await clmsLogin.login(scenario.username, scenario.password);
            
            const loggedInSuccessfully = await clmsDashboard.isDashboardVisible();
            const currentUrl = page.url();

            if (scenario.type === "Positive") {
                if (loggedInSuccessfully) {
                    console.log(`✅ [ID: ${scenario.id}] RESULT: PASSED! Successfully reached CLMS Dashboard.`);
                } else {
                    console.log(`❌ [ID: ${scenario.id}] RESULT: FAILED! Dashboard validation failed. (URL: ${currentUrl})`);
                }
            } else if (scenario.type === "Negative") {
                if (!loggedInSuccessfully) {
                    console.log(`✅ [ID: ${scenario.id}] RESULT: PASSED! Unauthorized access blocked.`);
                } else {
                    console.log(`❌ [ID: ${scenario.id}] RESULT: FAILED! Invalid user got access!`);
                }
            }
        } else {
            console.log(`❌ [ID: ${scenario.id}] RESULT: FAILED! Login page validation failed.`);
        }

    } catch (error) {
        console.error(`💥 [ID: ${scenario.id}] Error: ${error.message}`);
    } finally {
        await browser.close();
        console.log(`🔒 [ID: ${scenario.id}] Browser Closed.`);
    }
}

// ==========================================================
// 🎯 2. Tester Manual Login Entry Scenario (Scenario 7)
// ==========================================================
async function runManualLoginScenario() {
    console.log(`\n🧪 Starting Scenario [ID: 7] | Type: Manual | (Tester Manual Login Entry)`);
    
    const browser = await chromium.launch({ headless: false, channel: 'chrome' });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const clmsLogin = new CLMSLoginPage(page);
    const clmsDashboard = new CLMSDashboardPage(page);

    try {
        await clmsLogin.openUrl();
        await clmsLogin.verifyPage();

        console.log("\n==================================================");
        console.log("⏸️  PAUSE: TESTER MANUAL LOGIN ENTRY");
        console.log("👉 Focus on the browser screen.");
        console.log("👉 Manually type the Username and Password of your choice.");
        console.log("👉 Manually click the 'Login' button on the UI.");
        console.log("👉 After logging in, check the dashboard status, then click 'Resume' (▶) in Inspector.");
        console.log("==================================================\n");

        await page.pause();

        const loggedInSuccessfully = await clmsDashboard.isDashboardVisible();
        if (loggedInSuccessfully) {
            console.log(`✅ [ID: 7] RESULT: PASSED! Dashboard is visible after manual login.`);
        } else {
            console.log(`ℹ️ [ID: 7] RESULT: Manual inspection complete (Dashboard not active).`);
        }

    } catch (error) {
        console.error(`💥 [ID: 7] Manual Login Scenario Error: ${error.message}`);
    } finally {
        await browser.close();
        console.log(`🔒 [ID: 7] Manual Login Browser Closed.`);
    }
}

// ==========================================================
// 🎯 3. Forgot Password Manual Flow (With Inspector Pauses)
// ==========================================================
async function runForgotPasswordManualScenario() {
    console.log(`\n🔑 [Forgot Password] Starting Manual Intervention Scenario...`);
    
    const browser = await chromium.launch({ headless: false, channel: 'chrome' });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const clmsLogin = new CLMSLoginPage(page);

    try {
        await clmsLogin.openUrl();
        
        console.log("\n==================================================");
        console.log("⏸️  PAUSE 1: BASE LOGIN PAGE LOADED");
        console.log("👉 Click 'Resume' (▶) to click the 'Forgot Password' link.");
        console.log("==================================================\n");
        await page.pause(); 

        await clmsLogin.clickForgetPasswordLink();
        
        console.log("\n==================================================");
        console.log("⏸️  PAUSE 2: FORGOT PASSWORD LINK CLICKED");
        console.log("👉 Verify on the browser if the Pop-up modal has opened successfully.");
        console.log("👉 Click 'Resume' (▶) to let automation validate the field locators inside the pop-up.");
        console.log("==================================================\n");
        await page.pause(); 

        await clmsLogin.verifyForgotFieldsAreVisible();

        console.log("\n==================================================");
        console.log("⏸️  PAUSE 3: SCRIPT IS PAUSED ON FORGOT PASSWORD POP-UP!");
        console.log("👉 Please focus on the browser page to perform manual entry.");
        console.log("👉 Manually insert the 'User Name' and 'Captcha'.");
        console.log("👉 Click the 'Send Password To Email Id' form button.");
        console.log("👉 Once manual interaction is completed, click 'Resume' (▶) in the inspector toolbar to close.");
        console.log("==================================================\n");
        
        await page.pause(); 

        console.log("🚀 Resumed execution successfully after manual testing!");

    } catch (error) {
        console.error(`💥 Forgot Password Scenario Error: ${error.message}`);
    } finally {
        await browser.close();
        console.log(`🔒 Forgot Password Browser Closed.`);
    }
}

// ==========================================================
// 🎯 Scenario 8: Forgot Password - Close via 🗙 Icon
// ==========================================================
async function runForgotCloseIconScenario() {
    console.log(`\n🧪 Starting Scenario [ID: 8] | Type: Automation | (Forgot Password - Close via 🗙 Icon)`);
    
    const browser = await chromium.launch({ headless: false, channel: 'chrome' });
    const context = await browser.newContext();
    const page = await context.newPage();
    const clmsLogin = new CLMSLoginPage(page);

    try {
        await clmsLogin.openUrl();
        await clmsLogin.clickForgetPasswordLink();
        await clmsLogin.verifyForgotFieldsAreVisible();

        console.log("\n==================================================");
        console.log("⏸️  PAUSE: TESTING 🗙 ICON");
        console.log("👉 Click 'Resume' (▶) to automatically verify and click 🗙 icon.");
        console.log("==================================================\n");
        await page.pause(); 

        await clmsLogin.verifyAndClickCloseIconX();
        console.log("✅ [ID: 8] RESULT: PASSED! Pop-up closed successfully via 🗙 Icon.");

    } catch (error) {
        console.error(`❌ [ID: 8] RESULT: FAILED! Error: ${error.message}`);
    } finally {
        await browser.close();
        console.log(`🔒 [ID: 8] Browser Closed.`);
    }
}

// ==========================================================
// 🎯 Scenario 9: Forgot Password - Close via 'Close' Button
// ==========================================================
async function runForgotCloseButtonScenario() {
    console.log(`\n🧪 Starting Scenario [ID: 9] | Type: Automation | (Forgot Password - Close via 'Close' Button)`);
    
    const browser = await chromium.launch({ headless: false, channel: 'chrome' });
    const context = await browser.newContext();
    const page = await context.newPage();
    const clmsLogin = new CLMSLoginPage(page);

    try {
        await clmsLogin.openUrl();
        await clmsLogin.clickForgetPasswordLink();
        await clmsLogin.verifyForgotFieldsAreVisible();

        console.log("\n==================================================");
        console.log("⏸️  PAUSE: TESTING 'CLOSE' BUTTON");
        console.log("👉 Click 'Resume' (▶) to automatically verify and click 'Close' button.");
        console.log("==================================================\n");
        await page.pause(); 

        await clmsLogin.verifyAndClickCloseButton();
        console.log("✅ [ID: 9] RESULT: PASSED! Pop-up closed successfully via Close Button.");

    } catch (error) {
        console.error(`❌ [ID: 9] RESULT: FAILED! Error: ${error.message}`);
    } finally {
        await browser.close();
        console.log(`🔒 [ID: 9] Browser Closed.`);
    }
}

// ==========================================================
// 🏁 4. Execution Coordinator
// ==========================================================
(async () => {
    console.log("🚀 CLMS POM-Driven Testing Started...\n");
    
    // 1. Run the 6 automated loop cases
    for (const scenario of testScenarios) {
        await runSingleScenario(scenario);
    }
    
    // 2. 🎯 Run the interactive manual login case for the tester
    await runManualLoginScenario();
    
    // 3. Run the interactive manual forgot password flow
    await runForgotPasswordManualScenario();
    
    // 4. 🎯 Scenario 8: 🗙 Icon Close Scenario
    await runForgotCloseIconScenario();
    
    // 5. 🎯 Scenario 9: Close Button Scenario
    await runForgotCloseButtonScenario();
    
    console.log(`\n==================================================`);
    console.log("🏁 All scenarios finished execution with clean POM architecture!");
    console.log(`==================================================`);
})();