// DataTable stories for row expansion and nested content.
// They share the title of data-table.stories.tsx, so Storybook lists them
// under one DataTable entry and the story ids stay the same.

import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { within, expect, waitFor, userEvent } from "storybook/test";
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  DataTable,
} from "@/components";
import {
  columns,
  rows,
  flexibleNestedData,
  modifiedFetchedData,
  behaviourColumns,
  behaviourRows,
} from "./data-table.test-data";
import type { DataTableRowItem, DataTableProps } from "./data-table.types";
import { DataTableWithModals } from "./utils/data-table.test-component";
import { rowNamed } from "./utils/data-table.test-utils";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<object> = {
  title: "Components/DataTable",
  component: DataTable,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<DataTableProps>;

export const FlexibleNestedChildren: Story = {
  render: (args) => {
    return (
      <Stack gap="400">
        <Stack gap="300">
          <Heading size="md">Flexible Nested Children</Heading>
          <Text>
            Demonstrates the new flexible children system where nested content
            can be either:
          </Text>
          <Box as="ul" ml="500" lineHeight="1.6">
            <Box as="li">
              <Text as="span" fontWeight="bold">
                Table rows
              </Text>{" "}
              - Traditional nested table structure (Alice's projects)
            </Box>
            <Box as="li">
              <Text as="span" fontWeight="bold">
                React components
              </Text>{" "}
              - Rich interactive content like profile cards, forms, charts
            </Box>
            <Box as="li">
              <Text as="span" fontWeight="bold">
                Simple content
              </Text>{" "}
              - Text, alerts, or any other React elements
            </Box>
          </Box>
          <Text>
            Click the expand buttons to see different types of nested content.
          </Text>
        </Stack>
        <DataTableWithModals {...args} onRowAction={() => {}} />
      </Stack>
    );
  },
  args: {
    columns: [
      {
        id: "name",
        header: "Name",
        accessor: (row) => row.name as React.ReactNode,
      },
      {
        id: "age",
        header: "Age",
        accessor: (row) => row.age as React.ReactNode,
      },
      {
        id: "role",
        header: "Role",
        accessor: (row) => row.role as React.ReactNode,
      },
      {
        id: "class",
        header: "Level",
        accessor: (row) => row.class as React.ReactNode,
      },
    ],
    rows: flexibleNestedData,
    allowsSorting: true,
    isResizable: true,
    maxHeight: "400px",
    nestedKey: "children",
  },
};

/**
 * ## Row Nested Content Panels
 *
 * Demonstrates the `renderNestedContent` prop which renders a full-width nested content panel
 * below a row when clicked. The nested content panel spans all columns and toggles
 * open/closed on row click. Works alongside selection and nested expansion.
 */
export const RowNestedContent: Story = {
  // VRT: `[data-nested-cell]` inset shadow; the play ends with rows expanded.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => {
    return (
      <DataTable
        columns={columns}
        rows={rows}
        renderNestedContent={(row) => (
          <Box p="400">
            <Heading as="h4" size="sm">
              Details for {row.id}
            </Heading>
            <Text>
              This is the nested content panel content for the row. It spans the
              full width of the table.
            </Text>
          </Box>
        )}
        data-testid="detail-panels-table"
      />
    );
  },
  args: {},
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Table renders without any nested content panels open",
      async () => {
        const table = await canvas.findByRole("grid");
        expect(table).toBeInTheDocument();

        const detailRows = canvasElement.querySelectorAll(
          "[data-nested-row-expanded='true']"
        );
        expect(detailRows.length).toBe(0);
      }
    );

    await step("Clicking expand button opens nested content", async () => {
      const allRows = canvas.getAllByRole("row");
      const firstDataRow = allRows[1];
      const expandButton = within(firstDataRow).getByRole("button", {
        name: "Expand",
      });

      await userEvent.click(expandButton);

      await waitFor(
        () => {
          const openDetails = canvasElement.querySelectorAll(
            "[data-nested-row-expanded='true']"
          );
          expect(openDetails.length).toBe(1);
        },
        { timeout: 3000 }
      );

      expect(canvas.getByText(`Details for ${rows[0].id}`)).toBeInTheDocument();
    });

    await step("Clicking collapse button closes nested content", async () => {
      const allRows = canvas.getAllByRole("row");
      const firstDataRow = allRows[1];
      const collapseButton = within(firstDataRow).getByRole("button", {
        name: "Collapse",
      });

      await userEvent.click(collapseButton);

      await waitFor(
        () => {
          const openDetails = canvasElement.querySelectorAll(
            "[data-nested-row-expanded='true']"
          );
          expect(openDetails.length).toBe(0);
        },
        { timeout: 3000 }
      );
    });

    await step("Nested content panel spans all columns", async () => {
      const allRows = canvas.getAllByRole("row");
      const firstDataRow = allRows[1];
      const expandButton = within(firstDataRow).getByRole("button", {
        name: "Expand",
      });

      await userEvent.click(expandButton);

      await waitFor(
        () => {
          const openDetails = canvasElement.querySelectorAll(
            "[data-nested-row-expanded='true']"
          );
          expect(openDetails.length).toBe(1);
        },
        { timeout: 3000 }
      );

      const detailCell = canvasElement.querySelector("[data-nested-cell]");
      expect(detailCell).toBeInTheDocument();

      const headerCells = canvasElement.querySelectorAll("thead th");
      const colSpan = detailCell?.getAttribute("colspan");
      expect(Number(colSpan)).toBe(headerCells.length);
    });

    await step("Multiple rows can have details open", async () => {
      const allRows = canvas.getAllByRole("row");
      // First row should already be open from previous step
      // Click second data row — index 3 because detail row is in between
      const thirdRow = allRows[3];
      const expandButton = within(thirdRow).getByRole("button", {
        name: "Expand",
      });

      await userEvent.click(expandButton);

      await waitFor(
        () => {
          const openDetails = canvasElement.querySelectorAll(
            "[data-nested-row-expanded='true']"
          );
          expect(openDetails.length).toBe(2);
        },
        { timeout: 3000 }
      );
    });

    (document.activeElement as HTMLElement | null)?.blur();
  },
};

