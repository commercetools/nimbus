# Minikube Local Kubernetes Setup

Complete guide for running MCP UI POC in Minikube.

## Prerequisites

- Docker installed and running
- `kubectl` CLI installed
- Anthropic API key

## Setup Minikube

```bash
# Install minikube (macOS)
brew install minikube

# Start cluster with adequate resources
minikube start --cpus=4 --memory=6144

# Enable addons
minikube addons enable ingress
minikube addons enable metrics-server

# Verify installation
kubectl cluster-info
kubectl get nodes
```

## Build and Deploy

### 1. Build Docker Images

```bash
# Navigate to MCP UI POC
cd apps/mcp-ui-poc

# Build both client and server images
./scripts/k8s-build.sh
```

### 2. Load Images into Minikube

```bash
# Load both images into Minikube's Docker daemon
./scripts/k8s-load-minikube.sh
```

### 3. Create Secret

```bash
# Create .env file with your API key
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Create Kubernetes secret from .env
./scripts/k8s-create-secret.sh
```

### 4. Deploy to Cluster

```bash
# Apply all manifests
./scripts/k8s-deploy.sh

# Wait for pods to be ready
kubectl wait --for=condition=ready pod -l app=mcp-ui-poc-server --timeout=120s
kubectl wait --for=condition=ready pod -l app=mcp-ui-poc-client --timeout=120s
```

### 5. Access Application

```bash
# Port forward the client
kubectl port-forward svc/mcp-ui-poc-client 8080:80

# In another terminal, port forward server (optional)
kubectl port-forward svc/mcp-ui-poc-server 3001:3001
```

Access at:
- Client UI: http://localhost:8080
- Server API: http://localhost:3001/elements

## Common Operations

### View Logs

```bash
# All logs
./scripts/k8s-logs.sh

# Or specific service
kubectl logs -f deployment/mcp-ui-poc-client
kubectl logs -f deployment/mcp-ui-poc-server
```

### Check Status

```bash
# Quick status
./scripts/k8s-status.sh

# Detailed pod info
kubectl get pods -o wide
kubectl describe pod <pod-name>
```

### Update After Code Changes

```bash
# Full rebuild and redeploy
./scripts/k8s-rebuild.sh
```

### Update Secrets

```bash
# Edit .env file
vim .env

# Recreate secret
kubectl delete secret mcp-ui-poc-secrets
./scripts/k8s-create-secret.sh

# Restart deployments
kubectl rollout restart deployment/mcp-ui-poc-server
kubectl rollout restart deployment/mcp-ui-poc-client
```

## Troubleshooting

### Pods Not Starting

```bash
# Check pod status
kubectl get pods

# View events
kubectl describe pod <pod-name>

# Check logs
kubectl logs <pod-name>
```

### Image Not Found

```bash
# Ensure images are loaded
./scripts/k8s-load-minikube.sh

# Verify images in Minikube
minikube image ls | grep mcp-ui-poc
```

### Connection Issues

```bash
# Test server from within cluster
kubectl run curl-test --image=curlimages/curl -it --rm -- \
  curl http://mcp-ui-poc-server:3001/elements

# Check services
kubectl get svc
```

## Cleanup

```bash
# Remove all resources
./scripts/k8s-cleanup.sh

# Stop Minikube
minikube stop

# Delete cluster (optional)
minikube delete
```

## Architecture

```
┌──────────────────────────────────────┐
│         Minikube Cluster             │
│                                      │
│  ┌────────────┐   ┌──────────────┐  │
│  │   Client   │──▶│    Server    │  │
│  │  (nginx)   │   │  (Node.js)   │  │
│  │  Port: 80  │   │  Port: 3001  │  │
│  └────────────┘   └──────────────┘  │
│         │                 │          │
│    Service          Service          │
│   (ClusterIP)     (ClusterIP)       │
│                                      │
└──────────────────────────────────────┘
           │
     Port Forward
           │
    localhost:8080
```
