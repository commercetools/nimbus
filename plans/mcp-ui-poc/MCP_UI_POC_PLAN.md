# MCP-UI Proof of Concept Plan

## Overview

This plan outlines the **smallest viable MVP** for an MCP-UI server/client
system that demonstrates:

1. **MCP Protocol Server** - TypeScript server using `@modelcontextprotocol/sdk`
   with session-based transports and `@mcp-ui/server` for UI resource creation
2. **Client Application** - React app using `@mcp-ui/client` with Nimbus
   component library
3. **Pure MCP Integration** - Gemini uses native MCP support via `mcpToTool()`
   for tool discovery and execution
4. **Remote DOM Rendering** - Server creates Remote DOM with Nimbus custom
   elements, client renders with `UIResourceRenderer`
5. **Local & Deployed** - Works locally and deploys to Vercel/Netlify

**Key Architecture Decision**: The server implements the official MCP (Model
Context Protocol) with session management and transport layers. The only helper
endpoint is `/elements` for client component library validation. Gemini
discovers tools via MCP protocol, not OpenAPI.

## Project Structure

All implementation will be contained in `apps/mcp-ui-poc`:

```text
apps/mcp-ui-poc/
├── client/                          # Client application (copied from blank-app)
│   ├── src/
│   │   ├── app.tsx                  # Main app with chat interface
│   │   ├── components/
│   │   │   ├── chat-interface.tsx   # Chat UI
│   │   │   └── nimbus-library.tsx   # Nimbus component library config
│   │   ├── lib/
│   │   │   └── gemini-client.ts     # Gemini + ADK integration
│   │   └── types/
│   │       └── virtual-dom.ts       # Type definitions
│   ├── package.json                 # Add @mcp-ui/client, @google/adk
│   ├── vite.config.ts
│   └── .env.example
│
└── server/                          # MCP Protocol server
    ├── src/
    │   ├── index.ts                 # Express app + MCP protocol server
    │   ├── elements-manifest.json   # Element definitions
    │   ├── tools/
    │   │   ├── product-card.ts      # Product card tool
    │   │   ├── form.ts              # Form tool
    │   │   └── data-table.ts        # Data table tool
    │   └── types/
    │       └── remote-dom.ts        # Remote DOM types
    ├── package.json                 # Dependencies below
    ├── tsconfig.json
    └── vercel.json
```

### Key Dependencies

**Server:**

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.10.0",
    "@mcp-ui/server": "^0.1.0",
    "express": "^4.18.0",
    "cors": "^2.8.5"
  }
}
```

**Client:**

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.10.0",
    "@mcp-ui/client": "^0.1.0",
    "@commercetools/nimbus": "workspace:*",
    "@google/genai": "^1.32.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  }
}
```

### Setup Steps

1. **Copy blank-app to client**:

   ```bash
   cp -r apps/blank-app apps/mcp-ui-poc/client
   ```

2. **Create server structure**:

   ```bash
   mkdir -p apps/mcp-ui-poc/server/src/{tools,types}
   ```

3. **Update package names**:
   - Client: `@commercetools/mcp-ui-poc-client`
   - Server: `@commercetools/mcp-ui-poc-server`

4. **Install dependencies**:
   ```bash
   cd apps/mcp-ui-poc/server && pnpm install
   cd ../client && pnpm install
   ```

## Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                          User Input                              │
│                   (Chat in client app)                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              Client (React + MCP Client + Gemini)                │
│  1. Fetches /elements manifest on startup (helper endpoint)     │
│  2. Validates Nimbus library has all required elements          │
│  3. Creates MCP client connected to server                      │
│  4. Initializes Gemini with mcpToTool(mcpClient)                │
│  5. Sends user message to Gemini                                │
│  6. Gemini discovers tools via MCP tools/list                   │
│  7. Gemini calls tools via MCP tools/call (automatic)           │
│  8. Receives UIResource from MCP server                         │
│  9. Renders UIResource with UIResourceRenderer                  │
│  10. UIResourceRenderer maps Remote DOM to Nimbus components    │
└────────────┬──────────────────────────┬─────────────────────────┘
             │                          │
             │                          │
    ┌────────▼────────┐        ┌────────▼──────────────────────────┐
    │  Google Gemini  │        │   MCP Protocol Server              │
    │  (@google/genai)│        │   (@modelcontextprotocol/sdk)      │
    │                 │        │                                   │
    │ - Native MCP    │◄──────►│  Helper Endpoint:                 │
    │   support       │  MCP   │  - GET /elements (manifest)       │
    │ - mcpToTool()   │Protocol│                                   │
    │ - Auto tool     │        │  MCP Protocol Endpoints:          │
    │   discovery     │        │  - POST /mcp (tool calls)         │
    │ - Auto tool     │        │  - GET /mcp (server messages)     │
    │   execution     │        │  - DELETE /mcp (session cleanup)  │
    └─────────────────┘        │                                   │
                                │  Tools (registered on McpServer): │
                                │  - createProductCard              │
                                │  - createForm                     │
                                │  - createDataTable                │
                                │                                   │
                                │  Returns UIResource via MCP       │
                                │  with Remote DOM using Nimbus     │
                                │  custom elements                  │
                                └───────────────────────────────────┘
