# Identity Aware Proxy (IAP) Setup Guide

This guide walks through setting up Google Cloud Identity-Aware Proxy (IAP) for the MCP UI POC application on Google Kubernetes Engine (GKE).

## Overview

Identity-Aware Proxy (IAP) provides:
- **Authentication**: Secure access control via Google accounts or Cloud Identity
- **Authorization**: Fine-grained access control based on user identity
- **Zero Trust Security**: Verify user identity before granting access
- **No VPN Required**: Secure access without traditional VPN infrastructure

## Prerequisites

1. **Google Cloud Platform Account** with billing enabled
2. **GKE Cluster** running (not Minikube)
3. **Domain Name** with DNS configured to point to your cluster
4. **gcloud CLI** installed and configured
5. **kubectl** configured for your GKE cluster

## Architecture

```
User → IAP (OAuth) → Load Balancer → Ingress → Services → Pods
                                     ↓
                                BackendConfig
                                     ↓
                               IAP Settings
```

## Step-by-Step Setup

### 1. Set Up GCP Project and Environment Variables

```bash
# Set your project ID
export PROJECT_ID="your-gcp-project-id"
export CLUSTER_NAME="your-cluster-name"
export REGION="us-central1"
export DOMAIN="mcp-ui-poc.example.com"

# Configure gcloud
gcloud config set project $PROJECT_ID
gcloud config set compute/region $REGION

# Get cluster credentials
gcloud container clusters get-credentials $CLUSTER_NAME --region $REGION
```

### 2. Create OAuth Consent Screen

1. Go to [GCP Console > APIs & Services > OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent)
2. Choose **Internal** (for organization users) or **External** (for public access)
3. Fill in required fields:
   - App name: `MCP UI POC`
   - User support email: Your email
   - Developer contact: Your email
4. Add scopes (optional):
   - `email`
   - `profile`
   - `openid`
5. Click **Save and Continue**

### 3. Create OAuth 2.0 Client ID

```bash
# Create OAuth client credentials
gcloud iap oauth-brands create \
  --application_title="MCP UI POC" \
  --support_email="your-email@example.com"

# List brands to get the brand name
gcloud iap oauth-brands list

# Create OAuth client (replace BRAND_NAME with output from previous command)
gcloud iap oauth-clients create BRAND_NAME \
  --display_name="MCP UI POC IAP Client"

# This will output:
# - Client ID (e.g., 123456789-abc.apps.googleusercontent.com)
# - Client Secret (e.g., GOCSPX-xxxxx)

# Save these values - you'll need them next
export OAUTH_CLIENT_ID="your-client-id"
export OAUTH_CLIENT_SECRET="your-client-secret"
```

### 4. Create Kubernetes Secret for OAuth Credentials

```bash
# Navigate to the mcp-ui-poc directory
cd apps/mcp-ui-poc

# Create the OAuth secret
kubectl create secret generic mcp-ui-poc-oauth-secret \
  --from-literal=client_id=$OAUTH_CLIENT_ID \
  --from-literal=client_secret=$OAUTH_CLIENT_SECRET \
  --dry-run=client -o yaml | kubectl apply -f -

# Verify the secret was created
kubectl get secret mcp-ui-poc-oauth-secret
```

### 5. Reserve a Static IP Address

```bash
# Reserve a global static IP
gcloud compute addresses create mcp-ui-poc-ip \
  --global \
  --ip-version IPV4

# Get the IP address
gcloud compute addresses describe mcp-ui-poc-ip --global

# Update your DNS records to point to this IP
# Add an A record: mcp-ui-poc.example.com → <STATIC_IP>
```

### 6. Update Kubernetes Configuration

Update the ingress to use the static IP:

```bash
# Edit client/k8s/ingress.yaml
# Uncomment and update the static IP annotation:
# kubernetes.io/ingress.global-static-ip-name: "mcp-ui-poc-ip"
```

### 7. Install cert-manager (for TLS certificates)

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Wait for cert-manager to be ready
kubectl wait --for=condition=ready pod -l app.kubernetes.io/instance=cert-manager -n cert-manager --timeout=180s

