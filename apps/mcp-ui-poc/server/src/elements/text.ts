import type { ElementDefinition } from "../types/remote-dom.js";

export interface TextElementArgs {
  content: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  marginBottom?: string;
}

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