```

**Protocol Flow:**

1. **Element Validation**: Client fetches `/elements` to validate Nimbus library
   (HTTP)
2. **MCP Client Setup**: React app creates MCP client with
   `StreamableHTTPClientTransport`
3. **MCP Connection**: Client connects to server via `POST /mcp` (MCP
   initialize)
4. **Session Created**: Server creates `StreamableHTTPServerTransport` with
   unique session ID
5. **Gemini Integration**: Pass MCP client to Gemini via `mcpToTool(mcpClient)`
6. **Tool Discovery**: Gemini automatically calls MCP `tools/list` to discover
   available tools
7. **User Message**: User sends message to Gemini
8. **Tool Execution**: Gemini calls MCP `tools/call` automatically when needed
9. **UIResource Return**: Server returns `UIResource` instances via MCP protocol
10. **Streaming**: `GET /mcp` maintains long-lived connection for server
    messages
11. **Rendering**: React app renders UIResource with UIResourceRenderer
12. **Cleanup**: `DELETE /mcp` or transport `onclose` cleans up session

## Key Design Decisions

### 1. Element Manifest Pattern (Server Declares, Client Maps)

**Server provides a manifest of all Nimbus elements it uses**:

The server exposes a `/elements` endpoint that declares all custom elements used
in Remote DOM scripts. This provides:

- **Contract Definition** - Clear declaration of what elements the server uses
- **Client Validation** - Client can verify it has all required component
  mappings
- **Documentation** - Self-documenting API of available elements
- **Type Safety** - Can generate TypeScript types from manifest

**Element Manifest Structure** (`server/src/elements-manifest.json`):

```json
{
  "version": "1.0.0",
  "elements": [
    {
      "tagName": "nimbus-card",
      "description": "Card container component",
      "category": "layout",
      "attributes": [
        {
          "name": "variant",
          "type": "string",
          "values": ["elevated", "outline", "subtle"],
          "description": "Visual style variant"
        },
        {
          "name": "max-width",
          "type": "string",
          "description": "Maximum width (e.g., '400px', '100%')"
        }
      ]
    },
    {
      "tagName": "nimbus-button",
      "description": "Interactive button component",
      "category": "interactive",
      "attributes": [
        {
          "name": "variant",
          "type": "string",
          "values": ["solid", "outline", "ghost"],
          "description": "Button style variant"
        },
        {
          "name": "color-palette",
          "type": "string",
          "values": ["primary", "positive", "critical", "neutral"],
          "description": "Color scheme"
        },
        {
          "name": "width",
          "type": "string",
          "description": "Width (e.g., 'full', 'auto')"
        },
        {
          "name": "is-disabled",
          "type": "boolean",
          "description": "Disabled state"
        }
      ],
      "events": [
        {
          "name": "press",
          "description": "Triggered when button is clicked"
        }
      ]
    },
    {
      "tagName": "nimbus-text",
      "description": "Text display component",
      "category": "typography",
      "attributes": [
        {
          "name": "font-size",
          "type": "string",
          "description": "Font size token (e.g., 'xl', 'lg', 'md')"
        },
        {
          "name": "font-weight",
          "type": "string",
          "description": "Font weight (e.g., 'bold', 'normal')"
        },
        {
          "name": "color",
          "type": "string",
          "description": "Text color token"
        }
      ]
    }
  ]
}
```

**Client Validates on Startup**:

```typescript
// client/src/lib/nimbus-library.ts
import { nimbusLibrary } from "../components/nimbus-library";