# Create ClusterIssuer for Let's Encrypt
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: gce
EOF
```

### 8. Deploy the Application

```bash
# Navigate to mcp-ui-poc directory
cd apps/mcp-ui-poc

# Deploy BackendConfig (IAP configuration)
kubectl apply -f client/k8s/backend-config.yaml

# Deploy server and client
kubectl apply -f server/k8s/deployment.yaml
kubectl apply -f client/k8s/deployment.yaml

# Deploy ingress
kubectl apply -f client/k8s/ingress.yaml

# Wait for the ingress to get an IP
kubectl get ingress mcp-ui-poc-ingress -w
```

### 9. Enable IAP in GCP Console

1. Go to [GCP Console > Security > Identity-Aware Proxy](https://console.cloud.google.com/security/iap)
2. Find your backend services (`mcp-ui-poc-client` and `mcp-ui-poc-server`)
3. Toggle IAP **ON** for each service
4. The OAuth client should be automatically associated

### 10. Configure IAP Access Control

```bash
# Grant IAP access to specific users
gcloud iap web add-iam-policy-binding \
  --resource-type=backend-service \
  --service=mcp-ui-poc-client \
  --member=user:user@example.com \
  --role=roles/iap.httpsResourceAccessor

# For the server backend
gcloud iap web add-iam-policy-binding \
  --resource-type=backend-service \
  --service=mcp-ui-poc-server \
  --member=user:user@example.com \
  --role=roles/iap.httpsResourceAccessor

# Grant access to a group
gcloud iap web add-iam-policy-binding \
  --resource-type=backend-service \
  --service=mcp-ui-poc-client \
  --member=group:team@example.com \
  --role=roles/iap.httpsResourceAccessor
```

## Verification

### 1. Check Deployment Status

```bash
# Check pods
kubectl get pods

# Check services
kubectl get svc

# Check ingress
kubectl get ingress mcp-ui-poc-ingress

# Check backend config
kubectl get backendconfig
```

### 2. Test Access

1. Open your browser and navigate to `https://mcp-ui-poc.example.com`
2. You should be redirected to Google Sign-In
3. After authentication, you should see the application
4. Test the API endpoint: `https://mcp-ui-poc.example.com/api/elements`

### 3. View IAP Logs

```bash
# View IAP access logs
gcloud logging read "resource.type=k8s_cluster" \
  --limit 50 \
  --format json \
  --project=$PROJECT_ID
```

## Troubleshooting

### Issue: IAP shows "Access Denied"

**Solution:**
```bash
# Verify IAM bindings
gcloud iap web get-iam-policy \
  --resource-type=backend-service \
  --service=mcp-ui-poc-client

# Add yourself as an authorized user
gcloud iap web add-iam-policy-binding \
  --resource-type=backend-service \
  --service=mcp-ui-poc-client \
  --member=user:your-email@example.com \
  --role=roles/iap.httpsResourceAccessor
```

### Issue: Ingress not getting IP address

**Solution:**
```bash
# Check ingress events
kubectl describe ingress mcp-ui-poc-ingress

# Check if BackendConfig is applied
kubectl describe backendconfig mcp-ui-poc-backend-config

# Verify service annotations
kubectl get svc mcp-ui-poc-client -o yaml | grep annotations -A 5
```

### Issue: Certificate not provisioning

**Solution:**
```bash
# Check certificate status
kubectl describe certificate mcp-ui-poc-tls

# Check cert-manager logs
kubectl logs -n cert-manager -l app=cert-manager

# Verify DNS is pointing to the static IP
dig mcp-ui-poc.example.com +short
```

### Issue: Backend health checks failing

**Solution:**
```bash
# Check pod logs
kubectl logs -l app=mcp-ui-poc-client
kubectl logs -l app=mcp-ui-poc-server

# Verify health check endpoints
kubectl port-forward svc/mcp-ui-poc-client 8080:80
curl http://localhost:8080/

# Check BackendConfig health check settings
kubectl describe backendconfig mcp-ui-poc-backend-config
```

