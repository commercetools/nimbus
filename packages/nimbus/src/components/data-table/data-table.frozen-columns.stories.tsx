// DataTable stories for frozen (sticky) columns: backgrounds, scroll shadows, focus rings and outlines above them.
// They share the title of data-table.stories.tsx, so Storybook lists them
// under one DataTable entry and the story ids stay the same.

import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { within, expect, waitFor, userEvent } from "storybook/test";
import { Box, Button, Stack, Text, DataTable } from "@/components";

import type {
  DataTableRowItem,
  DataTableColumnItem,
  DataTableProps,
} from "./data-table.types";
import { behaviourColumns, behaviourRows } from "./data-table.test-data";
import { rowNamed } from "./utils/data-table.test-utils";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<object> = {
  title: "Components/DataTable",
  component: DataTable,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<DataTableProps>;

export const StickyColumnBackground: Story = {
  // VRT: the sticky column's own background over scrolled cells.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => {
    const stickyColumns: DataTableColumnItem[] = [
      {
        id: "name",
        header: "Full Name",
        accessor: (row) => row.name as React.ReactNode,
        minWidth: 150,
      },
      ...Array.from({ length: 8 }, (_, i) => ({
        id: `col-${i}`,
        header: `Column ${i + 1}`,
        accessor: (row: Record<string, unknown>) =>
          (row[`col${i}`] || `Value ${i + 1}`) as React.ReactNode,
        minWidth: 180,
      })),
    ];

    const stickyRows: DataTableRowItem[] = Array.from(
      { length: 15 },
      (_, i) => ({
        id: `${i + 1}`,
        name: `Employee ${i + 1}`,
        ...Object.fromEntries(
          Array.from({ length: 8 }, (_, j) => [
            `col${j}`,
            `Data R${i + 1}C${j + 1}`,
          ])
        ),
      })
    );

    return (
      <Box maxW="600px">
        <DataTable
          columns={stickyColumns}
          rows={stickyRows}
          maxHeight="300px"
          selectionMode="multiple"
        />
      </Box>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Table renders with sticky elements", async () => {
      const table = await canvas.findByRole("grid");
      expect(table).toBeInTheDocument();

      expect(canvas.getByText("Employee 1")).toBeInTheDocument();
    });

    await step("Sticky cells have opaque background", async () => {
      const stickyCells = canvasElement.querySelectorAll(
        ".data-table-sticky-cell"
      );
      expect(stickyCells.length).toBeGreaterThan(0);

      const stickyCell = stickyCells[0] as HTMLElement;
      const bg = window.getComputedStyle(stickyCell).backgroundColor;
      expect(bg).not.toBe("transparent");
      expect(bg).not.toBe("rgba(0, 0, 0, 0)");
    });

    await step(
      "Selected row sticky cells still show selection highlight",
      async () => {
        const rows = canvasElement.querySelectorAll("tbody tr");
        const firstDataRow = rows[0] as HTMLElement;
        const checkbox = within(firstDataRow).getByRole("checkbox");
        await userEvent.click(checkbox);

        const selectedRow = canvasElement.querySelector(
          "tr[aria-selected='true']"
        );
        expect(selectedRow).toBeInTheDocument();

        const stickyInSelected = selectedRow?.querySelector(
          ".data-table-sticky-cell"
        ) as HTMLElement | null;
        if (stickyInSelected) {
          const bg = window.getComputedStyle(stickyInSelected).backgroundColor;
          expect(bg).not.toBe("transparent");
          expect(bg).not.toBe("rgba(0, 0, 0, 0)");
        }
      }
    );

    (document.activeElement as HTMLElement | null)?.blur();
  },
};

