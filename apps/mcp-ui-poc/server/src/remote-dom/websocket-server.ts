/**
 * WebSocket Server for Remote DOM Protocol Streaming
 *
 * Broadcasts Remote DOM protocol messages to connected clients in real-time
 */

import { WebSocketServer, type WebSocket } from "ws";
import type { Server } from "http";

/**
 * Remote DOM protocol message (from environment)
 */
interface RemoteDomProtocolMessage {
  type: "mutate" | "call";
  mutations?: unknown[];
  id?: string;
  method?: string;
  args?: unknown[];
  uri?: string; // URI to route mutations to specific receiver
}

/**
 * Tool message (MCP-UI standard format)
 */
interface ToolMessage {
  type: "tool";
  payload: {
    toolName: string;
    params: Record<string, unknown>;
  };
  messageId?: string;
}

/**
 * Action notification message (from server to browser)
 */
interface ActionNotificationMessage {
  type: "action-queued";
  action: {
    id: string;
    toolName: string;
    params: Record<string, unknown>;
  };
  timestamp: number;
}

/**
 * WebSocket wrapper messages
 */
interface RemoteDomMessage {
  type: "remote-dom";
  message: RemoteDomProtocolMessage;
  timestamp: number;
}

interface SyncRequestMessage {
  type: "sync";
}

interface SyncResponseMessage {
  type: "sync-response";
  tree: unknown;
  timestamp: number;
}

interface UiMessageReceivedMessage {
  type: "ui-message-received";
  messageId: string;
}

interface UiMessageResponseMessage {
  type: "ui-message-response";
  messageId: string;
  payload: {
    response?: unknown;
    error?: unknown;
  };
}

interface ActionResponseMessage {
  type: "action-response";
  actionId: string;
  result?: unknown;
  error?: unknown;
}

interface UriActiveMessage {
  type: "uri-active";
  uri: string;
}

interface UriInactiveMessage {
  type: "uri-inactive";
  uri: string;
}

type WSMessage =
  | RemoteDomMessage
  | SyncRequestMessage
  | SyncResponseMessage
  | ActionNotificationMessage
  | ToolMessage
  | UiMessageReceivedMessage
  | UiMessageResponseMessage
  | ActionResponseMessage
  | UriActiveMessage
  | UriInactiveMessage;

/**
 * Tool handler type (MCP-UI standard)
 * Returns a response object or void
 */
type ToolHandler = (
  toolName: string,
  params: Record<string, unknown>
) => Promise<unknown> | unknown;

/**
 * WebSocket manager for mutation streaming and client events
 */
export class MutationStreamServer {
  private wss: WebSocketServer;
  private clients = new Set<WebSocket>();
  private mutationHistory: RemoteDomProtocolMessage[] = [];
  private toolHandlers = new Map<string, ToolHandler>();
  private activeUris = new Set<string>(); // Track which URIs are currently active

