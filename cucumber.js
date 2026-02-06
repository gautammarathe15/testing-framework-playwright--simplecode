module.exports = {
  default: {
    require: ['features/step_definitions/**/*.js', 'features/support/**/*.js'],
    format: ['progress-bar', 'json:cucumber-report.json', 'html:cucumber-report.html'],
    formatOptions: { snippetInterface: 'async-await' }
  }
};
