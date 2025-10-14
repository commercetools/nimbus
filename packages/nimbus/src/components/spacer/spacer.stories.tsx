import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spacer } from "./spacer";
import { Button } from "@/components/button";
import { Stack } from "@/components/stack";
import { Box } from "@chakra-ui/react";

const meta: Meta<typeof Spacer> = {
  title: "Components/Spacer",
  component: Spacer,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic usage of Spacer to push elements apart in a horizontal layout.
 */
export const Default: Story = {
  render: () => (
    <Stack direction="row" width="full">
      <Button variant="solid">Left</Button>
      <Spacer />
      <Button variant="outline">Right</Button>
    </Stack>
  ),
};

/**
 * Using Spacer to create navigation-like layouts with multiple groups.
 */
export const Navigation: Story = {
  render: () => (
    <Stack direction="row" width="full">
      <Button variant="ghost">Home</Button>
      <Button variant="ghost">About</Button>
      <Button variant="ghost">Services</Button>
      <Spacer />
      <Button variant="ghost">Profile</Button>
      <Button variant="solid">Sign In</Button>
    </Stack>
  ),
};

/**
 * Multiple spacers distribute space evenly between elements.
 */
export const MultipleSpacer: Story = {
  render: () => (
    <Stack direction="row" width="full">
      <Button variant="outline">First</Button>
      <Spacer />
      <Button variant="outline">Second</Button>
      <Spacer />
      <Button variant="outline">Third</Button>
    </Stack>
  ),
};

/**
 * Spacer can be used in vertical layouts too.
 */
export const VerticalLayout: Story = {
  render: () => (
    <Stack direction="column" height="400px" width="200px">
      <Box padding="400" backgroundColor="neutral.3" borderRadius="200">
        Header
      </Box>
      <Spacer />
      <Box padding="400" backgroundColor="neutral.3" borderRadius="200">
        Footer
      </Box>
    </Stack>
  ),
};

/**
 * Spacer with custom background color (though typically invisible).
 */
export const WithBackground: Story = {
  render: () => (
    <Stack direction="row" width="full">
      <Button variant="solid">Start</Button>
      <Spacer backgroundColor="primary.3" borderRadius="200" />
      <Button variant="solid">End</Button>
    </Stack>
  ),
};

/**
 * Spacer in a toolbar layout with icons.
 */
export const ToolbarLayout: Story = {
  render: () => (
    <Stack
      direction="row"
      width="full"
      padding="300"
      backgroundColor="neutral.2"
      borderRadius="200"
    >
      <Button variant="ghost" size="xs">
        File
      </Button>
      <Button variant="ghost" size="xs">
        Edit
      </Button>
      <Button variant="ghost" size="xs">
        View
      </Button>
      <Spacer />
      <Button variant="ghost" size="xs">
        Help
      </Button>
    </Stack>
  ),
};
