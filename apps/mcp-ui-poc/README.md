# MCP UI POC

A proof-of-concept application demonstrating Model Context Protocol (MCP) integration with the Nimbus design system.

## Structure

```
apps/mcp-ui-poc/
├── docker-compose.yaml    # Docker Compose configuration
├── .env.example          # Environment variable template
├── server/               # MCP server (Node.js/Express)
│   ├── src/             # Server source code
│   ├── Dockerfile       # Server Docker configuration
│   └── k8s/             # Kubernetes manifests
└── client/              # React client application
    ├── src/             # Client source code
    ├── Dockerfile       # Client Docker configuration
    └── k8s/             # Kubernetes manifests
```

## Quick Start with Docker

### Prerequisites

- Docker Desktop installed and running
- Anthropic API key ([get one here](https://console.anthropic.com/))
- Node.js 22+ and pnpm 10+ installed (for building workspace packages)

### Steps

1. **Build workspace packages (REQUIRED):**
   ```bash
   # From repository root
   pnpm build:packages
   ```

   This builds the required Nimbus packages (`nimbus`, `nimbus-icons`, `tokens`).
   Docker will copy these pre-built packages instead of building them inside containers.

2. **Create .env file:**
   ```bash
   cd apps/mcp-ui-poc
   cp .env.example .env
   # Edit .env and add your ANTHROPIC_API_KEY
   ```

3. **Start services:**
   ```bash
   docker-compose up --build
   ```

4. **Access applications:**
   - Client UI: http://localhost:8080
   - Server API: http://localhost:3001/elements

### Common Commands

```bash
# From apps/mcp-ui-poc directory:

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up --build

# Rebuild specific service
docker-compose build mcp-ui-poc-client
docker-compose up -d mcp-ui-poc-client
```

## Development

### Running Locally (without Docker)

#### Server
```bash
cd server
pnpm install
pnpm dev
```

#### Client
```bash
cd client
cp .env.example .env  # Add your API key
pnpm install
pnpm dev
```

## Architecture

- **Server**: Express server providing MCP endpoints for UI component creation
- **Client**: React/Vite application that connects to Claude AI via MCP server
- **Communication**: Browser → MCP Server → Claude API

## Documentation

- [Server Deployment Guide](./server/DEPLOYMENT.md)
- [Client Deployment Guide](./client/DEPLOYMENT.md)
- [Kubernetes Deployment](./server/k8s/) and [Client K8s](./client/k8s/)

## Kubernetes Deployment

See the deployment documentation in each subdirectory:
- Server: `server/DEPLOYMENT.md`
- Client: `client/DEPLOYMENT.md`
