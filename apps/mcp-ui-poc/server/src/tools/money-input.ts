import { createUIResource } from "@mcp-ui/server";
import { escapeForJS } from "../utils/escape-for-js.js";

export interface CreateMoneyInputArgs {
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

export function createMoneyInput(args: CreateMoneyInputArgs) {
  const {
    name,
    currencyCode = "USD",
    amount = "",
    currencies,
    placeholder,
    isRequired = false,
    isDisabled = false,
    isReadOnly = false,
    isInvalid = false,
    size = "md",
    hasHighPrecisionBadge = false,
    isCurrencyInputDisabled = false,
    ariaLabel,
  } = args;

  // Use improved escaping for template literal safety
  const escapedName = name ? escapeForJS(name) : undefined;
  const escapedCurrencyCode = escapeForJS(currencyCode);
  const escapedAmount = escapeForJS(amount);
  const escapedPlaceholder = placeholder ? escapeForJS(placeholder) : undefined;
  const escapedAriaLabel = ariaLabel ? escapeForJS(ariaLabel) : undefined;
  const escapedCurrencies = currencies
    ? JSON.stringify(currencies.map(escapeForJS))
    : undefined;

  const remoteDomScript = `
    const moneyInput = document.createElement('nimbus-money-input');
    ${escapedName ? `moneyInput.setAttribute('name', '${escapedName}');` : ""}
    moneyInput.setAttribute('currency-code', '${escapedCurrencyCode}');
    moneyInput.setAttribute('amount', '${escapedAmount}');
    ${escapedCurrencies ? `moneyInput.setAttribute('currencies', '${escapedCurrencies}');` : ""}
    ${escapedPlaceholder ? `moneyInput.setAttribute('placeholder', '${escapedPlaceholder}');` : ""}
    ${isRequired ? `moneyInput.setAttribute('is-required', 'true');` : ""}
    ${isDisabled ? `moneyInput.setAttribute('is-disabled', 'true');` : ""}
    ${isReadOnly ? `moneyInput.setAttribute('is-read-only', 'true');` : ""}
    ${isInvalid ? `moneyInput.setAttribute('is-invalid', 'true');` : ""}
    ${size !== "md" ? `moneyInput.setAttribute('size', '${size}');` : ""}
    ${hasHighPrecisionBadge ? `moneyInput.setAttribute('has-high-precision-badge', 'true');` : ""}
    ${isCurrencyInputDisabled ? `moneyInput.setAttribute('is-currency-input-disabled', 'true');` : ""}
    ${escapedAriaLabel ? `moneyInput.setAttribute('aria-label', '${escapedAriaLabel}');` : ""}

    root.appendChild(moneyInput);
  `;

  return createUIResource({
    uri: `ui://money-input/${Date.now()}`,
    content: {
      type: "remoteDom",
      script: remoteDomScript,
      framework: "react",
    },
    encoding: "text",
    metadata: {
      title: "Money Input",
      description: placeholder || "Money Input",
      created: new Date().toISOString(),
    },
  });
}
