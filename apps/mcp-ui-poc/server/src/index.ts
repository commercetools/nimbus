import express from "express";
import cors from "cors";
import { createServer } from "http";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { randomUUID } from "crypto";
import * as toolRegistrations from "./tools/index.js";
import { registerResources } from "./resources/index.js";
import { MutationStreamServer } from "./remote-dom/websocket-server.js";
import {
  setMessageSender,
  setHistoryClearer,
} from "./remote-dom/environment.js";
import { setActionBroadcaster } from "./utils/action-queue.js";
import { initializeToaster, getToasterUri } from "./utils/toaster.js";

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
// HEALTH ENDPOINT (for Kubernetes probes)
// ============================================================

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    server: "nimbus-mcp-ui-server",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    activeSessions: Object.keys(transports).length,
  });
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
  } else if (sessionId && !transports[sessionId]) {
    // Session ID provided but doesn't exist - session expired or server restarted
    console.log(`❌ Invalid session ID ${sessionId} - session not found`);
    return res.status(404).json({
      jsonrpc: "2.0",
      error: {
        code: -32001,
        message: "Session not found. Please reconnect.",
      },
      id: req.body.id || null,
    });
  } else if (isInitializeRequest(req.body)) {
    // New session initialization request
    console.log(`🆕 Creating new MCP session...`);

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
    // No session ID and not an initialization request
    console.log(`❌ No session ID provided and not an initialization request`);
    return res.status(400).json({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message:
          "Bad Request: No session ID provided. Please initialize a session first.",
      },
      id: req.body.id || null,
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

// Create HTTP server
const httpServer = createServer(app);

// Initialize WebSocket server for Remote DOM protocol streaming
const mutationServer = new MutationStreamServer(httpServer);

// Export mutationServer for event handler registration
export { mutationServer };

function registerTools(server: McpServer) {
  // Register MCP resources (design tokens, style system docs)
  registerResources(server);

  // Tools that need mutationServer for event handling
  const interactiveTools = ["registerDataTableTool", "registerButtonTool", "registerSwitchTool"];

  // Register all colocated tool definitions
  Object.entries(toolRegistrations).forEach(([name, registerFn]) => {
    if (typeof registerFn === "function") {
      // Pass mutationServer to interactive tools
      if (interactiveTools.includes(name)) {
        (registerFn as (s: McpServer, m: typeof mutationServer) => void)(
          server,
          mutationServer
        );
      } else {
        (registerFn as (s: McpServer) => void)(server);
      }
    }
  });
}

// Connect Remote DOM message sender to WebSocket broadcaster
setMessageSender((message) => {
  mutationServer.broadcastRemoteDomMessage(message);
});

// Connect Remote DOM history clearer to WebSocket mutation history reset
setHistoryClearer(() => {
  mutationServer.clearHistory();
});

// Connect action queue to WebSocket broadcaster
setActionBroadcaster((action) => {
  mutationServer.broadcastActionNotification({
    id: action.id,
    toolName: action.toolName,
    params: action.params,
  });
});

// Initialize global toaster for notifications
initializeToaster();

// Mark toaster as always active (persists across sessions)
mutationServer.markUriActive(getToasterUri());

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 MCP-UI Server running on port ${PORT}`);
  console.log(`💚 Health endpoint: http://localhost:${PORT}/health`);
  console.log(`🔌 MCP endpoint: http://localhost:${PORT}/mcp`);
  console.log(`⚡ WebSocket endpoint: ws://localhost:${PORT}/ws`);
});
