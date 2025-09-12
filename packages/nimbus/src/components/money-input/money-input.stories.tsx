import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { I18nProvider } from "react-aria";
import { Box, Text } from "@/components";
import { MoneyInput } from "./money-input";
import type {
  TValue,
  TCurrencyCode,
  TCustomEvent,
  MoneyInputProps,
} from "./money-input.types";

// Props for the MoneyInputExample wrapper component
interface MoneyInputExampleProps extends Partial<MoneyInputProps> {
  initialValue?: TValue;
  currencies?: string[];
}

const meta: Meta<typeof MoneyInput> = {
  title: "Components/Inputs/MoneyInput",
  component: MoneyInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MoneyInput>;

// Default currencies for examples
const DEFAULT_CURRENCIES = ["EUR", "USD", "GBP", "JPY", "AED", "KWD"];

// Size variants for examples
const inputSize = ["md", "sm"] as const;

// Interactive wrapper component
const MoneyInputExample = ({
  initialValue = { amount: "", currencyCode: "" },
  currencies = DEFAULT_CURRENCIES,
  ...props
}: MoneyInputExampleProps) => {
  const [value, setValue] = useState<TValue>(initialValue);

  const handleChange = (event: TCustomEvent) => {
    if (!event.target.name) return;

    if (event.target.name.endsWith(".amount")) {
      setValue((prev) => ({ ...prev, amount: event.target.value as string }));
    }

    if (event.target.name.endsWith(".currencyCode")) {
      setValue((prev) => ({
        ...prev,
        currencyCode: event.target.value as TCurrencyCode | "",
      }));
    }
  };

  return (
    <div style={{ minHeight: "200px", width: "400px" }}>
      <MoneyInput
        value={value}
        currencies={currencies}
        onChange={handleChange}
        name="money-input"
        placeholder="0.00"
        {...props}
      />

      {/* Debug display */}
      <pre
        style={{
          marginTop: "16px",
          padding: "8px",
          backgroundColor: "#f5f5f5",
          fontSize: "12px",
          borderRadius: "4px",
        }}
      >
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
};

export const BasicExample: Story = {
  render: (args) => <MoneyInputExample {...args} />,
  args: {
    isDisabled: false,
    isReadOnly: false,
    isInvalid: false,
    hasHighPrecisionBadge: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test currency selection
    const currencySelect = canvas.getByTestId("currency-dropdown");
    await userEvent.click(currencySelect);

    // Select EUR
    const eurOption = await canvas.findByText("EUR");
    await userEvent.click(eurOption);

    // Test amount input
    const amountInput = canvas.getByPlaceholderText("0.00");
    await userEvent.type(amountInput, "1234.56");

    // Blur to trigger formatting
    await userEvent.tab();

    // Wait a bit for the formatting to complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Check if value is formatted
    expect(amountInput).toHaveValue("1,234.56");
  },
};

export const Sizes: Story = {
  render: () => (
    <Box display="flex" flexDirection="row" gap={8} alignItems="center">
      {inputSize.map((size) => (
        <Box key={String(size)}>
          <Text mb={1} fontSize="sm" fontWeight="medium">
            Size: {String(size)}
          </Text>
          <MoneyInputExample
            initialValue={{ amount: "123.45", currencyCode: "USD" }}
            size={size}
            currencies={DEFAULT_CURRENCIES}
          />
        </Box>
      ))}
    </Box>
  ),
};

export const WithInitialValue: Story = {
  render: (args) => (
    <MoneyInputExample
      initialValue={{ amount: "99.99", currencyCode: "USD" }}
      {...args}
    />
  ),
  args: {
    hasHighPrecisionBadge: true,
  },
};

export const HighPrecisionExample: Story = {
  render: (args) => (
    <MoneyInputExample
      initialValue={{ amount: "42.12345", currencyCode: "EUR" }}
      {...args}
    />
  ),
  args: {
    hasHighPrecisionBadge: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify that the high precision badge appears for the initial value
    // Initial value "42.12345" EUR should show high precision (5 > 2 decimal places)
    const highPrecisionBadge = canvas.getByTestId("high-precision-badge");
    expect(highPrecisionBadge).toBeInTheDocument();

    // With consistent formatting, all currencies now use the same decimal separator
    // EUR and USD both use periods for decimals, no more German locale issues
  },
};

export const DisabledState: Story = {
  render: (args) => (
    <MoneyInputExample
      initialValue={{ amount: "100.00", currencyCode: "USD" }}
      {...args}
    />
  ),
  args: {
    isDisabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const amountInput = canvas.getByPlaceholderText("0.00");
    const currencySelect = canvas.getByTestId("currency-dropdown");

    expect(amountInput).toBeDisabled();
    // Check that the Select component is disabled (may use different attributes)
    expect(currencySelect).toHaveAttribute("data-disabled", "true");
  },
};

export const ReadOnlyState: Story = {
  render: (args) => (
    <MoneyInputExample
      initialValue={{ amount: "250.75", currencyCode: "GBP" }}
      {...args}
    />
  ),
  args: {
    isReadOnly: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const amountInput = canvas.getByDisplayValue("250.75");
    expect(amountInput).toHaveAttribute("readonly");
  },
};

export const ErrorState: Story = {
  render: (args) => (
    <MoneyInputExample
      initialValue={{ amount: "invalid", currencyCode: "EUR" }}
      {...args}
    />
  ),
  args: {
    isInvalid: true,
  },
};

export const NoCurrenciesList: Story = {
  render: (args) => (
    <MoneyInputExample
      initialValue={{ amount: "100.00", currencyCode: "USD" }}
      currencies={[]}
      {...args}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Should show currency label instead of dropdown
    const currencyLabel = canvas.getByTestId("currency-label");
    expect(currencyLabel).toHaveTextContent("USD");
  },
};

export const DifferentCurrencies: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <MoneyInputExample
        initialValue={{ amount: "1000", currencyCode: "JPY" }}
        currencies={["JPY", "KRW"]}
        {...args}
      />
      <MoneyInputExample
        initialValue={{ amount: "42.123", currencyCode: "KWD" }}
        currencies={["KWD", "BHD", "JOD"]}
        {...args}
      />
    </div>
  ),
  args: {
    hasHighPrecisionBadge: true,
  },
};

