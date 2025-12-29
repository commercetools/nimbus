/**
 * Common Zod schemas for Chakra UI style properties
 * Reusable across all component tools
 */

import { z } from "zod";

/**
 * Short description for children parameters
 * References component-tags resource for valid tag names
 */
export const CHILDREN_DESCRIPTION =
  'Child elements with "type" (exact tag name from nimbus://component-tags), optional "properties", "textContent", and nested "children"';

/**
 * Zod schema for children array
 */
export const childrenSchema = z
  .array(z.record(z.string(), z.any()))
  .optional()
  .describe(CHILDREN_DESCRIPTION);

/**
 * Chakra UI style properties schema
 * Accepts all valid CSS properties in camelCase format via styled-system
 */
export const stylePropsSchema = z
  .record(z.string(), z.any())
  .optional()
  .describe(
    "Chakra UI styled-system props in camelCase. Supports all CSS properties plus colorPalette. Use design tokens (e.g., color='primary.9', colorPalette='primary', margin='400'). See nimbus://design-tokens and nimbus://style-system resources for details"
  );

/**
 * Common style properties object for spreading into tool schemas
 */
export const commonStyleSchema = {
  styleProps: stylePropsSchema,
} as const;

/**
 * Extract style props from args
 * Now expects styleProps as a nested object
 */
export function extractStyleProps(
  args: Record<string, unknown>
): Record<string, unknown> {
  // Return the styleProps object directly if present
  return (args.styleProps as Record<string, unknown>) || {};
}
