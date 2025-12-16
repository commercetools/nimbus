#!/bin/bash
# Build Docker images for MCP UI POC
#
# Usage:
#   ./scripts/build.sh [server|commerce|client|all]
#
# Arguments:
#   server   - Build UI MCP server only
#   commerce - Build commerce MCP server only
#   client   - Build client only
#   all      - Build all three (default)
#
# Environment variables (required in .env file):
#   SERVER_URL         - UI MCP server URL (e.g., http://34.123.45.67:80)
#   ANTHROPIC_API_KEY  - Anthropic API key
#   REGISTRY           - Docker registry (optional, defaults to us-east1-docker.pkg.dev/ctp-playground/byron-wall)
#
# Examples:
#   ./scripts/build.sh           # Build all three services
#   ./scripts/build.sh server    # Build UI MCP server only
#   ./scripts/build.sh commerce  # Build commerce MCP server only
#   ./scripts/build.sh client    # Build client only

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
MCP_UI_POC_DIR="$REPO_ROOT/apps/mcp-ui-poc"

# Check for .env file
if [[ ! -f "$MCP_UI_POC_DIR/.env" ]]; then
    echo "❌ Error: .env file not found at $MCP_UI_POC_DIR/.env"
    echo ""
    echo "Create .env file with required variables:"
    echo "  ANTHROPIC_API_KEY=your_key_here"
    echo "  UI_MCP_SERVER_URL=http://your_server_ip:80"
    echo ""
    exit 1
fi

# Load environment variables from .env file
echo "📋 Loading environment from .env file..."
set -a
source "$MCP_UI_POC_DIR/.env"
set +a
echo "   Loaded UI_MCP_SERVER_URL: ${UI_MCP_SERVER_URL:-<not set>}"
echo "   Loaded COMMERCE_MCP_SERVER_URL: ${COMMERCE_MCP_SERVER_URL:-<not set>}"
echo "   Loaded ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY:+<set>}${ANTHROPIC_API_KEY:-<not set>}"
echo ""

MODE="${1:-all}"
REGISTRY="${REGISTRY:-us-east1-docker.pkg.dev/ctp-playground/byron-wall}"

echo "🏗️  Building MCP UI POC Images"
echo "=============================="
echo "Mode: $MODE"
echo "Registry: $REGISTRY"
echo ""

# Build UI MCP server
if [[ "$MODE" == "server" || "$MODE" == "all" ]]; then
    echo "📦 Building UI MCP server image..."
    cd "$REPO_ROOT"
    docker build \
        --no-cache \
        --platform linux/amd64 \
        -t mcp-ui-poc-server:latest \
        -t "${REGISTRY}/mcp-ui-poc-server:latest" \
        -f apps/mcp-ui-poc/server/Dockerfile \
        .
    echo "✅ UI MCP server image built"
    echo ""
fi

# Build commerce MCP server
if [[ "$MODE" == "commerce" || "$MODE" == "all" ]]; then
    echo "📦 Building commerce MCP server image..."
    cd "$REPO_ROOT"
    docker build \
        --no-cache \
        --platform linux/amd64 \
        -t mcp-ui-poc-commerce-server:latest \
        -t "${REGISTRY}/mcp-ui-poc-commerce-server:latest" \
        -f apps/mcp-ui-poc/commerce-mcp-server/Dockerfile \
        .
    echo "✅ Commerce MCP server image built"
    echo ""
fi

