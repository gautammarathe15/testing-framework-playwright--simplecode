/**
 * REPORT GENERATION
 * Generates both Cucumber HTML and Allure Reports
 */

const reporter = require('cucumber-html-reporter');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Ensure directories exist
const allureResultsDir = './allure-results';
if (!fs.existsSync(allureResultsDir)) {
    fs.mkdirSync(allureResultsDir, { recursive: true });
}

/**
 * Open HTML report automatically in default browser
 */
const autoOpenReport = (filePath) => {
    if (fs.existsSync(filePath)) {
        console.log(`🌐 Opening report automatically: ${filePath}`);
        const command = process.platform === 'win32' ? `start "" "${filePath}"` : `open "${filePath}"`;
        exec(command, (error) => {
            if (error) {
                console.log(`⚠️ Could not auto-open browser automatically. You can manually open ${filePath}`);
            }
        });
    }
};

const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatDuration = (durationMs) => {
    const totalMs = Number(durationMs) || 0;
    const seconds = totalMs / 1000000000;

    if (seconds >= 60) {
        return `${(seconds / 60).toFixed(2)} min`;
    }

    if (seconds >= 1) {
        return `${seconds.toFixed(2)} sec`;
    }

    return `${Math.round(seconds * 1000)} ms`;
};

const buildReferenceData = (jsonFile) => {
    const rawReport = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
    const featureSummaries = new Map();
    const scenarioRows = [];

    const reportRoots = Array.isArray(rawReport) ? rawReport : [rawReport];

    reportRoots.forEach((featureReport) => {
        const featureName = featureReport.name || path.basename(jsonFile);
        const featureFile = featureReport.uri || featureReport.keyword || featureName;
        const elements = Array.isArray(featureReport.elements) ? featureReport.elements : [];

        elements.forEach((element) => {
            if (!Array.isArray(element.steps) || !element.steps.length) {
                return;
            }

            const visibleSteps = element.steps.filter((step) => !step.hidden);
            if (!visibleSteps.length) {
                return;
            }

            let status = 'passed';
            let totalDuration = 0;

            visibleSteps.forEach((step) => {
                const stepStatus = step.result && step.result.status;
                const stepDuration = step.result && step.result.duration ? step.result.duration : 0;
                totalDuration += stepDuration;

                if (stepStatus === 'failed') {
                    status = 'failed';
                } else if (status !== 'failed' && stepStatus === 'pending') {
                    status = 'pending';
                } else if (status === 'passed' && stepStatus === 'skipped') {
                    status = 'skipped';
                } else if (status === 'passed' && stepStatus === 'undefined') {
                    status = 'undefined';
                }
            });

            const featureKey = featureFile || featureName;
            const featureSummary = featureSummaries.get(featureKey) || {
                featureName,
                featureFile,
                total: 0,
                passed: 0,
                failed: 0,
                skipped: 0,
                pending: 0,
                undefined: 0
            };

            featureSummary.total += 1;
            featureSummary[status] = (featureSummary[status] || 0) + 1;
            featureSummaries.set(featureKey, featureSummary);

            scenarioRows.push({
                featureName,
                scenarioName: element.name || 'Unnamed Scenario',
                status,
                duration: totalDuration,
                line: element.line || ''
            });
        });
    });

    const totals = scenarioRows.reduce((summary, row) => {
        summary.total += 1;
        summary[row.status] = (summary[row.status] || 0) + 1;
        summary.duration += row.duration;
        return summary;
    }, {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        pending: 0,
        undefined: 0,
        duration: 0
    });

    return {
        totals,
        featureSummaries: Array.from(featureSummaries.values()),
        scenarioRows
    };
};

