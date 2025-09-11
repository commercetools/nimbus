import { defineSlotRecipe } from "@chakra-ui/react";

export const moneyInputRecipe = defineSlotRecipe({
  slots: [
    "root",
    "container",
    "currencySelect",
    "currencyLabel",
    "amountInput",
    "badge",
  ],
  className: "money-input",
  base: {
    root: {
      width: "full",
      position: "relative",
      fontFamily: "inherit",
      "& .nimbus-select__trigger": {
        width: "2800",
        borderRightRadius: "0",
        // Show all but the right shadow
        boxShadow:
          "inset 0 1px 0 0 {colors.neutral.7}, inset 0 -1px 0 0 {colors.neutral.7}, inset 1px 0 0 0 {colors.neutral.7}",
      },
      "& .nimbus-number-input__root > input": {
        borderLeftRadius: "0",
      },
    },
    container: {
      display: "inline-flex",
      alignItems: "stretch",
      position: "relative",
    },
    currencySelect: {
      // Ensure focus ring is visible above amount input
      "& [data-focused='true']": {
        zIndex: 2,
      },
    },
    currencyLabel: {
      display: "flex",
      height: "full",
      borderLeftRadius: "200",
      backgroundColor: "neutral.1",
      boxShadow:
        "inset 0 1px 0 0 {colors.neutral.7}, inset 0 -1px 0 0 {colors.neutral.7}, inset 1px 0 0 0 {colors.neutral.7}",
      paddingInline: "400",
      alignItems: "center",
    },
    amountInput: {
      // Ensure focus ring is visible above currency select
      "& [data-has-focus='true']": {
        zIndex: 2,
      },
    },
    // TODO: tackle this once "trailing element" is save to be rebased on top of
    badge: {
      position: "absolute",
      top: "0",
      right: "0",
      height: "full",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: "spacing.25",
    },
  },
  variants: {
    size: {
      sm: {
        root: {
          fontSize: "fontSize.20",
        },
        currencySelect: {
          padding: "0 spacing.20",
        },
        amountInput: {
          paddingRight: "spacing.30",
        },
      },
      md: {
        root: {
          fontSize: "fontSize.30",
        },
        currencySelect: {
          padding: "0 spacing.25",
        },
        amountInput: {
          paddingRight: "spacing.40",
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});
