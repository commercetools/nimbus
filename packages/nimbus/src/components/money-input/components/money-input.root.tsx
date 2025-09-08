import { useRef, useCallback } from "react";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import {
  useFieldId,
  useToggleState,
  createSequentialId,
  filterDataAttributes,
} from "../utils";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { Box } from "@/components";
import { MoneyInputRootSlot } from "../money-input.slots";
import {
  MoneyInputProvider,
  type MoneyInputContextValue,
} from "../money-input-context";
import { moneyInputRecipe } from "../money-input.recipe";
import type { MoneyInputRootProps } from "../money-input.types";
import {
  formatAmount,
  isHighPrecision,
  type TCurrencyCode,
  currencies as allCurrencies,
} from "../utils";

const moneyInputSequentialId = createSequentialId("money-input-");

const getAmountInputName = (name?: string) =>
  name ? `${name}.amount` : undefined;
const getCurrencyDropdownName = (name?: string) =>
  name ? `${name}.currencyCode` : undefined;

export const MoneyInputRoot = (props: MoneyInputRootProps) => {
  const {
    id: providedId,
    name,
    value,
    currencies = [],
    onChange,
    onFocus,
    onBlur,
    horizontalConstraint = "scale",
    children,
    ...restProps
  } = props;

  const recipe = useSlotRecipe({ recipe: moneyInputRecipe });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(restProps);
  const [styleProps, functionalProps] = extractStyleProps(restRecipeProps);

  // Use default locale for now - can be made configurable later
  const locale = "en-US";
  const [currencyHasFocus, toggleCurrencyHasFocus] = useToggleState(false);
  const [amountHasFocus, toggleAmountHasFocus] = useToggleState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const amountInputRef = useRef<HTMLInputElement>(null);

  const moneyInputId = useFieldId(providedId, moneyInputSequentialId);

  // Event handlers
  const handleAmountFocus = useCallback(() => {
    if (onFocus) {
      onFocus({
        target: {
          id: `${moneyInputId}-amount`,
          name: getAmountInputName(name),
        },
      });
    }
    toggleAmountHasFocus(true);
  }, [onFocus, moneyInputId, name, toggleAmountHasFocus]);

  const handleAmountBlur = useCallback(() => {
    const amount = value.amount.trim();
    toggleAmountHasFocus(false);

    // Skip formatting for empty value or when the input is used with an unknown currency
    if (
      amount.length > 0 &&
      value.currencyCode &&
      allCurrencies[value.currencyCode]
    ) {
      const formattedAmount = formatAmount(amount, locale, value.currencyCode);

      // When the user entered a value with centPrecision, we can format
      // the resulting value to that currency, e.g. 20.1 to 20.10
      if (String(formattedAmount) !== amount && onChange) {
        // We need to emit an event with the now formatted value
        const fakeEvent = {
          persist: () => {},
          target: {
            id: `${moneyInputId}-amount`,
            name: getAmountInputName(name),
            value: formattedAmount,
          },
        };
        onChange(fakeEvent);
      }
    }
  }, [
    value.amount,
    value.currencyCode,
    locale,
    onChange,
    moneyInputId,
    name,
    toggleAmountHasFocus,
  ]);

  const handleAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange({
          persist: () => {},
          target: {
            id: `${moneyInputId}-amount`,
            name: getAmountInputName(name),
            value: event.target.value,
          },
        });
      }
    },
    [onChange, moneyInputId, name]
  );

  const handleCurrencyChange = useCallback(
    (currencyCode: TCurrencyCode) => {
      if (value.currencyCode !== currencyCode && onChange) {
        // When the user changes from a currency with 3 fraction digits to
        // a currency with 2 fraction digits, and when the input value was
        // "9.000" (9), then it should change to "9.00" to reflect the new
        // currency's number of fraction digits.
        const formattedAmount = formatAmount(
          value.amount.trim(),
          locale,
          currencyCode
        );

        // The user could be changing the currency before entering any amount,
        // or while the amount is invalid. In these cases, we don't attempt to format the amount.
        const nextAmount = isNaN(Number(formattedAmount))
          ? value.amount
          : formattedAmount;

        // Change currency code
        const fakeCurrencyEvent = {
          persist: () => {},
          target: {
            id: `${moneyInputId}-currency`,
            name: getCurrencyDropdownName(name),
            value: currencyCode || "",
          },
        };
        onChange(fakeCurrencyEvent);

        // Change amount if necessary
        if (value.amount !== nextAmount) {
          onChange({
            persist: () => {},
            target: {
              id: `${moneyInputId}-amount`,
              name: getAmountInputName(name),
              value: nextAmount,
            },
          });
        }

        amountInputRef.current?.focus();
      }
    },
    [locale, onChange, moneyInputId, name, value.amount, value.currencyCode]
  );

  const handleCurrencyFocus = useCallback(() => {
    if (onFocus) {
      onFocus({
        target: {
          id: `${moneyInputId}-currency`,
          name: getCurrencyDropdownName(name),
        },
      });
    }
    toggleCurrencyHasFocus(true);
  }, [onFocus, toggleCurrencyHasFocus, name, moneyInputId]);

  const handleCurrencyBlur = useCallback(() => {
    toggleCurrencyHasFocus(false);
  }, [toggleCurrencyHasFocus]);

  const handleContainerBlur = useCallback(
    (event: React.FocusEvent) => {
      // ensures that both fields are marked as touched when one of them is blurred
      if (
        typeof onBlur === "function" &&
        !containerRef.current?.contains(event.relatedTarget as Node)
      ) {
        onBlur({
          target: {
            id: `${moneyInputId}-currency`,
            name: getCurrencyDropdownName(name),
          },
        });
        onBlur({
          target: {
            id: `${moneyInputId}-amount`,
            name: getAmountInputName(name),
          },
        });
      }
    },
    [onBlur, moneyInputId, name]
  );

  // Computed values
  const hasNoCurrencies = currencies.length === 0;
  const hasFocus = currencyHasFocus || amountHasFocus;
  const currentIsHighPrecision = isHighPrecision(value, locale);

  // Context value
  const contextValue: MoneyInputContextValue = {
    // Core state
    id: moneyInputId,
    name,
    value,
    currencies,

    // Event handlers
    onChange,
    onFocus,
    onBlur,

    // Internal handlers
    handleAmountChange,
    handleAmountFocus,
    handleAmountBlur,
    handleCurrencyChange,
    handleCurrencyFocus,
    handleCurrencyBlur,
    handleContainerBlur,

    // State flags
    currencyHasFocus,
    amountHasFocus,
    hasFocus,
    hasNoCurrencies,

    // Component props
    ...functionalProps,

    // High precision
    isHighPrecision: currentIsHighPrecision,

    // Helper functions
    getAmountInputId: () => `${moneyInputId}-amount`,
    getCurrencyDropdownId: () => `${moneyInputId}-currency`,
    getAmountInputName: () => getAmountInputName(name),
    getCurrencyDropdownName: () => getCurrencyDropdownName(name),
  };

  const getMaxWidth = () => {
    if (horizontalConstraint === "scale") return "100%";
    if (horizontalConstraint === "auto") return "auto";
    // Convert constraint number to approximate width
    return `${horizontalConstraint * 60}px`;
  };

  return (
    <Box maxWidth={getMaxWidth()}>
      <MoneyInputProvider value={contextValue}>
        <MoneyInputRootSlot
          {...recipeProps}
          {...styleProps}
          ref={containerRef}
          onBlur={handleContainerBlur}
          data-testid="money-input-container"
        >
          {children}
        </MoneyInputRootSlot>
      </MoneyInputProvider>
    </Box>
  );
};
