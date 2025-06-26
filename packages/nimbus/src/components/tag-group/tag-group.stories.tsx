import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, fn } from "storybook/test";
import { useListData } from "react-stately";
import type { Selection as RsSelection } from "react-stately";
import { Stack, Text } from "@/components";
import type { TagGroupProps } from "./tag-group.types";
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
  { id: "koala", name: "Koala" },
  { id: "kangaroo", name: "Kangaroo" },
  { id: "platypus", name: "Platypus" },
  { id: "baldEagle", name: "Bald Eagle" },
  { id: "bison", name: "Bison" },
  { id: "skunk", name: "Skunk" },
];

const sizes: TagGroupProps["size"][] = ["lg", "md", "sm"];

/**
 * Base story
 * Demonstrates the most basic implementation
 * Uses the args pattern for dynamic control panel inputs
 */
export const Base: Story = {
  args: {},
  render: () => (
    <TagGroup.Root aria-label="animals">
      <TagGroup.TagList items={animalOptions}>
        {(item) => <TagGroup.Tag>{item.name}</TagGroup.Tag>}
      </TagGroup.TagList>
    </TagGroup.Root>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const tagList = canvas.getByRole("grid");
    const tags = within(tagList).getAllByRole("row");
    const [koala, kangaroo, platypus, baldEagle, bison, skunk] = tags;

    await step("on render", async () => {
      await expect(tagList).toBeInTheDocument();
      await expect(tags).toHaveLength(6);
    });

    await step(
      "Keyboard Navigation - Tab enters group, arrows move between tags",
      async () => {
        await userEvent.tab();
        expect(koala).toHaveFocus();
        await userEvent.keyboard("{ArrowRight}");
        expect(kangaroo).toHaveFocus();
        await userEvent.keyboard("{ArrowRight}");
        expect(platypus).toHaveFocus();
        await userEvent.keyboard("{ArrowRight}");
        expect(baldEagle).toHaveFocus();
        await userEvent.keyboard("{ArrowRight}");
        expect(bison).toHaveFocus();
        await userEvent.keyboard("{ArrowRight}");
        expect(skunk).toHaveFocus();
        // make sure focus wraps
        await userEvent.keyboard("{ArrowRight}");
        expect(koala).toHaveFocus();
        await userEvent.keyboard("{ArrowLeft}");
        expect(skunk).toHaveFocus();
        await userEvent.tab();
        // tab removes focus from tabs
        expect(skunk).not.toHaveFocus();
      }
    );
  },
};

export const TagRemoval: Story = {
  args: {
    onRemove: fn((keys) => {
      return keys;
    }),
  },
  render: ({ onRemove }) => {
    const animalList = useListData({ initialItems: animalOptions });
    return (
      <TagGroup.Root
        aria-label="removable animals"
        selectionMode="none"
        onRemove={(keys) => {
          onRemove && onRemove(keys);
          animalList.remove(...keys);
        }}
      >
        <TagGroup.TagList items={animalList.items}>
          {(item) => <TagGroup.Tag>{item.name}</TagGroup.Tag>}
        </TagGroup.TagList>
      </TagGroup.Root>
    );
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const tagList = canvas.getByRole("grid");
    const tags = within(tagList).getAllByRole("row");
    const [koala, kangaroo, platypus, baldEagle, bison, skunk] = tags;
    await step("Tags - keyboard removal", async () => {
      await userEvent.tab();
      expect(koala).toHaveFocus();
      await userEvent.keyboard("{backspace}");
      expect(koala).not.toBeInTheDocument();
    });

    await step("Tags - mouse removal", async () => {
      const removeKangarooButton = within(kangaroo).getByLabelText("Remove");
      await userEvent.click(removeKangarooButton);
      expect(args.onRemove).toHaveBeenCalled();
      expect(kangaroo).not.toBeInTheDocument();
    });
  },
};

