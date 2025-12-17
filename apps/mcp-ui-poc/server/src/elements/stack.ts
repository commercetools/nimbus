import type { ElementDefinition } from "../types/remote-dom.js";

export interface StackElementArgs {
  direction?: string;
  gap?: string;
  width?: string;
  marginBottom?: string;
  as?: "div" | "form";
  action?: string;
  method?: "get" | "post";
  enctype?:
    | "application/x-www-form-urlencoded"
    | "multipart/form-data"
    | "text/plain";
  children?: (ElementDefinition | string)[];
}

/**
 * Build a stack ElementDefinition
 * Shared by createStack tool and child element converter
 */
export function buildStackElement(args: StackElementArgs): ElementDefinition {
  const {
    direction = "column",
    gap,
    width,
    marginBottom,
    as,
    action,
    method,
    enctype,
    children,
  } = args;

  return {
    tagName: "nimbus-stack",
    attributes: {
      direction,
      gap,
      width,
      marginBottom,
      as,
      action,
      method,
      enctype,
    },
    children,
  };
}
