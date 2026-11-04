import type { Meta, StoryObj } from "@storybook/react-vite";
import { createRef, useState, type ReactNode } from "react";
import {
  GridList,
  type GridListRootProps,
  Box,
  NimbusI18nProvider,
  Stack,
  Text,
} from "@commercetools/nimbus";
import {
  useDragAndDrop,
  Virtualizer,
  ListLayout,
  type Key,
} from "react-aria-components";
import { useListData } from "react-stately";
import { userEvent, within, expect, fn, waitFor } from "storybook/test";

/**
 * Storybook metadata configuration
 *
 * VRT (see chromatic-visual-testing.md): the recipe paints selected, disabled,
 * focus-visible, dragging, drop-edge, root drop-target and empty states, plus
 * the size scale and the built-in controls. They are snapshotted by
 * `SmokeTest` (size x built-ins, with a selected and a disabled item),
 * `LayoutShowcase` (stack vs grid), `Focused`, `DragInProgress`, `DropTarget`
 * and `EmptyState`. Not snapshotted: hover and pressed (`[data-hovered]` and
 * `[data-pressed]`), because a play cannot deliver a real `:hover` or React
 * Aria's hover state; and every behavior-only story (selection callbacks,
 * keyboard navigation, responsive columns, virtualized list, ref and style
 * props), whose visuals are covered by the stories above.
 */
const meta: Meta<typeof GridList.Root> = {
  title: "Components/GridList",
  component: GridList.Root,
};

export default meta;

type Story = StoryObj<typeof GridList.Root>;

/**
 * Test data: 7 items so a 3-column grid has a partial last row.
 */
const photos = [
  { id: "mountain", name: "Mountain" },
  { id: "lake", name: "Lake" },
  { id: "forest", name: "Forest" },
  { id: "desert", name: "Desert" },
  { id: "river", name: "River" },
  { id: "beach", name: "Beach" },
  { id: "canyon", name: "Canyon" },
];

const sizes = ["sm", "md", "lg"] as const;

/**
 * Items used by most stories. Extra props apply to every item.
 */
const renderItems = (
  itemProps: Partial<React.ComponentProps<typeof GridList.Item>> = {}
): ReactNode =>
  photos.map((photo) => (
    <GridList.Item
      key={photo.id}
      id={photo.id}
      textValue={photo.name}
      {...itemProps}
    >
      <Text>{photo.name}</Text>
    </GridList.Item>
  ));

const getGrid = (canvas: ReturnType<typeof within>) => canvas.getByRole("grid");

const getRow = (canvas: ReturnType<typeof within>, name: string) =>
  canvas.getByRole("row", { name });

const columnCount = (element: Element) =>
  getComputedStyle(element).gridTemplateColumns.split(" ").filter(Boolean)
    .length;

const focusedName = () => document.activeElement?.textContent;

/** Parses the first `rgb()` / `rgba()` color in a computed CSS value. */
const parseRgb = (value: string): [number, number, number] => {
  const match = value.match(/rgba?\((\d+)[, ]+(\d+)[, ]+(\d+)/);
  if (!match) throw new Error(`No rgb color in "${value}"`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
};

/**
 * The opaque background color behind an element: the nearest ancestor with a
 * non-transparent background, or white (the page default) when there is none.
 */
const backgroundBehind = (element: Element): [number, number, number] => {
  for (let node: Element | null = element; node; node = node.parentElement) {
    const color = getComputedStyle(node).backgroundColor;
    const alpha = color.match(/rgba\(.*,\s*([\d.]+)\)$/)?.[1];
    if (color !== "transparent" && alpha !== "0") return parseRgb(color);
  }
  return [255, 255, 255];
};

/** WCAG relative luminance of an sRGB color. */
const luminance = ([r, g, b]: [number, number, number]) => {
  const [lr, lg, lb] = [r, g, b].map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
};

/** WCAG contrast ratio between two sRGB colors. */
const contrastRatio = (
  a: [number, number, number],
  b: [number, number, number]
) => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
};

/**
 * A reorderable list wired to React Aria's `dragAndDropHooks`. The consumer owns
 * the state; GridList keeps none.
 */
const ReorderableList = ({
  onReorder,
  rootProps = {},
  itemProps = {},
}: {
  onReorder?: (keys: Set<Key>, target: Key) => void;
  rootProps?: Pick<
    GridListRootProps,
    | "aria-label"
    | "selectionMode"
    | "showDragHandle"
    | "showSelectionCheckbox"
    | "size"
    | "layout"
  >;
  itemProps?: Partial<React.ComponentProps<typeof GridList.Item>>;
}) => {
  const list = useListData({ initialItems: photos });
  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) =>
      [...keys].map((key) => ({
        "text/plain": list.getItem(key)?.name ?? "",
      })),
    onReorder(event) {
      onReorder?.(event.keys, event.target.key);
      if (event.target.dropPosition === "before") {
        list.moveBefore(event.target.key, event.keys);
      } else if (event.target.dropPosition === "after") {
        list.moveAfter(event.target.key, event.keys);
      }
    },
  });
  return (
    <GridList.Root
      aria-label="Reorderable photos"
      items={list.items}
      dragAndDropHooks={dragAndDropHooks}
      {...rootProps}
    >
      {(item) => (
        <GridList.Item id={item.id} textValue={item.name} {...itemProps}>
          <Text>{item.name}</Text>
        </GridList.Item>
      )}
    </GridList.Root>
  );
};

