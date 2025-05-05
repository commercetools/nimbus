import type { Meta, StoryObj } from "@storybook/react";
import { useListData } from "react-stately";
import { TagGroup } from "./tag-group";
import { Stack } from "./../stack";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof TagGroup.Root> = {
  title: "components/TagGroup",
  component: TagGroup.Root,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof TagGroup.Root>;

/**
 * Base story
 * Demonstrates the most basic implementation
 * Uses the args pattern for dynamic control panel inputs
 */
export const Base: Story = {
  args: {
    children: "Demo TagGroup",
  },
};

const animalOptions = [
  { id: 1, name: "Koala" },
  { id: 2, name: "Kangaroo" },
  { id: 3, name: "Platypus" },
  { id: 4, name: "Bald Eagle" },
  { id: 5, name: "Bison" },
  { id: 6, name: "Skunk" },
];
/**
 * Showcase Sizes
 */
export const Sizes: Story = {
  render: (args) => {
    const animalList = useListData({ initialItems: animalOptions });
    return (
      <TagGroup.Root aria-label="animals">
        <TagGroup.TagList items={animalList.items}>
          {(item) => <TagGroup.Tag>{item.name}</TagGroup.Tag>}
        </TagGroup.TagList>
      </TagGroup.Root>
    );
  },

  args: {
    children: "Demo TagGroup",
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
          <TagGroup key={variant} {...args} variant={variant} />
        ))}
      </Stack>
    );
  },

  args: {
    children: "Demo TagGroup",
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
              <TagGroup
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
    children: "Demo TagGroup",
  },
};