/**
 * ## Row Nested Content Panels with Selection
 *
 * Demonstrates that `renderNestedContent` works alongside row selection.
 */
export const RowNestedContentWithSelection: Story = {
  render: () => {
    return (
      <DataTable
        columns={columns}
        rows={rows}
        selectionMode="multiple"
        renderNestedContent={(row) => (
          <Box p="400">
            <Text>Nested content panel for row: {row.id}</Text>
          </Box>
        )}
        data-testid="detail-panels-selection-table"
      />
    );
  },
  args: {},
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Clicking a checkbox does not toggle nested content panel",
      async () => {
        const allRows = canvas.getAllByRole("row");
        const firstDataRow = allRows[1];
        const checkbox = within(firstDataRow).getByRole("checkbox");
        await userEvent.click(checkbox);

        await waitFor(
          () => {
            expect(checkbox).toBeChecked();
          },
          { timeout: 3000 }
        );

        const openDetails = canvasElement.querySelectorAll(
          "[data-nested-row-expanded='true']"
        );
        expect(openDetails.length).toBe(0);
      }
    );

    await step(
      "Clicking expand button opens nested content panel",
      async () => {
        const allRows = canvas.getAllByRole("row");
        const firstDataRow = allRows[1];
        const expandButton = within(firstDataRow).getByRole("button", {
          name: "Expand",
        });

        await userEvent.click(expandButton);

        await waitFor(
          () => {
            const openDetails = canvasElement.querySelectorAll(
              "[data-nested-row-expanded='true']"
            );
            expect(openDetails.length).toBe(1);
          },
          { timeout: 3000 }
        );
      }
    );
  },
};

/**
 * ## Row Nested Content Panels with Close Button
 *
 * Demonstrates the `close` callback passed to `renderNestedContent` which allows
 * consumers to dismiss the nested content panel from within.
 */
export const RowNestedContentWithClose: Story = {
  render: () => {
    return (
      <DataTable
        columns={columns}
        rows={rows}
        renderNestedContent={(row, { close }) => (
          <Flex p="400" justifyContent="space-between" alignItems="center">
            <Text>Nested content panel for row: {row.id}</Text>
            <Button size="sm" variant="outline" onPress={close}>
              Close
            </Button>
          </Flex>
        )}
        data-testid="detail-close-table"
      />
    );
  },
  args: {},
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Open a nested content panel via expand button", async () => {
      const allRows = canvas.getAllByRole("row");
      const firstDataRow = allRows[1];
      const expandButton = within(firstDataRow).getByRole("button", {
        name: "Expand",
      });

      await userEvent.click(expandButton);

      await waitFor(
        () => {
          const openDetails = canvasElement.querySelectorAll(
            "[data-nested-row-expanded='true']"
          );
          expect(openDetails.length).toBe(1);
        },
        { timeout: 3000 }
      );
    });

    await step(
      "Expanded row has aria-controls linking to the nested content panel",
      async () => {
        const allRows = canvas.getAllByRole("row");
        const firstDataRow = allRows[1];

        expect(firstDataRow).toHaveAttribute(
          "aria-controls",
          `nested-content-${rows[0].id}`
        );
      }
    );

    await step("Close button dismisses the nested content panel", async () => {
      const closeButton = await canvas.findByRole("button", {
        name: /close/i,
      });
      await userEvent.click(closeButton);

      await waitFor(
        () => {
          const openDetails = canvasElement.querySelectorAll(
            "[data-nested-row-expanded='true']"
          );
          expect(openDetails.length).toBe(0);
        },
        { timeout: 3000 }
      );
    });

    await step("Collapsed row does not have aria-controls", async () => {
      const allRows = canvas.getAllByRole("row");
      const firstDataRow = allRows[1];

      expect(firstDataRow).not.toHaveAttribute("aria-controls");
    });
  },
};

/**
 * ## Row Nested Content via Row Click
 *
 * When `allowsExpandColumn` is `false`, rows expand via row click instead
 * of the chevron button. This mirrors how `nestedKey` behaves when the
 * expand column is hidden.
 */
export const RowNestedContentViaRowClick: Story = {
  render: () => {
    return (
      <DataTable
        columns={columns}
        rows={rows}
        allowsExpandColumn={false}
        renderNestedContent={(row) => (
          <Box p="400">
            <Heading as="h4" size="sm">
              Details for {row.id}
            </Heading>
            <Text>Expanded via row click (no chevron column).</Text>
          </Box>
        )}
        data-testid="nested-row-click-table"
      />
    );
  },
  args: {},
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("No expand button is rendered", async () => {
      const allRows = canvas.getAllByRole("row");
      const firstDataRow = allRows[1];
      expect(
        within(firstDataRow).queryByRole("button", { name: "Expand" })
      ).not.toBeInTheDocument();
    });

    await step("Clicking a row expands nested content", async () => {
      const allRows = canvas.getAllByRole("row");
      const firstDataRow = allRows[1];
      const cell = within(firstDataRow).getAllByRole("rowheader")[0];

      await userEvent.click(cell);

      await waitFor(
        () => {
          const openDetails = canvasElement.querySelectorAll(
            "[data-nested-row-expanded='true']"
          );
          expect(openDetails.length).toBe(1);
        },
        { timeout: 3000 }
      );
    });

    await step("Clicking again collapses nested content", async () => {
      const allRows = canvas.getAllByRole("row");
      const firstDataRow = allRows[1];
      const cell = within(firstDataRow).getAllByRole("rowheader")[0];

      await userEvent.click(cell);

      await waitFor(
        () => {
          const openDetails = canvasElement.querySelectorAll(
            "[data-nested-row-expanded='true']"
          );
          expect(openDetails.length).toBe(0);
        },
        { timeout: 3000 }
      );
    });
  },
};

