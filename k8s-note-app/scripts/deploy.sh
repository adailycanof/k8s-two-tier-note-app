#!/bin/bash

# K8s Notes Application Deployment Script
# This script builds and deploys the two-tier notes application to Kubernetes

set -e

# Configuration
DOCKER_USERNAME=${DOCKER_USERNAME:-"yourusername"}
BACKEND_IMAGE="notes-api"
FRONTEND_IMAGE="notes-frontend"
VERSION="v1"

echo "🚀 Deploying K8s Notes Application..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Error: Docker is not running or not installed."
  exit 1
fi

# Check if kubectl is available
if ! command -v kubectl > /dev/null 2>&1; then
  echo "❌ Error: kubectl is not installed."
  exit 1
fi

# Build Docker images
echo "🏗️  Building Docker images..."

echo "Building backend image: $DOCKER_USERNAME/$BACKEND_IMAGE:$VERSION"
docker build -t $DOCKER_USERNAME/$BACKEND_IMAGE:$VERSION ./src/backend

echo "Building frontend image: $DOCKER_USERNAME/$FRONTEND_IMAGE:$VERSION"
docker build -t $DOCKER_USERNAME/$FRONTEND_IMAGE:$VERSION ./src/frontend

# Optional: Push images to registry
read -p "Do you want to push images to Docker Hub? (y/n): " PUSH_IMAGES
if [[ "$PUSH_IMAGES" == "y" ]]; then
  echo "🔄 Pushing images to Docker Hub..."
  
  # Check if logged in to Docker Hub
  if ! docker info | grep -q "Username"; then
    echo "Please log in to Docker Hub:"
    docker login
  fi
  
  docker push $DOCKER_USERNAME/$BACKEND_IMAGE:$VERSION
  docker push $DOCKER_USERNAME/$FRONTEND_IMAGE:$VERSION
fi

# Deploy to Kubernetes
echo "📦 Deploying to Kubernetes cluster..."

# Replace placeholders in YAML files
find ./k8s -type f -name "*.yaml" -exec sed -i.bak "s/\${DOCKER_USERNAME}/$DOCKER_USERNAME/g" {} \;
find ./k8s -type f -name "*.yaml.bak" -delete

# Create resources
echo "Creating ConfigMap..."
kubectl apply -f ./k8s/config/configmap.yaml

echo "Deploying backend services..."
kubectl apply -f ./k8s/backend/

echo "Deploying frontend services..."
kubectl apply -f ./k8s/frontend/

# Wait for deployments to be ready
echo "⏳ Waiting for deployments to be ready..."
kubectl rollout status deployment/notes-api
kubectl rollout status deployment/notes-frontend

# Get application URL
NODE_PORT=$(kubectl get service notes-frontend-service -o jsonpath='{.spec.ports[0].nodePort}')
CLUSTER_IP=$(kubectl cluster-info | grep -E 'Kubernetes control plane' | awk '/http/ {print $NF}' | sed "s/https:\/\///g" | sed "s/:.*//g")

if [ -z "$CLUSTER_IP" ]; then
  # Try with minikube
  if command -v minikube > /dev/null 2>&1; then
    CLUSTER_IP=$(minikube ip)
  fi
fi

if [ -n "$CLUSTER_IP" ] && [ -n "$NODE_PORT" ]; then
  echo "✅ Deployment complete!"
  echo "📝 Your Notes Application is running at: http://$CLUSTER_IP:$NODE_PORT"
else
  echo "✅ Deployment complete!"
  echo "📝 Your Notes Application is running. Find the NodePort with:"
  echo "    kubectl get service notes-frontend-service"
fi

echo ""
echo "📊 To check your deployment status:"
echo "    kubectl get pods"
echo "    kubectl get services"
echo ""
echo "🔍 To view application logs:"
echo "    kubectl logs -l app=notes-frontend"
echo "    kubectl logs -l app=notes-api"