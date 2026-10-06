import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import {
  Badge,
  Box,
  DataTable,
  IconButton,
  Pagination,
  Stack,
  Text,
} from "@commercetools/nimbus";
import {
  AutoFixNormal,
  ContentCopy,
  Delete,
  RemoveRedEye,
  SmartToy,
} from "@commercetools/nimbus-icons";
import type { DataTableColumnItem, DataTableRowItem } from "./data-table.types";

/**
 * Playground for how consumers use DataTable. The story replicates usages
 * from `merchant-center-frontend` or `commerce-agents`, found by a repository
 * scan, with the default size, as those consumers render it today, so a change that
 * affects real content shows up in the snapshot. Sizes are covered by the
 * `Sizes` story in `data-table.stories.tsx`.
 */
const meta: Meta<typeof DataTable> = {
  title: "Playground/DataTable",
  component: DataTable,
  tags: ["vrt"],
  parameters: {
    chromatic: { disableSnapshot: false },
  },
};

export default meta;

type Story = StoryObj<typeof DataTable>;

// ============================================================
// 1. List page (modelled on the MCP servers list)
// ============================================================

type McpServer = {
  name: string;
  isEnabled: boolean;
  key: string;
  description: string;
  createdAt: string;
  tools: number;
};

const mcpServerRows: DataTableRowItem<McpServer>[] = [
  {
    id: "mcp-1",
    name: "Catalog assistant",
    isEnabled: true,
    key: "catalog-assistant",
    description:
      "Answers product questions and updates attributes across all catalogs of the project.",
    createdAt: "Sep 12, 2026, 10:42 AM",
    tools: 14,
  },
  {
    id: "mcp-2",
    name: "Order support with a considerably longer name that wraps",
    isEnabled: false,
    key: "order-support",
    description: "Looks up orders and payment states.",
    createdAt: "Aug 30, 2026, 4:05 PM",
    tools: 6,
  },
  {
    id: "mcp-3",
    name: "Promotions",
    isEnabled: true,
    key: "promotions-with-a-long-key-value",
    description:
      "Creates cart discounts and discount codes, and reports on their usage over time for every store.",
    createdAt: "Jul 3, 2026, 9:18 AM",
    tools: 9,
  },
];

/**
 * Cells set `textStyle="sm"` themselves, as the Merchant Center tables do
 * today.
 */
