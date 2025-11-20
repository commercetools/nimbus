import type { StoryObj } from "@storybook/react-vite";
import React from "react";
import { within, expect, waitFor, userEvent } from "storybook/test";
import { Stack, Heading, Text, Box } from "@/components";
import { modifiedFetchedData } from "../test-data";
import type { DataTableProps } from "../data-table.types";
import { DataTableWithModals } from "./utils";

type Story = StoryObj<DataTableProps>;

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
        <DataTableWithModals {...args} onRowClick={() => {}} />
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
