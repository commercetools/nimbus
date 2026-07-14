import type { Meta, StoryObj } from "@storybook/react-vite";
import { FloatingActionButton, Stack } from "@commercetools/nimbus";
import { Add as AddIcon } from "@commercetools/nimbus-icons";
import { expect, userEvent, within } from "storybook/test";
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
 * Captures the focus ring on the FAB's circular, elevated shape — a visual
 * IconButton's own `Focused` story (default size, non-circular) doesn't cover.
 */
export const Focused: Story = {
  tags: ["vrt"],
  parameters: {
    preserveFocusRing: true,
    chromatic: { disableSnapshot: false },
  },
  args: {
    children: <AddIcon />,
    "aria-label": "Add item",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole("button")).toHaveFocus();
  },
};

/**
 * The FAB forwards `colorPalette`, its one meaningful styling axis (size/variant
 * are fixed to its circular, elevated shape and covered by IconButton's matrix).
 */
export const ColorPalettes: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
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

/**
 * The disabled treatment: a uniform opacity layer, so one instance captures it
 * (it doesn't vary by colorPalette).
 */
export const Disabled: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: {
    children: <AddIcon />,
    "aria-label": "Add item",
    isDisabled: true,
  },
};