const buildMcpServerColumns = (): DataTableColumnItem<McpServer>[] => {
  const textStyle = "sm";
  return [
    {
      id: "name",
      header: "Name",
      accessor: (row) => (
        <Text fontWeight="500" textStyle={textStyle} lineClamp={3}>
          {row.name}
        </Text>
      ),
    },
    {
      id: "state",
      header: "State",
      minWidth: 120,
      maxWidth: 120,
      accessor: (row) => (
        <Badge size="2xs" colorPalette={row.isEnabled ? "positive" : "neutral"}>
          {row.isEnabled ? "Enabled" : "Disabled"}
        </Badge>
      ),
    },
    {
      id: "key",
      header: "Key",
      accessor: (row) => (
        <Stack direction="row" alignItems="center" gap="100">
          <Text textStyle={textStyle} lineClamp={2}>
            {row.key}
          </Text>
          {/* Keep the row click from firing while copying. */}
          <Box onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <IconButton
              size="2xs"
              variant="ghost"
              colorPalette="neutral"
              aria-label={`Copy URL of ${row.name}`}
            >
              <ContentCopy />
            </IconButton>
          </Box>
        </Stack>
      ),
    },
    {
      id: "description",
      header: "Description",
      accessor: (row) => (
        <Text textStyle={textStyle} lineClamp={2}>
          {row.description}
        </Text>
      ),
    },
    {
      id: "createdAt",
      header: "Date created",
      maxWidth: 210,
      accessor: (row) => (
        <Text textStyle={textStyle} lineClamp={2}>
          {row.createdAt}
        </Text>
      ),
    },
    {
      id: "tools",
      header: "Enabled tools",
      minWidth: 110,
      maxWidth: 135,
      align: "end",
      accessor: (row) => (
        <Text fontWeight="500" textStyle={textStyle}>
          {row.tools}
        </Text>
      ),
    },
    {
      id: "action",
      header: "Action",
      minWidth: 120,
      maxWidth: 120,
      accessor: () => "",
      render: ({ row }) => (
        <Box onClick={(e: React.MouseEvent) => e.stopPropagation()}>
          <IconButton
            size="xs"
            variant="ghost"
            colorPalette="critical"
            aria-label={`Delete ${row.name}`}
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];
};

// ============================================================
// 2. Two-line cells with an image (modelled on the agent registry)
// ============================================================

type Agent = {
  name: string;
  publisher: string;
  isInstalled: boolean;
  canRead: boolean;
  canWrite: boolean;
  description: string;
};

const agentRows: DataTableRowItem<Agent>[] = [
  {
    id: "agent-1",
    name: "Intake agent",
    publisher: "commercetools",
    isInstalled: true,
    canRead: true,
    canWrite: true,
    description: "Turns shopping lists and emails into carts.",
  },
  {
    id: "agent-2",
    name: "Promotions agent",
    publisher: "commercetools",
    isInstalled: false,
    canRead: true,
    canWrite: false,
    description: "Suggests and creates discounts.",
  },
];

const agentColumns: DataTableColumnItem<Agent>[] = [
  {
    id: "name",
    header: "Agent and publisher",
    accessor: (row) => row.name,
    render: ({ row }) => (
      <Stack direction="row" gap="300" alignItems="flex-start">
        {/* Stands in for the 24px publisher logo */}
        <Box
          aria-hidden
          flexShrink="0"
          width="600"
          height="600"
          borderRadius="100"
          bg="primary.3"
          color="primary.11"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <SmartToy />
        </Box>
        <Stack gap="050">
          <Text fontWeight="500">{row.name}</Text>
          <Text fontSize="sm" color="neutral.11">
            {row.publisher}
          </Text>
        </Stack>
      </Stack>
    ),
  },
  {
    id: "installed",
    header: "Installed",
    width: 100,
    accessor: (row) => row.isInstalled,
    render: ({ row }) => (
      <Badge size="2xs" colorPalette={row.isInstalled ? "positive" : "neutral"}>
        {row.isInstalled ? "Installed" : "Not installed"}
      </Badge>
    ),
  },
  {
    id: "scopes",
    header: "Requested scopes",
    width: 200,
    accessor: (row) => row.canWrite,
    render: ({ row }) => (
      <>
        {row.canRead && (
          <Badge size="2xs" colorPalette="primary" marginRight="200">
            <RemoveRedEye />
            Read
          </Badge>
        )}
        {row.canWrite && (
          <Badge size="2xs" colorPalette="warning">
            <AutoFixNormal />
            Write
          </Badge>
        )}
      </>
    ),
  },
  {
    id: "description",
    header: "Description",
    accessor: (row) => row.description,
  },
];

// ============================================================
// 3. Key/value summary (modelled on the commerce-agents chat UI)
// ============================================================

type PropertyValue = { property: string; value: ReactNode };

const summaryRows: DataTableRowItem<PropertyValue>[] = [
  { id: "name", property: "Name", value: "Autumn sale" },
  { id: "amount", property: "Amount off", value: "15%" },
  { id: "validFrom", property: "Valid from", value: "Oct 1, 2026" },
  {
    id: "stores",
    property: "Stores",
    value: (
      <Stack direction="row" gap="100">
        <Badge size="2xs">Berlin</Badge>
        <Badge size="2xs">Munich</Badge>
      </Stack>
    ),
  },
];

const summaryColumns: DataTableColumnItem<PropertyValue>[] = [
  {
    id: "property",
    header: "Property",
    accessor: (row) => (
      <Text fontWeight="500" color="fg">
        {row.property}
      </Text>
    ),
  },
  { id: "value", header: "Value", accessor: (row) => row.value },
];

const SectionHeading = ({ children }: { children: ReactNode }) => (
  <Text fontWeight="700" fontSize="500">
    {children}
  </Text>
);

const SectionDescription = ({ children }: { children: ReactNode }) => (
  <Text color="neutral.11" textStyle="sm">
    {children}
  </Text>
);

/**
 * One story with every consumer usage, as the other playgrounds do.
 */
export const UsageExploration: Story = {
  render: () => (
    <Stack gap="1000">
      <Stack gap="300">
        <SectionHeading>1 · List page</SectionHeading>
        <SectionDescription>
          Bold name, status badge, key with a copy button, clamped text,
          fixed-width columns, an action column, clickable rows, and pagination
          in the footer (compound API).
        </SectionDescription>
        <DataTable.Root
          columns={buildMcpServerColumns()}
          rows={mcpServerRows}
          allowsPinning={false}
          onRowClick={() => {}}
        >
          <DataTable.Table aria-label="MCP servers">
            <DataTable.Header />
            <DataTable.Body />
          </DataTable.Table>
          <DataTable.Footer>
            <Box pt="600">
              <Pagination
                totalItems={42}
                pageSize={20}
                currentPage={1}
                onPageChange={() => {}}
              />
            </Box>
          </DataTable.Footer>
        </DataTable.Root>
      </Stack>

      <Stack gap="300">
        <SectionHeading>2 · Two-line cells with an image</SectionHeading>
        <SectionDescription>
          A 24px logo next to name and publisher, plus badges with icons.
          Content height dominates the row.
        </SectionDescription>
        <DataTable
          columns={agentColumns}
          rows={agentRows}
          allowsPinning={false}
          onRowClick={() => {}}
          aria-label="Agents"
        />
      </Stack>

      <Stack gap="300">
        <SectionHeading>3 · Key/value summary</SectionHeading>
        <SectionDescription>
          Two columns, bold property, any content as value, no pinning.
        </SectionDescription>
        <Box maxW="480px">
          <DataTable
            columns={summaryColumns}
            rows={summaryRows}
            allowsPinning={false}
            aria-label="Discount summary"
          />
        </Box>
      </Stack>
    </Stack>
  ),
};
