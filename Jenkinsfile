pipeline {
    agent any

    // 환경 변수 정의
    environment {
        DOCKER_REGISTRY = 'localhost:5000' // Podman 레지스트리 주소
        GIT_CREDENTIAL = 'github-organization-token' // GitHub 자격 증명 ID
        K8S_MANIFEST_REPO = 'https://github.com/TheProMovers/jenkins_k8s.git' // Kubernetes 매니페스트 저장소 URL
    }

    stages {
        stage('Setup Git Safe Directory') {
            // Git safe.directory 설정
            steps {
                script {
                    echo "Setting up Git safe.directory..."
                    // Git이 현재 작업 디렉토리를 신뢰하도록 설정
                    sh 'git config --global --add safe.directory /var/jenkins_home/workspace/CICD_TEST_Multibranch_main'
                }
            }
        }

        stage('Clone Application Repository') {
            // 애플리케이션 소스 코드 클론
            steps {
                echo "Cloning application repository..."
                // GitHub에서 코드를 클론
                git branch: 'main', credentialsId: "${GIT_CREDENTIAL}", url: 'https://github.com/TheProMovers/jenkins_test.git'
                // GIT_CREDENTIAL는 Jenkins에서 정의한 GitHub 인증 정보를 사용
            }
        }

        stage('Login to Podman Registry') {
            // Podman 레지스트리에 로그인
            steps {
                echo "Logging into Podman registry..."
                script {
                    try {
                        sh "podman login --username=jaeheelee --password=cksgml1130@ ${DOCKER_REGISTRY} --tls-verify=false"
                        echo "✅ Successfully logged into Podman registry."
                    } catch (Exception e) {
                        echo "❌ Failed to login to Podman registry."
                        error("Podman registry login failed.")
                    }
                }
            }
        }

        stage('Build and Push Podman Images') {
            // Backend와 Frontend 이미지를 병렬로 빌드 및 푸시
            parallel {
                stage('Backend') {
                    steps {
                        dir('backend') {
                            script {
                                def backendImage = "${DOCKER_REGISTRY}/backend:latest"
                                try {
                                    echo "Building Backend Image..."
                                    sh "podman build -t ${backendImage} ."
                                    sh "podman push --tls-verify=false ${backendImage}"
                                    echo "✅ Pushed backend image: ${backendImage}"
                                } catch (Exception e) {
                                    echo "❌ Failed to build or push backend image."
                                    error("Backend build and push failed.")
                                }
                            }
                        }
                    }
                }

                stage('Frontend') {
                    steps {
                        dir('frontend') {
                            script {
                                def frontendImage = "${DOCKER_REGISTRY}/frontend:latest"
                                try {
                                    echo "Building Frontend Image..."
                                    sh "podman build -t ${frontendImage} ."
                                    sh "podman push --tls-verify=false ${frontendImage}"
                                    echo "✅ Pushed frontend image: ${frontendImage}"
                                } catch (Exception e) {
                                    echo "❌ Failed to build or push frontend image."
                                    error("Frontend build and push failed.")
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('Update Kubernetes Manifest Repository') {
            // Kubernetes 매니페스트 저장소 업데이트
            steps {
                echo "Updating Kubernetes manifests..."
                withCredentials([usernamePassword(credentialsId: "${GIT_CREDENTIAL}", usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                    sh """
                    git clone ${K8S_MANIFEST_REPO} k8s-repo
                    cd k8s-repo
                    sed -i 's|image: .*backend.*|image: ${DOCKER_REGISTRY}/backend:latest|' k8s/deployment.yaml
                    sed -i 's|image: .*frontend.*|image: ${DOCKER_REGISTRY}/frontend:latest|' k8s/deployment.yaml
                    git config user.email "ci@mycompany.com"
                    git config user.name "Jenkins CI"
                    git add .
                    git commit -m "Update deployment images"
                    git push origin main
                    """
                }
            }
        }

        stage('Verify Deployment') {
            // Kubernetes 배포 상태 확인
            steps {
                echo "Verifying deployment..."
                script {
                    try {
                        sh 'kubectl rollout status deployment/jenkins-test-deployment -n default'
                        echo "✅ Deployment verification complete."
                    } catch (Exception e) {
                        echo "❌ Deployment verification failed."
                        error("Deployment verification failed.")
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed. Check logs for details."
        }
    }
}
