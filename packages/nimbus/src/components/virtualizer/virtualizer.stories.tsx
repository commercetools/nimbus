import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box } from "@commercetools/nimbus";
import {
  Cell,
  Column,
  ColumnResizer,
  GridList,
  GridListItem,
  I18nProvider,
  ListBox,
  ListBoxItem,
  ResizableTableContainer,
  Row,
  Table,
  TableBody,
  TableHeader,
} from "react-aria-components";
import { userEvent, within, expect, waitFor } from "storybook/test";
import { Virtualizer } from "./virtualizer";

/**
 * Storybook metadata configuration.
 *
 * The Virtualizer is internal: Nimbus collections render it when a consumer
 * sets `isVirtualized` (tested in each collection's stories). These stories
 * test the Virtualizer itself with unstyled React Aria collections, for each
 * layout, so later collections (GridList, DataTable) can rely on it.
 *
 * The Virtualizer is imported from source, not from the package: it is not
 * exported.
 *
 * Test rules (design Decision 14): fixed story sizes, `waitFor`/`findBy*`
 * instead of timeouts, scroll assertions through `scrollTop`/`scrollHeight`,
 * typeahead in one `userEvent.keyboard` call, ±1px for heights. 10,000-item
 * stories are not snapshotted by Chromatic.
 */
const meta: Meta<typeof Virtualizer> = {
  title: "Components/Virtualizer (internal)",
  component: Virtualizer,
};

export default meta;

type Story = StoryObj<typeof Virtualizer>;

/**
 * Test data
 */
const pad = (n: number) => String(n).padStart(5, "0");