/**
 * ## Row Nested Content via Row Click with onRowAction
 *
 * When `allowsExpandColumn` is `false` and `onRowAction` is provided,
 * clicking a row fires both the expand toggle and `onRowAction`.
 */
export const RowNestedContentViaRowClickWithOnRowClick: Story = {
  render: () => {
    const [lastClicked, setLastClicked] = React.useState<string | null>(null);
    return (
      <Stack gap="300">
        <Text data-testid="last-clicked">
          {lastClicked ? `Clicked: ${lastClicked}` : "No row clicked"}
        </Text>
        <DataTable
          columns={columns}
          rows={rows}
          allowsExpandColumn={false}
          onRowAction={(row) => setLastClicked(row.id)}
          renderNestedContent={(row) => (
            <Box p="400">
              <Text>Details for {row.id}</Text>
            </Box>
          )}
          data-testid="nested-row-click-onrowclick-table"
        />
      </Stack>
    );
  },
  args: {},
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Clicking a row fires both expand and onRowAction", async () => {
      const allRows = canvas.getAllByRole("row");
      const firstDataRow = allRows[1];
      const cell = within(firstDataRow).getAllByRole("rowheader")[0];

      await userEvent.click(cell);

      await waitFor(
        () => {
          const openDetails = canvasElement.querySelectorAll(
            "[data-nested-row-expanded='true']"
          );
          expect(openDetails.length).toBe(1);
        },
        { timeout: 3000 }
      );

      expect(canvas.getByTestId("last-clicked")).toHaveTextContent(
        `Clicked: ${rows[0].id}`
      );
    });

    await step(
      "Clicking again collapses and fires onRowAction again",
      async () => {
        const allRows = canvas.getAllByRole("row");
        const firstDataRow = allRows[1];
        const cell = within(firstDataRow).getAllByRole("rowheader")[0];

        await userEvent.click(cell);

        await waitFor(
          () => {
            const openDetails = canvasElement.querySelectorAll(
              "[data-nested-row-expanded='true']"
            );
            expect(openDetails.length).toBe(0);
          },
          { timeout: 3000 }
        );
      }
    );
  },
};

/**
 * ## Nested Content Override with nestedKey
 *
 * When both `renderNestedContent` and `nestedKey` are provided, rows that have
 * data at `row[nestedKey]` render that content instead of the default template.
 * Rows without `nestedKey` data fall through to `renderNestedContent`.
 */
