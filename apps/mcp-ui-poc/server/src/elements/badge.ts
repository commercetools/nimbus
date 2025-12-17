import type { ElementDefinition } from "../types/remote-dom.js";

export interface BadgeElementArgs {
  label: string;
  colorPalette?: string;
  size?: string;
  width?: string;
}

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
