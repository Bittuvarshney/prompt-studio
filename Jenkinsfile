```text
pipeline {
    agent any

    environment {
        NODE_VERSION = '20'

        IMAGE_NAME = 'promptcraft-studio'
        IMAGE_TAG = "${BUILD_NUMBER}"

        DOCKERHUB_USERNAME = 'bittoovarshney'
        DOCKERHUB_CREDENTIALS = 'dockerhub-credentials'

        CONTAINER_NAME = 'promptcraft-studio'
        APP_PORT = '3000'
    }

    stages {

        stage('Checkout source') {
            steps {
                echo 'Source code checked out by Jenkins SCM.'
                sh 'git log -1 --oneline'
            }
        }

        stage('Install dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                echo 'Running TypeScript validation...'
                sh 'npm run lint'
            }
        }

        stage('Build application') {
            steps {
                echo 'Building PromptCraft Studio...'
                sh 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                echo "Building Docker image ${IMAGE_NAME}:${IMAGE_TAG}..."

                sh '''
                    docker build \
                        -t ${IMAGE_NAME}:${IMAGE_TAG} \
                        -t ${IMAGE_NAME}:latest \
                        .
                '''
            }
        }

        stage('Docker Login') {
            steps {
                echo 'Logging into Docker Hub...'

                withCredentials([
                    usernamePassword(
                        credentialsId: "${DOCKERHUB_CREDENTIALS}",
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    sh '''
                        echo "$DOCKER_PASSWORD" | docker login \
                            --username "$DOCKER_USERNAME" \
                            --password-stdin
                    '''
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                echo "Pushing ${IMAGE_NAME}:${IMAGE_TAG} to Docker Hub..."

                sh '''
                    docker tag ${IMAGE_NAME}:${IMAGE_TAG} \
                        ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}

                    docker tag ${IMAGE_NAME}:latest \
                        ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:latest

                    docker push \
                        ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}

                    docker push \
                        ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:latest
                '''
            }
        }

        stage('Deploy to EC2') {
            steps {
                echo 'Deploying latest image to EC2...'

                sh '''
                    docker pull \
                        ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:latest

                    docker stop ${CONTAINER_NAME} || true

                    docker rm ${CONTAINER_NAME} || true

                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        --restart unless-stopped \
                        -p ${APP_PORT}:3000 \
                        --env-file /home/ubuntu/promptcraft.env \
                        ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:latest
                '''
            }
        }

        stage('Verify Container') {
            steps {
                echo 'Verifying running container...'

                sh '''
                    sleep 5

                    docker ps \
                        --filter "name=${CONTAINER_NAME}" \
                        --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"

                    docker inspect \
                        --format='{{.State.Status}}' \
                        ${CONTAINER_NAME}
                '''
            }
        }

        stage('Health Check') {
            steps {
                echo 'Checking application health endpoint...'

                sh '''
                    sleep 5

                    curl --fail \
                        --retry 5 \
                        --retry-delay 3 \
                        http://localhost:${APP_PORT}/api/health
                '''
            }
        }
    }

    post {

        always {
            archiveArtifacts(
                artifacts: 'dist/**/*',
                fingerprint: true,
                allowEmptyArchive: true
            )
        }

        success {
            echo '''
==============================================
 PromptCraft Studio CI/CD SUCCESS
==============================================
 GitHub Checkout       : SUCCESS
 Dependencies          : SUCCESS
 Lint                  : SUCCESS
 Application Build     : SUCCESS
 Docker Build          : SUCCESS
 Docker Hub Login      : SUCCESS
 Docker Hub Push       : SUCCESS
 EC2 Deployment        : SUCCESS
 Container Verification: SUCCESS
 Health Check          : SUCCESS
==============================================
'''
        }

        failure {
            echo '''
==============================================
 PromptCraft Studio CI/CD FAILED
==============================================
Check the failed stage in the Jenkins console.
==============================================
'''
        }
    }
}
```
