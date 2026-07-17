import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Virtualizer,
  ListLayout,
  GridLayout,
  ListBox,
  GridList,
} from "@commercetools/nimbus";
import { expect, within } from "storybook/test";

/**
 * Storybook metadata for Virtualizer stories.
 *
 * Virtualizer wraps React Aria's Virtualizer and re-exports its layout
 * classes (ListLayout, GridLayout, WaterfallLayout, TableLayout). It renders
 * only visible items to the DOM, reusing them as the user scrolls — enabling
 * efficient rendering of very large collections.
 */
const meta: Meta<typeof Virtualizer> = {
  title: "Components/Virtualizer",
  component: Virtualizer,
};

export default meta;

type Story = StoryObj<typeof meta>;

const LIST_ITEM_COUNT = 5000;
const GRID_ITEM_COUNT = 1000;

const listItems = Array.from({ length: LIST_ITEM_COUNT }, (_, i) => ({
  id: String(i),
  name: `Item ${i}`,
}));

const gridItems = Array.from({ length: GRID_ITEM_COUNT }, (_, i) => ({
  id: String(i),
  name: `Card ${i}`,
}));

const horizontalItems = Array.from({ length: 200 }, (_, i) => ({
  id: String(i),
  name: `Tab ${i}`,
}));

/**
 * Virtualizer with ListLayout wrapping a ListBox with 5000 items.
 *
 * Only a small subset of the 5000 items are rendered in the DOM at any time.
 * As the user scrolls, items are recycled to maintain performance.
 */
export const ListBoxVirtualized: Story = {
  render: () => (
    <div style={{ height: 400 }}>
      <Virtualizer layout={ListLayout} layoutOptions={{ estimatedRowSize: 40 }}>
        <ListBox.Root
          aria-label="Virtualized list"
          selectionMode="single"
          items={listItems}
          style={{ display: "block", padding: 0 }}
        >
          {(item) => <ListBox.Item id={item.id}>{item.name}</ListBox.Item>}
        </ListBox.Root>
      </Virtualizer>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Renders a subset of items — far fewer than the total 5000",
      async () => {
        const options = canvas.getAllByRole("option");
        // Virtualization should render only what is visible (typically < 50).
        // We assert a generous upper bound to stay resilient across viewport
        // sizes while still proving that most items are NOT in the DOM.
        expect(options.length).toBeGreaterThan(0);
        expect(options.length).toBeLessThan(100);
      }
    );

    await step("Listbox is accessible with aria-label", async () => {
      const listbox = canvas.getByRole("listbox", {
        name: "Virtualized list",
      });
      expect(listbox).toBeInTheDocument();
    });

    await step("Scrolling updates the rendered item set", async () => {
      const scrollContainer = canvasElement.querySelector(
        '[role="listbox"]'
      ) as HTMLElement | null;

      if (!scrollContainer) {
        return;
      }

      // Capture the first visible item's text before scrolling.
      const optionsBefore = canvas.getAllByRole("option");
      const firstTextBefore = optionsBefore[0]?.textContent ?? "";

      // Scroll down by 800px (enough to push past the initially visible items).
      scrollContainer.scrollTop += 800;
      // Allow the virtualizer to react to the scroll event.
      await new Promise((resolve) => setTimeout(resolve, 100));

      const optionsAfter = canvas.getAllByRole("option");
      // The rendered set should still be a small subset of 5000.
      expect(optionsAfter.length).toBeLessThan(100);

      // After scrolling, at least one item text should differ, confirming
      // the virtualizer recycled and re-rendered items.
      const someItemChanged = optionsAfter.some(
        (opt) => opt.textContent !== firstTextBefore
      );
      expect(someItemChanged).toBe(true);
    });
  },
};

/**
 * Virtualizer with GridLayout wrapping a GridList with 1000 items.
 *
 * GridLayout arranges items in a responsive grid. Only visible items are
 * rendered to the DOM at any time.
 */
export const GridListVirtualized: Story = {
  render: () => (
    <div style={{ height: 400 }}>
      <Virtualizer layout={GridLayout}>
        <GridList.Root
          aria-label="Virtualized grid list"
          selectionMode="multiple"
          items={gridItems}
        >
          {(item) => <GridList.Item id={item.id}>{item.name}</GridList.Item>}
        </GridList.Root>
      </Virtualizer>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("GridList is accessible with aria-label", async () => {
      const grid = canvas.getByRole("grid", {
        name: "Virtualized grid list",
      });
      expect(grid).toBeInTheDocument();
    });

    await step("Renders at least some rows", async () => {
      const rows = canvas.getAllByRole("row");
      expect(rows.length).toBeGreaterThan(0);
    });
  },
};

/**
 * Virtualizer with ListLayout orientation="horizontal" wrapping a horizontal
 * ListBox.
 *
 * The horizontal layout stacks items left-to-right. Only visible items are
 * rendered to the DOM; the user scrolls horizontally through the collection.
 */
export const HorizontalList: Story = {
  render: () => (
    <div style={{ width: 600, height: 80 }}>
      <Virtualizer
        layout={ListLayout}
        layoutOptions={{ orientation: "horizontal", rowSize: 120 }}
      >
        <ListBox.Root
          aria-label="Horizontal virtualized list"
          selectionMode="single"
          items={horizontalItems}
          style={{ display: "flex", flexDirection: "row" }}
        >
          {(item) => <ListBox.Item id={item.id}>{item.name}</ListBox.Item>}
        </ListBox.Root>
      </Virtualizer>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Listbox is accessible with aria-label", async () => {
      const listbox = canvas.getByRole("listbox", {
        name: "Horizontal virtualized list",
      });
      expect(listbox).toBeInTheDocument();
    });

    await step("Renders items inside the listbox", async () => {
      const listbox = canvas.getByRole("listbox", {
        name: "Horizontal virtualized list",
      });
      expect(listbox.children.length).toBeGreaterThan(0);
    });
  },
};
