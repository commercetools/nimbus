/**
 * Hook to wire WebSocket to RemoteReceiver.connection
 *
 * This creates a bridge between WebSocket messages and Remote DOM protocol,
 * enabling live updates from the server's Remote DOM environment.
 *
 * **Multi-receiver architecture with buffering:**
 * - Messages include URI to identify which receiver to route to
 * - Each receiver is registered with its URI
 * - Mutations that arrive before receiver registration are buffered
 * - Buffered mutations are replayed when receiver registers
 *
 * **Handles race conditions:**
 * - Tool creates UI → mutations sent immediately
 * - React renders → receiver created later
 * - Buffer ensures mutations aren't lost during this gap
 */

import { useEffect, useRef } from "react";
import type { RemoteReceiver } from "@remote-dom/react/host";
import type { RemoteMutationRecord } from "@remote-dom/core";

interface RemoteDomProtocolMessage {
  type: "mutate" | "call";
  mutations?: RemoteMutationRecord[];
  id?: string;
  method?: string;
  args?: unknown[];
  uri?: string; // URI to route mutations to specific receiver
}

interface RemoteDomWebSocketMessage {
  type: "remote-dom";
  message: RemoteDomProtocolMessage;
  timestamp: number;
}

interface SyncResponseMessage {
  type: "sync-response";
  tree: unknown;
  timestamp: number;
}

