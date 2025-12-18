import { z } from "zod";
import type { ElementDefinition } from "../types/remote-dom.js";

export interface BadgeElementArgs {
  label: string;
  colorPalette?: string;
  size?: string;
  width?: string;
}

export const badgeElementSchema = z.object({
  type: z.literal("badge"),
  label: z.string().describe("Badge label text"),
  colorPalette: z
    .string()
    .optional()
    .describe("Color palette (e.g., 'primary', 'positive', 'critical')"),
  size: z
    .string()
    .optional()
    .describe("Badge size (e.g., '2xs', 'xs', 'sm', 'md')"),
  width: z.string().optional().describe("Badge width"),
});

/**
 * Build a badge ElementDefinition
 * Shared by createBadge tool and child element converter
 */
export function buildBadgeElement(args: BadgeElementArgs): ElementDefinition {
  const { label, colorPalette = "primary", size = "md", width } = args;

  return {
    tagName: "nimbus-badge",
    attributes: {
      colorPalette,
      size,
      width,
    },
    children: [label],
  };
}
