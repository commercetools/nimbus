import type { Meta, StoryObj } from "@storybook/react";
import { LoadingSpinner } from "./loading-spinner";
import { Stack } from "./../stack";

const meta: Meta<typeof LoadingSpinner> = {
  title: "components/LoadingSpinner",
  component: LoadingSpinner,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof LoadingSpinner>;

/**
 * Base story
 * Demonstrates the most basic implementation
 * Uses the args pattern for dynamic control panel inputs
 */
export const Base: Story = {
  args: {},
};

/**
 * Showcase Sizes
 */
export const Sizes: Story = {
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {["2xs", "xs", "sm", "md", "lg"].map((size) => (
          <LoadingSpinner key={size} {...args} size={size} />
        ))}
      </Stack>
    );
  },

  args: {},
};

/**
 * Showcase Tones
 */
export const Tones: Story = {
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {["primary", "white"].map((tone) => (
          <LoadingSpinner key={tone} {...args} tone={tone} />
        ))}
      </Stack>
    );
  },

  args: {},
};

/**
 * Smoke Test
 */
export const SmokeTest: Story = {
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {["primary", "white"].map((tone) => (
          <LoadingSpinner key={tone} {...args} tone={tone} />
        ))}
      </Stack>
    );
  },

  args: {},
};
