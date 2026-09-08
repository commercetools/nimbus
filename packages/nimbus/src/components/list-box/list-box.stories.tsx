import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box, ListBox, Stack, Text } from "@commercetools/nimbus";
import { useState } from "react";
import {
  useDragAndDrop,
  type Key,
  type Selection,
} from "react-aria-components";
import { useListData } from "react-stately";
import { userEvent, within, expect, fn, waitFor } from "storybook/test";
import { Star } from "@commercetools/nimbus-icons";

/**
 * Storybook metadata configuration
 */
const meta: Meta<typeof ListBox.Root> = {
  title: "Components/ListBox",
  component: ListBox.Root,
};

export default meta;

type Story = StoryObj<typeof ListBox.Root>;

/**
 * Test data
 */
const sizes = ["sm", "md"] as const;
const containerVariants = ["card", "plain"] as const;
const densities = ["comfortable", "compact"] as const;

const fruits = [
  { id: "apple", name: "Apple" },
  { id: "banana", name: "Banana" },
  { id: "cherry", name: "Cherry" },
  { id: "date", name: "Date" },
  { id: "elderberry", name: "Elderberry" },
];

const grouped = [
  {
    id: "fruit",
    name: "Fruit",
    children: [
      { id: "apple", name: "Apple" },
      { id: "banana", name: "Banana" },
      { id: "cherry", name: "Cherry" },
    ],
  },
  {
    id: "veg",
    name: "Vegetable",
    children: [
      { id: "carrot", name: "Carrot" },
      { id: "potato", name: "Potato" },
      { id: "spinach", name: "Spinach" },
    ],
  },
];

const contacts = [
  { id: "jane", name: "Jane Doe", handle: "jane@example.com" },
  { id: "john", name: "John Smith", handle: "john@example.com" },
  { id: "ada", name: "Ada Lovelace", handle: "ada@example.com" },
];

/**
 * Base — an uncontrolled single-select list. Exercises the core mechanics:
 * rendering, pointer selection (single-select replaces), and keyboard selection.
 */
export const Base: Story = {
  render: (args) => (
    <ListBox.Root
      {...args}
      aria-label="Fruit"
      selectionMode="single"
      data-testid="list-box"
      onSelectionChange={args.onSelectionChange ?? fn()}
    >
      {fruits.map((f) => (
        <ListBox.Item key={f.id} id={f.id}>
          {f.name}
        </ListBox.Item>
      ))}
    </ListBox.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders a listbox with all options", async () => {
      const listbox = canvas.getByRole("listbox");
      await expect(listbox).toBeInTheDocument();
      await expect(canvas.getAllByRole("option")).toHaveLength(fruits.length);
    });

    await step("Selecting an option marks it selected", async () => {
      const banana = canvas.getByRole("option", { name: "Banana" });
      await userEvent.click(banana);
      await expect(banana).toHaveAttribute("aria-selected", "true");
    });

    await step("Single-select replaces the previous selection", async () => {
      const banana = canvas.getByRole("option", { name: "Banana" });
      const cherry = canvas.getByRole("option", { name: "Cherry" });
      await userEvent.click(cherry);
      await expect(cherry).toHaveAttribute("aria-selected", "true");
      await expect(banana).toHaveAttribute("aria-selected", "false");
    });
  },
};

/**
 * Single-select selected state (visual): the selected row uses a full-row
 * highlight, no checkbox.
 */
export const SelectedState: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <ListBox.Root
      aria-label="Fruit"
      selectionMode="single"
      defaultSelectedKeys={["banana"]}
    >
      {fruits.map((f) => (
        <ListBox.Item key={f.id} id={f.id}>
          {f.name}
        </ListBox.Item>
      ))}
    </ListBox.Root>
  ),
};

/**
 * Multiple selection (visual): each option renders a leading checkbox; the
 * row highlight is suppressed in favour of the checkbox.
 */
