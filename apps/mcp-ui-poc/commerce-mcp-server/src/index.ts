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

// Health check endpoint for Kubernetes probes
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "commerce-mcp-server" });
});

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
      project: { read: true },
      "business-unit": { read: true, create: true, update: true },
      products: { read: true, create: true, update: true },
      "product-search": { read: true, create: true, update: true },
      category: { read: true, create: true, update: true },
      "product-selection": { read: true, create: true, update: true },
      order: { read: true, create: true, update: true },
      cart: { read: true, create: true, update: true },
      customer: { read: true, create: true, update: true },
      "customer-group": { read: true, create: true, update: true },
      "standalone-price": { read: true, create: true, update: true },
      "product-discount": { read: true, create: true, update: true },
      "cart-discount": { read: true, create: true, update: true },
      "discount-code": { read: true, create: true, update: true },
      "product-type": { read: true, create: true, update: true },
      bulk: { read: true, create: true, update: true },
      inventory: { read: true, create: true, update: true },
      store: { read: true, create: true, update: true },
      review: { read: true, create: true, update: true },
      "tax-category": { read: true, create: true, update: true },
      "shipping-methods": { read: true, create: true, update: true },
      payments: { read: true, create: true, update: true },
      zones: { read: true, create: true, update: true },
      "product-tailoring": { read: true, create: true, update: true },
      "payment-methods": { read: true, create: true, update: true },
      "recurring-orders": { read: true, create: true, update: true },
      "shopping-lists": { read: true, create: true, update: true },
      extensions: { read: true, create: true, update: true },
      subscriptions: { read: true, create: true, update: true },
      "custom-objects": { read: true, create: true, update: true },
      "payment-intents": { read: true, create: true, update: true },
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
