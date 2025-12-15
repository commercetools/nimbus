import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MoneyInput, NimbusProvider } from "@commercetools/nimbus";
import type { MoneyInputValue } from "./money-input.types";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the component renders with expected elements
 * @docs-order 1
 */
describe("MoneyInput - Basic rendering", () => {
  it("renders with initial value", () => {
    const value: MoneyInputValue = { amount: "100.00", currencyCode: "USD" };
    render(
      <NimbusProvider>
        <MoneyInput
          value={value}
          currencies={["USD", "EUR"]}
          aria-label="Price"
        />
      </NimbusProvider>
    );

    // NumberInput displays formatted numeric values
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("100.00");

    // Currency button should be visible
    expect(
      screen.getByRole("button", { name: /USD.*Currency/i })
    ).toBeInTheDocument();
  });

  it("renders with multiple currencies in dropdown", () => {
    const value: MoneyInputValue = { amount: "50.00", currencyCode: "EUR" };
    render(
      <NimbusProvider>
        <MoneyInput
          value={value}
          currencies={["USD", "EUR", "GBP"]}
          aria-label="Price"
        />
      </NimbusProvider>
    );

    // Currency button should be visible
    expect(
      screen.getByRole("button", { name: /EUR.*Currency/i })
    ).toBeInTheDocument();

    // Amount input should be present
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("renders static currency label when no currencies provided", () => {
    const value: MoneyInputValue = { amount: "100.00", currencyCode: "USD" };
    render(
      <NimbusProvider>
        <MoneyInput value={value} currencies={[]} aria-label="Price" />
      </NimbusProvider>
    );

    // Should show static label text
    expect(screen.getByText("USD")).toBeInTheDocument();

    // No currency button should exist
    expect(
      screen.queryByRole("button", { name: /Currency/i })
    ).not.toBeInTheDocument();

    // Amount input should be present
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test user interactions with amount input and currency selector
 * @docs-order 2
 */
describe("MoneyInput - Interactions", () => {
  it("updates amount when user types", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const value: MoneyInputValue = { amount: "", currencyCode: "USD" };

    render(
      <NimbusProvider>
        <MoneyInput
          value={value}
          currencies={["USD"]}
          onValueChange={handleChange}
          aria-label="Price"
        />
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "50.00");
    await user.tab(); // Blur the input to trigger final change

    // onValueChange should be called with updated amount
    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: expect.stringContaining("50"),
        currencyCode: "USD",
      })
    );
  });

  it("updates currency when user selects from dropdown", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const value: MoneyInputValue = { amount: "100", currencyCode: "USD" };

    render(
      <NimbusProvider>
        <MoneyInput
          value={value}
          currencies={["USD", "EUR", "GBP"]}
          onValueChange={handleChange}
          aria-label="Price"
        />
      </NimbusProvider>
    );

    // Click on the currency button to open dropdown
    const trigger = screen.getByRole("button", { name: /USD.*Currency/i });
    await user.click(trigger);

    // Wait for dropdown to appear and select EUR
    await waitFor(() => {
      const listbox = within(document.body).getByRole("listbox");
      expect(listbox).toBeInTheDocument();
    });

    const eurOption = within(document.body).getByRole("option", {
      name: "EUR",
    });
    await user.click(eurOption);

    // Verify currency change handler was called
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: "100",
        currencyCode: "EUR",
      })
    );
  });

  it("calls onAmountChange when amount changes", async () => {
    const user = userEvent.setup();
    const handleAmountChange = vi.fn();
    const value: MoneyInputValue = { amount: "", currencyCode: "USD" };

    render(
      <NimbusProvider>
        <MoneyInput
          value={value}
          currencies={["USD"]}
          onAmountChange={handleAmountChange}
          aria-label="Price"
        />
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "123");
    await user.tab(); // Blur the input to trigger change

    expect(handleAmountChange).toHaveBeenCalled();
  });

  it("calls onCurrencyChange when currency changes", async () => {
    const user = userEvent.setup();
    const handleCurrencyChange = vi.fn();
    const value: MoneyInputValue = { amount: "100", currencyCode: "USD" };

    render(
      <NimbusProvider>
        <MoneyInput
          value={value}
          currencies={["USD", "EUR"]}
          onCurrencyChange={handleCurrencyChange}
          aria-label="Price"
        />
      </NimbusProvider>
    );

    // Open dropdown and select EUR
    await user.click(screen.getByRole("button", { name: /USD.*Currency/i }));

    await waitFor(() => {
      const listbox = within(document.body).getByRole("listbox");
      expect(listbox).toBeInTheDocument();
    });

    const eurOption = within(document.body).getByRole("option", {
      name: "EUR",
    });
    await user.click(eurOption);

    expect(handleCurrencyChange).toHaveBeenCalledWith("EUR");
  });
});

/**
 * @docs-section high-precision
 * @docs-title Testing High Precision Support
 * @docs-description Test high precision badge display and behavior
 * @docs-order 3
 */