export const ConsistentFormattingAcrossCurrencies: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <MoneyInputExample
        initialValue={{ amount: "1234.567", currencyCode: "USD" }}
        currencies={["USD"]}
        {...args}
      />
      <MoneyInputExample
        initialValue={{ amount: "1234.567", currencyCode: "EUR" }}
        currencies={["EUR"]}
        {...args}
      />
      <MoneyInputExample
        initialValue={{ amount: "1234.567", currencyCode: "GBP" }}
        currencies={["GBP"]}
        {...args}
      />
    </div>
  ),
  args: {
    hasHighPrecisionBadge: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // All currencies should show consistent formatting with periods as decimal separators
    // and consistent high precision badge behavior

    // Check that all three high precision badges are present
    const badges = canvas.getAllByTestId("high-precision-badge");
    expect(badges).toHaveLength(3);

    // All should show high precision for 1234.567 (3 decimals > 2 standard for USD/EUR/GBP)
    badges.forEach((badge) => {
      expect(badge).toBeInTheDocument();
    });
  },
};

export const CurrencySwitchingTest: Story = {
  render: (args) => <MoneyInputExample {...args} />,
  args: {
    hasHighPrecisionBadge: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Enter amount first
    const amountInput = canvas.getByPlaceholderText("0.00");
    await userEvent.type(amountInput, "100.50");

    // Select EUR (2 fraction digits)
    const currencySelect = canvas.getByTestId("currency-dropdown");
    await userEvent.click(currencySelect);
    const eurOption = await canvas.findByText("EUR");
    await userEvent.click(eurOption);

    // Amount should be formatted - React Aria doesn't preserve trailing zeros in input display
    expect(amountInput).toHaveValue("100.5");

    // Switch to JPY (0 fraction digits)
    await userEvent.click(currencySelect);
    const jpyOption = await canvas.findByText("JPY");
    await userEvent.click(jpyOption);

    // Amount should retain decimal precision even when switching to JPY
    // (NumberInput doesn't auto-format based on currency fraction digits)
    expect(amountInput).toHaveValue("100.5");
  },
};

export const FormIntegrationExample: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      price: { amount: "", currencyCode: "" } as TValue,
      discount: { amount: "", currencyCode: "" } as TValue,
    });

    const handlePriceChange = (event: TCustomEvent) => {
      if (event.target.name?.startsWith("price")) {
        const field = event.target.name.split(".")[1];
        setFormData((prev) => ({
          ...prev,
          price: { ...prev.price, [field]: event.target.value as string },
        }));
      }
    };

    const handleDiscountChange = (event: TCustomEvent) => {
      if (event.target.name?.startsWith("discount")) {
        const field = event.target.name.split(".")[1];
        setFormData((prev) => ({
          ...prev,
          discount: { ...prev.discount, [field]: event.target.value as string },
        }));
      }
    };

    return (
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "400px",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "4px",
              fontWeight: "bold",
            }}
          >
            Product Price
          </label>
          <MoneyInput
            value={formData.price}
            currencies={DEFAULT_CURRENCIES}
            onChange={handlePriceChange}
            name="price"
            hasHighPrecisionBadge
            placeholder="0.00"
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "4px",
              fontWeight: "bold",
            }}
          >
            Discount Amount
          </label>
          <MoneyInput
            value={formData.discount}
            currencies={DEFAULT_CURRENCIES}
            onChange={handleDiscountChange}
            name="discount"
            hasHighPrecisionBadge
            placeholder="0.00"
          />
        </div>

        <pre
          style={{
            marginTop: "16px",
            padding: "8px",
            backgroundColor: "#f5f5f5",
            fontSize: "12px",
            borderRadius: "4px",
          }}
        >
          {JSON.stringify(formData, null, 2)}
        </pre>
      </form>
    );
  },
};

