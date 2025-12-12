# Multi-stage build for mcp-ui-poc-server
# This Dockerfile handles the TypeScript compilation and creates an optimized production image

# ============================================================
# Stage 1: Build
# ============================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10

# Copy package files for dependency installation
# We need the root package.json and pnpm workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/mcp-ui-poc/server/package.json ./apps/mcp-ui-poc/server/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/mcp-ui-poc/server/ ./apps/mcp-ui-poc/server/

# Build the application (TypeScript compilation)
WORKDIR /app/apps/mcp-ui-poc/server
RUN pnpm build

# ============================================================
# Stage 2: Production
# ============================================================
FROM node:22-alpine AS production

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/mcp-ui-poc/server/package.json ./apps/mcp-ui-poc/server/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built application from builder stage
COPY --from=builder /app/apps/mcp-ui-poc/server/dist ./apps/mcp-ui-poc/server/dist
COPY --from=builder /app/apps/mcp-ui-poc/server/src/elements-manifest.json ./apps/mcp-ui-poc/server/dist/

# Set working directory to the app
WORKDIR /app/apps/mcp-ui-poc/server

# Expose the port the app runs on
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/elements', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "dist/index.js"]
