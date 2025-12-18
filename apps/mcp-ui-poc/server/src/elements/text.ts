import { z } from "zod";
import type { ElementDefinition } from "../types/remote-dom.js";

export interface TextElementArgs {
  content: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  marginBottom?: string;
}

export const textElementSchema = z.object({
  type: z.literal("text"),
  content: z.string().describe("Text content to display"),
  fontSize: z
    .string()
    .optional()
    .describe("Font size (e.g., 'sm', 'md', 'lg', 'xl')"),
  fontWeight: z
    .string()
    .optional()
    .describe("Font weight (e.g., 'normal', 'bold')"),
  color: z.string().optional().describe("Text color"),
  marginBottom: z.string().optional().describe("Bottom margin"),
});

/**
 * Build a text ElementDefinition
 * Shared by createText tool and child element converter
 */
export function buildTextElement(args: TextElementArgs): ElementDefinition {
  return {
    tagName: "nimbus-text",
    attributes: {
      fontSize: args.fontSize,
      fontWeight: args.fontWeight,
      color: args.color,
      marginBottom: args.marginBottom,
    },
    children: [args.content],
  };
}