// React Aria's keyboard drag session is a module-level global that outlives
// unmount. Cancel it in the teardown so it cannot leak into the next story.
const cancelDragSession = () => () => {
  document.body.dispatchEvent(
    new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
  );
};

/**
 * Base: items render free content. No checkbox and no drag handle by default.
 * Spec: Compound parts, Collection semantics.
 */
export const Base: Story = {
  render: () => (
    <GridList.Root aria-label="Photos">
      <GridList.Item id="mountain" textValue="Mountain">
        <img
          alt=""
          width="40"
          height="40"
          src="data:image/gif;base64,R0lGODlhAQABAAAAACw="
        />
        <Text>Mountain</Text>
        <Text>Snow-covered peak</Text>
      </GridList.Item>
      <GridList.Item id="lake" textValue="Lake">
        Lake
      </GridList.Item>
      <GridList.Item id="forest" textValue="Forest">
        Forest
      </GridList.Item>
    </GridList.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Root is a named grid and items are rows", async () => {
      await waitFor(() =>
        expect(canvas.getByRole("grid", { name: "Photos" })).toBeInTheDocument()
      );
      await expect(canvas.getAllByRole("row")).toHaveLength(3);
    });

    await step("Item renders all of the consumer content", async () => {
      const row = getRow(canvas, "Mountain");
      await expect(within(row).getByText("Snow-covered peak")).toBeVisible();
      await expect(row.querySelector("img")).not.toBeNull();
    });

    await step("No built-in controls by default", async () => {
      await expect(canvas.queryByRole("checkbox")).toBeNull();
      await expect(canvasElement.querySelector('[slot="drag"]')).toBeNull();
    });
  },
};

/**
 * Single selection: pressing an item selects only that item.
 * Spec: Selection (single).
 */
export const SingleSelection: Story = {
  args: { onSelectionChange: fn() },
  render: (args) => (
    <GridList.Root
      aria-label="Single selection"
      selectionMode="single"
      onSelectionChange={args.onSelectionChange}
    >
      {renderItems()}
    </GridList.Root>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await waitFor(() => getGrid(canvas));

    await step("Press A then B: only B is selected", async () => {
      await userEvent.click(getRow(canvas, "Mountain"));
      await userEvent.click(getRow(canvas, "Lake"));
      await expect(getRow(canvas, "Lake")).toHaveAttribute(
        "aria-selected",
        "true"
      );
      await expect(getRow(canvas, "Mountain")).toHaveAttribute(
        "aria-selected",
        "false"
      );
      // React Aria passes a `Set` subclass, so compare the contents.
      const lastCall = (args.onSelectionChange as ReturnType<typeof fn>).mock
        .lastCall;
      await expect([...(lastCall?.[0] as Set<Key>)]).toEqual(["lake"]);
    });
  },
};

/**
 * Multiple selection: several items can be selected.
 * Spec: Selection (multiple).
 */
export const MultipleSelection: Story = {
  render: () => (
    <GridList.Root aria-label="Multiple selection" selectionMode="multiple">
      {renderItems()}
    </GridList.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await waitFor(() => getGrid(canvas));

    await step("Select A and C", async () => {
      await userEvent.click(getRow(canvas, "Mountain"));
      await userEvent.click(getRow(canvas, "Forest"));
      await expect(getRow(canvas, "Mountain")).toHaveAttribute(
        "aria-selected",
        "true"
      );
      await expect(getRow(canvas, "Forest")).toHaveAttribute(
        "aria-selected",
        "true"
      );
      await expect(getRow(canvas, "Lake")).toHaveAttribute(
        "aria-selected",
        "false"
      );
    });
  },
};

/**
 * Disabled items cannot be selected.
 * Spec: Selection (disabled item).
 */
export const DisabledItem: Story = {
  args: { onSelectionChange: fn() },
  render: (args) => (
    <GridList.Root
      aria-label="Disabled item"
      selectionMode="multiple"
      disabledKeys={["lake"]}
      onSelectionChange={args.onSelectionChange}
    >
      {renderItems()}
    </GridList.Root>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await waitFor(() => getGrid(canvas));

    await step("Disabled item is not selectable", async () => {
      const lake = getRow(canvas, "Lake");
      await expect(lake).toHaveAttribute("aria-disabled", "true");
      await userEvent.click(lake);
      await expect(lake).not.toHaveAttribute("aria-selected", "true");
      await expect(args.onSelectionChange).not.toHaveBeenCalled();
    });
  },
};

