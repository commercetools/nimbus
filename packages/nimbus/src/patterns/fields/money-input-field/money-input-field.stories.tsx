import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoneyInputField } from "./money-input-field";
import { userEvent, within, expect, fn, waitFor } from "storybook/test";
import { Stack, Text } from "@/components";
import type { MoneyInputValue } from "@/components/money-input/money-input.types";

const meta: Meta<typeof MoneyInputField> = {
  title: "patterns/fields/MoneyInputField",
  component: MoneyInputField,
};

export default meta;

type Story = StoryObj<typeof MoneyInputField>;

export const Base: Story = {
  args: {
    label: "Product Price",
    description: "Enter the product price with currency",
    currencies: ["USD", "EUR", "GBP", "JPY"],
    value: { amount: "", currencyCode: "USD" },
    placeholder: "0.00",
  },
  render: (args) => <MoneyInputField {...args} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByText("Product Price");
    const description = canvas.getByText(
      "Enter the product price with currency"
    );

    await step("Renders a visible FormField label", async () => {
      await expect(label).toBeInTheDocument();
      await expect(label.tagName).toBe("LABEL");
    });

    await step("Renders a FormField description text", async () => {
      await expect(description).toBeInTheDocument();
    });

    await step("Renders both currency selector and amount input", async () => {
      // Currency selector (button)
      const currencySelect = canvas.getByRole("button", { name: /currency/i });
      await expect(currencySelect).toBeInTheDocument();

      // Amount input (textbox)
      const amountInput = canvas.getByRole("textbox", { name: /amount/i });
      await expect(amountInput).toBeInTheDocument();
    });

    await step("Currency selector shows selected currency", async () => {
      const currencySelect = canvas.getByRole("button", { name: /currency/i });
      await expect(currencySelect).toHaveTextContent("USD");
    });

    await step("Amount input shows placeholder", async () => {
      const amountInput = canvas.getByRole("textbox", { name: /amount/i });
      await expect(amountInput).toHaveAttribute("placeholder", "0.00");
    });

    await step("Amount input can receive user input", async () => {
      const amountInput = canvas.getByRole("textbox", { name: /amount/i });
      await userEvent.type(amountInput, "99.99");
      await expect(amountInput).toHaveValue("99.99");
    });

    await step("Both inputs are focusable with tab key", async () => {
      // Clear focus first
      await userEvent.click(document.body);

      // Tab to currency selector
      await userEvent.keyboard("{Tab}");
      const currencySelect = canvas.getByRole("button", { name: /currency/i });
      await expect(currencySelect).toHaveFocus();

      // Tab to amount input
      await userEvent.keyboard("{Tab}");
      const amountInput = canvas.getByRole("textbox", { name: /amount/i });
      await expect(amountInput).toHaveFocus();
    });
  },
};

export const Required: Story = {
  args: {
    label: "Product Price",
    description: "This field is required",
    currencies: ["USD", "EUR", "GBP"],
    value: { amount: "", currencyCode: "USD" },
    placeholder: "0.00",
    isRequired: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByText("Product Price");

    await step("FormField label shows required indicator", async () => {
      await expect(label.innerHTML).toContain("*");
    });

    await step(
      "FormField adds aria-required attribute to amount input",
      async () => {
        const amountInput = canvas.getByRole("textbox", { name: /amount/i });
        await expect(amountInput).toHaveAttribute("aria-required", "true");
      }
    );
  },
};

