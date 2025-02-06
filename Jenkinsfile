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
                        // Git 저장소 클론
                        git branch: 'main', credentialsId: "${GIT_CREDENTIAL}", url: "${REPO_URL}"
                        echo "✅ Successfully cloned the repository."
                    } catch (Exception e) {
                        echo "❌ Failed to clone the repository. Check credentials or URL."
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
