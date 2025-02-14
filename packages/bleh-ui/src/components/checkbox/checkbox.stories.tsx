import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./checkbox";
import { Stack } from "@/components";

const meta: Meta<typeof Checkbox> = {
  title: "components/Checkbox",
  component: Checkbox,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof Checkbox>;

/**
 * Base story
 * Uncontrolled, demonstrates the most basic implementation.
 *
 */
export const Base: Story = {
  args: {
    children: "Demo Checkbox",
  },

  render: ({ args }) => {
    return (
      <Stack direction="column" alignItems="flex-start">
        <Checkbox {...args}>With Label, uncontrolled</Checkbox>

        <Checkbox isSelected {...args}>
          With Label, controlled, checked
        </Checkbox>

        <Checkbox isIndeterminate {...args}>
          With label, controlled, indeterminate
        </Checkbox>
      </Stack>
    );
  },
};
