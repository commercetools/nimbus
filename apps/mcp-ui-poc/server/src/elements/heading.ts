import type { ElementDefinition } from "../types/remote-dom.js";

export interface HeadingElementArgs {
  content: string;
  size?: string;
  marginBottom?: string;
}

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
