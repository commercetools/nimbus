/**
 * Helper utility for creating Remote DOM UIResources
 */

import { createUIResource } from "@mcp-ui/server";
import type { ElementDefinition } from "../types/remote-dom.js";
import { getRemoteEnvironment } from "../remote-dom/index.js";

/**
 * Create a UIResource with Remote DOM serialization
 */
export function createRemoteDomResource(
  element: ElementDefinition,
  options: {
    /** Base name for the URI (e.g., "button", "product-card") */
    name: string;
    title?: string;
    description?: string;
  }
) {
  // Get the remote environment
  const env = getRemoteEnvironment();

  // Clear previous content
  env.clear();

  // Set the element as root
  env.setRoot(element);

  // Get the serialized tree with type preservation
  const serializedTree = env.getSerializedTree();

  // Generate unique URI with timestamp
  const uri = `ui://${options.name}/${Date.now()}` as const;

  // Wrap serialized tree in content object with type information
  // The client parses resource.resource.text which contains the script field
  const contentPayload = {
    type: "remoteDom",
    tree: serializedTree,
    framework: "react",
  };

  return createUIResource({
    uri,
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
    },
  });
}
