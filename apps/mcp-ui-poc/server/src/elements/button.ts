import { z } from "zod";
import type { ElementDefinition } from "../types/remote-dom.js";

export interface ButtonElementArgs {
  label: string;
  variant?: string;
  colorPalette?: string;
  width?: string;
  isDisabled?: boolean;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
}

/**
 * Zod schema for button element (shared between tool registration and child compositions)
 */
export const buttonElementSchema = z.object({
  type: z.literal("button"),
  label: z.string().describe("Button label text"),
  variant: z
    .string()
    .optional()
    .describe("Button variant (e.g., 'solid', 'outline', 'ghost')"),
  colorPalette: z
    .string()
    .optional()
    .describe("Color palette (e.g., 'primary', 'critical')"),
  width: z.string().optional().describe("Button width"),
  isDisabled: z.boolean().optional().describe("Whether the button is disabled"),
  buttonType: z
    .enum(["button", "submit", "reset"])
    .optional()
    .describe(
      "Button type for HTML forms (default: 'button'). Use 'submit' for form submission buttons."
    ),
  ariaLabel: z
    .string()
    .optional()
    .describe(
      "Accessible label for the button (overrides visible label for screen readers)"
    ),
});

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
  };
}
