import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { within, expect, userEvent, waitFor } from "storybook/test";
import {
  DataTable,
  Heading,
  Stack,
  Table,
  Text,
  ToggleButtonGroup,
} from "@commercetools/nimbus";
import type {
  DataTableColumnItem,
  DataTableRowItem,
  DataTableSize,
} from "./data-table.types";

const meta: Meta<typeof DataTable> = {
  title: "Playground/DataTable",
  component: DataTable,
};

export default meta;

type Story = StoryObj<typeof DataTable>;

type Product = {
  name: string;
  sku: string;
  category: string;
  stock: number;
};

const rows: DataTableRowItem<Product>[] = [
  {
    id: "1",
    name: "Espresso machine",
    sku: "EM-100",
    category: "Kitchen",
    stock: 12,
  },
  {
    id: "2",
    name: "Standing desk",
    sku: "SD-220",
    category: "Office",
    stock: 4,
  },
  {
    id: "3",
    name: "Trail shoes",
    sku: "TS-042",
    category: "Outdoor",
    stock: 37,
  },
  { id: "4", name: "Wool blanket", sku: "WB-310", category: "Home", stock: 0 },
];

const columns: DataTableColumnItem<Product>[] = [
  { id: "name", header: "Name", accessor: (row) => row.name },
  { id: "sku", header: "SKU", accessor: (row) => row.sku },
  { id: "category", header: "Category", accessor: (row) => row.category },
  { id: "stock", header: "Stock", accessor: (row) => row.stock, align: "end" },
];

const sizeOptions: { value: DataTableSize; label: string }[] = [
  { value: "sm", label: "sm" },
  { value: "md", label: "md" },
  { value: "lg", label: "lg" },
  { value: "xl", label: "xl (DataTable default)" },
];

/**
 * Compare `Table` and `DataTable` at the same size. `sm`, `md` and `lg`
 * should look the same on both. `xl` exists only on DataTable (the
 * deprecated default that keeps the previous look); Table then shows its own
 * default, `md`.
 *
 * The DataTable has selection and pinning enabled, so the internal columns
 * show how their padding follows the size while the controls stay 24px.
 */
export const SizeComparison: Story = {
  render: () => {
    const [size, setSize] = useState<DataTableSize>("md");
    const tableSize = size === "xl" ? undefined : size;

    return (
      <Stack gap="600">
        <ToggleButtonGroup.Root
          aria-label="Size"
          size="xs"
          disallowEmptySelection
          selectedKeys={new Set([size])}
          onSelectionChange={(keys) => {
            const [next] = Array.from(keys);
            if (next) setSize(next as DataTableSize);
          }}
        >
          {sizeOptions.map((option) => (
            <ToggleButtonGroup.Button key={option.value} id={option.value}>
              {option.label}
            </ToggleButtonGroup.Button>
          ))}
        </ToggleButtonGroup.Root>

        <Stack gap="200">
          <Heading size="sm">
            Table{" "}
            <Text as="span" color="neutral.11" fontWeight="400">
              size=
              {tableSize ? `"${tableSize}"` : "default (md) — Table has no xl"}
            </Text>
          </Heading>
          <Table.Root
            size={tableSize}
            variant="outline"
            data-testid="playground-table"
          >
            <Table.Header>
              <Table.Row>
                {columns.map((column) => (
                  <Table.ColumnHeader
                    key={column.id}
                    textAlign={column.align === "end" ? "end" : undefined}
                  >
                    {column.header}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {rows.map((row) => (
                <Table.Row key={row.id}>
                  {columns.map((column) => (
                    <Table.Cell
                      key={column.id}
                      textAlign={column.align === "end" ? "end" : undefined}
                    >
                      {column.accessor(row)}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Stack>

        <Stack gap="200">
          <Heading size="sm">
            DataTable{" "}
            <Text as="span" color="neutral.11" fontWeight="400">
              size=&quot;{size}&quot;
            </Text>
          </Heading>
          <DataTable
            columns={columns}
            rows={rows}
            // xl is passed only by leaving `size` out, so the playground
            // does not trigger the deprecation warning.
            size={size === "xl" ? undefined : size}
            selectionMode="multiple"
            aria-label="Products"
            data-testid="playground-data-table"
          />
        </Stack>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const cellPadding = (container: HTMLElement, selector: string) =>
      window.getComputedStyle(container.querySelector(selector)!).paddingLeft;

    for (const [label, padding] of [
      ["sm", "8px"],
      ["md", "12px"],
      ["lg", "16px"],
    ] as const) {
      await step(
        `${label}: Table and DataTable use the same padding`,
        async () => {
          await userEvent.click(canvas.getByRole("radio", { name: label }));
          const table = canvas.getByTestId("playground-table");
          const dataTable = canvas.getByTestId("playground-data-table");
          await waitFor(() => {
            expect(cellPadding(table, "tbody td")).toBe(padding);
            expect(cellPadding(dataTable, "tbody td[data-column-id]")).toBe(
              padding
            );
          });
        }
      );
    }

    await step("xl: DataTable returns to its previous look", async () => {
      await userEvent.click(canvas.getByRole("radio", { name: /^xl/ }));
      const dataTable = canvas.getByTestId("playground-data-table");
      await waitFor(() =>
        expect(cellPadding(dataTable, "tbody td[data-column-id]")).toBe("24px")
      );
    });
  },
};
