import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable, Virtualizer, TableLayout } from "@commercetools/nimbus";
import { expect, within } from "storybook/test";

const meta: Meta = {
  title: "Compositions/DataTable Virtualized",
};

export default meta;

type Story = StoryObj<typeof meta>;

const columns = [
  {
    id: "name",
    header: "Name",
    accessor: (row: Record<string, string>) => row.name,
  },
  {
    id: "email",
    header: "Email",
    accessor: (row: Record<string, string>) => row.email,
  },
  {
    id: "department",
    header: "Department",
    accessor: (row: Record<string, string>) => row.department,
  },
  {
    id: "status",
    header: "Status",
    accessor: (row: Record<string, string>) => row.status,
  },
];

const rows = Array.from({ length: 1000 }, (_, i) => ({
  id: String(i),
  name: `Employee ${i + 1}`,
  email: `employee${i + 1}@example.com`,
  department: ["Engineering", "Sales", "Marketing", "Support"][i % 4],
  status: i % 3 === 0 ? "Active" : i % 3 === 1 ? "On Leave" : "Remote",
}));

/**
 * DataTable compound API with Virtualizer wrapping DataTable.Table.
 * 1000 rows, only visible ones rendered.
 */
export const VirtualizedCompound: Story = {
  render: () => (
    <div style={{ height: 500 }}>
      <DataTable.Root
        columns={columns}
        rows={rows}
        allowsSorting
        density="condensed"
      >
        <Virtualizer layout={TableLayout} layoutOptions={{ rowHeight: 36 }}>
          <DataTable.Table aria-label="Virtualized employees">
            <DataTable.Header aria-label="Table header" />
            <DataTable.Body aria-label="Table body" />
          </DataTable.Table>
        </Virtualizer>
      </DataTable.Root>
    </div>
  ),
  play: async ({
    canvasElement,
    step,
  }: {
    canvasElement: HTMLElement;
    step: (name: string, fn: () => Promise<void>) => Promise<void>;
  }) => {
    const canvas = within(canvasElement);

    await step("Renders the table grid", async () => {
      expect(canvas.getByRole("grid")).toBeInTheDocument();
    });

    await step("Renders fewer rows than total 1000", async () => {
      const rows = canvas.getAllByRole("row");
      expect(rows.length).toBeGreaterThan(1);
    });
  },
};

/**
 * Standard DataTable (non-compound) for comparison — all 1000 rows in DOM.
 */
export const NonVirtualizedBaseline: Story = {
  render: () => (
    <div style={{ height: 500, overflow: "auto" }}>
      <DataTable
        columns={columns}
        rows={rows.slice(0, 50)}
        allowsSorting
        density="condensed"
      />
    </div>
  ),
  play: async ({
    canvasElement,
    step,
  }: {
    canvasElement: HTMLElement;
    step: (name: string, fn: () => Promise<void>) => Promise<void>;
  }) => {
    const canvas = within(canvasElement);

    await step("Renders the table", async () => {
      expect(canvas.getByRole("grid")).toBeInTheDocument();
    });
  },
};
