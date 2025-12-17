#!/bin/bash
# Setup authentication and secrets for MCP UI POC
# Creates:
#   1. htpasswd file and Kubernetes secret for basic auth (client access)
#   2. Kubernetes secret for commercetools credentials (commerce-server)
#
# Usage:
#   ./setup-auth.sh [NAMESPACE]
#
# Arguments:
#   NAMESPACE - Kubernetes namespace (default: byronw)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MCP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
HTPASSWD_FILE="$MCP_DIR/client/.htpasswd"
NAMESPACE="${1:-byronw}"

echo "🔐 Setting up Authentication & Secrets"
echo "======================================="
echo "Namespace: $NAMESPACE"
echo ""

# Check kubectl is configured
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ kubectl not configured"
    echo ""
    echo "Get cluster credentials first:"
    echo "  gcloud container clusters get-credentials <cluster> --region=<region>"
    exit 1
fi

echo "📍 Current cluster:"
kubectl config current-context
echo ""

# ============================================================================
# PART 1: Basic Authentication (htpasswd for client access)
# ============================================================================

echo "🔒 Part 1: Basic Authentication"
echo "--------------------------------"
echo ""

# Check if htpasswd command is available
if ! command -v htpasswd &> /dev/null; then
    echo "❌ htpasswd command not found"
    echo ""
    echo "Install apache2-utils:"
    echo "  macOS:         brew install httpd"
    echo "  Ubuntu/Debian: sudo apt-get install apache2-utils"
    echo "  RHEL/CentOS:   sudo yum install httpd-tools"
    exit 1
fi

# Create htpasswd file
if [ -f "$HTPASSWD_FILE" ]; then
    echo "⚠️  htpasswd file already exists: $HTPASSWD_FILE"
    read -p "Overwrite? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Using existing htpasswd file"
    else
        rm "$HTPASSWD_FILE"
    fi
fi

if [ ! -f "$HTPASSWD_FILE" ]; then
    read -p "Enter username [admin]: " USERNAME
    USERNAME=${USERNAME:-admin}

    echo ""
    echo "Enter password for user '$USERNAME':"
    htpasswd -cB "$HTPASSWD_FILE" "$USERNAME"
    echo ""
    echo "✅ htpasswd file created"
else
    echo "✅ Using existing htpasswd file"
fi
echo ""

# Create Kubernetes secret for basic auth
echo "🔧 Creating mcp-ui-poc-auth secret..."
kubectl delete secret mcp-ui-poc-auth -n "$NAMESPACE" 2>/dev/null || true
kubectl create secret generic mcp-ui-poc-auth \
    --from-file=.htpasswd="$HTPASSWD_FILE" \
    --namespace="$NAMESPACE"

echo ""
echo "✅ Basic authentication configured!"
echo ""

# ============================================================================
# PART 2: Commerce Credentials (optional, from .env)
# ============================================================================

echo "🛒 Part 2: Commerce Credentials"
echo "--------------------------------"
echo ""

# Check for .env file
if [[ ! -f "$MCP_DIR/.env" ]]; then
    echo "⚠️  No .env file found - skipping commerce credentials"
    echo ""
    echo "To deploy commerce-server later:"
    echo "  1. Create .env with CT_* variables"
    echo "  2. Re-run: ./scripts/setup-auth.sh $NAMESPACE"
    echo ""
    SKIP_COMMERCE=true
else
    # Load environment variables
    echo "📋 Loading credentials from .env file..."
    set -a
    source "$MCP_DIR/.env"
    set +a

    # Check if commerce credentials are present
    if [[ -z "$CT_CLIENT_ID" ]] || [[ -z "$CT_CLIENT_SECRET" ]] || [[ -z "$CT_PROJECT_KEY" ]]; then
        echo "⚠️  Commerce credentials (CT_*) not found in .env - skipping"
        echo ""
        echo "To deploy commerce-server later, add to .env:"
        echo "  CT_CLIENT_ID=your_client_id"
        echo "  CT_CLIENT_SECRET=your_client_secret"
        echo "  CT_PROJECT_KEY=your_project_key"
        echo "  CT_AUTH_URL=https://auth.europe-west1.gcp.commercetools.com"
        echo "  CT_API_URL=https://api.europe-west1.gcp.commercetools.com"
        echo ""
        SKIP_COMMERCE=true
    else
        SKIP_COMMERCE=false

        # Validate all required variables
        MISSING_VARS=()
        [[ -z "$CT_AUTH_URL" ]] && MISSING_VARS+=("CT_AUTH_URL")
        [[ -z "$CT_API_URL" ]] && MISSING_VARS+=("CT_API_URL")

        if [ ${#MISSING_VARS[@]} -ne 0 ]; then
            echo "❌ Error: Missing required environment variables in .env:"
            for var in "${MISSING_VARS[@]}"; do
                echo "  - $var"
            done
            echo ""
            echo "Skipping commerce credentials setup"
            SKIP_COMMERCE=true
        else
            echo "✅ All commerce credentials found"
            echo ""

            # Check if secret already exists
            if kubectl get secret commerce-mcp-credentials -n "$NAMESPACE" &> /dev/null; then
                echo "⚠️  Secret 'commerce-mcp-credentials' already exists"
                read -p "Replace it? (y/N): " -n 1 -r
                echo ""
                if [[ $REPLY =~ ^[Yy]$ ]]; then
                    kubectl delete secret commerce-mcp-credentials -n "$NAMESPACE"
                    echo "🗑️  Existing secret deleted"
                else
                    echo "✅ Keeping existing commerce credentials"
                    SKIP_COMMERCE=true
                fi
            fi

            if [[ "$SKIP_COMMERCE" == "false" ]]; then
                # Create the secret
                echo "🔧 Creating commerce-mcp-credentials secret..."
                kubectl create secret generic commerce-mcp-credentials \
                  --from-literal=client-id="$CT_CLIENT_ID" \
                  --from-literal=client-secret="$CT_CLIENT_SECRET" \
                  --from-literal=project-key="$CT_PROJECT_KEY" \
                  --from-literal=auth-url="$CT_AUTH_URL" \
                  --from-literal=api-url="$CT_API_URL" \
                  -n "$NAMESPACE"

                echo ""
                echo "✅ Commerce credentials configured!"
            fi
        fi
    fi
fi

echo ""
echo "======================================="
echo "✅ Setup Complete!"
echo "======================================="
echo ""
echo "Secrets configured:"
kubectl get secrets -n "$NAMESPACE" | grep -E "NAME|mcp-ui-poc|commerce-mcp"
echo ""
echo "Next steps:"
echo "  1. Build images: ./scripts/build.sh all"
echo "  2. Push images: ./scripts/push.sh all"
echo "  3. Deploy: ./scripts/deploy.sh $NAMESPACE"
echo ""
if [[ "$SKIP_COMMERCE" == "true" ]]; then
    echo "ℹ️  Note: Commerce-server will be skipped in deployment"
    echo "   (commerce credentials not configured)"
fi
