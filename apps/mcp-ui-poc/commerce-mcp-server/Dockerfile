# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy pnpm workspace files
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./

# Copy package files
COPY package.json ./
COPY apps/mcp-ui-poc/commerce-mcp-server/package.json ./apps/mcp-ui-poc/commerce-mcp-server/
COPY apps/mcp-ui-poc/commerce-mcp-server/tsconfig.json ./apps/mcp-ui-poc/commerce-mcp-server/

# Install dependencies
RUN pnpm install --frozen-lockfile --filter @commercetools/commerce-mcp-server-standalone

# Copy source code
COPY apps/mcp-ui-poc/commerce-mcp-server/src ./apps/mcp-ui-poc/commerce-mcp-server/src

# Build TypeScript
WORKDIR /app/apps/mcp-ui-poc/commerce-mcp-server
RUN pnpm build

# Production stage
FROM node:20-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy pnpm workspace files
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./

# Copy package files
COPY package.json ./
COPY apps/mcp-ui-poc/commerce-mcp-server/package.json ./apps/mcp-ui-poc/commerce-mcp-server/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod --filter @commercetools/commerce-mcp-server-standalone

# Copy built files from builder
COPY --from=builder /app/apps/mcp-ui-poc/commerce-mcp-server/dist ./apps/mcp-ui-poc/commerce-mcp-server/dist

# Set working directory to the app
WORKDIR /app/apps/mcp-ui-poc/commerce-mcp-server

# Expose the default port
EXPOSE 8888

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8888/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the server
CMD ["node", "dist/index.js"]
