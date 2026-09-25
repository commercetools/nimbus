import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ReactNode } from "react";
import { within, expect, userEvent, waitFor } from "storybook/test";
import {
  Badge,
  Box,
  DataTable,
  Heading,
  IconButton,
  Pagination,
  Stack,
  Switch,
  Table,
  Text,
  ToggleButtonGroup,
} from "@commercetools/nimbus";
import {
  AutoFixNormal,
  ContentCopy,
  Delete,
  RemoveRedEye,
  SmartToy,
} from "@commercetools/nimbus-icons";
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

const sizeOptions: { value: DataTableSize; label: string }[] = [
  { value: "sm", label: "sm" },
  { value: "md", label: "md" },
  { value: "lg", label: "lg" },
  { value: "xl", label: "xl (DataTable default)" },
];

/**
 * `xl` is the deprecated default: it is reached by leaving `size` out, so the
 * playground never triggers the deprecation warning.
 */
const toSizeProp = (size: DataTableSize) => (size === "xl" ? undefined : size);

const Section = ({
  title,
  description,
  children,
}: {
  title: string;
  description: ReactNode;
  children: ReactNode;
}) => (
  <Stack gap="300">
    <Stack gap="100">
      <Heading size="md">{title}</Heading>
      <Text color="neutral.11" textStyle="sm">
        {description}
      </Text>
    </Stack>
    {children}
  </Stack>
);

// ============================================================
// 1. Table vs DataTable
// ============================================================

type Product = {
  name: string;
  sku: string;
  category: string;
  stock: number;
};

const productRows: DataTableRowItem<Product>[] = [
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
];

const productColumns: DataTableColumnItem<Product>[] = [
  { id: "name", header: "Name", accessor: (row) => row.name },
  { id: "sku", header: "SKU", accessor: (row) => row.sku },
  { id: "category", header: "Category", accessor: (row) => row.category },
  { id: "stock", header: "Stock", accessor: (row) => row.stock, align: "end" },
];

