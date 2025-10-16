/**
 * Unit tests for MoneyInput static methods
 *
 * Tests static utility methods that don't require DOM rendering.
 * These tests are migrated from money-input.stories.tsx StaticMethodsCompliance story.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { MoneyInput } from "./money-input";
import type { TCurrencyCode } from "./money-input.types";

describe("MoneyInput Static Methods", () => {
  // Helper to capture console warnings
  let originalWarn: typeof console.warn;
  let capturedWarnings: unknown[][];

  beforeEach(() => {
    originalWarn = console.warn;
    capturedWarnings = [];
    console.warn = (...args: unknown[]) => {
      capturedWarnings.push(args);
      originalWarn.apply(console, args);
    };
  });

  afterEach(() => {
    console.warn = originalWarn;
  });

  describe("convertToMoneyValue", () => {
    describe("Invalid inputs", () => {
      it("Returns null for empty currency code", () => {
        expect(
          MoneyInput.convertToMoneyValue(
            { amount: "1", currencyCode: "" },
            "en"
          )
        ).toBe(null);
      });

      it("Returns null for invalid currency code", () => {
        expect(
          MoneyInput.convertToMoneyValue(
            { amount: "1", currencyCode: "FOO" as TCurrencyCode },
            "en"
          )
        ).toBe(null);
      });

      it("Returns null for empty amount", () => {
        expect(
          MoneyInput.convertToMoneyValue(
            { amount: "", currencyCode: "EUR" },
            "en"
          )
        ).toBe(null);
      });

      it("Returns null for whitespace-only amount", () => {
        expect(
          MoneyInput.convertToMoneyValue(
            { amount: "   ", currencyCode: "EUR" },
            "en"
          )
        ).toBe(null);
      });

      it("Returns null for invalid amount string", () => {
        expect(
          MoneyInput.convertToMoneyValue(
            { amount: "invalid", currencyCode: "EUR" },
            "en"
          )
        ).toBe(null);
      });
    });

    describe("Cent precision conversion", () => {
      it("Converts EUR amount to cent precision", () => {
        const result = MoneyInput.convertToMoneyValue(
          { amount: "1.2", currencyCode: "EUR" },
          "en"
        );

        expect(result?.type).toBe("centPrecision");
        expect(result?.centAmount).toBe(120);
        expect(result?.fractionDigits).toBe(2);
      });

      it("Handles rounding for cent precision (2399.99)", () => {
        const result = MoneyInput.convertToMoneyValue(
          { amount: "2399.99", currencyCode: "USD" },
          "en"
        );

        expect(result?.type).toBe("centPrecision");
        expect(result?.centAmount).toBe(239999);
      });
    });

    describe("High precision conversion", () => {
      it("Converts EUR amount to high precision when exceeding 2 decimals", () => {
        const result = MoneyInput.convertToMoneyValue(
          { amount: "1.234", currencyCode: "EUR" },
          "en"
        );

        expect(result?.type).toBe("highPrecision");
        expect(result?.preciseAmount).toBe(1234);
        expect(result?.fractionDigits).toBe(3);
      });

      it("Handles complex high precision value (8.066652)", () => {
        const result = MoneyInput.convertToMoneyValue(
          { amount: "8.066652", currencyCode: "EUR" },
          "en"
        );

        expect(result?.type).toBe("highPrecision");
        expect(result?.preciseAmount).toBe(8066652);
        expect(result?.fractionDigits).toBe(6);
      });

      it("Converts KWD high precision (4 decimals > 3 standard)", () => {
        const result = MoneyInput.convertToMoneyValue(
          { amount: "1.2345", currencyCode: "KWD" },
          "en"
        );

        expect(result?.type).toBe("highPrecision");
        expect(result?.preciseAmount).toBe(12345);
        expect(result?.fractionDigits).toBe(4);
      });
    });

    describe("Special currency handling", () => {
      it("Handles JPY (0 fraction digits)", () => {
        const result = MoneyInput.convertToMoneyValue(
          { amount: "100", currencyCode: "JPY" },
          ""
        );

        expect(result?.type).toBe("centPrecision");
        expect(result?.centAmount).toBe(100);
        expect(result?.fractionDigits).toBe(0);
      });

      it("Warns when locale is not provided", () => {
        capturedWarnings = [];

        MoneyInput.convertToMoneyValue(
          { amount: "100", currencyCode: "JPY" },
          ""
        );

        expect(
          capturedWarnings.some((warning) =>
            warning.some(
              (arg: unknown) =>
                typeof arg === "string" &&
                arg.includes("locale must be provided")
            )
          )
        ).toBe(true);
      });
    });
  });

  describe("parseMoneyValue", () => {
    describe("Null and undefined handling", () => {
      it("Returns empty value for null input", () => {
        expect(MoneyInput.parseMoneyValue(null as never, "en")).toEqual({
          currencyCode: "",
          amount: "",
        });
      });
    });

    describe("Cent precision parsing", () => {
      it("Parses cent precision EUR value", () => {
        const result = MoneyInput.parseMoneyValue(
          {
            type: "centPrecision",
            centAmount: 1234,
            currencyCode: "EUR",
            fractionDigits: 2,
          },
          "en"
        );

        expect(result.amount).toBe("12.34");
        expect(result.currencyCode).toBe("EUR");
      });
    });

    describe("High precision parsing", () => {
      it("Parses high precision EUR value", () => {
        const result = MoneyInput.parseMoneyValue(
          {
            type: "highPrecision",
            currencyCode: "EUR",
            centAmount: 1234,
            fractionDigits: 5,
            preciseAmount: 1234527,
          },
          "en"
        );

        expect(result.amount).toBe("12.34527");
        expect(result.currencyCode).toBe("EUR");
      });
    });

    describe("Locale-specific formatting", () => {
      it("Formats with Swiss locale (de-CH)", () => {
        const result = MoneyInput.parseMoneyValue(
          {
            type: "highPrecision",
            currencyCode: "EUR",
            centAmount: 1234,
            fractionDigits: 3,
            preciseAmount: 1234567,
          },
          "de-CH"
        );

        // Swiss locale uses separator for thousands
        expect(result.amount).toMatch(/^1.234\.567$/);
      });

      it("Formats with Spanish locale (es)", () => {
        const result = MoneyInput.parseMoneyValue(
          {
            type: "highPrecision",
            currencyCode: "EUR",
            centAmount: 1234,
            fractionDigits: 3,
            preciseAmount: 1234567,
          },
          "es"
        );

        // Spanish uses comma for decimals
        expect(result.amount).toContain(",");
      });
    });

    describe("Error cases", () => {
      it("Throws error when currencyCode is missing", () => {
        capturedWarnings = [];
        let threwError = false;

        try {
          MoneyInput.parseMoneyValue({ centAmount: 10 } as never, "en");
        } catch (error: unknown) {
          threwError = true;
          expect((error as Error).message).toContain("currencyCode");
        }

        expect(threwError).toBe(true);
        expect(
          capturedWarnings.some((warning) =>
            warning.some(
              (arg: unknown) =>
                typeof arg === "string" && arg.includes("currencyCode")
            )
          )
        ).toBe(true);
      });

      it("Throws error for invalid currency code", () => {
        capturedWarnings = [];
        let threwError = false;

        try {
          MoneyInput.parseMoneyValue(
            {
              currencyCode: "INVALID" as TCurrencyCode,
              centAmount: 100,
              fractionDigits: 2,
              type: "centPrecision",
            },
            "en"
          );
        } catch (error: unknown) {
          threwError = true;
          expect((error as Error).message).toContain("known currency code");
        }

        expect(threwError).toBe(true);
      });

      it("Warns when locale is not provided", () => {
        capturedWarnings = [];

        try {
          MoneyInput.parseMoneyValue(
            {
              type: "centPrecision",
              centAmount: 100,
              currencyCode: "USD",
              fractionDigits: 2,
            },
            ""
          );
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          // Expected due to invalid language tag
        }

        expect(
          capturedWarnings.some((warning) =>
            warning.some(
              (arg: unknown) =>
                typeof arg === "string" && arg.includes("locale must be passed")
            )
          )
        ).toBe(true);
      });

      it("Warns when amount is missing", () => {
        capturedWarnings = [];

        MoneyInput.parseMoneyValue(
          {
            type: "centPrecision",
            currencyCode: "USD",
            fractionDigits: 2,
          } as never,
          "en"
        );

        expect(
          capturedWarnings.some((warning) =>
            warning.some(
              (arg: unknown) =>
                typeof arg === "string" && arg.includes("amount")
            )
          )
        ).toBe(true);
      });
    });
  });

  describe("isEmpty", () => {
    it("Returns false when both amount and currency are provided", () => {
      expect(MoneyInput.isEmpty({ amount: "5", currencyCode: "EUR" })).toBe(
        false
      );
    });

    it("Returns true when amount is empty", () => {
      expect(MoneyInput.isEmpty({ amount: "", currencyCode: "EUR" })).toBe(
        true
      );
    });

    it("Returns true when currencyCode is empty", () => {
      expect(MoneyInput.isEmpty({ amount: "5", currencyCode: "" })).toBe(true);
    });

    it("Returns true when amount is whitespace only", () => {
      expect(MoneyInput.isEmpty({ amount: "   ", currencyCode: "EUR" })).toBe(
        true
      );
    });

    it("Returns true when both are populated but currency is empty", () => {
      expect(MoneyInput.isEmpty({ amount: "EUR", currencyCode: "" })).toBe(
        true
      );
    });

    it("Returns true for null input", () => {
      expect(MoneyInput.isEmpty(null as never)).toBe(true);
    });

    it("Returns true for undefined input", () => {
      expect(MoneyInput.isEmpty(undefined as never)).toBe(true);
    });
  });

  describe("isHighPrecision", () => {
    describe("EUR (2 fraction digits standard)", () => {
      it("Returns true for 3+ decimal places", () => {
        expect(
          MoneyInput.isHighPrecision(
            { amount: "2.001", currencyCode: "EUR" },
            "en"
          )
        ).toBe(true);
      });

      it("Returns false for 2 decimal places", () => {
        expect(
          MoneyInput.isHighPrecision(
            { amount: "2.00", currencyCode: "EUR" },
            "en"
          )
        ).toBe(false);
      });
    });

    describe("JPY (0 fraction digits standard)", () => {
      it("Returns true when JPY has decimal places", () => {
        expect(
          MoneyInput.isHighPrecision(
            { amount: "100.5", currencyCode: "JPY" },
            "en"
          )
        ).toBe(true);
      });

      it("Returns false when JPY has no decimal places", () => {
        expect(
          MoneyInput.isHighPrecision(
            { amount: "100", currencyCode: "JPY" },
            "en"
          )
        ).toBe(false);
      });
    });

    describe("KWD (3 fraction digits standard)", () => {
      it("Returns true for 4+ decimal places", () => {
        expect(
          MoneyInput.isHighPrecision(
            { amount: "1.2345", currencyCode: "KWD" },
            "en"
          )
        ).toBe(true);
      });

      it("Returns false for 3 decimal places", () => {
        expect(
          MoneyInput.isHighPrecision(
            { amount: "1.234", currencyCode: "KWD" },
            "en"
          )
        ).toBe(false);
      });
    });

    describe("Edge cases", () => {
      it("Returns false for empty values", () => {
        const result = MoneyInput.isHighPrecision(
          { amount: "", currencyCode: "EUR" },
          "en"
        );

        expect(result).toBe(false);
      });
    });
  });

  describe("getAmountInputId", () => {
    it("Returns id with .amount suffix when id is provided", () => {
      expect(MoneyInput.getAmountInputId("id")).toBe("id.amount");
    });

    it("Returns undefined when id is not provided", () => {
      expect(MoneyInput.getAmountInputId(undefined)).toBe(undefined);
    });
  });

  describe("getCurrencyDropdownId", () => {
    it("Returns id with .currencyCode suffix when id is provided", () => {
      expect(MoneyInput.getCurrencyDropdownId("id")).toBe("id.currencyCode");
    });

    it("Returns undefined when id is not provided", () => {
      expect(MoneyInput.getCurrencyDropdownId(undefined)).toBe(undefined);
    });
  });
});
