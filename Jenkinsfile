pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                echo "Cloning the repository..."
                git credentialsId: 'github-organization-token', url: 'https://github.com/TheProMovers/jenkins_test.git'
            }
        }

        stage('Build') {
            steps {
                echo "Building the project..."
                sh 'echo "Build logic here"'
            }
        }

        stage('Test') {
            steps {
                echo "Running tests..."
                sh 'echo "Test logic here"'
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying the project..."
                sh 'echo "Deployment logic here"'
            }
        }
    }
}
