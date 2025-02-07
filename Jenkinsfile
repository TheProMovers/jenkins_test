pipeline {
    agent any

    environment {
        GIT_CREDENTIAL = 'github-organization-token' // GitHub 자격 증명 ID
        REPO_URL = 'https://github.com/TheProMovers/jenkins_test.git' // GitHub 저장소 URL
    }

    stages {
        stage('Clone Application Repository') {
            steps {
                echo "Testing GitHub repository clone..."
                script {
                    try {
                        // 디렉토리 상태 확인
                        sh """
                        echo "Checking Jenkins workspace..."
                        ls -la /var/jenkins_home/workspace || echo "Workspace directory not found!"
                        
                        echo "Setting up Git configuration..."
                        git config --global user.name "Jenkins CI"
                        git config --global user.email "ci@example.com"
                        
                        echo "Cloning repository..."
                        git clone ${REPO_URL} /tmp/repo
                        """
                        echo "✅ Successfully cloned the repository."
                    } catch (Exception e) {
                        echo "❌ Failed to clone the repository. Error: ${e.message}"
                        error("Repository clone test failed.")
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Repository clone test completed successfully!"
        }
        failure {
            echo "❌ Repository clone test failed. Check logs for details."
        }
    }
}
