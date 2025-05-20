import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./switch";
import { Stack, Box } from "@commercetools/nimbus";
import type { SwitchProps } from "./switch.types";

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    children: "Switch Label",
  },
};

export const Small: Story = {
  args: {
    size: "sm" as SwitchProps["size"],
    children: "Small Switch",
  },
};

export const Medium: Story = {
  args: {
    size: "md" as SwitchProps["size"],
    children: "Medium Switch",
  },
};

export const Selected: Story = {
  args: {
    isSelected: true,
    children: "Selected Switch",
  },
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
    children: "Disabled Switch",
  },
};

export const Invalid: Story = {
  args: {
    isInvalid: true,
    children: "Invalid Switch",
  },
};

export const Sizes: Story = {
  args: {
    children: "Switch Label",
  } as SwitchProps,
  render: (args) => (
    <Stack>
      <Box>
        <Switch size="sm" {...args} />
      </Box>
      <Box>
        <Switch size="md" {...args} />
      </Box>
    </Stack>
  ),
};

export const WithDefaultSelected: Story = {
  args: {
    defaultSelected: true,
    children: "Default Selected Switch",
  } as SwitchProps,
};