/**
 * With `selectionMode="none"`, pressing an item calls `onAction`. With a
 * selection mode set, Space toggles selection (the docs describe when a press
 * selects and when it calls `onAction`).
 * Spec: Selection (selection versus action).
 */
export const ActionAndSelection: Story = {
  args: { onAction: fn() },
  render: (args) => (
    <Stack gap="400">
      <GridList.Root
        aria-label="Actions only"
        selectionMode="none"
        onAction={args.onAction}
      >
        {renderItems()}
      </GridList.Root>
      <GridList.Root
        aria-label="Selection with actions"
        selectionMode="multiple"
      >
        {renderItems()}
      </GridList.Root>
    </Stack>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await waitFor(() => canvas.getByRole("grid", { name: "Actions only" }));

    await step("selectionMode none: a press calls onAction", async () => {
      const actions = within(
        canvas.getByRole("grid", { name: "Actions only" })
      );
      await userEvent.click(actions.getByRole("row", { name: "Lake" }));
      await expect(args.onAction).toHaveBeenCalledWith("lake");
      // Enter on a focused item also runs the action.
      actions.getByRole("row", { name: "Forest" }).focus();
      await userEvent.keyboard("{Enter}");
      await expect(args.onAction).toHaveBeenLastCalledWith("forest");
    });

    await step("selectionMode multiple: Space toggles selection", async () => {
      const selectable = within(
        canvas.getByRole("grid", { name: "Selection with actions" })
      );
      const row = selectable.getByRole("row", { name: "Forest" });
      row.focus();
      await userEvent.keyboard(" ");
      await expect(row).toHaveAttribute("aria-selected", "true");
    });
  },
};

/**
 * Root enables the selection checkbox for every item in multiple mode.
 * Spec: Built-in selection checkbox (Enabled on Root).
 */
export const SelectionCheckboxOnRoot: Story = {
  render: () => (
    <GridList.Root
      aria-label="Checkbox on Root"
      selectionMode="multiple"
      showSelectionCheckbox
    >
      {renderItems()}
    </GridList.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await waitFor(() => getGrid(canvas));

    await step("Every item has a checkbox", async () => {
      await expect(canvas.getAllByRole("checkbox")).toHaveLength(photos.length);
      for (const row of canvas.getAllByRole("row")) {
        await expect(within(row).getByRole("checkbox")).toBeInTheDocument();
      }
    });

    await step("The checkbox has an accessible name", async () => {
      for (const checkbox of canvas.getAllByRole("checkbox")) {
        await expect(checkbox).toHaveAccessibleName(/\S/);
      }
    });

    await step("Checking a box selects the item", async () => {
      const row = getRow(canvas, "Lake");
      await userEvent.click(within(row).getByRole("checkbox"));
      await expect(row).toHaveAttribute("aria-selected", "true");
    });
  },
};

/**
 * An item can override the Root setting.
 * Spec: Built-in selection checkbox (Item override), and the Item-enables case.
 */
export const SelectionCheckboxItemOverride: Story = {
  render: () => (
    <Stack gap="400">
      <GridList.Root
        aria-label="Root on, one item off"
        selectionMode="multiple"
        showSelectionCheckbox
      >
        <GridList.Item id="a" textValue="Alpha">
          Alpha
        </GridList.Item>
        <GridList.Item id="b" textValue="Bravo" showSelectionCheckbox={false}>
          Bravo
        </GridList.Item>
        <GridList.Item id="c" textValue="Charlie">
          Charlie
        </GridList.Item>
      </GridList.Root>
      <GridList.Root
        aria-label="Root off, one item on"
        selectionMode="multiple"
      >
        <GridList.Item id="d" textValue="Delta" showSelectionCheckbox>
          Delta
        </GridList.Item>
        <GridList.Item id="e" textValue="Echo">
          Echo
        </GridList.Item>
      </GridList.Root>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      canvas.getByRole("grid", { name: "Root on, one item off" })
    );

    await step("Item value overrides the Root value", async () => {
      const on = within(
        canvas.getByRole("grid", { name: "Root on, one item off" })
      );
      await expect(on.getAllByRole("checkbox")).toHaveLength(2);
      await expect(
        within(on.getByRole("row", { name: "Bravo" })).queryByRole("checkbox")
      ).toBeNull();

      const off = within(
        canvas.getByRole("grid", { name: "Root off, one item on" })
      );
      await expect(off.getAllByRole("checkbox")).toHaveLength(1);
      await expect(
        within(off.getByRole("row", { name: "Delta" })).getByRole("checkbox")
      ).toBeInTheDocument();
    });
  },
};

/**
 * The checkbox only appears in multiple mode.
 * Spec: Built-in selection checkbox (Not in multiple mode).
 */
export const SelectionCheckboxNotInSingleMode: Story = {
  render: () => (
    <GridList.Root
      aria-label="Single mode"
      selectionMode="single"
      showSelectionCheckbox
    >
      {renderItems()}
    </GridList.Root>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => getGrid(canvas));
    await expect(canvas.queryByRole("checkbox")).toBeNull();
  },
};

