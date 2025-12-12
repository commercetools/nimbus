#!/bin/bash
# Remove all MCP UI POC resources from Kubernetes

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MCP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🗑️  Cleaning up MCP UI POC resources..."
echo ""

read -p "This will delete all MCP UI POC resources. Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled"
    exit 0
fi

echo "Deleting client resources..."
kubectl delete -f "$MCP_DIR/client/k8s/deployment.yaml" --ignore-not-found=true
echo ""

echo "Deleting server resources..."
kubectl delete -f "$MCP_DIR/server/k8s/deployment.yaml" --ignore-not-found=true
echo ""

echo "Deleting ConfigMap and Secret..."
kubectl delete -f "$MCP_DIR/client/k8s/configmap.yaml" --ignore-not-found=true
echo ""

echo "Deleting Ingress (if exists)..."
kubectl delete -f "$MCP_DIR/client/k8s/ingress.yaml" --ignore-not-found=true 2>/dev/null || true
echo ""

# Wait for pods to terminate
echo "⏳ Waiting for pods to terminate..."
kubectl wait --for=delete pod -l 'app in (mcp-ui-poc-server,mcp-ui-poc-client)' --timeout=60s 2>/dev/null || true
echo ""

echo "✅ Cleanup complete!"
echo ""
echo "📊 Remaining resources:"
kubectl get all -l 'app in (mcp-ui-poc-server,mcp-ui-poc-client)' 2>/dev/null || echo "None"
