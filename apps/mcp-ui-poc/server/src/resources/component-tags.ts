/**
 * Valid component tag names resource
 * Provides the definitive list of Remote DOM element tags
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Update this timestamp when component tags change
const LAST_MODIFIED = "2025-12-29T00:00:00Z";

export function registerComponentTagsResource(server: McpServer) {
  server.registerResource(
    "Nimbus Component Tags",
    "nimbus://component-tags",
    {
      description:
        "Valid Remote DOM element tag names for creating UI components",
      mimeType: "application/json",
      annotations: {
        audience: ["assistant"],
        priority: 1.0,
        lastModified: LAST_MODIFIED,
      },
    },
    async () => ({
      contents: [
        {
          uri: "nimbus://component-tags",
          mimeType: "application/json",
          text: JSON.stringify(
            {
              description:
                "CRITICAL: Always use EXACT tag names from this list when creating elements. Common mistake: using 'heading' instead of 'nimbus-heading'",
              basicElements: [
                "nimbus-heading",
                "nimbus-text",
                "nimbus-badge",
                "nimbus-image",
              ],
              layoutContainers: ["nimbus-stack", "nimbus-flex"],
              inputs: ["nimbus-text-input", "nimbus-button"],
              dataDisplay: {
                description: "Data display components",
                tags: ["nimbus-data-table"],
                dataTableProps: {
                  columns:
                    "JSON string array of column definitions with id, header, accessor",
                  rows: "JSON string array of row data objects",
                  ariaLabel: "Required accessibility label",
                  allowsSorting: "Boolean to enable column sorting",
                  isRowClickable: "Boolean to enable row click events",
                  showDetails:
                    "Boolean - REQUIRED for row click details. When true, clicking a row opens a drawer showing all row data. Always set to true when displaying data that users may want to inspect in detail.",
                  editAction:
                    "Object with { instruction: string } - enables edit button in details drawer",
                  density: "'default' | 'compact' | 'comfortable'",
                },
              },
              cardComponents: {
                description: "Card is a compound component with multiple parts",
                parts: [
                  "nimbus-card-root",
                  "nimbus-card-header",
                  "nimbus-card-content",
                ],
              },
              formFieldComponents: {
                description:
                  "FormField is a compound component with multiple parts",
                parts: [
                  "nimbus-form-field-root",
                  "nimbus-form-field-label",
                  "nimbus-form-field-input",
                  "nimbus-form-field-description",
                  "nimbus-form-field-error",
                ],
              },
              drawerComponents: {
                description:
                  "Drawer is a compound component with multiple parts",
                parts: [
                  "nimbus-drawer-root",
                  "nimbus-drawer-trigger",
                  "nimbus-drawer-content",
                  "nimbus-drawer-header",
                  "nimbus-drawer-title",
                  "nimbus-drawer-body",
                  "nimbus-drawer-footer",
                  "nimbus-drawer-close-trigger",
                ],
              },
              allTags: [
                "nimbus-heading",
                "nimbus-text",
                "nimbus-badge",
                "nimbus-image",
                "nimbus-stack",
                "nimbus-flex",
                "nimbus-text-input",
                "nimbus-button",
                "nimbus-data-table",
                "nimbus-card-root",
                "nimbus-card-header",
                "nimbus-card-content",
                "nimbus-form-field-root",
                "nimbus-form-field-label",
                "nimbus-form-field-input",
                "nimbus-form-field-description",
                "nimbus-form-field-error",
                "nimbus-drawer-root",
                "nimbus-drawer-trigger",
                "nimbus-drawer-content",
                "nimbus-drawer-header",
                "nimbus-drawer-title",
                "nimbus-drawer-body",
                "nimbus-drawer-footer",
                "nimbus-drawer-close-trigger",
              ],
              commonMistakes: {
                heading: "Use 'nimbus-heading' instead",
                text: "Use 'nimbus-text' instead",
                card: "Use 'nimbus-card-root' instead",
                button: "Use 'nimbus-button' instead",
                input: "Use 'nimbus-text-input' instead",
                "data-table": "Use 'nimbus-data-table' instead",
                table: "Use 'nimbus-data-table' instead",
              },
            },
            null,
            2
          ),
        },
      ],
    })
  );
}
