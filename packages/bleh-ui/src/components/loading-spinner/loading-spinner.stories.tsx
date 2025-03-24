import type { Meta, StoryObj } from "@storybook/react";
import { LoadingSpinner } from "./loading-spinner";
import { Stack } from "./../stack";
import type { LoadingSpinnerProps } from "./loading-spinner.types";

const sizes: LoadingSpinnerProps["size"][] = ["lg", "md", "sm", "xs", "2xs"];

const tones: LoadingSpinnerProps["tone"][] = ["primary", "white"];

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

export const Base: Story = {
  args: {},
};

export const Sizes: Story = {
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {sizes.map((size) => (
          <LoadingSpinner key={size as string} {...args} size={size} />
        ))}
      </Stack>
    );
  },

  args: {},
};

/**
 * One tone for a light background and one for a dark background
 */
export const Tones: Story = {
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {tones.map((tone) => (
          <LoadingSpinner key={tone as string} {...args} tone={tone} />
        ))}
      </Stack>
    );
  },

  args: {},
  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
};