export const NestedContentOverride: Story = {
  render: () => {
    const overrideColumns = [
      {
        id: "name",
        header: "Name",
        accessor: (row: Record<string, unknown>) => row.name as string,
        isRowHeader: true,
      },
      {
        id: "role",
        header: "Role",
        accessor: (row: Record<string, unknown>) => row.role as string,
      },
    ];

    const overrideRows = [
      { id: "1", name: "Alice", role: "Admin" },
      {
        id: "2",
        name: "Bob",
        role: "User",
        details: (
          <Box p="400" bg="yellow.2">
            <Text fontWeight="bold">Custom override for Bob</Text>
            <Text>This row uses nestedKey content instead of the default.</Text>
          </Box>
        ),
      },
      { id: "3", name: "Carol", role: "User" },
      {
        id: "4",
        name: "David",
        role: "Manager",
        details: (
          <Box p="400" bg="yellow.2">
            <Text fontWeight="bold">Custom override for David</Text>
            <Text>This row also uses nestedKey content.</Text>
          </Box>
        ),
      },
    ];

    return (
      <DataTable
        columns={overrideColumns}
        rows={overrideRows}
        nestedKey="details"
        renderNestedContent={(row) => (
          <Box p="400">
            <Text>
              Default nested content for {row.name as string} (
              {row.role as string})
            </Text>
          </Box>
        )}
        data-testid="nested-override-table"
      />
    );
  },
  args: {},
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Row with nestedKey data shows override content", async () => {
      const allRows = canvas.getAllByRole("row");
      // Click Bob's expand button (row index 2)
      const bobRow = allRows[2];
      const expandButton = within(bobRow).getByRole("button", {
        name: "Expand",
      });
      await userEvent.click(expandButton);

      await waitFor(
        () => {
          expect(
            canvas.getByText("Custom override for Bob")
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    await step(
      "Row without nestedKey data shows renderNestedContent",
      async () => {
        const allRows = canvas.getAllByRole("row");
        // Click Alice's expand button (row index 1) — no nestedKey data
        const aliceRow = allRows[1];
        const expandButton = within(aliceRow).getByRole("button", {
          name: "Expand",
        });
        await userEvent.click(expandButton);

        await waitFor(
          () => {
            expect(
              canvas.getByText("Default nested content for Alice (Admin)")
            ).toBeInTheDocument();
          },
          { timeout: 3000 }
        );
      }
    );
  },
};

export const NoNestedContent: Story = {
  render: (args) => {
    return (
      <Stack gap="400">
        <Stack gap="300">
          <Heading size="md">No Nested Content (Default Behavior)</Heading>
          <Text>
            When no <Text as="code">nestedKey</Text> is provided, the component
            ignores any nested properties and only renders parent rows. This is
            the new default behavior.
          </Text>
          <Box
            p="300"
            bg="warning.2"
            border="1px solid"
            borderColor="warning.6"
            borderRadius="150"
            fontSize="350"
          >
            <Text>
              <Text as="strong">Note:</Text> The data below contains "children"
              properties, but they won't be rendered without explicitly setting{" "}
              <Text as="code">nestedKey="children"</Text>.
            </Text>
          </Box>
        </Stack>
        <DataTableWithModals {...args} onRowAction={() => {}} />
      </Stack>
    );
  },
  args: {
    columns: [
      {
        id: "name",
        header: "Name",
        accessor: (row) => row.name as React.ReactNode,
      },
      {
        id: "type",
        header: "Type",
        accessor: (row) => row.type as React.ReactNode,
      },
      {
        id: "status",
        header: "Status",
        accessor: (row) => row.status as React.ReactNode,
      },
    ],
    rows: [
      {
        id: "parent-1",
        name: "Parent Item 1",
        type: "Parent",
        status: "Active",
        // This children property will be ignored without nestedKey
        children: [
          {
            id: "child-1",
            name: "Child Item 1",
            type: "Child",
            status: "Hidden",
          },
          {
            id: "child-2",
            name: "Child Item 2",
            type: "Child",
            status: "Hidden",
          },
        ],
      },
      {
        id: "parent-2",
        name: "Parent Item 2",
        type: "Parent",
        status: "Active",
        // This children property will also be ignored
        children: (
          <div>This React content won't be shown without nestedKey</div>
        ),
      },
      {
        id: "parent-3",
        name: "Parent Item 3",
        type: "Parent",
        status: "Active",
        // No children property at all
      },
    ],
    allowsSorting: true,
    isResizable: true,
    // Notice: no nestedKey prop, so no nested content will be rendered
  },
};

export const NestedTable: Story = {
  render: (args) => {
    return (
      <Stack gap="400">
        <Stack gap="300">
          <Heading size="md">Tables Within Tables</Heading>
          <Text>
            This example demonstrates nested DataTable components where each
            parent row can expand to show a complete DataTable with its own
            data, columns, and functionality.
          </Text>
          <Box
            p="300"
            bg="info.2"
            border="1px solid"
            borderColor="info.6"
            borderRadius="150"
            fontSize="350"
          >
            <Text>
              <Text as="strong">Usage:</Text> Nest DataTable components as React
              content using custom nestedKey
            </Text>
          </Box>
        </Stack>
        <DataTableWithModals {...args} onRowAction={() => {}} />
      </Stack>
    );
  },
  args: {
    columns: [
      {
        id: "name",
        header: "Galaxy/Object",
        accessor: (row: Record<string, unknown>) => row.name as React.ReactNode,
      },
      {
        id: "type",
        header: "Type",
        accessor: (row: Record<string, unknown>) => row.type as React.ReactNode,
      },
      {
        id: "distance",
        header: "Distance",
        accessor: (row: Record<string, unknown>) =>
          row.distance as React.ReactNode,
      },
    ],
    rows: modifiedFetchedData,
    nestedKey: "sky", // Custom nested key
    allowsSorting: true,
    isResizable: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders parent table with correct structure", async () => {
      // Verify column headers
      await expect(canvas.getByText("Galaxy/Object")).toBeInTheDocument();
      await expect(canvas.getByText("Type")).toBeInTheDocument();
      await expect(canvas.getByText("Distance")).toBeInTheDocument();
    });

    await step("Displays all parent rows correctly", async () => {
      // Verify the three galaxy rows are visible
      await expect(canvas.getByText("Milky Way")).toBeInTheDocument();
      await expect(canvas.getByText("Andromeda")).toBeInTheDocument();
      await expect(canvas.getByText("Abrakadabra")).toBeInTheDocument();
    });

    await step(
      "Shows expand buttons for rows with nested content",
      async () => {
        // Find all expand/collapse buttons (chevron buttons)
        const expandButtons = canvas.getAllByRole("button", {
          name: /expand/i,
        });

        // Should have at least 2 expand buttons (Milky Way and Andromeda have nested data)
        await expect(expandButtons.length).toBeGreaterThanOrEqual(2);
      }
    );

    await step("Expands parent row to show nested table", async () => {
      // Find the Milky Way row and its expand button
      const milkyWayRow = canvas.getByText("Milky Way").closest('[role="row"]');
      await expect(milkyWayRow).toBeInTheDocument();

      // Find and click the expand button in the Milky Way row
      const expandButton = within(milkyWayRow as HTMLElement).getByRole(
        "button",
        {
          name: /expand/i,
        }
      );
      await userEvent.click(expandButton);

      // Wait for nested content to appear
      await waitFor(async () => {
        // Look for the heading that appears in nested content
        await expect(canvas.getByText("Milky Way Details")).toBeInTheDocument();
      });
    });
    await step(
      "Collapses nested table when clicking expand button again",
      async () => {
        // Find the Milky Way row again
        const milkyWayRow = canvas
          .getByText("Milky Way", { exact: true })
          .closest('[role="row"]');

        // Click the collapse button
        const collapseButton = within(milkyWayRow as HTMLElement).getByRole(
          "button",
          {
            name: /collapse/i,
          }
        );
        await userEvent.click(collapseButton);

        // Wait for nested content to disappear
        await waitFor(async () => {
          await expect(
            canvas.queryByText("Milky Way Details")
          ).not.toBeInTheDocument();
        });

        // Verify nested data is no longer visible
        await expect(
          canvas.queryByText("Alpha Centauri")
        ).not.toBeInTheDocument();
      }
    );

    await step(
      "Multiple nested tables can be expanded simultaneously",
      async () => {
        const andromedaRow = canvas
          .getByText("Andromeda")
          .closest('[role="row"]');

        const andromedaRowExpandButton = within(
          andromedaRow as HTMLElement
        ).getByRole("button", {
          name: /expand/i,
        });
        await userEvent.click(andromedaRowExpandButton);

        // Expand Milky Way again while Andromeda is still expanded
        const milkyWayRow = canvas
          .getByText("Milky Way")
          .closest('[role="row"]');

        const milkyWayExpandButton = within(
          milkyWayRow as HTMLElement
        ).getByRole("button", {
          name: /expand/i,
        });
        await userEvent.click(milkyWayExpandButton);

        // Wait for both nested tables to be visible
        await waitFor(async () => {
          await expect(
            canvas.getByText("Milky Way Details")
          ).toBeInTheDocument();
          await expect(
            canvas.getByText("Andromeda Details")
          ).toBeInTheDocument();
        });
      }
    );

    await step(
      "Row without nested content does not show expand button",
      async () => {
        // Abrakadabra doesn't have nested content
        const abrakadabraRow = canvas
          .getByText("Abrakadabra")
          .closest('[role="row"]');
        await expect(abrakadabraRow).toBeInTheDocument();

        // Try to find an expand button - it should not exist or be limited
        const buttons = within(abrakadabraRow as HTMLElement).queryAllByRole(
          "button",
          {
            name: /expand/i,
          }
        );

        // There should be no expand button
        expect(buttons.length).toBe(0);
      }
    );
  },
};

