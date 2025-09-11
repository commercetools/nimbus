import { useRef, useState, useCallback, useId, useMemo } from "react";
import { mergeRefs } from "@chakra-ui/react";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { useObjectRef } from "react-aria";
import { NumberInput, Select, Tooltip } from "@/components";
import { HighPrecision } from "@commercetools/nimbus-icons";
import { extractStyleProps } from "@/utils/extractStyleProps";
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
  convertToMoneyValue,
  parseMoneyValue,
  isEmpty,
} from "./utils";
import currenciesData from "../../utils/currencies";
import type { TCustomEvent, MoneyInputProps } from "./money-input.types";

// TODO: we need to ensure that when a currency is selected, the digits align to fractionDigits, unless highPrecision is true
// TODO: Form integration needs to work

/**
 * # MoneyInput
 *
 * A specialized input component for entering monetary amounts with currency selection.
 * Supports high precision values and automatic locale-based formatting.
 */
export const MoneyInputComponent = (props: MoneyInputProps) => {
  const {
    id: providedId,
    name,
    value,
    currencies = [],
    onChange,
    onFocus,
    onBlur,
    isDisabled,
    isReadOnly,
    isInvalid,
    hasWarning,
    hasHighPrecisionBadge = true,
    isCurrencyInputDisabled,
    placeholder = "0.00",
    autoFocus,
    tooltipContent,
    size,
    ...restProps
  } = props;

  // Generate IDs
  const generatedId = useId();
  const id = providedId || generatedId;

  // State management
  const [currencyHasFocus, setCurrencyHasFocus] = useState(false);
  const [amountHasFocus, setAmountHasFocus] = useState(false);
  const hasFocus = currencyHasFocus || amountHasFocus;
  const hasNoCurrencies = !currencies || currencies.length === 0;

  // Convert string value to number for NumberInput
  const numericValue = value.amount ? parseFloat(value.amount) : undefined;

  // Implement enhanced high precision detection using raw input value
  const isCurrentlyHighPrecision = useMemo(() => {
    if (!value.currencyCode || !value.amount) return false;

    // Safe currency lookup with proper type checking
    const currencyData = currenciesData[value.currencyCode];
    if (!currencyData) return false;

    // Use the raw input value (amount string) to check precision
    const amountStr = value.amount.toString().trim();
    if (amountStr === "") return false;

    // Parse the raw amount to count decimal places
    const decimalIndex = amountStr.indexOf(".");
    if (decimalIndex === -1) return false; // No decimals

    const actualPrecision = amountStr.length - decimalIndex - 1;
    return actualPrecision > currencyData.fractionDigits;
  }, [value.amount, value.currencyCode]);

  // Refs
  const localRef = useRef<HTMLInputElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, null));

  // Recipe setup
  const recipe = useSlotRecipe({ recipe: moneyInputRecipe });
  const [recipeProps] = recipe.splitVariantProps({ ...restProps, size });
  const [styleProps] = extractStyleProps(restProps);

  // Helper functions
  // TODO: Evaluate if we can remove these helpers
  const getAmountInputId = () => `${id}-amount`;
  const getCurrencyDropdownId = () => `${id}-currency`;
  const getAmountInputName = () => (name ? `${name}.amount` : undefined);
  const getCurrencyDropdownName = () =>
    name ? `${name}.currencyCode` : undefined;

  // Event handlers - NumberInput will preserve decimal precision with new settings
  const handleAmountChange = useCallback(
    (newValue: number) => {
      const stringValue = newValue.toString();
      const event: TCustomEvent = {
        target: {
          id: getAmountInputId(),
          name: getAmountInputName(),
          value: stringValue,
        },
      };
      onChange?.(event);
    },
    [onChange, id, name]
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
      const event: TCustomEvent = {
        target: {
          id: getCurrencyDropdownId(),
          name: getCurrencyDropdownName(),
          value: currencyCode,
        },
      };
      onChange?.(event);
    },
    [onChange, id, name]
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
    hasWarning,
    isDisabled,
    isReadOnly,
    hasFocus,
  };

  return (
    <MoneyInputRootSlot {...recipeProps} {...styleProps} {...stateProps}>
      <MoneyInputContainerSlot>
        {/* Currency Select or Label */}
        <MoneyInputCurrencySelectSlot {...stateProps}>
          {/* // TODO: handle this fallback, it's wrong */}
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
              aria-label="Currency selection"
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

        {/* Amount Input - ARCHITECTURE NOTE: Dual Formatting Systems

            MoneyInput uses TWO SEPARATE currency formatting systems:

            1. NumberInput (THIS component below):
               - Handles live user interaction and display formatting
               - Uses React Aria + Intl.NumberFormat + getCurrencyFormatOptions()
               - Provides real-time locale-aware input validation and formatting
               - Powers the actual input field behavior users see

            2. MoneyInput Static Methods (convertToMoneyValue, parseMoneyValue, etc.):
               - Uses custom parsing system with createMoneyValue() + TMoneyValue objects
               - Maintains exact UI-Kit behavioral compatibility for Merchant Center
               - Only triggered by explicit static method calls, NOT during user typing

            These systems are INDEPENDENT and do NOT interact with each other.
            This design preserves UI-Kit compatibility while leveraging modern React Aria input handling.
        */}
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
            currency={value.currencyCode}
            showCurrencySymbol={false} // Don't show symbol in input, only in currency dropdown
            allowHighPrecision={true} // Enable high precision for all currencies in MoneyInput
            onChange={handleAmountChange}
            onFocus={handleAmountFocus}
            onBlur={handleAmountBlur}
            isDisabled={isDisabled}
            isReadOnly={isReadOnly}
            isInvalid={isInvalid}
            placeholder={placeholder}
            autoFocus={autoFocus}
            size={size}
          />
        </MoneyInputAmountInputSlot>
      </MoneyInputContainerSlot>

      {/* High Precision Badge */}
      {hasHighPrecisionBadge && isCurrentlyHighPrecision && (
        <MoneyInputBadgeSlot data-testid="high-precision-badge">
          <Tooltip.Root>
            <HighPrecision color={isDisabled ? "neutral.6" : "primary.9"} />
            <Tooltip.Content>
              {tooltipContent || "High Precision Price"}
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
  convertToMoneyValue: typeof convertToMoneyValue;
  parseMoneyValue: typeof parseMoneyValue;
  isEmpty: typeof isEmpty;
  isHighPrecision: typeof isHighPrecision;
};

export const MoneyInput = MoneyInputComponent as MoneyInputType;

// ARCHITECTURE NOTE: Static Methods System
//
// These static methods provide UI-Kit compatibility for Merchant Center.
// They use a SEPARATE currency parsing system (createMoneyValue + TMoneyValue objects)
// that is INDEPENDENT from the NumberInput formatting system used for live user interaction.
//
// Static Methods System (this):
// - convertToMoneyValue: TValue → TMoneyValue (for API submission)
// - parseMoneyValue: TMoneyValue → TValue (for form initialization)
// - isEmpty/isHighPrecision: validation utilities
// - Uses createMoneyValue() with custom string parsing logic
//
// NumberInput System (used above in render):
// - Uses React Aria NumberField + Intl.NumberFormat
// - Handles live user typing, locale formatting, validation
// - Powers the actual input field behavior
//
// These systems do NOT communicate - they serve different purposes:
// Static methods = API compatibility, NumberInput = user experience
MoneyInput.convertToMoneyValue = convertToMoneyValue;
MoneyInput.parseMoneyValue = parseMoneyValue;
MoneyInput.isEmpty = isEmpty;
MoneyInput.isHighPrecision = isHighPrecision;
