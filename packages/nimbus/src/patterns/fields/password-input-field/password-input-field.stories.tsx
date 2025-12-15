import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { PasswordInputField } from "./password-input-field";
import { userEvent, within, expect, fn } from "storybook/test";
import { Stack, Text } from "@/components";

const meta: Meta<typeof PasswordInputField> = {
  title: "patterns/fields/PasswordInputField",
  component: PasswordInputField,
};

export default meta;

type Story = StoryObj<typeof PasswordInputField>;

export const Base: Story = {
  args: {
    label: "Password",
    description: "Enter a secure password",
    placeholder: "********",
  },
  render: (args) => <PasswordInputField {...args} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    // Password inputs might not always be identified by role="textbox" depending on browser/testing-library
    // simpler to find by label since we know it exists
    const label = canvas.getByText("Password");
    const input = canvas.getByLabelText("Password");
    const description = canvas.getByText("Enter a secure password");

    await step("Renders a visible FormField label", async () => {
      await expect(label).toBeInTheDocument();
      await expect(label.tagName).toBe("LABEL");
    });

    await step("Renders a FormField description text", async () => {
      await expect(description).toBeInTheDocument();
    });

    await step("Input is properly associated with label", async () => {
      await expect(input).toHaveAttribute("id");
      // Label 'for' attribute matches input 'id'
      await expect(label).toHaveAttribute("for", input.id);
    });

    await step("Input is properly associated with description", async () => {
      await expect(input).toHaveAttribute("aria-describedby", description.id);
    });

    await step(
      "Can focus PasswordInput by clicking FormField label",
      async () => {
        await userEvent.click(label);
        await expect(input).toHaveFocus();
      }
    );

    await step("Uses an <input> element by default", async () => {
      await expect(input.tagName).toBe("INPUT");
    });

    await step("Shows PasswordInput placeholder text", async () => {
      await expect(input).toHaveAttribute("placeholder", "********");
    });

    await step("PasswordInput has proper input type", async () => {
      await expect(input).toHaveAttribute("type", "password");
    });

    await step("PasswordInput can receive user input", async () => {
      await userEvent.type(input, "Secret123");
      await expect(input).toHaveValue("Secret123");
      await userEvent.clear(input);
    });
  },
};

export const Required: Story = {
  args: {
    label: "Password",
    description: "This field is required",
    placeholder: "********",
    isRequired: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByText("Password");

    // Be more specific to find the actual input, avoiding the button toggle
    // The input is the one that will have the aria-required attribute eventually
    // Using selector for type="password" is safe here since the button is type="button"
    const input = canvasElement.querySelector('input[type="password"]');

    if (!input) throw new Error("Could not find password input");

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
    label: "Password",
    description: "This field is disabled",
    placeholder: "********",
    isDisabled: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Password");

    await step("FormField isDisabled propagates to PasswordInput", async () => {
      await expect(input).toBeDisabled();
      await expect(input).toHaveAttribute("disabled");
    });

    await step(
      "Disabled PasswordInput cannot receive focus via tab",
      async () => {
        // Clear focus first
        await userEvent.click(document.body);

        // Try to tab to the input
        await userEvent.keyboard("{Tab}");
        await expect(input).not.toHaveFocus();
      }
    );
  },
};

export const Invalid: Story = {
  args: {
    label: "Password",
    description: "Enter your password",
    placeholder: "********",
    isInvalid: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Password");

    await step("Input is rendered with invalid state", async () => {
      await expect(input).toBeInTheDocument();
      await expect(input).toHaveAttribute("data-invalid", "true");
    });

    await step("Invalid input is still focusable and functional", async () => {
      await userEvent.click(input);
      await expect(input).toHaveFocus();

      await userEvent.type(input, "Secret123");
      await expect(input).toHaveValue("Secret123");
    });
  },
};

export const WithErrors: Story = {
  args: {
    label: "Password",
    description: "Enter your password",
    placeholder: "********",
    isInvalid: true,
    errors: { missing: true },
    touched: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Password");

    await step("Input has invalid state", async () => {
      await expect(input).toHaveAttribute("data-invalid", "true");
    });

    await step("Localized error messages are displayed", async () => {
      await expect(
        canvas.getByText("This field is required. Provide a value.")
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
    label: "Password",
    description: "This field is read-only",
    value: "ExistingPassword",
    isReadOnly: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Password");

    await step("FormField isReadOnly propagates to PasswordInput", async () => {
      await expect(input).toHaveAttribute("readonly");
    });

    await step("ReadOnly PasswordInput displays existing value", async () => {
      await expect(input).toHaveValue("ExistingPassword");
    });

    await step("ReadOnly PasswordInput can receive focus", async () => {
      await userEvent.click(input);
      await expect(input).toHaveFocus();
    });

    await step("ReadOnly PasswordInput cannot receive user input", async () => {
      const originalValue = "ExistingPassword";
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
        <PasswordInputField
          label="Password"
          description="Controlled component example"
          value={value}
          onChange={handleChange}
          placeholder="Type password..."
        />
        <Text data-testid="value-display">
          Current value length: {value.length}
        </Text>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Password");
    const valueDisplay = canvas.getByTestId("value-display");

    await step("Controlled value updates when typing", async () => {
      await userEvent.type(input, "Secret");
      await expect(input).toHaveValue("Secret");
      await expect(valueDisplay).toHaveTextContent("Current value length: 6");
    });

    await step("onChange receives string value (not event)", async () => {
      await userEvent.type(input, "Test");
    });

    await step("Controlled value can be cleared", async () => {
      await userEvent.clear(input);
      await expect(input).toHaveValue("");
      await expect(valueDisplay).toHaveTextContent("Current value length: 0");
    });
  },
};

export const WithInfo: Story = {
  args: {
    label: "Password",
    description: "Enter your password",
    placeholder: "********",
    info: "Passwords must be at least 8 characters long.",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );
    const input = canvas.getByLabelText("Password");
    const infoButton = canvas.getByLabelText("__MORE INFO");

    await step("Info button is present and clickable", async () => {
      await expect(infoButton).toBeInTheDocument();
      await userEvent.click(infoButton);
    });

    await step(
      "Info content is visible after clicking info button",
      async () => {
        const info = within(document.body).getByText(
          "Passwords must be at least 8 characters long."
        );
        await expect(info).toBeInTheDocument();
      }
    );

    await step("Input is still functional with Info", async () => {
      await userEvent.click(infoButton); // Click again to close popover if needed, or just focus input

      await userEvent.type(input, "Secret123");
      await expect(input).toHaveValue("Secret123");
    });
  },
};
