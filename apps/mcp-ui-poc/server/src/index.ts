import express from "express";
import cors from "cors";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { randomUUID } from "crypto";
import elementsManifest from "./elements-manifest.json" with { type: "json" };
import { createProductCard } from "./tools/product-card.js";
import { createForm } from "./tools/form.js";
import { createDataTable } from "./tools/data-table.js";
import { createCard } from "./tools/card.js";
import { createText } from "./tools/text.js";
import { createButton } from "./tools/button.js";
import { createBadge } from "./tools/badge.js";
import { createFlex } from "./tools/flex.js";
import { createStack } from "./tools/stack.js";
import { createHeading } from "./tools/heading.js";

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
// CHILD ELEMENT SCHEMAS
// ============================================================

// Base schemas for child elements (recursive)
const childElementSchema: z.ZodType<any> = z.lazy(() =>
  z.discriminatedUnion("type", [
    z.object({
      type: z.literal("heading"),
      content: z.string(),
      size: z.string().optional(),
      marginBottom: z.string().optional(),
    }),
    z.object({
      type: z.literal("text"),
      content: z.string(),
      fontSize: z.string().optional(),
      fontWeight: z.string().optional(),
      color: z.string().optional(),
      marginBottom: z.string().optional(),
    }),
    z.object({
      type: z.literal("button"),
      label: z.string(),
      variant: z.string().optional(),
      colorPalette: z.string().optional(),
      width: z.string().optional(),
      isDisabled: z.boolean().optional(),
    }),
    z.object({
      type: z.literal("badge"),
      label: z.string(),
      colorPalette: z.string().optional(),
      size: z.string().optional(),
      width: z.string().optional(),
    }),
    z.object({
      type: z.literal("stack"),
      direction: z.string().optional(),
      gap: z.string().optional(),
      width: z.string().optional(),
      marginBottom: z.string().optional(),
      children: z.array(childElementSchema).optional(),
    }),
    z.object({
      type: z.literal("flex"),
      direction: z.string().optional(),
      gap: z.string().optional(),
      padding: z.string().optional(),
      backgroundColor: z.string().optional(),
      children: z.array(childElementSchema).optional(),
    }),
    z.object({
      type: z.literal("card"),
      elevation: z.string().optional(),
      borderStyle: z.string().optional(),
      cardPadding: z.string().optional(),
      maxWidth: z.string().optional(),
      width: z.string().optional(),
      children: z.array(childElementSchema).optional(),
    }),
  ])
);

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

  // Tool 4: Create Card
  server.registerTool(
    "createCard",
    {
      title: "Create Card",
      description:
        "Creates a card UI component using Nimbus design system. Can contain child elements for composition.",
      inputSchema: z.object({
        content: z.string().optional().describe("Card content text"),
        elevation: z
          .string()
          .optional()
          .describe("Card elevation (e.g., 'elevated', 'flat')"),
        borderStyle: z
          .string()
          .optional()
          .describe("Border style (e.g., 'outlined', 'none')"),
        cardPadding: z.string().optional().describe("Card padding size"),
        maxWidth: z
          .string()
          .optional()
          .describe("Maximum width (e.g., '432px')"),
        width: z
          .string()
          .optional()
          .describe("Width (e.g., 'fit-content', 'full')"),
        children: z
          .array(childElementSchema)
          .optional()
          .describe("Array of child elements to nest inside the card"),
      }),
    },
    async (args) => {
      const uiResource = createCard(args);
      return {
        content: [uiResource],
      };
    }
  );

  // Tool 5: Create Text
  server.registerTool(
    "createText",
    {
      title: "Create Text",
      description: "Creates a text UI component using Nimbus design system.",
      inputSchema: z.object({
        content: z.string().describe("Text content to display"),
        fontSize: z
          .string()
          .optional()
          .describe("Font size (e.g., 'sm', 'md', 'lg', 'xl')"),
        fontWeight: z
          .string()
          .optional()
          .describe("Font weight (e.g., 'normal', 'bold')"),
        color: z.string().optional().describe("Text color"),
        marginBottom: z.string().optional().describe("Bottom margin"),
      }),
    },
    async (args) => {
      const uiResource = createText(args);
      return {
        content: [uiResource],
      };
    }
  );

  // Tool 6: Create Button
  server.registerTool(
    "createButton",
    {
      title: "Create Button",
      description: "Creates a button UI component using Nimbus design system.",
      inputSchema: z.object({
        label: z.string().describe("Button label text"),
        variant: z
          .string()
          .optional()
          .describe("Button variant (e.g., 'solid', 'outline', 'ghost')"),
        colorPalette: z
          .string()
          .optional()
          .describe("Color palette (e.g., 'primary', 'critical')"),
        width: z.string().optional().describe("Button width"),
        isDisabled: z
          .boolean()
          .optional()
          .describe("Whether the button is disabled"),
      }),
    },
    async (args) => {
      const uiResource = createButton(args);
      return {
        content: [uiResource],
      };
    }
  );

  // Tool 7: Create Badge
  server.registerTool(
    "createBadge",
    {
      title: "Create Badge",
      description: "Creates a badge UI component using Nimbus design system.",
      inputSchema: z.object({
        label: z.string().describe("Badge label text"),
        colorPalette: z
          .string()
          .optional()
          .describe("Color palette (e.g., 'primary', 'positive', 'critical')"),
        size: z
          .string()
          .optional()
          .describe("Badge size (e.g., '2xs', 'xs', 'sm', 'md')"),
        width: z.string().optional().describe("Badge width"),
      }),
    },
    async (args) => {
      const uiResource = createBadge(args);
      return {
        content: [uiResource],
      };
    }
  );

  // Tool 8: Create Flex
  server.registerTool(
    "createFlex",
    {
      title: "Create Flex",
      description:
        "Creates a flex layout container UI component using Nimbus design system. Can contain child elements for composition.",
      inputSchema: z.object({
        content: z.string().optional().describe("Flex content text"),
        direction: z
          .string()
          .optional()
          .describe("Flex direction (e.g., 'row', 'column')"),
        gap: z.string().optional().describe("Gap between items"),
        padding: z.string().optional().describe("Container padding"),
        backgroundColor: z.string().optional().describe("Background color"),
        children: z
          .array(childElementSchema)
          .optional()
          .describe(
            "Array of child elements to nest inside the flex container"
          ),
      }),
    },
    async (args) => {
      const uiResource = createFlex(args);
      return {
        content: [uiResource],
      };
    }
  );

  // Tool 9: Create Stack
  server.registerTool(
    "createStack",
    {
      title: "Create Stack",
      description:
        "Creates a stack layout container UI component using Nimbus design system. Can contain child elements for composition.",
      inputSchema: z.object({
        content: z.string().optional().describe("Stack content text"),
        direction: z
          .string()
          .optional()
          .describe("Stack direction (e.g., 'row', 'column')"),
        gap: z.string().optional().describe("Gap between items"),
        width: z.string().optional().describe("Stack width"),
        marginBottom: z.string().optional().describe("Bottom margin"),
        children: z
          .array(childElementSchema)
          .optional()
          .describe(
            "Array of child elements to nest inside the stack container"
          ),
      }),
    },
    async (args) => {
      const uiResource = createStack(args);
      return {
        content: [uiResource],
      };
    }
  );

  // Tool 10: Create Heading
  server.registerTool(
    "createHeading",
    {
      title: "Create Heading",
      description: "Creates a heading UI component using Nimbus design system.",
      inputSchema: z.object({
        content: z.string().describe("Heading text content"),
        size: z
          .string()
          .optional()
          .describe("Heading size (e.g., 'xs', 'sm', 'md', 'lg', 'xl')"),
        marginBottom: z.string().optional().describe("Bottom margin"),
      }),
    },
    async (args) => {
      const uiResource = createHeading(args);
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
