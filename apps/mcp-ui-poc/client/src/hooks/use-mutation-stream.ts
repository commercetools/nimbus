/**
 * WebSocket hook for receiving real-time DOM mutations
 */

import { useEffect, useRef, useState } from "react";

interface SerializedMutation {
  type: string;
  targetId?: number;
  addedNodes?: unknown[];
  removedNodes?: unknown[];
  attributeName?: string | null;
  oldValue?: string | null;
}

interface MutationMessage {
  type: "mutations";
  mutations: SerializedMutation[];
  timestamp: number;
}

interface SyncResponseMessage {
  type: "sync-response";
  tree: unknown;
  timestamp: number;
}

type WSMessage = MutationMessage | SyncResponseMessage;

export function useMutationStream(serverUrl: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [mutations, setMutations] = useState<SerializedMutation[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const wsUrl = serverUrl.replace(/^http/, "ws") + "/ws";
    console.log("🔌 Connecting to WebSocket:", wsUrl);

    function connect() {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("✅ WebSocket connected");
        setIsConnected(true);

        // Request full state sync on connect
        ws.send(JSON.stringify({ type: "sync" }));
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WSMessage;

          if (message.type === "mutations") {
            console.log(
              `🔄 Received ${message.mutations.length} mutations from server`
            );
            setMutations((prev) => [...prev, ...message.mutations]);
          } else if (message.type === "sync-response") {
            console.log("🔄 Received full state sync from server");
            // TODO: Handle full tree sync
          }
        } catch (error) {
          console.error("❌ Error parsing WebSocket message:", error);
        }
      };

      ws.onclose = () => {
        console.log("🔌 WebSocket disconnected, reconnecting in 3s...");
        setIsConnected(false);

        // Attempt reconnection after delay
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
      };
    }

    connect();

    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [serverUrl]);

  return {
    isConnected,
    mutations,
    clearMutations: () => setMutations([]),
  };
}
