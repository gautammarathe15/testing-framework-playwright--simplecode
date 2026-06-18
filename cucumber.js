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
    ],
    formatOptions: {
      snippetInterface: 'async-await',
    },
    parallel: 2,
    retry: 0,
  },

  smoke: {
    require: [
      'features/step_definitions/**/*.js',
      'features/support/**/*.js',
    ],
    format: [
      'progress-bar',
      'html:cucumber-report-smoke.html',
      'json:cucumber-report-smoke.json',
    ],
    tags: '@smoke',
    parallel: 2,
  },

  regression: {
    require: [
      'features/step_definitions/**/*.js',
      'features/support/**/*.js',
    ],
    format: [
      'progress-bar',
      'html:cucumber-report-regression.html',
      'json:cucumber-report-regression.json',
    ],
    tags: '@regression or @end-to-end',
    parallel: 2,
  },

  api: {
    require: [
      'features/step_definitions/**/*.js',
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
