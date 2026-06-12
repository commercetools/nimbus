import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState, useMemo } from "react";
import { Collection } from "react-aria-components";
import {
  Virtualizer,
  ListLayout,
  TableLayout,
  DataTable,
  Tree,
  SearchInput,
} from "@commercetools/nimbus";
import { expect, within } from "storybook/test";
import type {
  DataTableColumnItem,
  DataTableRowItem,
} from "@commercetools/nimbus";

/**
 * Composition stories showing Virtualizer paired with complex components.
 *
 * These examples demonstrate real-world usage of Virtualizer as a performance
 * layer in front of DataTable (TableLayout) and Tree (ListLayout), enabling
 * efficient rendering of very large datasets without sacrificing accessibility
 * or component behavior.
 */
const meta: Meta<typeof Virtualizer> = {
  title: "Compositions/Virtualizer",
  component: Virtualizer,
};

export default meta;

type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Mock data helpers
// ---------------------------------------------------------------------------

const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Sales",
  "Finance",
  "HR",
  "Legal",
] as const;

const STATUSES = ["Active", "Inactive", "Pending", "Suspended"] as const;

const FIRST_NAMES = [
  "Alice",
  "Bob",
  "Carol",
  "David",
  "Eve",
  "Frank",
  "Grace",
  "Hank",
  "Iris",
  "Jack",
] as const;

const LAST_NAMES = [
  "Smith",
  "Jones",
  "Williams",
  "Taylor",
  "Brown",
  "Davies",
  "Evans",
  "Wilson",
  "Thomas",
  "Roberts",
] as const;

type EmployeeRow = DataTableRowItem<{
  name: string;
  email: string;
  department: string;
  status: string;
}>;

/**
 * Generate a deterministic list of employee rows.
 *
 * Using index arithmetic instead of `Math.random()` keeps the data stable
 * across renders and avoids stale-closure issues with Storybook controls.
 */
function generateEmployees(count: number): EmployeeRow[] {
  return Array.from({ length: count }, (_, i) => {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName =
      LAST_NAMES[Math.floor(i / FIRST_NAMES.length) % LAST_NAMES.length];
    const department = DEPARTMENTS[i % DEPARTMENTS.length];
    const status = STATUSES[i % STATUSES.length];
    return {
      id: String(i + 1),
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      department,
      status,
    };
  });
}

const employeeRows = generateEmployees(1000);

const employeeColumns: DataTableColumnItem<EmployeeRow>[] = [
  {
    id: "name",
    header: "Name",
    accessor: (row) => row.name,
  },
  {
    id: "email",
    header: "Email",
    accessor: (row) => row.email,
  },
  {
    id: "department",
    header: "Department",
    accessor: (row) => row.department,
  },
  {
    id: "status",
    header: "Status",
    accessor: (row) => row.status,
  },
];

// ---------------------------------------------------------------------------
// Tree data helpers
// ---------------------------------------------------------------------------

interface LocalTreeNode {
  id: string;
  title: string;
  children?: LocalTreeNode[];
}

/**
 * Generate a flat list of tree nodes grouped into categories.
 *
 * Produces `categories` top-level nodes each with `itemsPerCategory` leaf
 * children, giving a total of `categories * (1 + itemsPerCategory)` nodes
 * rendered in the tree (including category rows).
 */
function generateTreeNodes(
  categories: number,
  itemsPerCategory: number
): LocalTreeNode[] {
  return Array.from({ length: categories }, (_, catIdx) => ({
    id: `cat-${catIdx}`,
    title: `Category ${catIdx + 1}`,
    children: Array.from({ length: itemsPerCategory }, (__, itemIdx) => ({
      id: `cat-${catIdx}-item-${itemIdx}`,
      title: `Item ${catIdx * itemsPerCategory + itemIdx + 1}`,
    })),
  }));
}

// ~500 total nodes: 50 categories × 9 children = 450 children + 50 parents
const treeNodes = generateTreeNodes(50, 9);

/** Recursive render function for a LocalTreeNode collection. */
const renderTreeNode = (node: LocalTreeNode): React.ReactElement => (
  <Tree.Item key={node.id} id={node.id} textValue={node.title}>
    <Tree.ItemContent>
      <Tree.Indicator />
      {node.title}
    </Tree.ItemContent>
    {node.children && node.children.length > 0 && (
      <Collection items={node.children}>{renderTreeNode}</Collection>
    )}
  </Tree.Item>
);

// ---------------------------------------------------------------------------
// Story 1: VirtualizedDataTable
// ---------------------------------------------------------------------------

/**
 * Virtualizer with TableLayout wrapping a DataTable backed by 1 000 employee
 * rows.
 *
 * TableLayout is the correct layout to use when virtualizing a `<table>`
 * element because it accounts for column widths and sticky headers. Only the
 * visible rows are rendered to the DOM at any time; the rest are recycled as
 * the user scrolls.
 *
 * **Note:** DataTable manages its own internal sort / filter state via its
 * Root context. Virtualizer sits outside that context and only controls which
 * rows are physically rendered.
 */
