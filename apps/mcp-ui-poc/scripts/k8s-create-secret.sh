#!/bin/bash
# Create Kubernetes secret from .env file

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MCP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$MCP_DIR/.env"

echo "🔐 Creating Kubernetes secret..."
echo ""

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Error: .env file not found at $ENV_FILE"
    echo "Create it from .env.example and add your ANTHROPIC_API_KEY"
    exit 1
fi

# Source .env file
set -a
source "$ENV_FILE"
set +a

# Check if API key is set
if [ -z "$ANTHROPIC_API_KEY" ] || [ "$ANTHROPIC_API_KEY" = "your-anthropic-api-key-here" ]; then
    echo "❌ Error: ANTHROPIC_API_KEY not set in .env file"
    echo "Edit .env and add your actual API key"
    exit 1
fi

echo "✅ Found ANTHROPIC_API_KEY"
echo ""

# Delete existing secret if it exists
if kubectl get secret mcp-ui-poc-secrets &> /dev/null; then
    echo "🗑️  Deleting existing secret..."
    kubectl delete secret mcp-ui-poc-secrets
    echo ""
fi

# Create secret
echo "📝 Creating secret..."
kubectl create secret generic mcp-ui-poc-secrets \
    --from-literal=ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY"

echo ""
echo "✅ Secret created successfully!"
echo ""
echo "Next steps:"
echo "  1. Deploy: ./scripts/k8s-deploy.sh"
