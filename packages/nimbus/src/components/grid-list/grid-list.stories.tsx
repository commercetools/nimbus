import { useDragAndDrop } from "react-aria-components";
import { useListData } from "react-stately";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { GridList, Stack, Text, Box, IconButton } from "@commercetools/nimbus";
import { DragIndicator } from "@commercetools/nimbus-icons";
import { expect, fn, userEvent, within } from "storybook/test";

const meta: Meta<typeof GridList.Root> = {
  title: "Components/GridList",
  component: GridList.Root,
};

export default meta;

type Story = StoryObj<typeof meta>;

const fruits = [
  { id: "apple", name: "Apple" },
  { id: "banana", name: "Banana" },
  { id: "cherry", name: "Cherry" },
  { id: "date", name: "Date" },
  { id: "elderberry", name: "Elderberry" },
];

/**
 * Basic static composition with single selection.
 * GridList renders `role="grid"` / `role="row"` — unlike ListBox, it is
 * designed for rows that may contain interactive elements.
 */
export const Base: Story = {
  args: { onSelectionChange: fn() },
  render: (args) => (
    <GridList.Root
      aria-label="Favorite fruit"
      selectionMode="single"
      onSelectionChange={args.onSelectionChange}
    >
      <GridList.Item id="apple" textValue="Apple">
        Apple
      </GridList.Item>
      <GridList.Item id="banana" textValue="Banana">
        Banana
      </GridList.Item>
      <GridList.Item id="cherry" textValue="Cherry">
        Cherry
      </GridList.Item>
      <GridList.Item id="date" textValue="Date">
        Date
      </GridList.Item>
    </GridList.Root>
  ),
  play: async ({
    canvasElement,
    args,
    step,
  }: {
    canvasElement: HTMLElement;
    args: { onSelectionChange: ReturnType<typeof fn> };
    step: (name: string, fn: () => Promise<void>) => Promise<void>;
  }) => {
    const canvas = within(canvasElement);

    await step("Renders grid role and row items", async () => {
      const grid = canvas.getByRole("grid", { name: "Favorite fruit" });
      expect(grid).toBeInTheDocument();
      const rows = canvas.getAllByRole("row");
      expect(rows).toHaveLength(4);
    });

    await step("Selects an item via click", async () => {
      const apple = canvas.getByRole("row", { name: "Apple" });
      await userEvent.click(apple);
      expect(args.onSelectionChange).toHaveBeenCalled();
    });

    await step("Supports keyboard navigation", async () => {
      const grid = canvas.getByRole("grid");
      grid.focus();
      await userEvent.keyboard("{ArrowDown}");
      await userEvent.keyboard("{ArrowDown}");
      await userEvent.keyboard("{Enter}");
      expect(args.onSelectionChange).toHaveBeenCalledTimes(2);
    });
  },
};

/**
 * Dynamic items rendered from a data array via the `items` prop and a render
 * function as children.
 */
export const DynamicItems: Story = {
  render: () => (
    <GridList.Root aria-label="Fruits" selectionMode="single" items={fruits}>
      {(item) => (
        <GridList.Item id={item.id} textValue={item.name}>
          {item.name}
        </GridList.Item>
      )}
    </GridList.Root>
  ),
  play: async ({
    canvasElement,
    step,
  }: {
    canvasElement: HTMLElement;
    step: (name: string, fn: () => Promise<void>) => Promise<void>;
  }) => {
    const canvas = within(canvasElement);

    await step("Renders all dynamic items as rows", async () => {
      const rows = canvas.getAllByRole("row");
      expect(rows).toHaveLength(fruits.length);
    });
  },
};

/**
 * Multiple selection mode — clicking items toggles their selected state and
 * React Aria manages the selection set.
 */
export const MultipleSelection: Story = {
  args: { onSelectionChange: fn() },
  render: (args) => (
    <GridList.Root
      aria-label="Select fruits"
      selectionMode="multiple"
      onSelectionChange={args.onSelectionChange}
    >
      <GridList.Item id="apple" textValue="Apple">
        Apple
      </GridList.Item>
      <GridList.Item id="banana" textValue="Banana">
        Banana
      </GridList.Item>
      <GridList.Item id="cherry" textValue="Cherry">
        Cherry
      </GridList.Item>
    </GridList.Root>
  ),
  play: async ({
    canvasElement,
    args,
    step,
  }: {
    canvasElement: HTMLElement;
    args: { onSelectionChange: ReturnType<typeof fn> };
    step: (name: string, fn: () => Promise<void>) => Promise<void>;
  }) => {
    const canvas = within(canvasElement);

    await step("Allows selecting multiple items independently", async () => {
      await userEvent.click(canvas.getByRole("row", { name: "Apple" }));
      await userEvent.click(canvas.getByRole("row", { name: "Cherry" }));
      expect(args.onSelectionChange).toHaveBeenCalledTimes(2);
    });
  },
};

/**
 * Visual grid layout — `GridList.Root` is placed inside a CSS-grid wrapper so
 * items flow into a multi-column card layout while retaining all keyboard
 * navigation and selection behaviour from React Aria.
 */