const renderReferenceReport = (jsonFile, outputFile) => {
    if (!fs.existsSync(jsonFile)) {
        console.warn(`⚠️ "${jsonFile}" file clean or missing. Reference report skipped.`);
        return;
    }

    try {
        const { totals, featureSummaries, scenarioRows } = buildReferenceData(jsonFile);
        const statusBands = [
            { key: 'passed', label: 'Passed', color: '#28a745' },
            { key: 'failed', label: 'Failed', color: '#dc3545' },
            { key: 'skipped', label: 'Skipped', color: '#6c757d' },
            { key: 'pending', label: 'Pending', color: '#fd7e14' },
            { key: 'undefined', label: 'Undefined', color: '#17a2b8' }
        ];

        const safeTotal = totals.total || 1;
        const summaryCards = statusBands.map((band) => {
            const count = totals[band.key] || 0;
            const percentage = ((count / safeTotal) * 100).toFixed(1);

            return `
                <div class="card">
                    <div class="card-label">${band.label}</div>
                    <div class="card-value" style="color: ${band.color};">${count}</div>
                    <div class="card-meta">${percentage}% of scenarios</div>
                </div>`;
        }).join('');

        const chartRows = statusBands.map((band) => {
            const count = totals[band.key] || 0;
            const width = ((count / safeTotal) * 100).toFixed(1);

            return `
                <div class="chart-row">
                    <div class="chart-label">${band.label}</div>
                    <div class="chart-track">
                        <div class="chart-fill" style="width: ${width}%; background: ${band.color};"></div>
                    </div>
                    <div class="chart-count">${count}</div>
                </div>`;
        }).join('');

        const featureTableRows = featureSummaries.map((item) => `
            <tr>
                <td>${escapeHtml(item.featureName)}</td>
                <td>${escapeHtml(item.featureFile)}</td>
                <td>${item.total}</td>
                <td style="color: #28a745; font-weight: 700;">${item.passed || 0}</td>
                <td style="color: #dc3545; font-weight: 700;">${item.failed || 0}</td>
                <td>${item.skipped || 0}</td>
                <td>${item.pending || 0}</td>
                <td>${item.undefined || 0}</td>
            </tr>`).join('');

        const scenarioTableRows = scenarioRows.map((row) => `
            <tr>
                <td>${escapeHtml(row.featureName)}</td>
                <td>${escapeHtml(row.scenarioName)}</td>
                <td>${escapeHtml(row.line || '-')}</td>
                <td><span class="status status-${row.status}">${escapeHtml(row.status)}</span></td>
                <td>${formatDuration(row.duration)}</td>
            </tr>`).join('');

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cucumber Extended Reference Report</title>
    <style>
        body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            background: linear-gradient(180deg, #f6f8fb 0%, #edf2f7 100%);
            color: #1f2937;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 24px;
        }
        .hero {
            background: #0f172a;
            color: #fff;
            border-radius: 18px;
            padding: 24px;
            box-shadow: 0 12px 30px rgba(15, 23, 42, 0.16);
        }
        .hero h1 {
            margin: 0 0 8px;
            font-size: 28px;
        }
        .hero p {
            margin: 0;
            color: #cbd5e1;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 16px;
            margin-top: 20px;
        }
        .card, .panel {
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
            border: 1px solid rgba(148, 163, 184, 0.18);
        }
        .card {
            padding: 18px;
        }
        .card-label {
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #64748b;
            margin-bottom: 10px;
        }
        .card-value {
            font-size: 34px;
            font-weight: 800;
            line-height: 1;
        }
        .card-meta {
            margin-top: 8px;
            font-size: 13px;
            color: #64748b;
        }
        .panel {
            margin-top: 18px;
            padding: 20px;
        }
        .panel h2 {
            margin: 0 0 16px;
            font-size: 20px;
        }
        .chart-row {
            display: grid;
            grid-template-columns: 100px 1fr 60px;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
        }
        .chart-label {
            font-weight: 700;
        }
        .chart-track {
            height: 16px;
            border-radius: 999px;
            background: #e5e7eb;
            overflow: hidden;
        }
        .chart-fill {
            height: 100%;
            border-radius: 999px;
        }
        .chart-count {
            text-align: right;
            font-weight: 700;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
            background: #fff;
            border-radius: 16px;
            overflow: hidden;
        }
        th, td {
            border-bottom: 1px solid #e5e7eb;
            padding: 12px 10px;
            text-align: left;
            vertical-align: top;
        }
        th {
            background: #111827;
            color: #fff;
            position: sticky;
            top: 0;
            z-index: 1;
        }
        tbody tr:nth-child(even) td {
            background: #f9fafb;
        }
        .status {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 999px;
            color: #fff;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }
        .status-passed { background: #28a745; }
        .status-failed { background: #dc3545; }
        .status-skipped { background: #6c757d; }
        .status-pending { background: #fd7e14; }
        .status-undefined { background: #17a2b8; }
        .table-wrap {
            overflow-x: auto;
            border-radius: 16px;
            border: 1px solid rgba(148, 163, 184, 0.18);
        }
        .section-note {
            margin: 0 0 14px;
            color: #64748b;
        }
        @media (max-width: 720px) {
            .chart-row {
                grid-template-columns: 1fr;
            }
            .chart-count {
                text-align: left;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="hero">
            <h1>Cucumber Extended Reference Report</h1>
            <p>Additional reference view generated from <strong>cucumber-report.json</strong> without changing the live test flow.</p>
        </div>

        <div class="grid">
            ${summaryCards}
        </div>

        <div class="panel">
            <h2>Status Distribution</h2>
            <p class="section-note">This chart gives a quick at-a-glance reference for execution health.</p>
            ${chartRows}
        </div>

        <div class="panel">
            <h2>Feature Summary</h2>
            <p class="section-note">Breakdown of scenarios grouped by feature source.</p>
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Feature</th>
                            <th>Source</th>
                            <th>Total</th>
                            <th>Passed</th>
                            <th>Failed</th>
                            <th>Skipped</th>
                            <th>Pending</th>
                            <th>Undefined</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${featureTableRows || '<tr><td colspan="8">No feature summary rows found.</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>

        <div class="panel">
            <h2>Scenario Reference Table</h2>
            <p class="section-note">Detailed scenario list with status and total step duration.</p>
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Feature</th>
                            <th>Scenario</th>
                            <th>Line</th>
                            <th>Status</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${scenarioTableRows || '<tr><td colspan="5">No scenario rows found.</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</body>
</html>`;

        fs.writeFileSync(outputFile, html, 'utf8');
        console.log(`✅ Additional reference report generated: ${outputFile}`);
    } catch (error) {
        console.error('❌ Error generating Additional Reference Report:', error.message);
    }
};

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
        launchReport: true, // 👈 Automatic launch enable kela ahe
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
        if (fs.existsSync('cucumber-report.json')) {
            reporter.generate(options);
            console.log('✅ Cucumber HTML Report generated: cucumber-report-extended.html');
            autoOpenReport('cucumber-report-extended.html'); // 👈 Explicit Browser Open Trigger
        } else {
            console.warn('⚠️ "cucumber-report.json" file clean or missing. Standard report skipped.');
        }
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
        execSync('allure generate ./allure-results --clean -o ./allure-report', { stdio: 'pipe' });
        console.log('✅ Allure Report generated successfully');
        console.log('📂 View report at: ./allure-report/index.html');
    } catch (error) {
        console.log('⚠️ Allure CLI or Java missing/not configured properly.');
        console.log('💡 You can still view Cucumber HTML reports at: ./cucumber-report-extended.html');
    }
};

/**
 * Main Report Generation
 */
const generateReports = () => {
    console.log('\n🚀 Starting Report Generation...\n');
    
    generateCucumberHTMLReport();
    renderReferenceReport('cucumber-report.json', 'cucumber-report-reference.html');
    generateModuleReports();
    generateAllureReport();
    
    console.log('\n✨ Report Generation Complete!\n');
    console.log('📋 Available Reports:');
    console.log('   - Cucumber HTML: cucumber-report-extended.html');
    console.log('   - Reference Summary: cucumber-report-reference.html');
    console.log('   - Module Reports: cucumber-report-{shift|leave|attendance}-extended.html');
    console.log('   - Allure Report: allure-report/index.html (if available)');
    console.log('\n');
};

// Run report generation
generateReports();