interface ActionQueuedMessage {
  type: "action-queued";
  action: {
    id: string;
    toolName: string;
    params: Record<string, unknown>;
  };
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

type WSMessage =
  | RemoteDomWebSocketMessage
  | SyncResponseMessage
  | ActionQueuedMessage
  | UiMessageReceivedMessage
  | UiMessageResponseMessage;

// Global registry: Map URIs to their receivers for mutation routing
const receiversByUri = new Map<string, RemoteReceiver>();

// Buffer for mutations that arrive before receiver is registered
const mutationBufferByUri = new Map<string, RemoteDomProtocolMessage[]>();

// Track if connection is already established (singleton WebSocket)
let globalWs: WebSocket | null = null;
let connectionInitialized = false;

// Callback for action notifications
let actionQueuedCallback:
  | ((action: ActionQueuedMessage["action"]) => void)
  | null = null;

/**
 * Register callback for when actions are queued from UI interactions
 */
export function onActionQueued(
  callback: (action: ActionQueuedMessage["action"]) => void
) {
  actionQueuedCallback = callback;
}

// Pending request tracking for async responses
interface PendingRequest {
  resolve: (response: unknown) => void;
  reject: (error: unknown) => void;
  timestamp: number;
}

const pendingRequests = new Map<string, PendingRequest>();

// Generate unique message IDs using crypto.randomUUID()
function generateMessageId(): string {
  return crypto.randomUUID();
}

/**
 * Register a receiver with its URI for mutation routing
 * Replays any buffered mutations that arrived before registration
 */
function registerReceiver(uri: string, receiver: RemoteReceiver) {
  console.log(`📝 Registering receiver for URI: ${uri}`);
  receiversByUri.set(uri, receiver);

  // Notify server that this URI is now active
  if (globalWs && globalWs.readyState === WebSocket.OPEN) {
    globalWs.send(JSON.stringify({ type: "uri-active", uri }));
    console.log(`📍 Notified server: URI active - ${uri}`);
  }

  // Replay any buffered mutations for this URI
  const bufferedMutations = mutationBufferByUri.get(uri);
  if (bufferedMutations && bufferedMutations.length > 0) {
    console.log(
      `🔄 Replaying ${bufferedMutations.length} buffered mutations for ${uri}`
    );

    bufferedMutations.forEach((msg) => {
      if (msg.type === "mutate" && msg.mutations) {
        console.log(`📝 Replaying ${msg.mutations.length} mutations`);
        receiver.connection.mutate(msg.mutations);
        console.log(
          `✅ After replay, receiver has ${receiver.root.children.length} children`
        );
      } else if (msg.type === "call") {
        receiver.connection.call(msg.id!, msg.method!, ...(msg.args || []));
      }
    });

    // Clear buffer after replay
    mutationBufferByUri.delete(uri);
  }
}

/**
 * Unregister a receiver
 */
function unregisterReceiver(uri: string) {
  console.log(`📝 Unregistering receiver for URI: ${uri}`);
  receiversByUri.delete(uri);

  // Notify server that this URI is now inactive (but keep it brief to avoid spam)
  // Don't notify for every React StrictMode unmount - only when truly inactive
  // The server will clean up stale URIs based on activity
  // We could add this back if needed:
  // if (globalWs && globalWs.readyState === WebSocket.OPEN) {
  //   globalWs.send(JSON.stringify({ type: "uri-inactive", uri }));
  // }

  // Keep buffer in case receiver re-registers (e.g., React StrictMode)
}

/**
 * Send action response back to server
 * Called after executing a queued action to notify server of completion
 */
export function sendActionResponse(
  actionId: string,
  result?: unknown,
  error?: unknown
): void {
  if (!globalWs || globalWs.readyState !== WebSocket.OPEN) {
    console.warn("⚠️ WebSocket not connected, cannot send action response");
    return;
  }

  const message = {
    type: "action-response",
    actionId,
    result,
    error,
  };

  console.log(`📤 Sending action response for: ${actionId}`, { result, error });
  globalWs.send(JSON.stringify(message));
}

/**
 * Send client event to server using MCP-UI standard message format
 *
 * @param toolName - The tool/action name to invoke on the server
 * @param uri - The component URI this event is for
 * @param params - Parameters for the tool
 * @param waitForResponse - Whether to wait for async response (includes messageId)
 * @returns Promise that resolves with response (if waitForResponse=true), or void
 */
export function sendClientEvent(
  toolName: string,
  uri: string,
  params: Record<string, unknown>,
  waitForResponse = false
): Promise<unknown> | void {
  if (!globalWs || globalWs.readyState !== WebSocket.OPEN) {
    console.warn("⚠️ WebSocket not connected, cannot send event");
    if (waitForResponse) {
      return Promise.reject(new Error("WebSocket not connected"));
    }
    return;
  }

  const messageId = waitForResponse ? generateMessageId() : undefined;

  // MCP-UI standard message format
  const message = {
    type: "tool",
    payload: {
      toolName,
      params: {
        ...params,
        uri, // Include URI in params for server routing
      },
    },
    ...(messageId && { messageId }),
  };

  console.log(`📤 Sending tool message: ${toolName} for ${uri}`, {
    messageId,
    params,
  });

  globalWs.send(JSON.stringify(message));

  // If waiting for response, return promise that tracks the messageId
  if (waitForResponse && messageId) {
    return new Promise((resolve, reject) => {
      pendingRequests.set(messageId, {
        resolve,
        reject,
        timestamp: Date.now(),
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        if (pendingRequests.has(messageId)) {
          pendingRequests.delete(messageId);
          reject(new Error(`Request timeout for messageId: ${messageId}`));
        }
      }, 30000);
    });
  }
}

export function useRemoteConnection(
  receiver: RemoteReceiver,
  serverUrl: string,
  uri: string
) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Register this receiver with its URI
    registerReceiver(uri, receiver);

    // Prevent duplicate connections in React StrictMode
    if (connectionInitialized) {
      console.log("♻️ Connection already initialized, skipping new WebSocket");
      return () => {
        unregisterReceiver(uri);
      };
    }

    // If connection already exists globally, reuse it
    if (globalWs && globalWs.readyState === WebSocket.OPEN) {
      console.log("♻️ Reusing existing WebSocket connection");
      wsRef.current = globalWs;
      return () => {
        unregisterReceiver(uri);
      };
    }

    connectionInitialized = true;

    const wsUrl = serverUrl.replace(/^http/, "ws") + "/ws";
    console.log("🔌 Connecting to Remote DOM WebSocket:", wsUrl);

