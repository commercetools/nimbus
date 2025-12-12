#!/bin/bash
# View logs from MCP UI POC pods

COMPONENT=${1:-"all"}

echo "📋 Viewing logs for: $COMPONENT"
echo ""

case $COMPONENT in
    server)
        kubectl logs -f deployment/mcp-ui-poc-server --all-containers=true
        ;;
    client)
        kubectl logs -f deployment/mcp-ui-poc-client --all-containers=true
        ;;
    all)
        echo "Server logs:"
        echo "─────────────────────────────────────"
        kubectl logs deployment/mcp-ui-poc-server --tail=20
        echo ""
        echo "Client logs:"
        echo "─────────────────────────────────────"
        kubectl logs deployment/mcp-ui-poc-client --tail=20
        echo ""
        echo "💡 To follow logs for a specific component:"
        echo "  ./scripts/k8s-logs.sh server"
        echo "  ./scripts/k8s-logs.sh client"
        ;;
    *)
        echo "❌ Invalid component: $COMPONENT"
        echo "Usage: ./scripts/k8s-logs.sh [server|client|all]"
        exit 1
        ;;
esac
