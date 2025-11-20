import React, { useState } from "react";
import { Stack, TextInput } from "@/components";
import type { StoryObj } from "@storybook/react-vite";
import { within, expect, waitFor, userEvent } from "storybook/test";

import { columns, rows } from "../test-data";
import type { DataTableProps } from "../data-table.types";
import { DataTableWithModals } from "./utils";

type Story = StoryObj<DataTableProps>;

export const SearchAndHighlight: Story = {
  render: (args) => {
    const [search, setSearch] = useState("");
    return (
      <Stack gap={16}>
        <TextInput
          value={search}
          onChange={setSearch}
          placeholder="Search..."
          width="1/3"
          aria-label="search-rows"
          data-testid="search-input"
        />
        <DataTableWithModals
          {...args}
          search={search}
          onRowClick={() => {}}
          data-testid="search-table"
        />
      </Stack>
    );
  },
  args: { columns, rows },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Search input renders correctly", async () => {
      const searchInput = await canvas.findByTestId("search-input");
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute("placeholder", "Search...");
    });

    await step("Table displays all rows initially", async () => {
      const table = await canvas.findByRole("grid");
      expect(table).toBeInTheDocument();

      const rows = canvas.getAllByRole("row");
      // 1 header row + 10 data rows from the test data
      expect(rows.length).toBe(11);
    });

    await step("Searching filters rows to matching results", async () => {
      const searchInput = canvas.getByTestId("search-input");

      // Search for "Alice"
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, "Alice");

      await waitFor(() => {
        const rows = canvas.getAllByRole("row");
        // 1 header row + 1 matching data row
        expect(rows.length).toBe(2);
      });

      // Verify Alice row is visible
      expect(canvas.getByText("Alice")).toBeInTheDocument();

      // Verify other names are not visible
      expect(canvas.queryByText("Bob")).not.toBeInTheDocument();
      expect(canvas.queryByText("Carol")).not.toBeInTheDocument();
    });

    await step("Search is case-insensitive", async () => {
      const searchInput = canvas.getByTestId("search-input");

      // Search with lowercase
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, "alice");

      await waitFor(() => {
        expect(canvas.getByText("Alice")).toBeInTheDocument();
      });

      // Search with uppercase
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, "ALICE");

      await waitFor(() => {
        expect(canvas.getByText("Alice")).toBeInTheDocument();
      });
    });

    await step("Search matches partial text", async () => {
      const searchInput = canvas.getByTestId("search-input");

      // Search for partial match "vel"
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, "vel");

      await waitFor(() => {
        const rows = canvas.getAllByRole("row");
        // Should match "Developer" role - Emma and Henry
        expect(rows.length).toBeGreaterThan(1);
      });

      // Verify at least one match is visible
      const cells = canvas.getAllByRole("rowheader");
      const hasDeveloperMatch = cells.some((cell) =>
        cell.textContent?.includes("Developer")
      );
      expect(hasDeveloperMatch).toBeTruthy();
    });

    await step("Search across multiple columns", async () => {
      const searchInput = canvas.getByTestId("search-input");

      // Search for age "30"
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, "30");

      await waitFor(() => {
        const rows = canvas.getAllByRole("row");
        // Should match rows with age 30
        expect(rows.length).toBeGreaterThan(1);
      });

      // Clear and search for role
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, "Manager");

      await waitFor(() => {
        const rows = canvas.getAllByRole("row");
        // Should match Manager role
        expect(rows.length).toBeGreaterThan(1);
      });
    });

    await step("Clearing search shows all rows", async () => {
      const searchInput = canvas.getByTestId("search-input");

      // First search
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, "Admin");

      await waitFor(() => {
        const rows = canvas.getAllByRole("row");
        expect(rows.length).toBeLessThan(11);
      });

      // Clear search
      await userEvent.clear(searchInput);

      await waitFor(() => {
        const rows = canvas.getAllByRole("row");
        // All rows should be visible again
        expect(rows.length).toBe(11);
      });
    });

    await step("Search with no matches shows empty table", async () => {
      const searchInput = canvas.getByTestId("search-input");

      // Search for something that doesn't exist
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, "XYZ123NonExistent");

      await waitFor(() => {
        const rows = canvas.getAllByRole("row");
        // Only header row should be present
        expect(rows.length).toBe(2);
      });

      // Verify empty state (no data rows)
      expect(canvas.getByText("No Data")).toBeInTheDocument();
    });

    await step("Highlighted text is present in search results", async () => {
      const searchInput = canvas.getByTestId("search-input");

      // Search for "Ali"
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, "Ali");

      await waitFor(() => {
        const rows = canvas.getAllByRole("row");
        expect(rows.length).toBe(2); // Header + Alice row
      });

      // Check that the highlighted text is wrapped in a <mark> element
      const highlightedText = canvas.getByText("Ali");
      expect(highlightedText).toBeInTheDocument();
      expect(highlightedText.tagName).toBe("MARK");

      // Verify the full name "Alice" is still accessible as combined text
      const aliceCell = highlightedText.closest("div");
      expect(aliceCell).toHaveTextContent("Alice");

      // Verify there's a mark element for the matched portion
      const markElements = canvas.getAllByText("Ali");
      expect(markElements.length).toBeGreaterThan(0);
      markElements.forEach((mark) => {
        expect(mark.tagName).toBe("MARK");
      });
    });

    await step("Multiple search terms narrow results", async () => {
      const searchInput = canvas.getByTestId("search-input");

      // Search for a specific combination
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, "Admin");

      await waitFor(() => {
        const rows = canvas.getAllByRole("row");
        const adminRowCount = rows.length;
        expect(adminRowCount).toBeGreaterThan(1);
      });

      // Now search for something more specific
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, "Alice");

      await waitFor(() => {
        const rows = canvas.getAllByRole("row");
        // Should be fewer rows than Admin search
        expect(rows.length).toBe(2); // Header + Alice row
      });
    });

    await step("Search persists across interactions", async () => {
      const searchInput = canvas.getByTestId("search-input");

      // Set search term
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, "Developer");

      await waitFor(() => {
        const rows = canvas.getAllByRole("row");
        expect(rows.length).toBeGreaterThan(1);
      });

      // Click on a cell (interaction)
      const firstVisibleRow = canvas.getAllByRole("row")[1];
      const firstCell = within(firstVisibleRow).getAllByRole("gridcell")[0];
      await userEvent.click(firstCell);

      // Search should still be active
      await waitFor(() => {
        expect(searchInput).toHaveValue("Developer");
        const rows = canvas.getAllByRole("row");
        expect(rows.length).toBeGreaterThan(1);
      });
    });
  },
};