export const EULocaleFormattingExample: Story = {
  render: (args) => (
    <I18nProvider locale="de-DE">
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
          EU Locale Formatting (de-DE) - High Precision
        </div>
        <div style={{ fontSize: "14px", marginBottom: "16px", color: "#666" }}>
          In German locale: 1.234.567,89 (periods for thousands, comma for
          decimals)
        </div>

        {/* German locale examples */}
        <MoneyInputExample
          initialValue={{ amount: "1234.567", currencyCode: "EUR" }}
          currencies={["EUR"]}
          {...args}
        />
        <MoneyInputExample
          initialValue={{ amount: "98765.4321", currencyCode: "USD" }}
          currencies={["USD"]}
          {...args}
        />
        <MoneyInputExample
          initialValue={{ amount: "12345.123456", currencyCode: "GBP" }}
          currencies={["GBP"]}
          {...args}
        />
      </div>
    </I18nProvider>
  ),
  args: {
    hasHighPrecisionBadge: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // All should show high precision badges since they exceed standard fraction digits
    const badges = canvas.getAllByTestId("high-precision-badge");
    expect(badges).toHaveLength(3);

    // With German locale I18nProvider, React Aria formats with German conventions
    const inputs = canvas.getAllByPlaceholderText("0.00");

    // Verify the inputs exist and are working
    expect(inputs).toHaveLength(3);

    // Test that high precision values are preserved with German locale formatting
    // German locale: periods for thousands, comma for decimals (1.234,567)
    expect(inputs[0]).toHaveValue("1.234,567"); // EUR - 3 decimals
    expect(inputs[1]).toHaveValue("98.765,4321"); // USD - 4 decimals
    expect(inputs[2]).toHaveValue("12.345,123456"); // GBP - full precision preserved
  },
};

// Static Methods Testing Story
export const CurrencyFormattingTest: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <Text mb={2} fontSize="lg" fontWeight="bold">
          Currency Formatting Test
        </Text>
        <Text mb={4} fontSize="sm" color="neutral.11">
          Test that currencies format to proper decimal places on blur:
          <br />
          • USD/EUR: "99.9" should become "99.90"
          <br />
          • JPY: "99.5" should become "99"
          <br />• High precision values should remain unchanged
        </Text>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* USD Test */}
        <Box>
          <Text mb={1} fontSize="sm" fontWeight="medium">
            USD (2 decimal places) - Try "99.9" and blur
          </Text>
          <MoneyInputExample
            initialValue={{ amount: "99.9", currencyCode: "USD" }}
            currencies={["USD"]}
          />
        </Box>

        {/* EUR Test */}
        <Box>
          <Text mb={1} fontSize="sm" fontWeight="medium">
            EUR (2 decimal places) - Try "123.4" and blur
          </Text>
          <MoneyInputExample
            initialValue={{ amount: "123.4", currencyCode: "EUR" }}
            currencies={["EUR"]}
          />
        </Box>

        {/* JPY Test */}
        <Box>
          <Text mb={1} fontSize="sm" fontWeight="medium">
            JPY (0 decimal places) - Try "99.0" and blur
          </Text>
          <MoneyInputExample
            initialValue={{ amount: "99.0", currencyCode: "JPY" }}
            currencies={["JPY"]}
          />
        </Box>

        {/* High Precision Test */}
        <Box>
          <Text mb={1} fontSize="sm" fontWeight="medium">
            USD High Precision - "99.12345" should stay unchanged
          </Text>
          <MoneyInputExample
            initialValue={{ amount: "99.12345", currencyCode: "USD" }}
            currencies={["USD"]}
          />
        </Box>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test USD formatting: "99.9" → "99.90"
    const usdInput = canvas.getAllByPlaceholderText("0.00")[0];

    // Clear and type new value
    await userEvent.clear(usdInput);
    await userEvent.type(usdInput, "99.9");

    // Blur to trigger formatting
    await userEvent.tab();

    // Wait for formatting
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Verify formatting
    expect(usdInput).toHaveValue("99.90");

    // Test EUR formatting: "123.4" → "123.40"
    const eurInput = canvas.getAllByPlaceholderText("0.00")[1];

    await userEvent.clear(eurInput);
    await userEvent.type(eurInput, "123.4");
    await userEvent.tab();
    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(eurInput).toHaveValue("123.40");

    // Test JPY formatting: "99.0" → "99" (JPY has 0 fractionDigits)
    const jpyInput = canvas.getAllByPlaceholderText("0.00")[2];

    await userEvent.clear(jpyInput);
    await userEvent.type(jpyInput, "99.0");
    await userEvent.tab();
    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(jpyInput).toHaveValue("99");

    // Test high precision remains unchanged
    const highPrecisionInput = canvas.getAllByPlaceholderText("0.00")[3];
    expect(highPrecisionInput).toHaveValue("99.12345");

    // Verify high precision badge is shown
    const highPrecisionBadge = canvas.getByTestId("high-precision-badge");
    expect(highPrecisionBadge).toBeInTheDocument();
  },
};

