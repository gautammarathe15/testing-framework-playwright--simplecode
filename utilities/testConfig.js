/**
 * TEST CONFIGURATION
 * Environment variables and test settings
 */

module.exports = {
    // Application Settings
    appConfig: {
        baseUrl: process.env.BASE_URL || 'http://localhost:3000',
        env: process.env.ENV || 'staging',
        timeout: parseInt(process.env.TIMEOUT) || 30000,
        slowMo: parseInt(process.env.SLOW_MO) || 0,
    },

    // Browser Settings
    browserConfig: {
        browser: process.env.BROWSER || 'chromium',
        headless: process.env.HEADLESS !== 'false',
        viewport: {
            width: 1280,
            height: 720
        },
        recordVideo: process.env.RECORD_VIDEO === 'true',
        recordHar: process.env.RECORD_HAR !== 'false',
    },

    // Test Settings
    testConfig: {
        parallel: parseInt(process.env.PARALLEL) || 2,
        retry: parseInt(process.env.RETRY) || 0,
        timeout: 60000,
        tags: process.env.TAGS || '@SMOKE or @REGRESSION',
    },

    // Reporting Settings
    reportConfig: {
        allure: {
            enabled: true,
            resultsDir: './allure-results',
            reportDir: './allure-report',
        },
        cucumber: {
            enabled: true,
            htmlReport: 'cucumber-report-extended.html',
            jsonReport: 'cucumber-report.json',
            junitReport: 'cucumber-results.xml',
        },
        screenshots: {
            enabled: true,
            path: './screenshots',
            onFailure: true,
        },
        videos: {
            enabled: process.env.RECORD_VIDEO === 'true',
            path: './videos',
        },
    },

    // Credentials (Use environment variables in production)
    credentials: {
        username: process.env.TEST_USER || 'testuser@example.com',
        password: process.env.TEST_PASSWORD || 'password123',
    },

    // Feature Modules
    modules: {
        shift: {
            name: 'Shift Management',
            description: 'Shift scheduling and management module',
            enabled: true,
        },
        leave: {
            name: 'Leave Management',
            description: 'Leave application and approval module',
            enabled: true,
        },
        attendance: {
            name: 'Attendance Management',
            description: 'Attendance tracking and management module',
            enabled: true,
        },
    },

    // Test Data
    testData: {
        defaultWaitTime: 5000,
        shortWaitTime: 2000,
        longWaitTime: 10000,
    },
};
