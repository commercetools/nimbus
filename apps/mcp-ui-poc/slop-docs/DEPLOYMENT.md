# MCP UI POC Server - Deployment Guide

This guide covers deploying the MCP UI POC Server application using Docker and Kubernetes.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Docker Deployment](#docker-deployment)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Configuration](#configuration)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## Overview

The MCP UI POC Server is a Node.js/Express application that provides MCP (Model Context Protocol) endpoints for creating UI components. It runs on port 3001 by default.

**Key Features:**
- MCP protocol support via HTTP streaming
- Express REST API
- Health check endpoint at `/elements`
- Stateless design (suitable for horizontal scaling)

## Prerequisites

- Docker 20.10+ (for containerization)
- Kubernetes 1.24+ (for Kubernetes deployment)
- kubectl configured for your cluster
- pnpm 9+ (for local builds)

## Docker Deployment

### Building the Image

From the **repository root**:

```bash
# Build the server image
docker build -f apps/mcp-ui-poc-server/Dockerfile -t mcp-ui-poc-server:latest .
```

### Running Locally with Docker

```bash
# Run the container
docker run -d \
  --name mcp-ui-poc-server \
  -p 3001:3001 \
  -e NODE_ENV=production \
  mcp-ui-poc-server:latest

# Check logs
docker logs -f mcp-ui-poc-server

# Test the service
curl http://localhost:3001/elements
```

### Using Docker Compose

From the **repository root**:

```bash
# Start all services (server + client)
docker-compose -f docker-compose.mcp-ui-poc.yaml up -d

# View logs
docker-compose -f docker-compose.mcp-ui-poc.yaml logs -f mcp-ui-poc-server

# Stop services
docker-compose -f docker-compose.mcp-ui-poc.yaml down
```

## Kubernetes Deployment

### Step 1: Build and Push Image

```bash
# Build the image
docker build -f apps/mcp-ui-poc-server/Dockerfile -t your-registry/mcp-ui-poc-server:v1.0.0 .

# Push to container registry
docker push your-registry/mcp-ui-poc-server:v1.0.0
```

### Step 2: Update Kubernetes Manifests

Edit `k8s/deployment.yaml` and update the image reference:

```yaml
spec:
  containers:
    - name: server
      image: your-registry/mcp-ui-poc-server:v1.0.0  # Update this line
```

### Step 3: Deploy to Kubernetes

```bash
# Apply the deployment
kubectl apply -f apps/mcp-ui-poc-server/k8s/deployment.yaml

# Check deployment status
kubectl get deployments mcp-ui-poc-server
kubectl get pods -l app=mcp-ui-poc-server

# Check service
kubectl get service mcp-ui-poc-server

# View logs
kubectl logs -l app=mcp-ui-poc-server -f
```

### Step 4: Verify Deployment

```bash
# Port-forward to test locally
kubectl port-forward service/mcp-ui-poc-server 3001:3001

# Test the service
curl http://localhost:3001/elements
```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Node environment |
| `PORT` | `3001` | Port to listen on |

### Kubernetes Resources

The default deployment uses:

- **Requests:** 256Mi memory, 250m CPU
- **Limits:** 512Mi memory, 500m CPU
- **Replicas:** 2 (for high availability)

Adjust these in `k8s/deployment.yaml` based on your load:

```yaml
resources:
  requests:
    memory: "512Mi"  # Increase if needed
    cpu: "500m"
  limits:
    memory: "1Gi"
    cpu: "1000m"
```

### Health Checks

The deployment includes:

- **Liveness Probe:** `/elements` endpoint, checks every 30s
- **Readiness Probe:** `/elements` endpoint, checks every 10s

## Monitoring

### Health Check Endpoint

```bash
# Check service health
curl http://your-server:3001/elements

# Should return JSON with available elements
```

### Kubernetes Monitoring

```bash
# Check pod health
kubectl get pods -l app=mcp-ui-poc-server

# View events
kubectl describe deployment mcp-ui-poc-server

# Check resource usage
kubectl top pods -l app=mcp-ui-poc-server

# Stream logs
kubectl logs -l app=mcp-ui-poc-server -f --tail=100
```

### Metrics

Consider adding:
- Prometheus metrics endpoint
- Application Performance Monitoring (APM)
- Error tracking (e.g., Sentry)

## Troubleshooting

### Pod Not Starting

```bash
# Check pod status
kubectl describe pod <pod-name>

# Check logs
kubectl logs <pod-name>

# Common issues:
# 1. Image pull errors - verify image name and registry credentials
# 2. Resource limits - check if cluster has available resources
# 3. Configuration errors - verify environment variables
```

### Service Not Accessible

```bash
# Check service endpoints
kubectl get endpoints mcp-ui-poc-server

# Verify pod is running and ready
kubectl get pods -l app=mcp-ui-poc-server

# Test from within cluster
kubectl run test-pod --rm -it --image=curlimages/curl -- curl http://mcp-ui-poc-server:3001/elements
```

### High Memory/CPU Usage

```bash
# Check current usage
kubectl top pods -l app=mcp-ui-poc-server

# Adjust resources in deployment.yaml
# Then apply changes:
kubectl apply -f apps/mcp-ui-poc-server/k8s/deployment.yaml
```

### Connection Issues from Client

1. Verify server is running: `kubectl get pods -l app=mcp-ui-poc-server`
2. Check service DNS: `kubectl get service mcp-ui-poc-server`
3. Verify network policies allow traffic
4. Check ingress configuration if using external access

## Scaling

### Manual Scaling

```bash
# Scale to 3 replicas
kubectl scale deployment mcp-ui-poc-server --replicas=3

# Verify scaling
kubectl get pods -l app=mcp-ui-poc-server
```

### Horizontal Pod Autoscaling

Create an HPA:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: mcp-ui-poc-server-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: mcp-ui-poc-server
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

Apply with:

```bash
kubectl apply -f hpa.yaml
```

## Security Considerations

1. **Run as non-root user** - Update Dockerfile if needed
2. **Network policies** - Restrict traffic to/from pods
3. **Resource limits** - Prevent resource exhaustion
4. **Secret management** - Use Kubernetes secrets for sensitive data
5. **Image scanning** - Scan images for vulnerabilities before deployment

## Rollback

```bash
# View deployment history
kubectl rollout history deployment/mcp-ui-poc-server

# Rollback to previous version
kubectl rollout undo deployment/mcp-ui-poc-server

# Rollback to specific revision
kubectl rollout undo deployment/mcp-ui-poc-server --to-revision=2
```

## Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
