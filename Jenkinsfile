pipeline {
    agent any

    environment {
        ARGOCD_SERVER = "http://192.168.10.10:31319"  // Argo CD 서버 URL
        ARGOCD_USER = "admin"                        // Argo CD 사용자 이름
        ARGOCD_PASS = "1234qwerasdf@"                // Argo CD 관리자 비밀번호
        APP_NAME = "jenkins-test"                    // Argo CD 애플리케이션 이름
        PATH = "/usr/local/bin:$PATH"  // PATH 환경 변수에 Argo CD CLI 경로 추가
    }

    stages {
        stage('Clone Repository') {
            steps {
                echo "Cloning the repository..."
                git branch: 'main', credentialsId: 'github-organization-token', url: 'https://github.com/TheProMovers/jenkins_test.git'
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

        stage('Authenticate Argo CD') {
            steps {
                echo "Authenticating with Argo CD..."
                sh '''
                argocd login $ARGOCD_SERVER --insecure --username $ARGOCD_USER --password $ARGOCD_PASS
                '''
            }
        }

        stage('Sync Argo CD Application') {
            steps {
                echo "Syncing the Argo CD application..."
                sh '''
                argocd app sync $APP_NAME
                '''
            }
        }
    }
}
