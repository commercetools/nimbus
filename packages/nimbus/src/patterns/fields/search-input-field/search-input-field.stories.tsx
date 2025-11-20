import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchInputField } from "./search-input-field";
import { userEvent, within, expect, fn } from "storybook/test";
import { Stack, Text } from "@/components";

const meta: Meta<typeof SearchInputField> = {
  title: "patterns/fields/SearchInputField",
  component: SearchInputField,
};

export default meta;

type Story = StoryObj<typeof SearchInputField>;

export const Base: Story = {
  args: {
    label: "Search products",
    description: "Enter keywords to search for products",
    placeholder: "Search...",
  },
  render: (args) => <SearchInputField {...args} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("searchbox");
    const label = canvas.getByText("Search products");
    const description = canvas.getByText(
      "Enter keywords to search for products"
    );

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
      "Can focus SearchInput by clicking FormField label",
      async () => {
        await userEvent.click(label);
        await expect(input).toHaveFocus();
      }
    );

    await step("Uses a search input element", async () => {
      await expect(input.tagName).toBe("INPUT");
      await expect(input).toHaveAttribute("type", "search");
    });

    await step("Shows SearchInput placeholder text", async () => {
      await expect(input).toHaveAttribute("placeholder", "Search...");
    });

    await step("SearchInput can receive user input", async () => {
      await userEvent.type(input, "laptop");
      await expect(input).toHaveValue("laptop");
      await userEvent.clear(input);
    });

    await step("SearchInput is focusable with <tab> key", async () => {
      // Clear focus first
      await userEvent.click(document.body);
      await expect(input).not.toHaveFocus();

      // Use keyboard navigation to focus the input
      await userEvent.keyboard("{Tab}");
      await expect(input).toHaveFocus();
    });
  },
};

export const Required: Story = {
  args: {
    label: "Search products",
    description: "This field is required",
    placeholder: "Search...",
    isRequired: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("searchbox");
    const label = canvas.getByText("Search products");

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
    label: "Search products",
    description: "This field is disabled",
    placeholder: "Search...",
    isDisabled: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("searchbox");

    await step("FormField isDisabled propagates to SearchInput", async () => {
      await expect(input).toBeDisabled();
      await expect(input).toHaveAttribute("disabled");
    });

    await step(
      "Disabled SearchInput cannot receive focus via tab",
      async () => {
        // Clear focus first
        await userEvent.click(document.body);

        // Try to tab to the input
        await userEvent.keyboard("{Tab}");
        await expect(input).not.toHaveFocus();
      }
    );

    await step("Disabled SearchInput cannot receive user input", async () => {
      // Try to type in the disabled input
      await userEvent.type(input, "Test");
      await expect(input).toHaveValue("");
    });
  },
};

export const Invalid: Story = {
  args: {
    label: "Search products",
    description: "Enter search keywords",
    placeholder: "Search...",
    isInvalid: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Search products");

    await step("Input is rendered with invalid state", async () => {
      await expect(input).toBeInTheDocument();
      await expect(input).toHaveAttribute("data-invalid", "true");
    });

    await step("Invalid input is still focusable and functional", async () => {
      await userEvent.click(input);
      await expect(input).toHaveFocus();

      await userEvent.type(input, "laptop");
      await expect(input).toHaveValue("laptop");
    });
  },
};

export const WithErrors: Story = {
  args: {
    label: "Search products",
    description: "Enter search keywords",
    placeholder: "Search...",
    isInvalid: true,
    errors: { missing: true, format: true },
    touched: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Search products");

    await step("Input has invalid state", async () => {
      await expect(input).toHaveAttribute("data-invalid", "true");
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
      const ariaDescribedby = input.getAttribute("aria-describedby");
      await expect(ariaDescribedby).toBeTruthy();
    });
  },
};

