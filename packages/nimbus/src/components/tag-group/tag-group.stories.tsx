import type { Meta, StoryObj } from "@storybook/react";
import { useListData } from "react-stately";
import { TagGroup } from "./tag-group";

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

const animalOptions = [
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
  args: {},
  render: () => {
    const animalList = useListData({
      initialItems: animalOptions,
    });
    return (
      <TagGroup.Root
        aria-label="animals"
        onRemove={(keys) => animalList.remove(...keys)}
      >
        <TagGroup.TagList items={animalList.items}>
          {(item) => <TagGroup.Tag>{item.name}</TagGroup.Tag>}
        </TagGroup.TagList>
      </TagGroup.Root>
    );
  },
};

/**
 * Showcase Sizes
 */
export const Sizes: Story = {
  args: {
    children: "Demo TagGroup",
  },
};
