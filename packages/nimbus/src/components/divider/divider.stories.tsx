import type { Meta, StoryObj } from "@storybook/react-vite";
import { Divider } from "./divider";
import { Box, Stack } from "@/components";
import { within, expect } from "storybook/test";

const meta: Meta<typeof Divider> = {
  title: "components/Divider",
  component: Divider,
};

export default meta;

type Story = StoryObj<typeof Divider>;

export const Base: Story = {
  args: {
    ["data-testid"]: "divider-test",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const divider = canvas.getByTestId("divider-test");

    await step("Has correct role", async () => {
      await expect(divider).toHaveAttribute("role", "separator");
    });

    await step("Has correct aria-orientation", async () => {
      await expect(divider).toHaveAttribute("aria-orientation", "horizontal");
    });

    await step("Is not focusable", async () => {
      await expect(divider).not.toHaveAttribute("tabindex");
    });
  },
};

export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
    ["data-testid"]: "horizontal-divider",
  },
  render: (args) => (
    <Box>
      <Box p="100">Content above the divider</Box>
      <Divider {...args} />
      <Box p="100">Content below the divider</Box>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const divider = canvas.getByTestId("horizontal-divider");

    await step("Has correct aria-orientation for horizontal", async () => {
      await expect(divider).toHaveAttribute("aria-orientation", "horizontal");
    });
  },
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
    ["data-testid"]: "vertical-divider",
  },
  render: (args) => (
    <Stack direction="row" height="2000" alignItems="center">
      <Box p="100">Content left</Box>
      <Divider {...args} />
      <Box p="100">Content right</Box>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const divider = canvas.getByTestId("vertical-divider");

    await step("Has correct aria-orientation for vertical", async () => {
      await expect(divider).toHaveAttribute("aria-orientation", "vertical");
    });
  },
};

export const Orientations: Story = {
  render: () => (
    <Stack gap="400">
      <Box>
        <Box p="100">Content above horizontal divider</Box>
        <Divider orientation="horizontal" />
        <Box p="100">Content below horizontal divider</Box>
      </Box>
      <Stack direction="row" height="2000" alignItems="center">
        <Box p="100">Content left</Box>
        <Divider orientation="vertical" />
        <Box p="100">Content right</Box>
      </Stack>
    </Stack>
  ),
};

export const MultipleBackgrounds: Story = {
  render: () => (
    <Box position="relative" width="100%" height="300px">
      {/* Background sections */}
      <Stack direction="row" height="100%" gap="0">
        <Box flex="1" bg="white" />
        <Box flex="1" bg="slateAlpha.3" />
        <Box flex="1" bg="positive.3" />
      </Stack>

      {/* Divider overlaying the backgrounds */}
      <Box
        position="absolute"
        top="50%"
        left="0"
        right="0"
        transform="translateY(-50%)"
      >
        <Divider />
      </Box>

      {/* Content to show the sections */}
      <Box
        position="absolute"
        top="20px"
        left="20px"
        fontSize="sm"
        color="neutral.12"
      >
        White background
      </Box>
      <Box
        position="absolute"
        top="20px"
        left="calc(33.33% + 20px)"
        fontSize="sm"
        color="neutral.12"
      >
        Divider color background
      </Box>
      <Box
        position="absolute"
        top="20px"
        left="calc(66.66% + 20px)"
        fontSize="sm"
        color="neutral.12"
      >
        Positive background
      </Box>
    </Box>
  ),
};
