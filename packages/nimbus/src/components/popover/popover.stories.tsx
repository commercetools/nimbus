import type { Meta, StoryObj } from "@storybook/react-vite";
import { Popover } from "./popover";
import { Stack } from "./../stack";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof Popover> = {
  title: "components/Popover",
  component: Popover,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof Popover>;

/**
 * Base story
 * Demonstrates the most basic implementation
 * Uses the args pattern for dynamic control panel inputs
 */
export const Base: Story = {
  args: {
    children: "A Demo Popover",
  },
};

export const Basic: Story = {
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        <Popover {...args} >
          {args.children}
        </Popover>
      </Stack>
    );
  },
};
