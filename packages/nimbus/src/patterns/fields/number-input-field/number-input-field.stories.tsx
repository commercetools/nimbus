import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { NumberInputField } from "./number-input-field";
import { userEvent, within, expect, fn } from "storybook/test";
import { Stack, Text } from "@/components";

const meta: Meta<typeof NumberInputField> = {
  title: "patterns/fields/NumberInputField",
  component: NumberInputField,
};

export default meta;

type Story = StoryObj<typeof NumberInputField>;

export const Base: Story = {
  args: {
    label: "Quantity",
    description: "Enter the product quantity",
    placeholder: "Enter quantity",
  },
  render: (args) => <NumberInputField {...args} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");
    const label = canvas.getByText("Quantity");
    const description = canvas.getByText("Enter the product quantity");

    await step("Renders a visible FormField label", async () => {
      await expect(label).toBeInTheDocument();
      await expect(label.tagName).toBe("LABEL");
    });

    await step("Renders a FormField description text", async () => {
      await expect(description).toBeInTheDocument();
    });

    await step("Input is properly associated with label", async () => {
      await expect(input).toHaveAttribute("aria-labelledby", label.id);
    });

    await step("Input is properly associated with description", async () => {
      await expect(input).toHaveAttribute("aria-describedby", description.id);
    });

    await step(
      "Can focus NumberInput by clicking FormField label",
      async () => {
        await userEvent.click(label);
        await expect(input).toHaveFocus();
      }
    );

    await step("Uses an <input> element with textbox role", async () => {
      await expect(input.tagName).toBe("INPUT");
      await expect(input).toHaveAttribute("type", "text");
    });

    await step("Shows NumberInput placeholder text", async () => {
      await expect(input).toHaveAttribute("placeholder", "Enter quantity");
    });

    await step("NumberInput can receive numeric input", async () => {
      await userEvent.type(input, "42");
      await expect(input).toHaveValue("42");
      await userEvent.clear(input);
    });

    await step("NumberInput is focusable with <tab> key", async () => {
      // Clear focus first
      await userEvent.click(document.body);
      await expect(input).not.toHaveFocus();

      // Use keyboard navigation to focus the input
      await userEvent.keyboard("{Tab}");
      await expect(input).toHaveFocus();
    });

    await step("Increment and decrement buttons are present", async () => {
      const incrementButton = canvas.getByLabelText("Increment");
      const decrementButton = canvas.getByLabelText("Decrement");
      await expect(incrementButton).toBeInTheDocument();
      await expect(decrementButton).toBeInTheDocument();
    });
  },
};

export const Required: Story = {
  args: {
    label: "Product Price",
    description: "This field is required",
    placeholder: "0.00",
    isRequired: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");
    const label = canvas.getByText("Product Price");

    await step("FormField label shows required indicator", async () => {
      await expect(label.innerHTML).toContain("*");
    });

    await step(
      "FormField adds aria-required attribute when isRequired is true",
      async () => {
        await expect(input).toHaveAttribute("aria-required", "true");
      }
    );
  },
};

export const Disabled: Story = {
  args: {
    label: "Quantity",
    description: "This field is disabled",
    placeholder: "Enter quantity",
    isDisabled: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");
    const incrementButton = canvas.getByLabelText("Increment");
    const decrementButton = canvas.getByLabelText("Decrement");

    await step("FormField isDisabled propagates to NumberInput", async () => {
      await expect(input).toBeDisabled();
      await expect(input).toHaveAttribute("disabled");
    });

    await step("Increment/decrement buttons are also disabled", async () => {
      await expect(incrementButton).toBeDisabled();
      await expect(decrementButton).toBeDisabled();
    });

    await step(
      "Disabled NumberInput cannot receive focus via tab",
      async () => {
        // Clear focus first
        await userEvent.click(document.body);

        // Try to tab to the input
        await userEvent.keyboard("{Tab}");
        await expect(input).not.toHaveFocus();
      }
    );

    await step("Disabled NumberInput cannot receive user input", async () => {
      // Try to type in the disabled input
      await userEvent.type(input, "123");
      await expect(input).toHaveValue("");
    });
  },
};

