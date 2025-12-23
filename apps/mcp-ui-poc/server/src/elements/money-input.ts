/**
 * MoneyInput Remote DOM Custom Element
 */

import { createRemoteElement } from "@remote-dom/core/elements";

export const NimbusMoneyInput = createRemoteElement({
  properties: {
    styleProps: true,
    name: true,
    currencyCode: true,
    amount: true,
    currencies: true,
    placeholder: true,
    isRequired: true,
    isDisabled: true,
    isReadOnly: true,
    isInvalid: true,
    size: true,
    hasHighPrecisionBadge: true,
    isCurrencyInputDisabled: true,
  },
});

// Self-register on import
if (
  typeof customElements !== "undefined" &&
  !customElements.get("nimbus-money-input")
) {
  customElements.define("nimbus-money-input", NimbusMoneyInput);
}