export const GridLayout: Story = {
  render: () => {
    const imageCards = [
      { id: "mountains", label: "Mountains", color: "blue.3" },
      { id: "forest", label: "Forest", color: "green.3" },
      { id: "desert", label: "Desert", color: "orange.3" },
      { id: "ocean", label: "Ocean", color: "teal.3" },
      { id: "city", label: "City", color: "purple.3" },
      { id: "canyon", label: "Canyon", color: "red.3" },
    ];

    return (
      <Box
        display="grid"
        gridTemplateColumns="repeat(3, 1fr)"
        gap="300"
        data-testid="grid-layout-wrapper"
      >
        <GridList.Root
          aria-label="Landscape photos"
          selectionMode="single"
          items={imageCards}
          display="contents"
        >
          {(card) => (
            <GridList.Item
              id={card.id}
              textValue={card.label}
              padding="400"
              borderRadius="200"
              background={card.color}
              minHeight="1200"
              alignItems="flex-end"
            >
              <Text fontWeight="600">{card.label}</Text>
            </GridList.Item>
          )}
        </GridList.Root>
      </Box>
    );
  },
  play: async ({
    canvasElement,
    step,
  }: {
    canvasElement: HTMLElement;
    step: (name: string, fn: () => Promise<void>) => Promise<void>;
  }) => {
    const canvas = within(canvasElement);

    await step("Renders grid layout wrapper", async () => {
      const wrapper = canvas.getByTestId("grid-layout-wrapper");
      expect(wrapper).toBeInTheDocument();
    });

    await step("Renders all card items as rows", async () => {
      const rows = canvas.getAllByRole("row");
      expect(rows).toHaveLength(6);
    });

    await step("Each card item displays its label", async () => {
      expect(
        canvas.getByRole("row", { name: "Mountains" })
      ).toBeInTheDocument();
      expect(canvas.getByRole("row", { name: "Forest" })).toBeInTheDocument();
    });
  },
};

/**
 * Size variants: `sm`, `md` (default), and `lg` — rendered side by side for
 * easy visual comparison.
 */
export const Sizes: Story = {
  render: () => (
    <Stack direction="row" gap="400" alignItems="flex-start">
      {(["sm", "md", "lg"] as const).map((size) => (
        <GridList.Root
          key={size}
          aria-label={`Size ${size}`}
          selectionMode="single"
          size={size}
        >
          <GridList.Item id="apple" textValue="Apple">
            Apple
          </GridList.Item>
          <GridList.Item id="banana" textValue="Banana">
            Banana
          </GridList.Item>
          <GridList.Item id="cherry" textValue="Cherry">
            Cherry
          </GridList.Item>
        </GridList.Root>
      ))}
    </Stack>
  ),
};

/**
 * Drag-and-drop reordering via `useDragAndDrop` (React Aria) and `useListData`
 * (React Stately). Each item exposes a `<Button slot="drag">` handle for
 * keyboard-accessible reordering.
 */
export const DragAndDrop: Story = {
  render: () => {
    const DragAndDropExample = () => {
      const list = useListData({
        initialItems: [
          { id: "1", name: "Task one" },
          { id: "2", name: "Task two" },
          { id: "3", name: "Task three" },
          { id: "4", name: "Task four" },
        ],
      });

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
        <GridList.Root
          aria-label="Reorderable tasks"
          selectionMode="multiple"
          items={list.items}
          dragAndDropHooks={dragAndDropHooks}
        >
          {(item) => (
            <GridList.Item id={item.id} textValue={item.name}>
              <IconButton
                slot="drag"
                size="2xs"
                variant="ghost"
                data-testid={`drag-${item.id}`}
                aria-label={`Reorder ${item.name}`}
              >
                <DragIndicator />
              </IconButton>
              {item.name}
            </GridList.Item>
          )}
        </GridList.Root>
      );
    };

    return <DragAndDropExample />;
  },
  play: async ({
    canvasElement,
    step,
  }: {
    canvasElement: HTMLElement;
    step: (name: string, fn: () => Promise<void>) => Promise<void>;
  }) => {
    const canvas = within(canvasElement);

    await step("Renders all draggable rows", async () => {
      const rows = canvas.getAllByRole("row");
      expect(rows).toHaveLength(4);
    });

    await step("Drag handles are present for each item", async () => {
      expect(canvas.getByTestId("drag-1")).toBeInTheDocument();
      expect(canvas.getByTestId("drag-2")).toBeInTheDocument();
      expect(canvas.getByTestId("drag-3")).toBeInTheDocument();
      expect(canvas.getByTestId("drag-4")).toBeInTheDocument();
    });

    await step("Rows advertise drag-and-drop support", async () => {
      const rows = canvas.getAllByRole("row");
      // React Aria sets data-allows-dragging on each draggable row element.
      expect(rows[0]).toHaveAttribute("data-allows-dragging", "true");
    });
  },
};

/**
 * Empty state — when there are no items, the `renderEmptyState` prop is
 * rendered inside the grid list container.
 */
export const EmptyState: Story = {
  render: () => (
    <GridList.Root
      aria-label="Empty task list"
      selectionMode="single"
      renderEmptyState={() => (
        <Text color="fg.muted" padding="300">
          No items available
        </Text>
      )}
    >
      {[]}
    </GridList.Root>
  ),
  play: async ({
    canvasElement,
    step,
  }: {
    canvasElement: HTMLElement;
    step: (name: string, fn: () => Promise<void>) => Promise<void>;
  }) => {
    const canvas = within(canvasElement);

    await step("Shows empty state text when list has no items", async () => {
      expect(canvas.getByText("No items available")).toBeInTheDocument();
    });
  },
};
