import type { StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { within, expect, userEvent } from "storybook/test";
import { Checkbox, Stack, Box } from "@/components";
import { truncationColumns, longTextData } from "../test-data";
import type { DataTableProps } from "../data-table.types";
import { DataTableWithModals } from "./utils";

type Story = StoryObj<DataTableProps>;

export const TextTruncation: Story = {
  render: (args) => {
    const [isTruncated, setIsTruncated] = useState(false);

    return (
      <Stack gap="500" alignItems="flex-start">
        <Checkbox
          isSelected={isTruncated}
          onChange={setIsTruncated}
          data-testid="truncation-checkbox"
        >
          Enable text truncation
        </Checkbox>
        <Box
          border="1px solid"
          borderColor="neutral.6"
          borderRadius="md"
          overflow="hidden"
          maxWidth="100%"
        >
          <DataTableWithModals
            {...args}
            isTruncated={isTruncated}
            onRowClick={() => {}}
          />
        </Box>
      </Stack>
    );
  },
  args: {
    columns: truncationColumns,
    rows: longTextData,
    allowsSorting: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Applies truncation styles to cells when truncation is enabled",
      async () => {
        const checkbox = canvas.getByTestId("truncation-checkbox");
        await userEvent.click(checkbox);

        const descriptionCell = canvas.getAllByRole("rowheader", {
          name: /description/i,
        });

        const innerDiv = descriptionCell[0].querySelector("div");
        // TODO: VRT would be a better assertion here.
        // Check if the inner div has the data-truncated attribute -
        // This is the best we can do for now since technically the dom has the full text, we cannot compare texts to see if it is truncated.
        expect(innerDiv).toHaveAttribute("data-truncated", "true");
      }
    );

    await step("Disables truncation when checkbox is unchecked", async () => {
      const checkbox = canvas.getByTestId("truncation-checkbox");
      await userEvent.click(checkbox);

      const descriptionCell = canvas.getAllByRole("rowheader", {
        name: /description/i,
      });

      const innerDiv = descriptionCell[0].querySelector("div");

      expect(innerDiv).toHaveAttribute("data-truncated", "false");
    });
  },
};