const TableComparison = ({ size }: { size: DataTableSize }) => {
  const tableSize = toSizeProp(size);
  return (
    <Stack gap="400">
      <Text textStyle="sm" fontWeight="500">
        Table{" "}
        <Text as="span" color="neutral.11" fontWeight="400">
          size={tableSize ? `"${tableSize}"` : "default (md) — Table has no xl"}
        </Text>
      </Text>
      <Table.Root
        size={tableSize}
        variant="outline"
        data-testid="playground-table"
      >
        <Table.Header>
          <Table.Row>
            {productColumns.map((column) => (
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
          {productRows.map((row) => (
            <Table.Row key={row.id}>
              {productColumns.map((column) => (
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
      <Text textStyle="sm" fontWeight="500">
        DataTable{" "}
        <Text as="span" color="neutral.11" fontWeight="400">
          size=&quot;{size}&quot;
        </Text>
      </Text>
      <DataTable
        columns={productColumns}
        rows={productRows}
        size={tableSize}
        selectionMode="multiple"
        aria-label="Products"
        data-testid="playground-data-table"
      />
    </Stack>
  );
};

// ============================================================
// 2. List page (modelled on the MCP servers list)
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
 * @param ownTextStyle - cells set `textStyle="sm"` themselves, as the
 * Merchant Center tables do today; this overrides the size's text style
 */
const buildMcpServerColumns = (
  ownTextStyle: boolean
): DataTableColumnItem<McpServer>[] => {
  const textStyle = ownTextStyle ? "sm" : undefined;
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

const ListPageTable = ({
  size,
  ownTextStyle,
}: {
  size: DataTableSize;
  ownTextStyle: boolean;
}) => {
  const [clicked, setClicked] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <Stack gap="200">
      <DataTable.Root
        columns={buildMcpServerColumns(ownTextStyle)}
        rows={mcpServerRows}
        size={toSizeProp(size)}
        allowsPinning={false}
        onRowClick={(row) => setClicked(row.name as string)}
        data-testid="playground-list-page"
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
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </Box>
        </DataTable.Footer>
      </DataTable.Root>
      <Text textStyle="sm" color="neutral.11" data-testid="playground-clicked">
        Last row click: {clicked ?? "none"}
      </Text>
    </Stack>
  );
};

// ============================================================
// 3. Two-line cells with an image (modelled on the agent registry)
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
// 4. Key/value summary (modelled on the commerce-agents chat UI)
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

// ============================================================
// STORY
// ============================================================

/**
 * One size control drives every table below. Sections 2–4 replicate how
 * DataTable is used in `merchant-center-frontend` and `commerce-agents`
 * (nimbus-pulse scan #20), so `size` can be judged on real content.
 */
export const SizeComparison: Story = {
  render: () => {
    const [size, setSize] = useState<DataTableSize>("md");
    const [ownTextStyle, setOwnTextStyle] = useState(true);

    return (
      <Stack gap="1000">
        <Box
          position="sticky"
          top="0"
          zIndex="10"
          bg="bg"
          py="300"
          borderBottom="1px solid {colors.neutral.3}"
        >
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
        </Box>

        <Section
          title="1. Table vs DataTable"
          description="sm, md and lg should look the same on both. The DataTable has selection and pinning on, so the internal columns scale too."
        >
          <TableComparison size={size} />
        </Section>

        <Section
          title="2. List page"
          description="Modelled on the MCP servers list: bold name, status badge, key with a copy button, clamped text, fixed-width columns, an action column, clickable rows, and pagination in the footer (compound API)."
        >
          <ListPageTable size={size} ownTextStyle={ownTextStyle} />
        </Section>

        <Section
          title="3. Cells that set their own text style"
          description='Most Merchant Center tables wrap every cell in <Text textStyle="sm">. That overrides the size: at lg the text stays 14px. Turn it off to see the text follow the size. Applies to the list page above.'
        >
          <Switch isSelected={ownTextStyle} onChange={setOwnTextStyle}>
            Cells set textStyle=&quot;sm&quot; themselves
          </Switch>
        </Section>

        <Section
          title="4. Two-line cells with an image"
          description="Modelled on the agent registry: a 24px logo next to name and publisher, plus badges with icons. Content height dominates the row."
        >
          <DataTable
            columns={agentColumns}
            rows={agentRows}
            size={toSizeProp(size)}
            allowsPinning={false}
            onRowClick={() => {}}
            aria-label="Agents"
            data-testid="playground-agents"
          />
        </Section>

        <Section
          title="5. Key/value summary"
          description="Modelled on the commerce-agents chat UI: two columns, bold property, any content as value, no pinning."
        >
          <Box maxW="480px">
            <DataTable
              columns={summaryColumns}
              rows={summaryRows}
              size={toSizeProp(size)}
              allowsPinning={false}
              aria-label="Discount summary"
              data-testid="playground-summary"
            />
          </Box>
        </Section>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const style = (container: HTMLElement, selector: string) =>
      window.getComputedStyle(container.querySelector(selector)!);
    const dataTableIds = [
      "playground-data-table",
      "playground-list-page",
      "playground-agents",
      "playground-summary",
    ];

    for (const [label, padding] of [
      ["sm", "8px"],
      ["md", "12px"],
      ["lg", "16px"],
    ] as const) {
      await step(`${label}: every table follows the size control`, async () => {
        await userEvent.click(canvas.getByRole("radio", { name: label }));
        await waitFor(() => {
          expect(
            style(canvas.getByTestId("playground-table"), "tbody td")
              .paddingLeft
          ).toBe(padding);
          for (const id of dataTableIds) {
            expect(
              style(canvas.getByTestId(id), "tbody td[data-column-id]")
                .paddingLeft
            ).toBe(padding);
          }
        });
      });
    }

    await step("xl: every DataTable returns to its previous look", async () => {
      await userEvent.click(canvas.getByRole("radio", { name: /^xl/ }));
      await waitFor(() => {
        for (const id of dataTableIds) {
          expect(
            style(canvas.getByTestId(id), "tbody td[data-column-id]")
              .paddingLeft
          ).toBe("24px");
        }
      });
    });

    await step(
      "Own text style overrides the size until turned off",
      async () => {
        await userEvent.click(canvas.getByRole("radio", { name: "lg" }));
        const listPage = canvas.getByTestId("playground-list-page");
        const cellText =
          "tbody td[data-column-id='description'] p, tbody td[data-column-id='description'] span";
        await waitFor(() =>
          expect(style(listPage, cellText).fontSize).toBe("14px")
        );
        await userEvent.click(
          canvas.getByRole("switch", { name: /set textStyle/ })
        );
        await waitFor(() =>
          expect(style(listPage, cellText).fontSize).toBe("16px")
        );
      }
    );

    await step("Copy button does not trigger the row click", async () => {
      const listPage = canvas.getByTestId("playground-list-page");
      await userEvent.click(
        within(listPage).getByRole("button", { name: /Copy URL of Promotions/ })
      );
      expect(canvas.getByTestId("playground-clicked")).toHaveTextContent(
        "Last row click: none"
      );
    });

    // Storybook runs this play on open; leave the story in its start state.
    await step("Restore the start state", async () => {
      await userEvent.click(canvas.getByRole("radio", { name: "md" }));
      await userEvent.click(
        canvas.getByRole("switch", { name: /set textStyle/ })
      );
      (document.activeElement as HTMLElement | null)?.blur();
      await waitFor(() =>
        expect(
          canvas.getByRole("switch", { name: /set textStyle/ })
        ).toBeChecked()
      );
    });
  },
};