  constructor(server: Server) {
    // Create WebSocket server on /ws path
    this.wss = new WebSocketServer({
      server,
      path: "/ws",
    });

    this.wss.on("connection", (ws: WebSocket) => {
      console.log("🔌 WebSocket client connected");
      this.clients.add(ws);

      ws.on("message", (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString()) as WSMessage;
          this.handleClientMessage(ws, message);
        } catch (error) {
          console.error("❌ Error parsing WebSocket message:", error);
        }
      });

      ws.on("close", () => {
        console.log("🔌 WebSocket client disconnected");
        this.clients.delete(ws);
      });

      ws.on("error", (error) => {
        console.error("❌ WebSocket error:", error);
        this.clients.delete(ws);
      });

      // Send mutation history for active URIs only
      const activeMutations = this.mutationHistory.filter(
        (msg) => !msg.uri || this.activeUris.has(msg.uri)
      );

      console.log(
        `📤 Sending ${activeMutations.length} active mutations (out of ${this.mutationHistory.length} total) to new client`
      );
      console.log(`📍 Active URIs: ${Array.from(this.activeUris).join(", ")}`);

      // Send only active mutations to sync the client
      activeMutations.forEach((message) => {
        this.sendToClient(ws, {
          type: "remote-dom",
          message,
          timestamp: Date.now(),
        });
      });

      // Send sync confirmation
      this.sendToClient(ws, {
        type: "sync-response",
        tree: null,
        timestamp: Date.now(),
      });
    });

    console.log("✅ WebSocket server initialized on /ws");
  }

  /**
   * Handle messages from clients
   */
  private async handleClientMessage(ws: WebSocket, message: WSMessage) {
    if (message.type === "sync") {
      // Client requesting full state sync
      console.log("🔄 Client requested state sync");
      // The environment will handle sending the sync response
    } else if (message.type === "uri-active") {
      // Client notifying that a URI is now active (component mounted)
      console.log(`📍 Client marked URI as active: ${message.uri}`);
      this.markUriActive(message.uri);
    } else if (message.type === "uri-inactive") {
      // Client notifying that a URI is now inactive (component unmounted)
      console.log(`📍 Client marked URI as inactive: ${message.uri}`);
      this.markUriInactive(message.uri);
    } else if (message.type === "action-response") {
      // Handle action completion response from client
      const { actionId, result, error } = message;
      console.log(`📬 Action response received: ${actionId}`);

      // Import and call the handler
      const { handleActionResponse } = await import("../utils/action-queue.js");
      handleActionResponse(actionId, result, error);
    } else if (message.type === "tool") {
      // Handle tool message (MCP-UI standard)
      const { toolName, params } = message.payload;
      const { messageId } = message;

      console.log(`📥 Tool message received: ${toolName}`, {
        messageId,
        params,
      });

      // Stage 1: Send acknowledgment if messageId provided
      if (messageId) {
        this.sendToClient(ws, {
          type: "ui-message-received",
          messageId,
        });
        console.log(`✅ Acknowledgment sent for messageId: ${messageId}`);
      }

      // Execute tool handler
      const handler = this.toolHandlers.get(toolName);
      if (handler) {
        try {
          const response = await handler(toolName, params);

          // Stage 2: Send response if messageId provided
          if (messageId) {
            this.sendToClient(ws, {
              type: "ui-message-response",
              messageId,
              payload: { response },
            });
            console.log(`✅ Response sent for messageId: ${messageId}`);
          }
        } catch (error) {
          console.error(`❌ Error handling tool ${toolName}:`, error);

          // Stage 2: Send error response if messageId provided
          if (messageId) {
            this.sendToClient(ws, {
              type: "ui-message-response",
              messageId,
              payload: {
                error: {
                  message:
                    error instanceof Error ? error.message : "Unknown error",
                  stack: error instanceof Error ? error.stack : undefined,
                },
              },
            });
          }
        }
      } else {
        console.warn(`⚠️ No handler registered for tool: ${toolName}`);

        // Send error response for unregistered tool
        if (messageId) {
          this.sendToClient(ws, {
            type: "ui-message-response",
            messageId,
            payload: {
              error: {
                message: `No handler registered for tool: ${toolName}`,
              },
            },
          });
        }
      }
    }
  }

  /**
   * Register a handler for a specific tool (MCP-UI standard)
   */
  registerToolHandler(toolName: string, handler: ToolHandler) {
    console.log(`📝 Registering tool handler for: ${toolName}`);
    this.toolHandlers.set(toolName, handler);
  }

  /**
   * Unregister a tool handler
   */
  unregisterToolHandler(toolName: string) {
    this.toolHandlers.delete(toolName);
  }

  /**
   * Mark a URI as active (has rendered component)
   */
  markUriActive(uri: string) {
    if (!this.activeUris.has(uri)) {
      this.activeUris.add(uri);
      console.log(`✅ Marked URI as active: ${uri}`);
    }
  }

  /**
   * Mark a URI as inactive (component destroyed)
   */
  markUriInactive(uri: string) {
    if (this.activeUris.has(uri)) {
      this.activeUris.delete(uri);
      console.log(`❌ Marked URI as inactive: ${uri}`);

      // Clean up mutations for inactive URI
      this.mutationHistory = this.mutationHistory.filter(
        (msg) => msg.uri !== uri
      );
      console.log(`🧹 Cleaned up mutation history for ${uri}`);
    }
  }

  /**
   * Broadcast Remote DOM protocol message to all connected clients
   */
  broadcastRemoteDomMessage(message: RemoteDomProtocolMessage) {
    // Mark URI as active when mutations are sent
    if (message.uri) {
      this.markUriActive(message.uri);
    }

    // Store in history for new connections
    this.mutationHistory.push(message);

    const wsMessage: RemoteDomMessage = {
      type: "remote-dom",
      message,
      timestamp: Date.now(),
    };

    console.log(
      `📡 Broadcasting Remote DOM ${message.type} to ${this.clients.size} clients for URI: ${message.uri || "unknown"}`
    );

    this.clients.forEach((client) => {
      if (client.readyState === 1) {
        // WebSocket.OPEN
        this.sendToClient(client, wsMessage);
      }
    });
  }

  /**
   * Clear mutation history (useful for reset)
   */
  clearHistory() {
    this.mutationHistory = [];
  }

  /**
   * Send message to a specific client
   */
  private sendToClient(ws: WebSocket, message: WSMessage) {
    try {
      ws.send(JSON.stringify(message));
    } catch (error) {
      console.error("❌ Error sending WebSocket message:", error);
    }
  }

  /**
   * Send full tree sync to a specific client
   */
  sendSync(ws: WebSocket, tree: unknown) {
    const message: SyncResponseMessage = {
      type: "sync-response",
      tree,
      timestamp: Date.now(),
    };
    this.sendToClient(ws, message);
  }

  /**
   * Broadcast action notification to all connected clients
   */
  broadcastActionNotification(action: {
    id: string;
    toolName: string;
    params: Record<string, unknown>;
  }) {
    const message: ActionNotificationMessage = {
      type: "action-queued",
      action,
      timestamp: Date.now(),
    };

    console.log(
      `📡 Broadcasting action notification to ${this.clients.size} clients`
    );

    this.clients.forEach((client) => {
      if (client.readyState === 1) {
        this.sendToClient(client, message);
      }
    });
  }

  /**
   * Get number of connected clients
   */
  getClientCount(): number {
    return this.clients.size;
  }
}
