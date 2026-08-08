pipeline {
  agent any

  environment {
    NODE_VERSION = '20'
    IMAGE_NAME = 'promptcraft-studio'
    IMAGE_TAG = "${env.BUILD_NUMBER}"
  }

  stages {
    stage('Checkout source') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Build application') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Package container image') {
      steps {
        sh 'docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .'
      }
    }

    stage('Deploy to environment') {
      when {
        branch 'main'
      }
      steps {
        sh 'echo "Deployment hook goes here: push image to registry or rollout to cluster"'
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
    }
    success {
      echo 'Application build and image packaging completed successfully.'
    }
    failure {
      echo 'Build failed. Please review the Jenkins console output.'
    }
  }
}
