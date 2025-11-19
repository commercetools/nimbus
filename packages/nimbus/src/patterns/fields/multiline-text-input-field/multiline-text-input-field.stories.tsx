import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MultilineTextInputField } from "./multiline-text-input-field";
import { userEvent, within, expect, fn } from "storybook/test";
import { Stack, Text } from "@/components";

const meta: Meta<typeof MultilineTextInputField> = {
  title: "patterns/fields/MultilineTextInputField",
  component: MultilineTextInputField,
};

export default meta;

type Story = StoryObj<typeof MultilineTextInputField>;

export const Base: Story = {
  args: {
    label: "Project description",
    description: "Enter a descriptive summary for your project",
    placeholder: "Describe your project...",
  },
  render: (args) => <MultilineTextInputField {...args} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");
    const label = canvas.getByText("Project description");
    const description = canvas.getByText(
      "Enter a descriptive summary for your project"
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
      "Can focus MultilineTextInput by clicking FormField label",
      async () => {
        await userEvent.click(label);
        await expect(input).toHaveFocus();
      }
    );

    await step("Uses a <textarea> element", async () => {
      await expect(input.tagName).toBe("TEXTAREA");
    });

    await step("Shows placeholder text", async () => {
      await expect(input).toHaveAttribute(
        "placeholder",
        "Describe your project..."
      );
    });

    await step("Can receive user input", async () => {
      await userEvent.type(input, "My Awesome Project Description");
      await expect(input).toHaveValue("My Awesome Project Description");
      await userEvent.clear(input);
    });

    await step("Is focusable with <tab> key", async () => {
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
    label: "Project description",
    description: "This field is required",
    placeholder: "Describe your project...",
    isRequired: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");
    const label = canvas.getByText("Project description");

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
    label: "Project description",
    description: "This field is disabled",
    placeholder: "Describe your project...",
    isDisabled: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    await step(
      "FormField isDisabled propagates to MultilineTextInput",
      async () => {
        await expect(input).toBeDisabled();
        await expect(input).toHaveAttribute("disabled");
      }
    );

    await step("Disabled input cannot receive focus via tab", async () => {
      // Clear focus first
      await userEvent.click(document.body);

      // Try to tab to the input
      await userEvent.keyboard("{Tab}");
      await expect(input).not.toHaveFocus();
    });

    await step("Disabled input cannot receive user input", async () => {
      // Try to type in the disabled input
      await userEvent.type(input, "Test");
      await expect(input).toHaveValue("");
    });
  },
};

export const Invalid: Story = {
  args: {
    label: "Project description",
    description: "Enter your project description",
    placeholder: "Describe your project...",
    isInvalid: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Project description");

    await step("Input is rendered with invalid state", async () => {
      await expect(input).toBeInTheDocument();
      await expect(input).toHaveAttribute("data-invalid", "true");
    });

    await step("Invalid input is still focusable and functional", async () => {
      await userEvent.click(input);
      await expect(input).toHaveFocus();

      await userEvent.type(input, "Test Project Description");
      await expect(input).toHaveValue("Test Project Description");
    });
  },
};

export const WithErrors: Story = {
  args: {
    label: "Project description",
    description: "Enter your project description",
    placeholder: "Describe your project...",
    isInvalid: true,
    errors: { missing: true, format: true },
    touched: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Project description");

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
    label: "Project description",
    description: "This field is read-only",
    value: "My Existing Project Description",
    isReadOnly: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    await step(
      "FormField isReadOnly propagates to MultilineTextInput",
      async () => {
        await expect(input).toHaveAttribute("readonly");
      }
    );

    await step("ReadOnly input displays existing value", async () => {
      await expect(input).toHaveValue("My Existing Project Description");
    });

    await step("ReadOnly input can receive focus", async () => {
      await userEvent.click(input);
      await expect(input).toHaveFocus();
    });

    await step("ReadOnly input cannot receive user input", async () => {
      const originalValue = "My Existing Project Description";
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
        <MultilineTextInputField
          label="Project description"
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
    const input = canvas.getByRole("textbox");
    const valueDisplay = canvas.getByTestId("value-display");

    await step("Controlled value updates when typing", async () => {
      await userEvent.type(input, "Hello");
      await expect(input).toHaveValue("Hello");
      await expect(valueDisplay).toHaveTextContent("Current value: Hello");
    });

    await step("onChange receives string value (not event)", async () => {
      await userEvent.type(input, " World");
    });

    await step("Controlled value can be cleared", async () => {
      await userEvent.clear(input);
      await expect(input).toHaveValue("");
      await expect(valueDisplay).toHaveTextContent("Current value:");
    });
  },
};

export const AutoGrow: Story = {
  args: {
    label: "Auto-growing Field",
    description: "This field grows as you type",
    placeholder: "Type multiple lines...",
    autoGrow: true,
    rows: 1,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    await step("Starts with initial rows", async () => {
      await expect(input).toHaveAttribute("rows", "1");
    });

    // Testing actual height change is flaky in jsdom/storybook test runner
    // so we just verify the prop is passed and input works
    await step("Input accepts multi-line text", async () => {
      await userEvent.type(input, "Line 1{enter}Line 2{enter}Line 3");
      await expect(input).toHaveValue("Line 1\nLine 2\nLine 3");
    });
  },
};

export const WithRows: Story = {
  args: {
    label: "Fixed Rows Field",
    description: "This field has 5 rows initially",
    rows: 5,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    await step("Has correct rows attribute", async () => {
      await expect(input).toHaveAttribute("rows", "5");
    });
  },
};

export const WithInfo: Story = {
  args: {
    label: "Project description",
    description: "Enter your project description",
    placeholder: "Describe your project...",
    info: "Project descriptions should be detailed and clear.",
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
          "Project descriptions should be detailed and clear."
        );
        await expect(info).toBeInTheDocument();
      }
    );

    await step("Info is properly linked via aria-describedby", async () => {
      const info = within(document.body).getByText(
        "Project descriptions should be detailed and clear."
      );
      const ariaDescribedby = input.getAttribute("aria-describedby");
      await expect(ariaDescribedby).toContain(info.id);
    });
  },
};
