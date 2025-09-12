// TODO: should we move this to the main top level utils?
import currencies from "../../../utils/currencies";
import type { TCurrencyCode } from "./types";

// ARCHITECTURE NOTE: NumberInput Currency Formatting System
//
// This file provides currency formatting utilities for NumberInput component's
// live user interaction system. This is SEPARATE and INDEPENDENT from
// MoneyInput's static methods system (createMoneyValue + TMoneyValue objects).
//
// NumberInput System (this file):
// - Powers live user typing, validation, and display formatting
// - Uses React Aria NumberField + Intl.NumberFormat
// - Handles real-time locale-aware formatting as users type
//
// MoneyInput Static Methods System (separate):
// - Uses createMoneyValue() with custom TMoneyValue objects
// - Only for API compatibility calls like MoneyInput.convertToMoneyValue()
// - Does NOT interact with this formatting system
//
// Both systems use the same shared currencies.ts data but serve different purposes.

const HIGH_PRECISION_FRACTION_DIGITS = 10;

/**
 * Creates format options for currency-aware number formatting
 * Supports both currency symbol display and decimal-only formatting
 * Handles high precision mode for extended decimal places
 */
export const getCurrencyFormatOptions = (
  currencyCode: TCurrencyCode,
  allowHighPrecision: boolean = false,
  showCurrencySymbol: boolean = true
): Intl.NumberFormatOptions => {
  const currency = currencies[currencyCode];

  // Calculate maximum fraction digits based on precision mode
  const maxFractionDigits = allowHighPrecision
    ? HIGH_PRECISION_FRACTION_DIGITS
    : currency.fractionDigits; // Standard precision: use currency default

  // Base formatting options that apply to both modes
  const baseOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: currency.fractionDigits, // Always respect currency minimum (e.g., 2 for USD, 0 for JPY)
    maximumFractionDigits: maxFractionDigits,
    useGrouping: true, // Keep thousand separators for readability (formatted per locale)
  };

  // Branch formatting based on symbol display requirement
  if (showCurrencySymbol) {
    // Currency style: shows symbol/code with currency-specific formatting
    return {
      ...baseOptions,
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "symbol",
    };
  } else {
    // Decimal style: pure number formatting without currency symbols
    return {
      ...baseOptions,
      style: "decimal", // Use decimal to avoid currency symbol conflicts
    };
  }
};
