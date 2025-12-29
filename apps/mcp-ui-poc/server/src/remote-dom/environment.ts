/**
 * Remote DOM Environment with Live Connection Protocol
 *
 * Uses @remote-dom/core to create a remote DOM environment that
 * communicates with the client via Remote DOM protocol messages.
 */

// Import polyfill as side-effect to set up global document
import "@remote-dom/core/polyfill";
import { createRemoteConnection } from "@remote-dom/core";
import { RemoteRootElement } from "@remote-dom/core/elements";
import {
  MUTATION_TYPE_INSERT_CHILD,
  MUTATION_TYPE_REMOVE_CHILD,
  MUTATION_TYPE_UPDATE_TEXT,
  MUTATION_TYPE_UPDATE_PROPERTY,
} from "@remote-dom/core";
import type {
  ElementDefinition,
  RemoteDomElement,
} from "../types/remote-dom.js";

// Import all elements (triggers self-registration)
import "../elements/index.js";

// Register the remote-root custom element
if (
  typeof customElements !== "undefined" &&
  !customElements.get("remote-root")
) {
  customElements.define("remote-root", RemoteRootElement);
}

/**
 * Serialized node structure for transmission to client
 * @deprecated - Remote DOM protocol handles serialization internally
 */
export interface SerializedNode {
  nodeType: number;
  tagName?: string;
  textContent?: string;
  attributes?: Record<string, string | boolean | number | unknown>;
  children?: SerializedNode[];
  nodeId?: number;
}

/**
 * Serialized mutation for incremental updates
 * @deprecated - Remote DOM protocol handles mutations internally
 */
export interface SerializedMutation {
  type: string;
  targetId?: number;
  addedNodes?: SerializedNode[];
  removedNodes?: SerializedNode[];
  attributeName?: string | null;
  oldValue?: string | null;
}

// Node type constants (matching DOM spec)
const NODE_ELEMENT = 1;
const NODE_TEXT = 3;

/**
 * Remote DOM protocol message types
 */
type RemoteDomMessage =
  | { type: "mutate"; mutations: unknown[]; uri?: string }
  | { type: "call"; id: string; method: string; args: unknown[]; uri?: string };

/**
 * Callback for sending Remote DOM messages to client
 */
type MessageSender = (message: RemoteDomMessage) => void;

/**
 * Callback for clearing mutation history
 */
type HistoryClearer = () => void;

/**
 * Remote environment with live Remote DOM connection
 */
export class RemoteEnvironment {
  private root: unknown;
  private connection: ReturnType<typeof createRemoteConnection>;
  private messageSender: MessageSender | null = null;
  private historyClearer: HistoryClearer | null = null;
  private uri: string | null = null;
  private mutationBatch: unknown[] = [];
  private batchTimeoutId: NodeJS.Timeout | null = null;

  constructor(uri?: string) {
    this.uri = uri || null;

    // Create connection that will send mutations via WebSocket
    // Remote DOM calls these handlers when DOM changes occur
    this.connection = createRemoteConnection({
      call: (id: string, method: string, ...args: unknown[]) => {
        this.sendMessage({
          type: "call",
          id,
          method,
          args,
          uri: this.uri || undefined,
        });
      },
      insertChild: (id: string, child: unknown, index: number) => {
        this.batchMutation([MUTATION_TYPE_INSERT_CHILD, id, child, index]);
      },
      removeChild: (id: string, index: number) => {
        this.batchMutation([MUTATION_TYPE_REMOVE_CHILD, id, index]);
      },
      updateText: (id: string, newText: string) => {
        this.batchMutation([MUTATION_TYPE_UPDATE_TEXT, id, newText]);
      },
      updateProperty: (
        id: string,
        property: string,
        value: unknown,
        type?: number
      ) => {
        this.batchMutation([
          MUTATION_TYPE_UPDATE_PROPERTY,
          id,
          property,
          value,
          type,
        ]);
      },
    });

    // Create RemoteRootElement using the globally polyfilled document
    // This custom element has the .connect() method needed for mutation tracking
    this.root = document.createElement("remote-root") as RemoteRootElement;

    // Connect the root to the Remote DOM connection
    // This wires up mutation tracking - any DOM changes to this root will
    // trigger the connection handlers above (insertChild, updateText, etc.)
    (this.root as RemoteRootElement).connect(this.connection);
  }

