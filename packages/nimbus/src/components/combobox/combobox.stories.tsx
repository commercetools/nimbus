import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import type { Key, ComboBoxProps } from "react-aria-components";
import { ComboBox } from "./combobox";
// import { Text, Stack, Box } from "@/components";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof ComboBox.Root> = {
  title: "components/ComboBox",
  component: ComboBox.Root,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof ComboBox.Root>;

const options = [
  { id: 1, name: "Koala" },
  { id: 2, name: "Kangaroo" },
  { id: 3, name: "Platypus" },
  { id: 4, name: "Bald Eagle" },
  { id: 5, name: "Bison" },
  { id: 6, name: "Skunk" },
];
/**
 * Base story
 * Demonstrates the most basic implementation
 * Uses the args pattern for dynamic control panel inputs
 */
export const Base: Story = {
  render: () => {
    return (
      <ComboBox.Root>
        <ComboBox.Option>Chocolate</ComboBox.Option>
        <ComboBox.Option>Mint</ComboBox.Option>
        <ComboBox.Option>Strawberry</ComboBox.Option>
        <ComboBox.Option>Vanilla</ComboBox.Option>
      </ComboBox.Root>
    );
  },
};

// /**
//  * Showcase Sizes
//  */
// export const Sizes: Story = {
//   render: (args) => {
//     return (
//       <Stack direction="row" gap="400" alignItems="center">
//         {[].map((size) => (
//           <ComboBox key={size} {...args} size={size} />
//         ))}
//       </Stack>
//     );
//   },

//   args: {
//     children: "Demo ComboBox",
//   },
// };

// /**
//  * Showcase Variants
//  */
// export const Variants: Story = {
//   render: (args) => {
//     return (
//       <Stack direction="row" gap="400" alignItems="center">
//         {[].map((variant) => (
//           <ComboBox key={variant} {...args} variant={variant} />
//         ))}
//       </Stack>
//     );
//   },

//   args: {
//     children: "Demo ComboBox",
//   },
// };
