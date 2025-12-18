import React from "react";
import { componentMap } from "./nimbus-library";

/**
 * Serialized node structure from server (with type preservation)
 */
interface SerializedNode {
  nodeType: number;
  tagName?: string;
  textContent?: string;
  attributes?: Record<string, string | boolean | number | unknown>;
  children?: SerializedNode[];
}

/**
 * Remote DOM content type (from server payload)
 */
export interface RemoteDomContent {
  type: "remoteDom";
  tree: SerializedNode; // Serialized DOM tree with type preservation
  framework: "react";
}

/**
 * Recursively render SerializedNode as React components
 */
function renderNode(node: SerializedNode, index: number = 0): React.ReactNode {
  // Text node
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent || "";
  }

  // Element node
  if (node.nodeType === Node.ELEMENT_NODE && node.tagName) {
    // Find the corresponding Nimbus component
    const Component = componentMap[node.tagName];

    if (!Component) {
      console.warn(`Unknown component tag: ${node.tagName}`);
      return null;
    }

    // Pass attributes directly - types are preserved from server
    // Server sends camelCase React props with proper types (string, boolean, number, object)
    const props = node.attributes || {};

    // Render children (if any exist)
    const children =
      node.children && node.children.length > 0
        ? node.children.map((child, childIndex) =>
            renderNode(child, childIndex)
          )
        : undefined;

    return (
      <Component key={index} {...props}>
        {children}
      </Component>
    );
  }

  // Unknown node type
  return null;
}

/**
 * RemoteDomRenderer - renders UI from Remote DOM serialized tree
 *
 * This renderer handles the output from the Remote DOM environment on the server.
 * It takes a serialized DOM tree (with preserved types) and renders it as React components.
 *
 * Benefits:
 * - ✅ Structured data (no code execution)
 * - ✅ Type-safe serialization with proper types preserved
 * - ✅ Supports incremental updates (future: MutationObserver)
 * - ✅ Direct React rendering
 * - ✅ Handles complex types (arrays, objects, booleans, numbers)
 */
export function RemoteDomRenderer({ content }: { content: RemoteDomContent }) {
  // Get the serialized tree (types already preserved from server)
  const tree = content.tree;

  // Render the root node's children (skip the root div itself)
  const children = tree.children?.map((child, index) =>
    renderNode(child, index)
  );

  return <>{children}</>;
}
