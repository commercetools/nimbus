import { useRef, useState, useCallback, useId, useMemo } from "react";
import { mergeRefs } from "@chakra-ui/react";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { useObjectRef, useLocale } from "react-aria";
import { useIntl, FormattedMessage } from "react-intl";
import {
  NumberInput,
  Select,
  Tooltip,
  Box,
  MakeElementFocusable,
} from "@/components";
import { HighPrecision } from "@commercetools/nimbus-icons";
import { extractStyleProps } from "@/utils/extractStyleProps";
import currenciesData from "./utils/currencies";
import {
  MoneyInputRootSlot,
  MoneyInputContainerSlot,
  MoneyInputCurrencySelectSlot,
  MoneyInputCurrencyLabelSlot,
  MoneyInputAmountInputSlot,
  MoneyInputBadgeSlot,
} from "./money-input.slots";
import { moneyInputRecipe } from "./money-input.recipe";
import {
  isHighPrecision,
  transformFormInputToMoneyValue,
  formatMoneyValueForDisplay,
  isEmpty,
} from "./utils";
import type {
  TCustomEvent,
  MoneyInputProps,
  TCurrencyCode,
} from "./money-input.types";
import messages from "./money-input.i18n";

/**
 * # MoneyInput
 *
 * A specialized input component for entering monetary amounts with currency selection.
 * Supports high precision values and automatic locale-based formatting.
 *
 * ## Usage
 *
 * ### Modern API (Recommended)
 *
 * Use the modern event handlers for better type safety and cleaner code:
 *
 * ```tsx
 * function MyComponent() {
 *   const [value, setValue] = useState<TValue>({
 *     amount: "",
 *     currencyCode: "USD",
 *   });
 *
 *   return (
 *     <MoneyInput
 *       value={value}
 *       currencies={["USD", "EUR", "GBP"]}
 *       onValueChange={setValue} // Recommended: handles complete value changes
 *       onAmountChange={(amount) => console.log("Amount:", amount)}
 *       onCurrencyChange={(currency) => console.log("Currency:", currency)}
 *     />
 *   );
 * }
 * ```
 *
 * ### Legacy API (Deprecated)
 *
 * For backward compatibility only - migrate to modern API when possible:
 *
 * ```tsx
 * function LegacyComponent() {
 *   const [value, setValue] = useState<TValue>({ amount: "", currencyCode: "USD" });
 *
 *   const handleChange = (event: TCustomEvent) => {
 *     const { name, value } = event.target;
 *     if (name?.endsWith(".amount")) {
 *       setValue(prev => ({ ...prev, amount: value as string }));
 *     } else if (name?.endsWith(".currencyCode")) {
 *       setValue(prev => ({ ...prev, currencyCode: value as TCurrencyCode }));
 *     }
 *   };
 *
 *   return (
 *     <MoneyInput
 *       value={value}
 *       currencies={["USD", "EUR"]}
 *       onChange={handleChange} // Deprecated - use onValueChange instead
 *     />
 *   );
 * }
 * ```
 *
 * ## Features
 *
 * - **Type-safe currency handling** with TCurrencyCode enum
 * - **High precision support** for values exceeding standard currency precision
 * - **Automatic locale formatting** using React Aria NumberField
 * - **Accessibility compliant** following WCAG 2.1 AA standards
 * - **Dual API support** for backward compatibility and modern development
 */
