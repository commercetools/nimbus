import type { Meta, StoryObj } from "@storybook/react";
import { TimeInput } from "./time-input";
import { Stack } from "./../stack";
import { TextInput } from "../text-input";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof TimeInput> = {
  title: "components/TimeInput",
  component: TimeInput,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof TimeInput>;

/**
 * Base story
 * Demonstrates the most basic implementation
 * Uses the args pattern for dynamic control panel inputs
 */
export const Base: Story = {
  args: {
    children: "Demo TimeInput",
  },
};

/**
 * Showcase Sizes
 */
export const Sizes: Story = {
  render: (args) => {
    return (
      <Stack direction="column">
        {["sm", "md"].map((size) => (
          <>
            <TimeInput key={size} {...args} size={size as "sm" | "md"} />
            <TextInput size={size as "sm" | "md"} />
          </>
        ))}
      </Stack>
    );
  },

  args: {
    children: "Demo TimeInput",
  },
};

/**
 * Showcase Variants
 */
export const Variants: Story = {
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {[].map((variant) => (
          <TimeInput key={variant} {...args} variant={variant} />
        ))}
      </Stack>
    );
  },

  args: {
    children: "Demo TimeInput",
  },
};

/**
 * Showcase Colors
 */
export const Colors: Story = {
  render: (args) => {
    return (
      <Stack>
        {[].map((colorPalette) => (
          <Stack
            key={colorPalette}
            direction="row"
            gap="400"
            alignItems="center"
          >
            {[].map((variant) => (
              <TimeInput
                key={variant}
                {...args}
                variant={variant}
                colorPalette={colorPalette}
              />
            ))}
          </Stack>
        ))}
      </Stack>
    );
  },

  args: {
    children: "Demo TimeInput",
  },
};
