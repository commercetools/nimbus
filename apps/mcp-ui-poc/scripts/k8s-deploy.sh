#!/bin/bash
# Deploy MCP UI POC to Kubernetes

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MCP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🚀 Deploying MCP UI POC to Kubernetes..."
echo ""

# Check if secret exists
if ! kubectl get secret mcp-ui-poc-secrets &> /dev/null; then
    echo "⚠️  Warning: Secret 'mcp-ui-poc-secrets' not found"
    echo "Create it with: ./scripts/k8s-create-secret.sh"
    echo ""
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Apply ConfigMap and Secret
echo "📝 Applying ConfigMap..."
kubectl apply -f "$MCP_DIR/client/k8s/configmap.yaml"
echo ""

# Deploy server
echo "🔧 Deploying server..."
kubectl apply -f "$MCP_DIR/server/k8s/deployment.yaml"
echo ""

# Deploy client
echo "🎨 Deploying client..."
kubectl apply -f "$MCP_DIR/client/k8s/deployment.yaml"
echo ""

# Wait for deployments
echo "⏳ Waiting for deployments to be ready..."
kubectl wait --for=condition=available deployment/mcp-ui-poc-server --timeout=120s
kubectl wait --for=condition=available deployment/mcp-ui-poc-client --timeout=120s
echo ""

echo "✅ Deployment complete!"
echo ""
echo "📊 Status:"
kubectl get pods -l 'app in (mcp-ui-poc-server,mcp-ui-poc-client)'
echo ""
echo "🌐 Access the application:"
echo "  kubectl port-forward svc/mcp-ui-poc-client 8080:80"
echo ""
echo "Then open: http://localhost:8080"
