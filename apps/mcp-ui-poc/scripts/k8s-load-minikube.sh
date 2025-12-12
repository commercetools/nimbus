#!/bin/bash
# Load Docker images into Minikube

set -e

echo "📦 Loading images into Minikube..."
echo ""

# Check if minikube is running
if ! minikube status &> /dev/null; then
    echo "❌ Error: Minikube is not running"
    echo "Start it with: minikube start"
    exit 1
fi

echo "✅ Minikube is running"
echo ""

# Load server image
echo "📤 Loading server image into Minikube..."
minikube image load mcp-ui-poc-server:latest
echo "✅ Server image loaded"
echo ""

# Load client image
echo "📤 Loading client image into Minikube..."
minikube image load mcp-ui-poc-client:latest
echo "✅ Client image loaded"
echo ""

# Verify images
echo "📋 Verifying images in Minikube..."
minikube image ls | grep mcp-ui-poc
echo ""

echo "✅ All images loaded into Minikube successfully!"
echo ""
echo "Next steps:"
echo "  1. Create secrets: ./scripts/k8s-create-secret.sh"
echo "  2. Deploy: ./scripts/k8s-deploy.sh"
