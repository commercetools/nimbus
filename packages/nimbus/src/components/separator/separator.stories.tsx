import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "./separator.tsx";
import { Box, Stack } from "@/components";
import { within, expect } from "storybook/test";

const meta: Meta<typeof Separator> = {
  title: "components/Separator",
  component: Separator,
};

export default meta;

type Story = StoryObj<typeof Separator>;

export const Base: Story = {
  args: {
    ["data-testid"]: "separator-test",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const separator = canvas.getByTestId("separator-test");

    await step("Has correct role", async () => {
      await expect(separator).toHaveAttribute("role", "separator");
    });

    await step(
      "Has no aria-orientation (uses default, horizontal)",
      async () => {
        await expect(separator).not.toHaveAttribute("aria-orientation");
      }
    );

    await step("Is not focusable", async () => {
      await expect(separator).not.toHaveAttribute("tabindex");
    });
  },
};

export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
    ["data-testid"]: "horizontal-separator",
  },
  render: (args) => (
    <Box>
      <Box p="100">Content above the separator</Box>
      <Separator {...args} />
      <Box p="100">Content below the separator</Box>
    </Box>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
    ["data-testid"]: "vertical-separator",
  },
  render: (args) => (
    <Stack direction="row" height="2000" alignItems="center">
      <Box p="100">Content left</Box>
      <Separator {...args} />
      <Box p="100">Content right</Box>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const separator = canvas.getByTestId("vertical-separator");

    await step("Has correct aria-orientation for vertical", async () => {
      await expect(separator).toHaveAttribute("aria-orientation", "vertical");
    });
  },
};

export const Orientations: Story = {
  render: () => (
    <Stack gap="400">
      <Box>
        <Box p="100">Content above horizontal separator</Box>
        <Separator orientation="horizontal" />
        <Box p="100">Content below horizontal separator</Box>
      </Box>
      <Stack direction="row" height="2000" alignItems="center">
        <Box p="100">Content left</Box>
        <Separator orientation="vertical" />
        <Box p="100">Content right</Box>
      </Stack>
    </Stack>
  ),
};

export const MultipleBackgrounds: Story = {
  render: () => (
    <Stack direction="row" height="300px" gap="0">
      <Box
        flex="1"
        bg="white"
        p="100"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Box fontSize="sm" color="neutral.12" mb="100">
          White background
        </Box>
        <Separator colorPalette="neutral" />
      </Box>
      <Box
        flex="1"
        colorPalette="slate"
        bg="colorPalette.3"
        p="100"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Box fontSize="sm" color="neutral.12" mb="100">
          Slate background
        </Box>
        <Separator />
      </Box>
      <Box
        flex="1"
        colorPalette="positive"
        bg="colorPalette.3"
        p="100"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Box fontSize="sm" color="neutral.12" mb="100">
          Positive background
        </Box>
        <Separator />
      </Box>
    </Stack>
  ),
};
