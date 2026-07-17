import { useState } from "react";
import type { Selection } from "react-aria-components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ListBox, Stack, Text } from "@commercetools/nimbus";
import { expect, fn, userEvent, within } from "storybook/test";

const meta: Meta<typeof ListBox.Root> = {
  title: "Components/ListBox",
  component: ListBox.Root,
};

export default meta;

type Story = StoryObj<typeof meta>;

const fruits = [
  { id: "apple", name: "Apple" },
  { id: "banana", name: "Banana" },
  { id: "cherry", name: "Cherry" },
  { id: "date", name: "Date" },
  { id: "elderberry", name: "Elderberry" },
  { id: "fig", name: "Fig" },
  { id: "grape", name: "Grape" },
];

/**
 * Basic static composition with selection.
 */
export const Base: Story = {
  args: { onSelectionChange: fn() },
  render: (args) => (
    <ListBox.Root
      aria-label="Favorite fruit"
      selectionMode="single"
      onSelectionChange={args.onSelectionChange}
    >
      <ListBox.Item id="apple">Apple</ListBox.Item>
      <ListBox.Item id="banana">Banana</ListBox.Item>
      <ListBox.Item id="cherry">Cherry</ListBox.Item>
      <ListBox.Item id="date">Date</ListBox.Item>
    </ListBox.Root>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);

    await step("Renders listbox with options", async () => {
      const listbox = canvas.getByRole("listbox", { name: "Favorite fruit" });
      expect(listbox).toBeInTheDocument();
      const options = canvas.getAllByRole("option");
      expect(options).toHaveLength(4);
    });

    await step("Selects an item via click", async () => {
      const apple = canvas.getByRole("option", { name: "Apple" });
      await userEvent.click(apple);
      expect(args.onSelectionChange).toHaveBeenCalled();
    });

    await step("Supports keyboard navigation", async () => {
      const listbox = canvas.getByRole("listbox");
      listbox.focus();
      await userEvent.keyboard("{ArrowDown}");
      await userEvent.keyboard("{ArrowDown}");
      await userEvent.keyboard("{Enter}");
      expect(args.onSelectionChange).toHaveBeenCalledTimes(2);
    });
  },
};

/**
 * Dynamic items rendered from a data array.
 */
export const DynamicItems: Story = {
  render: () => (
    <ListBox.Root aria-label="Fruits" selectionMode="single" items={fruits}>
      {(item) => <ListBox.Item id={item.id}>{item.name}</ListBox.Item>}
    </ListBox.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders all dynamic items", async () => {
      const options = canvas.getAllByRole("option");
      expect(options).toHaveLength(fruits.length);
    });
  },
};

/**
 * Multiple selection mode with checkboxes.
 */
export const MultipleSelection: Story = {
  args: { onSelectionChange: fn() },
  render: (args) => (
    <ListBox.Root
      aria-label="Select fruits"
      selectionMode="multiple"
      onSelectionChange={args.onSelectionChange}
    >
      <ListBox.Item id="apple">Apple</ListBox.Item>
      <ListBox.Item id="banana">Banana</ListBox.Item>
      <ListBox.Item id="cherry">Cherry</ListBox.Item>
    </ListBox.Root>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);

    await step("Allows selecting multiple items", async () => {
      await userEvent.click(canvas.getByRole("option", { name: "Apple" }));
      await userEvent.click(canvas.getByRole("option", { name: "Cherry" }));
      expect(args.onSelectionChange).toHaveBeenCalledTimes(2);
    });
  },
};

/**
 * Items grouped into labeled sections.
 */
export const Sections: Story = {
  render: () => (
    <ListBox.Root aria-label="Food" selectionMode="single">
      <ListBox.Section title="Fruits">
        <ListBox.Item id="apple">Apple</ListBox.Item>
        <ListBox.Item id="banana">Banana</ListBox.Item>
      </ListBox.Section>
      <ListBox.Section title="Vegetables">
        <ListBox.Item id="carrot">Carrot</ListBox.Item>
        <ListBox.Item id="broccoli">Broccoli</ListBox.Item>
      </ListBox.Section>
    </ListBox.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders sections with headers", async () => {
      expect(canvas.getByText("Fruits")).toBeInTheDocument();
      expect(canvas.getByText("Vegetables")).toBeInTheDocument();
      expect(canvas.getAllByRole("option")).toHaveLength(4);
    });
  },
};

/**
 * Disabled items that cannot be selected.
 */
export const DisabledItems: Story = {
  render: () => (
    <ListBox.Root
      aria-label="Fruits"
      selectionMode="single"
      disabledKeys={["banana", "date"]}
    >
      <ListBox.Item id="apple">Apple</ListBox.Item>
      <ListBox.Item id="banana">Banana</ListBox.Item>
      <ListBox.Item id="cherry">Cherry</ListBox.Item>
      <ListBox.Item id="date">Date</ListBox.Item>
    </ListBox.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Disabled items have aria-disabled", async () => {
      const banana = canvas.getByRole("option", { name: "Banana" });
      expect(banana).toHaveAttribute("aria-disabled", "true");
    });
  },
};

/**
 * Size variants: sm, md (default), lg.
 */
export const Sizes: Story = {
  render: () => (
    <Stack direction="row" gap="400">
      {(["sm", "md", "lg"] as const).map((size) => (
        <ListBox.Root
          key={size}
          aria-label={`Size ${size}`}
          selectionMode="single"
          size={size}
        >
          <ListBox.Item id="apple">Apple</ListBox.Item>
          <ListBox.Item id="banana">Banana</ListBox.Item>
          <ListBox.Item id="cherry">Cherry</ListBox.Item>
        </ListBox.Root>
      ))}
    </Stack>
  ),
};

/**
 * Empty state rendering.
 */
export const EmptyState: Story = {
  render: () => (
    <ListBox.Root
      aria-label="Empty list"
      selectionMode="single"
      renderEmptyState={() => (
        <Text color="fg.muted" padding="300">
          No items available
        </Text>
      )}
    >
      {[]}
    </ListBox.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Shows empty state text", async () => {
      expect(canvas.getByText("No items available")).toBeInTheDocument();
    });
  },
};

/**
 * Controlled selection state.
 */
export const Controlled: Story = {
  render: () => {
    const ControlledExample = () => {
      const [selected, setSelected] = useState<Selection>(new Set(["banana"]));
      return (
        <ListBox.Root
          aria-label="Controlled"
          selectionMode="single"
          selectedKeys={selected}
          onSelectionChange={setSelected}
        >
          <ListBox.Item id="apple">Apple</ListBox.Item>
          <ListBox.Item id="banana">Banana</ListBox.Item>
          <ListBox.Item id="cherry">Cherry</ListBox.Item>
        </ListBox.Root>
      );
    };
    return <ControlledExample />;
  },
};
