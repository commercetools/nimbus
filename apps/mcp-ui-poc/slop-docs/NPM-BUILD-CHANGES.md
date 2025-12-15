# Docker Build Changes - Using npm Packages

## Summary

The Docker build process has been simplified to use published npm packages instead of requiring pre-built workspace packages.

## What Changed

### Before
- Required building workspace packages first: `pnpm build:packages`
- Copied pre-built packages into Docker container:
  - `packages/nimbus/dist`
  - `packages/nimbus-icons/dist`
  - `packages/tokens/dist`
- Complex workspace protocol handling in Docker

### After
- No workspace build required
- Pulls `@commercetools/nimbus` packages directly from npm registry
- Much simpler Dockerfile
- Faster initial setup

## Technical Changes

### Client package.json
- Changed from `workspace:*` to `^2.1.0` for Nimbus packages
- Changed from `catalog:react` to `^19.0.0` for React dependencies
- Changed from `catalog:tooling` to explicit versions for dev dependencies
- Now uses published npm packages for all dependencies

### Client Dockerfile
- Removed workspace configuration copying
- Removed pre-built package copying
- Simplified to just copy package.json and install
- Installs dependencies directly from npm

### Build Script (`k8s-build.sh`)
- Removed workspace package validation
- Removed prerequisite checks
- Simplified to just build both images

### Documentation
- Removed "Build workspace packages" step from all docs
- Simplified prerequisites
- Updated all guides to reflect new process

## Benefits

1. **Simpler Setup** - No need to build workspace packages first
2. **Portable** - Can build anywhere with internet access
3. **Faster Onboarding** - Fewer steps for new developers
4. **Consistent** - Uses same npm packages as production
5. **Independent** - Docker build doesn't depend on local monorepo state

## Migration Notes

If you have existing Docker images, rebuild them:

```bash
cd apps/mcp-ui-poc

# Rebuild images
./scripts/k8s-build.sh

# Reload into Minikube
./scripts/k8s-load-minikube.sh

# Restart deployments
kubectl rollout restart deployment/mcp-ui-poc-client
kubectl rollout restart deployment/mcp-ui-poc-server
```

## Version Pinning

Currently pinned to: `@commercetools/nimbus@^2.1.0`

To update to a new version, edit `client/Dockerfile` and change the version in the `sed` command:

```dockerfile
RUN sed -i 's/"workspace:\*"/"^2.2.0"/g' package.json
```

Or for a specific version without caret:

```dockerfile
RUN sed -i 's/"workspace:\*"/"2.1.0"/g' package.json
```
