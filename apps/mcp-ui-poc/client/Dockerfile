# Multi-stage build for mcp-ui-poc-client
# Assumes workspace packages are already built on host (packages/*/dist exists)
# This makes builds much faster by skipping workspace package compilation

# ============================================================
# Stage 1: Build Client Application
# ============================================================
FROM node:22-alpine AS app-builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10

# Copy workspace configuration files
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY .npmrc ./

# Copy workspace package.json files and built artifacts only
COPY packages/tokens/package.json ./packages/tokens/
COPY packages/tokens/dist ./packages/tokens/dist
COPY packages/tokens/generated ./packages/tokens/generated

COPY packages/nimbus/package.json ./packages/nimbus/
COPY packages/nimbus/dist ./packages/nimbus/dist

COPY packages/nimbus-icons/package.json ./packages/nimbus-icons/
COPY packages/nimbus-icons/dist ./packages/nimbus-icons/dist

# Copy client source
COPY apps/mcp-ui-poc/client ./apps/mcp-ui-poc/client

# Install all dependencies (will use pre-built workspace packages)
WORKDIR /app/apps/mcp-ui-poc/client
RUN pnpm install --frozen-lockfile

# Build arguments for Vite environment variables
ARG VITE_MCP_SERVER_URL=http://localhost:3001
ARG VITE_ANTHROPIC_API_KEY
ARG VITE_COMMERCE_MCP_SERVER_URL=http://localhost:8888

# Build the application with environment variables
ENV VITE_MCP_SERVER_URL=${VITE_MCP_SERVER_URL}
ENV VITE_ANTHROPIC_API_KEY=${VITE_ANTHROPIC_API_KEY}
ENV VITE_COMMERCE_MCP_SERVER_URL=${VITE_COMMERCE_MCP_SERVER_URL}
RUN pnpm build

# ============================================================
# Stage 2: Production (nginx)
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
