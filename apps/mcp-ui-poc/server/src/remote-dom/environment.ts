/**
 * Remote DOM Environment Setup
 *
 * This module provides a simplified Remote DOM environment for the server.
 * Instead of using a full DOM polyfill, we work directly with ElementDefinitions
 * and serialize them with proper type preservation for the client.
 */

import type { ElementDefinition } from "../types/remote-dom.js";

/**
 * Serialized node structure for transmission to client
 */
interface SerializedNode {
  nodeType: number;
  tagName?: string;
  textContent?: string;
  attributes?: Record<string, string | boolean | number | unknown>;
  children?: SerializedNode[];
}

// Node type constants (matching DOM spec)
const NODE_ELEMENT = 1;
const NODE_TEXT = 3;

/**
 * Remote environment for UI generation
 * Maintains element definitions and provides serialization with type preservation
 */
export class RemoteEnvironment {
  private rootElement: ElementDefinition | null = null;

  constructor() {
    // Initialize empty
  }

  /**
   * Set the root element for this environment
   */
  setRoot(element: ElementDefinition): void {
    this.rootElement = element;
  }

  /**
   * Clear the root element
   */
  clear(): void {
    this.rootElement = null;
  }

  /**
   * Get the current serialized tree with type preservation
   */
  getSerializedTree(): SerializedNode {
    if (!this.rootElement) {
      // Return empty root node
      return {
        nodeType: NODE_ELEMENT,
        tagName: "div",
        attributes: { id: "remote-root" },
        children: [],
      };
    }

    // Wrap in a root div (matching client expectation)
    return {
      nodeType: NODE_ELEMENT,
      tagName: "div",
      attributes: { id: "remote-root" },
      children: [this.serializeElement(this.rootElement)],
    };
  }

  /**
   * Serialize an ElementDefinition to SerializedNode with type preservation
   */
  private serializeElement(element: ElementDefinition): SerializedNode {
    const serialized: SerializedNode = {
      nodeType: NODE_ELEMENT,
      tagName: element.tagName,
      attributes: { ...element.attributes }, // Preserve original types
      children: [],
    };

    // Serialize children
    if (element.children) {
      serialized.children = element.children.map((child) => {
        if (typeof child === "string") {
          // Text node
          return {
            nodeType: NODE_TEXT,
            textContent: child,
          };
        } else {
          // Nested element
          return this.serializeElement(child);
        }
      });
    }

    return serialized;
  }
}

/**
 * Global remote environment instance
 */
let globalEnvironment: RemoteEnvironment | null = null;

/**
 * Get or create the global remote environment
 */
export function getRemoteEnvironment(): RemoteEnvironment {
  if (!globalEnvironment) {
    globalEnvironment = new RemoteEnvironment();
  }
  return globalEnvironment;
}

/**
 * Reset the global environment (useful for testing)
 */
export function resetRemoteEnvironment(): void {
  if (globalEnvironment) {
    globalEnvironment.clear();
  }
  globalEnvironment = null;
}
