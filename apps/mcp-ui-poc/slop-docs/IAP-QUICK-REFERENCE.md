# IAP Quick Reference

Quick reference for common IAP operations.

## Prerequisites Check

```bash
# Check current GCP project
gcloud config get-value project

# Check cluster context
kubectl config current-context

# Get cluster credentials
gcloud container clusters get-credentials CLUSTER_NAME --region REGION
```

## OAuth Credentials

```bash
# List OAuth brands
gcloud iap oauth-brands list

# Create OAuth client
gcloud iap oauth-clients create BRAND_NAME \
  --display_name="MCP UI POC IAP Client"

# List OAuth clients
gcloud iap oauth-clients list BRAND_NAME
```

## Kubernetes Secret

```bash
# Create OAuth secret
kubectl create secret generic mcp-ui-poc-oauth-secret \
  --from-literal=client_id=YOUR_CLIENT_ID \
  --from-literal=client_secret=YOUR_CLIENT_SECRET

# View secret (encoded)
kubectl get secret mcp-ui-poc-oauth-secret -o yaml

# Update secret
kubectl create secret generic mcp-ui-poc-oauth-secret \
  --from-literal=client_id=NEW_CLIENT_ID \
  --from-literal=client_secret=NEW_CLIENT_SECRET \
  --dry-run=client -o yaml | kubectl apply -f -
```

## Static IP

```bash
# Reserve static IP
gcloud compute addresses create mcp-ui-poc-ip --global

# Get IP address
gcloud compute addresses describe mcp-ui-poc-ip --global

# List all static IPs
gcloud compute addresses list --global

# Delete static IP
gcloud compute addresses delete mcp-ui-poc-ip --global
```

## Deployment

```bash
# Deploy all resources
kubectl apply -f client/k8s/backend-config.yaml
kubectl apply -f server/k8s/deployment.yaml
kubectl apply -f client/k8s/deployment.yaml
kubectl apply -f client/k8s/ingress.yaml

# Check deployment status
kubectl get pods -l 'app in (mcp-ui-poc-client, mcp-ui-poc-server)'
kubectl get svc -l 'app in (mcp-ui-poc-client, mcp-ui-poc-server)'
kubectl get ingress mcp-ui-poc-ingress
kubectl get backendconfig

# Watch ingress until IP is assigned
kubectl get ingress mcp-ui-poc-ingress -w
```

## IAP Access Control

```bash
# Grant access to a user
gcloud iap web add-iam-policy-binding \
  --resource-type=backend-service \
  --service=mcp-ui-poc-client \
  --member=user:user@example.com \
  --role=roles/iap.httpsResourceAccessor

# Grant access to a group
gcloud iap web add-iam-policy-binding \
  --resource-type=backend-service \
  --service=mcp-ui-poc-client \
  --member=group:team@example.com \
  --role=roles/iap.httpsResourceAccessor

# Revoke access from a user
gcloud iap web remove-iam-policy-binding \
  --resource-type=backend-service \
  --service=mcp-ui-poc-client \
  --member=user:user@example.com \
  --role=roles/iap.httpsResourceAccessor

# List all IAP access
gcloud iap web get-iam-policy \
  --resource-type=backend-service \
  --service=mcp-ui-poc-client
```

## Enable/Disable IAP

```bash
# Enable IAP (via console or CLI)
gcloud iap web enable \
  --resource-type=backend-service \
  --service=mcp-ui-poc-client \
  --oauth2-client-id=YOUR_CLIENT_ID \
  --oauth2-client-secret=YOUR_CLIENT_SECRET

# Check IAP status
gcloud iap web get-iam-policy \
  --resource-type=backend-service \
  --service=mcp-ui-poc-client
```

## Certificate Management

### Using cert-manager

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Check cert-manager status
kubectl get pods -n cert-manager

# Create ClusterIssuer
kubectl apply -f - <<EOF
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

# Check certificate status
kubectl get certificate
kubectl describe certificate mcp-ui-poc-tls
```

### Using Google Managed Certificates

```bash
# Apply managed certificate
kubectl apply -f client/k8s/managed-certificate.yaml

# Check certificate status
kubectl get managedcertificate
kubectl describe managedcertificate mcp-ui-poc-cert

# View certificate provisioning progress
kubectl get managedcertificate mcp-ui-poc-cert -o yaml
```

## Troubleshooting

### Check Pod Logs

```bash
# Client logs
kubectl logs -l app=mcp-ui-poc-client --tail=100 -f

