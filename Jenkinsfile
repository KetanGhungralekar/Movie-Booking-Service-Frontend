pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = 'dockerhub-credentials'
        DOCKERHUB_REPO = 'ketan803/movie-frontend'
        IMAGE_TAG = "latest"
    }

    stages {

        stage('Checkout') {
            steps {
                echo "Pulling code from GitHub..."
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "Running npm install..."
                sh 'npm install'
            }
        }

        stage('Build React App') {
            steps {
                echo "Building frontend..."
                sh 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                echo "Building Docker image..."
                sh 'docker build -t $DOCKERHUB_REPO:$IMAGE_TAG .'
            }
        }

        stage('Docker Login') {
            steps {
                echo "Logging into DockerHub..."
                withCredentials([usernamePassword(credentialsId: "$DOCKERHUB_CREDENTIALS", usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh 'echo "$PASS" | docker login -u "$USER" --password-stdin'
                }
            }
        }

        stage('Push Image') {
            steps {
                echo "Pushing image to DockerHub..."
                sh 'docker push $DOCKERHUB_REPO:$IMAGE_TAG'
            }
        }

        stage('Deploy (Local)') {
            when { expression { return true } } // change to false if you don't want deploy
            steps {
                echo "Stopping old container..."
                sh 'docker rm -f movie-frontend || true'

                echo "Starting frontend container..."
                sh 'docker run -d -p 3000:80 --name movie-frontend $DOCKERHUB_REPO:$IMAGE_TAG'
            }
        }
    }

    post {
        success {
            echo "Frontend pipeline executed successfully!"
        }
        failure {
            echo "Pipeline failed."
        }
    }
}
