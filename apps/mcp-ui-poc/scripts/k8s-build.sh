#!/bin/bash
# Build Docker images for MCP UI POC

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
MCP_DIR="$PROJECT_ROOT/apps/mcp-ui-poc"

echo "🔨 Building Docker images for MCP UI POC..."
echo ""

# Check if workspace packages are built
echo "📦 Checking workspace packages..."
if [ ! -d "$PROJECT_ROOT/packages/nimbus/dist" ]; then
    echo "❌ Error: packages/nimbus/dist not found"
    echo "Run 'pnpm build:packages' from repository root first"
    exit 1
fi

if [ ! -d "$PROJECT_ROOT/packages/nimbus-icons/dist" ]; then
    echo "❌ Error: packages/nimbus-icons/dist not found"
    echo "Run 'pnpm build:packages' from repository root first"
    exit 1
fi

if [ ! -d "$PROJECT_ROOT/packages/tokens/dist" ]; then
    echo "❌ Error: packages/tokens/dist not found"
    echo "Run 'pnpm build:packages' from repository root first"
    exit 1
fi

echo "✅ Workspace packages found"
echo ""

# Build server image
echo "🚀 Building server image..."
cd "$PROJECT_ROOT"
docker build \
    -f apps/mcp-ui-poc/server/Dockerfile \
    -t mcp-ui-poc-server:latest \
    .
echo "✅ Server image built: mcp-ui-poc-server:latest"
echo ""

# Build client image
echo "🚀 Building client image..."
docker build \
    -f apps/mcp-ui-poc/client/Dockerfile \
    -t mcp-ui-poc-client:latest \
    .
echo "✅ Client image built: mcp-ui-poc-client:latest"
echo ""

echo "✅ All images built successfully!"
echo ""
echo "Next steps:"
echo "  1. Load images into Minikube: ./scripts/k8s-load-minikube.sh"
echo "  2. Create secrets: ./scripts/k8s-create-secret.sh"
echo "  3. Deploy: ./scripts/k8s-deploy.sh"
