import type { ElementDefinition } from "../types/remote-dom.js";

export interface FlexElementArgs {
  direction?: string;
  gap?: string;
  padding?: string;
  backgroundColor?: string;
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
 * Build a flex ElementDefinition
 * Shared by createFlex tool and child element converter
 */
export function buildFlexElement(args: FlexElementArgs): ElementDefinition {
  const {
    direction = "row",
    gap,
    padding,
    backgroundColor,
    as,
    action,
    method,
    enctype,
    children,
  } = args;

  return {
    tagName: "nimbus-flex",
    attributes: {
      direction,
      gap,
      padding,
      backgroundColor,
      as,
      action,
      method,
      enctype,
    },
    children,
  };
}
