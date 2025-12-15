#!/bin/bash
# Build Docker images for MCP UI POC
#
# Usage:
#   ./scripts/build.sh                       # Build both (default, uses .env)
#   ./scripts/build.sh server                # Build server only
#   ./scripts/build.sh client [SERVER_URL] [API_KEY]  # Build client (loads from .env if not provided)
#   ./scripts/build.sh both [SERVER_URL] [API_KEY]    # Build both (loads from .env if not provided)
#
# Environment variables (from .env file):
#   SERVER_URL         - MCP server URL (e.g., http://34.123.45.67:80)
#   ANTHROPIC_API_KEY  - Anthropic API key
#
# Examples:
#   ./scripts/build.sh                                    # Build both (uses .env)
#   ./scripts/build.sh server                             # Build server only
#   ./scripts/build.sh client                             # Build client (uses .env)
#   ./scripts/build.sh client http://34.123.45.67:80      # Override SERVER_URL
#   ./scripts/build.sh client http://34.123.45.67:80 sk-ant-custom-key  # Override both
#   ./scripts/build.sh both                               # Build both (uses .env)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
MCP_UI_POC_DIR="$REPO_ROOT/apps/mcp-ui-poc"
REGISTRY="us-east1-docker.pkg.dev/ctp-playground/byron-wall"

# Load environment variables from .env file if it exists
if [[ -f "$MCP_UI_POC_DIR/.env" ]]; then
    echo "📋 Loading environment from .env file..."
    set -a
    source "$MCP_UI_POC_DIR/.env"
    set +a
fi

MODE="${1:-both}"
# Use command-line SERVER_URL if provided, otherwise use from .env
SERVER_URL="${2:-${SERVER_URL:-}}"
# Use command-line API_KEY if provided, otherwise use from .env
API_KEY="${3:-${ANTHROPIC_API_KEY:-}}"

echo "🏗️  Building MCP UI POC Images"
echo "=============================="
echo ""

# Build server
if [[ "$MODE" == "server" || "$MODE" == "both" ]]; then
    echo "📦 Building server image..."
    cd "$REPO_ROOT"
    docker build \
        --platform linux/amd64 \
        -t mcp-ui-poc-server:latest \
        -t "${REGISTRY}/mcp-ui-poc-server:latest" \
        -f apps/mcp-ui-poc/server/Dockerfile \
        .
    echo "✅ Server image built"
    echo ""
fi

# Build client
if [[ "$MODE" == "client" || "$MODE" == "both" ]]; then
    if [[ -z "$SERVER_URL" ]]; then
        echo "❌ Error: SERVER_URL required for client build"
        echo "Options:"
        echo "  1. Set SERVER_URL in apps/mcp-ui-poc/.env"
        echo "  2. Pass as argument: ./scripts/build.sh client <SERVER_URL>"
        exit 1
    fi

    if [[ -z "$API_KEY" ]]; then
        echo "❌ Error: ANTHROPIC_API_KEY required for client build"
        echo "Options:"
        echo "  1. Set ANTHROPIC_API_KEY in apps/mcp-ui-poc/.env"
        echo "  2. Pass as argument: ./scripts/build.sh client <SERVER_URL> <API_KEY>"
        exit 1
    fi

    echo "📦 Building client image..."
    echo "   Server URL: $SERVER_URL"
    echo "   API Key: ${API_KEY:0:10}..." # Show first 10 chars only
    cd "$REPO_ROOT"
    docker build \
        --platform linux/amd64 \
        --build-arg VITE_MCP_SERVER_URL="$SERVER_URL" \
        --build-arg VITE_ANTHROPIC_API_KEY="$API_KEY" \
        -t mcp-ui-poc-client:latest \
        -t "${REGISTRY}/mcp-ui-poc-client:latest" \
        -f apps/mcp-ui-poc/client/Dockerfile \
        .
    echo "✅ Client image built"

    # Verify server URL was baked in
    echo ""
    echo "🔍 Verifying server URL in bundle..."
    BAKED_URL=$(docker run --rm mcp-ui-poc-client:latest sh -c "cat /usr/share/nginx/html/assets/*.js | grep -o 'http://[^\"]*' | grep -E '(http://[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+|localhost)' | head -1")

    if [[ "$BAKED_URL" == *"localhost"* ]]; then
        echo "❌ ERROR: Client still has localhost URL!"
        echo "   Found: $BAKED_URL"
        echo "   Expected: $SERVER_URL"
        exit 1
    else
        echo "✅ Server URL verified: $BAKED_URL"
    fi
    echo ""
fi

echo "✅ Build complete!"
echo ""
if [[ "$MODE" == "server" ]]; then
    echo "Images created:"
    echo "  - mcp-ui-poc-server:latest"
    echo ""
    echo "Next: Deploy server to get LoadBalancer IP, then build client"
elif [[ "$MODE" == "client" ]]; then
    echo "Images created:"
    echo "  - mcp-ui-poc-client:latest"
elif [[ "$MODE" == "both" ]]; then
    echo "Images created:"
    echo "  - mcp-ui-poc-server:latest"
    echo "  - mcp-ui-poc-client:latest"
fi
