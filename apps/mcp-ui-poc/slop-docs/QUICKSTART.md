# MCP UI POC - Kubernetes Quick Reference

## Prerequisites

```bash
# Install Minikube (macOS)
brew install minikube

# Install kubectl
brew install kubectl

# Start Minikube (adjust memory if needed)
minikube start --cpus=4 --memory=6144
```

## One-Command Deployment

```bash
cd apps/mcp-ui-poc

# Builds images from npm packages and deploys
./scripts/k8s-quickstart.sh
```

## Common Commands

```bash
# Check status
./scripts/k8s-status.sh

# View logs
./scripts/k8s-logs.sh          # All logs
./scripts/k8s-logs.sh server   # Server only
./scripts/k8s-logs.sh client   # Client only

# Access application
kubectl port-forward svc/mcp-ui-poc-client 8080:80
# Open http://localhost:8080

# Rebuild after changes
./scripts/k8s-rebuild.sh

# Clean up
./scripts/k8s-cleanup.sh
```

## Troubleshooting

### Pods not starting?
```bash
kubectl get pods
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

### Need to update API key?
```bash
# Edit .env file
vim .env

# Recreate secret
kubectl delete secret mcp-ui-poc-secrets
./scripts/k8s-create-secret.sh

# Restart pods
kubectl rollout restart deployment/mcp-ui-poc-server
kubectl rollout restart deployment/mcp-ui-poc-client
```

### Clean slate?
```bash
./scripts/k8s-cleanup.sh
./scripts/k8s-deploy.sh
```

## File Structure

```
apps/mcp-ui-poc/
├── scripts/
│   ├── k8s-quickstart.sh       # ⭐ Start here
│   ├── k8s-build.sh
│   ├── k8s-load-minikube.sh
│   ├── k8s-create-secret.sh
│   ├── k8s-deploy.sh
│   ├── k8s-status.sh
│   ├── k8s-logs.sh
│   ├── k8s-rebuild.sh
│   └── k8s-cleanup.sh
├── server/k8s/
│   └── deployment.yaml
├── client/k8s/
│   ├── deployment.yaml
│   ├── configmap.yaml
│   └── ingress.yaml
└── slop-docs/
    ├── KUBERNETES.md            # Full guide
    └── QUICKSTART.md           # This file
```
