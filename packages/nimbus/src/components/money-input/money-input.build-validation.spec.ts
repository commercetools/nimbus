/**
 * Build Validation Tests for MoneyInput
 *
 * These tests import from the built package (@commercetools/nimbus) to validate:
 * 1. Component exports are correct
 * 2. Type exports are accessible
 * 3. Built package structure matches expectations
 *
 * IMPORTANT: These tests run AFTER build and validate the dist/ output.
 * They will catch issues like missing type exports that caused the 2.0.0 release failure.
 *
 * To run: pnpm test:build-validation
 */

import { describe, it, expect } from "vitest";

// Import from built package (not source files)
import { MoneyInput } from "@commercetools/nimbus";

// Import types from built package
import type {
  MoneyInputProps,
  TValue,
  TCurrencyCode,
  // comment this out to pass CI, just to illustrate the issue
  ThisTypeWillFailAsItDoesntExistInTheBuiltPackage,
} from "@commercetools/nimbus";

describe("MoneyInput Build Validation", () => {
  describe("Component Exports", () => {
    it("exports MoneyInput component", () => {
      expect(MoneyInput).toBeDefined();
      expect(typeof MoneyInput).toBe("function");
    });

    it("has displayName", () => {
      expect(MoneyInput.displayName).toBe("MoneyInput");
    });

    it("exports static methods", () => {
      expect(typeof MoneyInput.getAmountInputId).toBe("function");
      expect(typeof MoneyInput.getCurrencyDropdownId).toBe("function");
      expect(typeof MoneyInput.convertToMoneyValue).toBe("function");
      expect(typeof MoneyInput.parseMoneyValue).toBe("function");
      expect(typeof MoneyInput.isEmpty).toBe("function");
      expect(typeof MoneyInput.isHighPrecision).toBe("function");
    });
  });

  describe("Type Exports", () => {
    it("MoneyInputProps type is accessible", () => {
      // TypeScript compilation will fail if type export is broken
      const props: MoneyInputProps = {
        value: { amount: "10", currencyCode: "USD" },
        currencies: ["USD", "EUR"],
      };

      expect(props.value.amount).toBe("10");
      expect(props.value.currencyCode).toBe("USD");
    });

    it("TValue type is accessible", () => {
      // TypeScript compilation will fail if type export is broken
      const value: TValue = {
        amount: "100.50",
        currencyCode: "EUR",
      };

      expect(value.amount).toBe("100.50");
      expect(value.currencyCode).toBe("EUR");
    });

    it("TCurrencyCode type is accessible", () => {
      // TypeScript compilation will fail if type export is broken
      const currency: TCurrencyCode = "USD";

      expect(currency).toBe("USD");
    });
  });
});
