import { z } from "zod";
import type { ElementDefinition } from "../types/remote-dom.js";

// Forward reference - will be defined in constants/child-element-schema.ts
const childElementSchema: z.ZodTypeAny = z.any();

export const stackElementSchema = z.object({
  type: z.literal("stack"),
  direction: z
    .string()
    .optional()
    .describe("Stack direction (e.g., 'row', 'column')"),
  gap: z.string().optional().describe("Gap between items"),
  width: z.string().optional().describe("Stack width"),
  marginBottom: z.string().optional().describe("Bottom margin"),
  children: z
    .array(childElementSchema)
    .optional()
    .describe("Array of child elements to nest inside the stack container"),
  as: z
    .enum(["div", "form"])
    .optional()
    .describe(
      "Render as HTML element (default: 'div'). Use 'form' for native HTML form submission."
    ),
  action: z
    .string()
    .optional()
    .describe(
      "Form submission URL (only used when as='form'). OPTIONAL - if omitted, form data will be displayed in a dialog on submit."
    ),
  method: z
    .enum(["get", "post"])
    .optional()
    .describe("HTTP method for form submission (only used when as='form')"),
  enctype: z
    .enum([
      "application/x-www-form-urlencoded",
      "multipart/form-data",
      "text/plain",
    ])
    .optional()
    .describe("Form encoding type (only used when as='form')"),
});

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
