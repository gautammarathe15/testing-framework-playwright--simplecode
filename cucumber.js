/**
 * CUCUMBER CONFIGURATION
 * Supports multiple reporting formats: Cucumber HTML & Allure Reports
 */

module.exports = {
  default: {
    require: [
      'features/step_definitions/**/*.js',
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
    parallel: 2,
    retry: 0,
    strict: true,
    dryRun: false,
    failFast: false,
    timeout: 60000,
    worldParameters: {
      appUrl: process.env.BASE_URL || 'http://localhost:3000',
      browser: process.env.BROWSER || 'chromium',
      headless: process.env.HEADLESS !== 'false',
    }
  },

  // Shift Module Tests
  shift: {
    require: [
      'features/step_definitions/**/*.js',
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
      'features/step_definitions/**/*.js',
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
      'features/step_definitions/**/*.js',
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
      'features/step_definitions/**/*.js',
      'features/support/**/*.js',
    ],
    format: [
      'progress-bar',
      'html:cucumber-report-smoke.html',
      'json:./allure-results/smoke-report.json',
    ],
    tags: '@SMOKE',
    parallel: 2,
    timeout: 60000,
  },

  // Regression Tests
  regression: {
    require: [
      'features/step_definitions/**/*.js',
      'features/support/**/*.js',
    ],
    format: [
      'progress-bar',
      'html:cucumber-report-regression.html',
      'json:./allure-results/regression-report.json',
    ],
    tags: '@REGRESSION or @MODULE',
    parallel: 2,
    timeout: 60000,
  },

  // Debug Profile
  debug: {
    require: [
      'features/step_definitions/**/*.js',
      'features/support/**/*.js',
    ],
    format: [
      'progress-bar',
      'html:cucumber-report-debug.html',
      'json:./allure-results/debug-report.json',
    ],
    parallel: 1,
    timeout: 120000,
    dryRun: false,
    strict: true,
  },
};
      'features/support/**/*.js',
    ],
    format: [
      'progress-bar',
      'html:cucumber-report-api.html',
      'json:cucumber-report-api.json',
    ],
    tags: '@api',
    parallel: 2,
  },

  negative: {
    require: [
      'features/step_definitions/**/*.js',
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

  accessibility: {
    require: [
      'features/step_definitions/**/*.js',
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

  debug: {
    require: [
      'features/step_definitions/**/*.js',
      'features/support/**/*.js',
    ],
    format: [
      'progress-bar',
      'usage:usage.txt',
    ],
    tags: '@smoke',
    dryRun: false,
    failFast: true,
  },
};