  /**
   * Set message sender (WebSocket broadcaster)
   */
  setMessageSender(sender: MessageSender) {
    this.messageSender = sender;
  }

  /**
   * Set history clearer (WebSocket mutation history reset)
   */
  setHistoryClearer(clearer: HistoryClearer) {
    this.historyClearer = clearer;
  }

  /**
   * Clear only the mutation history (not the DOM)
   * Used after taking a snapshot to avoid replaying initial mutations
   */
  clearHistoryOnly() {
    if (this.historyClearer) {
      this.historyClearer();
    }
  }

  /**
   * Batch a mutation for sending
   * Mutations are accumulated and sent together in the next tick
   */
  private batchMutation(mutation: unknown) {
    this.mutationBatch.push(mutation);

    // Schedule flush if not already scheduled (use setTimeout for batching)
    if (!this.batchTimeoutId) {
      this.batchTimeoutId = setTimeout(() => {
        this.flushBatch();
      }, 0);
    }
  }

  /**
   * Flush all batched mutations as a single message
   */
  private flushBatch() {
    if (this.mutationBatch.length === 0) {
      return;
    }

    // Clear timeout if scheduled
    if (this.batchTimeoutId) {
      clearTimeout(this.batchTimeoutId);
      this.batchTimeoutId = null;
    }

    console.log(`📦 Flushing ${this.mutationBatch.length} batched mutations`);

    // Send all mutations in a single message
    this.sendMessage({
      type: "mutate",
      mutations: this.mutationBatch,
      uri: this.uri || undefined,
    });

    // Clear batch
    this.mutationBatch = [];
  }

  /**
   * Force flush any pending mutations immediately
   * Useful to call at the end of tool execution
   */
  flush() {
    this.flushBatch();
  }

  /**
   * Send message to client via configured sender
   */
  private sendMessage(message: RemoteDomMessage) {
    if (this.messageSender) {
      this.messageSender(message);
    }
  }

  /**
   * Get the root element
   */
  getRoot(): unknown {
    return this.root;
  }

  /**
   * Clear the root element and mutation history
   */
  clear() {
    const rootElement = this.root as Element;
    while (rootElement.firstChild) {
      rootElement.removeChild(rootElement.firstChild);
    }

    // Also clear the mutation history so clients don't replay old mutations
    if (this.historyClearer) {
      this.historyClearer();
    }
  }

  /**
   * Render an ElementDefinition into the DOM
   */
  renderElement(
    definition: ElementDefinition,
    parent: unknown = this.root
  ): unknown {
    const parentElement = parent as Element;
    const element = document.createElement(
      definition.tagName
    ) as RemoteDomElement;

    // Set properties directly on the element (not attributes)
    // Remote DOM tracks properties, not attributes
    if (definition.attributes) {
      for (const [key, value] of Object.entries(definition.attributes)) {
        if (value === undefined) continue;

        // Set as a property on the element object
        // This triggers Remote DOM's updateProperty mutation
        element[key] = value;
      }
    }

    // Add children (only if there are any)
    if (definition.children && definition.children.length > 0) {
      for (const child of definition.children) {
        if (typeof child === "string") {
          element.appendChild(document.createTextNode(child));
        } else {
          this.renderElement(child, element);
        }
      }
    }

    parentElement.appendChild(element as unknown as Node);
    return element;
  }

  /**
   * Get the current serialized tree (for MCP initial snapshot)
   */
  getSerializedTree(): SerializedNode {
    return this.serializeNode(this.root);
  }

