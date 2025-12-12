#!/bin/bash
# Check status of MCP UI POC resources

echo "📊 MCP UI POC Kubernetes Status"
echo "════════════════════════════════════════════════════════════"
echo ""

echo "🔧 Deployments:"
echo "────────────────────────────────────────"
kubectl get deployments -l 'app in (mcp-ui-poc-server,mcp-ui-poc-client)' 2>/dev/null || echo "No deployments found"
echo ""

echo "📦 Pods:"
echo "────────────────────────────────────────"
kubectl get pods -l 'app in (mcp-ui-poc-server,mcp-ui-poc-client)' -o wide 2>/dev/null || echo "No pods found"
echo ""

echo "🌐 Services:"
echo "────────────────────────────────────────"
kubectl get services -l 'app in (mcp-ui-poc-server,mcp-ui-poc-client)' 2>/dev/null || echo "No services found"
echo ""

echo "📝 ConfigMaps:"
echo "────────────────────────────────────────"
kubectl get configmap mcp-ui-poc-config 2>/dev/null || echo "ConfigMap not found"
echo ""

echo "🔐 Secrets:"
echo "────────────────────────────────────────"
kubectl get secret mcp-ui-poc-secrets 2>/dev/null || echo "Secret not found"
echo ""

echo "📋 Recent Events:"
echo "────────────────────────────────────────"
kubectl get events --sort-by='.lastTimestamp' | grep -E 'mcp-ui-poc|AGE' | tail -10
echo ""

# Check if pods are ready
READY_PODS=$(kubectl get pods -l 'app in (mcp-ui-poc-server,mcp-ui-poc-client)' --no-headers 2>/dev/null | grep -c "Running" || echo "0")
TOTAL_PODS=$(kubectl get pods -l 'app in (mcp-ui-poc-server,mcp-ui-poc-client)' --no-headers 2>/dev/null | wc -l | tr -d ' ' || echo "0")

if [ "$READY_PODS" -eq "$TOTAL_PODS" ] && [ "$TOTAL_PODS" -gt 0 ]; then
    echo "✅ All pods are running ($READY_PODS/$TOTAL_PODS)"
elif [ "$TOTAL_PODS" -eq 0 ]; then
    echo "⚠️  No pods found - application not deployed"
else
    echo "⚠️  Some pods are not ready ($READY_PODS/$TOTAL_PODS running)"
fi
echo ""

echo "🌐 To access the application:"
echo "  kubectl port-forward svc/mcp-ui-poc-client 8080:80"
echo "  Then open: http://localhost:8080"