export const MoneyInputComponent = (props: MoneyInputProps) => {
  const {
    id: providedId,
    name,
    value,
    currencies = [],
    onChange,
    onValueChange,
    onAmountChange,
    onCurrencyChange,
    onFocus,
    onBlur,
    isDisabled,
    isReadOnly,
    isInvalid,
    isRequired,
    hasHighPrecisionBadge = true,
    isCurrencyInputDisabled,
    placeholder = "0.00",
    autoFocus,
    size,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    ...restProps
  } = props;

  // Generate IDs
  const generatedId = useId();
  const id = providedId || generatedId;

  // Get locale for formatting
  const { locale } = useLocale();
  const intl = useIntl();

  // State management
  const [currencyHasFocus, setCurrencyHasFocus] = useState(false);
  const [amountHasFocus, setAmountHasFocus] = useState(false);
  const hasFocus = currencyHasFocus || amountHasFocus;
  const hasNoCurrencies = !currencies || currencies.length === 0;

  // Convert string value to number for NumberInput
  const numericValue = value.amount ? parseFloat(value.amount) : undefined;

  // High precision detection using raw input value - default to en if locale is not provided
  const isCurrentlyHighPrecision = isHighPrecision(value, locale || "en");

  // Create currency-aware format options for NumberInput
  const formatOptions: Intl.NumberFormatOptions = useMemo(() => {
    if (!value.currencyCode) return {};

    // Decimal style: pure number formatting without currency symbols
    // Handles high precision mode for extended decimal places
    return {
      minimumFractionDigits: currenciesData[value.currencyCode].fractionDigits, // Always respect currency minimum (e.g., 2 for USD, 0 for JPY)
      maximumFractionDigits: 20, // Always use a maximum of 20 decimal places to match API precision
      useGrouping: true, // Keep thousand separators for readability (formatted per locale)
      style: "decimal", // Use decimal to avoid currency symbol conflicts
    };
  }, [value.currencyCode, locale]);

  // Refs
  const localRef = useRef<HTMLInputElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, null));

  // Recipe setup
  const recipe = useSlotRecipe({ recipe: moneyInputRecipe });
  const [recipeProps, recipeRestProps] = recipe.splitVariantProps({
    ...restProps,
    size,
  });
  const [styleProps, remainingProps] = extractStyleProps(recipeRestProps);

  // Helper functions
  const getAmountInputId = () => `${id}-amount`;
  const getCurrencyDropdownId = () => `${id}-currency`;
  const getAmountInputName = () => (name ? `${name}.amount` : undefined);
  const getCurrencyDropdownName = () =>
    name ? `${name}.currencyCode` : undefined;

  // Event handlers - NumberInput will preserve decimal precision with new settings
  const handleAmountChange = useCallback(
    (newValue: number) => {
      const stringValue = newValue.toString();

      // Support legacy API
      const event: TCustomEvent = {
        target: {
          id: getAmountInputId(),
          name: getAmountInputName(),
          value: stringValue,
        },
      };
      onChange?.(event);

      // Support modern APIs
      const newValueObject = { ...value, amount: stringValue };
      onValueChange?.(newValueObject);
      onAmountChange?.(stringValue);
    },
    [onChange, onValueChange, onAmountChange, value, id, name]
  );

  const handleAmountFocus = useCallback(() => {
    setAmountHasFocus(true);
    const event: TCustomEvent = {
      target: {
        id: getAmountInputId(),
        name: getAmountInputName(),
        value: value.amount,
      },
    };
    onFocus?.(event);
  }, [onFocus, value.amount, id, name]);

  const handleAmountBlur = useCallback(() => {
    setAmountHasFocus(false);
    const event: TCustomEvent = {
      target: {
        id: getAmountInputId(),
        name: getAmountInputName(),
        value: value.amount,
      },
    };
    onBlur?.(event);
  }, [onBlur, value, id, name]);

  const handleCurrencyChange = useCallback(
    (currencyCode: string) => {
      // Support legacy API
      const event: TCustomEvent = {
        target: {
          id: getCurrencyDropdownId(),
          name: getCurrencyDropdownName(),
          value: currencyCode,
        },
      };
      onChange?.(event);

      // Support modern APIs
      const newValueObject = {
        ...value,
        currencyCode: currencyCode as TCurrencyCode,
      };
      onValueChange?.(newValueObject);
      onCurrencyChange?.(currencyCode as TCurrencyCode);
    },
    [onChange, onValueChange, onCurrencyChange, value, id, name]
  );

  const handleCurrencyFocus = useCallback(() => {
    setCurrencyHasFocus(true);
    const event: TCustomEvent = {
      target: {
        id: getCurrencyDropdownId(),
        name: getCurrencyDropdownName(),
        value: value.currencyCode,
      },
    };
    onFocus?.(event);
  }, [onFocus, value.currencyCode, id, name]);

  const handleCurrencyBlur = useCallback(() => {
    setCurrencyHasFocus(false);
    const event: TCustomEvent = {
      target: {
        id: getCurrencyDropdownId(),
        name: getCurrencyDropdownName(),
        value: value.currencyCode,
      },
    };
    onBlur?.(event);
  }, [onBlur, value.currencyCode, id, name]);

  const handleCurrencySelectionChange = useCallback(
    (selectedKey: string | number | null) => {
      if (selectedKey && typeof selectedKey === "string") {
        handleCurrencyChange(selectedKey);
      }
    },
    [handleCurrencyChange]
  );

  const stateProps = {
    isInvalid,
    isDisabled,
    isReadOnly,
    hasFocus,
  };

  return (
    <MoneyInputRootSlot
      {...recipeProps}
      {...styleProps}
      {...stateProps}
      {...remainingProps}
    >
      <MoneyInputContainerSlot>
        {/* Currency Select or Label */}
        <MoneyInputCurrencySelectSlot {...stateProps}>
          {hasNoCurrencies ? (
            <MoneyInputCurrencyLabelSlot asChild>
              <label data-testid="currency-label">{value.currencyCode}</label>
            </MoneyInputCurrencyLabelSlot>
          ) : (
            <Select.Root
              selectedKey={value.currencyCode || null}
              onSelectionChange={handleCurrencySelectionChange}
              onFocus={handleCurrencyFocus}
              onBlur={handleCurrencyBlur}
              isDisabled={isCurrencyInputDisabled || isDisabled || isReadOnly}
              isClearable={false}
              placeholder=""
              aria-label={intl.formatMessage(messages.currencySelection)}
              data-testid="currency-dropdown"
              size={size}
            >
              <Select.Options>
                {currencies.map((currencyCode) => (
                  <Select.Option key={currencyCode} id={currencyCode}>
                    {currencyCode}
                  </Select.Option>
                ))}
              </Select.Options>
            </Select.Root>
          )}
        </MoneyInputCurrencySelectSlot>

        {/* Amount Input - NumberInput handles live user interaction */}
        <MoneyInputAmountInputSlot
          ref={ref}
          data-has-focus={hasFocus}
          data-has-high-precision={
            hasHighPrecisionBadge && isCurrentlyHighPrecision
          }
          {...stateProps}
          asChild
        >
          <NumberInput
            value={numericValue}
            formatOptions={formatOptions}
            onChange={handleAmountChange}
            onFocus={handleAmountFocus}
            onBlur={handleAmountBlur}
            isDisabled={isDisabled}
            isReadOnly={isReadOnly}
            isInvalid={isInvalid}
            isRequired={isRequired}
            placeholder={placeholder}
            autoFocus={autoFocus}
            size={size}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
          />
        </MoneyInputAmountInputSlot>
      </MoneyInputContainerSlot>

      {/* High Precision Badge */}
      {hasHighPrecisionBadge && isCurrentlyHighPrecision && (
        <MoneyInputBadgeSlot data-testid="high-precision-badge">
          <Tooltip.Root delay={0} closeDelay={0}>
            <MakeElementFocusable>
              <Box
                // TODO: this is a hack to position the badge correctly until we have trailingElement support
                transform="translateX(-100px) translateY(2px)"
                color={isDisabled ? "neutral.8" : "neutral.11"}
              >
                <HighPrecision />
              </Box>
            </MakeElementFocusable>
            <Tooltip.Content placement="top">
              <FormattedMessage {...messages.highPrecisionPrice} />
            </Tooltip.Content>
          </Tooltip.Root>
        </MoneyInputBadgeSlot>
      )}
    </MoneyInputRootSlot>
  );
};

MoneyInputComponent.displayName = "MoneyInput";

// Create the main export with static methods
type MoneyInputType = typeof MoneyInputComponent & {
  // Static methods preserved from UI Kit
  convertToMoneyValue: typeof transformFormInputToMoneyValue;
  parseMoneyValue: typeof formatMoneyValueForDisplay;
  isEmpty: typeof isEmpty;
  isHighPrecision: typeof isHighPrecision;
};

export const MoneyInput = MoneyInputComponent as MoneyInputType;

// Static methods for UI-Kit compatibility and internal utilities
MoneyInput.convertToMoneyValue = transformFormInputToMoneyValue;
MoneyInput.parseMoneyValue = formatMoneyValueForDisplay;
MoneyInput.isEmpty = isEmpty;
MoneyInput.isHighPrecision = isHighPrecision;
