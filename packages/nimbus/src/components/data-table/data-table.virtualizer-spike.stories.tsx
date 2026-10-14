// SPIKE (FEC-1145, not shipped): renders the real DataTable inside the
// internal Virtualizer to find out which features survive virtualization.
// Findings: openspec/changes/add-data-table-virtualization/design.md.
//
// Each story exists three times: virtualized with no changes, `...Plain` (not
// virtualized) and `...Fixed` (virtualized with the candidate CSS and the
// sticky-column layout). Play functions measure and log ("SPIKE <story>
// <json>") instead of asserting, so one run records every finding:
//   pnpm test:storybook:dev <this file> --silent=false | grep SPIKE
//
// Excluded from the published Storybook (`!dev`, `!autodocs`) and from
// Chromatic. Deleted when the implementation starts (tasks.md 1.1).

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ReactNode } from "react";
import { within, userEvent, waitFor } from "storybook/test";
import { Box, Text, DataTable } from "@/components";
import { useDragAndDrop, createArrayHandlers } from "@commercetools/nimbus";
import { DataTableSpikeVirtualizerContext } from "./components/data-table.table";
import type { DataTableColumnItem, DataTableRowItem } from "./data-table.types";
import { manyColumns } from "./data-table.test-data";

const meta: Meta<object> = {
  title: "Components/DataTable/Virtualizer spike (FEC-1145)",
  component: DataTable,
  parameters: { chromatic: { disableSnapshot: true } },
  tags: ["!dev", "!autodocs", "!a11y-test"],
};

export default meta;

type SpikeArgs = {
  virtualized: boolean;
  rowCount: number;
  stickyColumns?: boolean;
  spikeCss?: boolean;
};
type Story = StoryObj<SpikeArgs>;

const ROLES = ["Admin", "User", "Manager", "Guest", "Owner"];

const makeRows = (count: number): DataTableRowItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    name: `Person ${String(i + 1).padStart(5, "0")}`,
    age: 20 + (i % 50),
    role: ROLES[i % ROLES.length],
    email: `person${i + 1}@example.com`,
  }));

const basicColumns: DataTableColumnItem[] = [
  {
    id: "name",
    header: "Name",
    accessor: (row) => row.name as ReactNode,
    isSortable: true,
  },
  {
    id: "age",
    header: "Age",
    accessor: (row) => row.age as ReactNode,
    isSortable: true,
  },
  {
    id: "role",
    header: "Role",
    accessor: (row) => row.role as ReactNode,
    isSortable: true,
  },
  {
    id: "email",
    header: "Email",
    accessor: (row) => row.email as ReactNode,
  },
];

// Candidate virtualized styles, injected while the spike finds the rules the
// recipe would need. Scoped to `div[role=grid]`, so the plain table is
// unaffected.
const SPIKE_CSS = `
.nimbus-data-table__root div[role=grid] [role=row] { width: 100%; height: 100%; }
.nimbus-data-table__root div[role=grid] :is([role=columnheader], [role=gridcell], [role=rowheader]) { height: 100% !important; }
.nimbus-data-table__root div[role=grid] [role=row] > [role=presentation] { background: inherit; }
.nimbus-data-table__root div[role=grid] > [role=presentation] > [role=presentation] { overflow: visible !important; }
.nimbus-data-table__root div[role=grid] [role=row] { border-bottom: none !important; }
.nimbus-data-table__root div[role=grid] :is([role=gridcell], [role=rowheader]) { border-bottom: 1px solid rgb(240, 240, 240); display: flex; flex-direction: column; justify-content: center; }
`;

const SpikeFrame = ({
  virtualized,
  stickyColumns = false,
  spikeCss = false,
  children,
}: {
  virtualized: boolean;
  stickyColumns?: boolean;
  spikeCss?: boolean;
  children: ReactNode;
}) => (
  <DataTableSpikeVirtualizerContext.Provider
    value={virtualized ? { options: {}, stickyColumns } : false}
  >
    {spikeCss && <style>{SPIKE_CSS}</style>}
    <Box w="800px">{children}</Box>
  </DataTableSpikeVirtualizerContext.Provider>
);

const report = (story: string, data: Record<string, unknown>) =>
  console.log(`SPIKE ${story} ${JSON.stringify(data)}`);

const rectOf = (el: Element | null | undefined) => {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return {
    left: Math.round(r.left),
    top: Math.round(r.top),
    width: Math.round(r.width),
    height: Math.round(r.height),
  };
};

