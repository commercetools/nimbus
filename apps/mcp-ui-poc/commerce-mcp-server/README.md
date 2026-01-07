# Commerce MCP Server

A standalone commercetools Commerce MCP (Model Context Protocol) server that
exposes commerce operations through the MCP interface.

## Overview

This server provides access to commercetools APIs through the Model Context
Protocol, enabling AI agents and other MCP clients to perform commerce
operations like:

- **Products**: Read, create, and update products
- **Categories**: Manage product categories
- **Orders**: View and manage orders
- **Carts**: Create and modify shopping carts
- **Customers**: Manage customer data
- **Inventory**: Track and update inventory
- **Discounts**: Configure discount rules
- **Payments**: Handle payment operations
- **Pricing**: Manage pricing configurations
- **Shipping**: Configure shipping methods
- **Project**: View project settings

## Prerequisites

- Node.js 18.0.0 or higher
- A commercetools project with API credentials
- npm or yarn package manager

## Installation

1. **Clone or copy this directory** to your desired location

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:

   ```bash
   cp .env.example .env
   ```

4. **Edit `.env`** with your commercetools credentials:
   ```env
   CT_CLIENT_ID=your_client_id
   CT_CLIENT_SECRET=your_client_secret
   CT_PROJECT_KEY=your_project_key
   CT_AUTH_URL=https://auth.europe-west1.gcp.commercetools.com
   CT_API_URL=https://api.europe-west1.gcp.commercetools.com
   ```

## Usage

### Development Mode (with hot reload)

```bash
npm run dev
```

### Production Mode

```bash
# Build TypeScript
npm run build

# Start the server
npm start
```

### Type Checking

```bash
npm run typecheck
```

## Configuration

### Environment Variables

| Variable            | Required | Default | Description                      |
| ------------------- | -------- | ------- | -------------------------------- |
| `CT_CLIENT_ID`      | Yes      | -       | commercetools API client ID      |
| `CT_CLIENT_SECRET`  | Yes      | -       | commercetools API client secret  |
| `CT_PROJECT_KEY`    | Yes      | -       | commercetools project key        |
| `CT_AUTH_URL`       | Yes      | -       | commercetools authentication URL |
| `CT_API_URL`        | Yes      | -       | commercetools API URL            |
| `COMMERCE_MCP_PORT` | No       | `8888`  | Server port                      |

### Common API Regions

| Region          | Auth URL                                                  | API URL                                                  |
| --------------- | --------------------------------------------------------- | -------------------------------------------------------- |
| Europe (GCP)    | `https://auth.europe-west1.gcp.commercetools.com`         | `https://api.europe-west1.gcp.commercetools.com`         |
| US (GCP)        | `https://auth.us-central1.gcp.commercetools.com`          | `https://api.us-central1.gcp.commercetools.com`          |
| Australia (GCP) | `https://auth.australia-southeast1.gcp.commercetools.com` | `https://api.australia-southeast1.gcp.commercetools.com` |

## API Endpoint

Once running, the MCP endpoint is available at:

```
http://localhost:8888/mcp
```

This endpoint accepts MCP protocol messages and supports:

- Session-based connections (stateful)
- CORS for browser-based clients
- Both read and write operations

## Connecting MCP Clients

### Example: Multi-server MCP Client Configuration

```javascript
const servers = [
  {
    name: "commerce",
    url: "http://localhost:8888/mcp",
    description: "commercetools Commerce operations",
  },
];
```

## Security Considerations

- **Never commit `.env` files** - they contain sensitive credentials
- **Write operations are enabled** - use caution in production environments
- **CORS is set to allow all origins** - restrict in production
- Store credentials securely and rotate them regularly

## Troubleshooting

### Server won't start

1. Check that all required environment variables are set:

   ```bash
   cat .env
   ```

2. Verify your commercetools credentials are valid

3. Ensure port 8888 is not in use:
   ```bash
   lsof -i :8888
   ```

### Authentication errors

- Verify `CT_AUTH_URL` matches your project region
- Check that your API client has the necessary scopes
- Ensure credentials haven't expired

### Connection refused

- Confirm the server is running (`npm run dev`)
- Check firewall settings
- Verify the client is connecting to the correct port

## Development

### Project Structure

```
commerce-mcp-server/
├── src/
│   └── index.ts      # Main server implementation
├── dist/             # Compiled JavaScript (after build)
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
├── .env.example      # Environment template
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

### Building

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

## License

MIT
