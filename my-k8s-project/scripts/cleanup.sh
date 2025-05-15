#!/bin/bash

# K8s Notes Application Cleanup Script
# This script removes all resources related to the notes application from the cluster

set -e

echo "🧹 Cleaning up K8s Notes Application resources..."

# Confirm before deletion
read -p "⚠️  This will delete all Notes Application resources. Continue? (y/n): " CONFIRM
if [[ "$CONFIRM" != "y" ]]; then
  echo "Cleanup cancelled."
  exit 0
fi

# Delete frontend resources
echo "Removing frontend resources..."
kubectl delete -f ./k8s/frontend/ --ignore-not-found

# Delete backend resources
echo "Removing backend resources..."
kubectl delete -f ./k8s/backend/ --ignore-not-found

# Delete config resources
echo "Removing configuration resources..."
kubectl delete -f ./k8s/config/ --ignore-not-found

# Optional: Remove Docker images
read -p "Do you also want to remove local Docker images? (y/n): " REMOVE_IMAGES
if [[ "$REMOVE_IMAGES" == "y" ]]; then
  echo "Removing Docker images..."
  
  # Configuration
  DOCKER_USERNAME=${DOCKER_USERNAME:-"yourusername"}
  BACKEND_IMAGE="notes-api"
  FRONTEND_IMAGE="notes-frontend"
  VERSION="v1"
  
  docker rmi $DOCKER_USERNAME/$BACKEND_IMAGE:$VERSION 2>/dev/null || true
  docker rmi $DOCKER_USERNAME/$FRONTEND_IMAGE:$VERSION 2>/dev/null || true
  
  echo "Docker images removed."
fi

echo "✅ Cleanup complete! All Notes Application resources have been removed."
echo ""
echo "To verify resources are gone, run:"
echo "  kubectl get all | grep notes"