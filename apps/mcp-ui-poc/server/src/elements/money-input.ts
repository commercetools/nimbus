import type { ElementDefinition } from "../types/remote-dom.js";

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
