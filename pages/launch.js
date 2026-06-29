const { chromium } = require('playwright');
const { CLMSLoginPage } = require('./clmslogin'); 

const { CLMSDashboardPage } = require('./clmsdashboard'); 

const testScenarios = require('../utilities/testData.json');

async function runSingleScenario(scenario) {
    console.log(`🧪 Starting Scenario [ID: ${scenario.id}] | Type: ${scenario.type} | (${scenario.desc})`);
    
    const browser = await chromium.launch({ headless: false, channel: 'chrome' });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // दोनों पेजेसचे ऑब्जेक्ट्स तयार केले (Perfect POM!)
    const clmsLogin = new CLMSLoginPage(page);
    const clmsDashboard = new CLMSDashboardPage(page);

    try {
        await clmsLogin.openUrl();
        const isPageValid = await clmsLogin.verifyPage();

        if (isPageValid) {
            // Login Action 
            await clmsLogin.login(scenario.username, scenario.password);
            
            // 🎯 आता डॅशबोर्ड तपासणी 'clmsDashboard' ऑब्जेक्टद्वारे होईल. 
            const loggedInSuccessfully = await clmsDashboard.isDashboardVisible();
            const currentUrl = page.url();

            await page.pause();

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

(async () => {
    console.log("🚀 CLMS POM-Driven Testing Started...\n");
    for (const scenario of testScenarios) {
        await runSingleScenario(scenario);
    }
    console.log(`\n==================================================`);
    console.log("🏁 All scenarios finished execution with clean POM architecture!");
    console.log(`==================================================`);
})();