export const ScrollShadows: Story = {
  // VRT: both scroll shadows at once; they only paint mid-scroll, so the play lands there.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => {
    const scrollColumns: DataTableColumnItem[] = [
      {
        id: "name",
        header: "Name",
        accessor: (row) => row.name as React.ReactNode,
        minWidth: 150,
      },
      ...Array.from({ length: 10 }, (_, i) => ({
        id: `col-${i}`,
        header: `Column ${i + 1}`,
        accessor: (row: Record<string, unknown>) =>
          (row[`col${i}`] || `Value ${i + 1}`) as React.ReactNode,
        minWidth: 200,
      })),
    ];

    const scrollRows: DataTableRowItem[] = Array.from(
      { length: 10 },
      (_, i) => ({
        id: `${i + 1}`,
        name: `Employee ${i + 1}`,
        ...Object.fromEntries(
          Array.from({ length: 10 }, (_, j) => [
            `col${j}`,
            `Data R${i + 1}C${j + 1}`,
          ])
        ),
      })
    );

    return (
      <Box maxW="700px" data-testid="scroll-shadow-container">
        <DataTable
          columns={scrollColumns}
          rows={scrollRows}
          selectionMode="multiple"
          data-testid="scroll-shadow-table"
        />
      </Box>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Table renders with scroll attributes", async () => {
      const table = await canvas.findByRole("grid");
      expect(table).toBeInTheDocument();

      const root = table.closest(
        '[data-testid="scroll-shadow-table"]'
      ) as HTMLElement;
      expect(root).toBeInTheDocument();
    });

    await step(
      "No left shadow at initial scroll position (scrolled to start)",
      async () => {
        const root = canvasElement.querySelector(
          '[data-testid="scroll-shadow-table"]'
        ) as HTMLElement;

        await waitFor(() => {
          expect(root.getAttribute("data-scroll-left")).toBe("false");
        });
      }
    );

    await step(
      "Right shadow present when content overflows to the right",
      async () => {
        const root = canvasElement.querySelector(
          '[data-testid="scroll-shadow-table"]'
        ) as HTMLElement;

        await waitFor(() => {
          expect(root.getAttribute("data-scroll-right")).toBe("true");
        });
      }
    );

    await step("Left shadow appears after scrolling right", async () => {
      const root = canvasElement.querySelector(
        '[data-testid="scroll-shadow-table"]'
      ) as HTMLElement;

      root.scrollLeft = 200;
      root.dispatchEvent(new Event("scroll"));

      await waitFor(() => {
        expect(root.getAttribute("data-scroll-left")).toBe("true");
      });

      const stickyCells = canvasElement.querySelectorAll(
        ".data-table-sticky-cell:not([data-slot='pin-row-cell'])"
      );
      expect(stickyCells.length).toBeGreaterThan(0);
    });

    await step("Right shadow disappears when scrolled to the end", async () => {
      const root = canvasElement.querySelector(
        '[data-testid="scroll-shadow-table"]'
      ) as HTMLElement;

      root.scrollLeft = root.scrollWidth - root.clientWidth;
      root.dispatchEvent(new Event("scroll"));

      await waitFor(() => {
        expect(root.getAttribute("data-scroll-right")).toBe("false");
      });
    });

    await step("Left shadow clears again at scroll start", async () => {
      const root = canvasElement.querySelector(
        '[data-testid="scroll-shadow-table"]'
      ) as HTMLElement;

      root.scrollLeft = 0;
      root.dispatchEvent(new Event("scroll"));

      await waitFor(() => {
        expect(root.getAttribute("data-scroll-left")).toBe("false");
        expect(root.getAttribute("data-scroll-right")).toBe("true");
      });
    });

    await step("Both shadows paint mid-scroll", async () => {
      const root = canvasElement.querySelector(
        '[data-testid="scroll-shadow-table"]'
      ) as HTMLElement;

      root.scrollLeft = 200;
      root.dispatchEvent(new Event("scroll"));

      await waitFor(() => {
        expect(root.getAttribute("data-scroll-left")).toBe("true");
        expect(root.getAttribute("data-scroll-right")).toBe("true");
      });
    });
  },
};

const zIndexOf = (el: Element) => Number(getComputedStyle(el).zIndex) || 0;

/** The frozen (sticky) cells of the row that contains `el`. */
const frozenCellsOfRow = (el: Element) =>
  Array.from(
    el.closest('[role="row"]')?.querySelectorAll("td, th") ?? []
  ).filter((cell) => getComputedStyle(cell).position === "sticky");

/**
 * Checks that the keyboard focus ring of `el` is drawn inside its own box and
 * above every frozen cell of its row, so neither a neighbouring cell, the next
 * row nor a frozen column can paint over it.
 */
const expectFocusRingOnTop = (el: HTMLElement) => {
  const ring = getComputedStyle(el, "::after");
  expect(ring.outlineStyle).toBe("solid");
  expect(parseFloat(ring.outlineOffset)).toBeLessThan(0);
  expect(getComputedStyle(el).outlineStyle).toBe("none");
  const frozenCells = frozenCellsOfRow(el);
  expect(frozenCells.length).toBeGreaterThan(0);
  for (const frozen of frozenCells) {
    expect(Number(ring.zIndex)).toBeGreaterThan(zIndexOf(frozen));
  }
};

const renderFrozenCellsTable = () => (
  <DataTable
    columns={behaviourColumns}
    rows={behaviourRows}
    selectionMode="multiple"
    allowsPinning
    renderNestedContent={(row) => <Text>Details for {String(row.name)}</Text>}
    aria-label="Focus ring and frozen cells"
  />
);

/**
 * A focused row keeps its whole focus ring visible. The frozen selection,
 * expand and pin cells used to cover its left and right ends.
 */
