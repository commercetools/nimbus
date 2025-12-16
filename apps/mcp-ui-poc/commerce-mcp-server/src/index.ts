import { config } from "dotenv";
import { CommercetoolsCommerceAgentStreamable } from "@commercetools/commerce-agent/modelcontextprotocol";
import express from "express";
import cors from "cors";

// Load environment variables from .env file
config();

const app = express();

// CORS configuration matching UI MCP server - allow all origins for development
app.use(
  cors({
    origin: "*",
    exposedHeaders: ["Mcp-Session-Id", "mcp-protocol-version"],
    allowedHeaders: ["Content-Type", "mcp-session-id", "mcp-protocol-version"],
  })
);

// Validate required environment variables
const requiredEnvVars = [
  "CT_CLIENT_ID",
  "CT_CLIENT_SECRET",
  "CT_PROJECT_KEY",
  "CT_AUTH_URL",
  "CT_API_URL",
];

const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);
if (missingEnvVars.length > 0) {
  console.error(
    "Missing required environment variables:",
    missingEnvVars.join(", ")
  );
  console.error("Please set these variables in your .env file");
  process.exit(1);
}

console.log("Initializing Commerce MCP Server...");
console.log("Project Key:", process.env.CT_PROJECT_KEY);
console.log("Auth URL:", process.env.CT_AUTH_URL);
console.log("API URL:", process.env.CT_API_URL);

// Create Commerce MCP server with read + write operations
const commerceServer = new CommercetoolsCommerceAgentStreamable({
  authConfig: {
    type: "client_credentials",
    clientId: process.env.CT_CLIENT_ID!,
    clientSecret: process.env.CT_CLIENT_SECRET!,
    projectKey: process.env.CT_PROJECT_KEY!,
    authUrl: process.env.CT_AUTH_URL!,
    apiUrl: process.env.CT_API_URL!,
  },
  configuration: {
    // Enable read + write operations as requested
    actions: {
      products: { read: true, create: true, update: true },
      category: { read: true, create: true, update: true },
      orders: { read: true, create: true, update: true },
      carts: { read: true, create: true, update: true },
      customers: { read: true, create: true, update: true },
      inventory: { read: true, create: true, update: true },
      discounts: { read: true, create: true, update: true },
      payments: { read: true, create: true, update: true },
      pricing: { read: true, create: true, update: true },
      shipping: { read: true, create: true, update: true },
      project: { read: true },
    },
  },
  stateless: false, // Session-based like UI MCP
  app: app,
  streamableHttpOptions: {
    sessionIdGenerator: undefined, // Use default UUID
  },
});

const PORT = parseInt(process.env.COMMERCE_MCP_PORT || "8888", 10);

commerceServer.listen(PORT, () => {
  console.log("Commerce MCP Server started successfully");
  console.log(`Listening on port ${PORT}`);
  console.log(`MCP endpoint: http://localhost:${PORT}/mcp`);
  console.log(`Write operations enabled - use with caution in production`);
  console.log("");
  console.log("Ready to accept connections from MCP clients...");
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\nShutting down Commerce MCP Server gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\nShutting down Commerce MCP Server gracefully...");
  process.exit(0);
});
