# Basic Authentication Setup for MCP UI Client

This guide explains how to set up nginx basic authentication for the MCP UI client instead of using Google IAP.

## Overview

The client uses nginx's built-in basic authentication to protect access. Credentials are stored in an htpasswd file and mounted into the nginx container via Kubernetes secret.

## Setup Steps

### 1. Create htpasswd Credentials

Run the script to generate a password file:

```bash
cd /Users/byronwall/workspaces/ct/nimbus/apps/mcp-ui-poc
./scripts/create-htpasswd.sh
```

This will prompt you for:
- Username (default: admin)
- Password

The script creates `client/.htpasswd` with bcrypt-hashed credentials.

**Example output:**
```
🔐 Creating htpasswd file for nginx basic authentication

Enter username [admin]: admin
Enter password for user 'admin':
Re-type password for user 'admin':
Adding password for user admin

✅ htpasswd file created: client/.htpasswd
```

### 2. Create Kubernetes Secret

Create the secret from the htpasswd file:

```bash
./scripts/create-auth-secret.sh
```

This creates a Kubernetes secret named `mcp-ui-poc-auth` with your credentials.

**Note:** The htpasswd file is NOT included in the Docker image. It's mounted at runtime via the secret for security.

### 3. Build and Push Docker Image

Build the client image with the updated nginx config:

```bash
# Build for linux/amd64
./scripts/k8s-build.sh

# Push to Google Artifact Registry
./scripts/k8s-push-to-gcr.sh
```

### 4. Deploy to Kubernetes

Deploy the updated client with authentication:

```bash
kubectl apply -f client/k8s/deployment.yaml
```

Wait for the rollout to complete:

```bash
kubectl rollout status deployment/mcp-ui-poc-client
```

### 5. Test Access

Access your application at: `https://nimbus-mcp-ui.playground.europe-west1.gcp.escemo.com`

You should see a browser login prompt with:
- Realm: "MCP UI Access"
- Username: (what you set in step 1)
- Password: (what you set in step 1)

## Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTPS (cert-manager)
       │
┌──────▼────────────────────────┐
│    GKE Ingress                │
│  (Load Balancer + TLS)        │
└──────┬────────────────────────┘
       │
┌──────▼────────────────────────┐
│  mcp-ui-poc-client Service    │
└──────┬────────────────────────┘
       │
┌──────▼────────────────────────┐
│   nginx Container             │
│   ┌─────────────────────┐    │
│   │ Basic Auth Check    │    │
│   │ (htpasswd file)     │    │
│   └─────────┬───────────┘    │
│             ▼                 │
│   ┌─────────────────────┐    │
│   │  Static Files       │    │
│   │  (React SPA)        │    │
│   └─────────────────────┘    │
└───────────────────────────────┘
```

## Files Modified

1. **client/nginx.conf** - Added `auth_basic` directives
2. **client/Dockerfile** - Optional copy of htpasswd (not used in k8s)
3. **client/k8s/deployment.yaml** - Added volume mount for secret
4. **client/k8s/backend-config.yaml** - Disabled IAP

## Updating Credentials

To change the password:

```bash
# 1. Recreate htpasswd file
./scripts/create-htpasswd.sh

# 2. Update the Kubernetes secret
./scripts/create-auth-secret.sh

# 3. Restart pods to pick up new secret
kubectl rollout restart deployment/mcp-ui-poc-client
```

**Note:** No need to rebuild the Docker image when changing credentials.

## Multiple Users

To add multiple users to the htpasswd file:

```bash
# Add additional users (without -c flag to append)
htpasswd -B client/.htpasswd newuser

# Then update the secret
./scripts/create-auth-secret.sh

# Restart pods
kubectl rollout restart deployment/mcp-ui-poc-client
```

## Troubleshooting

### 401 Unauthorized Error

**Problem:** Browser shows 401 error immediately without prompting for credentials.

**Solution:**
1. Check secret exists: `kubectl get secret mcp-ui-poc-auth`
2. Verify secret is mounted: `kubectl describe pod -l app=mcp-ui-poc-client`
3. Check nginx logs: `kubectl logs -l app=mcp-ui-poc-client`

### Authentication Loop

**Problem:** Browser keeps prompting for credentials even with correct password.

**Solution:**
1. Verify htpasswd format: `cat client/.htpasswd` (should use bcrypt: `$2y$`)
2. Check for whitespace/newlines in htpasswd file
3. Ensure username matches exactly (case-sensitive)

### Secret Not Found Error

**Problem:** Pods fail to start with "secret not found" error.

**Solution:**
```bash
# Check if secret exists
kubectl get secret mcp-ui-poc-auth

# If not, create it
./scripts/create-auth-secret.sh
```

### Health Check Failing

**Problem:** Health checks fail because they're blocked by authentication.

**Solution:** The health check is configured to use the root path `/` which requires authentication. To exclude health checks:

```nginx
# Add to nginx.conf before the main location block
location = /health {
    auth_basic off;
    return 200 "OK";
}
```

Then update the health check in deployment.yaml to use `/health`.

## Security Notes

1. **HTTPS Required:** Always use HTTPS in production. Basic auth over HTTP sends credentials in clear text (base64).

2. **Strong Passwords:** Use strong passwords with bcrypt hashing (enabled by default with `-B` flag).

3. **Credential Storage:** The htpasswd file is:
   - NOT committed to git (in .gitignore)
   - NOT baked into Docker image
   - Stored as Kubernetes secret
   - Mounted read-only at runtime

4. **Credential Rotation:** Rotate passwords periodically using the update steps above.

## IAP vs Basic Auth

| Feature | IAP | Basic Auth |
|---------|-----|------------|
| Setup Complexity | High | Low |
| User Management | Google accounts | htpasswd file |
| SSO Support | Yes | No |
| Cost | Free tier available | Free |
| Browser Integration | Seamless | Username/password prompt |
| API Access | Requires service accounts | Simple auth header |
| Best For | Enterprise apps | Internal tools, dev environments |

Basic auth is simpler for internal tools and development environments. Consider IAP for production applications requiring SSO and advanced user management.
