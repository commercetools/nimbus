import type { Meta, StoryObj } from "@storybook/react-vite";
import { FancyTable } from "./fancy-table";
import { Heading, Stack } from "@/components";
import type {
  FancyTableComponentProps,
  FancyTableItem,
  FancyTableColumn,
} from "./fancy-table.types";
import { fn } from "storybook/test";
import React from "react";
import { type SortDescriptor } from "react-aria-components";

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

type Story = StoryObj<FancyTableComponentProps<ExampleItem>>;

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

const sampleColumns: FancyTableColumn[] = [
  { id: "name", name: "Name", isRowHeader: true, allowsSorting: true },
  { id: "type", name: "Type", allowsSorting: true },
  { id: "size", name: "Size", allowsSorting: true },
  { id: "modified", name: "Modified", allowsSorting: true },
];

const mixedColumns: FancyTableColumn[] = [
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
    ...Basic.args,
    selectionMode: "multiple",
    selectionBehavior: "toggle",
    "aria-label": "File explorer table with selection",
  },
};

export const WithSorting: Story = {
  args: {
    ...Basic.args,
    "aria-label": "Sortable file explorer table",
    onSortChange: fn(),
  },
  render: (args) => {
    const [sortDescriptor, setSortDescriptor] = React.useState<
      SortDescriptor | undefined
    >({
      column: "name",
      direction: "ascending",
    });

    return (
      <FancyTable.Root
        {...args}
        sortDescriptor={sortDescriptor}
        onSortChange={(descriptor) => {
          args.onSortChange?.(descriptor);
          setSortDescriptor(descriptor);
        }}
      />
    );
  },
};

export const WithResizing: Story = {
  args: {
    ...Basic.args,
    allowsResizing: true,
    "aria-label": "Resizable file explorer table",
  },
};

export const WithDragAndDrop: Story = {
  args: {
    ...Basic.args,
    allowsDragging: true,
    selectionMode: "multiple",
    selectionBehavior: "toggle",
    "aria-label": "Draggable file explorer table",
    onReorder: fn(),
  },
};

export const Empty: Story = {
  args: {
    ...Basic.args,
    items: [],
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
    ...Basic.args,
    interactive: true,
    onRowAction: fn(),
    "aria-label": "Interactive file explorer table",
  },
};

export const WithSingleSelection: Story = {
  args: {
    ...Basic.args,
    selectionMode: "single",
    selectionBehavior: "toggle",
    "aria-label": "Single selection file explorer",
  },
};

export const Striped: Story = {
  args: {
    ...Basic.args,
    interactive: true,
    striped: true,
    "aria-label": "Striped table",
  },
};

export const WithColumnBorders: Story = {
  args: {
    ...Basic.args,
    showColumnBorder: true,
    "aria-label": "Table with column borders",
  },
};

export const CustomCellRendering: Story = {
  args: {
    ...Basic.args,
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
    ...Basic.args,
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

export const LargeDataSet: Story = {
  args: {
    ...Basic.args,
    items: largeDataset,
    "aria-label": "Table with large dataset",
  },
};

export const FullFeatured: Story = {
  args: {
    ...WithSelection.args,
    ...WithSorting.args,
    ...WithResizing.args,
    ...WithDragAndDrop.args,
    ...WithRowActions.args,
    ...Striped.args,
    ...WithColumnBorders.args,
  },
};

export const CustomDragPreview: Story = {
  args: {
    ...WithDragAndDrop.args,
    renderDragPreview: (items) => (
      <div
        style={{
          backgroundColor: "white",
          padding: "8px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        Dragging {items.length} items
      </div>
    ),
  },
};

export const LongContent: Story = {
  args: {
    ...Basic.args,
    items: [
      {
        id: 1,
        name: "Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong name",
        type: "Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong type",
        size: "Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong size",
        modified:
          "Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong modified",
      },
      ...sampleData,
    ],
  },
};

export const MixedColumnConfiguration: Story = {
  args: {
    ...Basic.args,
    columns: mixedColumns,
  },
};