export const NestedTableDefaultExpanded: Story = {
  render: (args) => {
    return (
      <Stack gap="400">
        <Heading size="md">Default Expanded (Uncontrolled)</Heading>
        <Text>
          The first row is expanded by default using the defaultExpanded prop.
        </Text>
        <DataTableWithModals {...args} onRowAction={() => {}} />
      </Stack>
    );
  },
  args: {
    columns: [
      {
        id: "name",
        header: "Galaxy/Object",
        accessor: (row: Record<string, unknown>) => row.name as React.ReactNode,
      },
      {
        id: "type",
        header: "Type",
        accessor: (row: Record<string, unknown>) => row.type as React.ReactNode,
      },
      {
        id: "distance",
        header: "Distance",
        accessor: (row: Record<string, unknown>) =>
          row.distance as React.ReactNode,
      },
    ],
    rows: modifiedFetchedData,
    nestedKey: "sky",
    defaultExpandedRows: new Set(["galaxy-1"]),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Row specified in defaultExpanded is expanded on mount",
      async () => {
        await waitFor(async () => {
          await expect(
            canvas.getByText("Milky Way Details")
          ).toBeInTheDocument();
        });

        // Andromeda should NOT be expanded
        await expect(
          canvas.queryByText("Andromeda Details")
        ).not.toBeInTheDocument();
      }
    );

    await step(
      "User can still toggle expansion in uncontrolled mode",
      async () => {
        // Collapse Milky Way
        const milkyWayRow = canvas
          .getByText("Milky Way")
          .closest('[role="row"]');
        const collapseButton = within(milkyWayRow as HTMLElement).getByRole(
          "button",
          { name: /collapse/i }
        );
        await userEvent.click(collapseButton);

        await waitFor(async () => {
          await expect(
            canvas.queryByText("Milky Way Details")
          ).not.toBeInTheDocument();
        });

        // Expand Andromeda
        const andromedaRow = canvas
          .getByText("Andromeda")
          .closest('[role="row"]');
        const expandButton = within(andromedaRow as HTMLElement).getByRole(
          "button",
          { name: /expand/i }
        );
        await userEvent.click(expandButton);

        await waitFor(async () => {
          await expect(
            canvas.getByText("Andromeda Details")
          ).toBeInTheDocument();
        });
      }
    );
  },
};

export const NestedTableControlledExpansion: Story = {
  render: (args) => {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(
      new Set(["galaxy-1"])
    );

    return (
      <Stack gap="400">
        <Heading size="md">Controlled Expansion</Heading>
        <Text>
          Expansion state is controlled externally. Use the buttons below to
          expand/collapse rows programmatically.
        </Text>
        <Flex gap="300">
          <Button
            variant="outline"
            onPress={() => setExpandedRows(new Set(["galaxy-1", "galaxy-2"]))}
          >
            Expand All
          </Button>
          <Button variant="outline" onPress={() => setExpandedRows(new Set())}>
            Collapse All
          </Button>
          <Button
            variant="outline"
            onPress={() =>
              setExpandedRows((prev) => {
                const next = new Set(prev);
                if (next.has("galaxy-2")) {
                  next.delete("galaxy-2");
                } else {
                  next.add("galaxy-2");
                }
                return next;
              })
            }
          >
            Toggle Andromeda
          </Button>
        </Flex>
        <DataTableWithModals
          {...args}
          expandedRows={expandedRows}
          onExpandRowsChange={setExpandedRows}
          onRowAction={() => {}}
        />
      </Stack>
    );
  },
  args: {
    columns: [
      {
        id: "name",
        header: "Galaxy/Object",
        accessor: (row: Record<string, unknown>) => row.name as React.ReactNode,
      },
      {
        id: "type",
        header: "Type",
        accessor: (row: Record<string, unknown>) => row.type as React.ReactNode,
      },
      {
        id: "distance",
        header: "Distance",
        accessor: (row: Record<string, unknown>) =>
          row.distance as React.ReactNode,
      },
    ],
    rows: modifiedFetchedData,
    nestedKey: "sky",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Initially expanded row from controlled state is visible",
      async () => {
        await waitFor(async () => {
          await expect(
            canvas.getByText("Milky Way Details")
          ).toBeInTheDocument();
        });

        await expect(
          canvas.queryByText("Andromeda Details")
        ).not.toBeInTheDocument();
      }
    );

    await step("Expand All button expands all rows", async () => {
      const expandAllButton = canvas.getByRole("button", {
        name: "Expand All",
      });
      await userEvent.click(expandAllButton);

      await waitFor(async () => {
        await expect(canvas.getByText("Milky Way Details")).toBeInTheDocument();
        await expect(canvas.getByText("Andromeda Details")).toBeInTheDocument();
      });
    });

    await step("Collapse All button collapses all rows", async () => {
      const collapseAllButton = canvas.getByRole("button", {
        name: "Collapse All",
      });
      await userEvent.click(collapseAllButton);

      await waitFor(async () => {
        await expect(
          canvas.queryByText("Milky Way Details")
        ).not.toBeInTheDocument();
        await expect(
          canvas.queryByText("Andromeda Details")
        ).not.toBeInTheDocument();
      });
    });

    await step("Toggle Andromeda button toggles only Andromeda", async () => {
      const toggleButton = canvas.getByRole("button", {
        name: "Toggle Andromeda",
      });
      await userEvent.click(toggleButton);

      await waitFor(async () => {
        await expect(canvas.getByText("Andromeda Details")).toBeInTheDocument();
      });

      await expect(
        canvas.queryByText("Milky Way Details")
      ).not.toBeInTheDocument();
    });

    await step(
      "Clicking expand icon in controlled mode calls onExpandChange",
      async () => {
        // Click the expand icon for Milky Way
        const milkyWayRow = canvas
          .getByText("Milky Way")
          .closest('[role="row"]');
        const expandButton = within(milkyWayRow as HTMLElement).getByRole(
          "button",
          { name: /expand/i }
        );
        await userEvent.click(expandButton);

        // Since the parent state controls expansion via onExpandChange,
        // both Andromeda and Milky Way should now be visible
        await waitFor(async () => {
          await expect(
            canvas.getByText("Milky Way Details")
          ).toBeInTheDocument();
          await expect(
            canvas.getByText("Andromeda Details")
          ).toBeInTheDocument();
        });
      }
    );
  },
};

