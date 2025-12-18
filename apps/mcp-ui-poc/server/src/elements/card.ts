import { z } from "zod";
import type { ElementDefinition } from "../types/remote-dom.js";

// Forward reference - will be defined in constants/child-element-schema.ts
const childElementSchema: z.ZodTypeAny = z.any();

export const cardElementSchema = z.object({
  type: z.literal("card"),
  elevation: z
    .string()
    .optional()
    .describe("Card elevation (e.g., 'elevated', 'flat')"),
  borderStyle: z
    .string()
    .optional()
    .describe("Border style (e.g., 'outlined', 'none')"),
  cardPadding: z.string().optional().describe("Card padding size"),
  maxWidth: z.string().optional().describe("Maximum width (e.g., '432px')"),
  width: z.string().optional().describe("Width (e.g., 'fit-content', 'full')"),
  children: z
    .array(childElementSchema)
    .optional()
    .describe("Array of child elements to nest inside the card"),
});

export interface CardHeaderElementArgs {
  children?: (ElementDefinition | string)[];
}

/**
 * Build a card header ElementDefinition
 */
export function buildCardHeaderElement(
  args: CardHeaderElementArgs
): ElementDefinition {
  return {
    tagName: "nimbus-card-header",
    children: args.children,
  };
}

export interface CardContentElementArgs {
  children?: (ElementDefinition | string)[];
}

/**
 * Build a card content ElementDefinition
 */
export function buildCardContentElement(
  args: CardContentElementArgs
): ElementDefinition {
  return {
    tagName: "nimbus-card-content",
    children: args.children,
  };
}

export interface CardElementArgs {
  elevation?: string;
  borderStyle?: string;
  cardPadding?: string;
  maxWidth?: string;
  width?: string;
  children?: (ElementDefinition | string)[];
}

/**
 * Build a card root ElementDefinition
 * Children should be CardHeader and/or CardContent elements
 */
export function buildCardElement(args: CardElementArgs): ElementDefinition {
  const {
    elevation = "elevated",
    borderStyle = "outlined",
    cardPadding,
    maxWidth,
    width,
    children,
  } = args;

  return {
    tagName: "nimbus-card-root",
    attributes: {
      elevation,
      borderStyle,
      cardPadding,
      maxWidth,
      width,
    },
    children,
  };
}
