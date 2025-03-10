import type { Meta, StoryObj } from "@storybook/react";
import { FormField } from "./form-field";
import { Stack } from "./../stack";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof FormField> = {
  title: "components/FormField",
  component: FormField,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof FormField>;

/**
 * Base story
 * Demonstrates the most basic implementation
 * Uses the args pattern for dynamic control panel inputs
 */
export const Base: Story = {
  args: {
    children: "Demo FormField",
  },
};

/**
 * Showcase Sizes
 */
export const Sizes: Story = {
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {[].map((size) => (
          <FormField key={size} {...args} size={size} />
        ))}
      </Stack>
    );
  },

  args: {
    children: "Demo FormField",
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
          <FormField key={variant} {...args} variant={variant} />
        ))}
      </Stack>
    );
  },

  args: {
    children: "Demo FormField",
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
          <Stack key={colorPalette} direction="row" gap="400" alignItems="center">
            {[].map((variant) => (
              <FormField
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
    children: "Demo FormField",
  },
};