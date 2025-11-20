import type { StoryObj } from "@storybook/react-vite";
import { within, expect } from "storybook/test";
import { Stack, Heading, Text, Button, Box } from "@/components";
import { columns, rows } from "../test-data";
import type { DataTableProps } from "../data-table.types";
import { DataTableWithModals } from "./utils";

type Story = StoryObj<DataTableProps>;

export const WithFooter: Story = {
  render: () => {
    const footerContent = (
      <Stack
        direction="row"
        justify="space-between"
        align="center"
        gap="400"
        mt="400"
        p="400"
        bg="neutral.2"
        borderRadius="md"
        border="1px solid"
        borderColor="neutral.6"
        data-testid="footer-content"
      >
        <Text fontWeight="bold" data-testid="total-items">
          Total: {rows.length} items
        </Text>
        <Stack
          direction="row"
          gap="300"
          align="center"
          data-testid="pagination-controls"
        >
          <Button size="xs" variant="outline" data-testid="prev-button">
            Previous
          </Button>
          <Text px="300" data-testid="page-info">
            Page 1 of 1
          </Text>
          <Button size="xs" variant="outline" data-testid="next-button">
            Next
          </Button>
        </Stack>
      </Stack>
    );

    return (
      <Stack gap="500" alignItems="flex-start">
        <Stack gap="400">
          <Heading size="lg">📄 DataTable with Custom Footer</Heading>
          <Text color="neutral.11">
            This example shows how to add custom footer content like pagination,
            totals, or action buttons.
          </Text>
        </Stack>

        <DataTableWithModals
          columns={columns}
          rows={rows}
          allowsSorting={true}
          selectionMode="multiple"
          footer={footerContent}
          onRowClick={() => {}}
          data-testid="footer-table"
        />

        <Box mt="400" p="400" bg="neutral.2" borderRadius="md">
          <Heading size="sm" mb="300">
            Footer Features:
          </Heading>
          <Box as="ul" pl="500">
            <Box as="li">Custom content via the `footer` prop</Box>
            <Box as="li">Consistent styling with table theme</Box>
            <Box as="li">Perfect for pagination controls</Box>
            <Box as="li">Works with horizontal scrolling</Box>
            <Box as="li">Can contain any React component</Box>
          </Box>
        </Box>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Footer renders correctly", async () => {
      const table = await canvas.findByTestId("footer-table");
      expect(table).toBeInTheDocument();

      const footerContent = canvas.getByTestId("footer-content");
      expect(footerContent).toBeInTheDocument();
    });

    await step("Footer displays correct content", async () => {
      const totalItems = canvas.getByTestId("total-items");
      expect(totalItems).toHaveTextContent(`Total: ${rows.length} items`);

      const pageInfo = canvas.getByTestId("page-info");
      expect(pageInfo).toHaveTextContent("Page 1 of 1");

      const prevButton = canvas.getByTestId("prev-button");
      const nextButton = canvas.getByTestId("next-button");
      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });
  },
};