/**
 * The handle renders only when dragging is enabled, has an accessible name, and
 * comes before the checkbox and the content.
 * Spec: Built-in drag handle.
 */
export const DragHandle: Story = {
  render: () => (
    <Stack gap="400">
      <ReorderableList
        rootProps={{
          "aria-label": "With drag and drop",
          selectionMode: "multiple",
          showDragHandle: true,
          showSelectionCheckbox: true,
        }}
      />
      <GridList.Root aria-label="Without drag and drop" showDragHandle>
        {renderItems()}
      </GridList.Root>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      canvas.getByRole("grid", { name: "With drag and drop" })
    );
    const withDnd = within(
      canvas.getByRole("grid", { name: "With drag and drop" })
    );
    const withoutDnd = within(
      canvas.getByRole("grid", { name: "Without drag and drop" })
    );

    await step("Each item has a named handle", async () => {
      const handles = withDnd
        .getAllByRole("row")
        .map((row) => row.querySelector('[slot="drag"]'));
      for (const handle of handles) {
        await expect(handle).not.toBeNull();
        await expect(handle).toHaveAccessibleName(/\S/);
      }
    });

    await step("Order is handle, checkbox, children", async () => {
      const row = withDnd.getByRole("row", { name: /Mountain/ });
      const handle = row.querySelector('[slot="drag"]') as HTMLElement;
      const checkbox = within(row).getByRole("checkbox");
      const content = within(row).getByText("Mountain");
      await expect(
        handle.compareDocumentPosition(checkbox) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
      await expect(
        checkbox.compareDocumentPosition(content) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
    });

    await step("No handle without dragAndDropHooks", async () => {
      await expect(
        withoutDnd
          .getAllByRole("row")
          .some((row) => row.querySelector('[slot="drag"]'))
      ).toBe(false);
    });
  },
};

/**
 * The drag handle gets React Aria's localized default name.
 * Spec: Built-in drag handle (accessible name), Internationalization.
 */
export const DragHandleGerman: Story = {
  render: () => (
    <NimbusI18nProvider locale="de-DE">
      <ReorderableList rootProps={{ showDragHandle: true }} />
    </NimbusI18nProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => getGrid(canvas));
    const handle = getRow(canvas, "Mountain").querySelector(
      '[slot="drag"]'
    ) as HTMLElement;
    await expect(handle).toHaveAccessibleName("Mountain ziehen");
  },
};

/**
 * Keyboard drag-and-drop reorder through the handle.
 * Spec: Drag-and-drop reordering (Keyboard reorder, Drop target state).
 */
export const KeyboardReorder: Story = {
  beforeEach: cancelDragSession,
  render: () => {
    const [calls, setCalls] = useState(0);
    return (
      <>
        <ReorderableList
          rootProps={{ showDragHandle: true }}
          onReorder={() => setCalls((n) => n + 1)}
        />
        <Text data-testid="reorder-calls">{calls}</Text>
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await waitFor(() => getGrid(canvas));
    const names = () =>
      canvas.getAllByRole("row").map((row) => row.textContent?.trim());

    await step(
      "Pick up the first item and show the dragging state",
      async () => {
        const mountain = getRow(canvas, "Mountain");
        const handle = mountain.querySelector('[slot="drag"]') as HTMLElement;
        handle.focus();
        await userEvent.keyboard("{Enter}");
        await userEvent.keyboard("{ArrowDown}");
        await waitFor(() =>
          expect(mountain).toHaveAttribute("data-dragging", "true")
        );
      }
    );

    await step("Drop it after the next item", async () => {
      await userEvent.keyboard("{Enter}");
      await waitFor(() =>
        expect(canvas.getByTestId("reorder-calls")).toHaveTextContent("1")
      );
      await expect(names()[0]).not.toBe("Mountain");
    });
  },
};

/**
 * Arrow keys in a stacked list.
 * Spec: Keyboard navigation (Arrow keys in a list).
 */
export const ArrowKeysInStack: Story = {
  render: () => (
    <GridList.Root aria-label="Stack" layout="stack">
      {renderItems()}
    </GridList.Root>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => getGrid(canvas));
    getRow(canvas, "Mountain").focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(focusedName()).toContain("Lake");
  },
};

/**
 * Arrow keys in a 3-column grid at a fixed width, including the edges found in
 * the spikes (see design.md, "Spike results").
 * Spec: Keyboard navigation (Arrow keys in a grid, Grid edges).
 */
