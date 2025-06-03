import type { Meta, StoryObj } from "@storybook/react";

import { ComboBox } from "./combobox";

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

const sectionedItems = [
  {
    name: "Fruits",
    id: "fruit",
    children: [
      { id: 1, name: "Apple" },
      { id: 2, name: "Banana" },
    ],
  },
  {
    name: "Vegetables",
    id: "veg",
    children: [
      { id: 3, name: "Carrot" },
      { id: 4, name: "Broccoli" },
      { id: 5, name: "Avocado" },
    ],
  },
];
/**
 * Base story
 * Demonstrates the most basic implementation
 * Uses the args pattern for dynamic control panel inputs
 */
export const Base: Story = {
  render: () => {
    // console.log(animalId);
    return (
      <>
        <ComboBox.Root
          isDisabled
          aria-label="animals"
          items={sectionedItems}
          selectionMode="multiple"
          placeholder="search..."
          allowsCustomValue
          onSubmitCustomValue={(value) => console.log(value)}
          variant="ghost"
        >
          {(section) => (
            <ComboBox.OptionGroup label={section.name} items={section.children}>
              {(item) => (
                <ComboBox.Option aria-label={item.name}>
                  {item.name}
                </ComboBox.Option>
              )}
            </ComboBox.OptionGroup>
          )}
        </ComboBox.Root>
      </>
    );
  },
};

export const SimpleOptions: Story = {
  render: () => {
    return (
      <ComboBox.Root isDisabled aria-label="animals" defaultItems={options}>
        <ComboBox.Option>Koala</ComboBox.Option>
        <ComboBox.Option>Kangaroo</ComboBox.Option>
        <ComboBox.Option>Panda</ComboBox.Option>
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
