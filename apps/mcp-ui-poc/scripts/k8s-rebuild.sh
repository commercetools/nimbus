#!/bin/bash
# Full rebuild and redeploy of MCP UI POC

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🔄 Full rebuild and redeploy of MCP UI POC"
echo "════════════════════════════════════════════════════════════"
echo ""

# Step 1: Build Docker images
echo "Step 1: Building Docker images..."
"$SCRIPT_DIR/k8s-build.sh"
echo ""

# Step 2: Load into Minikube
echo "Step 2: Loading images into Minikube..."
"$SCRIPT_DIR/k8s-load-minikube.sh"
echo ""

# Step 3: Restart deployments
echo "Step 3: Restarting deployments..."
if kubectl get deployment mcp-ui-poc-server &> /dev/null; then
    kubectl rollout restart deployment/mcp-ui-poc-server
    echo "✅ Server deployment restarted"
else
    echo "⚠️  Server deployment not found - will be created"
fi

if kubectl get deployment mcp-ui-poc-client &> /dev/null; then
    kubectl rollout restart deployment/mcp-ui-poc-client
    echo "✅ Client deployment restarted"
else
    echo "⚠️  Client deployment not found - will be created"
fi
echo ""

# Step 4: Wait for rollout
echo "Step 4: Waiting for rollout to complete..."
kubectl rollout status deployment/mcp-ui-poc-server --timeout=120s || true
kubectl rollout status deployment/mcp-ui-poc-client --timeout=120s || true
echo ""

# Step 5: Show status
echo "Step 5: Checking status..."
"$SCRIPT_DIR/k8s-status.sh"
echo ""

echo "✅ Rebuild and redeploy complete!"
echo ""
echo "🌐 To access the application:"
echo "  kubectl port-forward svc/mcp-ui-poc-client 8080:80"
echo "  Then open: http://localhost:8080"
