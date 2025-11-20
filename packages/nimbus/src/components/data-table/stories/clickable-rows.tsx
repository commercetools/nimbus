import type { StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { within, expect, waitFor, userEvent } from "storybook/test";
import { Checkbox, Stack } from "@/components";
import { columns, rows } from "../test-data";
import type { DataTableProps } from "../data-table.types";
import { DataTableWithModals } from "./utils";

type Story = StoryObj<DataTableProps>;

export const ClickableRows: Story = {
  render: (args) => {
    const [isRowClickable, setIsRowClickable] = useState(true);
    return (
      <Stack gap="500" alignItems="flex-start">
        {/* This is supposed to set the sticky header from the top to the bottom of the table. */}
        <Checkbox isSelected={isRowClickable} onChange={setIsRowClickable}>
          Clickable Rows
        </Checkbox>
        <DataTableWithModals
          {...args}
          onRowClick={isRowClickable ? () => {} : undefined} // Just need to pass a function to enable the modal
          data-testid="clickable-rows-table"
        />
      </Stack>
    );
  },
  args: { columns, rows },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Table renders with clickable rows enabled", async () => {
      const table = await canvas.findByRole("grid");
      expect(table).toBeInTheDocument();

      const rows = canvas.getAllByRole("row");
      expect(rows.length).toBeGreaterThan(1); // At least header + 1 data row
    });

    await step("Clicking a row opens the details modal", async () => {
      const rows = canvas.getAllByRole("row");
      const firstDataRow = rows[1]; // Skip header row

      // Click on the row (not on a checkbox or interactive element)
      const cells = within(firstDataRow).getAllByRole("gridcell");
      const nonCheckboxCell = cells.find(
        (cell) => !within(cell).queryByRole("checkbox")
      );

      if (nonCheckboxCell) {
        await userEvent.click(nonCheckboxCell);

        // Wait for modal to appear (Dialog is rendered in a portal, so search in document)
        // Also account for the 300ms delay in the row click handler
        await waitFor(
          async () => {
            const dialog = await within(document.body).findByRole("dialog");
            expect(dialog).toBeInTheDocument();
          },
          { timeout: 3000 }
        );

        // Verify modal title contains row information
        const dialogTitle = within(document.body).getByRole("heading", {
          level: 2,
        });
        expect(dialogTitle.textContent).toContain("Details");

        // Close the modal by clicking the Close button
        const closeButton = within(document.body).getByRole("button", {
          name: /close/i,
        });
        await userEvent.click(closeButton);

        // Wait for modal to close
        await waitFor(() => {
          expect(
            within(document.body).queryByRole("dialog")
          ).not.toBeInTheDocument();
        });
      }
    });

    await step(
      "Clicking on a checkbox does not trigger row click",
      async () => {
        const rows = canvas.getAllByRole("row");
        const secondDataRow = rows[2]; // Use second row

        // Find and click the checkbox
        const checkbox = within(secondDataRow).queryByRole("checkbox");

        if (checkbox) {
          await userEvent.click(checkbox);

          // Wait a bit to ensure no modal appears (account for 300ms delay)
          await new Promise((resolve) => setTimeout(resolve, 600));

          // Verify no modal opened
          expect(
            within(document.body).queryByRole("dialog")
          ).not.toBeInTheDocument();

          // Verify checkbox is checked (the click worked on the checkbox)
          await waitFor(() => {
            expect(checkbox).toBeChecked();
          });
        }
      }
    );

    await step("Disabling clickable rows prevents row clicks", async () => {
      // Uncheck the "Clickable Rows" checkbox
      const clickableCheckbox = canvas.getByRole("checkbox", {
        name: /clickable rows/i,
      });
      await userEvent.click(clickableCheckbox);

      // Wait for the state to update
      await waitFor(() => {
        expect(clickableCheckbox).not.toBeChecked();
      });

      // Try clicking a row
      const rows = canvas.getAllByRole("row");
      const thirdDataRow = rows[3]; // Use third row
      const cells = within(thirdDataRow).getAllByRole("gridcell");
      const nonCheckboxCell = cells.find(
        (cell) => !within(cell).queryByRole("checkbox")
      );

      if (nonCheckboxCell) {
        await userEvent.click(nonCheckboxCell);

        // Wait to ensure no modal appears (account for 300ms delay)
        await new Promise((resolve) => setTimeout(resolve, 600));

        // Verify no modal opened
        expect(
          within(document.body).queryByRole("dialog")
        ).not.toBeInTheDocument();
      }

      // Re-enable clickable rows for subsequent tests
      await userEvent.click(clickableCheckbox);
      await waitFor(() => {
        expect(clickableCheckbox).toBeChecked();
      });
    });

    await step("Multiple row clicks open modals sequentially", async () => {
      const rows = canvas.getAllByRole("row");

      // Click first row
      const firstDataRow = rows[1];
      const firstCells = within(firstDataRow).getAllByRole("gridcell");
      const firstNonCheckboxCell = firstCells.find(
        (cell) => !within(cell).queryByRole("checkbox")
      );

      if (firstNonCheckboxCell) {
        await userEvent.click(firstNonCheckboxCell);

        // Wait for first modal
        await waitFor(
          async () => {
            const dialog = await within(document.body).findByRole("dialog");
            expect(dialog).toBeInTheDocument();
          },
          { timeout: 3000 }
        );

        // Close first modal
        const closeButton = within(document.body).getByRole("button", {
          name: /close/i,
        });
        await userEvent.click(closeButton);

        await waitFor(() => {
          expect(
            within(document.body).queryByRole("dialog")
          ).not.toBeInTheDocument();
        });

        // Click second row
        const secondDataRow = rows[2];
        const secondCells = within(secondDataRow).getAllByRole("gridcell");
        const secondNonCheckboxCell = secondCells.find(
          (cell) => !within(cell).queryByRole("checkbox")
        );

        if (secondNonCheckboxCell) {
          await userEvent.click(secondNonCheckboxCell);

          // Wait for second modal
          await waitFor(
            async () => {
              const dialog = await within(document.body).findByRole("dialog");
              expect(dialog).toBeInTheDocument();
            },
            { timeout: 3000 }
          );

          // Close second modal
          const closeButton2 = within(document.body).getByRole("button", {
            name: /close/i,
          });
          await userEvent.click(closeButton2);

          await waitFor(() => {
            expect(
              within(document.body).queryByRole("dialog")
            ).not.toBeInTheDocument();
          });
        }
      }
    });

    await step("Row remains accessible via keyboard navigation", async () => {
      const rows = canvas.getAllByRole("row");
      const firstDataRow = rows[1];

      // Focus on the first cell
      const cells = within(firstDataRow).getAllByRole("gridcell");
      const firstCell = cells.find(
        (cell) => !within(cell).queryByRole("checkbox")
      );

      if (firstCell) {
        firstCell.focus();

        // Verify the cell or its parent can receive focus
        await waitFor(() => {
          expect(
            document.activeElement === firstCell ||
              firstCell.contains(document.activeElement)
          ).toBeTruthy();
        });
      }
    });
  },
};
