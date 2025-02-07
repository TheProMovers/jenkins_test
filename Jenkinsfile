pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'localhost:5000' // Podman 레지스트리 주소
        GIT_CREDENTIAL = 'github-organization-token' // GitHub 자격 증명 ID
        K8S_MANIFEST_REPO = 'https://github.com/TheProMovers/k8s_manifests.git' // Kubernetes 매니페스트 저장소
    }

    stages {
        // 1️⃣ Git 저장소 클론
        stage('Clone Application Repository') {
            steps {
                echo "Cloning application repository..."
                git branch: 'main', credentialsId: "${GIT_CREDENTIAL}", url: 'https://github.com/TheProMovers/jenkins_test.git'
            }
        }

        // 2️⃣ Podman 레지스트리 로그인
        stage('Login to Podman Registry') {
            steps {
                echo "Logging into Podman registry..."
                sh """
                podman login --username=jaeheelee --password=cksgml1130@ ${DOCKER_REGISTRY} --tls-verify=false
                """
            }
        }

        // 3️⃣ 백엔드 & 프론트엔드 이미지 빌드 및 푸시
        stage('Build and Push Podman Images') {
            parallel {
                // 3-1: 백엔드 이미지 빌드
                stage('Backend') {
                    steps {
                        dir('backend') {
                            script {
                                def backendImage = "${DOCKER_REGISTRY}/backend:latest"
                                sh """
                                echo "Building Backend Image..."
                                podman build -t ${backendImage} .
                                podman push --tls-verify=false ${backendImage}
                                echo "✅ Backend image pushed: ${backendImage}"
                                """
                            }
                        }
                    }
                }

                // 3-2: 프론트엔드 이미지 빌드
                stage('Frontend') {
                    steps {
                        dir('frontend') {
                            script {
                                def frontendImage = "${DOCKER_REGISTRY}/frontend:latest"
                                sh """
                                echo "Building Frontend Image..."
                                podman build -t ${frontendImage} .
                                podman push --tls-verify=false ${frontendImage}
                                echo "✅ Frontend image pushed: ${frontendImage}"
                                """
                            }
                        }
                    }
                }
            }
        }

        // 4️⃣ Kubernetes 매니페스트 업데이트
        stage('Update Kubernetes Manifest Repository') {
            steps {
                echo "Updating Kubernetes manifests..."
                withCredentials([usernamePassword(credentialsId: "${GIT_CREDENTIAL}", usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                    sh """
                    git clone ${K8S_MANIFEST_REPO} k8s-repo
                    cd k8s-repo
                    sed -i 's|image: .*backend.*|image: ${DOCKER_REGISTRY}/backend:latest|' deployment.yaml
                    sed -i 's|image: .*frontend.*|image: ${DOCKER_REGISTRY}/frontend:latest|' deployment.yaml
                    git config user.email "ci@example.com"
                    git config user.name "Jenkins CI"
                    git add deployment.yaml
                    git commit -m "Update deployment images"
                    git push origin main
                    """
                }
            }
        }

        // 5️⃣ Kubernetes 배포 검증
        stage('Verify Deployment') {
            steps {
                echo "Verifying Kubernetes deployment..."
                sh """
                kubectl rollout status deployment/backend-deployment -n default
                kubectl rollout status deployment/frontend-deployment -n default
                """
                echo "✅ Deployment verification complete!"
            }
        }
    }

    // 6️⃣ 파이프라인 성공 및 실패 메시지
    post {
        success {
            echo "✅ Pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed. Check logs for details."
        }
    }
}
