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
                script {
                    // Using SSH Agent to handle the private key
                    sshagent([SSH_KEY_ID]) {
                        // SSH into the EC2 instance and pull the latest code
                        sh "ssh ${EC2_USER}@${EC2_IP} 'cd ${REMOTE_DIRECTORY} && git pull'"
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sshagent([SSH_KEY_ID]) {
                        // SSH into the EC2 instance and restart the server
                        sh "ssh ${EC2_USER}@${EC2_IP} 'cd ${REMOTE_DIRECTORY} && npm install && pm2 restart all'"
                    }
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    sshagent([SSH_KEY_ID]) {
                        // SSH into the EC2 instance and run tests
                        sh "ssh ${EC2_USER}@${EC2_IP} 'cd ${REMOTE_DIRECTORY} && npm test'"
                    }
                }
            }
        }
    }

    post {
        // Define actions to take based on the outcome of the pipeline
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
            sh 'echo "Successful Failed!"'
            slackSend (
                color: 'danger',  // 'danger' is a Slack color for red
                message: "FAILURE: BUILD ${env.BUILD_NUMBER} failed. Check details: ${env.BUILD_URL}"
            )
        }
        always {
            sh 'echo "Sending email notification for build!"'
            // Actions to always take
            mail to: 'kushagraseth.1996@gmail.com',
             subject: "Pipeline: ${currentBuild.fullDisplayName}",
             body: "Click to view build -> ${env.BUILD_URL}."
        }
    }
}
