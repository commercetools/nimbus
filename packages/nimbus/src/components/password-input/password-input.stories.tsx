import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { within, expect, userEvent } from "storybook/test";
import { Box, Icon, PasswordInput, Stack, Text } from "@commercetools/nimbus";
import { AddReaction } from "@commercetools/nimbus-icons";

export default {
  title: "Components/PasswordInput",
  component: PasswordInput,
} as Meta<typeof PasswordInput>;

type Story = StoryObj<typeof PasswordInput>;

export const Base: Story = {
  args: {
    ["aria-label"]: "Enter your password",
    placeholder: "Password",
  },
  render: (args) => <PasswordInput {...args} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Enter your password");
    await step("Is focusable with <tab> key", async () => {
      await userEvent.tab();
      await expect(input).toHaveFocus();
    });
    await step("Can toggle visibility with button", async () => {
      const toggleButton = canvas.getByRole("button");
      await userEvent.click(toggleButton);
      await expect(input).toHaveAttribute("type", "text");
      await userEvent.click(toggleButton);
      await expect(input).toHaveAttribute("type", "password");
    });
    await step(
      "Toggle is reachable by tab and operable with Enter/Space",
      async () => {
        const toggleButton = canvas.getByRole("button");
        // Tab from the input to prove the toggle is in the tab order (not force-focused).
        input.focus();
        await userEvent.tab();
        await expect(toggleButton).toHaveFocus();
        await userEvent.keyboard("{enter}");
        await expect(input).toHaveAttribute("type", "text");
        await userEvent.keyboard(" ");
        await expect(input).toHaveAttribute("type", "password");
      }
    );
  },
};

export const WithVariants: Story = {
  args: {
    ["aria-label"]: "Enter your password",
    placeholder: "Password",
  },
  render: (args) => (
    <Stack gap="600">
      <Box>
        <PasswordInput variant="solid" {...args} />
      </Box>
      <Box>
        <PasswordInput variant="ghost" {...args} />
      </Box>
    </Stack>
  ),
};

export const WithSizes: Story = {
  args: {
    ["aria-label"]: "Enter your password",
    placeholder: "Password",
  },
  render: (args) => (
    <Stack gap="600">
      <Box>
        <PasswordInput size="sm" {...args} />
      </Box>
      <Box>
        <PasswordInput size="md" {...args} />
      </Box>
    </Stack>
  ),
};

export const WithLeadingElement: Story = {
  args: {
    ["aria-label"]: "Enter your password",
    placeholder: "Password",
    leadingElement: <Icon as={AddReaction} />,
  },
  render: (args) => (
    <Stack gap="600">
      Sizes
      <Box>
        <PasswordInput size="sm" {...args} />
      </Box>
      <Box>
        <PasswordInput size="md" {...args} />
      </Box>
      Variants
      <Box>
        <PasswordInput variant="solid" {...args} />
      </Box>
      <Box>
        <PasswordInput variant="ghost" {...args} />
      </Box>
    </Stack>
  ),
};

export const Disabled: Story = {
  args: {
    ["aria-label"]: "Enter your password",
    placeholder: "Password",
    isDisabled: true,
  },
  render: (args) => <PasswordInput {...args} />,
};

export const Required: Story = {
  args: {
    isRequired: true,
    placeholder: "Required password",
    ["aria-label"]: "Required password",
  },
  render: (args) => <PasswordInput {...args} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Required password");
    await step("Has aria-required attribute", async () => {
      await expect(input).toHaveAttribute("aria-required", "true");
    });
  },
};

export const Invalid: Story = {
  args: {
    isInvalid: true,
    placeholder: "Invalid password",
    ["aria-label"]: "Invalid password",
  },
  render: (args) => <PasswordInput {...args} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Invalid password");
    await step("Has invalid state", async () => {
      await expect(input).toHaveAttribute("data-invalid", "true");
    });
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <Stack gap="400">
        <PasswordInput
          value={value}
          onChange={setValue}
          placeholder="Controlled password"
          aria-label="Controlled password"
        />
        <Text data-testid="value-display">Current value: {value}</Text>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Controlled password");
    const valueDisplay = canvas.getByTestId("value-display");
    await step("Updates controlled value", async () => {
      await userEvent.type(input, "Secret");
      await expect(input).toHaveValue("Secret");
      await expect(valueDisplay).toHaveTextContent("Current value: Secret");
    });
    await step("Clears controlled value", async () => {
      await userEvent.clear(input);
      await expect(input).toHaveValue("");
      await expect(valueDisplay).toHaveTextContent("Current value:");
    });
  },
};

/**
 * Thin wrapper over TextInput, so it snapshots only what it adds: the masked
 * value + visibility toggle, at both sizes (the toggle tracks input size). Chrome
 * is TextInput's coverage; variant isn't an axis. Revealed state is `Revealed`.
 */
export const SmokeTest: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack gap="600" align="flex-start">
      {(["sm", "md"] as const).map((size) => (
        <PasswordInput
          key={size}
          size={size}
          defaultValue="hunter2"
          aria-label={`password ${size}`}
        />
      ))}
    </Stack>
  ),
};

/**
 * Revealed state (plaintext + hide icon). The play blurs after toggling so the
 * toggle's focus ring (IconButton's coverage) stays out of the frame.
 */
export const Revealed: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <PasswordInput defaultValue="hunter2" aria-label="revealed password" />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("revealed password");
    const toggleButton = canvas.getByRole("button");

    await userEvent.click(toggleButton);
    await expect(input).toHaveAttribute("type", "text");

    await userEvent.click(document.body);
  },
};