### Issue: IAP not redirecting properly

**Solution:**
```bash
# Verify OAuth client is correctly configured
gcloud iap oauth-clients list BRAND_NAME

# Check if secret has correct values
kubectl get secret mcp-ui-poc-oauth-secret -o yaml

# Verify service annotations
kubectl get svc -o yaml | grep -A 10 "cloud.google.com/backend-config"
```

## Advanced Configuration

### Custom IAP Access Policies

Create fine-grained access control:

```bash
# Allow access only from specific IP ranges
gcloud iap web set-iam-policy backend-service \
  --service=mcp-ui-poc-client \
  policy.yaml
```

Example `policy.yaml`:
```yaml
bindings:
- members:
  - user:admin@example.com
  role: roles/iap.httpsResourceAccessor
  condition:
    title: "IP restriction"
    description: "Allow access only from office IP"
    expression: 'origin.ip == "203.0.113.0/24"'
```

### Custom OAuth Brand Settings

Configure additional OAuth settings in GCP Console:
1. Go to **APIs & Services > Credentials**
2. Edit OAuth 2.0 Client ID
3. Add authorized redirect URIs:
   - `https://mcp-ui-poc.example.com/_gcp_gatekeeper/authenticate`

### Session Duration

Configure IAP session duration:

```bash
# Set session duration to 12 hours (max: 24 hours)
gcloud iap web set-iam-policy backend-service \
  --service=mcp-ui-poc-client \
  --iap-session-duration=43200s
```

## Security Best Practices

1. **Use Internal OAuth**: Choose "Internal" for corporate users
2. **Principle of Least Privilege**: Grant IAP access only to required users
3. **Monitor Access Logs**: Regularly review IAP access logs
4. **Rotate OAuth Secrets**: Periodically rotate OAuth client secrets
5. **Use Groups**: Manage access via Google Groups for easier administration
6. **Enable Binary Authorization**: Add additional pod-level security
7. **Network Policies**: Restrict pod-to-pod communication
8. **Secrets Management**: Use Google Secret Manager for sensitive data

## Cost Considerations

IAP usage costs:
- **Free tier**: Up to 100,000 verifications/month
- **Beyond free tier**: $0.011 per 1,000 verifications

Additional GCP costs:
- Load balancer: ~$18/month
- Egress bandwidth
- Certificate management (cert-manager is free)

## Maintenance

### Updating OAuth Credentials

```bash
# Update the secret with new credentials
kubectl create secret generic mcp-ui-poc-oauth-secret \
  --from-literal=client_id=$NEW_OAUTH_CLIENT_ID \
  --from-literal=client_secret=$NEW_OAUTH_CLIENT_SECRET \
  --dry-run=client -o yaml | kubectl apply -f -

# Restart deployments to pick up new secret
kubectl rollout restart deployment/mcp-ui-poc-client
kubectl rollout restart deployment/mcp-ui-poc-server
```

### Monitoring IAP Status

```bash
# Check IAP status
gcloud iap web get-iam-policy \
  --resource-type=backend-service \
  --service=mcp-ui-poc-client

# View access attempts
gcloud logging read "protoPayload.authenticationInfo.principalEmail:*" \
  --limit 50 \
  --format json
```

## References

- [Google Cloud IAP Documentation](https://cloud.google.com/iap/docs)
- [IAP for GKE](https://cloud.google.com/iap/docs/enabling-kubernetes-howto)
- [BackendConfig API](https://cloud.google.com/kubernetes-engine/docs/how-to/ingress-features)
- [cert-manager Documentation](https://cert-manager.io/docs/)

## Support

For issues or questions:
1. Check [GCP IAP Troubleshooting](https://cloud.google.com/iap/docs/troubleshooting)
2. Review [GKE Ingress Documentation](https://cloud.google.com/kubernetes-engine/docs/concepts/ingress)
3. Check application logs: `kubectl logs -l app=mcp-ui-poc-client`
