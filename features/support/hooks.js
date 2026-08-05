/**
 * HOOKS - Test Lifecycle Hooks
 * Handles setup, teardown, and reporting
 */

const { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium, firefox, webkit } = require('@playwright/test');
const fs = require('fs');

// 🟢 1. सेट Global Timeout to 30 Seconds (इथे सेट केल्यामुळे सर्व स्टेप्सला स्वतंत्रपणे टाइमआऊट द्यावा लागणार नाही)
setDefaultTimeout(30000);

// Global browser instance
let browser;

/**
 * BeforeAll - Initialize browser once for all tests
 */
BeforeAll(async function() {
    const browserType = process.env.BROWSER || 'chromium';
    const isHeadless = process.env.HEADLESS === 'true'; 
    
    switch(browserType.toLowerCase()) {
        case 'firefox':
            browser = await firefox.launch({ headless: isHeadless });
            break;
        case 'webkit':
            browser = await webkit.launch({ headless: isHeadless });
            break;
        case 'chromium':
        default:
            browser = await chromium.launch({ 
                headless: isHeadless,  
                channel: 'chrome'
            });
            break;
    }
    
    console.log(`🚀 Global Browser Launched: ${browserType}`);
});

/**
 * Before - Setup before each scenario
 */
Before(async function(scenario) {
    this.context = await browser.newContext({
        recordVideo: process.env.RECORD_VIDEO === 'true' ? { dir: './videos' } : undefined
    });
    
    this.page = await this.context.newPage();
    await this.page.setViewportSize({ width: 1280, height: 720 });
    
    this.scenarioName = scenario?.pickle?.name || 'Unnamed_Scenario';
    console.log(`\n▶️ Starting Scenario: ${this.scenarioName}`);
});

/**
 * After - Cleanup after each scenario & handle failure reporting
 */
After(async function(scenario) {
    const scenarioName = scenario?.pickle?.name || this.scenarioName || 'Unnamed_Scenario';
    const status = scenario?.result?.status;

    // टेस्ट फेल झाल्यास स्क्रीनशॉट काढणे आणि रिपोर्टला अटॅच करणे
    if (status === Status.FAILED) {
        const sanitizedTitle = scenarioName.replace(/[^a-zA-Z0-9]/g, '_');
        const screenshotPath = `./screenshots/${sanitizedTitle}_failure.png`;
        
        if (!fs.existsSync('./screenshots')) {
            fs.mkdirSync('./screenshots', { recursive: true });
        }

        if (this.page) {
            // १. स्क्रीनशॉट डिस्कवर सेव्ह करा
            const imgBuffer = await this.page.screenshot({ 
                path: screenshotPath, 
                fullPage: true 
            });
            console.log(`❌ Scenario Failed. Screenshot saved at: ${screenshotPath}`);

            // २. Cucumber HTML रिपोर्टसाठी इमेज अटॅच करा
            await this.attach(imgBuffer, 'image/png');
        }
    }

    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
});

/**
 * AfterAll - Cleanup after all tests completed
 */
AfterAll(async function() {
    if (browser) {
        await browser.close();
        console.log('🔒 Global Browser Closed');
    }
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});