export async function validateNimbusLibrary(serverUrl: string) {
  const response = await fetch(`${serverUrl}/elements`);
  const manifest = await response.json();

  const missingElements: string[] = [];
  const validElements: string[] = [];

  for (const element of manifest.elements) {
    const hasMapping = nimbusLibrary.elements.some(
      (e) => e.tagName === element.tagName
    );

    if (!hasMapping) {
      missingElements.push(element.tagName);
      console.error(`❌ Missing component mapping: ${element.tagName}`);
    } else {
      validElements.push(element.tagName);
    }
  }

  console.log(`✅ Validated ${validElements.length} elements`);

  if (missingElements.length > 0) {
    throw new Error(
      `Missing component mappings: ${missingElements.join(", ")}`
    );
  }

  return manifest;
}
```

### 2. MCP Protocol Server with Tool Registration

**Server uses MCP SDK for protocol handling and `@mcp-ui/server` for UIResource
creation**:

The server implements the official MCP protocol using
`@modelcontextprotocol/sdk`:

- **Session Management**: `StreamableHTTPServerTransport` handles HTTP-based
  sessions
- **Server Instances**: Each session gets its own `McpServer` instance
- **Tool Registration**: Tools registered via `server.registerTool()` API
- **UIResource Creation**: `createUIResource()` from `@mcp-ui/server` generates
  Remote DOM

**Example tool registration**:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createUIResource } from "@mcp-ui/server";

// Register tool on MCP server instance
server.registerTool(
  "createProductCard",
  {
    title: "Create Product Card",
    description: "Creates a product card UI component",
    inputSchema: {
      type: "object",
      required: ["productName", "price"],
      properties: {
        productName: { type: "string" },
        price: { type: "string" },
        inStock: { type: "boolean" },
      },
    },
  },
  async (args: any) => {
    // Generate Remote DOM script using Nimbus custom elements
    const remoteDomScript = `
      const card = document.createElement('nimbus-card');
      card.setAttribute('variant', 'elevated');

      const heading = document.createElement('nimbus-heading');
      heading.textContent = '${args.productName}';

      const price = document.createElement('nimbus-text');
      price.textContent = '${args.price}';

      card.appendChild(heading);
      card.appendChild(price);
      root.appendChild(card);
    `;

    // Create UIResource with Remote DOM
    const uiResource = createUIResource({
      uri: `ui://product-card/${Date.now()}`,
      content: {
        type: "remoteDom",
        script: remoteDomScript,
        framework: "react",
      },
      encoding: "text",
    });

    // Return in MCP tool response format
    return {
      content: [uiResource],
    };
  }
);
```

**Key Points:**

- Tools registered on `McpServer` instances (not Express routes)
- Tool handlers return `{ content: [uiResource] }` format
- Remote DOM scripts create custom elements matching Nimbus components
- UIResource instances flow through MCP protocol to client

### 3. Tool Discovery via MCP Protocol

**Gemini discovers tools via MCP's `tools/list` method** - no OpenAPI spec
needed.

When the React app passes the MCP client to Gemini via `mcpToTool()`, Gemini
automatically:

1. **Calls `tools/list`** on the MCP server to discover available tools
2. **Receives tool schemas** defined in `server.registerTool()` calls
3. **Uses tool schemas** to understand parameters and decide when to call each
   tool
4. **Calls `tools/call`** to execute tools when appropriate

Example of how a tool is registered on the MCP server:

```typescript
server.registerTool(
  "createProductCard",
  {
    title: "Create Product Card",
    description:
      "Creates a product card UI component with name, price, image, and stock status",
    inputSchema: {
      type: "object",
      required: ["productName", "price"],
      properties: {
        productName: {
          type: "string",
          description: "The name of the product",
        },
        price: {
          type: "string",
          description: 'The price of the product (e.g., "$999")',
        },
        imageUrl: {
          type: "string",
          description: "Optional URL to product image",
        },
        inStock: {
          type: "boolean",
          description: "Whether the product is in stock (default: true)",
        },
      },
    },
  },
  async (args: any) => {
    const uiResource = createProductCard(args);
    return { content: [uiResource] };
  }
);
```

The `inputSchema` follows JSON Schema format and is automatically discovered by
Gemini via MCP protocol.

### 4. Element Manifest for Server-Client Contract

**Server provides element manifest at `server/src/elements-manifest.json`**:

This JSON file declares all custom elements (Nimbus components) that the server
uses in its Remote DOM scripts. The client validates this manifest on startup to
ensure it has component mappings for all required elements.

```json
{
  "version": "1.0.0",
  "elements": [
    {
      "tagName": "nimbus-card",
      "description": "Card container component",
      "category": "layout",
      "attributes": [
        {
          "name": "variant",
          "type": "string",
          "values": ["elevated", "outline", "subtle"],
          "description": "Visual style variant"
        },
        {
          "name": "max-width",
          "type": "string",
          "description": "Maximum width (e.g., '400px', '100%')"
        }
      ]
    },
    {
      "tagName": "nimbus-card-body",
      "description": "Card body container",
      "category": "layout",
      "attributes": []
    },
    {
      "tagName": "nimbus-heading",
      "description": "Heading text component",
      "category": "typography",
      "attributes": [
        {
          "name": "size",
          "type": "string",
          "values": ["xs", "sm", "md", "lg", "xl", "2xl"],
          "description": "Text size"
        }
      ]
    },
    {
      "tagName": "nimbus-text",
      "description": "Text content component",
      "category": "typography",
      "attributes": [
        {
          "name": "font-size",
          "type": "string",
          "description": "Font size token (e.g., 'sm', 'md', 'lg')"
        },
        {
          "name": "font-weight",
          "type": "string",
          "values": ["normal", "medium", "semibold", "bold"],
          "description": "Font weight"
        },
        {
          "name": "color",
          "type": "string",
          "description": "Text color (e.g., 'primary.11', 'neutral.12')"
        }
      ]
    },
    {
      "tagName": "nimbus-badge",
      "description": "Badge component for status/labels",
      "category": "display",
      "attributes": [
        {
          "name": "color-palette",
          "type": "string",
          "values": ["primary", "positive", "critical", "warning", "neutral"],
          "description": "Color scheme"
        }
      ]
    },
    {
      "tagName": "nimbus-button",
      "description": "Interactive button component",
      "category": "interactive",
      "attributes": [
        {
          "name": "variant",
          "type": "string",
          "values": ["solid", "outline", "ghost"],
          "description": "Button style variant"
        },
        {
          "name": "color-palette",
          "type": "string",
          "values": ["primary", "positive", "critical", "neutral"],
          "description": "Color scheme"
        },
        {
          "name": "width",
          "type": "string",
          "values": ["auto", "full"],
          "description": "Button width"
        }
      ],
      "events": [
        {
          "name": "press",
          "description": "Triggered when button is clicked"
        }
      ]
    }
  ]
}
```

**Server serves this manifest via `/elements` endpoint** (see server
implementation below).

### 5. Client Integration with Nimbus Component Library

**Client defines Nimbus component library for `UIResourceRenderer`**:

```typescript
import { ComponentLibrary } from "@mcp-ui/client";
import * as Nimbus from "@commercetools/nimbus";

