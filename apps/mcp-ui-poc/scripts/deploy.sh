#!/bin/bash
# Deploy MCP UI POC to active GKE cluster
#
# Usage:
#   ./scripts/deploy.sh [NAMESPACE]
#
# Arguments:
#   NAMESPACE - Kubernetes namespace (default: byronw)
#
# Prerequisites:
# 1. kubectl configured with cluster credentials:
#    gcloud container clusters get-credentials <cluster> --region=<region>
# 2. Secrets configured (basic auth + commerce credentials):
#    ./scripts/setup-auth.sh [NAMESPACE]

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

# Check for auth secret (REQUIRED for client)
if ! kubectl get secret mcp-ui-poc-auth -n "$NAMESPACE" &> /dev/null; then
    echo "❌ Error: Authentication secret 'mcp-ui-poc-auth' not found in namespace '$NAMESPACE'"
    echo ""
    echo "Run authentication setup first:"
    echo "  ./scripts/setup-auth.sh $NAMESPACE"
    echo ""
    exit 1
fi
echo "✅ Authentication configured"

# Check for commerce credentials (REQUIRED for commerce-server)
if ! kubectl get secret commerce-mcp-credentials -n "$NAMESPACE" &> /dev/null; then
    echo "⚠️  Warning: Commerce credentials secret 'commerce-mcp-credentials' not found"
    echo ""
    echo "To deploy commerce-server, configure commerce credentials:"
    echo "  1. Add CT_* variables to .env"
    echo "  2. Re-run: ./scripts/setup-auth.sh $NAMESPACE"
    echo ""
    echo "Continuing deployment without commerce-server..."
    SKIP_COMMERCE=true
else
    echo "✅ Commerce credentials configured"
    SKIP_COMMERCE=false
fi
echo ""

# Apply backend config (shared)
echo "🔧 Applying backend config..."
kubectl apply -f "$MCP_DIR/client/k8s/backend-config.yaml" -n "$NAMESPACE"
echo ""

# Deploy UI MCP server
echo "🔧 Deploying UI MCP server..."
kubectl apply -f "$MCP_DIR/server/k8s/deployment.yaml" -n "$NAMESPACE"
kubectl apply -f "$MCP_DIR/server/k8s/ingress.yaml" -n "$NAMESPACE"
echo ""

# Deploy commerce MCP server (if credentials exist)
if [[ "$SKIP_COMMERCE" == "false" ]]; then
    echo "🛒 Deploying commerce MCP server..."
    kubectl apply -f "$MCP_DIR/commerce-mcp-server/k8s/deployment.yaml" -n "$NAMESPACE"
    kubectl apply -f "$MCP_DIR/commerce-mcp-server/k8s/ingress.yaml" -n "$NAMESPACE"
    echo ""
fi

# Deploy client
echo "🎨 Deploying client..."
kubectl apply -f "$MCP_DIR/client/k8s/deployment.yaml" -n "$NAMESPACE"
kubectl apply -f "$MCP_DIR/client/k8s/ingress.yaml" -n "$NAMESPACE"
echo ""

# Restart deployments to pull latest images
echo "🔄 Restarting deployments to pull latest images..."
kubectl rollout restart deployment/mcp-ui-poc-server -n "$NAMESPACE"
if [[ "$SKIP_COMMERCE" == "false" ]]; then
    kubectl rollout restart deployment/mcp-ui-poc-commerce-server -n "$NAMESPACE"
fi
kubectl rollout restart deployment/mcp-ui-poc-client -n "$NAMESPACE"
echo ""

# Wait for rollouts to complete
echo "⏳ Waiting for rollouts to complete..."
kubectl rollout status deployment/mcp-ui-poc-server -n "$NAMESPACE" --timeout=120s
if [[ "$SKIP_COMMERCE" == "false" ]]; then
    kubectl rollout status deployment/mcp-ui-poc-commerce-server -n "$NAMESPACE" --timeout=120s
fi
kubectl rollout status deployment/mcp-ui-poc-client -n "$NAMESPACE" --timeout=120s
echo ""

echo "✅ Deployment complete!"
echo ""
echo "📊 Pod status:"
if [[ "$SKIP_COMMERCE" == "false" ]]; then
    kubectl get pods -l 'app in (mcp-ui-poc-server,mcp-ui-poc-client,mcp-ui-poc-commerce-server)' -n "$NAMESPACE"
else
    kubectl get pods -l 'app in (mcp-ui-poc-server,mcp-ui-poc-client)' -n "$NAMESPACE"
fi
echo ""

# Show LoadBalancer IPs
echo "🌐 LoadBalancer IPs:"
echo ""
echo "UI MCP Server:"
kubectl get svc mcp-ui-poc-server-loadbalancer -n "$NAMESPACE" -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null && echo "" || echo "  Pending..."

if [[ "$SKIP_COMMERCE" == "false" ]]; then
    echo ""
    echo "Commerce MCP Server:"
    kubectl get svc mcp-ui-poc-commerce-server-loadbalancer -n "$NAMESPACE" -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null && echo "" || echo "  Pending..."
fi

echo ""
echo "Client:"
kubectl get svc mcp-ui-poc-client-loadbalancer -n "$NAMESPACE" -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null && echo "" || echo "  Pending..."
echo ""

if [[ "$SKIP_COMMERCE" == "false" ]]; then
    echo ""
    echo "✅ All services deployed (UI server, commerce server, and client)"
else
    echo ""
    echo "⚠️  Commerce server skipped (credentials not configured)"
    echo "    To deploy commerce server:"
    echo "      1. Add CT_* variables to .env"
    echo "      2. Run: ./scripts/setup-auth.sh $NAMESPACE"
    echo "      3. Deploy: ./scripts/deploy.sh $NAMESPACE"
fi