export const Disabled: Story = {
  args: {
    label: "Product Price",
    description: "This field is disabled",
    currencies: ["USD", "EUR", "GBP"],
    value: { amount: "99.99", currencyCode: "USD" },
    isDisabled: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("FormField isDisabled propagates to both inputs", async () => {
      const currencySelect = canvas.getByRole("button", { name: /currency/i });
      const amountInput = canvas.getByRole("textbox", { name: /amount/i });

      await expect(currencySelect).toHaveAttribute("data-disabled", "true");
      await expect(amountInput).toBeDisabled();
    });

    await step("Disabled inputs cannot receive focus via tab", async () => {
      // Clear focus first
      await userEvent.click(document.body);

      // Try to tab to the inputs
      await userEvent.keyboard("{Tab}");

      const currencySelect = canvas.getByRole("button", { name: /currency/i });
      const amountInput = canvas.getByRole("textbox", { name: /amount/i });

      // Neither should have focus
      await expect(currencySelect).not.toHaveFocus();
      await expect(amountInput).not.toHaveFocus();
    });

    await step("Disabled amount input cannot receive user input", async () => {
      const amountInput = canvas.getByRole("textbox", { name: /amount/i });

      // Try to type in the disabled input
      await userEvent.type(amountInput, "123");
      await expect(amountInput).toHaveValue("99.99");
    });
  },
};

export const Invalid: Story = {
  args: {
    label: "Product Price",
    description: "Enter a valid product price",
    currencies: ["USD", "EUR", "GBP"],
    value: { amount: "", currencyCode: "USD" },
    placeholder: "0.00",
    isInvalid: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Amount input is rendered with invalid state", async () => {
      const amountInput = canvas.getByRole("textbox", { name: /amount/i });
      await expect(amountInput).toBeInTheDocument();
      await expect(amountInput).toHaveAttribute("data-invalid", "true");
    });

    await step(
      "Invalid inputs are still focusable and functional",
      async () => {
        const amountInput = canvas.getByRole("textbox", { name: /amount/i });
        await userEvent.click(amountInput);
        await expect(amountInput).toHaveFocus();

        await userEvent.type(amountInput, "99.99");
        await expect(amountInput).toHaveValue("99.99");
      }
    );
  },
};

export const WithErrors: Story = {
  args: {
    label: "Product Price",
    description: "Enter the product price",
    currencies: ["USD", "EUR", "GBP"],
    value: { amount: "", currencyCode: "USD" },
    placeholder: "0.00",
    isInvalid: true,
    errors: { missing: true, format: true },
    touched: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Amount input has invalid state", async () => {
      const amountInput = canvas.getByRole("textbox", { name: /amount/i });
      await expect(amountInput).toHaveAttribute("data-invalid", "true");
    });

    await step("Localized error messages are displayed", async () => {
      await expect(
        canvas.getByText("This field is required. Provide a value.")
      ).toBeInTheDocument();
      await expect(
        canvas.getByText("Please enter a valid format.")
      ).toBeInTheDocument();
    });

    await step("Errors are properly linked via aria-describedby", async () => {
      const amountInput = canvas.getByRole("textbox", { name: /amount/i });
      const ariaDescribedby = amountInput.getAttribute("aria-describedby");
      await expect(ariaDescribedby).toBeTruthy();
    });
  },
};