  /**
   * Serialize a DOM node with type restoration (for MCP initial snapshot)
   */
  private serializeNode(node: unknown): SerializedNode {
    const domNode = node as { nodeType: number; textContent?: string };

    if (domNode.nodeType === NODE_TEXT) {
      return {
        nodeType: NODE_TEXT,
        textContent: domNode.textContent || undefined,
      };
    }

    if (domNode.nodeType === NODE_ELEMENT) {
      const element = node as Element;
      const attributes: Record<string, string | boolean | number | unknown> =
        {};
      const typeMap: Record<string, string> = {};

      // First pass: collect type information
      for (const attr of Array.from(element.attributes)) {
        if (attr.name.startsWith("data-type-")) {
          const propName = attr.name.replace("data-type-", "");
          typeMap[propName] = attr.value;
        }
      }

      // Second pass: restore typed values
      for (const attr of Array.from(element.attributes)) {
        if (attr.name.startsWith("data-type-")) continue;

        const type = typeMap[attr.name];
        const value = attr.value;

        if (!type) {
          attributes[attr.name] = value;
        } else if (type === "boolean") {
          attributes[attr.name] = value === "true";
        } else if (type === "number") {
          attributes[attr.name] = Number(value);
        } else if (type === "json") {
          try {
            attributes[attr.name] = JSON.parse(value);
          } catch {
            attributes[attr.name] = value;
          }
        } else {
          attributes[attr.name] = value;
        }
      }

      const children = Array.from(element.childNodes).map((child) =>
        this.serializeNode(child)
      );

      return {
        nodeType: NODE_ELEMENT,
        tagName: element.tagName.toLowerCase(),
        attributes,
        // Only include children if there are any
        ...(children.length > 0 ? { children } : {}),
      };
    }

    return {
      nodeType: domNode.nodeType,
    };
  }
}

/**
 * Multi-environment architecture: One environment per URI
 * This allows multiple components to exist simultaneously
 */
const environmentsByUri = new Map<string, RemoteEnvironment>();

/**
 * Global message sender and history clearer (configured once, applied to all environments)
 */
let globalMessageSender: MessageSender | null = null;
let globalHistoryClearer: HistoryClearer | null = null;

/**
 * Get or create an environment for a specific URI
 */
export function getRemoteEnvironment(uri?: string): RemoteEnvironment {
  // If no URI provided, create a temporary environment (legacy behavior)
  if (!uri) {
    const env = new RemoteEnvironment();
    // Configure with global handlers if available
    if (globalMessageSender) {
      env.setMessageSender(globalMessageSender);
    }
    if (globalHistoryClearer) {
      env.setHistoryClearer(globalHistoryClearer);
    }
    return env;
  }

  let environment = environmentsByUri.get(uri);
  if (!environment) {
    console.log(`🆕 Creating new RemoteEnvironment for URI: ${uri}`);
    environment = new RemoteEnvironment(uri);

    // Configure with global handlers if available
    if (globalMessageSender) {
      environment.setMessageSender(globalMessageSender);
    }
    if (globalHistoryClearer) {
      environment.setHistoryClearer(globalHistoryClearer);
    }

    environmentsByUri.set(uri, environment);
  } else {
    console.log(`♻️ Reusing existing RemoteEnvironment for URI: ${uri}`);
  }

  return environment;
}

/**
 * Reset a specific environment or all environments
 */
export function resetRemoteEnvironment(uri?: string): void {
  if (uri) {
    const environment = environmentsByUri.get(uri);
    if (environment) {
      environment.clear();
      environmentsByUri.delete(uri);
    }
  } else {
    // Reset all environments
    environmentsByUri.forEach((env) => env.clear());
    environmentsByUri.clear();
  }
}

/**
 * Get all active environment URIs
 */
export function getActiveEnvironmentUris(): string[] {
  return Array.from(environmentsByUri.keys());
}

/**
 * Set message sender for broadcasting Remote DOM messages
 * Applies to all existing and future environments
 */
export function setMessageSender(sender: (message: RemoteDomMessage) => void) {
  globalMessageSender = sender;

  // Apply to all existing environments
  environmentsByUri.forEach((env) => {
    env.setMessageSender(sender);
  });
}

/**
 * Set history clearer for resetting mutation history
 * Applies to all existing and future environments
 */
export function setHistoryClearer(clearer: () => void) {
  globalHistoryClearer = clearer;

  // Apply to all existing environments
  environmentsByUri.forEach((env) => {
    env.setHistoryClearer(clearer);
  });
}