const makeItems = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Option ${pad(i + 1)}`,
  }));

const tenThousand = makeItems(10_000);

const LIST_HEIGHT = 320;
const ROW_HEIGHT = 32;

/**
 * React Aria does not make the collection a scroll container: a custom
 * collection needs a bounded height and `overflow: auto`, or the page scrolls
 * instead of the list.
 */
const listStyle = {
  width: 280,
  height: LIST_HEIGHT,
  overflow: "auto",
  border: "1px solid #ccc",
} as const;

const fixedRowItemStyle = {
  height: ROW_HEIGHT,
  lineHeight: `${ROW_HEIGHT}px`,
  paddingInline: 8,
  boxSizing: "border-box",
} as const;

/**
 * React Aria builds the collection after mount, and the virtualizer renders
 * no rows until its `ResizeObserver` reports a size. Wait for rendered
 * options before any synchronous query.
 */
const waitForOptions = (canvas: ReturnType<typeof within>) =>
  canvas.findAllByRole("option", undefined, { timeout: 15000 });

const activeText = () => document.activeElement?.textContent ?? "";

/**
 * Assert that the element is inside the visible area of its scroll container.
 */
const expectInView = (element: Element, container: Element) => {
  const rect = element.getBoundingClientRect();
  const box = container.getBoundingClientRect();
  expect(rect.top).toBeGreaterThanOrEqual(box.top - 1);
  expect(rect.bottom).toBeLessThanOrEqual(box.bottom + 1);
};

/**
 * Assert that rendered rows do not overlap and that each row's content fits
 * inside the row the layout gave it (the virtualizer's wrapper element).
 */
const expectNoOverlap = (rows: HTMLElement[]) => {
  const sorted = [...rows].sort(
    (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top
  );
  for (let i = 0; i < sorted.length; i++) {
    const row = sorted[i].getBoundingClientRect();
    const wrapper = sorted[i].parentElement!.getBoundingClientRect();
    expect(row.bottom).toBeLessThanOrEqual(wrapper.bottom + 1);
    if (i > 0) {
      const previous = sorted[i - 1].parentElement!.getBoundingClientRect();
      expect(wrapper.top).toBeGreaterThanOrEqual(previous.bottom - 1);
    }
  }
};

const FixedRowList = ({
  items = tenThousand,
  label = "Options",
}: {
  items?: { id: number; name: string }[];
  label?: string;
}) => (
  <Virtualizer layoutOptions={{ rowHeight: ROW_HEIGHT }}>
    <ListBox
      aria-label={label}
      items={items}
      selectionMode="single"
      style={listStyle}
    >
      {(item) => (
        <ListBoxItem
          id={item.id}
          textValue={item.name}
          style={fixedRowItemStyle}
        >
          {item.name}
        </ListBoxItem>
      )}
    </ListBox>
  </Virtualizer>
);

/**
 * List layout with a React Aria ListBox of 10,000 options. Only the visible options
 * are in the DOM; the scroll height accounts for all of them.
 */
export const TenThousandItems: Story = {
  render: () => <FixedRowList />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const options = await waitForOptions(canvas);
    const listbox = canvas.getByRole("listbox");

    await step("Only visible options are rendered", async () => {
      expect(options.length).toBeGreaterThan(0);
      expect(options.length).toBeLessThan(100);
    });

    await step("The scroll height accounts for all options", async () => {
      expect(listbox.scrollHeight).toBe(tenThousand.length * ROW_HEIGHT);
    });

    await step("Options expose position and total size", async () => {
      expect(options[0]).toHaveAttribute("aria-posinset", "1");
      expect(options[0]).toHaveAttribute("aria-setsize", "10000");
    });
  },
};

/**
 * Keyboard navigation reaches options that are not rendered: End, Home,
 * PageDown, PageUp and typeahead.
 */
export const KeyboardNavigation: Story = {
  render: () => <FixedRowList />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await waitForOptions(canvas);
    const listbox = canvas.getByRole("listbox");

    await step("Tab focuses the first option", async () => {
      await userEvent.tab();
      await waitFor(() => expect(activeText()).toBe("Option 00001"));
    });

    await step("End moves focus to the last option", async () => {
      await userEvent.keyboard("{End}");
      await waitFor(() => expect(activeText()).toBe("Option 10000"));
      expectInView(document.activeElement!, listbox);
    });

    await step("Home moves focus back to the first option", async () => {
      await userEvent.keyboard("{Home}");
      await waitFor(() => expect(activeText()).toBe("Option 00001"));
      expect(listbox.scrollTop).toBe(0);
    });

    await step("PageDown moves focus by about one page", async () => {
      await userEvent.keyboard("{PageDown}");
      await waitFor(() => {
        const position = Number(
          document.activeElement?.getAttribute("aria-posinset")
        );
        expect(position).toBeGreaterThan(5);
        expect(position).toBeLessThan(25);
      });
      expectInView(document.activeElement!, listbox);
    });

    await step("PageUp moves focus back", async () => {
      await userEvent.keyboard("{PageUp}");
      await waitFor(() => expect(activeText()).toBe("Option 00001"));
    });

    await step("Typeahead focuses an option that is not rendered", async () => {
      await userEvent.keyboard("Option 07500");
      await waitFor(() => expect(activeText()).toBe("Option 07500"));
      expectInView(document.activeElement!, listbox);
    });
  },
};

/**
 * The focused option stays in the DOM when it is scrolled out of view, so
 * focus is not lost and the next arrow key continues from it.
 */
export const FocusSurvivesScrolling: Story = {
  render: () => <FixedRowList />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await waitForOptions(canvas);
    const listbox = canvas.getByRole("listbox");

    await step("Focus option 5", async () => {
      await userEvent.tab();
      await userEvent.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}");
      await waitFor(() => expect(activeText()).toBe("Option 00005"));
    });

    await step("Scroll far away with the scrollbar", async () => {
      listbox.scrollTop = 5000 * ROW_HEIGHT;
      await waitFor(() =>
        expect(canvas.getByText("Option 05001")).toBeInTheDocument()
      );
    });

    await step("The focused option is still focused", async () => {
      expect(activeText()).toBe("Option 00005");
    });

    await step("ArrowDown continues from the focused option", async () => {
      await userEvent.keyboard("{ArrowDown}");
      await waitFor(() => expect(activeText()).toBe("Option 00006"));
      await waitFor(() => expectInView(document.activeElement!, listbox));
    });
  },
};

/**
 * A selected option stays selected after it is scrolled out of view and back.
 */
export const SelectionSurvivesScrolling: Story = {
  render: () => <FixedRowList />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await waitForOptions(canvas);
    const listbox = canvas.getByRole("listbox");

    await step("Select option 3", async () => {
      await userEvent.click(canvas.getByText("Option 00003"));
      await waitFor(() =>
        expect(
          canvas.getByRole("option", { name: "Option 00003" })
        ).toHaveAttribute("aria-selected", "true")
      );
    });

    await step("Move focus and scroll away, then back", async () => {
      // The focused option is kept in the DOM (React Aria persists it), so
      // move focus to the end first. With the default "toggle" selection
      // behaviour, moving focus does not change the selection.
      await userEvent.keyboard("{End}");
      await waitFor(() => expect(activeText()).toBe("Option 10000"));
      await waitFor(() =>
        expect(canvas.queryByText("Option 00003")).not.toBeInTheDocument()
      );
      listbox.scrollTop = 0;
      await waitFor(() =>
        expect(canvas.getByText("Option 00003")).toBeInTheDocument()
      );
    });

    await step("Option 3 is still selected", async () => {
      expect(
        canvas.getByRole("option", { name: "Option 00003" })
      ).toHaveAttribute("aria-selected", "true");
    });
  },
};

const CustomOptionsList = ({
  gap,
  padding,
  label,
}: {
  gap: "100" | number;
  padding: "200" | number;
  label: string;
}) => (
  <Virtualizer layoutOptions={{ rowHeight: 40, gap, padding }}>
    <ListBox aria-label={label} items={makeItems(200)} style={listStyle}>
      {(item) => (
        <ListBoxItem id={item.id} textValue={item.name}>
          {item.name}
        </ListBoxItem>
      )}
    </ListBox>
  </Virtualizer>
);

/**
 * Custom layout options: a fixed row height, and `gap` and `padding` given as
 * spacing tokens or as pixels. Both lists lay out identically
 * (token `100` = 4px, token `200` = 8px).
 */
export const CustomLayoutOptions: Story = {
  render: () => (
    <Box display="flex" gap="400">
      <CustomOptionsList gap="100" padding="200" label="Tokens" />
      <CustomOptionsList gap={4} padding={8} label="Pixels" />
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await waitForOptions(canvas);

    for (const label of ["Tokens", "Pixels"]) {
      await step(
        `${label}: rows, gap and padding match the options`,
        async () => {
          const listbox = canvas.getByRole("listbox", { name: label });
          const options = within(listbox).getAllByRole("option");
          const box = listbox.getBoundingClientRect();
          const first = options[0].parentElement!.getBoundingClientRect();
          const second = options[1].parentElement!.getBoundingClientRect();
          // 1px border + 8px padding
          expect(first.top - box.top).toBeCloseTo(9, 0);
          expect(first.height).toBeCloseTo(40, 0);
          expect(second.top - first.bottom).toBeCloseTo(4, 0);
        }
      );
    }
  },
};

const longLabels = Array.from({ length: 500 }, (_, i) => ({
  id: i + 1,
  name:
    i % 3 === 0
      ? `Option ${pad(i + 1)} with a much longer label that wraps onto several lines in a narrow list`
      : `Option ${pad(i + 1)}`,
}));

/**
 * Without height options every row is estimated and then measured, so rows
 * with wrapping labels never overlap — also after the list becomes narrower
 * and the labels wrap onto more lines.
 */
export const MeasuredRows: Story = {
  render: () => (
    <Virtualizer>
      <ListBox
        aria-label="Measured options"
        items={longLabels}
        style={{ ...listStyle, width: 320 }}
      >
        {(item) => (
          <ListBoxItem
            id={item.id}
            textValue={item.name}
            style={{ padding: 8, lineHeight: "20px" }}
          >
            {item.name}
          </ListBoxItem>
        )}
      </ListBox>
    </Virtualizer>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await waitForOptions(canvas);
    const listbox = canvas.getByRole("listbox");

    await step("Rows do not overlap", async () => {
      await waitFor(() =>
        expectNoOverlap(within(listbox).getAllByRole("option"))
      );
    });

    await step("Rows do not overlap after scrolling", async () => {
      listbox.scrollTop = 4000;
      await waitFor(() =>
        expectNoOverlap(within(listbox).getAllByRole("option"))
      );
    });

    await step(
      "Rows do not overlap after the list becomes narrower",
      async () => {
        listbox.style.width = "180px";
        await waitFor(() =>
          expectNoOverlap(within(listbox).getAllByRole("option"))
        );
      }
    );
  },
};

/**
 * Without a bounded height the list grows to the full height of all options
 * and scrolls with the page, but still renders only about one window of
 * options (design Decision 11).
 */
export const NoBoundedHeight: Story = {
  render: () => (
    <Virtualizer layoutOptions={{ rowHeight: ROW_HEIGHT }}>
      <ListBox
        aria-label="Unbounded options"
        items={tenThousand}
        style={{ width: 280 }}
      >
        {(item) => (
          <ListBoxItem
            id={item.id}
            textValue={item.name}
            style={fixedRowItemStyle}
          >
            {item.name}
          </ListBoxItem>
        )}
      </ListBox>
    </Virtualizer>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const options = await waitForOptions(canvas);
    const listbox = canvas.getByRole("listbox");

    await step("The list is as tall as all options", async () => {
      expect(listbox.scrollHeight).toBe(tenThousand.length * ROW_HEIGHT);
    });

    await step("Only about one window of options is rendered", async () => {
      const windowRows = Math.ceil(window.innerHeight / ROW_HEIGHT);
      expect(options.length).toBeLessThanOrEqual(windowRows + 20);
    });
  },
};

const gridItems = makeItems(1000);

const GridStory = () => (
  <Virtualizer
    layout="grid"
    layoutOptions={{
      minItemSize: { width: 120, height: 64 },
      maxItemSize: { width: 120, height: 64 },
      minSpace: { width: 8, height: 8 },
      maxColumns: 4,
    }}
  >
    <GridList
      aria-label="Grid options"
      items={gridItems}
      layout="grid"
      style={{
        width: 560,
        height: 300,
        overflow: "auto",
        border: "1px solid #ccc",
      }}
    >
      {(item) => (
        <GridListItem
          id={item.id}
          textValue={item.name}
          style={{ border: "1px solid #999", boxSizing: "border-box" }}
        >
          {item.name}
        </GridListItem>
      )}
    </GridList>
  </Virtualizer>
);

const waitForRows = (
  canvas: ReturnType<typeof within>
): Promise<HTMLElement[]> =>
  canvas.findAllByRole("row", undefined, { timeout: 15000 });

/**
 * Grid layout (for GridList, FEC-1140): only visible
 * cells render, arrow keys move between rows and columns, and the grid
 * exposes its row count.
 */
export const GridLayout: Story = {
  render: () => <GridStory />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const rows = await waitForRows(canvas);
    const grid = canvas.getByRole("grid");

    await step("Only visible cells are rendered", async () => {
      expect(rows.length).toBeLessThan(100);
    });

    await step("At most four columns", async () => {
      const lefts = new Set(
        rows.map((row) => Math.round(row.getBoundingClientRect().left))
      );
      expect(lefts.size).toBeLessThanOrEqual(4);
    });

    await step("The grid exposes its row count and row indexes", async () => {
      expect(grid).toHaveAttribute("aria-rowcount", "1000");
      expect(rows[0]).toHaveAttribute("aria-rowindex", "1");
    });

    await step("Arrow keys move between rows and columns", async () => {
      await userEvent.tab();
      await waitFor(() => expect(activeText()).toBe("Option 00001"));
      await userEvent.keyboard("{ArrowRight}");
      await waitFor(() => expect(activeText()).toBe("Option 00002"));
      await userEvent.keyboard("{ArrowDown}");
      await waitFor(() => expect(activeText()).toBe("Option 00006"));
    });
  },
};

/**
 * Grid layout in a right-to-left locale: the first item sits at the
 * right edge.
 */
export const GridLayoutRightToLeft: Story = {
  render: () => (
    <I18nProvider locale="ar-EG">
      <div dir="rtl">
        <GridStory />
      </div>
    </I18nProvider>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const rows = await waitForRows(canvas);
    const grid = canvas.getByRole("grid");

    await step(
      "The first item is the right-most item of the first row",
      async () => {
        const first = canvas.getByRole("row", { name: "Option 00001" });
        const second = canvas.getByRole("row", { name: "Option 00002" });
        expect(first.getBoundingClientRect().left).toBeGreaterThan(
          second.getBoundingClientRect().left
        );
        const gridBox = grid.getBoundingClientRect();
        const rightMost = Math.max(
          ...rows.map((row) => row.getBoundingClientRect().right)
        );
        expect(first.getBoundingClientRect().right).toBeCloseTo(rightMost, 0);
        expect(rightMost).toBeLessThanOrEqual(gridBox.right);
      }
    );
  },
};

const tableRows = makeItems(10_000);

const TableStory = ({ resizable = false }: { resizable?: boolean }) => {
  const table = (
    <Virtualizer
      layout="table"
      layoutOptions={{ rowHeight: ROW_HEIGHT, headingHeight: 36 }}
    >
      <Table
        aria-label="Virtualized table"
        style={{
          width: 480,
          height: 320,
          overflow: "auto",
          border: "1px solid #ccc",
        }}
      >
        <TableHeader>
          <Column id="name" isRowHeader defaultWidth={200}>
            {resizable ? (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                Name
                <ColumnResizer
                  aria-label="Resize name column"
                  style={{
                    width: 8,
                    height: 20,
                    background: "#999",
                    cursor: "col-resize",
                  }}
                />
              </div>
            ) : (
              "Name"
            )}
          </Column>
          <Column id="index" defaultWidth={200}>
            Index
          </Column>
        </TableHeader>
        <TableBody items={tableRows}>
          {(item) => (
            <Row id={item.id}>
              <Cell>{item.name}</Cell>
              <Cell>{item.id}</Cell>
            </Row>
          )}
        </TableBody>
      </Table>
    </Virtualizer>
  );

  return resizable ? (
    <ResizableTableContainer style={{ width: 480 }}>
      {table}
    </ResizableTableContainer>
  ) : (
    table
  );
};

/**
 * Table layout (for DataTable, FEC-1145): only visible
 * body rows render, and the table exposes its row count and row indexes.
 */
export const TableLayout: Story = {
  render: () => <TableStory />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const rows = await waitForRows(canvas);
    const table = canvas.getByRole("grid");

    await step("Only visible rows are rendered", async () => {
      expect(rows.length).toBeLessThan(100);
    });

    await step("The table exposes its row count", async () => {
      // 10,000 body rows + 1 header row
      expect(table).toHaveAttribute("aria-rowcount", "10001");
    });

    await step("Rendered body rows expose their row index", async () => {
      const firstBodyRow = canvas.getByRole("row", { name: /Option 00001/ });
      expect(firstBodyRow).toHaveAttribute("aria-rowindex", "2");
    });
  },
};

/**
 * Table layout inside a resizable table: virtualized cells follow a
 * resized column, so React Aria's `columnWidths` reach the layout.
 */
export const TableLayoutResizable: Story = {
  render: () => <TableStory resizable />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await waitForRows(canvas);

    const nameCellWidth = () =>
      canvas
        .getByText("Option 00001")
        .closest('[role="rowheader"]')!
        .getBoundingClientRect().width;
    const nameHeaderWidth = () =>
      canvas.getByRole("columnheader", { name: /Name/ }).getBoundingClientRect()
        .width;

    await step("Cells match the column width", async () => {
      await waitFor(() =>
        expect(nameCellWidth()).toBeCloseTo(nameHeaderWidth(), 0)
      );
    });

    await step("Resizing the column resizes the cells", async () => {
      const before = nameHeaderWidth();
      // Drag the resize handle 80px to the right, as the DataTable stories do.
      const handle = canvasElement.querySelector(
        ".react-aria-ColumnResizer"
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
          coords: { clientX: x + 80, clientY: y, pageX: x + 80, pageY: y },
        },
        {
          keys: "[/MouseLeft]",
          target: handle,
          coords: { clientX: x + 80, clientY: y, pageX: x + 80, pageY: y },
        },
      ]);
      await waitFor(() => expect(nameHeaderWidth()).toBeGreaterThan(before));
      await waitFor(() =>
        expect(nameCellWidth()).toBeCloseTo(nameHeaderWidth(), 0)
      );
    });
  },
};
