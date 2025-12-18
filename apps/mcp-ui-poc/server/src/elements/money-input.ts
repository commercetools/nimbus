import { z } from "zod";
import type { ElementDefinition } from "../types/remote-dom.js";

export const moneyInputElementSchema = z.object({
  type: z.literal("moneyInput"),
  name: z
    .string()
    .optional()
    .describe(
      "Input name attribute prefix for form submission (creates ${name}.amount and ${name}.currencyCode fields)"
    ),
  currencyCode: z
    .string()
    .optional()
    .describe(
      "Initial currency code (e.g., 'USD', 'EUR', 'GBP'). Default: 'USD'"
    ),
  amount: z
    .string()
    .optional()
    .describe("Initial amount value as string (e.g., '100.00')"),
  currencies: z
    .array(z.string())
    .optional()
    .describe(
      "Array of available currency codes for dropdown. If not provided or empty, shows a label instead of dropdown."
    ),
  placeholder: z
    .string()
    .optional()
    .describe("Placeholder text for the amount input"),
  isRequired: z.boolean().optional().describe("Whether the input is required"),
  isDisabled: z.boolean().optional().describe("Whether the input is disabled"),
  isReadOnly: z.boolean().optional().describe("Whether the input is read-only"),
  isInvalid: z
    .boolean()
    .optional()
    .describe("Whether the input has validation errors"),
  size: z
    .enum(["sm", "md"])
    .optional()
    .describe("Size variant (default: 'md')"),
  hasHighPrecisionBadge: z
    .boolean()
    .optional()
    .describe("Shows high precision badge when value uses high precision"),
  isCurrencyInputDisabled: z
    .boolean()
    .optional()
    .describe(
      "Disables only the currency dropdown/label while keeping amount input enabled"
    ),
  ariaLabel: z.string().optional().describe("Accessible label for the input"),
});

export interface MoneyInputElementArgs {
  name?: string;
  currencyCode?: string;
  amount?: string;
  currencies?: string[];
  placeholder?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  size?: "sm" | "md";
  hasHighPrecisionBadge?: boolean;
  isCurrencyInputDisabled?: boolean;
  ariaLabel?: string;
}

/**
 * Build a money input ElementDefinition
 */
export function buildMoneyInputElement(
  args: MoneyInputElementArgs
): ElementDefinition {
  const {
    name,
    currencyCode = "USD",
    amount = "",
    currencies,
    placeholder,
    isRequired,
    isDisabled,
    isReadOnly,
    isInvalid,
    size,
    hasHighPrecisionBadge,
    isCurrencyInputDisabled,
    ariaLabel,
  } = args;

  return {
    tagName: "nimbus-money-input",
    attributes: {
      name,
      currencyCode,
      amount,
      currencies: currencies ? JSON.stringify(currencies) : undefined,
      placeholder,
      isRequired,
      isDisabled,
      isReadOnly,
      isInvalid,
      size,
      hasHighPrecisionBadge,
      isCurrencyInputDisabled,
      "aria-label": ariaLabel, // Keep kebab for aria
    },
  };
}
