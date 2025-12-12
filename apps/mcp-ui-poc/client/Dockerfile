# Multi-stage build for mcp-ui-poc-client
# This Dockerfile uses pre-built workspace packages
#
# IMPORTANT: Build workspace packages locally BEFORE running docker build:
#   pnpm build:packages
#
# This dramatically speeds up Docker builds by skipping the heavy
# nimbus-icons generation (hundreds of SVG -> React components)

# ============================================================
# Stage 1: Build Application
# ============================================================
FROM node:22-alpine AS app-builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy package.json files for workspace dependencies
COPY packages/nimbus/package.json ./packages/nimbus/
COPY packages/nimbus-icons/package.json ./packages/nimbus-icons/
COPY packages/tokens/package.json ./packages/tokens/
COPY apps/mcp-ui-poc/client/package.json ./apps/mcp-ui-poc/client/

# Install dependencies (uses workspace protocol)
RUN pnpm install --frozen-lockfile

# Copy PRE-BUILT workspace packages (built locally before Docker)
# These must exist or the build will fail:
#   - packages/nimbus/dist
#   - packages/nimbus-icons/dist
#   - packages/tokens/dist + generated + css
COPY packages/nimbus/dist ./packages/nimbus/dist
COPY packages/nimbus/package.json ./packages/nimbus/
COPY packages/nimbus-icons/dist ./packages/nimbus-icons/dist
COPY packages/nimbus-icons/package.json ./packages/nimbus-icons/
COPY packages/tokens/dist ./packages/tokens/dist
COPY packages/tokens/generated ./packages/tokens/generated
COPY packages/tokens/css ./packages/tokens/css
COPY packages/tokens/package.json ./packages/tokens/

# Copy application source
COPY apps/mcp-ui-poc/client/ ./apps/mcp-ui-poc/client/

# Build arguments for Vite environment variables
ARG VITE_MCP_SERVER_URL=http://localhost:3001
ARG VITE_ANTHROPIC_API_KEY

# Build the application
WORKDIR /app/apps/mcp-ui-poc/client
RUN pnpm build

# ============================================================
# Stage 2: Production (nginx)
# ============================================================
FROM nginx:alpine AS production

# Copy custom nginx configuration
COPY apps/mcp-ui-poc/client/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from app-builder
COPY --from=app-builder /app/apps/mcp-ui-poc/client/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
