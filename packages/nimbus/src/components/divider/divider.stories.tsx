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

    await step(
      "Has no aria-orientation (uses default, horizontal)",
      async () => {
        await expect(divider).not.toHaveAttribute("aria-orientation");
      }
    );

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
        <Divider colorPalette="neutral" />
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
        <Divider />
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
        <Divider />
      </Box>
    </Stack>
  ),
};
