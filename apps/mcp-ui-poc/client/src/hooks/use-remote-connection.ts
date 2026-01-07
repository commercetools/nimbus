/**
 * Hook to wire WebSocket to RemoteReceiver.connection
 *
 * Eager Receiver Architecture:
 * - When mutations arrive for unknown URI, receiver is created immediately
 * - Mutations are applied instantly (no buffering delay)
 * - When React component mounts, it reuses the pre-existing receiver
 */

import { useEffect, useRef } from "react";
import type { RemoteReceiver } from "@remote-dom/react/host";
import type { RemoteMutationRecord } from "@remote-dom/core";
import {
  getOrCreateReceiver,
  markReceiverMounted,
  unregisterReceiver as unregisterFromRegistry,
} from "./receiver-registry";

interface RemoteDomProtocolMessage {
  type: "mutate" | "call";
  mutations?: RemoteMutationRecord[];
  id?: string;
  method?: string;
  args?: unknown[];
  uri?: string;
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

// Singleton WebSocket connection
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

function generateMessageId(): string {
  return crypto.randomUUID();
}

/**
 * Send action response back to server
 */
export function sendActionResponse(
  actionId: string,
  result?: unknown,
  error?: unknown
): void {
  if (!globalWs || globalWs.readyState !== WebSocket.OPEN) {
    return;
  }

  globalWs.send(
    JSON.stringify({
      type: "action-response",
      actionId,
      result,
      error,
    })
  );
}

/**
 * Send client event to server using MCP-UI standard message format
 */
export function sendClientEvent(
  toolName: string,
  uri: string,
  params: Record<string, unknown>,
  waitForResponse = false
): Promise<unknown> | void {
  if (!globalWs || globalWs.readyState !== WebSocket.OPEN) {
    if (waitForResponse) {
      return Promise.reject(new Error("WebSocket not connected"));
    }
    return;
  }

  const messageId = waitForResponse ? generateMessageId() : undefined;

  globalWs.send(
    JSON.stringify({
      type: "tool",
      payload: {
        toolName,
        params: { ...params, uri },
      },
      ...(messageId && { messageId }),
    })
  );

  if (waitForResponse && messageId) {
    return new Promise((resolve, reject) => {
      pendingRequests.set(messageId, {
        resolve,
        reject,
        timestamp: Date.now(),
      });

      setTimeout(() => {
        if (pendingRequests.has(messageId)) {
          pendingRequests.delete(messageId);
          reject(new Error(`Request timeout for messageId: ${messageId}`));
        }
      }, 30000);
    });
  }
}

/**
 * Handle incoming Remote DOM message - creates receiver eagerly if needed
 */
function handleRemoteDomMessage(remoteDomMsg: RemoteDomProtocolMessage): void {
  if (!remoteDomMsg.uri) {
    return;
  }

  // EAGER RECEIVER CREATION: Get or create receiver immediately
  const receiver = getOrCreateReceiver(remoteDomMsg.uri);

  if (remoteDomMsg.type === "mutate" && remoteDomMsg.mutations) {
    receiver.connection.mutate(remoteDomMsg.mutations);
  } else if (remoteDomMsg.type === "call") {
    receiver.connection.call(
      remoteDomMsg.id!,
      remoteDomMsg.method!,
      ...(remoteDomMsg.args || [])
    );
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
    markReceiverMounted(uri);

    // Notify server that this URI is now active
    if (globalWs && globalWs.readyState === WebSocket.OPEN) {
      globalWs.send(JSON.stringify({ type: "uri-active", uri }));
    }

    // Prevent duplicate connections
    if (connectionInitialized) {
      return () => {
        unregisterFromRegistry(uri);
      };
    }

    if (globalWs && globalWs.readyState === WebSocket.OPEN) {
      wsRef.current = globalWs;
      return () => {
        unregisterFromRegistry(uri);
      };
    }

    connectionInitialized = true;
    const wsUrl = serverUrl.replace(/^http/, "ws") + "/ws";

    function connect() {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      globalWs = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: "sync" }));
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WSMessage;

          if (message.type === "remote-dom") {
            handleRemoteDomMessage(message.message);
          } else if (message.type === "action-queued") {
            if (actionQueuedCallback) {
              actionQueuedCallback(message.action);
            }
          } else if (message.type === "ui-message-response") {
            const pending = pendingRequests.get(message.messageId);
            if (pending) {
              pendingRequests.delete(message.messageId);
              if (message.payload.error) {
                pending.reject(message.payload.error);
              } else {
                pending.resolve(message.payload.response);
              }
            }
          }
        } catch (error) {
          console.error("Error processing WebSocket message:", error);
        }
      };

      ws.onclose = () => {
        globalWs = null;
        connectionInitialized = false;
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    }

    connect();

    return () => {
      unregisterFromRegistry(uri);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [receiver, serverUrl, uri]);
}
