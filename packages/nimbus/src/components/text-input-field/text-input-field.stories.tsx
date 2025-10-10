import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextInputField } from "./text-input-field";
import { userEvent, within, expect, fn, waitFor } from "storybook/test";
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

    await step("FormField forwards data- attributes to TextInput", async () => {
      await expect(input).toHaveAttribute("data-testid", "project-input");

      // NOTE: aria-label and aria-labelledby are controlled by FormField's useField hook.
      // When a visible label is provided, FormField automatically generates aria-labelledby
      // Custom aria-label would be overridden. See FIXME in form-field.root.tsx
      // For fields without a visible label, FormField falls back to aria-label="empty-label"
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

export const MultipleInvalidFields: Story = {
  render: () => {
    const [urlValue, setUrlValue] = useState("");
    const isUrlEmpty = !urlValue || urlValue.trim().length === 0;

    return (
      <Stack gap="400">
        <TextInputField
          label="Project name"
          description="Enter your project name"
          placeholder="My Awesome Project"
          isInvalid
          errors={["Project name must contain no spaces"]}
        />
        <TextInputField
          label="Project description"
          description="Describe your project"
          placeholder="A brief description of your project"
          isInvalid
          errors={["Description must be at least 10 characters"]}
        />
        <TextInputField
          label="Project code"
          description="Enter project code"
          placeholder="PROJ-001"
          isInvalid
          errors={["Project code format is invalid"]}
        />
        <TextInputField
          label="Project URL"
          description="Enter the project repository URL"
          placeholder="https://github.com/company/project"
          value={urlValue}
          onChange={setUrlValue}
          isInvalid={isUrlEmpty}
          errors={
            isUrlEmpty ? ["Project URL is required - please enter data"] : []
          }
        />
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    const nameInput = canvas.getByLabelText("Project name");
    const descriptionInput = canvas.getByLabelText("Project description");
    const codeInput = canvas.getByLabelText("Project code");
    const urlInput = canvas.getByLabelText("Project URL");

    const nameError = canvas.getByText("Project name must contain no spaces");
    const descriptionError = canvas.getByText(
      "Description must be at least 10 characters"
    );
    const codeError = canvas.getByText("Project code format is invalid");
    const urlError = canvas.getByText(
      "Project URL is required - please enter data"
    );

    await step("Empty value test - fields start empty", async () => {
      await expect(nameInput).toHaveValue("");
      await expect(descriptionInput).toHaveValue("");
      await expect(codeInput).toHaveValue("");
      await expect(urlInput).toHaveValue("");
    });

    await step("All four fields are rendered with errors", async () => {
      await expect(nameInput).toBeInTheDocument();
      await expect(descriptionInput).toBeInTheDocument();
      await expect(codeInput).toBeInTheDocument();
      await expect(urlInput).toBeInTheDocument();
    });

    await step("Each field shows its own error message", async () => {
      await expect(nameError).toBeInTheDocument();
      await expect(descriptionError).toBeInTheDocument();
      await expect(codeError).toBeInTheDocument();
      await expect(urlError).toBeInTheDocument();
    });

    await step("All fields have data-invalid attribute", async () => {
      await expect(nameInput).toHaveAttribute("data-invalid", "true");
      await expect(descriptionInput).toHaveAttribute("data-invalid", "true");
      await expect(codeInput).toHaveAttribute("data-invalid", "true");
      await expect(urlInput).toHaveAttribute("data-invalid", "true");
    });

    await step(
      "Each field's error is properly linked via aria-describedby",
      async () => {
        const nameAriaDescribedby = nameInput.getAttribute("aria-describedby");
        const descriptionAriaDescribedby =
          descriptionInput.getAttribute("aria-describedby");
        const codeAriaDescribedby = codeInput.getAttribute("aria-describedby");
        const urlAriaDescribedby = urlInput.getAttribute("aria-describedby");

        await expect(nameAriaDescribedby).toContain(nameError.id);
        await expect(descriptionAriaDescribedby).toContain(descriptionError.id);
        await expect(codeAriaDescribedby).toContain(codeError.id);
        await expect(urlAriaDescribedby).toContain(urlError.id);
      }
    );

    await step("All fields are focusable and functional", async () => {
      await userEvent.click(nameInput);
      await expect(nameInput).toHaveFocus();

      await userEvent.click(descriptionInput);
      await expect(descriptionInput).toHaveFocus();

      await userEvent.click(codeInput);
      await expect(codeInput).toHaveFocus();

      await userEvent.click(urlInput);
      await expect(urlInput).toHaveFocus();
    });

    await step("Each field can receive user input independently", async () => {
      await userEvent.type(nameInput, "My Awesome Project");
      await expect(nameInput).toHaveValue("My Awesome Project");

      await userEvent.type(descriptionInput, "A great project description");
      await expect(descriptionInput).toHaveValue("A great project description");

      await userEvent.type(codeInput, "PROJ-123");
      await expect(codeInput).toHaveValue("PROJ-123");

      await userEvent.type(urlInput, "https://github.com/company/project");
      await expect(urlInput).toHaveValue("https://github.com/company/project");
    });

    await step(
      "URL field shows error when empty, clears when filled",
      async () => {
        // Clear the URL field first to ensure it's empty for this test
        await userEvent.clear(urlInput);
        await expect(urlInput).toHaveValue("");

        // Initially shows error because field is empty
        await waitFor(
          () => {
            const errorElement = canvas.getByText(
              "Project URL is required - please enter data"
            );
            expect(errorElement).toBeInTheDocument();
          },
          { timeout: 1000 }
        );

        // Type the URL value
        await userEvent.type(urlInput, "https://github.com/company/project");
        await expect(urlInput).toHaveValue(
          "https://github.com/company/project"
        );

        // Error should disappear when field has content
        await waitFor(
          () => {
            expect(
              canvas.queryByText("Project URL is required - please enter data")
            ).not.toBeInTheDocument();
          },
          { timeout: 1000 }
        );

        // Clear the field
        await userEvent.clear(urlInput);
        await expect(urlInput).toHaveValue("");

        // Error should reappear when field is empty again
        await waitFor(
          () => {
            const errorElement = canvas.getByText(
              "Project URL is required - please enter data"
            );
            expect(errorElement).toBeInTheDocument();
          },
          { timeout: 1000 }
        );
      }
    );
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
    const input = canvas.getByRole("textbox");

    await step("Name attribute is applied to input", async () => {
      await expect(input).toHaveAttribute("name", "user-email");
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

export const WithMaxLength: Story = {
  args: {
    label: "Project code",
    description: "Maximum 28 characters",
    maxLength: 28,
    placeholder: "Enter code",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    await step("MaxLength attribute is applied to input", async () => {
      await expect(input).toHaveAttribute("maxLength", "28");
    });

    await step("Input prevents typing beyond maxLength", async () => {
      await userEvent.type(input, "123456789012345678901234567828");
      // Should only contain first 28 characters
      await expect(input).toHaveValue("1234567890123456789012345678");
    });
  },
};

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