const getRoot = (canvasElement: HTMLElement) =>
  canvasElement.querySelector<HTMLElement>(".nimbus-data-table__root") ??
  canvasElement.querySelector<HTMLElement>("[class*='data-table']")!;

const bodyRows = (grid: HTMLElement) =>
  Array.from(grid.querySelectorAll<HTMLElement>("[role='row']")).filter((row) =>
    row.querySelector("[role='gridcell'], [role='rowheader']")
  );

const nextFrame = () =>
  new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));

const scrollRoot = async (root: HTMLElement, top: number, left = 0) => {
  root.scrollTop = top;
  root.scrollLeft = left;
  root.dispatchEvent(new Event("scroll"));
  await nextFrame();
  await nextFrame();
  await new Promise((resolve) => setTimeout(resolve, 300));
};

// ---------------------------------------------------------------------------
// 1. Basic: sorting, selection, resizing, sticky header, row click, keyboard
// ---------------------------------------------------------------------------

export const SpikeBasic: Story = {
  args: { virtualized: true, rowCount: 1000 },
  render: ({ virtualized, rowCount, stickyColumns, spikeCss }) => {
    const Component = () => {
      const [clicked, setClicked] = useState("none");
      return (
        <SpikeFrame
          virtualized={virtualized}
          stickyColumns={stickyColumns}
          spikeCss={spikeCss}
        >
          <DataTable
            columns={basicColumns}
            rows={makeRows(rowCount)}
            allowsSorting
            isResizable
            selectionMode="multiple"
            maxHeight="400px"
            onRowAction={(row) => setClicked(row.id)}
          />
          <Text data-testid="clicked">{clicked}</Text>
        </SpikeFrame>
      );
    };
    return <Component />;
  },
  play: async ({ canvasElement, args }) => {
    const story = `Basic(virtualized=${args.virtualized})`;
    const canvas = within(canvasElement);
    const grid = await canvas.findByRole("grid");
    await waitFor(() => {
      if (bodyRows(grid).length === 0) throw new Error("no rows yet");
    });
    const root =
      grid.closest<HTMLElement>(".nimbus-data-table") ?? getRoot(canvasElement);

    const headerRow = grid.querySelector("[role='row']");
    const headerCells = Array.from(
      headerRow?.querySelectorAll("[role='columnheader']") ?? []
    );
    const firstRow = bodyRows(grid)[0];
    const firstRowCells = Array.from(
      firstRow.querySelectorAll("[role='gridcell'], [role='rowheader']")
    );

    report(story, {
      step: "initial",
      gridTag: grid.tagName,
      rootTag: root.tagName,
      rootClass: root.className.slice(0, 80),
      renderedRows: bodyRows(grid).length,
      ariaRowCount: grid.getAttribute("aria-rowcount"),
      rootScroll: { sh: root.scrollHeight, ch: root.clientHeight },
      header: rectOf(headerRow),
      firstRow: rectOf(firstRow),
      firstRowParentIsRow: firstRowCells[0]?.parentElement === firstRow,
      headerCells: headerCells.map((c) => rectOf(c)),
      firstRowCells: firstRowCells.map((c) => rectOf(c)),
      firstRowCellStyles: firstRowCells.slice(0, 2).map((c) => {
        const s = getComputedStyle(c);
        return {
          display: s.display,
          position: s.position,
          padding: s.padding,
          borderBottom: s.borderBottomWidth,
          bg: s.backgroundColor,
        };
      }),
      rowStyle: (() => {
        const s = getComputedStyle(firstRow);
        return {
          display: s.display,
          position: s.position,
          bg: s.backgroundColor,
        };
      })(),
    });

    await scrollRoot(root, 3000);
    const afterScroll = bodyRows(grid);
    report(story, {
      step: "scrolled 3000",
      renderedRows: afterScroll.length,
      firstRenderedName: afterScroll[0]?.textContent?.slice(0, 40),
      headerTopMinusRootTop:
        (rectOf(headerRow)?.top ?? 0) - (rectOf(root)?.top ?? 0),
      headerVisible: headerRow ? headerRow.getBoundingClientRect().height : 0,
    });
    await scrollRoot(root, 0);

    // Sorting: click the Name header twice (ascending, then descending).
    const nameHeader = canvas.getByRole("columnheader", { name: /name/i });
    await userEvent.click(nameHeader);
    await userEvent.click(nameHeader);
    await nextFrame();
    report(story, {
      step: "sort desc",
      ariaSort: nameHeader.getAttribute("aria-sort"),
      firstRowText: bodyRows(grid)[0]?.textContent?.slice(0, 40),
    });

    // Selection: select the first row, scroll away and back.
    const firstCheckbox = within(bodyRows(grid)[0]).getByRole("checkbox");
    await userEvent.click(firstCheckbox);
    const firstRowId = bodyRows(grid)[0]?.getAttribute("data-key");
    await scrollRoot(root, 5000);
    await scrollRoot(root, 0);
    report(story, {
      step: "selection survives scroll",
      firstRowKey: firstRowId,
      firstRowSelected: bodyRows(grid)[0]?.getAttribute("aria-selected"),
    });

    // Row click on cell text of the second row.
    const secondRow = bodyRows(grid)[1];
    const textCell = secondRow.querySelectorAll(
      "[role='gridcell'], [role='rowheader']"
    )[2] as HTMLElement;
    await userEvent.click(textCell);
    await new Promise((resolve) => setTimeout(resolve, 400));
    report(story, {
      step: "row click",
      clicked: canvas.getByTestId("clicked").textContent,
      expectedRowKey: secondRow.getAttribute("data-key"),
    });

    // Keyboard: focus a cell, press End with Ctrl to go to the last row.
    textCell.focus();
    await userEvent.keyboard("{PageDown}");
    await new Promise((resolve) => setTimeout(resolve, 400));
    const focusedRow = document.activeElement?.closest("[role='row']");
    report(story, {
      step: "pagedown",
      focusedRowIndex: focusedRow?.getAttribute("aria-rowindex"),
      focusedText: focusedRow?.textContent?.slice(0, 40),
      rootScrollTop: root.scrollTop,
    });
  },
};

