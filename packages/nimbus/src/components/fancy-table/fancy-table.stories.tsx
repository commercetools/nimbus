import type { Meta, StoryObj } from "@storybook/react-vite";
import { FancyTable } from "./fancy-table";
import { Heading, Stack } from "@/components";
import type {
  FancyTableComponentProps,
  FancyTableItem,
} from "./fancy-table.types";
import { fn } from "storybook/test";

interface ExampleItem extends FancyTableItem {
  name: string;
  type: string;
  size: string;
  modified: string;
}

const meta: Meta<typeof FancyTable.Root> = {
  title: "experimental/FancyTable",
  component: FancyTable.Root,
  args: {
    onSelectionChange: fn(),
    onSortChange: fn(),
    onRowAction: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof FancyTable.Root<ExampleItem>>;

const sampleData: ExampleItem[] = [
  { id: 1, name: "Documents", type: "Folder", size: "—", modified: "Today" },
  { id: 2, name: "Images", type: "Folder", size: "—", modified: "Yesterday" },
  {
    id: 3,
    name: "report.pdf",
    type: "PDF Document",
    size: "2.4 MB",
    modified: "2 days ago",
  },
  {
    id: 4,
    name: "presentation.pptx",
    type: "PowerPoint",
    size: "5.1 MB",
    modified: "1 week ago",
  },
  {
    id: 5,
    name: "data.xlsx",
    type: "Excel Sheet",
    size: "1.2 MB",
    modified: "2 weeks ago",
  },
];

const sampleColumns = [
  { id: "name", name: "Name", isRowHeader: true, allowsSorting: true },
  { id: "type", name: "Type", allowsSorting: true },
  { id: "size", name: "Size", allowsSorting: true },
  { id: "modified", name: "Modified", allowsSorting: true },
];

const mixedColumns = [
  {
    id: "name",
    name: "Name",
    isRowHeader: true,
    allowsSorting: true,
    width: 200,
  },
  { id: "type", name: "Type", allowsSorting: false, minWidth: 100 },
  { id: "size", name: "Size", allowsSorting: true, maxWidth: 150 },
  { id: "modified", name: "Modified", allowsSorting: true },
];

export const Basic: Story = {
  args: {
    items: sampleData,
    columns: sampleColumns,
    "aria-label": "File explorer table",
  },
};

export const WithSelection: Story = {
  args: {
    items: sampleData,
    columns: sampleColumns,
    selectionMode: "multiple",
    selectionBehavior: "toggle",
    "aria-label": "File explorer table with selection",
  },
};

export const WithSorting: Story = {
  args: {
    items: sampleData,
    columns: sampleColumns,
    "aria-label": "Sortable file explorer table",
  },
};

export const WithResizing: Story = {
  args: {
    items: sampleData,
    columns: sampleColumns,
    allowsResizing: true,
    "aria-label": "Resizable file explorer table",
  },
};

export const WithDragAndDrop: Story = {
  args: {
    items: sampleData,
    columns: sampleColumns,
    allowsDragging: true,
    selectionMode: "multiple",
    selectionBehavior: "toggle",
    "aria-label": "Draggable file explorer table",
    onReorder: fn(),
  },
};

export const Empty: Story = {
  args: {
    items: [],
    columns: sampleColumns,
    "aria-label": "Empty file explorer table",
    renderEmptyState: () => "No files found",
  },
};

export const Variants: Story = {
  args: {
    items: sampleData.slice(0, 3),
    columns: sampleColumns,
    "aria-label": "File explorer table variants",
  },
  render: (args) => (
    <Stack direction="column" gap="600">
      <div>
        <h3>Line variant (default)</h3>
        <FancyTable.Root {...args} variant="line" />
      </div>
      <div>
        <h3>Outline variant</h3>
        <FancyTable.Root {...args} variant="outline" />
      </div>
    </Stack>
  ),
};

export const Sizes: Story = {
  args: {
    items: sampleData.slice(0, 3),
    columns: sampleColumns,
    "aria-label": "File explorer table sizes",
  },
  render: (args) => (
    <Stack direction="column" gap="600">
      <Heading>sm</Heading>
      <FancyTable.Root {...args} size="sm" />

      <Heading>md</Heading>
      <FancyTable.Root {...args} size="md" />
    </Stack>
  ),
};

export const Interactive: Story = {
  args: {
    items: sampleData,
    columns: sampleColumns,
    interactive: true,
    onRowAction: fn(),
    "aria-label": "Interactive file explorer table",
  },
};

export const WithSingleSelection: Story = {
  args: {
    items: sampleData,
    columns: sampleColumns,
    selectionMode: "single",
    selectionBehavior: "toggle",
    "aria-label": "Single selection file explorer",
  },
};

export const Striped: Story = {
  args: {
    items: sampleData,
    columns: sampleColumns,
    interactive: true,
    striped: true,
    "aria-label": "Striped table",
  },
};

export const WithColumnBorders: Story = {
  args: {
    items: sampleData,
    columns: sampleColumns,
    showColumnBorder: true,
    "aria-label": "Table with column borders",
  },
};

export const CustomCellRendering: Story = {
  args: {
    items: sampleData,
    columns: sampleColumns,
    renderCell: (item, column) => {
      switch (column.id) {
        case "name":
          return <strong style={{ color: "blue" }}>{item.name}</strong>;
        case "size":
          return item.size === "—" ? (
            <em style={{ color: "gray" }}>Empty</em>
          ) : (
            <span style={{ fontFamily: "monospace" }}>{item.size}</span>
          );
        case "type":
          return `📁 ${item.type}`;
        default:
          return item[column.id];
      }
    },
    "aria-label": "Custom cell rendering table",
  },
};

export const WithRowActions: Story = {
  args: {
    items: sampleData,
    columns: sampleColumns,
    interactive: true,
    onRowAction: fn(),
    "aria-label": "Interactive rows table",
  },
};

const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: `File ${i + 1}`,
  type: i % 3 === 0 ? "Folder" : i % 2 === 0 ? "PDF" : "Image",
  size: i % 3 === 0 ? "—" : `${(Math.random() * 10).toFixed(1)} MB`,
  modified: `${Math.floor(Math.random() * 30)} days ago`,
}));