export const ArrowKeysInGrid: Story = {
  render: () => (
    <Box w="600px">
      <GridList.Root aria-label="Grid" layout="grid" columns={3}>
        {renderItems()}
      </GridList.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await waitFor(() => getGrid(canvas));
    const press = async (from: string, key: string) => {
      getRow(canvas, from).focus();
      await userEvent.keyboard(`{${key}}`);
    };

    await expect(columnCount(getGrid(canvas))).toBe(3);

    await step("Right moves one cell, Down moves one row", async () => {
      await press("Mountain", "ArrowRight");
      await expect(focusedName()).toContain("Lake");
      await press("Mountain", "ArrowDown");
      await expect(focusedName()).toContain("Desert");
    });

    await step("Down with no cell below stays", async () => {
      await press("River", "ArrowDown");
      await expect(focusedName()).toContain("River");
    });

    await step("Row ends wrap, first row ArrowUp stays", async () => {
      await press("Forest", "ArrowRight");
      await expect(focusedName()).toContain("Desert");
      await press("Desert", "ArrowLeft");
      await expect(focusedName()).toContain("Forest");
      await press("Mountain", "ArrowUp");
      await expect(focusedName()).toContain("Mountain");
    });
  },
};

/**
 * With `minChildWidth`, the column count follows the container width and the
 * Up and Down keys move by the rendered number of columns.
 * Spec: Keyboard navigation (Column count follows the width).
 */
export const ArrowKeysFollowWidth: Story = {
  render: () => (
    <Stack gap="400">
      <Box w="700px" data-testid="wide">
        <GridList.Root aria-label="Wide" layout="grid" minChildWidth="150px">
          {renderItems()}
        </GridList.Root>
      </Box>
      <Box w="320px" data-testid="narrow">
        <GridList.Root aria-label="Narrow" layout="grid" minChildWidth="150px">
          {renderItems()}
        </GridList.Root>
      </Box>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await waitFor(() => canvas.getByRole("grid", { name: "Wide" }));

    await step("Wide container: 4 columns, Down moves by 4", async () => {
      const wide = within(canvas.getByRole("grid", { name: "Wide" }));
      await expect(
        columnCount(canvas.getByRole("grid", { name: "Wide" }))
      ).toBe(4);
      wide.getByRole("row", { name: "Mountain" }).focus();
      await userEvent.keyboard("{ArrowDown}");
      await expect(focusedName()).toContain("River");
    });

    await step("Narrow container: 2 columns, Down moves by 2", async () => {
      const narrow = within(canvas.getByRole("grid", { name: "Narrow" }));
      await expect(
        columnCount(canvas.getByRole("grid", { name: "Narrow" }))
      ).toBe(2);
      narrow.getByRole("row", { name: "Mountain" }).focus();
      await userEvent.keyboard("{ArrowDown}");
      await expect(focusedName()).toContain("Forest");
    });
  },
};

/**
 * Rows with inputs need `keyboardNavigationBehavior="tab"`.
 * Spec: Keyboard navigation (Items with inputs).
 */
export const TabNavigationWithInputs: Story = {
  render: () => (
    <GridList.Root
      aria-label="Rows with inputs"
      selectionMode="multiple"
      keyboardNavigationBehavior="tab"
    >
      {photos.slice(0, 3).map((photo) => (
        <GridList.Item key={photo.id} id={photo.id} textValue={photo.name}>
          <input aria-label={`${photo.name} title`} defaultValue="" />
        </GridList.Item>
      ))}
    </GridList.Root>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => getGrid(canvas));
    const input = canvas.getByLabelText("Mountain title") as HTMLInputElement;
    input.focus();
    await userEvent.keyboard("abc ");
    await expect(input.value).toBe("abc ");
    await expect(getRow(canvas, "Mountain")).toHaveAttribute(
      "aria-selected",
      "false"
    );
  },
};

/**
 * Keyboard focus shows a visible focus ring.
 * Spec: Keyboard navigation (Focus ring).
 */
export const FocusRing: Story = {
  render: () => (
    <GridList.Root aria-label="Focus" selectionMode="multiple">
      {renderItems()}
    </GridList.Root>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => getGrid(canvas));
    await userEvent.tab();
    const focused = document.activeElement as HTMLElement;
    await expect(focused).toHaveAttribute("role", "row");
    await expect(focused).toHaveAttribute("data-focus-visible", "true");
    const style = getComputedStyle(focused);
    const hasRing =
      (style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0) ||
      style.boxShadow !== "none";
    await expect(hasRing).toBe(true);
  },
};

/**
 * Responsive `columns`: the responsive object resolves against the viewport.
 * Spec: Responsive layout (Responsive columns).
 */
export const ResponsiveColumns: Story = {
  render: () => (
    <GridList.Root
      aria-label="Responsive"
      layout="grid"
      columns={{ base: 1, md: 3 }}
    >
      {renderItems()}
    </GridList.Root>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => getGrid(canvas));
    // Chakra's `md` breakpoint is 48em.
    const atLeastMd = window.matchMedia("(min-width: 48em)").matches;
    await expect(columnCount(getGrid(canvas))).toBe(atLeastMd ? 3 : 1);
  },
};

/**
 * `layout="stack"` ignores `columns` and uses one column.
 * Spec: Responsive layout (Stack layout).
 */
export const StackIgnoresColumns: Story = {
  render: () => (
    <GridList.Root aria-label="Stack with columns" layout="stack" columns={3}>
      {renderItems()}
    </GridList.Root>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => getGrid(canvas));
    await expect(columnCount(getGrid(canvas))).toBe(1);
  },
};

