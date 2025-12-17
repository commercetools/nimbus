#!/bin/bash
# Push Docker images to Google Artifact Registry (GCR)
#
# Usage:
#   ./scripts/push.sh [server|commerce|client|all] [TAG]
#
# Arguments:
#   server   - Push UI MCP server only
#   commerce - Push commerce MCP server only
#   client   - Push client only
#   all      - Push all three (default)
#   TAG      - Docker tag (default: latest)
#
# Examples:
#   ./scripts/push.sh              # Push all with 'latest' tag
#   ./scripts/push.sh server       # Push UI MCP server only
#   ./scripts/push.sh commerce     # Push commerce MCP server only
#   ./scripts/push.sh client       # Push client only
#   ./scripts/push.sh all          # Push all three images
#   ./scripts/push.sh server v1.2.3  # Push UI MCP server with custom tag

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MCP_UI_POC_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Load environment variables from .env file if it exists
if [[ -f "$MCP_UI_POC_DIR/.env" ]]; then
    set -a
    source "$MCP_UI_POC_DIR/.env"
    set +a
fi

# Configuration
REGISTRY="${REGISTRY:-us-east1-docker.pkg.dev/ctp-playground/byron-wall}"
SERVER_IMAGE="mcp-ui-poc-server"
COMMERCE_IMAGE="mcp-ui-poc-commerce-server"
CLIENT_IMAGE="mcp-ui-poc-client"

# Parse arguments
MODE="${1:-all}"
TAG="${2:-latest}"

# If first arg looks like a version tag, treat as "all" mode
if [[ "$MODE" =~ ^v[0-9] ]] || [[ "$MODE" == "latest" ]]; then
    TAG="$MODE"
    MODE="all"
fi

echo "🚀 Pushing images to Google Artifact Registry"
echo "============================================="
echo "Registry: $REGISTRY"
echo "Mode: $MODE"
echo "Tag: $TAG"
echo ""

# Authenticate with Google Artifact Registry
echo "🔐 Configuring Docker authentication..."
gcloud auth configure-docker us-east1-docker.pkg.dev --quiet
echo ""

# Push UI MCP server image
if [[ "$MODE" == "server" || "$MODE" == "all" ]]; then
    if docker image inspect "${SERVER_IMAGE}:latest" >/dev/null 2>&1; then
        echo "📦 Pushing UI MCP server image..."
        docker tag "${SERVER_IMAGE}:latest" "${REGISTRY}/${SERVER_IMAGE}:${TAG}"
        docker push "${REGISTRY}/${SERVER_IMAGE}:${TAG}"
        echo "✅ Pushed: ${REGISTRY}/${SERVER_IMAGE}:${TAG}"
        echo ""
    else
        echo "⚠️  UI MCP server image not found, skipping"
        echo ""
    fi
fi

# Push commerce MCP server image
if [[ "$MODE" == "commerce" || "$MODE" == "all" ]]; then
    if docker image inspect "${COMMERCE_IMAGE}:latest" >/dev/null 2>&1; then
        echo "📦 Pushing commerce MCP server image..."
        docker tag "${COMMERCE_IMAGE}:latest" "${REGISTRY}/${COMMERCE_IMAGE}:${TAG}"
        docker push "${REGISTRY}/${COMMERCE_IMAGE}:${TAG}"
        echo "✅ Pushed: ${REGISTRY}/${COMMERCE_IMAGE}:${TAG}"
        echo ""
    else
        echo "⚠️  Commerce MCP server image not found, skipping"
        echo ""
    fi
fi

# Push client image
if [[ "$MODE" == "client" || "$MODE" == "all" ]]; then
    if docker image inspect "${CLIENT_IMAGE}:latest" >/dev/null 2>&1; then
        echo "📦 Pushing client image..."
        docker tag "${CLIENT_IMAGE}:latest" "${REGISTRY}/${CLIENT_IMAGE}:${TAG}"
        docker push "${REGISTRY}/${CLIENT_IMAGE}:${TAG}"
        echo "✅ Pushed: ${REGISTRY}/${CLIENT_IMAGE}:${TAG}"
        echo ""
    else
        echo "⚠️  Client image not found, skipping"
        echo ""
    fi
fi

echo "✅ Push complete!"