export const HiddenExpandColumn: Story = {
  render: () => {
    return (
      <DataTable
        columns={[
          {
            id: "name",
            header: "Name",
            accessor: (row) => row.name as React.ReactNode,
          },
          {
            id: "role",
            header: "Role",
            accessor: (row) => row.role as React.ReactNode,
          },
        ]}
        rows={flexibleNestedData}
        nestedKey="children"
        allowsExpandColumn={false}
        data-testid="no-expand-table"
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Expand column header is not rendered", async () => {
      const table = await canvas.findByRole("grid");
      expect(table).toBeInTheDocument();

      const expandHeader = canvas.queryByRole("columnheader", {
        name: /expand rows/i,
      });
      expect(expandHeader).not.toBeInTheDocument();
    });

    await step("Expand chevron buttons are not rendered", async () => {
      const expandButtons = canvas.queryAllByRole("button", {
        name: /expand|collapse/i,
      });
      expect(expandButtons.length).toBe(0);
    });

    await step("Row click expands nested content", async () => {
      const dataRows = canvasElement.querySelectorAll("tbody tr");
      const firstDataRow = dataRows[0] as HTMLElement;

      await userEvent.click(firstDataRow);

      await waitFor(
        async () => {
          const expandedRows = canvasElement.querySelectorAll(
            '[data-nested-row-expanded="true"]'
          );
          expect(expandedRows.length).toBe(1);
        },
        { timeout: 1000 }
      );
    });

    await step("Row click collapses expanded content", async () => {
      const dataRows = canvasElement.querySelectorAll("tbody tr");
      const firstDataRow = dataRows[0] as HTMLElement;

      await userEvent.click(firstDataRow);

      await waitFor(
        async () => {
          const expandedRows = canvasElement.querySelectorAll(
            '[data-nested-row-expanded="true"]'
          );
          expect(expandedRows.length).toBe(0);
        },
        { timeout: 1000 }
      );
    });
  },
};

export const HiddenPinAndExpandColumns: Story = {
  render: () => {
    return (
      <DataTable
        columns={[
          {
            id: "name",
            header: "Name",
            accessor: (row) => row.name as React.ReactNode,
          },
          {
            id: "role",
            header: "Role",
            accessor: (row) => row.role as React.ReactNode,
          },
        ]}
        rows={flexibleNestedData}
        nestedKey="children"
        allowsPinning={false}
        allowsExpandColumn={false}
        data-testid="no-pin-expand-table"
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Neither pin nor expand columns are rendered", async () => {
      const table = await canvas.findByRole("grid");
      expect(table).toBeInTheDocument();

      const pinHeader = canvas.queryByRole("columnheader", {
        name: /pin rows/i,
      });
      expect(pinHeader).not.toBeInTheDocument();

      const expandHeader = canvas.queryByRole("columnheader", {
        name: /expand rows/i,
      });
      expect(expandHeader).not.toBeInTheDocument();
    });

    await step(
      "Only data columns are present (no internal columns)",
      async () => {
        const columnHeaders = canvas.getAllByRole("columnheader");
        expect(columnHeaders.length).toBe(2);
      }
    );

    await step("Row click still expands nested content", async () => {
      const dataRows = canvasElement.querySelectorAll("tbody tr");
      const firstDataRow = dataRows[0] as HTMLElement;

      await userEvent.click(firstDataRow);

      await waitFor(
        async () => {
          const expandedRows = canvasElement.querySelectorAll(
            '[data-nested-row-expanded="true"]'
          );
          expect(expandedRows.length).toBe(1);
        },
        { timeout: 1000 }
      );
    });
  },
};

