/**
 * HOOKS - Test Lifecycle Management
 * Handles setup, teardown, page objects, and reporting
 */

const { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium, firefox, webkit } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// 🎯 Import Playwright config to get baseURL
const config = require('../../playwright.config');

// 🟢 Set Global Timeout to 30 Seconds
setDefaultTimeout(30000);

let browser;

/**
 * BeforeAll - Initialize browser instance once
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
    
    console.log(`🚀 Global Browser Launched: ${browserType.toUpperCase()}`);
});

/**
 * Before - Setup context, page, and baseURL before each scenario
 */
Before(async function(scenario) {
    // 🎯 Resolve Base URL dynamically
    const targetBaseUrl = process.env.BASE_URL || config.use?.baseURL || 'http://192.168.40.115/CLMS_ENT_5.5/app';

    // 🎯 Pass baseURL inside context options
    this.context = await browser.newContext({
        baseURL: targetBaseUrl,
        recordVideo: process.env.RECORD_VIDEO === 'true' ? { dir: './videos' } : undefined
    });
    
    this.page = await this.context.newPage();
    await this.page.setViewportSize({ width: 1366, height: 768 });
    
    // 🎯 Bind Page Objects here if needed (e.g., ClmsLoginPage)
    // const { ClmsLoginPage } = require('./pages/clmsLoginPage');
    // this.clmsLoginPage = new ClmsLoginPage(this.page);

    this.scenarioName = scenario?.pickle?.name || 'Unnamed_Scenario';
    console.log(`\n▶️ Starting Scenario: "${this.scenarioName}"`);
});

/**
 * After - Cleanup and capture screenshots on failure
 */
After(async function(scenario) {
    const scenarioName = scenario?.pickle?.name || this.scenarioName || 'Unnamed_Scenario';
    const status = scenario?.result?.status;

    if (status === Status.FAILED) {
        const sanitizedTitle = scenarioName.replace(/[^a-zA-Z0-9]/g, '_');
        const screenshotDir = './screenshots';
        const screenshotPath = path.join(screenshotDir, `${sanitizedTitle}_failure.png`);
        
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }

        if (this.page) {
            const imgBuffer = await this.page.screenshot({ 
                path: screenshotPath, 
                fullPage: true 
            });
            console.log(`❌ Scenario Failed. Screenshot saved at: ${screenshotPath}`);

            // Attach screenshot to Cucumber HTML Report
            await this.attach(imgBuffer, 'image/png');
        }
    }

    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
});

/**
 * AfterAll - Close browser after test suite completion
 */
AfterAll(async function() {
    if (browser) {
        await browser.close();
        console.log('🔒 Global Browser Closed Successfully');
    }
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});