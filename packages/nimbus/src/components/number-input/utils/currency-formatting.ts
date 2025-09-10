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

/**
 * Creates format options for React Aria NumberField based on currency
 * Uses provided locale for consistent formatting across all currencies
 */
export const getCurrencyFormatOptions = (
  currencyCode: TCurrencyCode | "",
  allowHighPrecision: boolean = false
): Intl.NumberFormatOptions => {
  if (!currencyCode) {
    return {};
  }

  const currency = currencies[currencyCode];
  if (!currency) {
    return {};
  }

  // For high precision mode, we need to allow more decimal places
  // even for currencies that normally don't use them (like JPY)
  const maxFractionDigits = allowHighPrecision
    ? Math.max(currency.fractionDigits, 10)
    : currency.fractionDigits;

  // Always use consistent formatting regardless of currency
  // The locale parameter determines the formatting style, not the currency
  return {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: currency.fractionDigits,
    maximumFractionDigits: maxFractionDigits,
    currencyDisplay: "symbol",
  };
};

/**
 * Creates format options specifically for high-precision input (no currency symbol)
 * This allows more decimal places than the currency's standard fraction digits
 * Uses consistent formatting regardless of currency
 * Examples: USD (2) → allows 12.345+, JPY (0) → allows 1234.45+
 */
export const getHighPrecisionFormatOptions = (
  currencyCode: TCurrencyCode | ""
): Intl.NumberFormatOptions => {
  if (!currencyCode) {
    return {
      minimumFractionDigits: 0,
      maximumFractionDigits: 10,
      useGrouping: true,
    };
  }

  const currency = currencies[currencyCode];

  if (!currency) {
    return {
      minimumFractionDigits: 0,
      maximumFractionDigits: 10,
      useGrouping: true,
    };
  }

  // Always use decimal formatting with consistent thousand/decimal separators
  // The locale parameter determines the formatting style for all currencies
  return {
    style: "decimal", // Use decimal instead of currency to avoid symbol conflicts
    minimumFractionDigits: 0, // Allow whole numbers (like 1234 for JPY)
    maximumFractionDigits: Math.max(currency.fractionDigits + 6, 10), // Allow 6+ more decimals than standard
    useGrouping: true, // Keep thousand separators for readability (formatted per locale)
  };
};

/**
 * Gets the step value for a currency (e.g., 0.01 for USD, 1 for JPY)
 * In high precision mode, uses a much smaller step to allow more decimal places
 */
export const getCurrencyStep = (
  currencyCode: TCurrencyCode | "",
  allowHighPrecision: boolean = false
): number => {
  if (!currencyCode) return 0.01;

  const currency = currencies[currencyCode];
  if (!currency) return 0.01;

  // In high precision mode, use a very small step to allow many decimal places
  // This enables USD: 12.345+ (beyond 2 decimals) and JPY: 1234.45+ (beyond 0 decimals)
  if (allowHighPrecision) {
    return 0.0001; // Allows up to 4+ decimal places for any currency
  }

  // Standard mode: respect the currency's fraction digits
  return 1 / Math.pow(10, currency.fractionDigits);
};
