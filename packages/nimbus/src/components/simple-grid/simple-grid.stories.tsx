import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "../box";
import { SimpleGrid } from "./simple-grid";
import { within, expect } from "@storybook/test";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof SimpleGrid> = {
  title: "components/SimpleGrid",
  component: SimpleGrid,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof SimpleGrid>;

/**
 * Base story
 * Demonstrates the most basic implementation
 * Uses the args pattern for dynamic control panel inputs
 */
export const Base: Story = {
  args: {
    gap: "100",
    ["aria-label"]: "test-layout",
    // @ts-expect-error - data-testid is not a valid prop
    ["data-testid"]: "test",

    children: [
      <Box key="1" p="400" bg="neutral.7">
        Item 1
      </Box>,
      <Box key="2" p="400" bg="neutral.7">
        Item 2
      </Box>,
    ],
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const layout = canvas.getByTestId("test");

    await step("Forwards data- & aria-attributes", async () => {
      await expect(layout).toHaveAttribute("data-testid", "test");
      await expect(layout).toHaveAttribute("aria-label", "test-layout");
    });
  },
};

export const WithColumns: Story = {
  args: {
    gap: "100",
    columns: 2,
    children: [
      <Box key="1" p="400" bg="neutral.7">
        Item 1
      </Box>,
      <Box key="2" p="400" bg="neutral.7">
        Item 2
      </Box>,
      <Box key="3" p="400" bg="neutral.7">
        Item 3
      </Box>,
      <Box key="4" p="400" bg="neutral.7">
        Item 4
      </Box>,
    ],
  },
};

/**
 * Adjust the viewport to see variations in the layout
 */
export const AutoResponsive: Story = {
  args: {
    gap: "100",
    minChildWidth: "sm",
    children: [
      <Box key="1" p="400" bg="neutral.7">
        Item 1
      </Box>,
      <Box key="2" p="400" bg="neutral.7">
        Item 2
      </Box>,
      <Box key="3" p="400" bg="neutral.7">
        Item 3
      </Box>,
      <Box key="4" p="400" bg="neutral.7">
        Item 4
      </Box>,
    ],
  },
};

export const SimpleGridWithColSpan: Story = {
  render: () => {
    return (
      <SimpleGrid
        columns={{ base: 2, md: 4 }}
        gap={{ base: "600", md: "1000" }}
      >
        <SimpleGrid.Item colSpan={{ base: 1, md: 3 }}>
          <Box height="20" p="400" bg="neutral.7">
            Column 1
          </Box>
        </SimpleGrid.Item>
        <SimpleGrid.Item colSpan={{ base: 1, md: 1 }}>
          <Box height="20" p="400" bg="neutral.7">
            Column 2
          </Box>
        </SimpleGrid.Item>
      </SimpleGrid>
    );
  },
};

export const RowAndColumnGap: Story = {
  args: {
    columns: 2,
    columnGap: "200",
    rowGap: "400",
    children: [
      <Box key="1" p="400" bg="neutral.7">
        Item 1
      </Box>,
      <Box key="2" p="400" bg="neutral.7">
        Item 2
      </Box>,
      <Box key="3" p="400" bg="neutral.7">
        Item 3
      </Box>,
      <Box key="4" p="400" bg="neutral.7">
        Item 4
      </Box>,
    ],
  },
};