export const RowFocusRingAboveFrozenCells: Story = {
  render: renderFrozenCellsTable,
  // VRT: a focused row's ring, complete on all four sides above frozen cells.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await canvas.findByText("Linus");

    await step(
      "The row's focus ring is drawn above the frozen cells",
      async () => {
        rowNamed(canvasElement, /Ada/).focus();
        await userEvent.keyboard("{ArrowDown}");
        const row = rowNamed(canvasElement, /Grace/);
        await waitFor(() => expect(row).toHaveAttribute("data-focus-visible"));
        expectFocusRingOnTop(row);
      }
    );
  },
};

/**
 * A focused cell keeps its whole focus ring visible. The frozen expand cell
 * on its left and the next row used to cover parts of it.
 */
export const CellFocusRingAboveFrozenCells: Story = {
  render: renderFrozenCellsTable,
  // VRT: a focused cell's ring, complete on all four sides above frozen cells.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await canvas.findByText("Linus");

    await step(
      "The cell's focus ring is drawn above the frozen cells",
      async () => {
        rowNamed(canvasElement, /Grace/).focus();
        // Selection checkbox, expand button, then the first data cell.
        await userEvent.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}");
        const cell = within(rowNamed(canvasElement, /Grace/))
          .getByText("Grace")
          .closest('[role="rowheader"], [role="gridcell"]') as HTMLElement;
        await waitFor(() => expect(cell).toHaveAttribute("data-focus-visible"));
        expectFocusRingOnTop(cell);
      }
    );
  },
};

/**
 * A focused column header keeps its whole focus ring visible, and with a
 * sticky header, frozen body cells scroll behind the header, not over it.
 */
export const HeaderFocusRingAndStickyHeader: Story = {
  render: () => (
    <DataTable
      columns={behaviourColumns}
      rows={behaviourRows}
      selectionMode="multiple"
      allowsPinning
      maxHeight="160px"
      aria-label="Header focus ring"
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await canvas.findByText("Linus");
    const header = canvasElement.querySelector("thead") as HTMLElement;
    const ada = rowNamed(canvasElement, /Ada/);

    await step("The header is above every frozen body cell", async () => {
      for (const frozen of frozenCellsOfRow(ada)) {
        expect(zIndexOf(header)).toBeGreaterThan(zIndexOf(frozen));
      }
    });

    await step("A body row's focus ring stays below the header", async () => {
      ada.focus();
      await waitFor(() => expect(ada).toHaveAttribute("data-focus-visible"));
      const ring = getComputedStyle(ada, "::after");
      expect(Number(ring.zIndex)).toBeLessThan(zIndexOf(header));
    });

    await step("A column header's focus ring is drawn inside it", async () => {
      await userEvent.keyboard("{ArrowRight}{ArrowRight}{ArrowUp}");
      const nameHeader = within(header)
        .getByText("Name")
        .closest('[role="columnheader"]') as HTMLElement;
      await waitFor(() =>
        expect(nameHeader.contains(document.activeElement)).toBe(true)
      );
      expectFocusRingOnTop(document.activeElement as HTMLElement);
    });
  },
};

/**
 * Drags a column's resize handle horizontally by `dx` pixels. `whileHeld`
 * runs after the move and before the mouse button is released.
 */
const dragColumnResizer = async (
  columnHeader: HTMLElement,
  dx: number,
  whileHeld?: () => Promise<void>
) => {
  const handle = columnHeader.querySelector(
    ".react-aria-ColumnResizer > *"
  ) as HTMLElement;
  const box = handle.getBoundingClientRect();
  const x = box.left + box.width / 2;
  const y = box.top + box.height / 2;
  await userEvent.pointer([
    {
      keys: "[MouseLeft>]",
      target: handle,
      coords: { clientX: x, clientY: y, pageX: x, pageY: y },
    },
    {
      target: handle,
      coords: { clientX: x + dx, clientY: y, pageX: x + dx, pageY: y },
    },
  ]);
  await whileHeld?.();
  await userEvent.pointer([
    {
      keys: "[/MouseLeft]",
      target: handle,
      coords: { clientX: x + dx, clientY: y, pageX: x + dx, pageY: y },
    },
  ]);
};

/**
 * While a column is dragged wider than the table can show, the table scrolls
 * along, so the dragged edge stays left of the pin column where the mouse can
 * still reach it.
 */
