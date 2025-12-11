import express from "express";
import cors from "cors";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { randomUUID } from "crypto";
import elementsManifest from "./elements-manifest.json" assert { type: "json" };
import { createProductCard } from "./tools/product-card.js";
import { createForm } from "./tools/form.js";
import { createDataTable } from "./tools/data-table.js";

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration for MCP protocol
app.use(
  cors({
    origin: "*",
    exposedHeaders: ["Mcp-Session-Id", "mcp-protocol-version"],
    allowedHeaders: ["Content-Type", "mcp-session-id", "mcp-protocol-version"],
  })
);
app.use(express.json());

// Session storage: Map of sessionId -> StreamableHTTPServerTransport
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

// ============================================================
// HELPER ENDPOINT (Non-MCP)
// ============================================================

// Serve element manifest for client validation
// This helps the client verify it has all required Nimbus components
app.get("/elements", (req, res) => {
  res.json(elementsManifest);
});

// ============================================================
// MCP PROTOCOL ENDPOINTS
// ============================================================

// POST /mcp - Handle client-to-server communication
app.post("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  let transport: StreamableHTTPServerTransport;

  if (sessionId && transports[sessionId]) {
    // Session exists - reuse existing transport
    transport = transports[sessionId];
  } else if (!sessionId && isInitializeRequest(req.body)) {
    // New session initialization request
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sid) => {
        transports[sid] = transport;
        console.log(`✅ MCP Session initialized: ${sid}`);
      },
    });

    // Clean up transport when session closes
    transport.onclose = () => {
      if (transport.sessionId) {
        console.log(`🔌 MCP Session closed: ${transport.sessionId}`);
        delete transports[transport.sessionId];
      }
    };

    // Create new MCP server instance for this session
    const server = new McpServer({
      name: "nimbus-mcp-ui-server",
      version: "1.0.0",
    });

    // Register tools on the MCP server
    registerTools(server);

    // Connect server to transport
    await server.connect(transport);
  } else {
    // Invalid request - no session ID and not an initialization request
    return res.status(400).json({
      error: { message: "Bad Request: No valid session ID provided" },
    });
  }

  // Handle the request using the transport
  await transport.handleRequest(req, res, req.body);
});

// GET /mcp - Long-lived stream for server-to-client messages
app.get("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    return res.status(404).send("Session not found");
  }

  const transport = transports[sessionId];
  await transport.handleRequest(req, res);
});

// DELETE /mcp - Explicit session termination
app.delete("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    return res.status(404).send("Session not found");
  }

  const transport = transports[sessionId];
  await transport.handleRequest(req, res);
});

// ============================================================
// TOOL REGISTRATION
// ============================================================

function registerTools(server: McpServer) {
  // Tool 1: Create Product Card
  server.registerTool(
    "createProductCard",
    {
      title: "Create Product Card",
      description:
        "Creates a product card UI component with name, price, description, image, and stock status using Nimbus design system components.",
      inputSchema: z.object({
        productName: z.string().describe("The name of the product"),
        price: z.string().describe("The price of the product (e.g., '$999')"),
        description: z
          .string()
          .optional()
          .describe("Optional product description"),
        imageUrl: z
          .string()
          .optional()
          .describe("Optional URL to product image"),
        inStock: z
          .boolean()
          .optional()
          .describe("Whether the product is in stock (default: true)"),
      }),
    },
    async (args) => {
      const uiResource = createProductCard(args);
      return {
        content: [uiResource],
      };
    }
  );

  // Tool 2: Create Form
  server.registerTool(
    "createForm",
    {
      title: "Create Form",
      description:
        "Creates a form UI component with text inputs and submit button using Nimbus design system components.",
      inputSchema: z.object({
        title: z.string().optional().describe("Form title"),
        fields: z
          .array(
            z.object({
              name: z.string().describe("Field name"),
              label: z.string().describe("Field label"),
              type: z
                .enum(["text", "email", "number", "textarea"])
                .optional()
                .describe("Field type (default: text)"),
              required: z
                .boolean()
                .optional()
                .describe("Whether field is required"),
            })
          )
          .describe("Array of form fields"),
        submitLabel: z
          .string()
          .optional()
          .describe("Submit button label (default: 'Submit')"),
      }),
    },
    async (args) => {
      const uiResource = createForm(args);
      return {
        content: [uiResource],
      };
    }
  );

  // Tool 3: Create Data Table
  server.registerTool(
    "createDataTable",
    {
      title: "Create Data Table",
      description:
        "Creates a data table UI component with headers and rows using Nimbus design system components.",
      inputSchema: z.object({
        title: z.string().optional().describe("Table title"),
        columns: z
          .array(
            z.object({
              key: z.string().describe("Column key (matches data object keys)"),
              label: z.string().describe("Column header label"),
            })
          )
          .describe("Array of column definitions"),
        data: z.array(z.record(z.any())).describe("Array of data objects"),
      }),
    },
    async (args) => {
      const uiResource = createDataTable(args);
      return {
        content: [uiResource],
      };
    }
  );
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MCP-UI Server running on port ${PORT}`);
  console.log(`📦 Element manifest: http://localhost:${PORT}/elements`);
  console.log(`🔌 MCP endpoint: http://localhost:${PORT}/mcp`);
});
