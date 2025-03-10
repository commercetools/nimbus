import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "../box";
import { Grid } from "./grid";
/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof Grid> = {
  title: "components/Grid",
  component: Grid,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof Grid>;

/**
 * Base story
 * Demonstrates the most basic implementation
 * Uses the args pattern for dynamic control panel inputs
 */
export const Basic: Story = {
  args: {
    gap: "100",
    children: [
      <Box key="1" p="400" bg="neutral.7">
        Item 1
      </Box>,
      <Box key="1" p="400" bg="neutral.7">
        Item 2
      </Box>,
    ],
  },
};

/**
 * Showcase with simple column layout
 */
export const WithColumns: Story = {
  args: {
    gap: "100",
    templateColumns: "repeat(2, 1fr)",
    children: [
      <Box key="1" p="400" bg="neutral.7">
        Item 1
      </Box>,
      <Box key="1" p="400" bg="neutral.7">
        Item 2
      </Box>,
    ],
  },
};

/**
 * Showcase Varrying rows or columns
 */
export const WithVarryingLayout: Story = {
  render: () => {
    return (
      <Grid
        h="200px"
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(5, 1fr)"
        gap={4}
      >
        <Grid.Item rowSpan={2} colSpan={1}>
          <Box p="400" bg="neutral.7">
            colSpan=1
          </Box>
        </Grid.Item>
        <Grid.Item colSpan={2}>
          <Box p="400" bg="neutral.7">
            colSpan=2
          </Box>
        </Grid.Item>
        <Grid.Item colSpan={2}>
          <Box p="400" bg="neutral.7">
            colSpan=2
          </Box>
        </Grid.Item>
        <Grid.Item colSpan={4}>
          <Box p="400" bg="neutral.7">
            colSpan=4
          </Box>
        </Grid.Item>
      </Grid>
    );
  },

  args: {
    children: "Demo Grid",
  },
};
