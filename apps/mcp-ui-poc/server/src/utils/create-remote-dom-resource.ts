/**
 * Helper utility for creating Remote DOM UIResources with incremental update support
 */

import { createUIResource } from "@mcp-ui/server";
import { getRemoteEnvironment } from "../remote-dom/index.js";

/**
 * Create a UIResource with Remote DOM - mutations sent via WebSocket
 *
 * The client receives mutations via WebSocket (immediate) and creates
 * receivers eagerly. The UIResource payload is minimal - just contains
 * the URI for routing.
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
  const uri = options.uri || `ui://${options.name}/${Date.now()}`;

  // Get or create environment for this URI
  const env = getRemoteEnvironment(uri);

  // Append element to root (triggers Remote DOM mutations sent via WebSocket)
  if (element) {
    (env.getRoot() as Element).appendChild(element as unknown as Node);
  }

  // Flush mutations immediately - client receives via WebSocket
  env.flush();

  // Minimal payload - client uses WebSocket mutations, not serialized tree
  // URI is included so client can route to correct receiver
  return createUIResource({
    uri: uri as `ui://${string}`,
    content: {
      type: "remoteDom",
      script: JSON.stringify({ uri, type: "remoteDom", framework: "react" }),
      framework: "react",
    },
    encoding: "text",
    metadata: {
      title: options.title,
      description: options.description,
      protocol: "remote-dom",
    },
  });
}
