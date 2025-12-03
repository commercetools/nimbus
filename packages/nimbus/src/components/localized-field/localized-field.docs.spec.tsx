import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  LocalizedField,
  NimbusProvider,
  type LocalizedString,
  type LocalizedCurrency,
} from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the LocalizedField renders with expected structure and locale fields
 * @docs-order 1
 */
describe("LocalizedField - Basic rendering", () => {
  it("renders with default locale visible", () => {
    const values: LocalizedString = {
      en: "Hello",
      de: "Hallo",
      es: "Hola",
    };

    render(
      <NimbusProvider>
        <LocalizedField
          type="text"
          label="Product Name"
          defaultLocaleOrCurrency="en"
          valuesByLocaleOrCurrency={values}
          onChange={vi.fn()}
        />
      </NimbusProvider>
    );

    // Verify group label
    expect(screen.getByText("Product Name")).toBeInTheDocument();

    // Verify default locale input is visible
    expect(screen.getByDisplayValue("Hello")).toBeInTheDocument();

    // Verify expand button exists
    expect(
      screen.getByRole("button", { name: /language/i })
    ).toBeInTheDocument();
  });

  it("renders all locales when displayAllLocalesOrCurrencies is true", () => {
    const values: LocalizedString = {
      en: "Hello",
      de: "Hallo",
      es: "Hola",
    };

    render(
      <NimbusProvider>
        <LocalizedField
          type="text"
          label="Product Name"
          defaultLocaleOrCurrency="en"
          displayAllLocalesOrCurrencies={true}
          valuesByLocaleOrCurrency={values}
          onChange={vi.fn()}
        />
      </NimbusProvider>
    );

    // All locale values should be visible
    expect(screen.getByDisplayValue("Hello")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Hallo")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Hola")).toBeInTheDocument();
  });

  it("renders money type with currency inputs", () => {
    const prices: LocalizedCurrency = {
      USD: { amount: "99.99", currencyCode: "USD" },
      EUR: { amount: "89.99", currencyCode: "EUR" },
    };

    render(
      <NimbusProvider>
        <LocalizedField
          type="money"
          label="Product Price"
          defaultLocaleOrCurrency="USD"
          displayAllLocalesOrCurrencies={true}
          valuesByLocaleOrCurrency={prices}
          onChange={vi.fn()}
        />
      </NimbusProvider>
    );

    // Verify currency labels (there will be multiple matches due to MoneyInput internal structure)
    expect(screen.getAllByText("USD").length).toBeGreaterThan(0);
    expect(screen.getAllByText("EUR").length).toBeGreaterThan(0);
  });
});

/**
 * @docs-section expand-collapse
 * @docs-title Expand/Collapse Interactions
 * @docs-description Test the expand/collapse functionality for viewing all locale fields
 * @docs-order 2
 */
describe("LocalizedField - Expand/collapse", () => {
  it("expands to show all locales when toggle button is clicked", async () => {
    const user = userEvent.setup();
    const values: LocalizedString = {
      en: "Hello",
      de: "Hallo",
      es: "Hola",
    };

    render(
      <NimbusProvider>
        <LocalizedField
          type="text"
          label="Product Name"
          defaultLocaleOrCurrency="en"
          valuesByLocaleOrCurrency={values}
          onChange={vi.fn()}
        />
      </NimbusProvider>
    );

    // Initially only default locale visible
    expect(screen.getByDisplayValue("Hello")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("Hallo")).not.toBeInTheDocument();

    // Click expand button
    const expandButton = screen.getByRole("button", { name: /language/i });
    await user.click(expandButton);

    // All locales should now be visible
    expect(screen.getByDisplayValue("Hello")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Hallo")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Hola")).toBeInTheDocument();
  });

  it("starts expanded when defaultExpanded is true", () => {
    const values: LocalizedString = {
      en: "Hello",
      de: "Hallo",
    };

    render(
      <NimbusProvider>
        <LocalizedField
          type="text"
          label="Product Name"
          defaultLocaleOrCurrency="en"
          defaultExpanded={true}
          valuesByLocaleOrCurrency={values}
          onChange={vi.fn()}
        />
      </NimbusProvider>
    );

    // All locales visible on mount
    expect(screen.getByDisplayValue("Hello")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Hallo")).toBeInTheDocument();
  });
});