export const SingleSelection: Story = {
  args: {},
  render: () => {
    const [selected, setSelected] = useState<RsSelection>(new Set([]));
    return (
      <>
        <TagGroup.Root
          aria-label="select an animal"
          selectionMode="single"
          selectedKeys={selected}
          onSelectionChange={setSelected}
        >
          <TagGroup.TagList items={animalOptions}>
            {(item) => <TagGroup.Tag>{item.name}</TagGroup.Tag>}
          </TagGroup.TagList>
        </TagGroup.Root>
        <Text as="p">Current selection: {[...selected].join(" ")}</Text>
      </>
    );
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const tagList = canvas.getByRole("grid");
    const tags = within(tagList).getAllByRole("row");
    const [koala, kangaroo, platypus, baldEagle, bison, skunk] = tags;

    await step("Tags - keyboard selection", async () => {
      await userEvent.tab();
      expect(koala).toHaveFocus();
      await userEvent.keyboard("{enter}");
      await canvas.queryByText("Current selection: koala");
      await userEvent.keyboard("{ArrowRight}");
      await userEvent.keyboard("{enter}");
      //selecting another tag deselects the current selection
      await canvas.queryByText("Current selection: kangaroo");
    });

    await step("Tags - mouse selection", async () => {
      await userEvent.click(koala);
      await userEvent.click(tagList);
      await canvas.queryByText("Current selection: koala");
      await userEvent.click(kangaroo);
      //selecting another tag deselects the current selection
      await canvas.queryByText("Current selection: kangaroo");
    });
  },
};

export const MultipleSelection: Story = {
  args: {},
  render: () => {
    const [selected, setSelected] = useState<RsSelection>(new Set([]));
    return (
      <>
        <TagGroup.Root
          aria-label="selectable animals"
          selectionMode="multiple"
          selectedKeys={selected}
          onSelectionChange={setSelected}
        >
          <TagGroup.TagList items={animalOptions}>
            {(item) => <TagGroup.Tag>{item.name}</TagGroup.Tag>}
          </TagGroup.TagList>
        </TagGroup.Root>
        <Text as="p">
          Current selection:{" "}
          {selected === "all" ? "all" : [...selected].join(", ")}
        </Text>
      </>
    );
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const tagList = canvas.getByRole("grid");
    const tags = within(tagList).getAllByRole("row");
    const [koala, kangaroo, platypus, baldEagle, bison, skunk] = tags;

    await step("Tags - keyboard selection", async () => {
      await userEvent.tab();
      expect(koala).toHaveFocus();
      await userEvent.keyboard("{enter}");
      await canvas.queryByText("Current selection: koala");
      await userEvent.keyboard("{ArrowRight}");
      await userEvent.keyboard("{enter}");
      await canvas.queryByText("Current selection: koala, kangaroo");
      //hitting enter again deselects
      await userEvent.keyboard("{enter}");
      await canvas.queryByText("Current selection: koala");
    });

    await step("Tags - mouse selection", async () => {
      await userEvent.click(koala);
      await userEvent.click(tagList);
      await canvas.queryByText("Current selection: koala");
      await userEvent.click(kangaroo);
      await canvas.queryByText("Current selection: koala, kangaroo");
      //clicking selected tag deselects
      await userEvent.click(kangaroo);
      await canvas.queryByText("Current selection: koala");
    });
  },
};

export const EmptyState: Story = {
  args: {},
  render: () => {
    const animalList = useListData({ initialItems: [animalOptions[0]] });
    return (
      <TagGroup.Root
        aria-label="empty animals"
        onRemove={(keys) => animalList.remove(...keys)}
      >
        <TagGroup.TagList
          items={animalList.items}
          renderEmptyState={() => <Text slot={null}>No Animals</Text>}
        >
          {(item) => <TagGroup.Tag>{item.name}</TagGroup.Tag>}
        </TagGroup.TagList>
      </TagGroup.Root>
    );
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const tagList = canvas.getByRole("grid");
    const tags = within(tagList).getAllByRole("row");
    const [koala, kangaroo, platypus, baldEagle, bison, skunk] = tags;
    await step("Tags - empty state", async () => {
      await userEvent.tab();
      expect(koala).toHaveFocus();
      await userEvent.keyboard("{backspace}");
      await canvas.queryByText("No Animals");
    });
  },
};
/**
 * Showcase Sizes
 */
export const Sizes: Story = {
  args: {},
  render: () => {
    const animalList = useListData({
      initialItems: animalOptions,
    });

    return (
      <Stack direction="column" gap="400" alignItems="flex-start">
        {sizes.map((size) => (
          <TagGroup.Root key={size as string} size={size} aria-label="animals">
            <Text slot={null} as="label">
              size {size as string}
            </Text>
            <TagGroup.TagList items={animalList.items}>
              {(item) => <TagGroup.Tag>{item.name}</TagGroup.Tag>}
            </TagGroup.TagList>
          </TagGroup.Root>
        ))}
      </Stack>
    );
  },
};
