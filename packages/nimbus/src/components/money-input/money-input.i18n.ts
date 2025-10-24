import { defineMessages } from "react-intl";

export const messages = defineMessages({
  currencySelectLabel: {
    id: "Nimbus.MoneyInput.currencySelectLabel",
    description: "aria-label for currency selection dropdown",
    defaultMessage: "Currency",
  },
  amountInputLabel: {
    id: "Nimbus.MoneyInput.amountInputLabel",
    description: "aria-label for amount input",
    defaultMessage: "Amount",
  },
  highPrecisionPrice: {
    id: "Nimbus.MoneyInput.highPrecisionPrice",
    description: "tooltip text for high precision price badge",
    defaultMessage: "High precision price",
  },
});
