import type { RemoteDomElement } from "../types/remote-dom.js";
import { sanitizeTextContent } from "./security.js";

/**
 * Helper to recursively create DOM elements from ElementDefinition
 * Used by tools that support children (Stack, Flex, Card, FormField)
 *
 * IMPORTANT: 'type' must be the exact Remote DOM custom element tag name
 * (e.g., "nimbus-heading", "nimbus-text", "nimbus-card-root")
 */
export function createElementFromDefinition(
  def: Record<string, unknown>
): RemoteDomElement {
  if (!def.type || typeof def.type !== "string") {
    throw new Error(
      `Element definition must have a 'type' property with a string value. Received: ${JSON.stringify(def)}`
    );
  }

  const element = document.createElement(def.type) as RemoteDomElement;

  // Extract properties (may contain content, label, children, and component props)
  const properties = (def.properties || {}) as Record<string, unknown>;

  // Extract special properties that need special handling
  const {
    content,
    label,
    children: nestedChildren,
    ...componentProps
  } = properties;

  // Set component properties (everything except content/label/children)
  Object.entries(componentProps).forEach(([key, value]) => {
    element[key] = value;
  });

  // Handle text content from multiple sources
  const textContent = content || label || def.textContent;
  if (typeof textContent === "string") {
    const sanitized = sanitizeTextContent(textContent);
    if (sanitized) {
      element.textContent = sanitized;
    }
  }

  // Handle children from either properties.children or top-level children
  const childrenArray = nestedChildren || def.children;
  if (Array.isArray(childrenArray)) {
    childrenArray.forEach((child: unknown) => {
      if (typeof child === "string") {
        const sanitized = sanitizeTextContent(child);
        if (sanitized) {
          element.appendChild(document.createTextNode(sanitized));
        }
      } else if (child && typeof child === "object") {
        element.appendChild(
          createElementFromDefinition(child as Record<string, unknown>)
        );
      }
    });
  }

  return element;
}