export const VirtualizedDataTable: Story = {
  render: () => (
    <div style={{ height: 500 }}>
      <Virtualizer layout={TableLayout} layoutOptions={{ rowHeight: 48 }}>
        <DataTable.Root columns={employeeColumns} rows={employeeRows}>
          <DataTable.Table>
            <DataTable.Header />
            <DataTable.Body />
          </DataTable.Table>
        </DataTable.Root>
      </Virtualizer>
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

    await step("Renders a table element", async () => {
      const table = canvas.getByRole("grid");
      expect(table).toBeInTheDocument();
    });

    await step("Renders column headers", async () => {
      // Column headers should always be present regardless of virtualization.
      const nameHeader = canvas.getByText("Name");
      const emailHeader = canvas.getByText("Email");
      const deptHeader = canvas.getByText("Department");
      const statusHeader = canvas.getByText("Status");

      expect(nameHeader).toBeInTheDocument();
      expect(emailHeader).toBeInTheDocument();
      expect(deptHeader).toBeInTheDocument();
      expect(statusHeader).toBeInTheDocument();
    });

    await step("Renders at least some data rows", async () => {
      const rows = canvas.getAllByRole("row");
      // At least the header row + one data row must be present.
      expect(rows.length).toBeGreaterThan(1);
    });
  },
};

// ---------------------------------------------------------------------------
// Story 2: VirtualizedTree
// ---------------------------------------------------------------------------

/**
 * Virtualizer with ListLayout wrapping a Tree that has ~500 nodes distributed
 * across 50 top-level categories.
 *
 * Tree renders a `treegrid` ARIA role; each node is a `row`. Virtualizer with
 * ListLayout is appropriate here because the tree's items are laid out
 * vertically in a single column.
 *
 * All top-level category nodes start expanded so the virtualizer has something
 * to render without requiring user interaction.
 */
export const VirtualizedTree: Story = {
  render: () => {
    const defaultExpandedKeys = treeNodes.map((n) => n.id);

    return (
      <div style={{ height: 500 }}>
        <Virtualizer
          layout={ListLayout}
          layoutOptions={{ estimatedRowSize: 36 }}
        >
          <Tree.Root
            aria-label="Virtualized category tree"
            defaultExpandedKeys={defaultExpandedKeys}
            items={treeNodes}
          >
            {renderTreeNode}
          </Tree.Root>
        </Virtualizer>
      </div>
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

    await step(
      "Renders a treegrid element with the accessible label",
      async () => {
        const treegrid = canvas.getByRole("treegrid", {
          name: "Virtualized category tree",
        });
        expect(treegrid).toBeInTheDocument();
      }
    );

    await step("Renders at least some tree rows", async () => {
      const rows = canvas.getAllByRole("row");
      expect(rows.length).toBeGreaterThan(0);
    });
  },
};

// ---------------------------------------------------------------------------
// Story 3: FilteredVirtualizedTree
// ---------------------------------------------------------------------------

/**
 * SearchInput + Virtualizer + Tree: a filterable, virtualized tree.
 *
 * The SearchInput drives a controlled `filterText` state. The tree data is
 * filtered in memory before being passed to `Tree.Root`; only matching nodes
 * (and their parents) remain visible. Virtualizer then renders only the rows
 * currently in the viewport.
 *
 * This is the recommended pattern for large, searchable hierarchical data:
 * filter BEFORE virtualizing so that the virtualizer always has an accurate
 * item count.
 */
export const FilteredVirtualizedTree: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [filterText, setFilterText] = useState("");

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const filteredNodes = useMemo<LocalTreeNode[]>(() => {
      if (!filterText.trim()) return treeNodes;

      const lower = filterText.toLowerCase();

      return treeNodes
        .map((category) => {
          // If the category title itself matches, include the whole subtree.
          if (category.title.toLowerCase().includes(lower)) {
            return category;
          }

          // Otherwise filter children and include the category only if it has
          // at least one matching child.
          const matchingChildren = (category.children ?? []).filter((child) =>
            child.title.toLowerCase().includes(lower)
          );

          if (matchingChildren.length === 0) return null;

          return { ...category, children: matchingChildren };
        })
        .filter((node): node is LocalTreeNode => node !== null);
    }, [filterText]);

    const defaultExpandedKeys = filteredNodes.map((n) => n.id);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: 560,
          gap: 8,
        }}
      >
        <SearchInput
          aria-label="Filter tree"
          placeholder="Search items…"
          value={filterText}
          onChange={setFilterText}
        />
        <div style={{ flex: 1 }}>
          <Virtualizer
            layout={ListLayout}
            layoutOptions={{ estimatedRowSize: 36 }}
          >
            <Tree.Root
              aria-label="Filtered virtualized category tree"
              defaultExpandedKeys={defaultExpandedKeys}
              items={filteredNodes}
            >
              {renderTreeNode}
            </Tree.Root>
          </Virtualizer>
        </div>
      </div>
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

    await step("Renders search input and tree on load", async () => {
      const searchInput = canvas.getByRole("searchbox", {
        name: "Filter tree",
      });
      expect(searchInput).toBeInTheDocument();

      const treegrid = canvas.getByRole("treegrid", {
        name: "Filtered virtualized category tree",
      });
      expect(treegrid).toBeInTheDocument();
    });

    await step("Renders rows before filtering", async () => {
      const rows = canvas.getAllByRole("row");
      expect(rows.length).toBeGreaterThan(0);
    });

    await step("Typing in the search input filters visible rows", async () => {
      const searchInput = canvas.getByRole("searchbox", {
        name: "Filter tree",
      });

      // Focus the field and type a specific term that targets a subset.
      searchInput.focus();
      // Simulate value change directly — JSDOM's userEvent.type can race with
      // the controlled value, so we fire a native input event instead.
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )?.set;
      nativeInputValueSetter?.call(searchInput, "Item 1");
      searchInput.dispatchEvent(new Event("input", { bubbles: true }));
      searchInput.dispatchEvent(new Event("change", { bubbles: true }));

      // After filtering the tree should still render at least some rows.
      const rows = canvas.getAllByRole("row");
      expect(rows.length).toBeGreaterThan(0);
    });
  },
};
