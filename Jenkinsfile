pipeline {
    agent any

    tools {
        nodejs 'node' // Ensure Node.js is configured in Jenkins Global Tool Configuration
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: ''
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install'
            }
        }

        stage('Run Tests') {
            steps {
                bat 'npm test'
            }
        }

        stage('Generate Report') {
            steps {
                bat 'node generate-report.js'
            }
        }
    }

    post {
        always {
            publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: true, reportDir: '.', reportFiles: 'cucumber-report-extended.html', reportName: 'Cucumber Report', reportTitles: 'Test Report'])
            archiveArtifacts artifacts: 'test-results/**, playwright-report/**'
        }
    }
}