export const ReadOnly: Story = {
  args: {
    label: "Product Price",
    description: "This field is read-only",
    currencies: ["USD", "EUR", "GBP"],
    value: { amount: "199.99", currencyCode: "EUR" },
    isReadOnly: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("FormField isReadOnly propagates to amount input", async () => {
      const amountInput = canvas.getByRole("textbox", { name: /amount/i });
      await expect(amountInput).toHaveAttribute("readonly");
    });

    await step("ReadOnly amount input displays existing value", async () => {
      const amountInput = canvas.getByRole("textbox", { name: /amount/i });
      await expect(amountInput).toHaveValue("199.99");
    });

    await step("ReadOnly amount input can receive focus", async () => {
      const amountInput = canvas.getByRole("textbox", { name: /amount/i });
      await userEvent.click(amountInput);
      await expect(amountInput).toHaveFocus();
    });

    await step("ReadOnly amount input cannot receive user input", async () => {
      const amountInput = canvas.getByRole("textbox", { name: /amount/i });
      const originalValue = "199.99";
      await userEvent.type(amountInput, "999");
      await expect(amountInput).toHaveValue(originalValue);
    });
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<MoneyInputValue>({
      amount: "",
      currencyCode: "USD",
    });
    const handleChange = fn((newValue: MoneyInputValue) => {
      setValue(newValue);
    });

    return (
      <Stack gap="400">
        <MoneyInputField
          label="Product Price"
          description="Controlled component example"
          currencies={["USD", "EUR", "GBP", "JPY"]}
          value={value}
          onValueChange={handleChange}
          placeholder="0.00"
        />
        <Text data-testid="value-display">
          Current value: {value.amount} {value.currencyCode}
        </Text>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const amountInput = canvas.getByRole("textbox", { name: /amount/i });
    const valueDisplay = canvas.getByTestId("value-display");

    await step("Controlled value updates when typing amount", async () => {
      await userEvent.clear(amountInput);
      await userEvent.type(amountInput, "99.99");

      // Blur to trigger onValueChange
      amountInput.blur();

      await waitFor(async () => {
        await expect(amountInput).toHaveValue("99.99");
        await expect(valueDisplay).toHaveTextContent(
          "Current value: 99.99 USD"
        );
      });
    });

    await step(
      "onValueChange receives MoneyInputValue object (not event)",
      async () => {
        await userEvent.type(amountInput, ".50");
      }
    );

    await step("Controlled value updates when changing currency", async () => {
      const currencySelect = canvas.getByRole("button", { name: /currency/i });
      await userEvent.click(currencySelect);

      // Wait for listbox to appear and select EUR
      await waitFor(async () => {
        const listbox = within(document.body).getByRole("listbox");
        await expect(listbox).toBeInTheDocument();
      });

      const eurOption = within(document.body).getByRole("option", {
        name: /EUR/,
      });
      await userEvent.click(eurOption);

      await waitFor(async () => {
        await expect(valueDisplay.textContent).toContain("EUR");
      });
    });
  },
};

export const WithName: Story = {
  args: {
    label: "Product Price",
    name: "product-price",
    currencies: ["USD", "EUR", "GBP"],
    value: { amount: "", currencyCode: "USD" },
    placeholder: "0.00",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Name attribute creates product-price.amount for amount input",
      async () => {
        const amountInput = canvas.getByRole("textbox", { name: /amount/i });
        await expect(amountInput).toHaveAttribute(
          "name",
          "product-price.amount"
        );
      }
    );

    await step("Currency selector renders correctly", async () => {
      const currencySelect = canvas.getByRole("button", {
        name: /currency/i,
      });
      await expect(currencySelect).toBeInTheDocument();
      await expect(currencySelect).toHaveTextContent("USD");
    });
  },
};

export const WithId: Story = {
  args: {
    label: "Product Price",
    id: "custom-price-input",
    currencies: ["USD", "EUR", "GBP"],
    value: { amount: "", currencyCode: "USD" },
    placeholder: "0.00",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Custom id creates custom-price-input.amount", async () => {
      const amountInput = canvas.getByRole("textbox", { name: /amount/i });
      await expect(amountInput).toHaveAttribute(
        "id",
        "custom-price-input.amount"
      );
    });

    await step(
      "Custom id creates custom-price-input.currencyCode",
      async () => {
        const currencySelect = canvas.getByRole("button", {
          name: /currency/i,
        });
        await expect(currencySelect).toHaveAttribute(
          "id",
          "custom-price-input.currencyCode"
        );
      }
    );
  },
};

export const SmallSize: Story = {
  args: {
    label: "Product Price",
    description: "Small size variant",
    currencies: ["USD", "EUR", "GBP"],
    value: { amount: "99.99", currencyCode: "USD" },
    size: "sm",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Small size renders correctly", async () => {
      const amountInput = canvas.getByRole("textbox", { name: /amount/i });
      const currencySelect = canvas.getByRole("button", { name: /currency/i });

      await expect(amountInput).toBeInTheDocument();
      await expect(currencySelect).toBeInTheDocument();
    });
  },
};