export const ResizedColumnEdgeStaysInView: Story = {
  render: () => (
    <Box w="700px">
      <DataTable
        columns={behaviourColumns}
        rows={behaviourRows}
        isResizable
        selectionMode="multiple"
        allowsPinning
        aria-label="Resizable table with a pin column"
      />
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await canvas.findByText("Linus");
    const table = canvas.getByRole("grid");
    const container = table.parentElement as HTMLElement;
    const header = (name: RegExp) =>
      canvas.getByRole("columnheader", { name }) as HTMLElement;
    const widthOf = (el: HTMLElement) =>
      Math.round(el.getBoundingClientRect().width);

    await step("A wider last column makes the table scroll", async () => {
      await dragColumnResizer(header(/^Role/), 300);
      await waitFor(() =>
        expect(widthOf(table)).toBeGreaterThan(container.clientWidth)
      );
    });

    await step(
      "The dragged edge stays in view, left of the pin column",
      async () => {
        const edgeIsVisible = () =>
          expect(
            Math.round(header(/^Role/).getBoundingClientRect().right)
          ).toBeLessThanOrEqual(
            Math.round(header(/Pin rows/).getBoundingClientRect().left) + 1
          );
        container.scrollLeft = 0;
        await dragColumnResizer(header(/^Role/), 100, async () => {
          await waitFor(edgeIsVisible);
        });
        expect(container.scrollLeft).toBeGreaterThan(0);
        edgeIsVisible();
      }
    );
  },
};

/**
 * The dragged edge also stays in view when `DataTable.Table` mounts after
 * `DataTable.Root`, for example because it is rendered conditionally.
 */
export const ResizedColumnEdgeStaysInViewInLateTable: Story = {
  render: () => {
    const [showTable, setShowTable] = useState(false);
    return (
      <Stack w="700px">
        <Button onPress={() => setShowTable(true)}>Show table</Button>
        <DataTable.Root
          columns={behaviourColumns}
          rows={behaviourRows}
          isResizable
          selectionMode="multiple"
          allowsPinning
        >
          {showTable && (
            <DataTable.Table aria-label="Table mounted after its root">
              <DataTable.Header />
              <DataTable.Body />
            </DataTable.Table>
          )}
        </DataTable.Root>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const header = (name: RegExp) =>
      canvas.getByRole("columnheader", { name }) as HTMLElement;
    const widthOf = (el: HTMLElement) =>
      Math.round(el.getBoundingClientRect().width);

    await step("The table mounts after the root", async () => {
      expect(canvas.queryByRole("grid")).not.toBeInTheDocument();
      await userEvent.click(canvas.getByRole("button", { name: "Show table" }));
      await canvas.findByText("Linus");
    });

    await step(
      "The dragged edge stays in view, left of the pin column",
      async () => {
        const table = canvas.getByRole("grid");
        const container = table.parentElement as HTMLElement;
        await dragColumnResizer(header(/^Role/), 300);
        await waitFor(() =>
          expect(widthOf(table)).toBeGreaterThan(container.clientWidth)
        );
        const edgeIsVisible = () =>
          expect(
            Math.round(header(/^Role/).getBoundingClientRect().right)
          ).toBeLessThanOrEqual(
            Math.round(header(/Pin rows/).getBoundingClientRect().left) + 1
          );
        container.scrollLeft = 0;
        await dragColumnResizer(header(/^Role/), 100, async () => {
          await waitFor(edgeIsVisible);
        });
        expect(container.scrollLeft).toBeGreaterThan(0);
        edgeIsVisible();
      }
    );
  },
};

/**
 * The outline around pinned rows is drawn above the frozen checkbox, expand
 * and pin cells. Before, their backgrounds covered it, so the lines stopped
 * short of the pin column.
 */
export const PinnedRowOutlineAboveFrozenCells: Story = {
  render: () => (
    <DataTable
      columns={behaviourColumns}
      rows={behaviourRows}
      selectionMode="multiple"
      allowsPinning
      defaultPinnedRows={new Set(["r1", "r2"])}
      renderNestedContent={(row) => <Text>Details for {String(row.name)}</Text>}
      aria-label="Pinned row outline"
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await canvas.findByText("Linus");
    const leftEdges = (row: Element) =>
      Array.from(row.children).map((cell) =>
        Math.round(cell.getBoundingClientRect().left)
      );
    const headerRow = canvasElement.querySelector("thead tr") as Element;

    for (const name of [/Ada/, /Grace/]) {
      const row = rowNamed(canvasElement, name);

      await step(`${name.source}: cells line up with the header`, async () => {
        expect(leftEdges(row)).toEqual(leftEdges(headerRow));
      });

      await step(
        `${name.source}: outline is above the frozen cells`,
        async () => {
          const outline = getComputedStyle(row, "::after");
          expect(outline.boxShadow).not.toBe("none");
          const frozenCells = frozenCellsOfRow(row);
          expect(frozenCells.length).toBeGreaterThan(0);
          for (const frozen of frozenCells) {
            expect(Number(outline.zIndex)).toBeGreaterThan(zIndexOf(frozen));
          }
        }
      );
    }
  },
};
