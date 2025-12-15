#!/bin/bash
# Setup basic authentication for nginx
# Creates both htpasswd file and Kubernetes secret
#
# Usage:
#   ./setup-auth.sh [NAMESPACE]
#
# Arguments:
#   NAMESPACE - Kubernetes namespace (default: byronw)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HTPASSWD_FILE="$SCRIPT_DIR/../client/.htpasswd"
NAMESPACE="${1:-byronw}"

echo "🔐 Setting up Basic Authentication"
echo "==================================="
echo "Namespace: $NAMESPACE"
echo ""

# Check if htpasswd command is available
if ! command -v htpasswd &> /dev/null; then
    echo "❌ htpasswd command not found"
    echo ""
    echo "Install apache2-utils:"
    echo "  macOS:         brew install httpd"
    echo "  Ubuntu/Debian: sudo apt-get install apache2-utils"
    echo "  RHEL/CentOS:   sudo yum install httpd-tools"
    exit 1
fi

# Step 1: Create htpasswd file
echo "Step 1/2: Creating htpasswd file"
echo ""

if [ -f "$HTPASSWD_FILE" ]; then
    echo "⚠️  htpasswd file already exists: $HTPASSWD_FILE"
    read -p "Overwrite? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Using existing htpasswd file"
    else
        rm "$HTPASSWD_FILE"
    fi
fi

if [ ! -f "$HTPASSWD_FILE" ]; then
    read -p "Enter username [admin]: " USERNAME
    USERNAME=${USERNAME:-admin}

    echo ""
    echo "Enter password for user '$USERNAME':"
    htpasswd -cB "$HTPASSWD_FILE" "$USERNAME"
    echo ""
    echo "✅ htpasswd file created"
fi
echo ""

# Step 2: Create Kubernetes secret
echo "Step 2/2: Creating Kubernetes secret"
echo ""

# Check kubectl is configured
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ kubectl not configured"
    echo ""
    echo "Get cluster credentials first:"
    echo "  gcloud container clusters get-credentials <cluster> --region=<region>"
    exit 1
fi

# Create or update the secret
# Delete and recreate to ensure it's updated (apply doesn't always work for secrets)
kubectl delete secret mcp-ui-poc-auth -n "$NAMESPACE" 2>/dev/null || true
kubectl create secret generic mcp-ui-poc-auth \
    --from-file=.htpasswd="$HTPASSWD_FILE" \
    --namespace="$NAMESPACE"

echo ""
echo "✅ Authentication setup complete!"
echo ""
echo "Credentials stored in:"
echo "  - Local file: $HTPASSWD_FILE"
echo "  - K8s secret: mcp-ui-poc-auth (namespace: $NAMESPACE)"
echo ""
echo "Next steps:"
echo "  1. Build and deploy: ./scripts/deploy-to-gke.sh"
echo "  2. Access the application (you'll be prompted for credentials)"
echo ""
echo "To update credentials:"
echo "  1. Run this script again"
echo "  2. Restart deployment: kubectl rollout restart deployment/mcp-ui-poc-client -n $NAMESPACE"
