pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 60, unit: 'MINUTES')
    }

    tools {
        nodejs 'node'
    }

    environment {
        CI = 'true'
        PLAYWRIGHT_BROWSERS_PATH = '0'
        NODE_ENV = 'test'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm install --no-audit --no-fund'
                    } else {
                        bat 'npm install --no-audit --no-fund'
                    }
                }
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npx playwright install --with-deps'
                    } else {
                        bat 'npx playwright install'
                    }
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npx cucumber-js --profile default'
                    } else {
                        bat 'npx cucumber-js --profile default'
                    }
                }
            }
        }

        stage('Generate HTML Report') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'node generate-report.js'
                    } else {
                        bat 'node generate-report.js'
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                if (fileExists('cucumber-report-extended.html')) {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: '.',
                        reportFiles: 'cucumber-report-extended.html',
                        reportName: 'Cucumber Test Report',
                        reportTitles: 'CLMS Automation Report'
                    ])
                }

                if (fileExists('playwright-report') || fileExists('test-results') || fileExists('screenshots')) {
                    archiveArtifacts allowEmptyArchive: true, artifacts: 'playwright-report/**, test-results/**, screenshots/**, cucumber-report*.html', fingerprint: true
                }
            }

            junit allowEmptyResults: true, testResults: 'test-results/**/*.xml'
        }

        success {
            echo 'Jenkins pipeline completed successfully.'
        }

        failure {
            echo 'Jenkins pipeline failed. Please review test results and artifacts.'
        }
    }
}
