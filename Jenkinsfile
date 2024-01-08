pipeline {
    agent any  // Run on any available agent
    tools {nodejs "Node"}  // Use the Node.js installation named "Node"

    environment {
        // Define the necessary environment variables
        EC2_IP = 'ec2-54-244-205-65.us-west-2.compute.amazonaws.com'
        EC2_USER = 'ubuntu'
        REMOTE_DIRECTORY = 'repos/bank-system-api'
        SSH_KEY_ID = 'ec2-ssh-key' // The ID you gave to the SSH private key in Jenkins' credentials store
    }

    stages {
        stage('Build') {
            steps {
                sshagent(credentials: [env.SSH_KEY_ID]) {
                    script {
                        try {
                            // SSH into the EC2 instance and pull the latest code
                            sh "ssh -o StrictHostKeyChecking=no ${env.EC2_USER}@${env.EC2_IP} 'cd ${env.REMOTE_DIRECTORY} && git pull'"
                        } catch (Exception e) {
                            // Handle errors related to the Build stage
                            echo "Error in Build stage: ${e.getMessage()}"
                            error("Failing the build due to an error in the Build stage")
                        }
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                sshagent(credentials: [env.SSH_KEY_ID]) {
                    script {
                        try {
                            // SSH into the EC2 instance, install dependencies, and start the application using PM2
                            sh """
                                ssh -o StrictHostKeyChecking=no ${env.EC2_USER}@${env.EC2_IP} '
                                    cd ${env.REMOTE_DIRECTORY} &&
                                    npm install &&
                                    npx pm2 start npm --name "bank-system-api" -- start
                                '
                            """
                        } catch (Exception e) {
                            // Handle errors related to the Deploy stage
                            echo "Error in Deploy stage: ${e.getMessage()}"
                            error("Failing the build due to an error in the Deploy stage")
                        }
                    }
                }
            }
        }

        stage('Run Tests') {
            steps {
                sshagent(credentials: [env.SSH_KEY_ID]) {
                    script {
                        try {
                            // SSH into the EC2 instance and run tests
                            sh "ssh -o StrictHostKeyChecking=no ${env.EC2_USER}@${env.EC2_IP} 'cd ${env.REMOTE_DIRECTORY} && npm test'"
                        } catch (Exception e) {
                            // Handle errors related to the Run Tests stage
                            echo "Error in Run Tests stage: ${e.getMessage()}"
                            error("Failing the build due to an error in the Run Tests stage")
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            // Actions to take on success
            sh 'echo "Successful Build!"'
            slackSend (
                color: 'good',  // 'good' is a Slack color for green
                message: "SUCCESS: BUILD ${env.BUILD_NUMBER} passed. Check details: ${env.BUILD_URL}"
            )
        }
        failure {
            // Actions to take on failure
            sh 'echo "Build Failed!"'
            slackSend (
                color: 'danger',  // 'danger' is a Slack color for red
                message: "FAILURE: BUILD ${env.BUILD_NUMBER} failed. Check details: ${env.BUILD_URL}"
            )
        }
        always {
            script {
                try {
                    sh 'echo "Sending email notification for build!"'
                    // Use the emailext function to send an HTML email
                    emailext(
                        to: 'kushagraseth.1996@gmail.com',
                        subject: "Build Status: ${env.PROJECT_NAME} - Build # ${env.BUILD_NUMBER} - ${env.BUILD_STATUS}!",
                        mimeType: 'text/html', // Specify that the content type of the email is HTML
                        body: """<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
                                <html>
                                <head>
                                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                                <title>Build Status</title>
                                </head>
                                <body>
                                <h2>Build Information:</h2>
                                <ul>
                                    <li><strong>Status:</strong> ${currentBuild.currentResult}</li>
                                    <li><strong>Job Name:</strong> ${env.JOB_NAME}</li>
                                    <li><strong>Build Number:</strong> ${env.BUILD_NUMBER}</li>
                                    <li><strong>Build URL:</strong> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></li>
                                </ul>
                                <h2>Changes:</h2>
                                ${currentBuild.changeSets.collect{ it.items.collect { change -> Util.escapeHtml(change.msg) }.join('<br>') }.join('<br>')}
                                <h2>Console Output:</h2>
                                <p><a href="${env.BUILD_URL}console">View Console Output</a></p>
                                <h3>Note:</h3>
                                <p>Check the console output for more details on the build process.</p>
                                </body>
                                </html>"""
                    )
                } catch (Exception e) {
                    // Handle errors related to sending emails
                    echo "Failed to send email: ${e.getMessage()}"
                }
            }
        }
    }
}