/**
 * `gap` overrides the gap that comes from `size`.
 * Spec: Responsive layout (Gap override).
 */
export const GapOverride: Story = {
  render: () => (
    <Stack gap="400">
      <GridList.Root
        aria-label="Default gap"
        size="lg"
        layout="grid"
        columns={2}
      >
        {renderItems()}
      </GridList.Root>
      <GridList.Root
        aria-label="No gap"
        size="lg"
        layout="grid"
        columns={2}
        gap="0"
      >
        {renderItems()}
      </GridList.Root>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => canvas.getByRole("grid", { name: "Default gap" }));
    const defaultGap = getComputedStyle(
      canvas.getByRole("grid", { name: "Default gap" })
    ).rowGap;
    const noGap = getComputedStyle(
      canvas.getByRole("grid", { name: "No gap" })
    ).rowGap;
    await expect(parseFloat(defaultGap)).toBeGreaterThan(0);
    await expect(parseFloat(noGap)).toBe(0);
  },
};

/**
 * GridList inside React Aria's `Virtualizer` with `ListLayout`: the items render
 * and `ListLayout` positions them, so `columns`, `minChildWidth` and `gap` do
 * not apply. `GridLayout` is not covered: it rendered no items in this test
 * setup, even for a plain React Aria `GridList` (see design.md, D8).
 * Spec: Responsive layout (Virtualized list).
 */
export const Virtualized: Story = {
  // React Aria's virtualizer reads `process.env.NODE_ENV`. Application bundlers
  // define it; this browser test runner does not, so define it for this story.
  beforeEach: () => {
    const scope = globalThis as { process?: { env: Record<string, string> } };
    if (!scope.process) {
      scope.process = { env: { NODE_ENV: "test" } };
    }
  },
  render: () => {
    const items = Array.from({ length: 500 }, (_, index) => ({
      id: String(index),
      name: `Item ${index}`,
    }));
    return (
      <Box w="600px">
        <Virtualizer layout={ListLayout} layoutOptions={{ rowSize: 40 }}>
          <GridList.Root
            aria-label="Virtualized"
            items={items}
            display="block"
            h="300px"
            w="100%"
          >
            {(item) => (
              <GridList.Item id={item.id} textValue={item.name}>
                {item.name}
              </GridList.Item>
            )}
          </GridList.Root>
        </Virtualizer>
      </Box>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => getGrid(canvas));
    await waitFor(() =>
      expect(canvas.getAllByRole("row").length).toBeGreaterThan(0)
    );
    await expect(getRow(canvas, "Item 0")).toBeInTheDocument();
  },
};

/**
 * Sizes: padding and the drag handle scale; the checkbox keeps one size.
 * Spec: Size.
 */
export const Sizes: Story = {
  render: () => (
    <Stack gap="400">
      {sizes.map((size) => (
        <ReorderableList
          key={size}
          rootProps={{
            "aria-label": `Size ${size}`,
            size,
            selectionMode: "multiple",
            showSelectionCheckbox: true,
            showDragHandle: true,
          }}
        />
      ))}
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await waitFor(() => canvas.getByRole("grid", { name: "Size sm" }));
    const rowOf = (size: string) =>
      within(canvas.getByRole("grid", { name: `Size ${size}` })).getAllByRole(
        "row"
      )[0] as HTMLElement;
    const padding = (row: HTMLElement) =>
      parseFloat(getComputedStyle(row).paddingTop);

    await step("Item padding grows with size", async () => {
      await expect(padding(rowOf("sm"))).toBeLessThan(padding(rowOf("md")));
      await expect(padding(rowOf("md"))).toBeLessThan(padding(rowOf("lg")));
    });

    await step("Drag handle grows with size", async () => {
      const handle = (size: string) =>
        (
          rowOf(size).querySelector('[slot="drag"]') as HTMLElement
        ).getBoundingClientRect().height;
      await expect(handle("sm")).toBeLessThan(handle("md"));
      await expect(handle("md")).toBeLessThan(handle("lg"));
    });

    await step("Checkbox keeps one size", async () => {
      const box = (size: string) =>
        within(rowOf(size))
          .getByRole("checkbox")
          .closest("label")!
          .getBoundingClientRect().height;
      await expect(box("sm")).toBe(box("md"));
      await expect(box("lg")).toBe(box("md"));
    });
  },
};

/**
 * Default size is `md`.
 * Spec: Size (Default size).
 */
export const DefaultSize: Story = {
  render: () => (
    <Stack gap="400">
      <GridList.Root aria-label="Default">{renderItems()}</GridList.Root>
      <GridList.Root aria-label="Explicit md" size="md">
        {renderItems()}
      </GridList.Root>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => canvas.getByRole("grid", { name: "Default" }));
    const padding = (name: string) =>
      parseFloat(
        getComputedStyle(
          within(canvas.getByRole("grid", { name })).getAllByRole("row")[0]
        ).paddingTop
      );
    await expect(padding("Default")).toBe(padding("Explicit md"));
  },
};