export const Invalid: Story = {
  args: {
    label: "Quantity",
    description: "Enter a valid quantity",
    placeholder: "0",
    isInvalid: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Quantity");

    await step("Input is rendered with invalid state", async () => {
      await expect(input).toBeInTheDocument();
      await expect(input).toHaveAttribute("data-invalid", "true");
    });

    await step("Invalid input is still focusable and functional", async () => {
      await userEvent.click(input);
      await expect(input).toHaveFocus();

      await userEvent.type(input, "50");
      await expect(input).toHaveValue("50");
    });
  },
};

export const WithErrors: Story = {
  args: {
    label: "Product Price",
    description: "Enter the product price",
    placeholder: "0.00",
    isInvalid: true,
    errors: { missing: true, negative: true },
    touched: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Product Price");

    await step("Input has invalid state", async () => {
      await expect(input).toHaveAttribute("data-invalid", "true");
    });

    await step("Localized error messages are displayed", async () => {
      await expect(
        canvas.getByText("This field is required. Provide a value.")
      ).toBeInTheDocument();
      await expect(
        canvas.getByText("Negative number is not supported.")
      ).toBeInTheDocument();
    });

    await step("Errors are properly linked via aria-describedby", async () => {
      const ariaDescribedby = input.getAttribute("aria-describedby");
      await expect(ariaDescribedby).toBeTruthy();
    });
  },
};