export const HiddenExpandColumnWithRowClick: Story = {
  render: () => {
    const [expanded, setExpanded] = useState<Set<string>>(new Set());
    const [lastClicked, setLastClicked] = useState<string | null>(null);

    return (
      <Stack gap="300">
        <Text data-testid="last-clicked">
          {lastClicked
            ? `Clicked: ${lastClicked}`
            : "Click a row to expand and see its id"}
        </Text>
        <DataTable
          columns={[
            {
              id: "name",
              header: "Name",
              accessor: (row) => row.name as React.ReactNode,
            },
            {
              id: "role",
              header: "Role",
              accessor: (row) => row.role as React.ReactNode,
            },
          ]}
          rows={flexibleNestedData}
          nestedKey="children"
          allowsExpandColumn={false}
          expandedRows={expanded}
          onExpandRowsChange={setExpanded}
          onRowAction={(row) => {
            setLastClicked(row.id);
            const next = new Set(expanded);
            if (next.has(row.id)) {
              next.delete(row.id);
            } else {
              next.add(row.id);
            }
            setExpanded(next);
          }}
          data-testid="expand-row-click-table"
        />
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Expand column is not rendered", async () => {
      await canvas.findByRole("grid");

      const expandHeader = canvas.queryByRole("columnheader", {
        name: /expand rows/i,
      });
      expect(expandHeader).not.toBeInTheDocument();
    });

    await step(
      "Row click fires onRowAction and expands via controlled state",
      async () => {
        const dataRows = canvasElement.querySelectorAll("tbody tr");
        const firstDataRow = dataRows[0] as HTMLElement;

        await userEvent.click(firstDataRow);

        await waitFor(
          async () => {
            const clickedText = canvas.getByTestId("last-clicked");
            expect(clickedText.textContent).toContain("Clicked:");

            const expandedRows = canvasElement.querySelectorAll(
              '[data-nested-row-expanded="true"]'
            );
            expect(expandedRows.length).toBe(1);
          },
          { timeout: 1000 }
        );
      }
    );

    await step("Second click collapses via controlled state", async () => {
      const dataRows = canvasElement.querySelectorAll("tbody tr");
      const firstDataRow = dataRows[0] as HTMLElement;

      await userEvent.click(firstDataRow);

      await waitFor(
        async () => {
          const expandedRows = canvasElement.querySelectorAll(
            '[data-nested-row-expanded="true"]'
          );
          expect(expandedRows.length).toBe(0);
        },
        { timeout: 1000 }
      );
    });
  },
};

/**
 * With selection enabled, the nested row spans exactly the cells a data row
 * renders, including the checkbox column.
 */
export const NestedRowSpansSelectionColumn: Story = {
  render: () => (
    <DataTable
      columns={behaviourColumns}
      rows={behaviourRows}
      selectionMode="multiple"
      defaultExpandedRows={new Set(["r1"])}
      renderNestedContent={(row) => <Text>Details for {String(row.name)}</Text>}
      aria-label="Nested row with a selection column"
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("The nested row spans every rendered column", async () => {
      await canvas.findByText("Details for Ada");
      const firstDataRow = canvas.getByRole("row", { name: /Ada/ });
      expect(within(firstDataRow).getByRole("checkbox")).toBeInTheDocument();
      const cellCount = firstDataRow.querySelectorAll(
        '[role="gridcell"], [role="rowheader"]'
      ).length;
      const nestedCell = canvasElement.querySelector(
        "[data-nested-cell]"
      ) as HTMLTableCellElement;
      expect(nestedCell.colSpan).toBe(cellCount);
    });
  },
};

/**
 * Without an expand column, Enter expands the row, like a click.
 */
export const EnterExpandsWithoutExpandColumn: Story = {
  render: () => (
    <DataTable
      columns={behaviourColumns}
      rows={behaviourRows}
      allowsExpandColumn={false}
      renderNestedContent={(row) => <Text>Details for {String(row.name)}</Text>}
      aria-label="Expand with Enter"
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await canvas.findByText("Ada");

    await step("Enter expands the focused row", async () => {
      expect(canvas.queryByText("Details for Ada")).not.toBeInTheDocument();
      rowNamed(canvasElement, /Ada/).focus();
      await userEvent.keyboard("{Enter}");
      expect(await canvas.findByText("Details for Ada")).toBeInTheDocument();
    });

    await step("Enter again collapses it", async () => {
      rowNamed(canvasElement, /Ada/).focus();
      await userEvent.keyboard("{Enter}");
      await waitFor(() =>
        expect(canvas.queryByText("Details for Ada")).not.toBeInTheDocument()
      );
    });
  },
};

/**
 * The placeholder for list-valued `nestedKey` data comes from the message
 * catalog.
 */
export const NestedItemsCountIsLocalized: Story = {
  render: () => (
    <DataTable
      columns={behaviourColumns}
      rows={[
        { ...behaviourRows[0], children: [{ id: "c1" }] },
        { ...behaviourRows[1], children: [{ id: "c2" }, { id: "c3" }] },
      ]}
      nestedKey="children"
      defaultExpandedRows={new Set(["r1", "r2"])}
      aria-label="Localized nested placeholder"
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("The item count reads from the catalog", async () => {
      expect(await canvas.findByText("Nested items: 1")).toBeInTheDocument();
      expect(canvas.getByText("Nested items: 2")).toBeInTheDocument();
    });
  },
};

/**
 * The expand button meets the WCAG 2.2 SC 2.5.8 minimum target size of
 * 24×24 CSS px, with and without a selection column (the expand column is
 * narrower next to the selection column).
 */
export const ExpandButtonTargetSize: Story = {
  render: () => (
    <Stack gap="600">
      <Box data-testid="Expand without selection">
        <DataTable
          columns={behaviourColumns}
          rows={behaviourRows.slice(0, 1)}
          renderNestedContent={(row) => <Text>{String(row.name)}</Text>}
        />
      </Box>
      <Box data-testid="Expand with selection">
        <DataTable
          columns={behaviourColumns}
          rows={behaviourRows.slice(0, 1)}
          selectionMode="multiple"
          renderNestedContent={(row) => <Text>{String(row.name)}</Text>}
        />
      </Box>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    for (const name of ["Expand without selection", "Expand with selection"]) {
      await step(`${name}: at least 24×24`, async () => {
        const table = await canvas.findByTestId(name);
        const button = await within(table).findByRole("button", {
          name: "Expand",
        });
        const { width, height } = button.getBoundingClientRect();
        expect(width).toBeGreaterThanOrEqual(24);
        expect(height).toBeGreaterThanOrEqual(24);
      });
    }
  },
};

/**
 * A collapsed row's nested content is not part of the table. Arrow keys move
 * straight to the next data row, and the grid reports only the rows a user
 * can reach.
 */