/**
 * A selected item looks different from an unselected one without a container.
 * Spec: Visual states (Selected without container), Items have no container at
 * rest.
 */
export const SelectedStyle: Story = {
  render: () => (
    <GridList.Root
      aria-label="Selected style"
      selectionMode="multiple"
      defaultSelectedKeys={["lake"]}
    >
      {renderItems()}
    </GridList.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await waitFor(() => getGrid(canvas));
    const paint = (row: HTMLElement) => {
      const style = getComputedStyle(row);
      return [style.backgroundColor, style.boxShadow, style.outlineColor].join(
        "|"
      );
    };

    await step("No container at rest", async () => {
      const style = getComputedStyle(getRow(canvas, "Mountain"));
      await expect(style.backgroundColor).toBe("rgba(0, 0, 0, 0)");
      await expect(parseFloat(style.borderTopWidth)).toBe(0);
    });

    await step(
      "Selected edge has at least 3:1 contrast (WCAG 1.4.11)",
      async () => {
        const edge = parseRgb(
          getComputedStyle(getRow(canvas, "Lake")).boxShadow
        );
        const page = backgroundBehind(getRow(canvas, "Mountain"));
        await expect(contrastRatio(edge, page)).toBeGreaterThanOrEqual(3);
      }
    );

    await step("Selected differs from unselected", async () => {
      await expect(paint(getRow(canvas, "Lake"))).not.toBe(
        paint(getRow(canvas, "Mountain"))
      );
    });
  },
};

/**
 * Default and custom empty states.
 * Spec: Empty state.
 */
export const EmptyState: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack gap="400">
      <GridList.Root aria-label="Default empty">{[]}</GridList.Root>
      <GridList.Root
        aria-label="Custom empty"
        renderEmptyState={() => <Text>Nothing here yet</Text>}
      >
        {[]}
      </GridList.Root>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByText("No items available")).toBeVisible()
    );
    await expect(canvas.getByText("Nothing here yet")).toBeVisible();
  },
};

/**
 * Style props and ref reach the grid element.
 * Spec: Style props and ref.
 */
export const StylePropsAndRef: Story = {
  render: () => {
    const ref = createRef<HTMLDivElement>();
    (globalThis as Record<string, unknown>).__gridListRef = ref;
    return (
      <GridList.Root ref={ref} aria-label="Styled" w="400px">
        {renderItems()}
      </GridList.Root>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => getGrid(canvas));
    await expect(getGrid(canvas).getBoundingClientRect().width).toBe(400);
    const ref = (globalThis as Record<string, unknown>)
      .__gridListRef as React.RefObject<HTMLDivElement>;
    await expect(ref.current).toBe(getGrid(canvas));
  },
};

/**
 * Type checks: the types forbid `columns` together with `minChildWidth`, and
 * span props. Each `@ts-expect-error` fails the typecheck if the line is valid.
 * Spec: Responsive layout (Both column props), Non-goal: no span props.
 */
export const TypeSafety: Story = {
  render: () => (
    <>
      {/* @ts-expect-error columns and minChildWidth are mutually exclusive */}
      <GridList.Root aria-label="Both" columns={2} minChildWidth="100px">
        {renderItems()}
      </GridList.Root>
      <GridList.Root aria-label="Span">
        {/* @ts-expect-error span props are not exposed */}
        <GridList.Item id="span" textValue="Span" colSpan={2}>
          Span
        </GridList.Item>
      </GridList.Root>
    </>
  ),
  play: async ({ canvasElement }) => {
    // Render-only: the assertion is the typecheck, but both grids must render.
    await waitFor(() =>
      expect(within(canvasElement).getAllByRole("grid")).toHaveLength(2)
    );
  },
};

/**
 * A small fixed list for the visual stories: one selected, one plain and one
 * disabled item. Dragging is enabled only when the handle is shown.
 */
const VisualList = ({
  size,
  showSelectionCheckbox,
  showDragHandle,
}: Pick<
  GridListRootProps,
  "size" | "showSelectionCheckbox" | "showDragHandle"
>) => {
  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) => [...keys].map((key) => ({ "text/plain": String(key) })),
  });
  return (
    <GridList.Root
      aria-label={`${size} list`}
      size={size}
      selectionMode="multiple"
      defaultSelectedKeys={["lake"]}
      disabledKeys={["forest"]}
      showSelectionCheckbox={showSelectionCheckbox}
      showDragHandle={showDragHandle}
      dragAndDropHooks={showDragHandle ? dragAndDropHooks : undefined}
    >
      <GridList.Item id="mountain" textValue="Mountain">
        <Text>Mountain</Text>
      </GridList.Item>
      <GridList.Item id="lake" textValue="Lake">
        <Text>Lake (selected)</Text>
      </GridList.Item>
      <GridList.Item id="forest" textValue="Forest">
        <Text>Forest (disabled)</Text>
      </GridList.Item>
    </GridList.Root>
  );
};