/**
 * @docs-section value-updates
 * @docs-title Value Updates
 * @docs-description Test onChange handler with LocalizedFieldChangeEvent
 * @docs-order 3
 */
describe("LocalizedField - Value updates", () => {
  it("calls onChange with locale and value when text input changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const values: LocalizedString = {
      en: "Hello",
      de: "",
    };

    render(
      <NimbusProvider>
        <LocalizedField
          type="text"
          label="Product Name"
          defaultLocaleOrCurrency="en"
          displayAllLocalesOrCurrencies={true}
          valuesByLocaleOrCurrency={values}
          onChange={onChange}
        />
      </NimbusProvider>
    );

    const germanInput = screen.getByLabelText(/de/i);
    await user.type(germanInput, "Hallo");

    // Verify onChange called with correct event structure
    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.target.locale).toBe("de");
    expect(lastCall.target.value).toContain("o"); // Last character typed
  });

  it("renders money input type with currency values", () => {
    const prices: LocalizedCurrency = {
      USD: { amount: "99.99", currencyCode: "USD" },
      EUR: { amount: "89.99", currencyCode: "EUR" },
    };

    render(
      <NimbusProvider>
        <LocalizedField
          type="money"
          label="Product Price"
          defaultLocaleOrCurrency="USD"
          displayAllLocalesOrCurrencies={true}
          valuesByLocaleOrCurrency={prices}
          onChange={vi.fn()}
        />
      </NimbusProvider>
    );

    // Verify money inputs are present
    const inputs = screen.getAllByRole("textbox");
    expect(inputs.length).toBeGreaterThan(0);

    // Verify currency values are displayed
    expect(screen.getByDisplayValue("99.99")).toBeInTheDocument();
    expect(screen.getByDisplayValue("89.99")).toBeInTheDocument();
  });
});

/**
 * @docs-section validation
 * @docs-title Validation and Errors
 * @docs-description Test error display at both group and per-locale levels
 * @docs-order 4
 */
