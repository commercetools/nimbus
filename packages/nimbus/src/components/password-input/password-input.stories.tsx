import type { Meta, StoryObj } from "@storybook/react";
import { Box, Stack } from "@/components";
import { PasswordInput } from "./password-input";

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
};

export const WithVariants: Story = {
  render: (args) => (
    <Stack gap="600">
      <Box>
        <PasswordInput id="password1" variant="solid" {...args} />
      </Box>
      <Box>
        <PasswordInput id="password2" variant="ghost" {...args} />
      </Box>
    </Stack>
  ),
};

export const WithSizes: Story = {
  render: (args) => (
    <Stack gap="600">
      <Box>
        <PasswordInput id="password-sm" size="sm" {...args} />
      </Box>
      <Box>
        <PasswordInput id="password-md" size="md" {...args} />
      </Box>
    </Stack>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Box maxWidth="500px">
      <label htmlFor="password">Password (Disabled)</label>
      <PasswordInput
        id="password"
        isDisabled
        value="DisabledPassword123"
        {...args}
      />
    </Box>
  ),
};
