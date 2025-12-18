import { z } from "zod";
import type { ElementDefinition } from "../types/remote-dom.js";

// Forward reference - will be defined in constants/child-element-schema.ts
const childElementSchema: z.ZodTypeAny = z.any();

export const flexElementSchema = z.object({
  type: z.literal("flex"),
  direction: z
    .string()
    .optional()
    .describe("Flex direction (e.g., 'row', 'column')"),
  gap: z.string().optional().describe("Gap between items"),
  padding: z.string().optional().describe("Container padding"),
  backgroundColor: z.string().optional().describe("Background color"),
  children: z
    .array(childElementSchema)
    .optional()
    .describe("Array of child elements to nest inside the flex container"),
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