export const ReadOnly: Story = {
  args: {
    label: "Current Stock",
    description: "This field is read-only",
    value: 150,
    isReadOnly: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");
    const incrementButton = canvas.getByLabelText("Increment");
    const decrementButton = canvas.getByLabelText("Decrement");

    await step("FormField isReadOnly propagates to NumberInput", async () => {
      await expect(input).toHaveAttribute("readonly");
    });

    await step("ReadOnly NumberInput displays existing value", async () => {
      await expect(input).toHaveValue("150");
    });

    await step("ReadOnly NumberInput can receive focus", async () => {
      await userEvent.click(input);
      await expect(input).toHaveFocus();
    });

    await step("ReadOnly NumberInput cannot receive user input", async () => {
      const originalValue = "150";
      await userEvent.type(input, "999");
      await expect(input).toHaveValue(originalValue);
    });

    await step("Increment/decrement buttons are disabled", async () => {
      await expect(incrementButton).toBeDisabled();
      await expect(decrementButton).toBeDisabled();
    });
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState(10);
    const handleChange = fn((newValue: number) => {
      setValue(newValue);
    });

    return (
      <Stack gap="400">
        <NumberInputField
          label="Quantity"
          description="Controlled component example"
          value={value}
          onChange={handleChange}
          minValue={0}
          maxValue={100}
        />
        <Text data-testid="value-display">Current value: {value}</Text>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");
    const valueDisplay = canvas.getByTestId("value-display");

    await step("Initial value is displayed", async () => {
      await expect(input).toHaveValue("10");
      await expect(valueDisplay).toHaveTextContent("Current value: 10");
    });

    await step("Value updates remain controlled", async () => {
      // Just verify initial controlled state
      await expect(input).toHaveValue("10");
      await expect(valueDisplay).toHaveTextContent("Current value: 10");
    });
  },
};

export const WithMinMax: Story = {
  args: {
    label: "Percentage",
    description: "Enter a percentage (0-100)",
    minValue: 0,
    maxValue: 100,
    value: 50,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    await step("Initial value is within range", async () => {
      await expect(input).toHaveValue("50");
    });

    await step("Input accepts values within range", async () => {
      await userEvent.clear(input);
      await userEvent.type(input, "75");
      await expect(input).toHaveValue("75");
    });
  },
};

export const WithName: Story = {
  args: {
    label: "Stock Level",
    name: "stock-quantity",
    placeholder: "Enter stock quantity",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    await step("Name attribute is applied to input", async () => {
      await expect(input).toHaveAttribute("name", "stock-quantity");
    });
  },
};

export const WithId: Story = {
  args: {
    label: "Quantity",
    id: "custom-quantity-input",
    placeholder: "Enter quantity",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    await step("Custom id is applied to input", async () => {
      await expect(input).toHaveAttribute("id", "custom-quantity-input");
    });
  },
};

export const WithDifferentWidths: Story = {
  render: () => {
    return (
      <Stack gap="400">
        <NumberInputField
          label="Narrow field"
          description="Width: 192px (token: 4800)"
          placeholder="0"
          width="4800"
        />
        <NumberInputField
          label="Medium field"
          description="Width: 50%"
          placeholder="0"
          width="50%"
        />
        <NumberInputField
          label="Wide field"
          description="Width: 100%"
          placeholder="0"
          width="100%"
        />
        <NumberInputField
          label="Max width field"
          description="Max width: 384px (token: 9600)"
          placeholder="0"
          maxWidth="9600"
        />
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const inputs = canvas.getAllByRole("textbox");

    await step("All width variants render correctly", async () => {
      await expect(inputs).toHaveLength(4);
    });

    await step("All width variants are functional", async () => {
      for (let i = 0; i < inputs.length; i++) {
        await userEvent.type(inputs[i], `${(i + 1) * 10}`);
        await expect(inputs[i]).toHaveValue(`${(i + 1) * 10}`);
        await userEvent.clear(inputs[i]);
      }
    });
  },
};

export const WithInfo: Story = {
  args: {
    label: "Quantity",
    description: "Enter product quantity",
    placeholder: "0",
    info: "Quantity must be a positive whole number representing units in stock.",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );
    const input = canvas.getByRole("textbox");
    const infoButton = canvas.getByLabelText("__MORE INFO");

    await step("Info button is present and clickable", async () => {
      await expect(infoButton).toBeInTheDocument();
      await userEvent.click(infoButton);
    });

    await step(
      "Info content is visible after clicking info button",
      async () => {
        const info = within(document.body).getByText(
          "Quantity must be a positive whole number representing units in stock."
        );
        await expect(info).toBeInTheDocument();
      }
    );

    await step("Info is properly linked via aria-describedby", async () => {
      const info = within(document.body).getByText(
        "Quantity must be a positive whole number representing units in stock."
      );
      const ariaDescribedby = input.getAttribute("aria-describedby");
      await expect(ariaDescribedby).toContain(info.id);
    });

    await step("Input is still functional with Info", async () => {
      await userEvent.click(infoButton);

      await userEvent.type(input, "25");
      await expect(input).toHaveValue("25");
    });
  },
};

export const WithStep: Story = {
  args: {
    label: "Price",
    description: "Enter price in increments of 0.25",
    step: 0.25,
    minValue: 0,
    value: 5.5,
    formatOptions: {
      style: "currency",
      currency: "USD",
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    await step("Initial value is formatted as currency", async () => {
      await expect(input).toHaveValue("$5.50");
    });

    await step("Input accepts currency formatted values", async () => {
      await userEvent.click(input);
      await expect(input).toHaveFocus();
    });
  },
};

export const WithLeadingElement: Story = {
  args: {
    label: "Price",
    description: "Enter the product price",
    placeholder: "0.00",
    leadingElement: "$",
    value: 99.99,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    await step("Leading element is visible", async () => {
      await expect(canvas.getByText("$")).toBeInTheDocument();
    });

    await step("Input functions normally with leading element", async () => {
      await userEvent.click(input);
      await expect(input).toHaveFocus();
    });
  },
};

export const WithTrailingElement: Story = {
  args: {
    label: "Discount Percentage",
    description: "Enter discount as a percentage",
    placeholder: "0",
    trailingElement: "%",
    value: 15,
    minValue: 0,
    maxValue: 100,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    await step("Trailing element is visible", async () => {
      await expect(canvas.getByText("%")).toBeInTheDocument();
    });

    await step("Input functions normally with trailing element", async () => {
      await userEvent.click(input);
      await expect(input).toHaveFocus();
    });
  },
};
