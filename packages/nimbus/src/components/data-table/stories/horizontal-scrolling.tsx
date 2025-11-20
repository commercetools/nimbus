import type { StoryObj } from "@storybook/react-vite";
import { Stack, Heading, Text, Box } from "@/components";
import { manyColumns, wideData } from "../test-data";
import type { DataTableProps } from "../data-table.types";
import { DataTableWithModals } from "./utils";

type Story = StoryObj<DataTableProps>;

export const HorizontalScrolling: Story = {
  render: () => {
    return (
      <Stack gap="500">
        <Stack gap="300">
          <Heading size="lg">📊 Horizontal Scrolling DataTable</Heading>
          <Text color="neutral.11">
            This table has many columns with wide content to demonstrate
            horizontal scrolling. The header remains sticky during horizontal
            scrolling.
          </Text>
        </Stack>

        {/* Container with fixed width to force horizontal scrolling */}
        <DataTableWithModals
          columns={manyColumns}
          rows={wideData}
          isResizable={true}
          allowsSorting={true}
          maxHeight="400px"
          defaultSelectedKeys={new Set(["1", "3"])}
          onRowClick={() => {}}
          footer={
            <Stack
              direction="row"
              justify="space-between"
              align="center"
              gap="400"
            >
              <Text>Showing {wideData.length} employees</Text>
              <Text>Scroll horizontally to see all columns →</Text>
            </Stack>
          }
        />

        <Box mt="400" p="400" bg="neutral.2" borderRadius="md">
          <Heading size="sm" mb="300">
            Features Demonstrated:
          </Heading>
          <Box as="ul" pl="500">
            <Box as="li">
              Horizontal scrolling when columns exceed container width
            </Box>
            <Box as="li">
              Sticky header that remains visible during horizontal scroll
            </Box>
            <Box as="li">Column resizing with maintained scroll position</Box>
            <Box as="li">Row selection maintained during scrolling</Box>
            <Box as="li">Sorting functionality with horizontal scroll</Box>
            <Box as="li">
              Custom footer that scrolls horizontally with the table
            </Box>
          </Box>
        </Box>
      </Stack>
    );
  },
};
