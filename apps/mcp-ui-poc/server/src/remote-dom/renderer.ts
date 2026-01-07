/**
 * Remote DOM Renderer
 *
 * Simplified renderer that works directly with ElementDefinitions
 * instead of manipulating an actual DOM.
 */

import type { ElementDefinition } from "../types/remote-dom.js";

/**
 * In this simplified approach, we don't need to render into a DOM.
 * We work directly with ElementDefinitions and the environment handles serialization.
 *
 * This module exists for API compatibility and future extensibility.
 */

/**
 * Validate an ElementDefinition (placeholder for future validation logic)
 */
export function validateElement(definition: ElementDefinition): boolean {
  return !!(definition.tagName && typeof definition.tagName === "string");
}