export const StaticMethodsCompliance: Story = {
  play: async () => {
    // Helper to capture console warnings
    const originalWarn = console.warn;
    let capturedWarnings: unknown[][] = [];
    console.warn = (...args: unknown[]) => {
      capturedWarnings.push(args);
      originalWarn.apply(console, args);
    };

    try {
      // Test convertToMoneyValue
      expect(
        MoneyInput.convertToMoneyValue({ amount: "1", currencyCode: "" }, "en")
      ).toBe(null);

      expect(
        MoneyInput.convertToMoneyValue(
          { amount: "1", currencyCode: "FOO" as TCurrencyCode },
          "en"
        )
      ).toBe(null);

      const euroCent = MoneyInput.convertToMoneyValue(
        { amount: "1.2", currencyCode: "EUR" },
        "en"
      );
      expect(euroCent?.type).toBe("centPrecision");
      expect(euroCent?.centAmount).toBe(120);

      const euroHigh = MoneyInput.convertToMoneyValue(
        { amount: "1.234", currencyCode: "EUR" },
        "en"
      );
      expect(euroHigh?.type).toBe("highPrecision");
      expect(euroHigh?.preciseAmount).toBe(1234);

      // Test parseMoneyValue
      expect(MoneyInput.parseMoneyValue(null as never, "en")).toEqual({
        currencyCode: "",
        amount: "",
      });

      const centResult = MoneyInput.parseMoneyValue(
        {
          type: "centPrecision",
          centAmount: 1234,
          currencyCode: "EUR",
          fractionDigits: 2,
        },
        "en"
      );
      expect(centResult.amount).toBe("12.34");
      expect(centResult.currencyCode).toBe("EUR");

      const highResult = MoneyInput.parseMoneyValue(
        {
          type: "highPrecision",
          currencyCode: "EUR",
          centAmount: 1234,
          fractionDigits: 5,
          preciseAmount: 1234527,
        },
        "en"
      );
      expect(highResult.amount).toBe("12.34527");
      expect(highResult.currencyCode).toBe("EUR");

      // Test parseMoneyValue throws for missing currencyCode
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

      // Test isEmpty
      expect(MoneyInput.isEmpty({ amount: "5", currencyCode: "EUR" })).toBe(
        false
      );
      expect(MoneyInput.isEmpty({ amount: "", currencyCode: "EUR" })).toBe(
        true
      );
      expect(MoneyInput.isEmpty({ amount: "5", currencyCode: "" })).toBe(true);
      expect(MoneyInput.isEmpty(null as never)).toBe(true);

      // Test isHighPrecision
      expect(
        MoneyInput.isHighPrecision(
          { amount: "2.001", currencyCode: "EUR" },
          "en"
        )
      ).toBe(true);
      expect(
        MoneyInput.isHighPrecision(
          { amount: "2.00", currencyCode: "EUR" },
          "en"
        )
      ).toBe(false);

      // Test isHighPrecision warning for empty values
      capturedWarnings = [];
      MoneyInput.isHighPrecision({ amount: "", currencyCode: "EUR" }, "en");
      expect(
        capturedWarnings.some((warning) =>
          warning.some(
            (arg: unknown) =>
              typeof arg === "string" && arg.includes("empty money value")
          )
        )
      ).toBe(true);

      // Test locale-specific formatting
      const swissResult = MoneyInput.parseMoneyValue(
        {
          type: "highPrecision",
          currencyCode: "EUR",
          centAmount: 1234,
          fractionDigits: 3,
          preciseAmount: 1234567,
        },
        "de-CH"
      );
      // Swiss locale should format differently than English (using right quote or other separator)
      expect(swissResult.amount).toBe("1’234.567");

      const spanishResult = MoneyInput.parseMoneyValue(
        {
          type: "highPrecision",
          currencyCode: "EUR",
          centAmount: 1234,
          fractionDigits: 3,
          preciseAmount: 1234567,
        },
        "es"
      );
      expect(spanishResult.amount).toContain(","); // Spanish locale uses comma
    } finally {
      console.warn = originalWarn;
    }
  },
  render: () => {
    return <>No UI, testing component's static methods</>;
  },
};
