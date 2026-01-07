/**
 * Shared Receiver Registry
 *
 * Centralizes RemoteReceiver management to enable eager receiver creation.
 * When mutations arrive via WebSocket before the React component mounts,
 * we create the receiver immediately and apply mutations. When the component
 * mounts, it reuses the pre-existing receiver.
 */

import { RemoteReceiver } from "@remote-dom/react/host";

// Debug flag - set via environment variable or manually for troubleshooting
export const DEBUG_REMOTE_DOM = false;

// Shared receiver registry
const receiversByUri = new Map<string, RemoteReceiver>();

/**
 * Get or create a receiver for a URI.
 * If receiver doesn't exist, creates one eagerly.
 */
export function getOrCreateReceiver(uri: string): RemoteReceiver {
  let receiver = receiversByUri.get(uri);
  if (!receiver) {
    receiver = new RemoteReceiver();
    receiversByUri.set(uri, receiver);
    console.log("🆕 Created new receiver for:", uri);
  }
  return receiver;
}

/**
 * Check if a receiver exists for a URI
 */
export function hasReceiver(uri: string): boolean {
  return receiversByUri.has(uri);
}

/**
 * Get existing receiver (returns undefined if not found)
 */
export function getReceiver(uri: string): RemoteReceiver | undefined {
  return receiversByUri.get(uri);
}

/**
 * Mark a receiver as mounted (component has rendered)
 */
export function markReceiverMounted(_uri: string): void {
  // No-op in production - tracking removed for performance
}

/**
 * Unregister a receiver (on component unmount)
 *
 * NOTE: We no longer delete receivers here to prevent UI from disappearing
 * during React re-renders. Receivers are keyed by URI and will be reused.
 * This trades a small amount of memory for UI stability.
 */
export function unregisterReceiver(uri: string): void {
  // Don't delete - receiver might still have content that should persist
  // The receiver will be reused if the component remounts with the same URI
  console.log("📌 Keeping receiver alive for:", uri);
}

/**
 * Clear all receivers (for testing or reset)
 */
export function clearAllReceivers(): void {
  receiversByUri.clear();
}

/**
 * Debug helper - only logs when DEBUG_REMOTE_DOM is true
 */
export function logDebug(...args: unknown[]): void {
  if (DEBUG_REMOTE_DOM) {
    console.log(...args);
  }
}
