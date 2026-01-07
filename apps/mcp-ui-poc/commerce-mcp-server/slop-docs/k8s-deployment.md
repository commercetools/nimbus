# Commerce MCP Server - Kubernetes Deployment

This directory contains Kubernetes configuration files for deploying the Commerce MCP Server to Google Kubernetes Engine (GKE).

## Prerequisites

1. GKE cluster running
2. `kubectl` configured to connect to your cluster
3. commercetools API credentials
4. Docker image built and pushed to Google Artifact Registry

## Configuration Files

- `deployment.yaml` - Deployment and Service configuration
- `ingress.yaml` - LoadBalancer service for external access
- `backend-config.yaml` - Backend configuration for health checks and IAP (located in ../client/k8s/)

## Setup Steps

### 1. Create Kubernetes Secret for commercetools Credentials

Create a Kubernetes secret with your commercetools credentials:

```bash
kubectl create secret generic commerce-mcp-credentials \
  --from-literal=client-id='YOUR_CLIENT_ID' \
  --from-literal=client-secret='YOUR_CLIENT_SECRET' \
  --from-literal=project-key='YOUR_PROJECT_KEY' \
  --from-literal=auth-url='https://auth.europe-west1.gcp.commercetools.com' \
  --from-literal=api-url='https://api.europe-west1.gcp.commercetools.com'
```

**Note:** Adjust the auth-url and api-url based on your commercetools region.

### 2. Build and Push Docker Image

From the commerce-mcp-server directory:

```bash
# Build the image
docker build -t us-east1-docker.pkg.dev/ctp-playground/byron-wall/mcp-ui-poc-commerce-server:latest .

# Push to Artifact Registry
docker push us-east1-docker.pkg.dev/ctp-playground/byron-wall/mcp-ui-poc-commerce-server:latest
```

### 3. Apply Backend Config

Apply the backend configuration (if not already applied):

```bash
kubectl apply -f ../client/k8s/backend-config.yaml
```

### 4. Deploy the Service

```bash
kubectl apply -f deployment.yaml
kubectl apply -f ingress.yaml
```

### 5. Verify Deployment

Check the deployment status:

```bash
# Check pods
kubectl get pods -l app=mcp-ui-poc-commerce-server

# Check service
kubectl get svc mcp-ui-poc-commerce-server

# Check load balancer (may take a few minutes to get external IP)
kubectl get svc mcp-ui-poc-commerce-server-loadbalancer

# View logs
kubectl logs -l app=mcp-ui-poc-commerce-server -f
```

### 6. Get External IP

Once the load balancer is ready:

```bash
kubectl get svc mcp-ui-poc-commerce-server-loadbalancer -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

## Environment Variables

The deployment uses the following environment variables (set via Kubernetes secret):

- `CT_CLIENT_ID` - commercetools OAuth client ID
- `CT_CLIENT_SECRET` - commercetools OAuth client secret
- `CT_PROJECT_KEY` - commercetools project key
- `CT_AUTH_URL` - commercetools authentication URL
- `CT_API_URL` - commercetools API URL
- `COMMERCE_MCP_PORT` - Server port (default: 8888)

## Health Checks

The service includes both liveness and readiness probes:

- **Path:** `/mcp`
- **Port:** 8888
- **Initial Delay:** 5-10 seconds
- **Check Interval:** 10-30 seconds

## Resource Limits

- **Requests:** 256Mi memory, 250m CPU
- **Limits:** 512Mi memory, 500m CPU

Adjust these based on your load requirements.

## Session Affinity

The service is configured with:
- **Session Affinity:** ClientIP
- **Timeout:** 10800 seconds (3 hours)

This ensures MCP sessions are routed to the same pod.

## Security

- IAP (Identity-Aware Proxy) is enabled via backend configuration
- All commercetools credentials are stored in Kubernetes secrets
- The service runs with minimal privileges

## Troubleshooting

### Pod not starting

```bash
kubectl describe pod -l app=mcp-ui-poc-commerce-server
kubectl logs -l app=mcp-ui-poc-commerce-server
```

### Secret issues

Verify the secret exists and has the correct keys:

```bash
kubectl get secret commerce-mcp-credentials
kubectl describe secret commerce-mcp-credentials
```

### Health check failures

Test the health endpoint directly:

```bash
kubectl port-forward svc/mcp-ui-poc-commerce-server 8888:8888
curl http://localhost:8888/mcp
```

## Scaling

To scale the deployment:

```bash
kubectl scale deployment mcp-ui-poc-commerce-server --replicas=3
```

**Note:** Session storage should be implemented before scaling beyond 1 replica.

## Updating

To update the deployment with a new image:

```bash
# Build and push new image
docker build -t us-east1-docker.pkg.dev/ctp-playground/byron-wall/mcp-ui-poc-commerce-server:latest .
docker push us-east1-docker.pkg.dev/ctp-playground/byron-wall/mcp-ui-poc-commerce-server:latest

# Restart deployment to pull new image
kubectl rollout restart deployment mcp-ui-poc-commerce-server

# Monitor rollout
kubectl rollout status deployment mcp-ui-poc-commerce-server
```

## Cleanup

To remove the deployment:

```bash
kubectl delete -f ingress.yaml
kubectl delete -f deployment.yaml
kubectl delete secret commerce-mcp-credentials
```