describe("MoneyInput - High precision", () => {
  it("shows high precision badge for values exceeding standard precision", () => {
    // USD typically has 2 decimal places, 4 decimals is high precision
    const value: MoneyInputValue = {
      amount: "100.1234",
      currencyCode: "USD",
    };

    render(
      <NimbusProvider>
        <MoneyInput
          value={value}
          currencies={["USD"]}
          hasHighPrecisionBadge={true}
          aria-label="Price"
        />
      </NimbusProvider>
    );

    const badge = screen.getByLabelText(/High precision/i);
    expect(badge).toBeInTheDocument();
  });

  it("does not show badge for standard precision", () => {
    // USD with standard 2 decimal places
    const value: MoneyInputValue = { amount: "100.12", currencyCode: "USD" };

    render(
      <NimbusProvider>
        <MoneyInput
          value={value}
          currencies={["USD"]}
          hasHighPrecisionBadge={true}
          aria-label="Price"
        />
      </NimbusProvider>
    );

    const badge = screen.queryByLabelText(/High precision/i);
    expect(badge).not.toBeInTheDocument();
  });

  it("hides badge when hasHighPrecisionBadge is false", () => {
    const value: MoneyInputValue = {
      amount: "100.1234",
      currencyCode: "USD",
    };

    render(
      <NimbusProvider>
        <MoneyInput
          value={value}
          currencies={["USD"]}
          hasHighPrecisionBadge={false}
          aria-label="Price"
        />
      </NimbusProvider>
    );

    const badge = screen.queryByLabelText(/High precision/i);
    expect(badge).not.toBeInTheDocument();
  });
});

/**
 * @docs-section validation-states
 * @docs-title Testing Validation States
 * @docs-description Test disabled, read-only, invalid, and required states
 * @docs-order 4
 */
describe("MoneyInput - Validation states", () => {
  it("renders disabled state", () => {
    const value: MoneyInputValue = { amount: "100", currencyCode: "USD" };

    render(
      <NimbusProvider>
        <MoneyInput
          value={value}
          currencies={["USD", "EUR"]}
          isDisabled
          aria-label="Price"
        />
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();

    // Currency button should also be disabled
    const currencyButton = screen.getByRole("button", {
      name: /USD.*Currency/i,
    });
    expect(currencyButton).toBeDisabled();
  });

  it("renders read-only state", () => {
    const value: MoneyInputValue = { amount: "100", currencyCode: "USD" };

    render(
      <NimbusProvider>
        <MoneyInput
          value={value}
          currencies={["USD", "EUR"]}
          isReadOnly
          aria-label="Price"
        />
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("readonly");
  });

  it("renders invalid state", () => {
    const value: MoneyInputValue = { amount: "invalid", currencyCode: "USD" };

    render(
      <NimbusProvider>
        <MoneyInput
          value={value}
          currencies={["USD"]}
          isInvalid
          aria-label="Price"
        />
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("renders required state", () => {
    const value: MoneyInputValue = { amount: "", currencyCode: "USD" };

    render(
      <NimbusProvider>
        <MoneyInput
          value={value}
          currencies={["USD"]}
          isRequired
          aria-label="Price"
        />
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-required", "true");
  });

  it("disables only currency selector with isCurrencyInputDisabled", () => {
    const value: MoneyInputValue = { amount: "100", currencyCode: "USD" };

    render(
      <NimbusProvider>
        <MoneyInput
          value={value}
          currencies={["USD", "EUR"]}
          isCurrencyInputDisabled
          aria-label="Price"
        />
      </NimbusProvider>
    );

    // Amount input should be enabled
    const input = screen.getByRole("textbox");
    expect(input).not.toBeDisabled();

    // Currency button should be disabled
    const currencyButton = screen.getByRole("button", {
      name: /USD.*Currency/i,
    });
    expect(currencyButton).toBeDisabled();
  });
});

/**
 * @docs-section currency-configuration
 * @docs-title Testing Currency Configuration
 * @docs-description Test different currency list configurations
 * @docs-order 5
 */
describe("MoneyInput - Currency configuration", () => {
  it("renders dropdown when multiple currencies provided", () => {
    const value: MoneyInputValue = { amount: "100", currencyCode: "USD" };

    render(
      <NimbusProvider>
        <MoneyInput
          value={value}
          currencies={["USD", "EUR", "GBP"]}
          aria-label="Price"
        />
      </NimbusProvider>
    );

    // Verify currency button is displayed
    expect(
      screen.getByRole("button", { name: /USD.*Currency/i })
    ).toBeInTheDocument();
  });

  it("renders static label when empty currencies array", () => {
    const value: MoneyInputValue = { amount: "100", currencyCode: "EUR" };

    render(
      <NimbusProvider>
        <MoneyInput value={value} currencies={[]} aria-label="Price" />
      </NimbusProvider>
    );

    // Static label present
    expect(screen.getByText("EUR")).toBeInTheDocument();
  });

  it("renders static label when currencies prop omitted", () => {
    const value: MoneyInputValue = { amount: "100", currencyCode: "JPY" };

    render(
      <NimbusProvider>
        <MoneyInput value={value} aria-label="Price" />
      </NimbusProvider>
    );

    expect(screen.getByText("JPY")).toBeInTheDocument();
  });
});
