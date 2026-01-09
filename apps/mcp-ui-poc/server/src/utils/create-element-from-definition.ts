import type { RemoteDomElement } from "../types/remote-dom.js";
import { sanitizeTextContent } from "./security.js";
import { createDataTableElement } from "../tools/data-table.js";

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

  // Extract properties (may contain content, label, children, and component props)
  const properties = (def.properties || {}) as Record<string, unknown>;

  // Special handling for nimbus-data-table with showDetails
  // This enables the full details view infrastructure when created as nested children
  if (def.type === "nimbus-data-table") {
    const {
      columns,
      rows,
      ariaLabel,
      showDetails,
      editAction,
      title,
      ...restProps
    } = properties;

    // Parse columns and rows if they're JSON strings
    const parsedColumns =
      typeof columns === "string" ? JSON.parse(columns as string) : columns;
    const parsedRows =
      typeof rows === "string" ? JSON.parse(rows as string) : rows;

    // If showDetails is enabled, use the full data table infrastructure
    if (
      showDetails &&
      Array.isArray(parsedColumns) &&
      Array.isArray(parsedRows)
    ) {
      // Validate that editAction is provided when showDetails is enabled
      // This matches the validation in registerDataTableTool
      const editActionObj = editAction as { instruction: string } | undefined;
      if (!editActionObj?.instruction) {
        throw new Error(
          "editAction.instruction is REQUIRED when showDetails=true for nimbus-data-table. " +
            "Provide an instruction template for Claude to execute when saving edits. " +
            "Example: editAction={ instruction: 'Update product {id} with data: {formData}. Use commerce update_product tool.' }. " +
            "Without it, the Edit button cannot save changes."
        );
      }

      const { element } = createDataTableElement({
        title: title as string | undefined,
        columns: parsedColumns,
        rows: parsedRows,
        ariaLabel: (ariaLabel as string) || "Data table",
        showDetails: true,
        editAction: editActionObj,
      });

      // Apply any remaining props to the root element
      Object.entries(restProps).forEach(([key, value]) => {
        element[key] = value;
      });

      return element;
    }

    // No showDetails - create simple data table element
    // Use createDataTableElement for consistent handling (proper JSON serialization, row IDs, etc.)
    if (Array.isArray(parsedColumns) && Array.isArray(parsedRows)) {
      const { element } = createDataTableElement({
        title: title as string | undefined,
        columns: parsedColumns,
        rows: parsedRows,
        ariaLabel: (ariaLabel as string) || "Data table",
        showDetails: false,
      });

      // Apply any remaining props to the element
      Object.entries(restProps).forEach(([key, value]) => {
        element[key] = value;
      });

      return element;
    }

    // Fallback: If columns/rows aren't valid arrays, create basic element
    // This shouldn't normally happen, but ensures we don't crash
    const element = document.createElement(def.type) as RemoteDomElement;

    // Serialize columns and rows if they're arrays
    Object.entries(properties).forEach(([key, value]) => {
      if ((key === "columns" || key === "rows") && Array.isArray(value)) {
        element[key] = JSON.stringify(value);
      } else {
        element[key] = value;
      }
    });

    return element;
  }

  // Standard element creation for all other types
  const element = document.createElement(def.type) as RemoteDomElement;

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
