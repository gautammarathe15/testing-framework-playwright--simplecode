const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright Configuration for CLMS UI Automation Tests
 * @see https://playwright.dev/docs/test-configuration
 */

const selectedBrowser = (process.env.BROWSER || 'chromium').toLowerCase();

const browserProjects = {
  chromium: [{
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
      channel: 'chrome'
    }
  }],
  chrome: [{
    name: 'chrome',
    use: {
      ...devices['Desktop Chrome'],
      channel: 'chrome'
    }
  }],
  firefox: [{
    name: 'firefox',
    use: {
      ...devices['Desktop Firefox']
    }
  }],
  webkit: [{
    name: 'webkit',
    use: {
      ...devices['Desktop Safari']
    }
  }],
  all: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ]
};

module.exports = defineConfig({
  testDir: './pages',
  testMatch: '**/*.js',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'always' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }]
  ],

  use: {
    baseURL: process.env.BASE_URL || 'http://192.168.40.115/CLMS_ENT_5.5/app',
    headless: process.env.HEADLESS === 'true',
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'retain-on-failure',
    viewport: { width: 1366, height: 768 },
    ignoreHTTPSErrors: true,
    acceptDownloads: true,
  },

  projects: browserProjects[selectedBrowser] || browserProjects.chromium,

  timeout: 30 * 1000,
  navigationTimeout: 30000,
  expectTimeout: 5000,
  quiet: false,
});