// Define Nimbus component library
export const nimbusLibrary: ComponentLibrary = {
  name: "nimbus",
  elements: [
    {
      tagName: "nimbus-card",
      component: Nimbus.Card.Root,
      propMapping: {
        variant: "variant",
        "max-width": "maxWidth",
      },
    },
    {
      tagName: "nimbus-card-body",
      component: Nimbus.Card.Body,
      propMapping: {},
    },
    {
      tagName: "nimbus-heading",
      component: Nimbus.Heading,
      propMapping: {
        size: "size",
      },
    },
    {
      tagName: "nimbus-text",
      component: Nimbus.Text,
      propMapping: {
        "font-size": "fontSize",
        "font-weight": "fontWeight",
        color: "color",
      },
    },
    {
      tagName: "nimbus-badge",
      component: Nimbus.Badge,
      propMapping: {
        "color-palette": "colorPalette",
      },
    },
    {
      tagName: "nimbus-button",
      component: Nimbus.Button,
      propMapping: {
        variant: "variant",
        "color-palette": "colorPalette",
        width: "width",
      },
      eventMapping: {
        press: "onClick",
      },
    },
  ],
};

// Define remote element configurations
export const nimbusRemoteElements = [
  {
    tagName: "nimbus-card",
    properties: {
      variant: { type: "string" },
      "max-width": { type: "string" },
    },
  },
  {
    tagName: "nimbus-heading",
    properties: {
      size: { type: "string" },
    },
  },
  {
    tagName: "nimbus-button",
    properties: {
      variant: { type: "string" },
      "color-palette": { type: "string" },
      width: { type: "string" },
    },
    events: {
      press: { type: "event" },
    },
  },
  // ... more element definitions
];
```

### 6. Client Rendering with UIResourceRenderer

**Client uses `UIResourceRenderer` to render MCP-UI resources**:

```typescript
import { UIResourceRenderer, isUIResource } from '@mcp-ui/client';
import { nimbusLibrary, nimbusRemoteElements } from './nimbus-library';

