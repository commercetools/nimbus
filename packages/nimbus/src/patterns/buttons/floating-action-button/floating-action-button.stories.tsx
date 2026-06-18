import type { Meta, StoryObj } from "@storybook/react-vite";
import { FloatingActionButton, Stack } from "@commercetools/nimbus";
import { Add as AddIcon } from "@commercetools/nimbus-icons";
import { expect, within } from "storybook/test";
import { SEMANTIC_COLOR_PALETTES } from "@/constants/color-palettes";

/**
 * FloatingActionButton is a thin wrapper around IconButton. All button behavior
 * — press/keyboard/focus handling, disabled state, ref forwarding, DOM prop
 * filtering, and accessible-label enforcement — is inherited and already
 * covered by the Button and IconButton stories. These stories therefore only
 * cover what the FAB itself adds: that it renders and its visual identity.
 */
const meta: Meta<typeof FloatingActionButton> = {
  title: "Components/Buttons/FloatingActionButton",
  component: FloatingActionButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof FloatingActionButton>;

/**
 * Renders a circular, elevated icon button. A smoke test confirms the wrapper
 * delegates to a real `<button>`.
 */
export const Base: Story = {
  args: {
    children: <AddIcon />,
    "aria-label": "Add item",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button")).toBeInTheDocument();
  },
};

/**
 * The FAB forwards `colorPalette`, its one meaningful styling axis.
 */
export const ColorPalettes: Story = {
  render: () => (
    <Stack direction="row" gap="400" alignItems="center" flexWrap="wrap">
      {SEMANTIC_COLOR_PALETTES.map((colorPalette) => (
        <FloatingActionButton
          key={colorPalette as string}
          colorPalette={colorPalette}
          aria-label={`${colorPalette} action`}
        >
          <AddIcon />
        </FloatingActionButton>
      ))}
    </Stack>
  ),
};
