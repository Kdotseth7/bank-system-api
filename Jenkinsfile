pipeline {
    agent any  // Run on any available agent
    tools {nodejs "Node"}  // Use the Node.js installation named "Node"

    environment {
        // Define the necessary environment variables
        EC2_IP = 'ec2-54-244-205-65.us-west-2.compute.amazonaws.com'
        EC2_USER = 'ubuntu'
        REMOTE_DIRECTORY = 'repos'
        SSH_KEY_ID = 'bank-system-ec2-ssh-key' // The ID you gave to the SSH private key in Jenkins' credentials store
    }

    stages {
        stage('Build') {
            steps {
                sshagent([SSH_KEY_ID]) {
                    script {
                        try {
                            // SSH into the EC2 instance and pull the latest code
                            sh "ssh ${EC2_USER}@${EC2_IP} 'cd ${REMOTE_DIRECTORY} && git pull'"
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
                sshagent([SSH_KEY_ID]) {
                    script {
                        try {
                            // SSH into the EC2 instance, install dependencies, and start the application using PM2
                            sh """
                                ssh ${EC2_USER}@${EC2_IP} '
                                    cd ${REMOTE_DIRECTORY} &&
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
                sshagent([SSH_KEY_ID]) {
                    script {
                        try {
                            // SSH into the EC2 instance and run tests
                            sh "ssh ${EC2_USER}@${EC2_IP} 'cd ${REMOTE_DIRECTORY} && npm test'"
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
                    // Actions to always take
                    mail to: 'kushagraseth.1996@gmail.com',
                         subject: "Pipeline: ${currentBuild.fullDisplayName}",
                         body: "Click to view build -> ${env.BUILD_URL}."
                } catch (Exception e) {
                    // Handle errors related to sending emails
                    echo "Failed to send email: ${e.getMessage()}"
                }
            }
        }
    }
}