function ChatMessage({ message }: { message: Message }) {
  // Check if message contains a UIResource
  if (message.uiResource && isUIResource(message.uiResource)) {
    return (
      <Box padding="400">
        <UIResourceRenderer
          resource={message.uiResource}
          remoteDomProps={{
            library: nimbusLibrary,
            remoteElements: nimbusRemoteElements
          }}
        />
      </Box>
    );
  }

  // Regular text message
  return <Text>{message.content}</Text>;
}
```

## Implementation Details

### Server: Express with MCP Protocol (`server/src/index.ts`)

**Key Pattern**: The server implements the MCP (Model Context Protocol) using
session-based transports. The only non-MCP endpoint is `/elements` for client
component library validation.

```typescript
import express from "express";
import cors from "cors";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { createUIResource } from "@mcp-ui/server";
import { randomUUID } from "crypto";
import elementsManifest from "./elements-manifest.json";
import { createProductCard } from "./tools/product-card";
import { createForm } from "./tools/form";
import { createDataTable } from "./tools/data-table";

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration for MCP protocol
app.use(
  cors({
    origin: "*",
    exposedHeaders: ["Mcp-Session-Id"],
    allowedHeaders: ["Content-Type", "mcp-session-id"],
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
        "Creates a product card UI component with name, price, image, and stock status using Nimbus design system components.",
      inputSchema: {
        type: "object",
        required: ["productName", "price"],
        properties: {
          productName: {
            type: "string",
            description: "The name of the product",
          },
          price: {
            type: "string",
            description: "The price of the product (e.g., '$999')",
          },
          imageUrl: {
            type: "string",
            description: "Optional URL to product image",
          },
          inStock: {
            type: "boolean",
            description: "Whether the product is in stock (default: true)",
          },
        },
      },
    },
    async (args: any) => {
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
      inputSchema: {
        type: "object",
        required: ["fields"],
        properties: {
          title: {
            type: "string",
            description: "Form title",
          },
          fields: {
            type: "array",
            description: "Array of form fields",
            items: {
              type: "object",
              required: ["name", "label"],
              properties: {
                name: {
                  type: "string",
                  description: "Field name",
                },
                label: {
                  type: "string",
                  description: "Field label",
                },
                type: {
                  type: "string",
                  enum: ["text", "email", "number", "textarea"],
                  description: "Field type (default: text)",
                },
                required: {
                  type: "boolean",
                  description: "Whether field is required",
                },
              },
            },
          },
          submitLabel: {
            type: "string",
            description: "Submit button label (default: 'Submit')",
          },
        },
      },
    },
    async (args: any) => {
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
      inputSchema: {
        type: "object",
        required: ["columns", "data"],
        properties: {
          title: {
            type: "string",
            description: "Table title",
          },
          columns: {
            type: "array",
            description: "Array of column definitions",
            items: {
              type: "object",
              required: ["key", "label"],
              properties: {
                key: {
                  type: "string",
                  description: "Column key (matches data object keys)",
                },
                label: {
                  type: "string",
                  description: "Column header label",
                },
              },
            },
          },
          data: {
            type: "array",
            description: "Array of data objects",
            items: {
              type: "object",
            },
          },
        },
      },
    },
    async (args: any) => {
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
```

**Key Implementation Details:**

1. **Pure MCP Protocol**: All tool discovery and execution happens via MCP
   protocol
2. **Session Management**: Each client connection creates a unique session with
   its own `McpServer` instance
3. **Transport Layer**: `StreamableHTTPServerTransport` handles HTTP-based MCP
   protocol communication
4. **Tool Registration**: Tools are registered on the MCP server instance using
   `server.registerTool()`
5. **Session Cleanup**: Transport cleanup handlers automatically remove closed
   sessions
6. **Element Manifest**: Single helper endpoint for client to validate Nimbus
   component library

### Server: Product Card Tool (`server/src/tools/product-card.ts`)

```typescript
import { createUIResource } from "@mcp-ui/server";

export interface ProductCardArgs {
  productName: string;
  price: string;
  imageUrl?: string;
  inStock?: boolean;
}

export function createProductCard(args: ProductCardArgs) {
  const { productName, price, imageUrl, inStock = true } = args;

  // Escape strings for JavaScript
  const escapedName = productName.replace(/'/g, "\\'");
  const escapedPrice = price.replace(/'/g, "\\'");

  const remoteDomScript = `
    // Create Nimbus card structure
    const card = document.createElement('nimbus-card');
    card.setAttribute('variant', 'elevated');
    card.setAttribute('max-width', '400px');

    const cardBody = document.createElement('nimbus-card-body');

    ${
      imageUrl
        ? `
    const image = document.createElement('nimbus-image');
    image.setAttribute('src', '${imageUrl}');
    image.setAttribute('alt', '${escapedName}');
    image.setAttribute('border-radius', '200');
    image.setAttribute('margin-bottom', '400');
    cardBody.appendChild(image);
    `
        : ""
    }

    const heading = document.createElement('nimbus-heading');
    heading.setAttribute('size', 'lg');
    heading.setAttribute('margin-bottom', '200');
    heading.textContent = '${escapedName}';

    const price = document.createElement('nimbus-text');
    price.setAttribute('font-size', 'xl');
    price.setAttribute('font-weight', 'bold');
    price.setAttribute('color', 'primary.11');
    price.setAttribute('margin-bottom', '300');
    price.textContent = '${escapedPrice}';

    const badge = document.createElement('nimbus-badge');
    badge.setAttribute('color-palette', '${inStock ? "positive" : "critical"}');
    badge.setAttribute('margin-bottom', '400');
    badge.textContent = '${inStock ? "In Stock" : "Out of Stock"}';

    const button = document.createElement('nimbus-button');
    button.setAttribute('variant', 'solid');
    button.setAttribute('color-palette', 'primary');
    button.setAttribute('width', 'full');
    ${!inStock ? "button.setAttribute('is-disabled', 'true');" : ""}
    button.textContent = 'Add to Cart';

    // Build structure
    cardBody.appendChild(heading);
    cardBody.appendChild(price);
    cardBody.appendChild(badge);
    cardBody.appendChild(button);
    card.appendChild(cardBody);
    root.appendChild(card);
  `;

  return createUIResource({
    uri: `ui://product-card/${Date.now()}`,
    content: {
      type: "remoteDom",
      script: remoteDomScript,
      framework: "react",
    },
    encoding: "text",
    metadata: {
      title: "Product Card",
      description: `Product card for ${productName}`,
      created: new Date().toISOString(),
    },
  });
}
```

### Client: Nimbus Component Library (`client/src/components/nimbus-library.tsx`)

```typescript
import type {
  ComponentLibrary,
  RemoteElementConfiguration,
} from "@mcp-ui/client";
import * as Nimbus from "@commercetools/nimbus";

export const nimbusLibrary: ComponentLibrary = {
  name: "nimbus",
  elements: [
    // Card components
    {
      tagName: "nimbus-card",
      component: Nimbus.Card.Root,
      propMapping: {
        variant: "variant",
        "max-width": "maxWidth",
      },
    },
    {
      tagName: "nimbus-card-body",
      component: Nimbus.Card.Body,
      propMapping: {},
    },

    // Typography
    {
      tagName: "nimbus-heading",
      component: Nimbus.Heading,
      propMapping: {
        size: "size",
        "margin-bottom": "marginBottom",
      },
    },
    {
      tagName: "nimbus-text",
      component: Nimbus.Text,
      propMapping: {
        "font-size": "fontSize",
        "font-weight": "fontWeight",
        color: "color",
        "margin-bottom": "marginBottom",
      },
    },

    // Interactive components
    {
      tagName: "nimbus-button",
      component: Nimbus.Button,
      propMapping: {
        variant: "variant",
        "color-palette": "colorPalette",
        width: "width",
        "is-disabled": "isDisabled",
      },
      eventMapping: {
        press: "onClick",
      },
    },
    {
      tagName: "nimbus-badge",
      component: Nimbus.Badge,
      propMapping: {
        "color-palette": "colorPalette",
        "margin-bottom": "marginBottom",
      },
    },

    // Media
    {
      tagName: "nimbus-image",
      component: Nimbus.Image,
      propMapping: {
        src: "src",
        alt: "alt",
        "border-radius": "borderRadius",
        "margin-bottom": "marginBottom",
      },
    },

    // Layout
    {
      tagName: "nimbus-stack",
      component: Nimbus.Stack,
      propMapping: {
        direction: "direction",
        gap: "gap",
      },
    },
    {
      tagName: "nimbus-flex",
      component: Nimbus.Flex,
      propMapping: {
        direction: "direction",
        gap: "gap",
      },
    },
  ],
};

export const nimbusRemoteElements: RemoteElementConfiguration[] = [
  {
    tagName: "nimbus-card",
    properties: {
      variant: { type: "string" },
      "max-width": { type: "string" },
    },
  },
  {
    tagName: "nimbus-heading",
    properties: {
      size: { type: "string" },
      "margin-bottom": { type: "string" },
    },
  },
  {
    tagName: "nimbus-text",
    properties: {
      "font-size": { type: "string" },
      "font-weight": { type: "string" },
      color: { type: "string" },
      "margin-bottom": { type: "string" },
    },
  },
  {
    tagName: "nimbus-button",
    properties: {
      variant: { type: "string" },
      "color-palette": { type: "string" },
      width: { type: "string" },
      "is-disabled": { type: "boolean" },
    },
    events: {
      press: { type: "event" },
    },
  },
  {
    tagName: "nimbus-badge",
    properties: {
      "color-palette": { type: "string" },
      "margin-bottom": { type: "string" },
    },
  },
  {
    tagName: "nimbus-image",
    properties: {
      src: { type: "string" },
      alt: { type: "string" },
      "border-radius": { type: "string" },
      "margin-bottom": { type: "string" },
    },
  },
];
```

### Client: Gemini Client with MCP (`client/src/lib/gemini-client.ts`)

```typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { GoogleGenAI, mcpToTool } from "@google/genai";
import type { UIResource } from "@mcp-ui/client";

const MCP_SERVER_URL =
  import.meta.env.VITE_MCP_SERVER_URL || "http://localhost:3001";

export class GeminiClient {
  private model;
  private chat;
  private mcpClient: Client;

  async initialize() {
    // Create MCP client and connect to server
    this.mcpClient = new Client({
      name: "nimbus-mcp-ui-poc",
      version: "1.0.0",
    });

    const transport = new StreamableHTTPClientTransport(
      new URL(`${MCP_SERVER_URL}/mcp`)
    );

    await this.mcpClient.connect(transport);
    console.log("✅ MCP client connected to server");

    // Initialize Gemini with MCP tools
    const genAI = new GoogleGenAI(import.meta.env.VITE_GEMINI_API_KEY);

    this.model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      tools: [mcpToTool(this.mcpClient)], // Convert MCP client to Gemini tools
    });

    this.chat = this.model.startChat();
    console.log("✅ Gemini initialized with MCP tools");
  }

  async sendMessage(message: string) {
    if (!this.chat) {
      throw new Error("Gemini client not initialized");
    }

    // Send message - Gemini automatically calls MCP tools via mcpClient
    const result = await this.chat.sendMessage(message);
    const response = await result.response;

    return {
      text: response.text(),
      // Extract UIResource instances from MCP tool responses
      uiResources: this.extractUIResources(response),
    };
  }

  private extractUIResources(response: any): UIResource[] {
    // Extract UIResource objects from Gemini's response
    // Tool calls are automatically executed by Gemini SDK via MCP protocol
    const functionCalls = response.functionCalls || [];
    const uiResources: UIResource[] = [];

    for (const call of functionCalls) {
      // MCP tool responses contain UIResource objects
      if (call.response?.uri?.startsWith("ui://")) {
        uiResources.push(call.response as UIResource);
      }
    }

    return uiResources;
  }

  async cleanup() {
    // Close MCP connection
    if (this.mcpClient) {
      await this.mcpClient.close();
      console.log("🔌 MCP client disconnected");
    }
  }
}
```

### Client: Chat Interface (`client/src/components/chat-interface.tsx`)

```typescript
import { useState, useEffect } from 'react';
import { Box, Stack, Flex, Heading, Button, Input, Text } from '@commercetools/nimbus';
import { UIResourceRenderer, isUIResource, type UIResource } from '@mcp-ui/client';
import { GeminiClient } from '../lib/gemini-client';
import { nimbusLibrary, nimbusRemoteElements } from './nimbus-library';
import { validateNimbusLibrary } from '../lib/nimbus-library';

interface Message {
  role: 'user' | 'assistant';
  content?: string;
  uiResources?: UIResource[];
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [geminiClient] = useState(() => new GeminiClient());
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  // Initialize: validate element manifest, then Gemini
  useEffect(() => {
    async function init() {
      try {
        // 1. Validate element manifest
        const serverUrl = import.meta.env.VITE_MCP_SERVER_URL || 'http://localhost:3001';
        await validateNimbusLibrary(serverUrl);
        console.log('✅ Element manifest validated successfully');

        // 2. Initialize Gemini with OpenAPI spec
        await geminiClient.initialize();
        setIsReady(true);
      } catch (error) {
        console.error('❌ Initialization failed:', error);
        setInitError(error.message);
      }
    }
    init();
  }, []);

  async function handleSendMessage() {
    if (!input.trim() || !isReady) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Send message - ADK handles all tool calling automatically
      const { text, uiResources } = await geminiClient.sendMessage(input);

      // Add response to messages
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: text,
        uiResources
      }]);

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${error.message}`
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  // Show initialization error if present
  if (initError) {
    return (
      <Flex direction="column" height="100vh" padding="600" alignItems="center" justifyContent="center">
        <Box
          padding="600"
          backgroundColor="critical.2"
          borderRadius="200"
          maxWidth="600px"
        >
          <Heading size="md" marginBottom="400" color="critical.11">
            Initialization Error
          </Heading>
          <Text color="critical.11">{initError}</Text>
          <Text marginTop="300" fontSize="sm" color="critical.10">
            Make sure the MCP-UI server is running and the element manifest is valid.
          </Text>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex direction="column" height="100vh" padding="600">
      <Heading marginBottom="600">MCP-UI + Gemini Chat</Heading>

      {!isReady && (
        <Box padding="400" backgroundColor="neutral.2" borderRadius="200" marginBottom="400">
          <Text>Initializing... Validating element manifest and connecting to Gemini</Text>
        </Box>
      )}

      <Stack
        direction="column"
        gap="400"
        flex="1"
        overflowY="auto"
        marginBottom="400"
      >
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            padding="400"
            backgroundColor={msg.role === 'user' ? 'primary.2' : 'neutral.2'}
            borderRadius="200"
          >
            <Text fontWeight="bold" marginBottom="200">
              {msg.role === 'user' ? 'You' : 'Assistant'}
            </Text>

            {msg.content && <Text>{msg.content}</Text>}

            {msg.uiResources?.map((resource, i) => (
              <Box key={i} marginTop="300">
                <UIResourceRenderer
                  resource={resource}
                  remoteDomProps={{
                    library: nimbusLibrary,
                    remoteElements: nimbusRemoteElements
                  }}
                />
              </Box>
            ))}
          </Box>
        ))}
      </Stack>

      <Flex gap="300">
        <Input
          flex="1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask Gemini to create UI components..."
          isDisabled={isLoading || !isReady}
        />
        <Button
          onClick={handleSendMessage}
          isDisabled={isLoading || !isReady || !input.trim()}
          variant="solid"
          colorPalette="primary"
        >
          Send
        </Button>
      </Flex>
    </Flex>
  );
}
```

### Client: Modified App (`client/src/app.tsx`)

```typescript
import { ChatInterface } from './components/chat-interface';

export const App = () => {
  return <ChatInterface />;
};
```

## Key Benefits of This Architecture

1. **Pure MCP Protocol** - Uses `@modelcontextprotocol/sdk` for proper session
   management and transport
2. **MCP-UI Integration** - Leverages `@mcp-ui/server` for UIResource creation
   with Remote DOM
3. **Session Isolation** - Each client gets its own `McpServer` instance with
   separate state
4. **Native Gemini Support** - Gemini has built-in MCP support via `mcpToTool()`
   helper function
5. **Remote DOM Pattern** - Server creates UI as Remote DOM scripts, client
   renders with real Nimbus components
6. **Component Library Reuse** - Nimbus components mapped directly without
   custom rendering code
7. **Type Safety** - Full TypeScript support throughout stack
8. **Stateful Communication** - Long-lived sessions via
   `StreamableHTTPServerTransport`
9. **Framework Agnostic Server** - Server generates Remote DOM, client handles
   React rendering
10. **Simplified Architecture** - No OpenAPI layer needed, pure MCP tool
    discovery and execution

## Deployment

### Server (Vercel)

**`server/vercel.json`:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.ts"
    }
  ]
}
```

### Client (Vercel/Netlify)

**Environment Variables:**

- `VITE_GEMINI_API_KEY` - Google Gemini API key
- `VITE_MCP_SERVER_URL` - Deployed MCP-UI server URL

## Development Workflow

### 1. Server Development

```bash
cd apps/mcp-ui-poc/server
pnpm install
pnpm dev  # Runs on http://localhost:3001