export const MultipleSelectionVisual: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <ListBox.Root
      aria-label="Fruit"
      selectionMode="multiple"
      defaultSelectedKeys={["apple", "cherry"]}
    >
      {fruits.map((f) => (
        <ListBox.Item key={f.id} id={f.id}>
          {f.name}
        </ListBox.Item>
      ))}
    </ListBox.Root>
  ),
};

/**
 * Multiple selection (behavior): toggling options independently, and the
 * checkbox indicator reflecting selected state.
 */
export const MultipleSelectionBehavior: Story = {
  render: () => {
    const onSelectionChange = fn();
    return (
      <ListBox.Root
        aria-label="Fruit"
        selectionMode="multiple"
        onSelectionChange={onSelectionChange}
      >
        {fruits.map((f) => (
          <ListBox.Item key={f.id} id={f.id}>
            {f.name}
          </ListBox.Item>
        ))}
      </ListBox.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const apple = canvas.getByRole("option", { name: "Apple" });
    const cherry = canvas.getByRole("option", { name: "Cherry" });

    await step("Toggling selects options independently", async () => {
      await userEvent.click(apple);
      await userEvent.click(cherry);
      await expect(apple).toHaveAttribute("aria-selected", "true");
      await expect(cherry).toHaveAttribute("aria-selected", "true");
    });

    await step("Toggling a selected option deselects it", async () => {
      await userEvent.click(apple);
      await expect(apple).toHaveAttribute("aria-selected", "false");
      await expect(cherry).toHaveAttribute("aria-selected", "true");
    });
  },
};

/**
 * Keyboard navigation and type-ahead.
 */
export const KeyboardNavigation: Story = {
  render: () => (
    <ListBox.Root aria-label="Fruit" selectionMode="single">
      {fruits.map((f) => (
        <ListBox.Item key={f.id} id={f.id}>
          {f.name}
        </ListBox.Item>
      ))}
    </ListBox.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Tab enters the listbox; Home focuses the first option",
      async () => {
        await userEvent.tab();
        await userEvent.keyboard("{Home}");
        await waitFor(() =>
          expect(canvas.getByRole("option", { name: "Apple" })).toHaveAttribute(
            "data-focused"
          )
        );
      }
    );

    await step("ArrowDown moves to the next option", async () => {
      await userEvent.keyboard("{ArrowDown}");
      await waitFor(() =>
        expect(canvas.getByRole("option", { name: "Banana" })).toHaveAttribute(
          "data-focused"
        )
      );
    });

    await step("End jumps to the last option", async () => {
      await userEvent.keyboard("{End}");
      await waitFor(() =>
        expect(
          canvas.getByRole("option", { name: "Elderberry" })
        ).toHaveAttribute("data-focused")
      );
    });

    await step("Type-ahead focuses the matching option", async () => {
      await userEvent.keyboard("c");
      await waitFor(() =>
        expect(canvas.getByRole("option", { name: "Cherry" })).toHaveAttribute(
          "data-focused"
        )
      );
    });

    await step("Enter selects the focused option", async () => {
      await userEvent.keyboard("{Enter}");
      await expect(
        canvas.getByRole("option", { name: "Cherry" })
      ).toHaveAttribute("aria-selected", "true");
    });
  },
};

/**
 * Disabled option (visual): dimmed and non-interactive.
 */
export const DisabledItems: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <ListBox.Root
      aria-label="Fruit"
      selectionMode="single"
      disabledKeys={["banana"]}
    >
      {fruits.map((f) => (
        <ListBox.Item key={f.id} id={f.id}>
          {f.name}
        </ListBox.Item>
      ))}
    </ListBox.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const banana = canvas.getByRole("option", { name: "Banana" });

    await step("Disabled option is marked disabled", async () => {
      await expect(banana).toHaveAttribute("aria-disabled", "true");
    });

    await step("Disabled option cannot be selected", async () => {
      await userEvent.click(banana);
      await expect(banana).not.toHaveAttribute("aria-selected", "true");
    });
  },
};

/**
 * Sections group options under an accessible header.
 */
