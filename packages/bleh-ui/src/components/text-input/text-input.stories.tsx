import type { Meta, StoryObj } from "@storybook/react";
import { TextInput } from "./text-input";
import { Stack } from "./../stack";
import type { TextInputProps } from "./text-input.types";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof TextInput> = {
  title: "components/TextInput",
  component: TextInput,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof TextInput>;

/**
 * Base story
 * Demonstrates the most basic implementation
 * Uses the args pattern for dynamic control panel inputs
 */
const inputVariants: TextInputProps["variant"][] = ["solid", "ghost"];
const inputSize: TextInputProps["size"][] = ["md", "sm"];

export const Base: Story = {
  args: {
    placeholder: "text input",
  },
};

/**
 * Showcase Sizes
 */
export const Sizes: Story = {
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {inputSize.map((size) => (
          <TextInput key={size as string} {...args} size={size} />
        ))}
      </Stack>
    );
  },
  args: {
    placeholder: "text input",
  },
};

// /**
//  * Showcase Variants
//  */
export const Variants: Story = {
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {inputVariants.map((variant) => (
          <TextInput
            key={variant as string}
            {...args}
            variant={variant}
            placeholder={variant as string}
          />
        ))}
      </Stack>
    );
  },
  args: {
    placeholder: "text input",
  },
};

// /**
//  * Showcase Disabled
//  */
export const Disabled: Story = {
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {inputVariants.map((variant) => (
          <TextInput
            key={variant as string}
            {...args}
            variant={variant}
            placeholder={variant as string}
          />
        ))}
      </Stack>
    );
  },
  args: {
    disabled: true,
  },
};

// /**
//  * Showcase Invalid
//  */
export const Invalid: Story = {
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {inputVariants.map((variant) => (
          <TextInput
            key={variant as string}
            {...args}
            variant={variant}
            placeholder={variant as string}
          />
        ))}
      </Stack>
    );
  },
  args: {},
};
