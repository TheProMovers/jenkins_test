pipeline {
    agent any

    // 환경 변수 정의
    environment {
        DOCKER_REGISTRY = 'localhost:5000' // Podman 레지스트리 주소
        GIT_CREDENTIAL = 'github-organization-token' // GitHub 자격 증명 ID
        K8S_MANIFEST_REPO = 'https://github.com/TheProMovers/jenkins_k8s.git' // Kubernetes 매니페스트 저장소 URL
    }

    stages {
        stage('Clone Application Repository') {
            // 첫 번째 단계: 애플리케이션 소스 코드 클론
            steps {
                echo "Cloning application repository..."
                // Git 저장소에서 코드를 클론
                git branch: 'main', credentialsId: "${GIT_CREDENTIAL}", url: 'https://github.com/TheProMovers/jenkins_test.git'
                // 위에서 GIT_CREDENTIAL는 Jenkins에 저장된 GitHub 인증 정보를 사용합니다.
            }
        }

        stage('Login to Podman Registry') {
            // 두 번째 단계: Podman 레지스트리에 로그인
            steps {
                echo "Logging into Podman registry..."
                script {
                    try {
                        // Podman 레지스트리에 로그인 수행
                        sh "podman login --username=jaeheelee --password=cksgml1130@ ${DOCKER_REGISTRY} --tls-verify=false"
                        echo "✅ Successfully logged into Podman registry."
                    } catch (Exception e) {
                        // 로그인 실패 시 오류 메시지 출력
                        echo "❌ Failed to login to Podman registry."
                        error("Podman registry login failed.")
                    }
                }
            }
        }

        stage('Build and Push Podman Images') {
            // 세 번째 단계: Backend와 Frontend 이미지를 빌드 및 푸시
            parallel {
                stage('Backend') {
                    // 백엔드 이미지 빌드 및 푸시
                    steps {
                        dir('backend') {
                            script {
                                def backendImage = "${DOCKER_REGISTRY}/backend:latest" // Backend 이미지 태그 정의
                                try {
                                    echo "Building Backend Image..."
                                    // Podman 빌드 수행
                                    sh "podman build -t ${backendImage} ."
                                    // Podman 푸시 수행
                                    sh "podman push --tls-verify=false ${backendImage}"
                                    echo "✅ Pushed backend image: ${backendImage}"
                                } catch (Exception e) {
                                    // 빌드 또는 푸시 실패 시 오류 메시지 출력
                                    echo "❌ Failed to build or push backend image."
                                    error("Backend build and push failed.")
                                }
                            }
                        }
                    }
                }

                stage('Frontend') {
                    // 프론트엔드 이미지 빌드 및 푸시
                    steps {
                        dir('frontend') {
                            script {
                                def frontendImage = "${DOCKER_REGISTRY}/frontend:latest" // Frontend 이미지 태그 정의
                                try {
                                    echo "Building Frontend Image..."
                                    // Podman 빌드 수행
                                    sh "podman build -t ${frontendImage} ."
                                    // Podman 푸시 수행
                                    sh "podman push --tls-verify=false ${frontendImage}"
                                    echo "✅ Pushed frontend image: ${frontendImage}"
                                } catch (Exception e) {
                                    // 빌드 또는 푸시 실패 시 오류 메시지 출력
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
            // 네 번째 단계: Kubernetes 매니페스트 업데이트
            steps {
                echo "Updating Kubernetes manifests..."
                // GitHub 인증 정보를 사용하여 Kubernetes 매니페스트 저장소 업데이트
                withCredentials([usernamePassword(credentialsId: "${GIT_CREDENTIAL}", usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                    sh """
                    git clone ${K8S_MANIFEST_REPO} k8s-repo
                    cd k8s-repo
                    // Kubernetes 매니페스트에서 이미지 태그를 최신 상태로 변경
                    sed -i 's|image: .*backend.*|image: ${DOCKER_REGISTRY}/backend:latest|' k8s/deployment.yaml
                    sed -i 's|image: .*frontend.*|image: ${DOCKER_REGISTRY}/frontend:latest|' k8s/deployment.yaml
                    // Git 커밋 및 푸시
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
            // 다섯 번째 단계: Kubernetes 배포 상태 확인
            steps {
                echo "Verifying deployment..."
                script {
                    try {
                        // Kubernetes 배포 상태 확인
                        sh 'kubectl rollout status deployment/jenkins-test-deployment -n default'
                        echo "✅ Deployment verification complete."
                    } catch (Exception e) {
                        // 배포 확인 실패 시 오류 메시지 출력
                        echo "❌ Deployment verification failed."
                        error("Deployment verification failed.")
                    }
                }
            }
        }
    }

    // 파이프라인 완료 후 작업
    post {
        success {
            // 파이프라인 성공 시 메시지 출력
            echo "✅ Pipeline completed successfully!"
        }
        failure {
            // 파이프라인 실패 시 메시지 출력
            echo "❌ Pipeline failed. Check logs for details."
        }
    }
}
