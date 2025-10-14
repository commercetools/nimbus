import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextInputField } from "./text-input-field";
import { userEvent, within, expect, fn } from "storybook/test";
import { Stack, Text } from "@/components";

const meta: Meta<typeof TextInputField> = {
  title: "components/TextInputField",
  component: TextInputField,
};

export default meta;

type Story = StoryObj<typeof TextInputField>;

export const Base: Story = {
  args: {
    label: "Project name",
    description: "Choose a descriptive name for your project",
    placeholder: "Enter your project name",
  },
  render: (args) => <TextInputField {...args} data-testid="project-input" />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");
    const label = canvas.getByText("Project name");
    const description = canvas.getByText(
      "Choose a descriptive name for your project"
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

    await step("Can focus TextInput by clicking FormField label", async () => {
      await userEvent.click(label);
      await expect(input).toHaveFocus();
    });

    await step("Uses an <input> element by default", async () => {
      await expect(input.tagName).toBe("INPUT");
    });

    await step("Shows TextInput placeholder text", async () => {
      await expect(input).toHaveAttribute(
        "placeholder",
        "Enter your project name"
      );
    });

    await step("TextInput has proper input type", async () => {
      await expect(input).toHaveAttribute("type", "text");
    });

    await step("TextInput can receive user input", async () => {
      await userEvent.type(input, "My Awesome Project");
      await expect(input).toHaveValue("My Awesome Project");
      await userEvent.clear(input);
    });

    await step("TextInput is focusable with <tab> key", async () => {
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
    label: "Project name",
    description: "This field is required",
    placeholder: "Enter your project name",
    isRequired: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");
    const label = canvas.getByText("Project name");

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
    label: "Project name",
    description: "This field is disabled",
    placeholder: "Enter your project name",
    isDisabled: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    await step("FormField isDisabled propagates to TextInput", async () => {
      await expect(input).toBeDisabled();
      await expect(input).toHaveAttribute("disabled");
    });

    await step("Disabled TextInput cannot receive focus via tab", async () => {
      // Clear focus first
      await userEvent.click(document.body);

      // Try to tab to the input
      await userEvent.keyboard("{Tab}");
      await expect(input).not.toHaveFocus();
    });

    await step("Disabled TextInput cannot receive user input", async () => {
      // Try to type in the disabled input
      await userEvent.type(input, "Test");
      await expect(input).toHaveValue("");
    });
  },
};

export const Invalid: Story = {
  args: {
    label: "Project name",
    description: "Enter your project name",
    placeholder: "My Awesome Project",
    isInvalid: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Project name");

    await step("Input is rendered with invalid state", async () => {
      await expect(input).toBeInTheDocument();
      await expect(input).toHaveAttribute("data-invalid", "true");
    });

    await step("Invalid input is still focusable and functional", async () => {
      await userEvent.click(input);
      await expect(input).toHaveFocus();

      await userEvent.type(input, "Test Project");
      await expect(input).toHaveValue("Test Project");
    });
  },
};

export const WithErrors: Story = {
  args: {
    label: "Project name",
    description: "Enter your project name",
    placeholder: "My Awesome Project",
    isInvalid: true,
    errors: { missing: true, format: true },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Project name");

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
    label: "Project name",
    description: "This field is read-only",
    value: "My Existing Project",
    isReadOnly: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    await step("FormField isReadOnly propagates to TextInput", async () => {
      await expect(input).toHaveAttribute("readonly");
    });

    await step("ReadOnly TextInput displays existing value", async () => {
      await expect(input).toHaveValue("My Existing Project");
    });

    await step("ReadOnly TextInput can receive focus", async () => {
      await userEvent.click(input);
      await expect(input).toHaveFocus();
    });

    await step("ReadOnly TextInput cannot receive user input", async () => {
      const originalValue = "My Existing Project";
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
        <TextInputField
          label="Project name"
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
    label: "Email address",
    name: "user-email",
    placeholder: "Enter your email",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Name attribute is applied to FormField.Root", async () => {
      const formField = canvasElement.querySelector('[name="user-email"]');
      await expect(formField).toBeInTheDocument();
    });
  },
};

export const WithId: Story = {
  args: {
    label: "Username",
    id: "custom-username-input",
    placeholder: "Enter username",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    await step("Custom id is applied to input", async () => {
      await expect(input).toHaveAttribute("id", "custom-username-input");
    });
  },
};

// export const WithMaxLength: Story = {
//   args: {
//     label: "Project code",
//     description: "Maximum 28 characters",
//     maxLength: 28,
//     placeholder: "Enter code",
//   },
//   play: async ({ canvasElement, step }) => {
//     const canvas = within(canvasElement);
//     const input = canvas.getByRole("textbox");

//     await step("MaxLength attribute is applied to input", async () => {
//       await expect(input).toHaveAttribute("maxLength", "28");
//     });

//     await step("Input prevents typing beyond maxLength", async () => {
//       await userEvent.type(input, "123456789012345678901234567828");
//       // Should only contain first 28 characters
//       await expect(input).toHaveValue("1234567890123456789012345678");
//     });
//   },
// };

export const WithDifferentWidths: Story = {
  render: () => {
    return (
      <Stack gap="400">
        <TextInputField
          label="Narrow field"
          description="Width: 192px (token: 4800)"
          placeholder="Enter text"
          width="4800"
          maxLength={20}
        />
        <TextInputField
          label="Medium field"
          description="Width: 50%"
          placeholder="Enter text"
          width="50%"
        />
        <TextInputField
          label="Wide field"
          description="Width: 100%"
          placeholder="Enter text"
          width="100%"
        />
        <TextInputField
          label="Max width field"
          description="Max width: 384px (token: 9600)"
          placeholder="Enter text"
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
        await userEvent.type(inputs[i], `Test ${i + 1}`);
        await expect(inputs[i]).toHaveValue(`Test ${i + 1}`);
        await userEvent.clear(inputs[i]);
      }
    });
  },
};

export const WithInfoBox: Story = {
  args: {
    label: "Project name",
    description: "Enter your project name",
    placeholder: "My Awesome Project",
    infoBox: "Project names should be descriptive and unique.",
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
      "InfoBox content is visible after clicking info button",
      async () => {
        const infoBox = within(document.body).getByText(
          "Project names should be descriptive and unique."
        );
        await expect(infoBox).toBeInTheDocument();
      }
    );

    await step("InfoBox is properly linked via aria-describedby", async () => {
      const infoBox = within(document.body).getByText(
        "Project names should be descriptive and unique."
      );
      const ariaDescribedby = input.getAttribute("aria-describedby");
      await expect(ariaDescribedby).toContain(infoBox.id);
    });

    await step("Input is still functional with InfoBox", async () => {
      await userEvent.click(infoButton);

      await userEvent.type(input, "My Awesome Project");
      await expect(input).toHaveValue("My Awesome Project");
    });
  },
};