/**
 * SmokeTest - the visual permutation grid. Axes: size (sm, md, lg) x built-in
 * controls (none, checkbox, handle, both). Each list shows a selected, a plain
 * and a disabled item. The axes interact (the controls scale and move with the
 * size), so they share one frame.
 */
export const SmokeTest: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack gap="600">
      {sizes.map((size) => (
        <Stack key={size} direction="row" gap="400" alignItems="flex-start">
          <VisualList size={size} />
          <VisualList size={size} showSelectionCheckbox />
          <VisualList size={size} showDragHandle />
          <VisualList size={size} showSelectionCheckbox showDragHandle />
        </Stack>
      ))}
    </Stack>
  ),
};

/**
 * LayoutShowcase - the stack layout next to a 3-column grid with the same
 * items, selected and disabled items included. Fixed column count and width so
 * the frame does not depend on the viewport.
 */
export const LayoutShowcase: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack gap="600">
      <Box w="300px">
        <GridList.Root
          aria-label="Stack layout"
          layout="stack"
          selectionMode="multiple"
          defaultSelectedKeys={["lake"]}
          disabledKeys={["forest"]}
        >
          {renderItems()}
        </GridList.Root>
      </Box>
      <Box w="600px">
        <GridList.Root
          aria-label="Grid layout"
          layout="grid"
          columns={3}
          selectionMode="multiple"
          defaultSelectedKeys={["lake"]}
          disabledKeys={["forest"]}
        >
          {renderItems()}
        </GridList.Root>
      </Box>
    </Stack>
  ),
};

/**
 * Focused - the keyboard focus ring on an item. It ends focused on purpose:
 * the ring is the frame.
 */
export const Focused: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Box w="300px">
      <GridList.Root aria-label="Focus" selectionMode="multiple">
        {renderItems()}
      </GridList.Root>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => getGrid(canvas));
    await userEvent.tab();
    await waitFor(() =>
      expect(document.activeElement).toHaveAttribute(
        "data-focus-visible",
        "true"
      )
    );
  },
};

/**
 * DragInProgress - a keyboard drag left mid-flight, for the surfaces a resting
 * list cannot show: the lifted item (`data-dragging`) and the drop edge on the
 * neighbouring item.
 */
export const DragInProgress: Story = {
  tags: ["vrt"],
  parameters: {
    chromatic: { disableSnapshot: false },
    a11y: {
      // The mid-drag frame carries transient, by-design findings that are React
      // Aria's, not the component's: it marks the lifted item `aria-hidden`
      // while it keeps its roving tabindex, and the recipe dims the lifted item
      // (opacity 0.6) as the "being moved" affordance, which lowers its text
      // contrast. The item is `aria-hidden` while dragged, so assistive
      // technology reads the live-region announcement instead.
      config: {
        rules: [
          { id: "aria-hidden-focus", enabled: false },
          { id: "color-contrast", enabled: false },
          { id: "color-contrast-apca-custom", enabled: false },
        ],
      },
    },
  },
  beforeEach: cancelDragSession,
  render: () => (
    <Box w="300px">
      <ReorderableList rootProps={{ showDragHandle: true }} />
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => getGrid(canvas));
    const mountain = getRow(canvas, "Mountain");
    const handle = mountain.querySelector('[slot="drag"]') as HTMLElement;
    handle.focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard("{ArrowDown}");
    await waitFor(() =>
      expect(mountain).toHaveAttribute("data-dragging", "true")
    );
  },
};

/**
 * DropTarget - the whole list marked as a drop target while an accepted drag
 * hovers it (recipe: primary outline). React Aria sets `data-drop-target` from
 * native drag events, so the play dispatches synthetic `dragenter` and
 * `dragover` events and leaves them active for the capture.
 */
export const DropTarget: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => {
    const Droppable = () => {
      const { dragAndDropHooks } = useDragAndDrop({
        acceptedDragTypes: ["text/plain"],
        getDropOperation: () => "copy",
        // A no-op drop handler is enough to make the list a drop target.
        onRootDrop() {},
      });
      return (
        <Box w="300px">
          <GridList.Root
            aria-label="Droppable"
            dragAndDropHooks={dragAndDropHooks}
          >
            {renderItems()}
          </GridList.Root>
        </Box>
      );
    };
    return <Droppable />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => getGrid(canvas));
    const grid = getGrid(canvas);
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
      grid.dispatchEvent(event);
    }
    await waitFor(() =>
      expect(grid).toHaveAttribute("data-drop-target", "true")
    );
  },
};

/**
 * DragInProgressRtl - the same mid-drag frame in a right-to-left context, for
 * the drop edge that flips sides.
 */
export const DragInProgressRtl: Story = {
  ...DragInProgress,
  render: () => (
    <Box dir="rtl" w="300px">
      <ReorderableList rootProps={{ showDragHandle: true }} />
    </Box>
  ),
};
