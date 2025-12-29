/**
 * Design tokens resource
 * Compact JSON reference of all design token values with mappings
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Update this timestamp when design tokens change
const LAST_MODIFIED = "2025-12-29T00:00:00Z";

export function registerDesignTokensResource(server: McpServer) {
  server.registerResource(
    "Nimbus Design Tokens",
    "nimbus://design-tokens",
    {
      description: "Compact reference of all design token values with mappings",
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
          uri: "nimbus://design-tokens",
          mimeType: "application/json",
          text: JSON.stringify(
            {
              spacing: {
                description:
                  "4px-based scale (100 = 4px). Use for margin, padding, gap, and other spacing",
                tokens: [
                  "25",
                  "50",
                  "100",
                  "150",
                  "200",
                  "250",
                  "300",
                  "350",
                  "400",
                  "450",
                  "500",
                  "600",
                  "700",
                  "800",
                ],
                mapping: {
                  "25": "1px",
                  "50": "2px",
                  "100": "4px (base unit)",
                  "150": "6px",
                  "200": "8px",
                  "250": "10px",
                  "300": "12px",
                  "350": "14px",
                  "400": "16px (most common)",
                  "450": "18px",
                  "500": "20px",
                  "600": "24px",
                  "700": "28px",
                  "800": "32px",
                },
              },
              colors: {
                description:
                  "All color scales use steps 1-12 plus 'contrast' for guaranteed readable text on step 9",
                semantic: {
                  description:
                    "Recommended for meaning-based colors that adapt to context",
                  scales: [
                    "primary",
                    "neutral",
                    "critical",
                    "positive",
                    "warning",
                    "info",
                  ],
                  usage: {
                    "1-3": "Light backgrounds, subtle fills",
                    "4-6": "Borders, dividers",
                    "7-8": "Hover states",
                    "9-10": "Main interactive colors (buttons, links)",
                    "11-12": "High contrast text, icons",
                    contrast: "Guaranteed readable text on step 9",
                  },
                },
                brand: {
                  description: "commercetools brand colors",
                  scales: ["ctviolet", "ctteal", "ctyellow"],
                },
                system: {
                  description: "Full color palette (25 colors)",
                  scales: [
                    "tomato",
                    "red",
                    "ruby",
                    "crimson",
                    "pink",
                    "plum",
                    "purple",
                    "violet",
                    "iris",
                    "indigo",
                    "blue",
                    "cyan",
                    "teal",
                    "jade",
                    "green",
                    "grass",
                    "bronze",
                    "gold",
                    "brown",
                    "orange",
                    "amber",
                    "yellow",
                    "lime",
                    "mint",
                    "sky",
                  ],
                },
                special: {
                  description: "Alpha transparency colors",
                  scales: ["blackAlpha", "whiteAlpha"],
                  steps: "1-12 (varying opacity levels)",
                },
              },
              typography: {
                fontSize: {
                  description: "Font size tokens (not 4px-based scale)",
                  tokens: [
                    "250",
                    "300",
                    "350",
                    "400",
                    "450",
                    "500",
                    "600",
                    "750",
                    "900",
                    "1200",
                  ],
                  mapping: {
                    "250": "10px - Extra small (captions)",
                    "300": "12px - Small (helper text)",
                    "350": "14px - Small body",
                    "400": "16px - Default body (most common)",
                    "450": "18px - Medium body",
                    "500": "20px - Large body",
                    "600": "24px - Small headings",
                    "750": "30px - Medium headings",
                    "900": "36px - Large headings",
                    "1200": "48px - Extra large headings",
                  },
                },
                fontWeight: {
                  description: "Font weight tokens (CSS standard values)",
                  tokens: [
                    "100",
                    "200",
                    "300",
                    "400",
                    "500",
                    "600",
                    "700",
                    "800",
                    "900",
                  ],
                  mapping: {
                    "100": "Thin",
                    "200": "Extra light",
                    "300": "Light",
                    "400": "Normal/regular (most common)",
                    "500": "Medium",
                    "600": "Semi-bold (for emphasis)",
                    "700": "Bold",
                    "800": "Extra bold",
                    "900": "Black",
                  },
                },
              },
              borderRadius: {
                description: "4px-based scale (100 = 4px)",
                tokens: [
                  "50",
                  "100",
                  "150",
                  "200",
                  "300",
                  "400",
                  "500",
                  "600",
                  "full",
                ],
                mapping: {
                  "50": "2px - Minimal",
                  "100": "4px (base unit) - Small",
                  "150": "6px - Buttons, inputs",
                  "200": "8px - Cards, containers (most common)",
                  "300": "12px - Large cards",
                  "400": "16px - Extra large",
                  "500": "20px - Very rounded",
                  "600": "24px - Maximum",
                  full: "9999px - Fully rounded (pills, circles)",
                },
              },
              borderWidth: {
                description: "Border width tokens (1px increments)",
                tokens: ["25", "50", "75", "100"],
                mapping: {
                  "25": "1px (most common)",
                  "50": "2px",
                  "75": "3px",
                  "100": "4px",
                },
              },
              shadows: {
                description: "Box shadow elevation tokens",
                tokens: ["1", "2", "3", "4", "5", "6"],
                mapping: {
                  "1": "Subtle elevation",
                  "2": "Small elevation",
                  "3": "Medium elevation (cards)",
                  "4": "Large elevation (modals)",
                  "5": "Extra large elevation",
                  "6": "Maximum elevation",
                },
              },
              commonPatterns: {
                button: {
                  padding: "300",
                  fontSize: "400",
                  fontWeight: "500",
                  borderRadius: "200",
                  backgroundColor: "primary.9",
                  color: "primary.contrast",
                },
                card: {
                  padding: "500",
                  borderRadius: "200",
                  backgroundColor: "neutral.1",
                  boxShadow: "3",
                },
                input: {
                  padding: "300",
                  fontSize: "400",
                  borderRadius: "150",
                  borderWidth: "25",
                  borderColor: "neutral.7",
                },
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
