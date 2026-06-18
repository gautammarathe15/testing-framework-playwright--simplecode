
/**
 * HOOKS - Test Lifecycle Hooks
 * Tier 2 - Step Definitions & Lifecycle Hooks
 * Handles setup, teardown, and Allure reporting
 */

const { Before, After, BeforeAll, AfterAll, Status } = require('@cucumber/cucumber');
const { chromium, firefox, webkit } = require('@playwright/test');
const allure = require('allure-playwright');
const path = require('path');
const fs = require('fs');

// Global browser instance
let browser;

/**
 * BeforeAll - Initialize browser once for all tests
 */
BeforeAll(async function() {
    const browserType = process.env.BROWSER || 'chromium';
    
    switch(browserType.toLowerCase()) {
        case 'firefox':
            browser = await firefox.launch({ headless: process.env.HEADLESS !== 'false' });
            break;
        case 'webkit':
            browser = await webkit.launch({ headless: process.env.HEADLESS !== 'false' });
            break;
        case 'chromium':
        default:
            browser = await chromium.launch({ headless: process.env.HEADLESS !== 'false' });
    }
    
    console.log(`Browser launched: ${browserType}`);
});

/**
 * Before - Setup before each scenario
 */
Before(async function() {
    // Create new page context for each scenario
    this.context = await browser.newContext({
        recordVideo: process.env.RECORD_VIDEO === 'true' ? { dir: './videos' } : undefined,
        recordHar: { path: './hars/request.har' }
    });
    
    this.page = await this.context.newPage();
    
    // Set viewport
    await this.page.setViewportSize({ width: 1280, height: 720 });
    
    // Enable Allure screenshot on every action
    allure.attachScreenshot(this.page);
    
    // Navigate to base URL
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    await this.page.goto(baseUrl, { waitUntil: 'networkidle' }).catch(() => {
        // Continue even if URL is not available
    });
    
    // Add Allure step tracking
    this.allure = allure;
    this.scenarioName = this.pickle.name;
});

/**
 * After - Cleanup after each scenario
 */
After(async function(scenario) {
    // Attach screenshot on failure
    if (scenario.result.status === Status.FAILED) {
        const screenshot = await this.page.screenshot({ 
            path: `./screenshots/${scenario.pickle.name.replace(/\s+/g, '_')}_failure.png`,
            fullPage: true 
        });
        
        allure.addAttachment(
            'Failure Screenshot',
            screenshot,
            'image/png'
        );
        
        // Attach console logs
        const logs = await this.page.evaluate(() => {
            return JSON.stringify(window.__consoleLogs || []);
        }).catch(() => '[]');
        
        allure.addAttachment(
            'Console Logs',
            logs,
            'application/json'
        );
    }
    
    // Attach HAR file for debugging
    const harPath = './hars/request.har';
    if (fs.existsSync(harPath)) {
        const harContent = fs.readFileSync(harPath, 'utf-8');
        allure.addAttachment(
            'Network HAR',
            harContent,
            'application/json'
        );
    }
    
    // Add test metadata
    allure.addLabel('feature', scenario.pickle.tags[0]?.name || 'General');
    allure.addLabel('story', scenario.pickle.name);
    allure.addLabel('browser', process.env.BROWSER || 'chromium');
    allure.addLabel('environment', process.env.ENV || 'staging');
    
    // Close page and context
    await this.page.close();
    await this.context.close();
});

/**
 * AfterAll - Cleanup after all tests
 */
AfterAll(async function() {
    if (browser) {
        await browser.close();
        console.log('Browser closed');
    }
});

/**
 * Global error handler
 */
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = { browser };
