#!/bin/bash
# Push Docker images to Google Artifact Registry (GCR)
#
# Usage:
#   ./scripts/push.sh [server|client|both] [TAG]
#
# Examples:
#   ./scripts/push.sh                  # Push server only with 'latest' tag
#   ./scripts/push.sh server           # Push server only
#   ./scripts/push.sh client           # Push client only
#   ./scripts/push.sh both             # Push both images
#   ./scripts/push.sh server v1.2.3    # Push server with custom tag

set -e

# Configuration
REGISTRY="us-east1-docker.pkg.dev/ctp-playground/byron-wall"
SERVER_IMAGE="mcp-ui-poc-server"
CLIENT_IMAGE="mcp-ui-poc-client"

# Parse arguments
MODE="${1:-server}"
TAG="${2:-latest}"

# If first arg looks like a version tag, treat as "both" mode
if [[ "$MODE" =~ ^v[0-9] ]] || [[ "$MODE" == "latest" ]]; then
    TAG="$MODE"
    MODE="both"
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

# Push server image
if [[ "$MODE" == "server" || "$MODE" == "both" ]]; then
    if docker image inspect "${SERVER_IMAGE}:latest" >/dev/null 2>&1; then
        echo "📦 Pushing server image..."
        docker tag "${SERVER_IMAGE}:latest" "${REGISTRY}/${SERVER_IMAGE}:${TAG}"
        docker push "${REGISTRY}/${SERVER_IMAGE}:${TAG}"
        echo "✅ Pushed: ${REGISTRY}/${SERVER_IMAGE}:${TAG}"
        echo ""
    else
        echo "⚠️  Server image not found, skipping"
        echo ""
    fi
fi

# Push client image
if [[ "$MODE" == "client" || "$MODE" == "both" ]]; then
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
