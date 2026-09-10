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
  args: { onSelectionChange: fn() },
  render: (args) => (
    <ListBox.Root
      {...args}
      aria-label="Fruit"
      selectionMode="single"
      data-testid="list-box"
    >
      {fruits.map((f) => (
        <ListBox.Item key={f.id} id={f.id}>
          {f.name}
        </ListBox.Item>
      ))}
    </ListBox.Root>
  ),
  play: async ({ canvasElement, step, args }) => {
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

    await step(
      "onSelectionChange fires when the selection changes",
      async () => {
        // RA passes a Selection (a Set subclass), so assert the call rather than
        // deep-equal a plain Set; the aria-selected checks above cover the payload.
        await expect(args.onSelectionChange).toHaveBeenCalled();
      }
    );
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
  args: { onSelectionChange: fn() },
  render: (args) => (
    <ListBox.Root
      aria-label="Fruit"
      selectionMode="multiple"
      onSelectionChange={args.onSelectionChange}
    >
      {fruits.map((f) => (
        <ListBox.Item key={f.id} id={f.id}>
          {f.name}
        </ListBox.Item>
      ))}
    </ListBox.Root>
  ),
  play: async ({ canvasElement, step, args }) => {
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

    await step("onSelectionChange fires on each toggle", async () => {
      // RA passes a Selection (a Set subclass); assert the call, not a plain
      // Set — the aria-selected checks above cover the payload.
      await expect(args.onSelectionChange).toHaveBeenCalled();
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
 * No selection mode + `onAction`: options are not selectable, but activating a
 * row (pointer or keyboard) still fires `onAction` (spec: "No selection").
 */
export const NoSelectionWithAction: Story = {
  args: { onAction: fn() },
  render: (args) => (
    <ListBox.Root aria-label="Commands" onAction={args.onAction}>
      {fruits.map((f) => (
        <ListBox.Item key={f.id} id={f.id}>
          {f.name}
        </ListBox.Item>
      ))}
    </ListBox.Root>
  ),
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    const banana = canvas.getByRole("option", { name: "Banana" });

    await step(
      "Clicking a row fires onAction but selects nothing",
      async () => {
        await userEvent.click(banana);
        await expect(args.onAction).toHaveBeenCalledWith("banana");
        await expect(banana).not.toHaveAttribute("aria-selected", "true");
      }
    );

    await step("Enter activates the focused row via keyboard", async () => {
      // Focus is on the clicked row; move to the first option and activate it
      // (do NOT tab — that would move focus out of the listbox).
      await userEvent.keyboard("{Home}");
      await userEvent.keyboard("{Enter}");
      await waitFor(() =>
        expect(args.onAction).toHaveBeenLastCalledWith("apple")
      );
    });

    await step("Actionable rows expose the pointer affordance", async () => {
      await userEvent.hover(banana);
      await waitFor(() => expect(banana).toHaveAttribute("data-hovered"));
    });
  },
};

/**
 * Plain display list — no selection and no `onAction`. Rows are inert: React
 * Aria withholds `data-hovered` (so the recipe keeps `cursor: default`) and a
 * click selects nothing.
 */
export const PlainDisplayList: Story = {
  render: () => (
    <ListBox.Root aria-label="Read-only fruit">
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

    await step("Inert rows get no hover affordance", async () => {
      await userEvent.hover(banana);
      await expect(banana).not.toHaveAttribute("data-hovered");
    });

    await step("Clicking an inert row selects nothing", async () => {
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

    await step(
      "Sections are groups labelled by their header (AT)",
      async () => {
        await expect(
          canvas.getByRole("group", { name: "Fruit" })
        ).toBeInTheDocument();
        await expect(
          canvas.getByRole("group", { name: "Vegetable" })
        ).toBeInTheDocument();
      }
    );
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step(
      "The description slot becomes the option's accessible description",
      async () => {
        const [jane] = canvas.getAllByRole("option");
        await expect(jane).toHaveAccessibleDescription("jane@example.com");
      }
    );
  },
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

    await step("Root exposes the [data-empty] state", async () => {
      await expect(canvas.getByRole("listbox")).toHaveAttribute("data-empty");
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
 * Async list with a load-more spinner row. Snapshotted for the `loader` slot.
 */
export const Loading: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
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

const PAGE_SIZE = 8;
const manyFruits = Array.from({ length: 16 }, (_, i) => ({
  id: `fruit-${i}`,
  name: `Fruit ${i + 1}`,
}));
const asyncLoadMoreSpy = fn();

const AsyncLoadMoreList = () => {
  const [count, setCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const handleLoadMore = () => {
    asyncLoadMoreSpy();
    if (count >= manyFruits.length) return;
    setIsLoading(true);
    setCount((c) => Math.min(c + PAGE_SIZE, manyFruits.length));
    setIsLoading(false);
  };
  return (
    <ListBox.Root
      aria-label="Async fruit"
      selectionMode="single"
      maxHeight="8rem"
      data-testid="async-list"
    >
      {manyFruits.slice(0, count).map((f) => (
        <ListBox.Item key={f.id} id={f.id}>
          {f.name}
        </ListBox.Item>
      ))}
      <ListBox.LoadMore isLoading={isLoading} onLoadMore={handleLoadMore} />
    </ListBox.Root>
  );
};

/**
 * Async load-more (behavior): scrolling the `card` list to the bottom fires
 * `onLoadMore`, which appends the next page. React Aria's load-more sentinel
 * needs a scroll container — `variant="card"` provides one; a `plain` list
 * embedded in an overlay must supply its own bounded scroller, or load-more
 * tracks the page / over-fetches.
 */
export const AsyncLoadMore: Story = {
  render: () => <AsyncLoadMoreList />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const listbox = canvas.getByTestId("async-list");

    await step("Initial page renders", async () => {
      await expect(canvas.getAllByRole("option")).toHaveLength(PAGE_SIZE);
    });

    await step(
      "Scrolling to the bottom fires onLoadMore and appends the next page",
      async () => {
        listbox.scrollTop = listbox.scrollHeight;
        await waitFor(
          () =>
            expect(canvas.getAllByRole("option").length).toBeGreaterThan(
              PAGE_SIZE
            ),
          { timeout: 3000 }
        );
        await expect(asyncLoadMoreSpy).toHaveBeenCalled();
      }
    );
  },
};

/**
 * Shared render for the drag-and-drop stories: a reorderable, multi-select list
 * wired to React Aria's `dragAndDropHooks`.
 */
const ReorderableFruit = () => {
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
};

/**
 * Drag-and-drop reordering via React Aria's `dragAndDropHooks`. Behavioral
 * documentation of the draggable capability (the in-progress visual states are
 * snapshotted by `DragInProgress`).
 */
export const DragAndDrop: Story = {
  render: () => <ReorderableFruit />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Options are draggable", async () => {
      const apple = canvas.getByRole("option", { name: "Apple" });
      await expect(apple).toHaveAttribute("data-allows-dragging", "true");
    });
  },
};

/**
 * A keyboard drag left mid-flight, snapshotted for the two recipe surfaces a
 * resting list can't show: `item[data-dragging]` (the lifted source at reduced
 * opacity) and `root[data-drop-target]` (the list outlined as a drop target).
 */
export const DragInProgress: Story = {
  tags: ["vrt"],
  parameters: {
    chromatic: { disableSnapshot: false },
    a11y: {
      // The mid-drag frame carries two transient, by-design a11y findings that
      // are not the component's to fix — scope off just those rules for it:
      //   • aria-hidden-focus — React Aria marks the lifted option `aria-hidden`
      //     (a drag preview stands in for it) while it keeps its roving
      //     `tabindex`; the focus/announcement choreography is React Aria's.
      //   • color-contrast (+ the APCA variant) — the recipe dims the lifted row
      //     to `opacity: 0.6` as the "being moved" affordance, which drops its
      //     text contrast; that row is simultaneously `aria-hidden`, so AT reads
      //     the live-region announcement, not the dimmed text.
      config: {
        rules: [
          { id: "aria-hidden-focus", enabled: false },
          { id: "color-contrast", enabled: false },
          { id: "color-contrast-apca-custom", enabled: false },
        ],
      },
    },
  },
  render: () => <ReorderableFruit />,
  // React Aria's keyboard drag session is a module-level global that outlives
  // unmount under `isolate: false`. Cancel it in the teardown a `beforeEach`
  // returns — it runs after the snapshot is captured, so it preserves the frame
  // while stopping the drag from leaking into the next story.
  beforeEach: () => () => {
    document.body.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const apple = canvas.getByRole("option", { name: "Apple" });

    await step("Pick up an option to start a keyboard drag", async () => {
      // With multi-select + drag, React Aria adds a per-option drag affordance
      // button so Enter/Space stay free for selection; start the drag from it,
      // falling back to the option itself when no affordance is rendered.
      const dragHandle = within(apple).queryByRole("button") ?? apple;
      dragHandle.focus();
      await userEvent.keyboard("{Enter}");
    });

    await step("Move the drop position onto the next option", async () => {
      await userEvent.keyboard("{ArrowDown}");
    });

    await step("Source option shows the dragging state", async () => {
      // The lifted source carries `data-dragging` (recipe: opacity 0.6). During
      // an in-collection reorder React Aria marks a between-items DropIndicator
      // with `data-drop-target`, not the root — the root's own
      // `[data-drop-target]` surface is exercised by `DropTarget` instead.
      await waitFor(() =>
        expect(apple).toHaveAttribute("data-dragging", "true")
      );
    });
  },
};

/**
 * SmokeTest — the full visual permutation grid.
 * Axes: size (sm, md) × selection affordance (single highlight vs. multiple
 * checkbox), on the default `card` container.
 */
export const SmokeTest: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack gap="600">
      {sizes.map((size) => (
        <Stack key={size} direction="row" gap="400" alignItems="flex-start">
          <ListBox.Root
            size={size}
            aria-label={`single ${size}`}
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
            aria-label={`multiple ${size}`}
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
  ),
};

/**
 * A list configured to accept an external drag, with a drag hovering over it,
 * snapshotted for the `root[data-drop-target]` surface (recipe: primary outline,
 * `-2px` offset). React Aria's droppable collection sets `data-drop-target` on
 * the root from native drag events, so — like DropZone's own `DropTarget` — the
 * play dispatches a synthetic `dragenter`/`dragover` and leaves it active for
 * the capture, rather than orchestrating a full cross-list keyboard drag.
 */
export const DropTarget: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => {
    const DroppableFruit = () => {
      const { dragAndDropHooks } = useDragAndDrop({
        acceptedDragTypes: ["text/plain"],
        getDropOperation: () => "copy",
        // A no-op drop handler is enough to make the list a drop target; the
        // snapshot only needs the hover state, never a completed drop.
        onRootDrop() {},
      });
      return (
        <ListBox.Root
          aria-label="Droppable fruit"
          items={fruits}
          dragAndDropHooks={dragAndDropHooks}
        >
          {(item) => <ListBox.Item id={item.id}>{item.name}</ListBox.Item>}
        </ListBox.Root>
      );
    };
    return <DroppableFruit />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const listbox = canvas.getByRole("listbox");

    await step("A drag carrying an accepted type hovers the list", async () => {
      // jsdom/Chromium won't let a script build a real DataTransfer with items,
      // so mock the minimal surface React Aria's droppable collection reads and
      // dispatch native drag events (mirrors DropZone's test-utils).
      const dataTransfer = {
        types: ["text/plain"],
        items: [{ kind: "string", type: "text/plain" }],
        getData: () => "Grapefruit",
        dropEffect: "none",
        effectAllowed: "all",
        files: [] as File[],
      };
      for (const type of ["dragenter", "dragover"] as const) {
        const event = new Event(type, { bubbles: true, cancelable: true });
        Object.defineProperty(event, "dataTransfer", { value: dataTransfer });
        Object.defineProperty(event, "clientX", { value: 5 });
        Object.defineProperty(event, "clientY", { value: 5 });
        listbox.dispatchEvent(event);
      }
    });

    await step("The list is marked as a drop target", async () => {
      await waitFor(() =>
        expect(listbox).toHaveAttribute("data-drop-target", "true")
      );
    });
  },
};
