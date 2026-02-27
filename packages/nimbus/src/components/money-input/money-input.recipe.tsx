import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

export const moneyInputRecipe = defineSlotRecipe({
  slots: [
    "root",
    "container",
    "currencySelect",
    "currencyLabel",
    "amountInput",
    "badge",
  ],
  className: "nimbus-money-input",
  base: {
    root: {
      position: "relative",
      fontFamily: "inherit",
      "& .nimbus-select__trigger": {
        borderRightRadius: "0",
        // Show all but the right shadow
        boxShadow:
          "inset 0 1px 0 0 {colors.neutral.7}, inset 0 -1px 0 0 {colors.neutral.7}, inset 1px 0 0 0 {colors.neutral.7}",
      },
      "&:has(.nimbus-money-input__container:focus-within)": {
        "& .nimbus-money-input__currencyLabel": {
          // add outline to label so that it looks like focus outline is around entire input
          outlineWidth: "var(--focus-ring-width)",
          outlineColor: "var(--focus-ring-color)",
          outlineStyle: "var(--focus-ring-style)",
          outlineOffset: "var(--focus-ring-offset)",
          // remove outline on right side of label so that it looks like there is a continuous outline around the label and input.
          clipPath: `inset(-4px -1px -4px -4px)`,
        },
        "& .nimbus-money-input__amountInput": {
          // remove outline on left side of input so that it looks like there is a continuous outline around the label and input.
          clipPath: `inset(-4px -4px -4px -4px)`,
        },
      },
    },
    container: {
      display: "inline-flex",
      width: "full",
      alignItems: "stretch",
      position: "relative",
    },
    currencySelect: {
      // Ensure focus ring is visible above amount input
      _focusWithin: {
        zIndex: 2,
      },
    },
    currencyLabel: {
      color: "neutral.11",
      fontWeight: "500",
      display: "flex",
      height: "full",
      borderLeftRadius: "200",
      backgroundColor: "neutral.1",
      boxShadow:
        "inset 0 1px 0 0 {colors.neutral.7}, inset 0 -1px 0 0 {colors.neutral.7}, inset 1px 0 0 0 {colors.neutral.7}",
      paddingInline: "400",
      alignItems: "center",
      "&[data-disabled='true']": {
        opacity: "0.5",
      },
    },
    amountInput: {
      flex: "1",
      borderLeftRadius: "0",
      // Ensure focus ring is visible above currency select
      _focusWithin: {
        zIndex: 2,
      },
    },
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
          minWidth: "280px",
        },
        currencySelect: {
          padding: "0 spacing.20",
        },
        amountInput: {
          paddingRight: "spacing.30",
        },
        currencyLabel: {
          fontSize: "300",
          lineHeight: "450",
        },
      },
      md: {
        root: {
          fontSize: "fontSize.30",
          minWidth: "360px",
        },
        currencySelect: {
          padding: "0 spacing.25",
        },
        amountInput: {
          paddingRight: "spacing.40",
        },
        currencyLabel: {
          fontSize: "350",
          lineHeight: "500",
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});