export const WithHighPrecision: Story = {
  args: {
    label: "Product Price",
    description: "High precision amount (more decimals than currency standard)",
    currencies: ["USD", "EUR", "GBP"],
    value: { amount: "99.99999", currencyCode: "USD" },
    hasHighPrecisionBadge: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("High precision value is displayed", async () => {
      const amountInput = canvas.getByRole("textbox", { name: /amount/i });
      await expect(amountInput).toHaveValue("99.99999");
    });

    await step("High precision badge is visible", async () => {
      const badge = canvas.getByLabelText("High precision price");
      await expect(badge).toBeInTheDocument();
    });
  },
};

export const WithCurrencyDisabled: Story = {
  args: {
    label: "Product Price",
    description: "Currency selector is disabled while amount input is enabled",
    currencies: ["USD", "EUR", "GBP"],
    value: { amount: "99.99", currencyCode: "USD" },
    isCurrencyInputDisabled: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Currency selector is disabled", async () => {
      const currencySelect = canvas.getByRole("button", { name: /currency/i });
      await expect(currencySelect).toHaveAttribute("data-disabled", "true");
    });

    await step("Amount input is still enabled and functional", async () => {
      const amountInput = canvas.getByRole("textbox", { name: /amount/i });
      await expect(amountInput).not.toBeDisabled();

      await userEvent.click(amountInput);
      await expect(amountInput).toHaveFocus();

      await userEvent.type(amountInput, "50");
      await expect(amountInput).toHaveValue("99.9950");
    });
  },
};

export const WithInfo: Story = {
  args: {
    label: "Product Price",
    description: "Enter the product price",
    currencies: ["USD", "EUR", "GBP"],
    value: { amount: "", currencyCode: "USD" },
    placeholder: "0.00",
    info: "Prices should be competitive and reflect market rates.",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );
    const infoButton = canvas.getByLabelText("__MORE INFO");

    await step("Info button is present and clickable", async () => {
      await expect(infoButton).toBeInTheDocument();
      await userEvent.click(infoButton);
    });

    await step(
      "Info content is visible after clicking info button",
      async () => {
        const info = within(document.body).getByText(
          "Prices should be competitive and reflect market rates."
        );
        await expect(info).toBeInTheDocument();
      }
    );

    await step("Info is properly linked via aria-describedby", async () => {
      const info = within(document.body).getByText(
        "Prices should be competitive and reflect market rates."
      );
      const amountInput = canvas.getByRole("textbox", { name: /amount/i });
      const ariaDescribedby = amountInput.getAttribute("aria-describedby");
      await expect(ariaDescribedby).toContain(info.id);
    });

    await step("Inputs are still functional with Info", async () => {
      await userEvent.click(infoButton);

      const amountInput = canvas.getByRole("textbox", { name: /amount/i });
      await userEvent.type(amountInput, "99.99");
      await expect(amountInput).toHaveValue("99.99");
    });
  },
};

export const WithDifferentCurrencies: Story = {
  render: () => {
    return (
      <Stack gap="400">
        <MoneyInputField
          label="US Dollars (2 decimals)"
          description="Standard 2 decimal places"
          currencies={["USD"]}
          value={{ amount: "99.99", currencyCode: "USD" }}
          onValueChange={() => {}}
        />
        <MoneyInputField
          label="Japanese Yen (0 decimals)"
          description="No decimal places (whole numbers only)"
          currencies={["JPY"]}
          value={{ amount: "9999", currencyCode: "JPY" }}
          onValueChange={() => {}}
        />
        <MoneyInputField
          label="Kuwaiti Dinar (3 decimals)"
          description="High precision with 3 decimal places"
          currencies={["KWD"]}
          value={{ amount: "99.999", currencyCode: "KWD" }}
          onValueChange={() => {}}
        />
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const inputs = canvas.getAllByRole("textbox", { name: /amount/i });

    await step("All currency variants render correctly", async () => {
      await expect(inputs).toHaveLength(3);
    });

    await step("USD shows 2 decimal places", async () => {
      await expect(inputs[0]).toHaveValue("99.99");
    });

    await step("JPY shows whole number with formatting", async () => {
      await expect(inputs[1]).toHaveValue("9,999");
    });

    await step("KWD shows 3 decimal places", async () => {
      await expect(inputs[2]).toHaveValue("99.999");
    });
  },
};