export const WithSections: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <ListBox.Root aria-label="Produce" selectionMode="single">
      {grouped.map((group) => (
        <ListBox.Section key={group.id} label={group.name}>
          {group.children.map((item) => (
            <ListBox.Item key={item.id} id={`${group.id}-${item.id}`}>
              {item.name}
            </ListBox.Item>
          ))}
        </ListBox.Section>
      ))}
    </ListBox.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Section headers render", async () => {
      await expect(canvas.getByText("Fruit")).toBeInTheDocument();
      await expect(canvas.getByText("Vegetable")).toBeInTheDocument();
    });

    await step("Headers are not selectable options", async () => {
      await expect(canvas.getAllByRole("option")).toHaveLength(6);
    });
  },
};

/**
 * Rich item content: leading media, a two-line label + description, and
 * trailing content.
 */
export const RichContent: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <ListBox.Root aria-label="People" selectionMode="single" width="20rem">
      {contacts.map((c) => (
        <ListBox.Item
          key={c.id}
          id={c.id}
          textValue={c.name}
          leading={<Star />}
          trailing={<Text color="neutral.11">Owner</Text>}
        >
          <Text slot="label">{c.name}</Text>
          <Text slot="description">{c.handle}</Text>
        </ListBox.Item>
      ))}
    </ListBox.Root>
  ),
};

/**
 * Size scale — matches the shared Nimbus scale (sm, md).
 */
export const Sizes: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack direction="row" gap="600" alignItems="flex-start">
      {sizes.map((size) => (
        <ListBox.Root
          key={size}
          size={size}
          aria-label={`Fruit ${size}`}
          selectionMode="single"
          defaultSelectedKeys={["banana"]}
        >
          {fruits.map((f) => (
            <ListBox.Item key={f.id} id={f.id}>
              {f.name}
            </ListBox.Item>
          ))}
        </ListBox.Root>
      ))}
    </Stack>
  ),
};

/**
 * Container variants — `card` (standalone surface) vs `plain` (bare list for
 * embedding inside an already-carded popover).
 */
export const Variants: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack direction="row" gap="600" alignItems="flex-start">
      {containerVariants.map((variant) => (
        <Box key={variant}>
          <Text fontWeight="600" mb="200">
            {variant}
          </Text>
          <ListBox.Root
            variant={variant}
            aria-label={`Fruit ${variant}`}
            selectionMode="single"
            defaultSelectedKeys={["banana"]}
          >
            {fruits.map((f) => (
              <ListBox.Item key={f.id} id={f.id}>
                {f.name}
              </ListBox.Item>
            ))}
          </ListBox.Root>
        </Box>
      ))}
    </Stack>
  ),
};

/**
 * Row density — `comfortable` (default) vs `compact`.
 */
export const Density: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack direction="row" gap="600" alignItems="flex-start">
      {densities.map((density) => (
        <Box key={density}>
          <Text fontWeight="600" mb="200">
            {density}
          </Text>
          <ListBox.Root
            density={density}
            aria-label={`Fruit ${density}`}
            selectionMode="single"
          >
            {fruits.map((f) => (
              <ListBox.Item key={f.id} id={f.id}>
                {f.name}
              </ListBox.Item>
            ))}
          </ListBox.Root>
        </Box>
      ))}
    </Stack>
  ),
};

/**
 * Empty state — the localized default message renders when there are no options.
 */
export const EmptyState: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <ListBox.Root aria-label="Empty" width="16rem">
      {[]}
    </ListBox.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Default empty message renders", async () => {
      await expect(
        canvas.getByText("No options available")
      ).toBeInTheDocument();
    });
  },
};

/**
 * Keyboard focus (visual): the focused option shows the focus ring.
 */
export const Focused: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <ListBox.Root aria-label="Fruit" selectionMode="single">
      {fruits.map((f) => (
        <ListBox.Item key={f.id} id={f.id}>
          {f.name}
        </ListBox.Item>
      ))}
    </ListBox.Root>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await userEvent.keyboard("{Home}");
    await waitFor(() =>
      expect(canvas.getByRole("option", { name: "Apple" })).toHaveAttribute(
        "data-focus-visible"
      )
    );
  },
};