export const CollapsedRowsDoNotTrapArrowKeys: Story = {
  render: () => (
    <DataTable
      columns={behaviourColumns}
      rows={behaviourRows}
      renderNestedContent={(row) => <Text>Details for {String(row.name)}</Text>}
      aria-label="Collapsed rows and arrow keys"
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await canvas.findByText("Ada");
    const focusedRowText = () =>
      (document.activeElement?.closest('[role="row"]')?.textContent ?? "")
        .trim()
        .slice(0, 12);

    await step("Collapsed rows have no hidden nested row", async () => {
      const bodyRows = canvasElement.querySelectorAll("tbody [role='row']");
      expect(bodyRows).toHaveLength(behaviourRows.length);
    });

    await step("ArrowDown moves from row to row", async () => {
      rowNamed(canvasElement, /Ada/).focus();
      await userEvent.keyboard("{ArrowDown}");
      expect(focusedRowText()).toMatch(/^Grace/);
      await userEvent.keyboard("{ArrowDown}");
      expect(focusedRowText()).toMatch(/^Linus/);
    });

    await step("ArrowUp moves back row by row", async () => {
      await userEvent.keyboard("{ArrowUp}");
      expect(focusedRowText()).toMatch(/^Grace/);
    });

    await step("An expanded row's content is reachable", async () => {
      const ada = rowNamed(canvasElement, /Ada/);
      await userEvent.click(
        within(ada).getByRole("button", { name: "Expand" })
      );
      expect(await canvas.findByText("Details for Ada")).toBeInTheDocument();
      rowNamed(canvasElement, /Ada/).focus();
      await userEvent.keyboard("{ArrowDown}");
      expect(focusedRowText()).toMatch(/^Details for/);
      await userEvent.keyboard("{ArrowDown}");
      expect(focusedRowText()).toMatch(/^Grace/);
    });
  },
};

/**
 * Closing nested content from inside returns focus to the control that opened
 * it, so a keyboard user does not end up on the page body.
 */
export const CloseReturnsFocusToOpener: Story = {
  render: () => {
    const renderPanel = (
      row: DataTableRowItem,
      { close }: { close: () => void }
    ) => (
      <Button size="xs" variant="outline" onPress={close}>
        Close {String(row.name)}
      </Button>
    );
    return (
      <Stack gap="600">
        <Box data-testid="with-expand-column">
          <DataTable
            columns={behaviourColumns}
            rows={behaviourRows}
            renderNestedContent={renderPanel}
          />
        </Box>
        <Box data-testid="without-expand-column">
          <DataTable
            columns={behaviourColumns}
            rows={behaviourRows}
            allowsExpandColumn={false}
            renderNestedContent={renderPanel}
          />
        </Box>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("With an expand column, focus returns to it", async () => {
      const table = within(await canvas.findByTestId("with-expand-column"));
      await userEvent.click(
        within(table.getByRole("row", { name: /Ada/ })).getByRole("button", {
          name: "Expand",
        })
      );
      const close = await table.findByRole("button", { name: "Close Ada" });
      close.focus();
      await userEvent.keyboard("{Enter}");
      await waitFor(() =>
        expect(
          table.queryByRole("button", { name: "Close Ada" })
        ).not.toBeInTheDocument()
      );
      await waitFor(() =>
        expect(document.activeElement).toBe(
          within(table.getByRole("row", { name: /Ada/ })).getByRole("button", {
            name: "Expand",
          })
        )
      );
    });

    await step(
      "Without an expand column, focus returns to the row",
      async () => {
        const table = within(canvas.getByTestId("without-expand-column"));
        table.getByRole("row", { name: /Ada/ }).focus();
        await userEvent.keyboard("{Enter}");
        const close = await table.findByRole("button", { name: "Close Ada" });
        close.focus();
        await userEvent.keyboard("{Enter}");
        await waitFor(() =>
          expect(
            table.queryByRole("button", { name: "Close Ada" })
          ).not.toBeInTheDocument()
        );
        await waitFor(() =>
          expect(document.activeElement).toBe(
            table.getByRole("row", { name: /Ada/ })
          )
        );
      }
    );
  },
};

/**
 * Two tables on one page can use the same row ids. Closing nested content
 * returns focus to the opener in the table that closed it, not in the other
 * table.
 */
export const CloseReturnsFocusWithSharedRowIds: Story = {
  render: () => {
    const renderPanel = (
      row: DataTableRowItem,
      { close }: { close: () => void }
    ) => (
      <Button size="xs" variant="outline" onPress={close}>
        Close {String(row.name)}
      </Button>
    );
    return (
      <Stack gap="600">
        <Box data-testid="first-table">
          <DataTable
            columns={behaviourColumns}
            rows={behaviourRows}
            renderNestedContent={renderPanel}
            aria-label="First table"
          />
        </Box>
        <Box data-testid="second-table">
          <DataTable
            columns={behaviourColumns}
            rows={behaviourRows}
            renderNestedContent={renderPanel}
            aria-label="Second table"
          />
        </Box>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const first = within(await canvas.findByTestId("first-table"));
    const second = within(canvas.getByTestId("second-table"));
    const expandButtonOfAda = (table: typeof first) =>
      within(table.getByRole("row", { name: /Ada/ })).getByRole("button", {
        name: "Expand",
      });

    await step(
      "With Ada open in both tables, closing the second returns focus there",
      async () => {
        await userEvent.click(expandButtonOfAda(first));
        await first.findByRole("button", { name: "Close Ada" });
        await userEvent.click(expandButtonOfAda(second));
        const close = await second.findByRole("button", { name: "Close Ada" });
        close.focus();
        await userEvent.keyboard("{Enter}");
        await waitFor(() =>
          expect(
            second.queryByRole("button", { name: "Close Ada" })
          ).not.toBeInTheDocument()
        );
        await waitFor(() =>
          expect(document.activeElement).toBe(expandButtonOfAda(second))
        );
      }
    );
  },
};
