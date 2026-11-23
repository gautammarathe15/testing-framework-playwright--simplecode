/**
 * HOOKS - Test Lifecycle Management
 * Handles setup, teardown, page objects, and reporting
 */

const { Before, After, BeforeAll, AfterAll, Status: CucumberStatus, setDefaultTimeout } = require('@cucumber/cucumber');
const fs = require('fs');
const path = require('path');
const { chromium, firefox, webkit } = require('@playwright/test');
const { AllureRuntime, AllureTest, Stage } = require('allure-js-commons');
const { resolveAppUrl } = require('../../utilities/environmentConfig');

// 🎯 Import Playwright config to get baseURL
const config = require('../../playwright.config');

const allureRuntime = new AllureRuntime({
    resultsDir: path.resolve(__dirname, '../../allure-results')
});

const addAllureAttachment = (allureTest, name, content, contentType = 'text/plain') => {
    if (!allureTest || !content) return;
    try {
        const attachmentFileName = allureRuntime.writeAttachment(content, contentType);
        allureTest.addAttachment(name, { contentType }, attachmentFileName);
    } catch (error) {
        console.warn(`⚠️ Allure attachment skipped for "${name}": ${error.message}`);
    }
};

const createAllureScenario = (scenario) => {
    const featureName = scenario?.gherkinDocument?.feature?.name || 'General Feature';
    const scenarioName = scenario?.pickle?.name || 'Unnamed Scenario';
    const tags = (scenario?.pickle?.tags || []).map((tag) => tag.name.replace(/^@/, ''));

    const allureTest = new AllureTest(allureRuntime, Date.now());
    allureTest.fullName = `${featureName} - ${scenarioName}`;
    allureTest.name = scenarioName;
    allureTest.historyId = scenario?.pickle?.id || `${featureName}:${scenarioName}`;
    allureTest.addLabel('feature', featureName);
    allureTest.addLabel('story', scenarioName);
    allureTest.addLabel('suite', featureName);
    allureTest.addLabel('owner', process.env.ALLURE_OWNER || 'QA Automation');
    allureTest.addLabel('severity', process.env.ALLURE_SEVERITY || 'normal');
    tags.forEach((tag) => allureTest.addLabel('tag', tag));

    return allureTest;
};

// 🟢 Set Global Timeout to 30 Seconds
setDefaultTimeout(30000);

let browser;
let scenarioExecutionCounts = {}; // 👈 Track retry attempts per scenario

/**
 * BeforeAll - Initialize browser instance once
 */
BeforeAll(async function() {
    const browserType = (process.env.BROWSER || 'chromium').toLowerCase();
    const isHeadless = process.env.HEADLESS === 'true';

    switch (browserType) {
        case 'firefox':
            browser = await firefox.launch({ headless: isHeadless });
            break;
        case 'webkit':
            browser = await webkit.launch({ headless: isHeadless });
            break;
        case 'chrome':
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
 * Before - Setup context, page, retry detection, and baseURL before each scenario
 */
Before(async function(scenario) {
    // 🎯 Resolve Base URL dynamically
    const targetBaseUrl = resolveAppUrl();
    console.log(`🌐 CLMS Environment: ${targetBaseUrl}`);

    // 🎯 Pass baseURL inside context options
    this.context = await browser.newContext({
        baseURL: targetBaseUrl,
        recordVideo: process.env.RECORD_VIDEO === 'true' ? { dir: './videos' } : undefined
    });
    
    this.page = await this.context.newPage();
    await this.page.setViewportSize({ width: 1366, height: 768 });
    
    this.scenarioName = scenario?.pickle?.name || 'Unnamed_Scenario';
    this.allureTest = createAllureScenario(scenario);
    this.allure = {
        step: async (name, callback) => {
            const step = this.allureTest.startStep(name);
            try {
                const value = callback ? await callback() : undefined;
                step.status = 'passed';
                step.stage = Stage.FINISHED;
                step.endStep(Date.now());
                return value;
            } catch (error) {
                step.status = 'failed';
                step.stage = Stage.INTERRUPTED;
                step.detailsMessage = error.message || '';
                step.detailsTrace = error.stack || '';
                step.endStep(Date.now());
                throw error;
            }
        },
        attach: (name, content, contentType = 'text/plain') => addAllureAttachment(this.allureTest, name, content, contentType),
        feature: (value) => this.allureTest.addLabel('feature', value),
        story: (value) => this.allureTest.addLabel('story', value),
        severity: (value) => this.allureTest.addLabel('severity', value),
        owner: (value) => this.allureTest.addLabel('owner', value),
        tag: (value) => this.allureTest.addLabel('tag', value)
    };

    // 🔄 Retry Tracking & Extra Buffer Wait Logic
    const scenarioId = scenario?.pickle?.id;
    if (scenarioId) {
        if (!scenarioExecutionCounts[scenarioId]) {
            scenarioExecutionCounts[scenarioId] = 1;
            this.isRetry = false;
        } else {
            scenarioExecutionCounts[scenarioId]++;
            this.isRetry = true;
            console.log(`\n🔄 Retrying Scenario (Attempt ${scenarioExecutionCounts[scenarioId]}): "${this.scenarioName}"`);
            
            // Retry run astana DOM elements/network sathi extra stability wait
            await this.page.waitForTimeout(2500);
        }
    }

    console.log(`\n▶️ Starting Scenario: "${this.scenarioName}"`);
});

/**
 * After - Cleanup and capture screenshots on failure
 */
After(async function(scenario) {
    const scenarioName = scenario?.pickle?.name || this.scenarioName || 'Unnamed_Scenario';
    const status = scenario?.result?.status;

    if (this.allureTest) {
        const allureStatus = status === CucumberStatus.FAILED ? 'failed' : status === CucumberStatus.PASSED ? 'passed' : 'skipped';
        this.allureTest.status = allureStatus;

        if (scenario?.result?.exception) {
            this.allureTest.detailsMessage = scenario.result.exception.message || String(scenario.result.exception);
            this.allureTest.detailsTrace = scenario.result.exception.stack || '';
        }

        if (status === CucumberStatus.FAILED) {
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
                const allureAttachment = allureRuntime.writeAttachment(imgBuffer, 'image/png');
                this.allureTest.addAttachment('failure_screenshot', { contentType: 'image/png' }, allureAttachment);
            }
        }

        this.allureTest.endTest(Date.now());
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