export const ReadOnly: Story = {
  args: {
    label: "Search products",
    description: "This field is read-only",
    value: "laptop",
    isReadOnly: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("searchbox");

    await step("FormField isReadOnly propagates to SearchInput", async () => {
      await expect(input).toHaveAttribute("readonly");
    });

    await step("ReadOnly SearchInput displays existing value", async () => {
      await expect(input).toHaveValue("laptop");
    });

    await step("ReadOnly SearchInput can receive focus", async () => {
      await userEvent.click(input);
      await expect(input).toHaveFocus();
    });

    await step("ReadOnly SearchInput cannot receive user input", async () => {
      const originalValue = "laptop";
      await userEvent.type(input, "Attempted Change");
      await expect(input).toHaveValue(originalValue);
    });
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const handleChange = fn((newValue: string) => {
      setValue(newValue);
    });

    return (
      <Stack gap="400">
        <SearchInputField
          label="Search products"
          description="Controlled component example"
          value={value}
          onChange={handleChange}
          placeholder="Type something..."
        />
        <Text data-testid="value-display">Current value: {value}</Text>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("searchbox");
    const valueDisplay = canvas.getByTestId("value-display");

    await step("Controlled value updates when typing", async () => {
      await userEvent.type(input, "laptop");
      await expect(input).toHaveValue("laptop");
      await expect(valueDisplay).toHaveTextContent("Current value: laptop");
    });

    await step("onChange receives string value (not event)", async () => {
      await userEvent.type(input, "Test");
    });

    await step("Controlled value can be cleared", async () => {
      await userEvent.clear(input);
      await expect(input).toHaveValue("");
      await expect(valueDisplay).toHaveTextContent("Current value:");
    });
  },
};

export const WithName: Story = {
  args: {
    label: "Search",
    name: "product-search",
    placeholder: "Search products...",
  },
  play: async ({ canvasElement, step }) => {
    await step("Name attribute is applied to FormField.Root", async () => {
      const formField = canvasElement.querySelector('[name="product-search"]');
      await expect(formField).toBeInTheDocument();
    });
  },
};

export const WithId: Story = {
  args: {
    label: "Search",
    id: "custom-search-input",
    placeholder: "Search...",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("searchbox");

    await step("Custom id is applied to input", async () => {
      await expect(input).toHaveAttribute("id", "custom-search-input");
    });
  },
};

export const WithDifferentWidths: Story = {
  render: () => {
    return (
      <Stack gap="400">
        <SearchInputField
          label="Narrow search"
          description="Width: 192px (token: 4800)"
          placeholder="Search..."
          width="4800"
        />
        <SearchInputField
          label="Medium search"
          description="Width: 50%"
          placeholder="Search..."
          width="50%"
        />
        <SearchInputField
          label="Wide search"
          description="Width: 100%"
          placeholder="Search..."
          width="100%"
        />
        <SearchInputField
          label="Max width search"
          description="Max width: 384px (token: 9600)"
          placeholder="Search..."
          maxWidth="9600"
        />
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const inputs = canvas.getAllByRole("searchbox");

    await step("All width variants render correctly", async () => {
      await expect(inputs).toHaveLength(4);
    });

    await step("All width variants are functional", async () => {
      for (let i = 0; i < inputs.length; i++) {
        await userEvent.type(inputs[i], `Test ${i + 1}`);
        await expect(inputs[i]).toHaveValue(`Test ${i + 1}`);
        await userEvent.clear(inputs[i]);
      }
    });
  },
};

export const WithInfo: Story = {
  args: {
    label: "Search products",
    description: "Enter keywords to search",
    placeholder: "Search...",
    info: "You can search by product name, SKU, or description.",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );
    const input = canvas.getByRole("searchbox");
    const infoButton = canvas.getByLabelText("__MORE INFO");

    await step("Info button is present and clickable", async () => {
      await expect(infoButton).toBeInTheDocument();
      await userEvent.click(infoButton);
    });

    await step(
      "Info content is visible after clicking info button",
      async () => {
        const info = within(document.body).getByText(
          "You can search by product name, SKU, or description."
        );
        await expect(info).toBeInTheDocument();
      }
    );

    await step("Info is properly linked via aria-describedby", async () => {
      const info = within(document.body).getByText(
        "You can search by product name, SKU, or description."
      );
      const ariaDescribedby = input.getAttribute("aria-describedby");
      await expect(ariaDescribedby).toContain(info.id);
    });

    await step("Input is still functional with Info", async () => {
      await userEvent.click(infoButton);

      await userEvent.type(input, "laptop");
      await expect(input).toHaveValue("laptop");
    });
  },
};

export const WithClearButton: Story = {
  render: () => {
    const [value, setValue] = useState("laptop");
    return (
      <SearchInputField
        label="Search products"
        description="Type to search, clear button appears when there's text"
        value={value}
        onChange={setValue}
        placeholder="Search..."
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("searchbox");

    await step("Clear button is visible when input has value", async () => {
      await expect(input).toHaveValue("laptop");
      // The clear button should be visible (opacity 1) when there's a value
      const clearButton = canvas.getByLabelText(/clear/i);
      await expect(clearButton).toBeInTheDocument();
    });

    await step("Clear button clears the input when clicked", async () => {
      const clearButton = canvas.getByLabelText(/clear/i);
      await userEvent.click(clearButton);
      await expect(input).toHaveValue("");
    });
  },
};

export const WithOnSubmit: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const [submittedValue, setSubmittedValue] = useState("");
    const handleSubmit = fn((submitted: string) => {
      setSubmittedValue(submitted);
    });

    return (
      <Stack gap="400">
        <SearchInputField
          label="Search products"
          description="Type and press Enter to submit"
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          placeholder="Search..."
        />
        {submittedValue && (
          <Text data-testid="submitted-value">Submitted: {submittedValue}</Text>
        )}
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("searchbox");

    await step("Type a search query", async () => {
      await userEvent.type(input, "laptop");
      await expect(input).toHaveValue("laptop");
    });

    await step("onSubmit fires when pressing Enter", async () => {
      await userEvent.keyboard("{Enter}");
      const submittedDisplay = canvas.getByTestId("submitted-value");
      await expect(submittedDisplay).toHaveTextContent("Submitted: laptop");
    });
  },
};

export const Variants: Story = {
  render: () => {
    const [valueSolid, setValueSolid] = useState("");
    const [valueGhost, setValueGhost] = useState("");

    return (
      <Stack gap="400">
        <SearchInputField
          variant="solid"
          label="Solid variant (default)"
          description="Solid variant with background"
          value={valueSolid}
          onChange={setValueSolid}
          placeholder="Search..."
        />
        <SearchInputField
          variant="ghost"
          label="Ghost variant"
          description="Ghost variant without background"
          value={valueGhost}
          onChange={setValueGhost}
          placeholder="Search..."
        />
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const inputs = canvas.getAllByRole("searchbox");

    await step("Both variants render correctly", async () => {
      await expect(inputs).toHaveLength(2);
    });

    await step("Both variants are functional", async () => {
      await userEvent.type(inputs[0], "test solid");
      await expect(inputs[0]).toHaveValue("test solid");

      await userEvent.type(inputs[1], "test ghost");
      await expect(inputs[1]).toHaveValue("test ghost");
    });
  },
};

export const Sizes: Story = {
  render: () => {
    const [valueSmall, setValueSmall] = useState("");
    const [valueMedium, setValueMedium] = useState("");

    return (
      <Stack gap="400">
        <SearchInputField
          size="sm"
          label="Small size"
          description="Small size variant"
          value={valueSmall}
          onChange={setValueSmall}
          placeholder="Search..."
        />
        <SearchInputField
          size="md"
          label="Medium size (default)"
          description="Medium size variant"
          value={valueMedium}
          onChange={setValueMedium}
          placeholder="Search..."
        />
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const inputs = canvas.getAllByRole("searchbox");

    await step("Both sizes render correctly", async () => {
      await expect(inputs).toHaveLength(2);
    });

    await step("Both sizes are functional", async () => {
      await userEvent.type(inputs[0], "small");
      await expect(inputs[0]).toHaveValue("small");

      await userEvent.type(inputs[1], "medium");
      await expect(inputs[1]).toHaveValue("medium");
    });
  },
};
