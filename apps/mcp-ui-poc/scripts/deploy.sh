#!/bin/bash
# Deploy MCP UI POC to active GKE cluster
#
# Usage:
#   ./deploy.sh [NAMESPACE]
#
# Arguments:
#   NAMESPACE - Kubernetes namespace (default: byronw)
#
# Prerequisites:
# 1. kubectl configured with cluster credentials:
#    gcloud container clusters get-credentials <cluster> --region=<region>
# 2. Basic auth configured:
#    ./scripts/setup-auth.sh [NAMESPACE]
# 3. API secret created (if needed):
#    kubectl create secret generic mcp-ui-poc-secrets --from-literal=api-key=<key> -n [NAMESPACE]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MCP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
NAMESPACE="${1:-byronw}"

echo "🚀 Deploying to GKE"
echo "==================="
echo "Namespace: $NAMESPACE"
echo ""

# Verify kubectl is configured
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Error: kubectl not configured or cluster not accessible"
    echo ""
    echo "Get cluster credentials first:"
    echo "  gcloud container clusters get-credentials <cluster-name> --region=<region>"
    exit 1
fi

# Show cluster info
echo "📍 Current cluster:"
kubectl config current-context
echo ""

# Check for auth secret (REQUIRED)
if ! kubectl get secret mcp-ui-poc-auth -n "$NAMESPACE" &> /dev/null; then
    echo "❌ Error: Authentication secret 'mcp-ui-poc-auth' not found in namespace '$NAMESPACE'"
    echo ""
    echo "Run authentication setup first:"
    echo "  ./scripts/setup-auth.sh $NAMESPACE"
    echo ""
    exit 1
fi
echo "✅ Authentication configured"
echo ""

# Apply deployments
echo "🔧 Deploying server..."
kubectl apply -f "$MCP_DIR/server/k8s/deployment.yaml" -n "$NAMESPACE"
kubectl apply -f "$MCP_DIR/server/k8s/ingress.yaml" -n "$NAMESPACE"

echo "🎨 Deploying client..."
kubectl apply -f "$MCP_DIR/client/k8s/deployment.yaml" -n "$NAMESPACE"
kubectl apply -f "$MCP_DIR/client/k8s/ingress.yaml" -n "$NAMESPACE"
echo ""

# Wait for deployments
echo "⏳ Waiting for deployments..."
kubectl wait --for=condition=available deployment/mcp-ui-poc-server -n "$NAMESPACE" --timeout=120s
kubectl wait --for=condition=available deployment/mcp-ui-poc-client -n "$NAMESPACE" --timeout=120s
echo ""

echo "✅ Deployment complete!"
echo ""
echo "📊 Pod status:"
kubectl get pods -l 'app in (mcp-ui-poc-server,mcp-ui-poc-client)' -n "$NAMESPACE"
