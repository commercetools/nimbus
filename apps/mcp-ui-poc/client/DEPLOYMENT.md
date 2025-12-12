# MCP UI POC Client - Deployment Guide

This guide covers deploying the MCP UI POC Client application using Docker and Kubernetes.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Docker Deployment](#docker-deployment)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Configuration](#configuration)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## Overview

The MCP UI POC Client is a React/Vite application served by nginx. It provides a UI for interacting with the MCP server and creating UI components.

**Key Features:**
- React 18 with TypeScript
- Nimbus design system components
- Connects to MCP server via HTTP
- Static file serving with nginx

## Prerequisites

- Docker 20.10+ (for containerization)
- Kubernetes 1.24+ (for Kubernetes deployment)
- kubectl configured for your cluster
- Anthropic API key
- pnpm 9+ (for local builds)

## Docker Deployment

### Building the Image

**IMPORTANT:** This must be built from the **repository root** because the client depends on workspace packages.

```bash
# Build the client image (from repository root)
docker build -f apps/mcp-ui-poc-client/Dockerfile -t mcp-ui-poc-client:latest .
```

The build process:
1. Builds workspace dependencies (nimbus, nimbus-icons, tokens)
2. Builds the client application with Vite
3. Serves static files with nginx

### Running Locally with Docker

```bash
# Run the container
docker run -d \
  --name mcp-ui-poc-client \
  -p 8080:80 \
  mcp-ui-poc-client:latest

# Check logs
docker logs -f mcp-ui-poc-client

# Access the application
# Open http://localhost:8080 in your browser
```

**Note:** The MCP server URL and Anthropic API key are **baked into the build** as environment variables. To change them, you must rebuild the image.

### Using Docker Compose

From the **repository root**:

```bash
# Set your API key
export ANTHROPIC_API_KEY="your-actual-api-key"

# Start all services (client + server)
docker-compose -f docker-compose.mcp-ui-poc.yaml up -d

# View logs
docker-compose -f docker-compose.mcp-ui-poc.yaml logs -f mcp-ui-poc-client

# Access the application
# Open http://localhost:8080 in your browser

# Stop services
docker-compose -f docker-compose.mcp-ui-poc.yaml down
```

## Kubernetes Deployment

### Step 1: Configure Secrets

**IMPORTANT:** Set your Anthropic API key before deploying.

Edit `k8s/configmap.yaml`:

```yaml
stringData:
  ANTHROPIC_API_KEY: "sk-ant-your-actual-api-key-here"
```

**Production Note:** Use proper secret management:
- [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets)
- [External Secrets Operator](https://external-secrets.io/)
- Cloud provider secret managers (AWS Secrets Manager, Azure Key Vault, etc.)

Apply the config:

```bash
kubectl apply -f apps/mcp-ui-poc-client/k8s/configmap.yaml
```

### Step 2: Build and Push Image

**Build with environment variables baked in:**

```bash
# Set environment variables for build
export VITE_MCP_SERVER_URL="http://mcp-ui-poc-server:3001"
export VITE_ANTHROPIC_API_KEY="your-key-here"

# Build the image
docker build \
  --build-arg VITE_MCP_SERVER_URL="${VITE_MCP_SERVER_URL}" \
  --build-arg VITE_ANTHROPIC_API_KEY="${VITE_ANTHROPIC_API_KEY}" \
  -f apps/mcp-ui-poc-client/Dockerfile \
  -t your-registry/mcp-ui-poc-client:v1.0.0 .

# Push to container registry
docker push your-registry/mcp-ui-poc-client:v1.0.0
```

### Step 3: Update Kubernetes Manifests

Edit `k8s/deployment.yaml` and update the image reference:

```yaml
spec:
  containers:
    - name: client
      image: your-registry/mcp-ui-poc-client:v1.0.0  # Update this line
```

### Step 4: Deploy to Kubernetes

```bash
# Deploy the server first
kubectl apply -f apps/mcp-ui-poc-server/k8s/deployment.yaml

# Then deploy the client
kubectl apply -f apps/mcp-ui-poc-client/k8s/deployment.yaml

# Check deployment status
kubectl get deployments mcp-ui-poc-client
kubectl get pods -l app=mcp-ui-poc-client

# Check service
kubectl get service mcp-ui-poc-client

# View logs
kubectl logs -l app=mcp-ui-poc-client -f
```

### Step 5: Set Up Ingress (Optional)

For external access, configure the ingress:

Edit `k8s/ingress.yaml`:

```yaml
spec:
  rules:
    - host: your-domain.com  # Change this to your domain
```

Apply the ingress:

```bash
kubectl apply -f apps/mcp-ui-poc-client/k8s/ingress.yaml

# Check ingress status
kubectl get ingress mcp-ui-poc-ingress
```

### Step 6: Verify Deployment

```bash
# Port-forward to test locally
kubectl port-forward service/mcp-ui-poc-client 8080:80

# Access the application
# Open http://localhost:8080 in your browser
```

## Configuration

### Build-Time Environment Variables

These are baked into the build and cannot be changed at runtime:

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_MCP_SERVER_URL` | `http://localhost:3001` | URL of the MCP server |
| `VITE_ANTHROPIC_API_KEY` | Required | Anthropic API key |

**To change these values, you must rebuild the image.**

### Kubernetes Resources

The default deployment uses:

- **Requests:** 128Mi memory, 100m CPU
- **Limits:** 256Mi memory, 200m CPU
- **Replicas:** 2 (for high availability)

Adjust these in `k8s/deployment.yaml` based on your load.

### Nginx Configuration

The nginx configuration in `nginx.conf` provides:

- **SPA routing:** All routes serve `index.html`
- **Static asset caching:** 1 year for JS/CSS/images
- **Gzip compression:** Enabled for text assets
- **Security headers:** X-Frame-Options, X-Content-Type-Options, etc.

## Monitoring

### Health Checks

```bash
# Check service health
curl http://your-client/

# Should return the index.html page
```

### Kubernetes Monitoring

```bash
# Check pod health
kubectl get pods -l app=mcp-ui-poc-client

# View events
kubectl describe deployment mcp-ui-poc-client

# Check resource usage
kubectl top pods -l app=mcp-ui-poc-client

# Stream logs (nginx access logs)
kubectl logs -l app=mcp-ui-poc-client -f --tail=100
```

### Nginx Access Logs

View nginx logs to monitor requests:

```bash
# View access logs
kubectl logs -l app=mcp-ui-poc-client -f

# Logs show:
# - Request paths
# - Response codes
# - Client IPs
# - Response times
```

## Troubleshooting

### Pod Not Starting

```bash
# Check pod status
kubectl describe pod <pod-name>

# Check logs
kubectl logs <pod-name>

# Common issues:
# 1. Image pull errors - verify image name and registry credentials
# 2. Build failures - check if workspace dependencies built correctly
# 3. Nginx config errors - verify nginx.conf syntax
```

### Cannot Connect to Server

**Symptoms:** API calls fail, MCP connection errors

**Solutions:**

1. **Verify server is running:**
   ```bash
   kubectl get pods -l app=mcp-ui-poc-server
   kubectl get service mcp-ui-poc-server
   ```

2. **Check service discovery:**
   ```bash
   # From client pod, test server connectivity
   kubectl exec -it <client-pod> -- wget -O- http://mcp-ui-poc-server:3001/elements
   ```

3. **Verify VITE_MCP_SERVER_URL:**
   - The URL is baked into the build
   - Rebuild the image if it's incorrect
   - In Kubernetes, use: `http://mcp-ui-poc-server:3001`

### API Key Issues

**Symptoms:** "API key required" errors, authentication failures

**Solutions:**

1. **Verify API key is set:**
   ```bash
   kubectl get secret mcp-ui-poc-secrets -o jsonpath='{.data.ANTHROPIC_API_KEY}' | base64 -d
   ```

2. **Rebuild with correct key:**
   - API key is baked into the build
   - Rebuild image with correct `VITE_ANTHROPIC_API_KEY`

3. **Test API key validity:**
   - Use Anthropic API playground to verify key works

### Static Assets Not Loading

**Symptoms:** Blank page, 404 errors for JS/CSS

**Solutions:**

1. **Check build output:**
   ```bash
   # Exec into container
   kubectl exec -it <client-pod> -- ls -la /usr/share/nginx/html

   # Should see: index.html, assets/, vite.svg
   ```

2. **Verify nginx config:**
   ```bash
   kubectl exec -it <client-pod> -- nginx -t
   ```

3. **Check nginx logs:**
   ```bash
   kubectl logs <client-pod>
   ```

### CORS Errors

**Symptoms:** Browser console shows CORS errors

**Solutions:**

1. **Verify server CORS config:**
   - Server should allow origin of client
   - Check server logs for CORS errors

2. **Use ingress for same-origin:**
   - Configure ingress to route both client and API
   - Avoids CORS issues entirely

## Scaling

### Manual Scaling

```bash
# Scale to 3 replicas
kubectl scale deployment mcp-ui-poc-client --replicas=3

# Verify scaling
kubectl get pods -l app=mcp-ui-poc-client
```

### Horizontal Pod Autoscaling

Create an HPA based on CPU/memory:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: mcp-ui-poc-client-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: mcp-ui-poc-client
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

**Note:** Nginx is very lightweight, so you may need many requests before scaling kicks in.

## Security Considerations

1. **API Key Security:**
   - Never commit API keys to git
   - Use proper secret management in production
   - Rotate keys regularly

2. **Content Security Policy:**
   - Add CSP headers to nginx config
   - Restrict script sources

3. **HTTPS:**
   - Use TLS/SSL in production
   - Configure cert-manager for automatic certificates

4. **Network Policies:**
   - Restrict pod-to-pod communication
   - Only allow client → server traffic

5. **Image Security:**
   - Scan images for vulnerabilities
   - Use minimal base images
   - Keep dependencies updated

## Rollback

```bash
# View deployment history
kubectl rollout history deployment/mcp-ui-poc-client

# Rollback to previous version
kubectl rollout undo deployment/mcp-ui-poc-client

# Rollback to specific revision
kubectl rollout undo deployment/mcp-ui-poc-client --to-revision=2
```

## Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [React Deployment Best Practices](https://create-react-app.dev/docs/deployment/)
