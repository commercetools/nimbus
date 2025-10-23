import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box, Grid } from "@commercetools/nimbus";
import { within, expect } from "storybook/test";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof Grid> = {
  title: "Components/Grid",
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
      <Box key="2" p="400" bg="neutral.7">
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
};

/**
 * Demonstrate layout with template areas
 * Shows how to create a common page layout pattern
 */
export const WithTemplateAreas: Story = {
  render: () => {
    return (
      <Grid
        h="400px"
        templateAreas={`
          "header header"
          "nav main"
          "footer footer"
        `}
        templateColumns="200px 1fr"
        gap="400"
      >
        <Grid.Item gridArea="header">
          <Box p="400" bg="neutral.7" h="full">
            Header
          </Box>
        </Grid.Item>
        <Grid.Item gridArea="nav">
          <Box p="400" bg="neutral.7" h="full">
            Navigation
          </Box>
        </Grid.Item>
        <Grid.Item gridArea="main">
          <Box p="400" bg="neutral.7" h="full">
            Main Content
          </Box>
        </Grid.Item>
        <Grid.Item gridArea="footer">
          <Box p="400" bg="neutral.7" h="full">
            Footer
          </Box>
        </Grid.Item>
      </Grid>
    );
  },
};
