/**
 * Helper utility for creating Remote DOM UIResources with incremental update support
 */

import { createUIResource } from "@mcp-ui/server";
import { getRemoteEnvironment } from "../remote-dom/index.js";

/**
 * Create a UIResource with Remote DOM serialization and incremental updates
 */
export function createRemoteDomResource(
  element: Element | null,
  options: {
    /** Base name for the URI (e.g., "button", "product-card") */
    name: string;
    title?: string;
    description?: string;
    /** Whether to append to existing content (default: false - replaces) */
    append?: boolean;
    /** Pre-generated URI (optional - will generate if not provided) */
    uri?: string;
  }
) {
  // Use provided URI or generate unique URI with timestamp
  const uri = options.uri || `ui://${options.name}/${Date.now()}`;

  // Get or create environment for this specific URI
  // Each URI gets its own isolated environment
  const env = getRemoteEnvironment(uri);

  // IMPORTANT: Don't clear for new environments!
  // New URIs create fresh environments that are already empty.
  // Clearing would call historyClearer() which clears the GLOBAL
  // WebSocket mutation history, removing mutations from OTHER URIs.
  // Only clear if explicitly appending to an existing environment.
  if (options.append) {
    // Append mode - keep existing content
  } else {
    // New environment - already empty, no clear needed
  }

  // Append the element to root (triggers Remote DOM mutations)
  if (element) {
    (env.getRoot() as Element).appendChild(element as unknown as Node);
  }

  // Flush all batched mutations immediately to ensure they're sent
  // This prevents waiting for the batch timeout and sends everything at once
  env.flush();

  // Get the serialized tree for MCP initial snapshot
  const serializedTree = env.getSerializedTree();

  // Note: We keep mutation history so clients can build the RemoteReceiver tree
  // The snapshot is only used as a fallback for immediate rendering

  // Wrap serialized tree in content object
  // Live mutations will be sent via WebSocket using Remote DOM protocol
  const contentPayload = {
    type: "remoteDom",
    tree: serializedTree,
    framework: "react",
  };

  return createUIResource({
    uri: uri as `ui://${string}`,
    content: {
      type: "remoteDom",
      script: JSON.stringify(contentPayload),
      framework: "react",
    },
    encoding: "text",
    metadata: {
      title: options.title,
      description: options.description,
      created: new Date().toISOString(),
      protocol: "remote-dom",
    },
  });
}