// ---------------------------------------------------------------------------
// 2. Frozen columns: drag, selection, expand, pin, horizontal scroll, nested
// ---------------------------------------------------------------------------

const wideRows = (count: number): DataTableRowItem[] =>
  makeRows(count).map((row) => ({
    ...row,
    department: "Engineering",
    location: "Berlin",
    phone: "+49 30 1234567",
    salary: "$95,000",
    startDate: "2023-01-15",
  }));

export const SpikeFrozenColumns: Story = {
  args: { virtualized: true, rowCount: 1000 },
  render: ({ virtualized, rowCount, stickyColumns, spikeCss }) => {
    const Component = () => {
      const [rows, setRows] = useState(() => wideRows(rowCount));
      const { dragAndDropHooks } = useDragAndDrop({
        ...createArrayHandlers(setRows, (row: DataTableRowItem) => row.id),
      });
      return (
        <SpikeFrame
          virtualized={virtualized}
          stickyColumns={stickyColumns}
          spikeCss={spikeCss}
        >
          <DataTable
            columns={manyColumns}
            rows={rows}
            selectionMode="multiple"
            allowsPinning
            maxHeight="400px"
            dragAndDropHooks={dragAndDropHooks}
            renderNestedContent={(row) => (
              <Box p="400" data-testid={`nested-${row.id}`}>
                Details for {row.name as string}
              </Box>
            )}
          />
        </SpikeFrame>
      );
    };
    return <Component />;
  },
  play: async ({ canvasElement, args }) => {
    const story = `Frozen(virtualized=${args.virtualized})`;
    const canvas = within(canvasElement);
    const grid = await canvas.findByRole("grid");
    await waitFor(() => {
      if (bodyRows(grid).length === 0) throw new Error("no rows yet");
    });
    const root =
      grid.closest<HTMLElement>(".nimbus-data-table") ?? getRoot(canvasElement);

    const measureSticky = () => {
      const rootRect = root.getBoundingClientRect();
      const firstRow = bodyRows(grid)[0];
      const headerRow = grid.querySelector("[role='row']");
      const slots = ["drag", "selection", "expand", "pin-row-cell"];
      return {
        body: Object.fromEntries(
          slots.map((slot) => {
            const el = firstRow?.querySelector(`[data-slot='${slot}']`);
            const r = el?.getBoundingClientRect();
            return [
              slot,
              r
                ? {
                    left: Math.round(r.left - rootRect.left),
                    right: Math.round(rootRect.right - r.right),
                    position: getComputedStyle(el!).position,
                  }
                : null,
            ];
          })
        ),
        header: Array.from(
          headerRow?.querySelectorAll("[role='columnheader']") ?? []
        )
          .slice(0, 4)
          .map((el) => ({
            cls: (el as HTMLElement).className
              .split(" ")
              .filter((c) => c.includes("column-header"))
              .join(" "),
            left: Math.round(el.getBoundingClientRect().left - rootRect.left),
            position: getComputedStyle(el).position,
          })),
      };
    };

    report(story, {
      step: "initial",
      renderedRows: bodyRows(grid).length,
      rootScroll: { sw: root.scrollWidth, cw: root.clientWidth },
      sticky: measureSticky(),
    });

    await scrollRoot(root, 0, 600);
    report(story, {
      step: "scrolled left 600",
      sticky: measureSticky(),
      scrollAttrs: {
        left: root.getAttribute("data-scroll-left"),
        right: root.getAttribute("data-scroll-right"),
      },
    });
    await scrollRoot(root, 0, 0);

    // Expand the first row.
    const expandButton = within(bodyRows(grid)[0]).getByRole("button", {
      name: /expand/i,
    });
    await userEvent.click(expandButton);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const nestedRow = grid.querySelector("[data-nested-row-expanded]");
    const nestedCell = nestedRow?.querySelector("[data-nested-cell]");
    report(story, {
      step: "expanded row 1",
      nestedRowFound: !!nestedRow,
      nestedRow: rectOf(nestedRow),
      nestedCell: rectOf(nestedCell),
      nestedContentVisible: !!canvas.queryByTestId("nested-1"),
      gridWidth: rectOf(grid)?.width,
      rowsAfterExpand: bodyRows(grid)
        .slice(0, 3)
        .map((r) => rectOf(r)),
    });

    // Pin row 3. When virtualized, the pin column of this wide table is not
    // rendered until it is scrolled into view, so the button can be missing.
    const row3 = bodyRows(grid).find((r) => r.getAttribute("data-key") === "3");
    const pinButton = row3
      ? within(row3).queryByRole("button", { name: /pin/i })
      : null;
    if (pinButton) {
      await userEvent.click(pinButton);
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
    const firstAfterPin = bodyRows(grid)[0];
    report(story, {
      step: "pinned row 3",
      foundRow3: !!row3,
      pinButtonFound: !!pinButton,
      firstRowKey: firstAfterPin?.getAttribute("data-key"),
      firstRowClass: firstAfterPin?.className
        .split(" ")
        .filter((c) => c.includes("pinned")),
      firstRowAfter: (() => {
        const s = firstAfterPin
          ? getComputedStyle(firstAfterPin, "::after")
          : null;
        return s
          ? { content: s.content, boxShadow: s.boxShadow, position: s.position }
          : null;
      })(),
    });

    // Drag handles exist.
    report(story, {
      step: "drag handles",
      count: grid.querySelectorAll("[data-drag-handle]").length,
    });
  },
};

// ---------------------------------------------------------------------------
// 3. Empty state, footer, density, truncation
// ---------------------------------------------------------------------------

export const SpikeEmptyState: Story = {
  args: { virtualized: true, rowCount: 0 },
  render: ({ virtualized, stickyColumns, spikeCss }) => (
    <SpikeFrame
      virtualized={virtualized}
      stickyColumns={stickyColumns}
      spikeCss={spikeCss}
    >
      <DataTable columns={basicColumns} rows={[]} maxHeight="400px" />
    </SpikeFrame>
  ),
  play: async ({ canvasElement, args }) => {
    const story = `Empty(virtualized=${args.virtualized})`;
    const canvas = within(canvasElement);
    const grid = await canvas.findByRole("grid");
    await new Promise((resolve) => setTimeout(resolve, 300));
    const message = canvas.queryByText(/no data/i);
    report(story, {
      messageFound: !!message,
      message: rectOf(message),
      grid: rectOf(grid),
    });
  },
};

export const SpikeFooterDensityTruncation: Story = {
  args: { virtualized: true, rowCount: 1000 },
  render: ({ virtualized, rowCount, stickyColumns, spikeCss }) => (
    <SpikeFrame
      virtualized={virtualized}
      stickyColumns={stickyColumns}
      spikeCss={spikeCss}
    >
      <DataTable
        columns={basicColumns}
        rows={makeRows(rowCount).map((row) => ({
          ...row,
          email: `${row.email as string} with a long text that should be truncated in a narrow column`,
        }))}
        density="condensed"
        isTruncated
        maxHeight="400px"
        footer={
          <Box p="200" data-testid="footer">
            Footer content
          </Box>
        }
      />
    </SpikeFrame>
  ),
  play: async ({ canvasElement, args }) => {
    const story = `FooterDensity(virtualized=${args.virtualized})`;
    const canvas = within(canvasElement);
    const grid = await canvas.findByRole("grid");
    await waitFor(() => {
      if (bodyRows(grid).length === 0) throw new Error("no rows yet");
    });
    const root =
      grid.closest<HTMLElement>(".nimbus-data-table") ?? getRoot(canvasElement);
    const footer = canvas.getByTestId("footer");
    report(story, {
      step: "initial",
      firstRow: rectOf(bodyRows(grid)[0]),
      secondRow: rectOf(bodyRows(grid)[1]),
      footer: rectOf(footer),
      root: rectOf(root),
      truncatedCell: (() => {
        const el = grid.querySelector(".truncated-cell");
        return el ? { ...rectOf(el), sw: el.scrollWidth } : null;
      })(),
    });
    await scrollRoot(root, root.scrollHeight);
    report(story, {
      step: "scrolled to end",
      footer: rectOf(footer),
      root: rectOf(root),
      lastRenderedKey: bodyRows(grid).at(-1)?.getAttribute("data-key"),
    });
  },
};

// ---------------------------------------------------------------------------
// 4. Compound API: custom rows and cells, 1000 rows
// ---------------------------------------------------------------------------

export const SpikeCompound: Story = {
  args: { virtualized: true, rowCount: 1000 },
  render: ({ virtualized, rowCount, stickyColumns, spikeCss }) => (
    <SpikeFrame
      virtualized={virtualized}
      stickyColumns={stickyColumns}
      spikeCss={spikeCss}
    >
      <DataTable.Root
        columns={basicColumns}
        rows={makeRows(rowCount)}
        maxHeight="400px"
        selectionMode="multiple"
      >
        <DataTable.Table aria-label="Compound virtualized">
          <DataTable.Header />
          <DataTable.Body>
            {(row, rowRenderProps) => (
              <DataTable.Row
                row={row}
                {...rowRenderProps}
                bg={(row.role as string) === "Admin" ? "primary.2" : undefined}
                data-testid={`custom-row-${row.id}`}
              >
                {({ columns }) =>
                  columns.map((column) => (
                    <DataTable.Cell key={column.id}>
                      <Text fontWeight="600">{String(row[column.id])}</Text>
                    </DataTable.Cell>
                  ))
                }
              </DataTable.Row>
            )}
          </DataTable.Body>
        </DataTable.Table>
      </DataTable.Root>
    </SpikeFrame>
  ),
  play: async ({ canvasElement, args }) => {
    const story = `Compound(virtualized=${args.virtualized})`;
    const canvas = within(canvasElement);
    const grid = await canvas.findByRole("grid");
    await waitFor(() => {
      if (bodyRows(grid).length === 0) throw new Error("no rows yet");
    });
    const firstRow = canvas.queryByTestId("custom-row-1");
    report(story, {
      renderedRows: bodyRows(grid).length,
      customRowFound: !!firstRow,
      customRowBg: firstRow ? getComputedStyle(firstRow).backgroundColor : null,
      firstCellBg: (() => {
        const cell = firstRow?.querySelector(
          "[role='gridcell'], [role='rowheader']"
        );
        return cell ? getComputedStyle(cell).backgroundColor : null;
      })(),
    });
  },
};

// ---------------------------------------------------------------------------
// 5. Pinning in a narrow table, keyboard drag and drop
// ---------------------------------------------------------------------------

export const SpikePinning: Story = {
  args: { virtualized: true, rowCount: 1000 },
  render: ({ virtualized, rowCount, stickyColumns, spikeCss }) => (
    <SpikeFrame
      virtualized={virtualized}
      stickyColumns={stickyColumns}
      spikeCss={spikeCss}
    >
      <DataTable
        columns={basicColumns}
        rows={makeRows(rowCount)}
        allowsPinning
        maxHeight="400px"
      />
    </SpikeFrame>
  ),
  play: async ({ canvasElement, args }) => {
    const story = `Pinning(virtualized=${args.virtualized},fixed=${!!args.spikeCss})`;
    const canvas = within(canvasElement);
    const grid = await canvas.findByRole("grid");
    await waitFor(() => {
      if (bodyRows(grid).length === 0) throw new Error("no rows yet");
    });
    const row3 = bodyRows(grid).find((r) => r.getAttribute("data-key") === "3");
    const pinButton = row3
      ? within(row3).queryByRole("button", { name: /pin/i })
      : null;
    if (pinButton) {
      await userEvent.click(pinButton);
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
    const first = bodyRows(grid)[0];
    const after = first ? getComputedStyle(first, "::after") : null;
    report(story, {
      pinButtonFound: !!pinButton,
      pinCell: rectOf(first?.querySelector("[data-slot='pin-row-cell']")),
      firstRowKey: first?.getAttribute("data-key"),
      firstRowClasses: first?.className
        .split(" ")
        .filter((c) => c.includes("pinned")),
      firstRow: rectOf(first),
      outline: after
        ? { content: after.content, boxShadow: after.boxShadow.slice(0, 60) }
        : null,
    });
  },
};

export const SpikeDragAndDrop: Story = {
  args: { virtualized: true, rowCount: 1000 },
  render: ({ virtualized, rowCount, stickyColumns, spikeCss }) => {
    const Component = () => {
      const [rows, setRows] = useState(() => makeRows(rowCount));
      const { dragAndDropHooks } = useDragAndDrop({
        ...createArrayHandlers(setRows, (row: DataTableRowItem) => row.id),
      });
      return (
        <SpikeFrame
          virtualized={virtualized}
          stickyColumns={stickyColumns}
          spikeCss={spikeCss}
        >
          <DataTable
            columns={basicColumns}
            rows={rows}
            maxHeight="400px"
            dragAndDropHooks={dragAndDropHooks}
          />
          <Text data-testid="order">
            {rows
              .slice(0, 3)
              .map((row) => row.id)
              .join(",")}
          </Text>
        </SpikeFrame>
      );
    };
    return <Component />;
  },
  play: async ({ canvasElement, args }) => {
    const story = `DragAndDrop(virtualized=${args.virtualized},fixed=${!!args.spikeCss})`;
    const canvas = within(canvasElement);
    const grid = await canvas.findByRole("grid");
    await waitFor(() => {
      if (bodyRows(grid).length === 0) throw new Error("no rows yet");
    });
    const handle = within(bodyRows(grid)[0]).getByRole("button", {
      name: /drag/i,
    });
    handle.focus();
    await userEvent.keyboard("{Enter}");
    await new Promise((resolve) => setTimeout(resolve, 300));
    const dropIndicators = grid.querySelectorAll(".react-aria-DropIndicator");
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}");
    await userEvent.keyboard("{Enter}");
    await new Promise((resolve) => setTimeout(resolve, 500));
    report(story, {
      dropIndicatorsWhileDragging: dropIndicators.length,
      order: canvas.getByTestId("order").textContent,
    });
  },
};

// Same stories without virtualization, to compare measurements.
const plain = (story: Story): Story => ({
  ...story,
  args: { ...story.args, virtualized: false } as SpikeArgs,
});
export const SpikeBasicPlain = plain(SpikeBasic);
export const SpikeFrozenColumnsPlain = plain(SpikeFrozenColumns);
export const SpikeEmptyStatePlain = plain(SpikeEmptyState);
export const SpikeFooterDensityTruncationPlain = plain(
  SpikeFooterDensityTruncation
);
export const SpikeCompoundPlain = plain(SpikeCompound);
export const SpikePinningPlain = plain(SpikePinning);
export const SpikeDragAndDropPlain = plain(SpikeDragAndDrop);

// Virtualized with the candidate styles and sticky built-in columns.
const fixed = (story: Story): Story => ({
  ...story,
  args: { ...story.args, stickyColumns: true, spikeCss: true } as SpikeArgs,
});
export const SpikeBasicFixed = fixed(SpikeBasic);
export const SpikeFrozenColumnsFixed = fixed(SpikeFrozenColumns);
export const SpikeEmptyStateFixed = fixed(SpikeEmptyState);
export const SpikeFooterDensityTruncationFixed = fixed(
  SpikeFooterDensityTruncation
);
export const SpikeCompoundFixed = fixed(SpikeCompound);
export const SpikePinningFixed = fixed(SpikePinning);
export const SpikeDragAndDropFixed = fixed(SpikeDragAndDrop);