export const LargeDataset: Story = {
  args: {
    items: largeDataset,
    columns: sampleColumns,
    selectionMode: "multiple",
    selectionBehavior: "toggle",
    allowsResizing: true,
    "aria-label": "Large dataset table",
  },
};

export const FullFeatured: Story = {
  args: {
    items: sampleData,
    columns: sampleColumns,
    selectionMode: "multiple",
    selectionBehavior: "toggle",
    allowsResizing: true,
    allowsDragging: true,
    interactive: true,
    striped: true,
    showColumnBorder: true,
    onSelectionChange: fn(),
    onSortChange: fn(),
    onRowAction: fn(),
    onReorder: fn(),
    "aria-label": "Full featured table",
  },
};

export const LoadingState: Story = {
  args: {
    items: [],
    columns: sampleColumns,
    renderEmptyState: () => (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div>Loading...</div>
      </div>
    ),
    "aria-label": "Loading state table",
  },
};

export const CustomDragPreview: Story = {
  args: {
    items: sampleData,
    columns: sampleColumns,
    allowsDragging: true,
    selectionMode: "multiple",
    selectionBehavior: "toggle",
    renderDragPreview: (items) => (
      <div
        style={{
          padding: "8px",
          background: "white",
          border: "1px solid #ccc",
          borderRadius: "4px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        Dragging {items.length} item(s)
      </div>
    ),
    onReorder: fn(),
    "aria-label": "Custom drag preview table",
  },
};

const longContentData = [
  {
    id: 1,
    name: "This is a very long file name that should test text wrapping and overflow behavior in table cells",
    type: "Document with a very long type description",
    size: "999.99 GB",
    modified: "A very long time ago in a galaxy far, far away",
  },
  // ... more items with long content
];

export const LongContent: Story = {
  args: {
    items: longContentData,
    columns: sampleColumns,
    allowsResizing: true,
    "aria-label": "Long content table",
  },
};

export const MixedColumnConfiguration: Story = {
  args: {
    items: sampleData,
    columns: mixedColumns,
    allowsResizing: true,
    "aria-label": "Mixed column configuration table",
  },
};