describe("LocalizedField - Validation", () => {
  it("displays group-level error message", () => {
    const values: LocalizedString = {
      en: "",
      de: "",
    };

    render(
      <NimbusProvider>
        <LocalizedField
          type="text"
          label="Product Name"
          defaultLocaleOrCurrency="en"
          valuesByLocaleOrCurrency={values}
          error="At least one translation is required"
          touched={true}
          onChange={vi.fn()}
        />
      </NimbusProvider>
    );

    expect(
      screen.getByText("At least one translation is required")
    ).toBeInTheDocument();
  });

  it("displays per-locale error messages", () => {
    const values: LocalizedString = {
      en: "ab",
      de: "",
    };

    const errors = {
      en: "Must be at least 3 characters",
      de: "This field is required",
    };

    render(
      <NimbusProvider>
        <LocalizedField
          type="text"
          label="Product Name"
          defaultLocaleOrCurrency="en"
          displayAllLocalesOrCurrencies={true}
          valuesByLocaleOrCurrency={values}
          errorsByLocaleOrCurrency={errors}
          touched={true}
          onChange={vi.fn()}
        />
      </NimbusProvider>
    );

    expect(
      screen.getByText("Must be at least 3 characters")
    ).toBeInTheDocument();
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("marks field as invalid with aria-invalid", () => {
    const values: LocalizedString = {
      en: "",
    };

    render(
      <NimbusProvider>
        <LocalizedField
          type="text"
          label="Product Name"
          defaultLocaleOrCurrency="en"
          valuesByLocaleOrCurrency={values}
          error="Required"
          touched={true}
          onChange={vi.fn()}
        />
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });
});

/**
 * @docs-section states
 * @docs-title Component States
 * @docs-description Test required, disabled, and read-only states
 * @docs-order 5
 */
describe("LocalizedField - States", () => {
  it("displays required indicator", () => {
    const values: LocalizedString = {
      en: "",
    };

    render(
      <NimbusProvider>
        <LocalizedField
          type="text"
          label="Product Name"
          defaultLocaleOrCurrency="en"
          valuesByLocaleOrCurrency={values}
          isRequired={true}
          onChange={vi.fn()}
        />
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-required", "true");
  });

  it("disables all inputs when isDisabled is true", () => {
    const values: LocalizedString = {
      en: "Hello",
      de: "Hallo",
    };

    render(
      <NimbusProvider>
        <LocalizedField
          type="text"
          label="Product Name"
          defaultLocaleOrCurrency="en"
          displayAllLocalesOrCurrencies={true}
          valuesByLocaleOrCurrency={values}
          isDisabled={true}
          onChange={vi.fn()}
        />
      </NimbusProvider>
    );

    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it("makes inputs read-only when isReadOnly is true", () => {
    const values: LocalizedString = {
      en: "Hello",
    };

    render(
      <NimbusProvider>
        <LocalizedField
          type="text"
          label="Product Name"
          defaultLocaleOrCurrency="en"
          valuesByLocaleOrCurrency={values}
          isReadOnly={true}
          onChange={vi.fn()}
        />
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("readonly");
  });
});

/**
 * @docs-section utility-methods
 * @docs-title Utility Methods
 * @docs-description Test static utility methods for field management
 * @docs-order 6
 */
describe("LocalizedField - Utility methods", () => {
  it("getId and getName format field attributes correctly", () => {
    expect(LocalizedField.getId("productName", "en")).toBe("productName.en");
    expect(LocalizedField.getName("productName", "de")).toBe("productName.de");
  });

  it("isTouched returns true when any locale is touched", () => {
    const touched = { en: true, de: false, es: false };
    expect(LocalizedField.isTouched(touched)).toBe(true);

    const allUntouched = { en: false, de: false };
    expect(LocalizedField.isTouched(allUntouched)).toBe(false);
  });

  it("isEmpty returns true when all values are empty", () => {
    const emptyValues = { en: "", de: "", es: "" };
    expect(LocalizedField.isEmpty(emptyValues)).toBe(true);

    const hasValue = { en: "Hello", de: "", es: "" };
    expect(LocalizedField.isEmpty(hasValue)).toBe(false);
  });

  it("createLocalizedString creates object with specified locales", () => {
    const result = LocalizedField.createLocalizedString(["en", "de", "es"], {});
    expect(result).toEqual({ en: "", de: "", es: "" });

    // Merges with existing values
    const withExisting = LocalizedField.createLocalizedString(["en", "de"], {
      en: "Hello",
    });
    expect(withExisting).toEqual({ en: "Hello", de: "" });
  });

  it("omitEmptyTranslations removes empty values", () => {
    const values = { en: "Hello", de: "", es: "Hola", fr: "" };
    const result = LocalizedField.omitEmptyTranslations(values);
    expect(result).toEqual({ en: "Hello", es: "Hola" });
  });
});

/**
 * @docs-section placeholders
 * @docs-title Placeholders and Descriptions
 * @docs-description Test per-locale placeholders and descriptions
 * @docs-order 7
 */
describe("LocalizedField - Placeholders and descriptions", () => {
  it("displays per-locale placeholders", () => {
    const values: LocalizedString = {
      en: "",
      de: "",
    };

    const placeholders: LocalizedString = {
      en: "Enter English name...",
      de: "Deutschen Namen eingeben...",
    };

    render(
      <NimbusProvider>
        <LocalizedField
          type="text"
          label="Product Name"
          defaultLocaleOrCurrency="en"
          displayAllLocalesOrCurrencies={true}
          valuesByLocaleOrCurrency={values}
          placeholdersByLocaleOrCurrency={placeholders}
          onChange={vi.fn()}
        />
      </NimbusProvider>
    );

    expect(
      screen.getByPlaceholderText("Enter English name...")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Deutschen Namen eingeben...")
    ).toBeInTheDocument();
  });

  it("displays per-locale descriptions", () => {
    const values: LocalizedString = {
      en: "",
      de: "",
    };

    const descriptions = {
      en: "English is the primary language",
      de: "German translation",
    };

    render(
      <NimbusProvider>
        <LocalizedField
          type="text"
          label="Product Name"
          defaultLocaleOrCurrency="en"
          displayAllLocalesOrCurrencies={true}
          valuesByLocaleOrCurrency={values}
          descriptionsByLocaleOrCurrency={descriptions}
          onChange={vi.fn()}
        />
      </NimbusProvider>
    );

    expect(
      screen.getByText("English is the primary language")
    ).toBeInTheDocument();
    expect(screen.getByText("German translation")).toBeInTheDocument();
  });
});
