/**
 * REPORT GENERATION
 * Generates both Cucumber HTML and Allure Reports
 */

const reporter = require('cucumber-html-reporter');
const fs = require('fs');
const path = require('path');

// Ensure directories exist
const allureResultsDir = './allure-results';
if (!fs.existsSync(allureResultsDir)) {
    fs.mkdirSync(allureResultsDir, { recursive: true });
}

/**
 * Generate Cucumber HTML Report
 */
const generateCucumberHTMLReport = () => {
    console.log('📊 Generating Cucumber HTML Report...');
    
    const options = {
        theme: 'bootstrap',
        jsonFile: 'cucumber-report.json',
        output: 'cucumber-report-extended.html',
        reportSuiteAsScenarios: true,
        scenarioTimestamp: true,
        launchReport: false,
        metadata: {
            "App Version": "1.0.0",
            "Test Environment": process.env.ENV || "STAGING",
            "Browser": process.env.BROWSER || "Chromium",
            "Platform": process.platform.toUpperCase(),
            "Parallel": "Scenarios",
            "Executed": "Local"
        }
    };

    try {
        reporter.generate(options);
        console.log('✅ Cucumber HTML Report generated: cucumber-report-extended.html');
    } catch (error) {
        console.error('❌ Error generating Cucumber HTML Report:', error.message);
    }
};

/**
 * Generate Module-Specific Reports
 */
const generateModuleReports = () => {
    console.log('📊 Generating Module-Specific Reports...');
    
    const modules = ['shift', 'leave', 'attendance'];
    
    modules.forEach(module => {
        const jsonFile = `cucumber-report-${module}.json`;
        const htmlFile = `cucumber-report-${module}-extended.html`;
        
        if (fs.existsSync(jsonFile)) {
            const options = {
                theme: 'bootstrap',
                jsonFile: jsonFile,
                output: htmlFile,
                reportSuiteAsScenarios: true,
                scenarioTimestamp: true,
                launchReport: false,
                metadata: {
                    "Module": module.toUpperCase(),
                    "Test Environment": process.env.ENV || "STAGING",
                    "Browser": process.env.BROWSER || "Chromium",
                    "Generated": new Date().toLocaleString()
                }
            };
            
            try {
                reporter.generate(options);
                console.log(`✅ ${module.toUpperCase()} Report generated: ${htmlFile}`);
            } catch (error) {
                console.error(`❌ Error generating ${module} report:`, error.message);
            }
        }
    });
};

/**
 * Generate Allure Report
 */
const generateAllureReport = () => {
    console.log('📊 Generating Allure Report...');
    
    const { execSync } = require('child_process');
    
    try {
        // Clean and generate Allure report
        execSync('allure generate ./allure-results --clean -o ./allure-report', { stdio: 'inherit' });
        console.log('✅ Allure Report generated successfully');
        console.log('📂 View report at: ./allure-report/index.html');
    } catch (error) {
        console.error('⚠️  Allure CLI not found. Install with: npm install -g allure-commandline');
        console.log('💡 You can still view Cucumber HTML reports at: ./cucumber-report-extended.html');
    }
};

/**
 * Main Report Generation
 */
const generateReports = () => {
    console.log('\n🚀 Starting Report Generation...\n');
    
    generateCucumberHTMLReport();
    generateModuleReports();
    generateAllureReport();
    
    console.log('\n✨ Report Generation Complete!\n');
    console.log('📋 Available Reports:');
    console.log('   - Cucumber HTML: cucumber-report-extended.html');
    console.log('   - Module Reports: cucumber-report-{shift|leave|attendance}-extended.html');
    console.log('   - Allure Report: allure-report/index.html (if available)');
    console.log('\n');
};

// Run report generation
generateReports();