# Build client
if [[ "$MODE" == "client" || "$MODE" == "all" ]]; then
    # Validate required variables for client build
    if [[ -z "$UI_MCP_SERVER_URL" ]]; then
        echo "❌ Error: UI_MCP_SERVER_URL not set in .env file"
        echo "Required for client build to bake in the UI MCP server URL"
        exit 1
    fi

    if [[ -z "$ANTHROPIC_API_KEY" ]]; then
        echo "❌ Error: ANTHROPIC_API_KEY not set in .env file"
        echo "Required for client build"
        exit 1
    fi

    echo "📦 Building client image..."
    echo "   UI MCP Server URL: $UI_MCP_SERVER_URL"
    echo "   Commerce MCP Server URL: ${COMMERCE_MCP_SERVER_URL:-<not set>}"
    echo "   API Key: ${ANTHROPIC_API_KEY:0:10}..." # Show first 10 chars only
    cd "$REPO_ROOT"

    # Build docker command with required args
    DOCKER_BUILD_ARGS=(
        "--platform" "linux/amd64"
        "--build-arg" "VITE_MCP_SERVER_URL=$UI_MCP_SERVER_URL"
        "--build-arg" "VITE_ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY"
    )

    # Add commerce server URL if set
    if [[ -n "$COMMERCE_MCP_SERVER_URL" ]]; then
        DOCKER_BUILD_ARGS+=("--build-arg" "VITE_COMMERCE_MCP_SERVER_URL=$COMMERCE_MCP_SERVER_URL")
        echo "   Commerce server will be configured"
    else
        echo "   Commerce server not configured (optional)"
    fi

    # Force rebuild of client layers when environment variables change
    # Without --no-cache, Docker would reuse cached build with old URLs
    docker build \
        --no-cache \
        "${DOCKER_BUILD_ARGS[@]}" \
        -t mcp-ui-poc-client:latest \
        -t "${REGISTRY}/mcp-ui-poc-client:latest" \
        -f apps/mcp-ui-poc/client/Dockerfile \
        .
    echo "✅ Client image built"

    # Verify server URLs were baked in
    echo ""
    echo "🔍 Verifying server URLs in bundle..."
    BUNDLE_CONTENT=$(docker run --rm mcp-ui-poc-client:latest sh -c "cat /usr/share/nginx/html/assets/*.js")

    # Check for UI MCP server URL
    if echo "$BUNDLE_CONTENT" | grep -q "$UI_MCP_SERVER_URL"; then
        echo "✅ UI MCP Server URL verified: $UI_MCP_SERVER_URL"
    else
        echo "❌ ERROR: UI MCP Server URL not found in bundle!"
        echo "   Expected: $UI_MCP_SERVER_URL"
        exit 1
    fi

    # Check for Commerce MCP server URL (optional)
    if [[ -n "$COMMERCE_MCP_SERVER_URL" ]]; then
        if echo "$BUNDLE_CONTENT" | grep -q "$COMMERCE_MCP_SERVER_URL"; then
            echo "✅ Commerce MCP Server URL verified: $COMMERCE_MCP_SERVER_URL"
        else
            echo "❌ ERROR: Commerce MCP Server URL not found in bundle!"
            echo "   Expected: $COMMERCE_MCP_SERVER_URL"
            exit 1
        fi
    else
        echo "ℹ️  Commerce MCP Server URL not configured (optional)"
    fi
    echo ""
fi

echo "✅ Build complete!"
echo ""
if [[ "$MODE" == "server" ]]; then
    echo "Images created:"
    echo "  - mcp-ui-poc-server:latest"
    echo ""
    echo "Next steps:"
    echo "  1. Push image: ./scripts/push.sh server"
    echo "  2. Deploy: ./scripts/deploy.sh"
elif [[ "$MODE" == "commerce" ]]; then
    echo "Images created:"
    echo "  - mcp-ui-poc-commerce-server:latest"
    echo ""
    echo "Next steps:"
    echo "  1. Push image: ./scripts/push.sh commerce"
    echo "  2. Deploy: ./scripts/deploy.sh"
elif [[ "$MODE" == "client" ]]; then
    echo "Images created:"
    echo "  - mcp-ui-poc-client:latest"
    echo ""
    echo "Next steps:"
    echo "  1. Push image: ./scripts/push.sh client"
    echo "  2. Deploy: ./scripts/deploy.sh"
elif [[ "$MODE" == "all" ]]; then
    echo "Images created:"
    echo "  - mcp-ui-poc-server:latest"
    echo "  - mcp-ui-poc-commerce-server:latest"
    echo "  - mcp-ui-poc-client:latest"
    echo ""
    echo "Next steps:"
    echo "  1. Push images: ./scripts/push.sh all"
    echo "  2. Deploy: ./scripts/deploy.sh"
fi