# Server logs
kubectl logs -l app=mcp-ui-poc-server --tail=100 -f

# Previous pod logs (if pod crashed)
kubectl logs -l app=mcp-ui-poc-client --previous
```

### Check Ingress Status

```bash
# Detailed ingress info
kubectl describe ingress mcp-ui-poc-ingress

# Check ingress events
kubectl get events --sort-by='.lastTimestamp' | grep ingress

# Get ingress YAML
kubectl get ingress mcp-ui-poc-ingress -o yaml
```

### Check BackendConfig

```bash
# Describe BackendConfig
kubectl describe backendconfig mcp-ui-poc-backend-config

# Verify service annotations
kubectl get svc mcp-ui-poc-client -o yaml | grep -A 5 annotations
```

### Check Load Balancer

```bash
# List GCP load balancers
gcloud compute backend-services list

# Describe backend service
gcloud compute backend-services describe mcp-ui-poc-client --global

# Check health of backends
gcloud compute backend-services get-health mcp-ui-poc-client --global
```

### IAP Access Logs

```bash
# View IAP access attempts
gcloud logging read "resource.type=k8s_cluster AND protoPayload.authenticationInfo.principalEmail:*" \
  --limit 50 \
  --format json

# View recent IAP denials
gcloud logging read "resource.type=k8s_cluster AND protoPayload.status.code=7" \
  --limit 20 \
  --format json

# Follow logs in real-time
gcloud logging tail "resource.type=k8s_cluster" --format json
```

## DNS Verification

```bash
# Check DNS resolution
dig mcp-ui-poc.example.com +short

# Check from specific DNS server
dig @8.8.8.8 mcp-ui-poc.example.com

# Trace DNS path
dig mcp-ui-poc.example.com +trace
```

## Testing Access

```bash
# Test without authentication (should redirect to OAuth)
curl -v https://mcp-ui-poc.example.com/

# Check HTTP headers
curl -I https://mcp-ui-poc.example.com/

# Test API endpoint
curl -v https://mcp-ui-poc.example.com/api/elements
```

## Cleanup

```bash
# Delete all application resources
kubectl delete -f client/k8s/ingress.yaml
kubectl delete -f client/k8s/deployment.yaml
kubectl delete -f server/k8s/deployment.yaml
kubectl delete -f client/k8s/backend-config.yaml

# Delete OAuth secret
kubectl delete secret mcp-ui-poc-oauth-secret

# Delete static IP
gcloud compute addresses delete mcp-ui-poc-ip --global

# Remove IAP access for all users
gcloud iap web remove-iam-policy-binding \
  --resource-type=backend-service \
  --service=mcp-ui-poc-client \
  --member=user:user@example.com \
  --role=roles/iap.httpsResourceAccessor
```

## Common Issues

### Issue: "Access Denied" after OAuth

```bash
# Check IAP policy
gcloud iap web get-iam-policy \
  --resource-type=backend-service \
  --service=mcp-ui-poc-client

# Add yourself
gcloud iap web add-iam-policy-binding \
  --resource-type=backend-service \
  --service=mcp-ui-poc-client \
  --member=user:your-email@example.com \
  --role=roles/iap.httpsResourceAccessor
```

### Issue: Certificate not provisioning

```bash
# Check certificate status
kubectl describe certificate mcp-ui-poc-tls

# Check cert-manager logs
kubectl logs -n cert-manager -l app=cert-manager --tail=100

# Verify DNS points to load balancer IP
INGRESS_IP=$(kubectl get ingress mcp-ui-poc-ingress -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
echo "Ingress IP: $INGRESS_IP"
dig mcp-ui-poc.example.com +short
```

### Issue: Health checks failing

```bash
# Check pod health
kubectl get pods -l app=mcp-ui-poc-client

# Test health endpoint locally
kubectl port-forward svc/mcp-ui-poc-client 8080:80
curl http://localhost:8080/

# Check BackendConfig health settings
kubectl get backendconfig mcp-ui-poc-backend-config -o yaml
```

## Useful Links

- [IAP Console](https://console.cloud.google.com/security/iap)
- [Load Balancers Console](https://console.cloud.google.com/net-services/loadbalancing)
- [Certificates Console](https://console.cloud.google.com/net-services/loadbalancing/advanced/sslCertificates)
- [Static IPs Console](https://console.cloud.google.com/networking/addresses)
- [OAuth Credentials Console](https://console.cloud.google.com/apis/credentials)
