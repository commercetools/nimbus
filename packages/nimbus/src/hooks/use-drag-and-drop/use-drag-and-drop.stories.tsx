import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, waitFor } from "storybook/test";
import { useState } from "react";
import {
  Box,
  DataTable,
  DraggableList,
  Flex,
  Stack,
  Text,
  useDragAndDrop,
  createArrayHandlers,
} from "@commercetools/nimbus";
import type { DataTableColumnItem } from "@commercetools/nimbus";
import { dragItem, dragItemToList } from "./utils/use-drag-and-drop.test-utils";

const DRAG_DELAY_MS = 50;

const wait = (ms: number = DRAG_DELAY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

type Item = { key: string; label: string };

const initialItems: Item[] = [
  { key: "1", label: "Apple" },
  { key: "2", label: "Banana" },
  { key: "3", label: "Cherry" },
  { key: "4", label: "Date" },
];

const ReorderDemo = () => {
  const [items, setItems] = useState<Item[]>(initialItems);

  return (
    <Stack gap="400">
      <DraggableList.Root
        aria-label="reorder list"
        items={items}
        onUpdateItems={setItems}
      />
      <Text data-testid="order">
        {items.map((item) => item.label).join(", ")}
      </Text>
    </Stack>
  );
};

const NamespaceIsolationDemo = () => {
  const [alphaItems, setAlphaItems] = useState<Item[]>([
    { key: "a1", label: "Alpha 1" },
    { key: "a2", label: "Alpha 2" },
  ]);
  const [betaItems, setBetaItems] = useState<Item[]>([
    { key: "b1", label: "Beta 1" },
    { key: "b2", label: "Beta 2" },
  ]);

  return (
    <Flex gap="600">
      <Box>
        <DraggableList.Root
          aria-label="alpha list"
          items={alphaItems}
          onUpdateItems={(updated) => setAlphaItems(updated as Item[])}
          dragNamespace="alpha"
        />
        <Text data-testid="alpha-order">
          {alphaItems.map((i) => i.label).join(", ")}
        </Text>
      </Box>
      <Box>
        <DraggableList.Root
          aria-label="beta list"
          items={betaItems}
          onUpdateItems={(updated) => setBetaItems(updated as Item[])}
          dragNamespace="beta"
        />
        <Text data-testid="beta-order">
          {betaItems.map((i) => i.label).join(", ")}
        </Text>
      </Box>
    </Flex>
  );
};

const CrossListTransferDemo = () => {
  const [sourceItems, setSourceItems] = useState<Item[]>([
    { key: "s1", label: "Source 1" },
    { key: "s2", label: "Source 2" },
    { key: "s3", label: "Source 3" },
  ]);
  const [targetItems, setTargetItems] = useState<Item[]>([
    { key: "t1", label: "Target 1" },
  ]);

  return (
    <Flex gap="600">
      <Box>
        <DraggableList.Root
          aria-label="source list"
          items={sourceItems}
          onUpdateItems={(updated) => setSourceItems(updated as Item[])}
          dragNamespace="shared"
        />
        <Text data-testid="source-order">
          {sourceItems.map((i) => i.label).join(", ")}
        </Text>
      </Box>
      <Box>
        <DraggableList.Root
          aria-label="target list"
          items={targetItems}
          onUpdateItems={(updated) => setTargetItems(updated as Item[])}
          dragNamespace="shared"
        />
        <Text data-testid="target-order">
          {targetItems.map((i) => i.label).join(", ")}
        </Text>
      </Box>
    </Flex>
  );
};

const meta: Meta<typeof DraggableList.Root<Item>> = {
  title: "Hooks/UseDragAndDrop",
  tags: ["!autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Reorder: Story = {
  render: () => <ReorderDemo />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders all items in initial order", async () => {
      const grid = await canvas.findByRole("grid", { name: /reorder list/i });
      const rows = within(grid).getAllByRole("row");
      expect(rows).toHaveLength(4);
      expect(canvas.getByTestId("order")).toHaveTextContent(
        "Apple, Banana, Cherry, Date"
      );
    });

    await step("Reorders first item down one position", async () => {
      await dragItem(canvas, "Apple", 1);

      await waitFor(() => {
        expect(canvas.getByTestId("order")).toHaveTextContent(
          "Banana, Apple, Cherry, Date"
        );
      });
    });
  },
};

