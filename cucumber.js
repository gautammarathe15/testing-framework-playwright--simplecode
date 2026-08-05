/**
 * CUCUMBER CONFIGURATION
 * Optimized for CLMS Plain POM Framework with Modular Steps
 * Supports multiple reporting formats: Cucumber HTML & Allure Reports
 */

// Common loader for step definitions to prevent duplication
const commonRequire = [
  './features/step_definitions/*.js',
  './features/step_definitions/**/*.js',
  './features/support/*.js',
  './features/support/**/*.js'
];

const commonPaths = [
  './features/**/*.feature'
];

module.exports = {
  // Default Configuration Profile
  default: {
    paths: commonPaths, 
    require: commonRequire,
    format: [
      'progress-bar',
      'html:cucumber-report.html',
      'json:cucumber-report.json',
      'junit:cucumber-results.xml',
    ],
    formatOptions: {
      snippetInterface: 'async-await',
    },
    parallel: 1, 
    retry: 0,
    strict: true,
    dryRun: false,
    failFast: false,
    timeout: 60000,
    worldParameters: {
      appUrl: process.env.BASE_URL || 'http://192.168.40.115/CLMS_ENT_5.5/app',
      browser: process.env.BROWSER || 'chromium',
      headless: process.env.HEADLESS !== 'false',
    }
  },

  // Shift Module Tests
  shift: {
    paths: commonPaths,
    require: commonRequire,
    format: [
      'progress-bar',
      'html:cucumber-report-shift.html',
      'json:cucumber-report.json',
      'json:cucumber-report-shift.json'
    ],
    tags: '@SHIFT',
    parallel: 1,
    timeout: 60000,
  },

  // Leave Module Tests
  leave: {
    paths: commonPaths,
    require: commonRequire,
    format: [
      'progress-bar',
      'html:cucumber-report-leave.html',
      'json:cucumber-report.json',
      'json:cucumber-report-leave.json'
    ],
    tags: '@LEAVE',
    parallel: 1,
    timeout: 60000,
  },

  // Attendance Module Tests
  attendance: {
    paths: commonPaths,
    require: commonRequire,
    format: [
      'progress-bar',
      'html:cucumber-report-attendance.html',
      'json:cucumber-report.json',
      'json:cucumber-report-attendance.json'
    ],
    tags: '@ATTENDANCE',
    parallel: 1,
    timeout: 60000,
  },

  // Smoke Tests
  smoke: {
    paths: commonPaths,
    require: commonRequire,
    format: [
      'progress-bar',
      'html:cucumber-report-smoke.html',
      'json:cucumber-report.json'
    ],
    tags: '@SMOKE',
    parallel: 1,
    timeout: 60000,
  },

  // Regression Tests
  regression: {
    paths: commonPaths,
    require: commonRequire,
    format: [
      'progress-bar',
      'html:cucumber-report-regression.html',
      'json:cucumber-report.json'
    ],
    tags: '@REGRESSION or @MODULE',
    parallel: 1,
    timeout: 60000,
  },

  // API Testing Profile
  api: {
    paths: commonPaths,
    require: commonRequire,
    format: [
      'progress-bar',
      'html:cucumber-report-api.html',
      'json:cucumber-report.json'
    ],
    tags: '@api',
    parallel: 1,
  },

  // Negative Scenario Profile
  negative: {
    paths: commonPaths,
    require: commonRequire,
    format: [
      'progress-bar',
      'html:cucumber-report-negative.html',
      'json:cucumber-report.json'
    ],
    tags: '@negative',
    parallel: 1,
  },

  // Accessibility Testing Profile
  accessibility: {
    paths: commonPaths,
    require: commonRequire,
    format: [
      'progress-bar',
      'html:cucumber-report-accessibility.html',
      'json:cucumber-report.json'
    ],
    tags: '@accessibility',
    parallel: 1,
  },

  // Debug Profile
  debug: {
    paths: commonPaths,
    require: commonRequire,
    format: [
      'progress-bar',
      'usage:usage.txt',
    ],
    tags: '@smoke',
    parallel: 1,
    dryRun: false,
    failFast: true,
    strict: true,
  }
};