const reporter = require('cucumber-html-reporter');

const options = {
    theme: 'bootstrap',
    jsonFile: 'cucumber-report.json',
    output: 'cucumber-report-extended.html',
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: false,
    metadata: {
        "App Version":"1.0.0",
        "Test Environment": "STAGING",
        "Browser": "Chrome",
        "Platform": "Windows 11",
        "Parallel": "Scenarios",
        "Executed": "Local"
    }
};

reporter.generate(options);
