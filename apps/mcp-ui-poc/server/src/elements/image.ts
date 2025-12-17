import type { ElementDefinition } from "../types/remote-dom.js";

export interface ImageElementArgs {
  src: string;
  alt: string;
  borderRadius?: string;
  marginBottom?: string;
}

/**
 * Build an image ElementDefinition
 */
export function buildImageElement(args: ImageElementArgs): ElementDefinition {
  return {
    tagName: "nimbus-image",
    attributes: {
      src: args.src,
      alt: args.alt,
      borderRadius: args.borderRadius,
      marginBottom: args.marginBottom,
    },
  };
}
