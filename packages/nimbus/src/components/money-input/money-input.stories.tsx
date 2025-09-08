import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { MoneyInput, type MoneyInputProps } from "./money-input";
import type { TValue } from "./money-input.types";

// Custom event type for MoneyInput onChange handler
type TCustomEvent = {
  target: {
    id?: string;
    name?: string;
    value?: string | string[] | null;
  };
  persist?: () => void;
};

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
        currencyCode: event.target.value as string,
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
    hasError: false,
    hasWarning: false,
    isCondensed: false,
    hasHighPrecisionBadge: true,
    horizontalConstraint: "scale",
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

    // High precision badge should be visible
    const badge = canvas.getByTestId("high-precision-badge");
    expect(badge).toBeInTheDocument();
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
    expect(currencySelect).toHaveAttribute("aria-disabled", "true");
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
    hasError: true,
  },
};

export const WarningState: Story = {
  render: (args) => (
    <MoneyInputExample
      initialValue={{ amount: "999999.99", currencyCode: "USD" }}
      {...args}
    />
  ),
  args: {
    hasWarning: true,
  },
};

export const CondensedSize: Story = {
  render: (args) => (
    <MoneyInputExample
      initialValue={{ amount: "42.00", currencyCode: "JPY" }}
      {...args}
    />
  ),
  args: {
    isCondensed: true,
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

    // Amount should be formatted to 100.50
    expect(amountInput).toHaveValue("100.50");

    // Switch to JPY (0 fraction digits)
    await userEvent.click(currencySelect);
    const jpyOption = await canvas.findByText("JPY");
    await userEvent.click(jpyOption);

    // Amount should be formatted to whole number
    expect(amountInput).toHaveValue("101");
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
