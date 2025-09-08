import { defineSlotRecipe } from "@chakra-ui/react";

export const moneyInputRecipe = defineSlotRecipe({
  slots: ["root", "currencySelect", "amountInput", "badge"],
  className: "money-input",
  base: {
    root: {
      width: "full",
      position: "relative",
      display: "flex",
      fontFamily: "inherit",
    },
    currencySelect: {
      minWidth: "80px",
      borderTopRightRadius: "0",
      borderBottomRightRadius: "0",
      borderRight: "0",
    },
    amountInput: {
      width: "full",
      borderTopLeftRadius: "0",
      borderBottomLeftRadius: "0",
      marginLeft: "0",
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
    hasError: {
      true: {
        currencySelect: {
          borderColor: "borderColorForInputWhenError",
          _hover: {
            borderColor: "borderColorForInputWhenError",
          },
        },
        amountInput: {
          borderColor: "borderColorForInputWhenError",
          borderLeftColor: "borderColorForInputWhenError",
        },
      },
    },
    hasWarning: {
      true: {
        currencySelect: {
          borderColor: "borderColorForInputWhenWarning",
          _hover: {
            borderColor: "borderColorForInputWhenWarning",
          },
        },
        amountInput: {
          borderColor: "borderColorForInputWhenWarning",
          borderLeftColor: "borderColorForInputWhenWarning",
        },
      },
    },
    isDisabled: {
      true: {
        currencySelect: {
          backgroundColor: "backgroundColorForInputWhenDisabled",
          borderColor: "borderColorForInputWhenDisabled",
          cursor: "not-allowed",
        },
        amountInput: {
          backgroundColor: "backgroundColorForInputWhenDisabled",
          borderColor: "borderColorForInputWhenDisabled",
          cursor: "not-allowed",
        },
        badge: {
          cursor: "not-allowed",
        },
      },
    },
    isReadOnly: {
      true: {
        currencySelect: {
          backgroundColor: "backgroundColorForInputWhenReadonly",
          borderColor: "borderColorForInputWhenReadonly",
          cursor: "default",
        },
        amountInput: {
          backgroundColor: "backgroundColorForInputWhenReadonly",
          borderColor: "borderColorForInputWhenReadonly",
          cursor: "default",
        },
        badge: {
          cursor: "default",
        },
      },
    },
    hasFocus: {
      true: {
        currencySelect: {
          borderColor: "borderColorForInputWhenFocused",
        },
        amountInput: {
          borderColor: "borderColorForInputWhenFocused",
          borderLeftColor: "borderColorForInputWhenFocused",
        },
      },
    },
    isCondensed: {
      true: {
        root: {
          fontSize: "fontSize.20",
        },
        currencySelect: {
          padding: "0 spacing.20",
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});