    function connect() {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      globalWs = ws;

      ws.onopen = () => {
        console.log("✅ Remote DOM WebSocket connected");

        // Request full state sync on connect
        ws.send(JSON.stringify({ type: "sync" }));
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WSMessage;

          console.log("📨 WebSocket message received:", message.type);

          if (message.type === "remote-dom") {
            const { message: remoteDomMsg } = message;

            console.log(
              `🔄 Received Remote DOM ${remoteDomMsg.type} message for URI: ${remoteDomMsg.uri}`,
              remoteDomMsg
            );

            // Route mutation to the correct receiver based on URI
            const targetReceiver = remoteDomMsg.uri
              ? receiversByUri.get(remoteDomMsg.uri)
              : null;

            if (!targetReceiver) {
              // Receiver not registered yet - buffer the mutation
              if (remoteDomMsg.uri) {
                console.log(
                  `📦 Buffering mutation for ${remoteDomMsg.uri} (receiver not yet registered)`
                );

                const buffer = mutationBufferByUri.get(remoteDomMsg.uri) || [];
                buffer.push(remoteDomMsg);
                mutationBufferByUri.set(remoteDomMsg.uri, buffer);
              } else {
                console.warn(
                  `⚠️ No URI in mutation message - cannot buffer. Message:`,
                  remoteDomMsg
                );
              }
              return;
            }

            // Forward to target RemoteReceiver.connection
            if (remoteDomMsg.type === "mutate" && remoteDomMsg.mutations) {
              // Pass mutations directly to receiver.connection.mutate()
              // Mutations should be in Remote DOM protocol format:
              // [type: number, ...args]
              console.log(
                `📝 Processing ${remoteDomMsg.mutations.length} mutations for ${remoteDomMsg.uri}`
              );
              targetReceiver.connection.mutate(remoteDomMsg.mutations);
              console.log(
                `✅ Receiver now has ${targetReceiver.root.children.length} children`
              );
            } else if (remoteDomMsg.type === "call") {
              targetReceiver.connection.call(
                remoteDomMsg.id!,
                remoteDomMsg.method!,
                ...(remoteDomMsg.args || [])
              );
            }
          } else if (message.type === "sync-response") {
            console.log("🔄 Received full state sync from server");
            // TODO: Handle full tree sync if needed
          } else if (message.type === "action-queued") {
            console.log("🎯 Action queued notification:", message.action);
            // Notify registered callback
            if (actionQueuedCallback) {
              actionQueuedCallback(message.action);
            }
          } else if (message.type === "ui-message-received") {
            // Stage 1: Acknowledgment received
            console.log(
              `✅ Message acknowledged by server: ${message.messageId}`
            );
            // Optional: Could notify UI that request was received
          } else if (message.type === "ui-message-response") {
            // Stage 2: Response received
            console.log(`📥 Response received for: ${message.messageId}`);

            const pending = pendingRequests.get(message.messageId);
            if (pending) {
              pendingRequests.delete(message.messageId);

              if (message.payload.error) {
                console.error(
                  `❌ Tool execution error:`,
                  message.payload.error
                );
                pending.reject(message.payload.error);
              } else {
                console.log(
                  `✅ Tool execution success:`,
                  message.payload.response
                );
                pending.resolve(message.payload.response);
              }
            } else {
              console.warn(
                `⚠️ Received response for unknown messageId: ${message.messageId}`
              );
            }
          }
        } catch (error) {
          console.error("❌ Error processing Remote DOM message:", error);
        }
      };

      ws.onclose = () => {
        console.log(
          "🔌 Remote DOM WebSocket disconnected, reconnecting in 3s..."
        );

        // Clear global reference
        globalWs = null;
        connectionInitialized = false; // Allow reconnection

        // Attempt reconnection after delay
        const timeout = setTimeout(() => {
          connect();
        }, 3000);
        reconnectTimeoutRef.current = timeout;
      };

      ws.onerror = (error) => {
        console.error("❌ Remote DOM WebSocket error:", error);
      };
    }

    connect();

    // Cleanup on unmount (but keep global connection for other instances)
    return () => {
      unregisterReceiver(uri);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      // Don't close the WebSocket on unmount - let it persist for other instances
      // It will be reused by the singleton pattern
    };
  }, [receiver, serverUrl, uri]);
}
