import type { ElementDefinition, Intent } from "../types/remote-dom.js";

export interface ButtonElementArgs {
  label: string;
  variant?: string;
  colorPalette?: string;
  width?: string;
  isDisabled?: boolean;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
  /** Intent to emit when button is pressed (required) */
  intent: Intent;
}

/**
 * Build a button ElementDefinition
 * Shared by createButton tool and child element converter
 */
export function buildButtonElement(args: ButtonElementArgs): ElementDefinition {
  const {
    label,
    variant = "solid",
    colorPalette = "primary",
    width,
    isDisabled = false,
    type = "button",
    ariaLabel,
    intent,
  } = args;

  return {
    tagName: "nimbus-button",
    attributes: {
      variant,
      colorPalette,
      isDisabled,
      type,
      width,
      "data-label": label,
      "aria-label": ariaLabel,
    },
    children: [label],
    events: { onPress: intent },
  };
}