# Visit Swagger docs at http://localhost:3001/docs
```

### 2. Client Development

```bash
cd apps/mcp-ui-poc/client
pnpm install
# Create .env file with:
# VITE_GEMINI_API_KEY=your-api-key
# VITE_MCP_SERVER_URL=http://localhost:3001
pnpm dev  # Runs on http://localhost:5173
```

### 3. Testing the Integration

1. Start the MCP-UI server
2. Verify element manifest at <http://localhost:3001/elements>
3. Start the client
4. Open <http://localhost:5173>
5. Watch console for:
   - Element manifest validation: "✅ Element manifest validated successfully"
   - MCP client connection: "✅ MCP client connected to server"
   - Gemini initialization: "✅ Gemini initialized with MCP tools"
6. Type: "Create a product card for a laptop that costs $999"
7. Gemini will automatically:
   - Discover tools via MCP `tools/list`
   - Call `createProductCard` tool via MCP `tools/call`
8. Client will render the UIResource using `UIResourceRenderer` with Nimbus
   components

## Success Criteria

### Server Implementation

- [ ] MCP protocol endpoints: `POST /mcp`, `GET /mcp`, `DELETE /mcp`
- [ ] Session management with `StreamableHTTPServerTransport`
- [ ] Unique session IDs generated with `randomUUID()`
- [ ] Session cleanup on transport close
- [ ] Tools registered on `McpServer` instances (not Express routes)
- [ ] Helper endpoint `/elements` with element manifest
- [ ] All tools return UIResource instances via MCP protocol

### Client Implementation

- [ ] Validates element manifest on startup
- [ ] Shows clear error if manifest validation fails
- [ ] Creates MCP client with `StreamableHTTPClientTransport`
- [ ] Initializes Gemini with `mcpToTool(mcpClient)`
- [ ] MCP client connects to server via MCP protocol
- [ ] Sessions properly initialized and maintained
- [ ] Receives UIResource instances from tool calls
- [ ] Uses `UIResourceRenderer` with Nimbus component library
- [ ] Remote DOM renders as real Nimbus components

### Integration

- [ ] Gemini discovers tools via MCP `tools/list`
- [ ] Gemini autonomously calls correct tools via MCP `tools/call`
- [ ] Tool calls routed through MCP protocol
- [ ] Session state maintained across tool calls
- [ ] No session leaks or orphaned transports

### Deployment

- [ ] Works locally with `pnpm dev`
- [ ] Server deploys to Vercel
- [ ] Client deploys to Vercel/Netlify
- [ ] Sessions work in deployed environment
- [ ] CORS configured correctly for production

## Minimal Tool Set

**MVP includes 3 tools:**

1. **create_product_card** - Product display with image, price, stock status
2. **create_form** - Simple form with text inputs and submit button
3. **create_data_table** - Basic data table with headers and rows

## Timeline Estimate

- **Day 1**: Server implementation + OpenAPI spec + Product Card tool (4-6
  hours)
- **Day 2**: Client setup + Nimbus library + UIResourceRenderer integration (4-6
  hours)
- **Day 3**: Additional tools (Form, DataTable) + testing (3-4 hours)
- **Day 4**: Deployment configuration + documentation (2-3 hours)

**Total: 13-19 hours of implementation time**

## References

### MCP Protocol

- [Model Context Protocol Specification](https://spec.modelcontextprotocol.io/)
- [MCP SDK for TypeScript](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP-UI TypeScript Server Demo](https://github.com/MCP-UI-Org/mcp-ui/tree/main/examples/typescript-server-demo) -
  **Primary reference implementation**
- [StreamableHTTP Transport Documentation](https://modelcontextprotocol.io/docs/concepts/transports#streamable-http)

### MCP-UI Integration

- [MCP-UI TypeScript Server Usage Examples](https://mcpui.dev/guide/server/typescript/usage-examples)
- [MCP-UI React Usage Examples](https://mcpui.dev/guide/client/react-usage-examples)
- [MCP-UI Custom Component Libraries](https://mcpui.dev/guide/client/custom-component-libraries)
- [Remote DOM Specification](https://mcpui.dev/guide/concepts/remote-dom)

### Gemini Integration

- [Gemini API with MCP Support (@google/genai)](https://www.npmjs.com/package/@google/genai) -
  Native MCP support via `mcpToTool()`
- [Function calling with the Gemini API](https://ai.google.dev/gemini-api/docs/function-calling)
- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)

## Future Enhancements (Out of Scope for MVP)

- Authentication/authorization
- Tool result caching
- More complex component compositions (dialogs, forms with validation)
- Theme propagation from client to server
- WebSocket for real-time updates
- Event handlers and interactivity (button clicks, form submissions)
- Error boundary components
- Loading states during tool execution
- Undo/redo for tool results