export const NamespaceIsolation: Story = {
  render: () => <NamespaceIsolationDemo />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Both lists render independently", async () => {
      await canvas.findByRole("grid", { name: /alpha list/i });
      await canvas.findByRole("grid", { name: /beta list/i });
      expect(canvas.getByTestId("alpha-order")).toHaveTextContent(
        "Alpha 1, Alpha 2"
      );
      expect(canvas.getByTestId("beta-order")).toHaveTextContent(
        "Beta 1, Beta 2"
      );
    });

    await step("Reorder within alpha list, beta unaffected", async () => {
      const betaOrderBefore = canvas.getByTestId("beta-order").textContent;

      await dragItem(canvas, "Alpha 1", 1);

      await waitFor(() => {
        expect(canvas.getByTestId("alpha-order")).toHaveTextContent(
          "Alpha 2, Alpha 1"
        );
      });

      expect(canvas.getByTestId("beta-order")).toHaveTextContent(
        betaOrderBefore!
      );
    });
  },
};

export const CrossListTransfer: Story = {
  render: () => <CrossListTransferDemo />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Both lists render with initial items", async () => {
      await canvas.findByRole("grid", { name: /source list/i });
      await canvas.findByRole("grid", { name: /target list/i });
      expect(canvas.getByTestId("source-order")).toHaveTextContent(
        "Source 1, Source 2, Source 3"
      );
      expect(canvas.getByTestId("target-order")).toHaveTextContent("Target 1");
    });

    await step("Transfer item from source to target", async () => {
      await dragItemToList(canvas, "Source 1", 1);

      await waitFor(() => {
        expect(canvas.getByTestId("source-order")).toHaveTextContent(
          "Source 2, Source 3"
        );
        expect(canvas.getByTestId("target-order")).toHaveTextContent(
          /Source 1/
        );
      });
    });
  },
};

type TableRow = { id: string; name: string; role: string };

const DirectHookWithTableDemo = () => {
  const tableColumns: DataTableColumnItem[] = [
    {
      id: "name",
      header: "Name",
      accessor: (row: Record<string, unknown>) => row.name as React.ReactNode,
    },
    {
      id: "role",
      header: "Role",
      accessor: (row: Record<string, unknown>) => row.role as React.ReactNode,
    },
  ];

  const [rows, setRows] = useState<TableRow[]>([
    { id: "1", name: "Alice", role: "Admin" },
    { id: "2", name: "Bob", role: "User" },
    { id: "3", name: "Carol", role: "Manager" },
  ]);

  const [clickedRow, setClickedRow] = useState<string | null>(null);

  const { dragAndDropHooks } = useDragAndDrop({
    ...createArrayHandlers(setRows, (row) => row.id),
  });

  return (
    <Stack gap="400">
      <DataTable
        columns={tableColumns}
        rows={rows}
        selectionMode="multiple"
        onRowClick={(row) => setClickedRow(row.id)}
        dragAndDropHooks={dragAndDropHooks}
      />
      <Text data-testid="table-order">
        {rows.map((r) => r.name).join(", ")}
      </Text>
      <Text data-testid="clicked-row">Clicked: {clickedRow ?? "none"}</Text>
    </Stack>
  );
};

export const DirectHookWithTable: Story = {
  render: () => <DirectHookWithTableDemo />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Table renders with drag handles, selection, and row click",
      async () => {
        const table = await canvas.findByRole("grid", {
          name: /data table/i,
        });
        const dataRows = within(table).getAllByRole("row");
        expect(dataRows.length).toBe(4);

        expect(
          within(dataRows[1]).getByRole("button", {
            name: /drag to reorder/i,
          })
        ).toBeInTheDocument();

        expect(canvas.getByTestId("table-order")).toHaveTextContent(
          "Alice, Bob, Carol"
        );
        expect(canvas.getByTestId("clicked-row")).toHaveTextContent(
          "Clicked: none"
        );
      }
    );

    await step("Reorder first row down via keyboard", async () => {
      const table = canvas.getByRole("grid", { name: /data table/i });
      const rows = within(table).getAllByRole("row");

      // Focus the first data row, then navigate to drag handle
      rows[1].focus();
      await wait();
      await userEvent.keyboard("{ArrowRight}");
      await wait();
      await userEvent.keyboard("{Enter}");
      await wait();
      await userEvent.keyboard("{ArrowDown}");
      await wait();
      await userEvent.keyboard("{Enter}");

      await waitFor(() => {
        expect(canvas.getByTestId("table-order")).toHaveTextContent(
          "Bob, Alice, Carol"
        );
      });
    });
  },
};
