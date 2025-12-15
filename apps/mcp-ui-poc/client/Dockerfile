# Multi-stage build for mcp-ui-poc-client with workspace dependencies
# Builds workspace packages (@commercetools/nimbus, @commercetools/nimbus-icons)
# then builds the client application

# ============================================================
# Stage 1: Build Workspace Dependencies
# ============================================================
FROM node:22-alpine AS workspace-builder

WORKDIR /workspace

# Install pnpm
RUN npm install -g pnpm@10

# Copy workspace configuration files
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY .npmrc ./

# Copy tokens package (required by nimbus)
COPY packages/tokens ./packages/tokens

# Copy nimbus packages that client depends on
COPY packages/nimbus ./packages/nimbus
COPY packages/nimbus-icons ./packages/nimbus-icons

# Install workspace dependencies
RUN pnpm install --frozen-lockfile

# Build tokens first (nimbus depends on it)
RUN pnpm --filter @commercetools/nimbus-tokens build

# Build nimbus packages
RUN pnpm --filter @commercetools/nimbus build
RUN pnpm --filter @commercetools/nimbus-icons build

# ============================================================
# Stage 2: Build Client Application
# ============================================================
FROM node:22-alpine AS app-builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10

# Copy workspace files from workspace-builder
COPY --from=workspace-builder /workspace/pnpm-workspace.yaml ./
COPY --from=workspace-builder /workspace/package.json ./
COPY --from=workspace-builder /workspace/pnpm-lock.yaml ./
COPY --from=workspace-builder /workspace/.npmrc ./

# Copy built workspace packages
COPY --from=workspace-builder /workspace/packages ./packages

# Copy client source
COPY apps/mcp-ui-poc/client ./apps/mcp-ui-poc/client

# Install all dependencies (will use built workspace packages)
WORKDIR /app/apps/mcp-ui-poc/client
RUN pnpm install --frozen-lockfile

# Build arguments for Vite environment variables
ARG VITE_MCP_SERVER_URL=http://localhost:3001
ARG VITE_ANTHROPIC_API_KEY

# Build the application with environment variables
ENV VITE_MCP_SERVER_URL=${VITE_MCP_SERVER_URL}
ENV VITE_ANTHROPIC_API_KEY=${VITE_ANTHROPIC_API_KEY}
RUN pnpm build

# ============================================================
# Stage 3: Production (nginx)
# ============================================================
FROM nginx:alpine AS production

# Copy custom nginx configuration
COPY apps/mcp-ui-poc/client/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from app-builder
COPY --from=app-builder /app/apps/mcp-ui-poc/client/dist /usr/share/nginx/html

# Note: .htpasswd is NOT included in the image for security
# It's mounted at runtime via Kubernetes secret (see deployment.yaml)

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
