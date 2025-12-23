/**
 * Common Zod schemas for Chakra UI style properties
 * Reusable across all component tools
 */

import { z } from "zod";

/**
 * Common Chakra UI style properties
 * These map to Chakra's styled-system props
 */
export const commonStyleSchema = {
  // Layout
  display: z.string().optional().describe("CSS display property"),
  width: z.string().optional().describe("Width (e.g., '100px', 'full')"),
  height: z.string().optional().describe("Height"),
  maxWidth: z.string().optional().describe("Max width"),
  minWidth: z.string().optional().describe("Min width"),

  // Spacing
  margin: z.string().optional().describe("Margin (all sides)"),
  marginTop: z.string().optional().describe("Top margin"),
  marginBottom: z.string().optional().describe("Bottom margin"),
  marginLeft: z.string().optional().describe("Left margin"),
  marginRight: z.string().optional().describe("Right margin"),
  padding: z.string().optional().describe("Padding (all sides)"),
  paddingTop: z.string().optional().describe("Top padding"),
  paddingBottom: z.string().optional().describe("Bottom padding"),
  paddingLeft: z.string().optional().describe("Left padding"),
  paddingRight: z.string().optional().describe("Right padding"),
  gap: z.string().optional().describe("Gap between children"),

  // Typography
  fontSize: z.string().optional().describe("Font size"),
  fontWeight: z.string().optional().describe("Font weight"),
  color: z.string().optional().describe("Text color"),

  // Border
  borderRadius: z.string().optional().describe("Border radius"),
  borderWidth: z.string().optional().describe("Border width"),
  borderColor: z.string().optional().describe("Border color"),
  borderStyle: z.string().optional().describe("Border style"),

  // Background
  backgroundColor: z.string().optional().describe("Background color"),
} as const;

/**
 * Extract style props from args
 */
export function extractStyleProps(
  args: Record<string, unknown>
): Record<string, unknown> {
  const styleProps: Record<string, unknown> = {};
  const styleKeys = Object.keys(commonStyleSchema);

  for (const key of styleKeys) {
    if (args[key] !== undefined) {
      styleProps[key] = args[key];
    }
  }

  return styleProps;
}