/**
 * Controlled selection stays in sync with external state.
 */
export const Controlled: Story = {
  render: () => {
    const [selected, setSelected] = useState<Selection>(
      new Set<Key>(["apple"])
    );
    return (
      <Stack gap="400">
        <ListBox.Root
          aria-label="Fruit"
          selectionMode="single"
          selectedKeys={selected}
          onSelectionChange={setSelected}
        >
          {fruits.map((f) => (
            <ListBox.Item key={f.id} id={f.id}>
              {f.name}
            </ListBox.Item>
          ))}
        </ListBox.Root>
        <Text data-testid="value">
          Selected: {[...selected].join(", ") || "none"}
        </Text>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const value = canvas.getByTestId("value");

    await step("Reflects the initial controlled value", async () => {
      await expect(value).toHaveTextContent("Selected: apple");
    });

    await step("Updates when a new option is selected", async () => {
      await userEvent.click(canvas.getByRole("option", { name: "Date" }));
      await expect(value).toHaveTextContent("Selected: date");
    });
  },
};

/**
 * Async list with a load-more spinner row.
 */
export const Loading: Story = {
  render: () => (
    <ListBox.Root aria-label="Fruit" selectionMode="single" width="16rem">
      {fruits.slice(0, 3).map((f) => (
        <ListBox.Item key={f.id} id={f.id}>
          {f.name}
        </ListBox.Item>
      ))}
      <ListBox.LoadMore isLoading />
    </ListBox.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Load-more spinner is present while loading", async () => {
      await expect(canvas.getByRole("progressbar")).toBeInTheDocument();
    });
  },
};

/**
 * Drag-and-drop reordering via React Aria's `dragAndDropHooks`.
 */
export const DragAndDrop: Story = {
  render: () => {
    const list = useListData({ initialItems: fruits });
    const { dragAndDropHooks } = useDragAndDrop({
      getItems: (keys) =>
        [...keys].map((key) => ({
          "text/plain": list.getItem(key)?.name ?? "",
        })),
      onReorder(e) {
        if (e.target.dropPosition === "before") {
          list.moveBefore(e.target.key, e.keys);
        } else if (e.target.dropPosition === "after") {
          list.moveAfter(e.target.key, e.keys);
        }
      },
    });
    return (
      <ListBox.Root
        aria-label="Reorderable fruit"
        selectionMode="multiple"
        items={list.items}
        dragAndDropHooks={dragAndDropHooks}
      >
        {(item) => <ListBox.Item id={item.id}>{item.name}</ListBox.Item>}
      </ListBox.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Options are draggable", async () => {
      const apple = canvas.getByRole("option", { name: "Apple" });
      await expect(apple).toHaveAttribute("data-allows-dragging", "true");
    });
  },
};

/**
 * SmokeTest — the full visual permutation grid.
 * Axes: size (sm, md) × density (comfortable, compact) × selection affordance
 * (single highlight vs. multiple checkbox), on the default `card` container.
 */
export const SmokeTest: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack gap="600">
      {sizes.map((size) => (
        <Stack key={size} direction="row" gap="600" alignItems="flex-start">
          {densities.map((density) => (
            <Stack key={density} direction="row" gap="400">
              <ListBox.Root
                size={size}
                density={density}
                aria-label={`single ${size} ${density}`}
                selectionMode="single"
                defaultSelectedKeys={["banana"]}
              >
                {fruits.map((f) => (
                  <ListBox.Item key={f.id} id={f.id}>
                    {f.name}
                  </ListBox.Item>
                ))}
              </ListBox.Root>
              <ListBox.Root
                size={size}
                density={density}
                aria-label={`multiple ${size} ${density}`}
                selectionMode="multiple"
                defaultSelectedKeys={["apple", "cherry"]}
              >
                {fruits.map((f) => (
                  <ListBox.Item key={f.id} id={f.id}>
                    {f.name}
                  </ListBox.Item>
                ))}
              </ListBox.Root>
            </Stack>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};
