import { z } from "zod";
import type { ElementDefinition } from "../types/remote-dom.js";

export interface HeadingElementArgs {
  content: string;
  size?: string;
  marginBottom?: string;
}

export const headingElementSchema = z.object({
  type: z.literal("heading"),
  content: z.string().describe("Heading text content"),
  size: z
    .string()
    .optional()
    .describe("Heading size (e.g., 'xs', 'sm', 'md', 'lg', 'xl')"),
  marginBottom: z.string().optional().describe("Bottom margin"),
});

/**
 * Build a heading ElementDefinition
 * Shared by createHeading tool and child element converter
 */
export function buildHeadingElement(
  args: HeadingElementArgs
): ElementDefinition {
  const { content, size = "lg", marginBottom } = args;

  return {
    tagName: "nimbus-heading",
    attributes: {
      size,
      marginBottom,
    },
    children: [content],
  };
}
