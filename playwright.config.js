const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright Configuration for CLMS UI Automation Tests
 * @see https://playwright.dev/docs/test-configuration
 */

module.exports = defineConfig({
  testDir: './pages',
  testMatch: '**/*.js',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,

  /* 🎯 Extended Reports Configuration */
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'always' }], // 👈 'open: always' मुळे टेस्ट संपताच रिपोर्ट ब्राउझरमध्ये ऑटोमॅटिकली उघडेल
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }]
  ],

  /* Shared settings for all the projects below. */
  use: {
    /* 🎯 CLMS Base URL */
    baseURL: 'http://192.168.40.115/CLMS_ENT_5.5/app',

    /* Headless mode false */
    headless: false,

    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',

    /* 🎯 प्रत्येक टेस्टचा स्क्रीनशॉट रिपोर्टमध्ये दिसेल */
    screenshot: 'on',

    /* Video retain on failure */
    video: 'retain-on-failure',

    /* Viewport configuration */
    viewport: { width: 1366, height: 768 },

    /* Ignore HTTPS errors */
    ignoreHTTPSErrors: true,

    /* Accept downloads */
    acceptDownloads: true,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'Google Chrome',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome' // 👈 लोकल ओरिजिनल क्रोम ब्राऊझर वापरण्यासाठी
      },
    },
  ],

  /* Global timeout for each test */
  timeout: 30 * 1000, // 30 seconds

  /* Timeout for each action (click, fill, etc.) */
  navigationTimeout: 30000,

  /* Timeout for expect() assertion */
  expectTimeout: 5000,

  /* Quiet mode */
  quiet: false,
});