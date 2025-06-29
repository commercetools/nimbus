import type { Meta, StoryObj } from "@storybook/react-vite";
import { FancyTable } from "./fancy-table";
import { Stack } from "@/components";
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

const meta: Meta<typeof FancyTable> = {
  title: "experimental/FancyTable",
  component: FancyTable,
  args: {
    onSelectionChange: fn(),
    onSortChange: fn(),
    onRowAction: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof FancyTable<ExampleItem>>;

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
        <FancyTable {...args} variant="line" />
      </div>
      <div>
        <h3>Outline variant</h3>
        <FancyTable {...args} variant="outline" />
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
      <div>
        <h3>Small</h3>
        <FancyTable {...args} size="sm" />
      </div>
      <div>
        <h3>Medium (default)</h3>
        <FancyTable {...args} size="md" />
      </div>
      <div>
        <h3>Large</h3>
        <FancyTable {...args} size="lg" />
      </div>
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
