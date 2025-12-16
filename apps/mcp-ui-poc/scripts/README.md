# MCP UI POC - Deployment Scripts

Scripts for building, pushing, and deploying the MCP UI POC to Google Kubernetes
Engine (GKE) with basic authentication.

## Prerequisites

1. **Docker**: Installed and running
2. **gcloud CLI**: Authenticated and configured
   ```bash
   gcloud auth login
   gcloud config set project ctp-playground
   ```
3. **kubectl**: Configured with cluster credentials
   ```bash
   gcloud container clusters get-credentials playground --region=europe-west1-c
   ```
4. **apache2-utils**: For htpasswd command (password management)

   ```bash
   # macOS
   brew install httpd

   # Ubuntu/Debian
   sudo apt-get install apache2-utils

   # RHEL/CentOS
   sudo yum install httpd-tools
   ```

5. **Environment file**: Create `.env` in `apps/mcp-ui-poc/` from `.env.example`
   ```bash
   cd apps/mcp-ui-poc
   cp .env.example .env
   # Edit .env to set UI_MCP_SERVER_URL, ANTHROPIC_API_KEY, and optionally COMMERCE_MCP_SERVER_URL
   ```

## Scripts Overview

| Script          | Purpose                                      | Usage                               |
| --------------- | -------------------------------------------- | ----------------------------------- |
| `build.sh`      | Build Docker images for server and/or client | `./build.sh [server\|client\|both]` |
| `push.sh`       | Push images to Google Artifact Registry      | `./push.sh [server\|client\|both]`  |
| `deploy.sh`     | Deploy to active GKE cluster                 | `./deploy.sh [NAMESPACE]`           |
| `setup-auth.sh` | Configure basic authentication               | `./setup-auth.sh [NAMESPACE]`       |

## Configuration

### Registry Settings

Images are pushed to:

- **Registry**: `us-east1-docker.pkg.dev/ctp-playground/byron-wall`
- **Server Image**: `mcp-ui-poc-server:latest`
- **Client Image**: `mcp-ui-poc-client:latest`

### Environment Variables

The `.env` file in `apps/mcp-ui-poc/` controls build configuration:

```bash
# Required for client build
ANTHROPIC_API_KEY=sk-ant-api...
UI_MCP_SERVER_URL=http://34.77.253.174:80  # UI Server LoadBalancer IP

# Optional for client build
COMMERCE_MCP_SERVER_URL=http://35.123.45.67:80  # Commerce Server LoadBalancer IP
```

**Important**: The client is built with these values baked into the JavaScript
bundle. You must rebuild the client whenever `UI_MCP_SERVER_URL` or `COMMERCE_MCP_SERVER_URL` changes.

## Deployment Workflow

### First-Time Setup

1. **Setup authentication** (creates htpasswd file and Kubernetes secret):

   ```bash
   ./scripts/setup-auth.sh byronw
   ```

2. **Deploy server** to get LoadBalancer IP:

   ```bash
   ./scripts/build.sh server
   ./scripts/push.sh server
   ./scripts/deploy.sh byronw
   ```

3. **Get server IPs** and update `.env`:

   ```bash
   # Get UI MCP server IP
   kubectl get service mcp-ui-poc-server-loadbalancer -n byronw -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
   # Update UI_MCP_SERVER_URL in .env with the IP

   # Get Commerce MCP server IP (if deployed)
   kubectl get service mcp-ui-poc-commerce-server-loadbalancer -n byronw -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
   # Update COMMERCE_MCP_SERVER_URL in .env with the IP
   ```

4. **Build and deploy client** with correct server URL:
   ```bash
   ./scripts/build.sh client
   ./scripts/push.sh client
   # Client will automatically pick up changes on next rollout
   kubectl rollout restart deployment/mcp-ui-poc-client -n byronw
   ```

### Updating Server

When you make changes to server code:

```bash
# 1. Build new server image
./scripts/build.sh server

# 2. Push to registry
./scripts/push.sh server

# 3. Restart server deployment to pull new image
kubectl rollout restart deployment/mcp-ui-poc-server -n byronw

# 4. Wait for rollout to complete
kubectl rollout status deployment/mcp-ui-poc-server -n byronw
```

### Updating Client

When you make changes to client code:

```bash
# 1. Ensure .env has correct server URLs
cat .env  # Verify UI_MCP_SERVER_URL and COMMERCE_MCP_SERVER_URL

# 2. Build new client image (uses server URLs from .env)
./scripts/build.sh client

# 3. Push to registry
./scripts/push.sh client

# 4. Restart client deployment to pull new image
kubectl rollout restart deployment/mcp-ui-poc-client -n byronw

# 5. Wait for rollout to complete
kubectl rollout status deployment/mcp-ui-poc-client -n byronw
```

**Note**: The `build.sh` script verifies that the UI_MCP_SERVER_URL was correctly baked
into the client bundle.

### Updating Both Server and Client

```bash
# Build both
./scripts/build.sh both

# Push both
./scripts/push.sh both

# Restart both deployments
kubectl rollout restart deployment/mcp-ui-poc-server -n byronw
kubectl rollout restart deployment/mcp-ui-poc-client -n byronw

# Monitor both rollouts
kubectl rollout status deployment/mcp-ui-poc-server -n byronw
kubectl rollout status deployment/mcp-ui-poc-client -n byronw
```

## Authentication Management

The application uses nginx basic authentication to protect the UI.

### First-Time Setup

```bash
./scripts/setup-auth.sh byronw
```

This will:

1. Prompt for username (default: `admin`)
2. Prompt for password
3. Create `.htpasswd` file in `client/.htpasswd`
4. Create Kubernetes secret `mcp-ui-poc-auth` in the specified namespace

### Updating Password

To change the username or password:

```bash
# 1. Re-run setup with new credentials
./scripts/setup-auth.sh byronw

# 2. Restart client deployment to apply changes
kubectl rollout restart deployment/mcp-ui-poc-client -n byronw
```

The new credentials will be applied immediately after the pods restart.

### Accessing the Application

Get the client LoadBalancer IP:

```bash
kubectl get service mcp-ui-poc-client-loadbalancer -n byronw
```

Visit the IP in your browser. You'll be prompted for:

- **Username**: The username you configured
- **Password**: The password you configured

## Build Script Details

### build.sh Usage

```bash
./scripts/build.sh [server|commerce|client|all]
```

**Modes**:

- `server` - Build UI MCP server only
- `commerce` - Build commerce MCP server only
- `client` - Build client only (requires UI_MCP_SERVER_URL and ANTHROPIC_API_KEY from .env)
- `all` - Build all three (default, uses .env file)

**Examples**:

```bash
# Build both using .env file
./scripts/build.sh

# Build server only
./scripts/build.sh server

# Build client with explicit URL
./scripts/build.sh client http://34.77.253.174:80 sk-ant-api...

# Build both with values from .env
./scripts/build.sh both
```

**Client Build Verification**: The script automatically verifies that the
SERVER_URL was correctly baked into the JavaScript bundle.

## Common Tasks

### Check Deployment Status

```bash
# All pods
kubectl get pods -l 'app in (mcp-ui-poc-server,mcp-ui-poc-client)' -n byronw

# Server pods only
kubectl get pods -l app=mcp-ui-poc-server -n byronw

# Client pods only
kubectl get pods -l app=mcp-ui-poc-client -n byronw
```

### View Logs

```bash
# Server logs (live tail)
kubectl logs -l app=mcp-ui-poc-server -n byronw -f

# Client logs (live tail)
kubectl logs -l app=mcp-ui-poc-client -n byronw -f

# Specific pod logs
kubectl logs <pod-name> -n byronw
```

### Get Service IPs

```bash
# Server LoadBalancer IP
kubectl get service mcp-ui-poc-server-loadbalancer -n byronw -o jsonpath='{.status.loadBalancer.ingress[0].ip}'

# Client LoadBalancer IP
kubectl get service mcp-ui-poc-client-loadbalancer -n byronw -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

### Rollback Deployment

```bash
# View revision history
kubectl rollout history deployment/mcp-ui-poc-client -n byronw
kubectl rollout history deployment/mcp-ui-poc-server -n byronw

# Rollback to previous version
kubectl rollout undo deployment/mcp-ui-poc-client -n byronw
kubectl rollout undo deployment/mcp-ui-poc-server -n byronw

