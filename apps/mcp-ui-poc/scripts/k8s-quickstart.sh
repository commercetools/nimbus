#!/bin/bash
# Quickstart script for MCP UI POC on Minikube

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 MCP UI POC - Minikube Quickstart"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "This script will:"
echo "  1. Build Docker images"
echo "  2. Load images into Minikube"
echo "  3. Create secrets from .env file"
echo "  4. Deploy to Kubernetes"
echo "  5. Set up port forwarding"
echo ""

# Check prerequisites
echo "🔍 Checking prerequisites..."
echo ""

# Check if minikube is installed
if ! command -v minikube &> /dev/null; then
    echo "❌ minikube is not installed"
    echo "Install with: brew install minikube"
    exit 1
fi
echo "✅ minikube installed"

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed"
    echo "Install with: brew install kubectl"
    exit 1
fi
echo "✅ kubectl installed"

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running"
    echo "Start Docker Desktop"
    exit 1
fi
echo "✅ Docker running"

# Check if minikube is running
if ! minikube status &> /dev/null; then
    echo "⚠️  Minikube is not running"
    read -p "Start minikube now? (Y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        echo "Starting minikube..."
        minikube start --cpus=4 --memory=6144
        minikube addons enable metrics-server
    else
        exit 1
    fi
fi
echo "✅ Minikube running"

# Check .env file
if [ ! -f "$SCRIPT_DIR/../.env" ]; then
    echo ""
    echo "❌ .env file not found"
    echo ""
    echo "Create .env file:"
    echo "  cp .env.example .env"
    echo "  # Edit .env and add your ANTHROPIC_API_KEY"
    exit 1
fi
echo "✅ .env file exists"
echo ""

# Confirm before proceeding
read -p "Ready to deploy? (Y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Nn]$ ]]; then
    echo "Cancelled"
    exit 0
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo ""

# Execute deployment steps
"$SCRIPT_DIR/k8s-build.sh"
echo ""
"$SCRIPT_DIR/k8s-load-minikube.sh"
echo ""
"$SCRIPT_DIR/k8s-create-secret.sh"
echo ""
"$SCRIPT_DIR/k8s-deploy.sh"
echo ""

echo "════════════════════════════════════════════════════════════"
echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Starting port forwarding..."
echo ""
echo "Run this command in a new terminal:"
echo "  kubectl port-forward svc/mcp-ui-poc-client 8080:80"
echo ""
echo "Then open: http://localhost:8080"
echo ""
echo "📋 View logs with:"
echo "  ./scripts/k8s-logs.sh"
echo ""
echo "📊 Check status with:"
echo "  ./scripts/k8s-status.sh"
