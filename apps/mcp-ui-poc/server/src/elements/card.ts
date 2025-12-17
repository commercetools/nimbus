import type { ElementDefinition } from "../types/remote-dom.js";

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