# Rollback to specific revision
kubectl rollout undo deployment/mcp-ui-poc-client -n byronw --to-revision=3
```

## Troubleshooting

### Build Fails

**Check Docker**:

```bash
docker ps  # Verify Docker is running
```

**Verify .env file**:

```bash
cat apps/mcp-ui-poc/.env
# Must contain ANTHROPIC_API_KEY and UI_MCP_SERVER_URL for client builds
# Optionally COMMERCE_MCP_SERVER_URL if commerce server is deployed
```

**Common Issues**:

- Missing `.env` file → Copy from `.env.example`
- Wrong directory → Run from `apps/mcp-ui-poc` or repository root
- Docker not running → Start Docker Desktop

### Push Fails

**Configure Docker authentication**:

```bash
gcloud auth configure-docker us-east1-docker.pkg.dev
```

**Verify access**:

```bash
gcloud projects list
gcloud auth list
```

### Deploy Fails

**Verify kubectl configuration**:

```bash
kubectl cluster-info
kubectl config current-context
```

**Get cluster credentials**:

```bash
gcloud container clusters get-credentials playground --region=europe-west1-c
```

**Check authentication secret**:

```bash
kubectl get secret mcp-ui-poc-auth -n byronw
# If missing, run: ./scripts/setup-auth.sh byronw
```

### Pods Not Starting

**Check pod status**:

```bash
kubectl get pods -n byronw
kubectl describe pod <pod-name> -n byronw
kubectl logs <pod-name> -n byronw
```

**Common Issues**:

- `ImagePullBackOff` → Image not pushed to registry or wrong tag
- `CrashLoopBackOff` → Application error, check logs
- `Pending` → Resource constraints or node issues

### Client Shows "localhost" CORS Error

This means the client was built with the wrong server URL:

1. **Check current server URLs in .env**:

   ```bash
   cat apps/mcp-ui-poc/.env | grep MCP_SERVER_URL
   ```

2. **Get correct server IPs**:

   ```bash
   # UI MCP server
   kubectl get service mcp-ui-poc-server-loadbalancer -n byronw -o jsonpath='{.status.loadBalancer.ingress[0].ip}'

   # Commerce MCP server (if deployed)
   kubectl get service mcp-ui-poc-commerce-server-loadbalancer -n byronw -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
   ```

3. **Update .env with correct IPs**:

   ```bash
   # Edit apps/mcp-ui-poc/.env
   UI_MCP_SERVER_URL=http://34.77.253.174:80  # Use actual UI server IP
   COMMERCE_MCP_SERVER_URL=http://35.123.45.67:80  # Use actual commerce server IP (optional)
   ```

4. **Rebuild and redeploy client**:
   ```bash
   ./scripts/build.sh client
   ./scripts/push.sh client
   kubectl rollout restart deployment/mcp-ui-poc-client -n byronw
   ```

### Session Errors on Refresh

If you see "Session not found" or "Connection closed" errors after refreshing:

1. **Check server logs**:

   ```bash
   kubectl logs -l app=mcp-ui-poc-server -n byronw --tail=50
   ```

2. **Restart both deployments**:

   ```bash
   kubectl rollout restart deployment/mcp-ui-poc-server -n byronw
   kubectl rollout restart deployment/mcp-ui-poc-client -n byronw
   ```

3. **Clear browser cache and localStorage** (F12 → Application → Clear storage)

## Cleanup

### Remove Deployment

```bash
kubectl delete -f server/k8s/deployment.yaml -n byronw
kubectl delete -f server/k8s/ingress.yaml -n byronw
kubectl delete -f client/k8s/deployment.yaml -n byronw
kubectl delete -f client/k8s/ingress.yaml -n byronw
```

### Remove Authentication Secret

```bash
kubectl delete secret mcp-ui-poc-auth -n byronw
```

### Remove Local Files

```bash
rm client/.htpasswd
rm client/.htpasswd.example
```

## Architecture Notes

### Image Tags

All scripts use the `latest` tag by default. The deployment uses
`imagePullPolicy: Always` to ensure new images are pulled on restart.

### Session Management

- **Client**: Clears localStorage session data on initialization to prevent
  stale sessions
- **Server**: Handles stale session IDs gracefully by returning proper error
  responses
- **On refresh**: Client creates a fresh MCP session automatically

### Build Process

The client build is a multi-stage Docker build:

1. **Stage 1**: Build workspace dependencies (nimbus, nimbus-icons)
2. **Stage 2**: Build client application with environment variables baked in
3. **Stage 3**: Create nginx production image with built assets

Environment variables (`VITE_*`) are replaced at build time, not runtime.
