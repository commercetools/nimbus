import { useRef, useState, useCallback, useId, useMemo } from "react";
import { mergeRefs } from "@chakra-ui/react";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { useObjectRef } from "react-aria";
import { NumberInput, Select, Tooltip } from "@/components";
import { HighPrecision } from "@commercetools/nimbus-icons";
import { extractStyleProps } from "@/utils/extractStyleProps";
import {
  MoneyInputRootSlot,
  MoneyInputCurrencySelectSlot,
  MoneyInputAmountInputSlot,
  MoneyInputBadgeSlot,
} from "./money-input.slots";
import { moneyInputRecipe } from "./money-input.recipe";
import {
  isHighPrecision,
  convertToMoneyValue,
  parseMoneyValue,
  isEmpty,
  isTouched,
} from "./utils";
import currenciesData from "./utils/currencies";
import type { TValue } from "./utils";

// Custom event type for MoneyInput onChange handler
type TCustomEvent = {
  target: {
    id?: string;
    name?: string;
    value?: string | string[] | null;
  };
  persist?: () => void;
};

export interface MoneyInputProps {
  /**
   * Used as HTML id property. An id is auto-generated when it is not specified.
   */
  id?: string;
  /**
   * The prefix used to create a HTML `name` property for the amount input field (`${name}.amount`) and the currency dropdown (`${name}.currencyCode`).
   */
  name?: string;
  /**
   * Value of the input. Consists of the currency code and an amount. `amount` is a string representing the amount. A dot has to be used as the decimal separator.
   */
  value: TValue;
  /**
   * List of possible currencies. When not provided or empty, the component renders a label with the value's currency instead of a dropdown.
   */
  currencies?: string[];
  /**
   * Called when input is blurred
   */
  onBlur?: (event: TCustomEvent) => void;
  /**
   * Called when input is focused
   */
  onFocus?: (event: TCustomEvent) => void;
  /**
   * Called with the event of the input or dropdown when either the currency or the amount have changed.
   */
  onChange?: (event: TCustomEvent) => void;
  /**
   * Use this property to reduce the paddings of the component for a ui compact variant
   */
  isCondensed?: boolean;
  /**
   * Indicates that the input cannot be modified (e.g not authorized, or changes currently saving).
   */
  isDisabled?: boolean;
  /**
   * Indicates that the field is displaying read-only content
   */
  isReadOnly?: boolean;
  /**
   * Indicates that input has errors
   */
  hasError?: boolean;
  /**
   * Control to indicate on the input if there are selected values that are potentially invalid
   */
  hasWarning?: boolean;
  /**
   * Shows high precision badge in case current value uses high precision.
   */
  hasHighPrecisionBadge?: boolean;
  /**
   * Indicates that the currency input cannot be modified.
   */
  isCurrencyInputDisabled?: boolean;
  /**
   * Placeholder text for the amount input
   */
  placeholder?: string;
  /**
   * Focus the input on initial render
   */
  autoFocus?: boolean;
  /**
   * Override the default tooltip content for high precision badge
   *
   * // TODO: this might not be necessary
   */
  tooltipContent?: string;
}

/**
 * # MoneyInput
 *
 * A specialized input component for entering monetary amounts with currency selection.
 * Supports high precision values and automatic locale-based formatting.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/inputs/money-input}
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
    isCondensed,
    isDisabled,
    isReadOnly,
    hasError,
    hasWarning,
    hasHighPrecisionBadge = true,
    isCurrencyInputDisabled,
    placeholder = "0.00",
    autoFocus,
    tooltipContent,
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
  const [recipeProps] = recipe.splitVariantProps(restProps);
  const [styleProps] = extractStyleProps(restProps);

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
      const event: TCustomEvent = {
        persist: () => {},
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
      persist: () => {},
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
      persist: () => {},
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
        persist: () => {},
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
      persist: () => {},
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
      persist: () => {},
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
    hasError,
    hasWarning,
    isDisabled,
    isReadOnly,
    isCondensed,
    hasFocus,
  };

  return (
    <MoneyInputRootSlot {...recipeProps} {...styleProps} {...stateProps}>
      {/* Currency Select or Label */}
      <MoneyInputCurrencySelectSlot {...stateProps}>
        {hasNoCurrencies ? (
          <label htmlFor={getAmountInputId()} data-testid="currency-label">
            {value.currencyCode}
          </label>
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

      {/* Amount Input - Now using enhanced NumberInput with currency support */}
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
          placeholder={placeholder}
          autoFocus={autoFocus}
        />
      </MoneyInputAmountInputSlot>

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
  isTouched: typeof isTouched;
  // Backwards compatibility helper methods
  getAmountInputId: (id: string) => string;
  getCurrencyDropdownId: (id: string) => string;
};

export const MoneyInput = MoneyInputComponent as MoneyInputType;

// TODO: evaluate whether we need these, and whether they're used in the merchant center
// Attach static methods
MoneyInput.convertToMoneyValue = convertToMoneyValue;
MoneyInput.parseMoneyValue = parseMoneyValue;
MoneyInput.isEmpty = isEmpty;
MoneyInput.isHighPrecision = isHighPrecision;
MoneyInput.isTouched = isTouched;

// Backwards compatibility helpers
MoneyInput.getAmountInputId = (id: string) => `${id}-amount`;
MoneyInput.getCurrencyDropdownId = (id: string) => `${id}-currency`;
