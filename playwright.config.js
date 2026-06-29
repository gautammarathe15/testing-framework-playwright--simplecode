const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright Configuration for CLMS UI Automation Tests
 * @see https://playwright.dev/docs/test-configuration
 */

module.exports = defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* 🎯 बदल १: तुमची CLMS ची ओरिजिनल URL इथे सेट केली आहे */
    baseURL: 'http://192.168.40.115/CLMS_ENT_5.5/app',

    /* Headless mode false केला जेणेकरून टेस्ट धावताना डोळ्यांसमोर ब्राउझर दिसेल */
    headless: false,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',

    /* Video on failure */
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
    /* 🎯 बदल २: इथे आपण तुमच्या सिस्टीममधील ओरिजिनल 'Google Chrome' चा पाथ सेट केला आहे */
    {
      name: 'Google Chrome',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome' // 👈 यामुळे ती 'Executable doesn't exist' एरर पुन्हा कधीच येणार नाही!
      },
    },

    /* Uncomment for Firefox testing if needed */
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
  ],

  /* Global timeout for each test */
  timeout: 30 * 1000, // 30 seconds

  /* Timeout for each action (click, fill, etc.) */
  navigationTimeout: 30000,

  /* Timeout for expect() assertion */
  expectTimeout: 5000,

  /* Quiet mode - no console output */
  quiet: false,
});