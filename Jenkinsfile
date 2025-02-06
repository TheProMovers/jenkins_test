pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'localhost:5000'
        GIT_CREDENTIAL = 'github-organization-token'  // GitHub Credentials ID
        K8S_MANIFEST_REPO = 'https://github.com/TheProMovers/jenkins_k8s.git' // 배포용 Git 저장소
    }

    stages {
        stage('Clone Application Repository') {
            steps {
                echo "Cloning application repository..."
                git branch: 'main', credentialsId: "${GIT_CREDENTIAL}", url: 'https://github.com/TheProMovers/jenkins_test.git'
            }
        }

        stage('Login to Podman Registry') {
            steps {
                echo "Logging into Podman registry..."
                script {
                    def loginCommand = "podman login --username=jaeheelee --password=cksgml1130@ localhost:5000 --tls-verify=false"
                    try {
                        sh loginCommand
                        echo "✅ Successfully logged into Podman registry."
                    } catch (Exception e) {
                        echo "⚠️ Failed to login to Podman registry. Retrying..."
                        sleep 5
                        sh loginCommand
                    }
                }
            }
        }

        stage('Build and Push Podman Images') {
            parallel {
                stage('Backend') {
                    steps {
                        dir('backend') {
                            script {
                                def backendImage = "${DOCKER_REGISTRY}/backend:latest"
                                try {
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
