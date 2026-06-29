/**
 * CUCUMBER CONFIGURATION
 * Optimized for CLMS Plain POM Framework with Modular Steps
 * Supports multiple reporting formats: Cucumber HTML & Allure Reports
 */

module.exports = {
  // Default Configuration Profile
  default: {
    require: [
      // 🎯 FIXED: Dynamic pattern to auto-load both 'login.steps.js' and your new 'master.steps.js'
      'features/step_definitions/*.steps.js', 
      'features/support/**/*.js',
    ],
    format: [
      'progress-bar',
      'html:cucumber-report.html',
      'json:cucumber-report.json',
      'junit:cucumber-results.xml',
      '@cucumber/pretty',
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
    require: [
      'features/step_definitions/*.steps.js',
      'features/support/**/*.js',
    ],
    format: [
      'progress-bar',
      'html:cucumber-report-shift.html',
      'json:./allure-results/shift-report.json',
    ],
    tags: '@SHIFT',
    parallel: 1,
    timeout: 60000,
  },

  // Leave Module Tests
  leave: {
    require: [
      'features/step_definitions/*.steps.js',
      'features/support/**/*.js',
    ],
    format: [
      'progress-bar',
      'html:cucumber-report-leave.html',
      'json:./allure-results/leave-report.json',
    ],
    tags: '@LEAVE',
    parallel: 1,
    timeout: 60000,
  },

  // Attendance Module Tests
  attendance: {
    require: [
      'features/step_definitions/*.steps.js',
      'features/support/**/*.js',
    ],
    format: [
      'progress-bar',
      'html:cucumber-report-attendance.html',
      'json:./allure-results/attendance-report.json',
    ],
    tags: '@ATTENDANCE',
    parallel: 1,
    timeout: 60000,
  },

  // Smoke Tests
  smoke: {
    require: [
      'features/step_definitions/*.steps.js',
      'features/support/**/*.js',
    ],
    format: [
      'progress-bar',
      'html:cucumber-report-smoke.html',
      'json:./allure-results/smoke-report.json',
    ],
    tags: '@SMOKE',
    parallel: 1,
    timeout: 60000,
  },

  // Regression Tests
  regression: {
    require: [
      'features/step_definitions/*.steps.js',
      'features/support/**/*.js',
    ],
    format: [
      'progress-bar',
      'html:cucumber-report-regression.html',
      'json:./allure-results/regression-report.json',
    ],
    tags: '@REGRESSION or @MODULE',
    parallel: 1,
    timeout: 60000,
  },

  // API Testing Profile
  api: {
    require: [
      'features/step_definitions/*.steps.js',
      'features/support/**/*.js',
    ],
    format: [
      'progress-bar',
      'html:cucumber-report-api.html',
      'json:cucumber-report-api.json',
    ],
    tags: '@api',
    parallel: 1,
  },

  // Negative Scenario Profile
  negative: {
    require: [
      'features/step_definitions/*.steps.js',
      'features/support/**/*.js',
    ],
    format: [
      'progress-bar',
      'html:cucumber-report-negative.html',
      'json:cucumber-report-negative.json',
    ],
    tags: '@negative',
    parallel: 1,
  },

  // Accessibility Testing Profile
  accessibility: {
    require: [
      'features/step_definitions/*.steps.js',
      'features/support/**/*.js',
    ],
    format: [
      'progress-bar',
      'html:cucumber-report-accessibility.html',
      'json:cucumber-report-accessibility.json',
    ],
    tags: '@accessibility',
    parallel: 1,
  },

  // Debug Profile
  debug: {
    require: [
      'features/step_definitions/*.steps.js',
      'features/support/**/*.js',
    ],
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