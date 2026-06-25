import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Box, Button, Heading, ScrollArea, Stack } from "@commercetools/nimbus";
import {
  userEvent,
  within,
  expect,
  fn,
  waitFor,
  fireEvent,
} from "storybook/test";
import { Splitter } from "./splitter";
import { useResponsiveSplitterSizes } from "./hooks/use-responsive-splitter-sizes";

/**
 * Pane content wrapped in a ScrollArea so overflow stays inside the pane and
 * doesn't push the splitter layout around.
 */
const DemoPane = ({
  bg,
  title,
  children,
}: {
  bg: string;
  title: string;
  children?: ReactNode;
}) => (
  <ScrollArea h="100%" w="100%">
    <Box p="400" bg={bg} minH="100%">
      <Heading size="md" mb="200">
        {title}
      </Heading>
      {children}
    </Box>
  </ScrollArea>
);

const meta: Meta<typeof Splitter.Root> = {
  title: "Components/Splitter",
  component: Splitter.Root,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    orientation: {
      control: { type: "radio" },
      options: ["horizontal", "vertical"],
    },
    defaultSize: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
    keyboardStep: {
      control: { type: "range", min: 1, max: 20, step: 1 },
    },
    collapsible: { control: { type: "boolean" } },
    isDoubleClickDisabled: { control: { type: "boolean" } },
    isDisabled: { control: { type: "boolean" } },
  },
};

export default meta;
type Story = StoryObj<typeof Splitter.Root>;

// ============================================================
// Default (horizontal, aside 30 / main 70)
// ============================================================

export const Default: Story = {
  args: {
    orientation: "horizontal",
    defaultSize: 30,
  },
  render: (args) => (
    <Box h="xl">
      <Splitter.Root {...args}>
        <Splitter.Aside>
          <DemoPane bg="indigo.3" title="Aside" />
        </Splitter.Aside>
        <Splitter.Handle />
        <Splitter.Main>
          <DemoPane bg="amber.3" title="Main" />
        </Splitter.Main>
      </Splitter.Root>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");
    await expect(handle).toBeInTheDocument();
    await expect(handle).toHaveAttribute("aria-orientation", "horizontal");
    await expect(handle).toHaveAttribute("aria-valuemin", "0");
    await expect(handle).toHaveAttribute("aria-valuemax", "100");
    await waitFor(() => {
      expect(handle).toHaveAttribute("aria-valuenow", "30");
    });
    await expect(handle).toHaveAttribute("aria-valuetext", "30%");
  },
};

// ============================================================
// Vertical orientation
// ============================================================

export const Vertical: Story = {
  args: {
    orientation: "vertical",
    defaultSize: 40,
  },
  render: (args) => (
    <Box h="xl">
      <Splitter.Root {...args}>
        <Splitter.Aside>
          <DemoPane bg="teal.3" title="Aside" />
        </Splitter.Aside>
        <Splitter.Handle />
        <Splitter.Main>
          <DemoPane bg="rose.3" title="Main" />
        </Splitter.Main>
      </Splitter.Root>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");
    await expect(handle).toHaveAttribute("aria-orientation", "vertical");
  },
};

// ============================================================
// Aside trailing — the aside can be placed after the main pane (a right/bottom
// panel). `size` still refers to the aside; the handle's aria value tracks the
// leading (main) pane.
// ============================================================

export const AsideTrailing: Story = {
  args: {
    orientation: "horizontal",
    defaultSize: 30,
    minSize: 10,
    maxSize: 80,
  },
  render: (args) => (
    <Box h="xl">
      <Splitter.Root {...args}>
        <Splitter.Main>
          <DemoPane bg="amber.3" title="Main" />
        </Splitter.Main>
        <Splitter.Handle />
        <Splitter.Aside>
          <DemoPane bg="indigo.3" title="Aside" />
        </Splitter.Aside>
      </Splitter.Root>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");

    // Aside is 30% on the right; the leading (main) pane is 70%, which the
    // handle's aria value tracks.
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(70);
    });

    // aria-controls points at the leading (main) pane.
    const ariaControls = handle.getAttribute("aria-controls");
    const mainPane = canvasElement.querySelector(`#${ariaControls!}`);
    await expect(mainPane!.textContent).toContain("Main");

    // Bounds map onto the leading pane: aside ∈ [10, 80] → main ∈ [20, 90].
    await expect(handle).toHaveAttribute("aria-valuemin", "20");
    await expect(handle).toHaveAttribute("aria-valuemax", "90");
  },
};

// ============================================================
// Keyboard interaction (arrows + Home/End) — also asserts the
// settled-change channel (onSizeChangeEnd) fires per keypress.
// ============================================================

export const KeyboardInteraction: Story = {
  args: {
    orientation: "horizontal",
    keyboardStep: 5,
    defaultSize: 30,
    minSize: 10,
    maxSize: 80,
    onSizeChange: fn(),
    onSizeChangeEnd: fn(),
  },
  render: (args) => (
    <Box h="xl">
      <Splitter.Root {...args}>
        <Splitter.Aside>
          <DemoPane bg="indigo.3" title="Aside" />
        </Splitter.Aside>
        <Splitter.Handle />
        <Splitter.Main>
          <DemoPane bg="amber.3" title="Main" />
        </Splitter.Main>
      </Splitter.Root>
    </Box>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");
    handle.focus();
    await expect(handle).toHaveFocus();

    await userEvent.keyboard("{ArrowRight}");
    await expect(args.onSizeChange).toHaveBeenCalled();
    await expect(args.onSizeChangeEnd).toHaveBeenCalled();
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(35);
    });

    await userEvent.keyboard("{ArrowLeft}");
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(30);
    });

    // Home → aside shrinks to its minSize.
    await userEvent.keyboard("{Home}");
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(10);
    });

    // End → aside grows to its maxSize.
    await userEvent.keyboard("{End}");
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(80);
    });
  },
};

// ============================================================
// Pointer drag (useMove) — dragging the handle resizes the panes and fires
// the live (onSizeChange) + settled (onSizeChangeEnd) channels. Covers the
// pointer path that the keyboard / collapse stories don't exercise.
// ============================================================

export const PointerDragResize: Story = {
  args: {
    orientation: "horizontal",
    defaultSize: 30,
    minSize: 10,
    maxSize: 90,
    onSizeChange: fn(),
    onSizeChangeEnd: fn(),
  },
  render: (args) => (
    <Box h="xl">
      <Splitter.Root {...args}>
        <Splitter.Aside>
          <DemoPane bg="indigo.3" title="Aside" />
        </Splitter.Aside>
        <Splitter.Handle />
        <Splitter.Main>
          <DemoPane bg="amber.3" title="Main" />
        </Splitter.Main>
      </Splitter.Root>
    </Box>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");

    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(30);
    });

    const rect = handle.getBoundingClientRect();
    const startX = rect.x + rect.width / 2;
    const y = rect.y + rect.height / 2;

    // Press on the handle, drag right in steps, release. react-aria's useMove
    // matches events by a single pointerId and derives the delta from pageX
    // (=== clientX at scroll 0), so the sequence shares one pointerId and
    // carries changing client coords. fireEvent gives that precise control;
    // userEvent.pointer doesn't supply a stable pageX, so the delta reads 0.
    const pointer = { pointerId: 1, pointerType: "mouse", button: 0 };
    fireEvent.pointerDown(handle, { ...pointer, clientX: startX, clientY: y });
    fireEvent.pointerMove(document, {
      ...pointer,
      clientX: startX + 60,
      clientY: y,
    });
    fireEvent.pointerMove(document, {
      ...pointer,
      clientX: startX + 120,
      clientY: y,
    });
    fireEvent.pointerUp(document, {
      ...pointer,
      clientX: startX + 120,
      clientY: y,
    });

    // Live channel fired and the boundary moved right (aside grew past 30%).
    await waitFor(() => {
      expect(args.onSizeChange).toHaveBeenCalled();
      expect(Number(handle.getAttribute("aria-valuenow"))).toBeGreaterThan(30);
    });

    // Drag stayed within the announced upper bound.
    const now = Number(handle.getAttribute("aria-valuenow"));
    expect(now).toBeLessThanOrEqual(
      Number(handle.getAttribute("aria-valuemax"))
    );

    // Settled channel fired on pointer release (the persistence seam).
    await waitFor(() => {
      expect(args.onSizeChangeEnd).toHaveBeenCalled();
    });
  },
};

// ============================================================
// Size constraints — `minSize` / `maxSize` bound the single aside dimension.
// `maxSize` also fixes the main pane's floor (`100 − maxSize`).
// ============================================================

export const SizeConstraints: Story = {
  args: {
    orientation: "horizontal",
    keyboardStep: 100,
    defaultSize: 30,
    minSize: 15,
    maxSize: 75,
  },
  render: (args) => (
    <Box h="xl">
      <Splitter.Root {...args}>
        <Splitter.Aside>
          <DemoPane bg="indigo.3" title="Aside (min 15)" />
        </Splitter.Aside>
        <Splitter.Handle />
        <Splitter.Main>
          <DemoPane bg="amber.3" title="Main (min 25)" />
        </Splitter.Main>
      </Splitter.Root>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");

    // aria-valuemin = minSize; aria-valuemax = maxSize.
    await expect(handle).toHaveAttribute("aria-valuemin", "15");
    await expect(handle).toHaveAttribute("aria-valuemax", "75");

    handle.focus();
    // Large jump right → clamps at maxSize (75).
    await userEvent.keyboard("{End}");
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(75);
    });
    // Large jump left → clamps at minSize (15).
    await userEvent.keyboard("{Home}");
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(15);
    });
  },
};

// ============================================================
// isDisabled — the whole splitter is non-interactive; the handle is
// removed from the tab order and announces aria-disabled.
// ============================================================

export const Disabled: Story = {
  args: {
    isDisabled: true,
    defaultSize: 30,
  },
  render: (args) => (
    <Box h="xl">
      <Splitter.Root {...args}>
        <Splitter.Aside>
          <DemoPane bg="indigo.3" title="Aside" />
        </Splitter.Aside>
        <Splitter.Handle />
        <Splitter.Main>
          <DemoPane bg="amber.3" title="Main" />
        </Splitter.Main>
      </Splitter.Root>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");
    await expect(handle).toHaveAttribute("tabindex", "-1");
    await expect(handle).toHaveAttribute("aria-disabled", "true");
  },
};

// ============================================================
// ARIA — aria-controls points at the leading pane's DOM id.
// ============================================================

export const AriaControlsAttribute: Story = {
  args: {
    defaultSize: 30,
  },
  render: (args) => (
    <Box h="sm">
      <Splitter.Root {...args}>
        <Splitter.Aside>
          <DemoPane bg="indigo.3" title="Aside" />
        </Splitter.Aside>
        <Splitter.Handle />
        <Splitter.Main>
          <DemoPane bg="amber.3" title="Main" />
        </Splitter.Main>
      </Splitter.Root>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");
    const ariaControls = handle.getAttribute("aria-controls");
    await expect(ariaControls).toBeTruthy();

    // aria-controls should point at the leading pane (first DOM sibling = aside).
    const asidePane = canvasElement.querySelector(`#${ariaControls!}`);
    await expect(asidePane).toBeTruthy();
    await expect(asidePane!.textContent).toContain("Aside");
  },
};

// ============================================================
// Double-click restores the boundary to its initial position.
// ============================================================

export const DoubleClickRestoresDefaults: Story = {
  args: {
    defaultSize: 30,
    minSize: 10,
    maxSize: 90,
    onSizeChangeEnd: fn(),
  },
  render: (args) => (
    <Box h="xl">
      <Splitter.Root {...args}>
        <Splitter.Aside>
          <DemoPane bg="indigo.3" title="Aside (default 30)" />
        </Splitter.Aside>
        <Splitter.Handle />
        <Splitter.Main>
          <DemoPane bg="amber.3" title="Main (default 70)" />
        </Splitter.Main>
      </Splitter.Root>
    </Box>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");

    // Move the boundary via keyboard so the story has a non-default state.
    handle.focus();
    await userEvent.keyboard("{End}");
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBeGreaterThan(30);
    });

    await userEvent.dblClick(handle);
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(30);
    });
    expect(args.onSizeChangeEnd).toHaveBeenCalled();
  },
};

// ============================================================
// Double-click restores correctly even when the initial size is 0
// (regression guard for the falsy restore guard).
// ============================================================

export const RestoreDefaultsWithZeroSize: Story = {
  args: {
    defaultSize: 0,
    minSize: 0,
    maxSize: 100,
  },
  render: (args) => (
    <Box h="sm">
      <Splitter.Root {...args}>
        <Splitter.Aside>
          <DemoPane bg="indigo.3" title="Aside (default 0)" />
        </Splitter.Aside>
        <Splitter.Handle />
        <Splitter.Main>
          <DemoPane bg="amber.3" title="Main (default 100)" />
        </Splitter.Main>
      </Splitter.Root>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(0);
    });

    // Grow the aside off 0, then double-click to restore back to 0.
    handle.focus();
    await userEvent.keyboard("{End}");
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBeGreaterThan(0);
    });

    await userEvent.dblClick(handle);
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(0);
    });
  },
};

// ============================================================
// Float-precision — fractional percentages are applied unrounded.
// ============================================================

export const FloatPrecision: Story = {
  args: {
    defaultSize: 31.25,
  },
  render: (args) => (
    <Box h="sm">
      <Splitter.Root {...args}>
        <Splitter.Aside>
          <DemoPane bg="indigo.3" title="Aside (31.25%)" />
        </Splitter.Aside>
        <Splitter.Handle />
        <Splitter.Main>
          <DemoPane bg="amber.3" title="Main (68.75%)" />
        </Splitter.Main>
      </Splitter.Root>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");

    // aria-valuenow rounds for AT, but the applied layout keeps full precision.
    // waitFor: aria-valuenow depends on pane registration (useEffect), which may
    // not have run by the time findByRole returns the handle element.
    await waitFor(() => {
      expect(handle).toHaveAttribute("aria-valuenow", "31");
    });
    const ariaControls = handle.getAttribute("aria-controls");
    const asidePane = canvasElement.querySelector<HTMLElement>(
      `#${ariaControls!}`
    );
    await expect(asidePane).toBeTruthy();
    await waitFor(() => {
      expect(asidePane!.style.width).toBe("31.25%");
    });
  },
};

// ============================================================
// Enter on focused handle toggles aside collapse (uncontrolled).
// ============================================================

export const CollapsibleByKeyboard: Story = {
  args: {
    defaultSize: 30,
    minSize: 10,
    maxSize: 80,
    collapsible: true,
    onCollapsedChange: fn(),
  },
  render: (args) => (
    <Box h="xl">
      <Splitter.Root {...args}>
        <Splitter.Aside>
          <DemoPane bg="indigo.3" title="Aside (collapsible)" />
        </Splitter.Aside>
        <Splitter.Handle />
        <Splitter.Main>
          <DemoPane bg="amber.3" title="Main" />
        </Splitter.Main>
      </Splitter.Root>
    </Box>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");
    handle.focus();

    await userEvent.keyboard("{Enter}");
    await waitFor(() => {
      expect(args.onCollapsedChange).toHaveBeenCalledWith(true);
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(0);
    });

    // Regression: bounds are collapse-aware, so the collapsed value (0) stays
    // within [valuemin, valuemax]. The aside is collapsible → valuemin =
    // min(10, 0) = 0; maxSize 80 → valuemax = 80.
    const min = Number(handle.getAttribute("aria-valuemin"));
    const max = Number(handle.getAttribute("aria-valuemax"));
    const now = Number(handle.getAttribute("aria-valuenow"));
    expect(min).toBe(0);
    expect(max).toBe(80);
    expect(now).toBeGreaterThanOrEqual(min);
    expect(now).toBeLessThanOrEqual(max);

    await userEvent.keyboard("{Enter}");
    await waitFor(() => {
      expect(args.onCollapsedChange).toHaveBeenCalledWith(false);
      expect(Number(handle.getAttribute("aria-valuenow"))).toBeGreaterThan(0);
    });
  },
};

// ============================================================
// Collapsed handle is keyboard-only: no mouse-resize affordances.
// Double-click is a no-op while collapsed; Enter still expands.
// ============================================================

export const CollapsedHandleIgnoresDoubleClick: Story = {
  args: {
    defaultSize: 30,
    minSize: 10,
    maxSize: 80,
    collapsible: true,
    collapsedSize: 6,
    onCollapsedChange: fn(),
    onSizeChangeEnd: fn(),
  },
  render: (args) => (
    <Box h="xl">
      <Splitter.Root {...args}>
        <Splitter.Aside>
          <DemoPane bg="indigo.3" title="Aside (collapsible)" />
        </Splitter.Aside>
        <Splitter.Handle />
        <Splitter.Main>
          <DemoPane bg="amber.3" title="Main" />
        </Splitter.Main>
      </Splitter.Root>
    </Box>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");

    // Collapse via keyboard (the only mouse-free path to the collapsed state).
    handle.focus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => {
      expect(args.onCollapsedChange).toHaveBeenCalledWith(true);
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(6);
    });
    // The handle advertises the resize lock so the recipe can drop its
    // mouse-resize affordances (cursor + hover track).
    expect(handle.getAttribute("data-resize-locked")).toBe("true");

    // Double-click while collapsed is a no-op: it must NOT expand or restore.
    await userEvent.dblClick(handle);
    await waitFor(() => {
      // Still collapsed at the collapsed size.
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(6);
    });
    expect(args.onCollapsedChange).not.toHaveBeenCalledWith(false);
    expect(args.onSizeChangeEnd).not.toHaveBeenCalled();

    // Enter still expands — the single intentional keyboard toggle.
    await userEvent.keyboard("{Enter}");
    await waitFor(() => {
      expect(args.onCollapsedChange).toHaveBeenCalledWith(false);
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(30);
    });
  },
};

// ============================================================
// Controlled collapse — a button outside the splitter drives `collapsed`.
// ============================================================

const ControlledCollapseComponent = ({
  onChange,
}: {
  onChange?: (collapsed: boolean) => void;
}) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Stack gap="400" h="lg">
      <Button
        onPress={() => {
          const next = !collapsed;
          setCollapsed(next);
          onChange?.(next);
        }}
        data-testid="toggle-btn"
      >
        Toggle aside
      </Button>
      <Splitter.Root
        defaultSize={30}
        minSize={10}
        maxSize={80}
        collapsible
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
      >
        <Splitter.Aside>
          <DemoPane bg="indigo.3" title="Aside" />
        </Splitter.Aside>
        <Splitter.Handle />
        <Splitter.Main>
          <DemoPane bg="amber.3" title="Main" />
        </Splitter.Main>
      </Splitter.Root>
    </Stack>
  );
};

export const ControlledCollapse: Story = {
  render: () => <ControlledCollapseComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");
    const button = canvas.getByTestId("toggle-btn");

    await userEvent.click(button);
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(0);
    });

    // ScrollArea marks an overflowing viewport keyboard-focusable
    // asynchronously after the abrupt resize; wait for it to settle so the
    // a11y afterEach sees the accessible state.
    await waitFor(() => {
      const navViewport = canvas
        .getByText("Aside")
        .closest('[data-part="viewport"]');
      expect(navViewport).toHaveAttribute("tabindex", "0");
    });

    await userEvent.click(button);
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBeGreaterThan(0);
    });
  },
};

// ============================================================
// Controlled collapse + keyboard expand + double-click restore — once expanded,
// double-click restore must land on the mount-time size (30), not the
// pre-collapse size (50), even though collapse is controlled. Regression for the
// controlled-restore path. (Double-click while collapsed is a no-op — see
// CollapsedHandleIgnoresDoubleClick — so the restore is exercised post-expand.)
// ============================================================

const ControlledRestoreComponent = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Box h="lg">
      <Splitter.Root
        defaultSize={30}
        keyboardStep={5}
        minSize={10}
        maxSize={80}
        collapsible
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
      >
        <Splitter.Aside>
          <DemoPane bg="indigo.3" title="Aside" />
        </Splitter.Aside>
        <Splitter.Handle />
        <Splitter.Main>
          <DemoPane bg="amber.3" title="Main" />
        </Splitter.Main>
      </Splitter.Root>
    </Box>
  );
};

export const ControlledCollapseRestore: Story = {
  render: () => <ControlledRestoreComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(30);
    });

    // Move the boundary off its mount default (30 → 50) via keyboard.
    handle.focus();
    await userEvent.keyboard(
      "{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}"
    );
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(50);
    });

    // Collapse the aside (controlled — Enter drives onCollapsedChange → state).
    await userEvent.keyboard("{Enter}");
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(0);
    });

    // Expand again via Enter — restores the pre-collapse size (50).
    await userEvent.keyboard("{Enter}");
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(50);
    });

    // Now expanded, double-click restores to the mount-time size (30), not the
    // pre-collapse 50.
    await userEvent.dblClick(handle);
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(30);
    });
  },
};

// ============================================================
// Controlled size — a button outside the splitter sets `size`; the layout
// updates in place (no remount), so stateful pane content is preserved. Drag /
// keyboard stay live internally and settle through onSizeChangeEnd.
// ============================================================

const ControlledSizeComponent = () => {
  const [size, setSize] = useState(30);
  return (
    <Stack gap="400" h="lg">
      <Button onPress={() => setSize(60)} data-testid="set-size-btn">
        Set aside to 60
      </Button>
      <Splitter.Root
        size={size}
        onSizeChangeEnd={setSize}
        minSize={10}
        maxSize={90}
      >
        <Splitter.Aside>
          <DemoPane bg="indigo.3" title="Aside">
            {/* Uncontrolled input: its value survives only if the pane is not
                remounted when `size` changes in place. */}
            <input
              data-testid="aside-input"
              aria-label="Note"
              defaultValue=""
            />
          </DemoPane>
        </Splitter.Aside>
        <Splitter.Handle />
        <Splitter.Main>
          <DemoPane bg="amber.3" title="Main" />
        </Splitter.Main>
      </Splitter.Root>
    </Stack>
  );
};

export const ControlledSize: Story = {
  render: () => <ControlledSizeComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(30);
    });

    // Give the pane's input state that a remount would lose.
    const input = canvas.getByTestId<HTMLInputElement>("aside-input");
    await userEvent.type(input, "preserve-me");
    expect(input).toHaveValue("preserve-me");

    // External control sets the size; the layout reflects it in place.
    await userEvent.click(canvas.getByTestId("set-size-btn"));
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(60);
    });

    // The input kept its value → the pane was not remounted.
    expect(canvas.getByTestId<HTMLInputElement>("aside-input")).toHaveValue(
      "preserve-me"
    );
  },
};

// ============================================================
// Controlled size + controlled collapse (NO hook) — regression for collapse
// emitting a resize settle. The consumer follows the contract (feed
// onSizeChangeEnd back into `size`). A programmatic collapse must NOT feed the
// collapsed size back, so expanding restores the real width (30), not 0.
// Collapse/expand are silent on onSizeChangeEnd; they are signalled by
// onCollapsedChange only.
// ============================================================

const ControlledSizeCollapseReproComponent = () => {
  const [size, setSize] = useState(30);
  const [open, setOpen] = useState(true);
  return (
    <Stack gap="400" h="lg">
      <Button onPress={() => setOpen((o) => !o)} data-testid="toggle-btn">
        {open ? "Collapse aside" : "Expand aside"}
      </Button>
      <Splitter.Root
        size={size}
        minSize={10}
        maxSize={80}
        onSizeChangeEnd={setSize}
        collapsible
        collapsedSize={0}
        collapsed={!open}
        onCollapsedChange={(c) => setOpen(!c)}
      >
        <Splitter.Aside>
          <DemoPane bg="indigo.3" title="Aside" />
        </Splitter.Aside>
        <Splitter.Handle />
        <Splitter.Main>
          <DemoPane bg="amber.3" title="Main" />
        </Splitter.Main>
      </Splitter.Root>
    </Stack>
  );
};

export const ControlledSizeCollapseRepro: Story = {
  render: () => <ControlledSizeCollapseReproComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");
    const button = canvas.getByTestId("toggle-btn");

    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(30);
    });

    await userEvent.click(button); // programmatic collapse
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(0);
    });

    await userEvent.click(button); // expand
    await canvas.findByRole("button", { name: "Collapse aside" });

    // The collapse did not feed 0 back into the controlled size, so expand
    // restores the real width — not the collapsed 0.
    expect(Number(handle.getAttribute("aria-valuenow"))).toBe(30);
  },
};

// ============================================================
// Resize is locked while the aside is collapsed — drag + arrow/Home/End do
// nothing and the aside stays at collapsedSize. A visible "Collapse / expand
// nav" button drives the collapse (controlled) so the lock is verifiable by
// hand; it's reopened via that button, Enter, double-click, or the prop —
// never by resizing.
// ============================================================

const ResizeLockedWhileCollapsedComponent = ({
  onSizeChange,
  onSizeChangeEnd,
  onCollapsedChange,
}: {
  onSizeChange?: (size: number) => void;
  onSizeChangeEnd?: (size: number) => void;
  onCollapsedChange?: (collapsed: boolean) => void;
}) => {
  const [collapsed, setCollapsed] = useState(false);
  // The button and the splitter's own toggle (Enter / double-click) both route
  // through here, so the visible control and the keyboard path stay in sync.
  const updateCollapsed = (next: boolean) => {
    setCollapsed(next);
    onCollapsedChange?.(next);
  };
  return (
    <Stack gap="400" h="xl">
      <Button
        onPress={() => updateCollapsed(!collapsed)}
        data-testid="toggle-btn"
      >
        {collapsed ? "Expand aside" : "Collapse aside"}
      </Button>
      <Splitter.Root
        defaultSize={30}
        minSize={15}
        maxSize={80}
        collapsible
        collapsedSize={6}
        collapsed={collapsed}
        onCollapsedChange={updateCollapsed}
        onSizeChange={onSizeChange}
        onSizeChangeEnd={onSizeChangeEnd}
      >
        <Splitter.Aside>
          <DemoPane bg="indigo.3" title="Aside (collapsible)" />
        </Splitter.Aside>
        <Splitter.Handle />
        <Splitter.Main>
          <DemoPane bg="amber.3" title="Main" />
        </Splitter.Main>
      </Splitter.Root>
    </Stack>
  );
};

export const ResizeLockedWhileCollapsed: Story = {
  args: {
    onSizeChange: fn(),
    onSizeChangeEnd: fn(),
    onCollapsedChange: fn(),
  },
  render: (args) => (
    <ResizeLockedWhileCollapsedComponent
      onSizeChange={args.onSizeChange}
      onSizeChangeEnd={args.onSizeChangeEnd}
      onCollapsedChange={args.onCollapsedChange}
    />
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");
    const toggle = canvas.getByTestId("toggle-btn");

    // The fn() mocks are typed as the bare callback signatures on args, so cast
    // to the mock type to read call state.
    const onSizeChange = args.onSizeChange as unknown as ReturnType<typeof fn>;
    const onSizeChangeEnd = args.onSizeChangeEnd as unknown as ReturnType<
      typeof fn
    >;
    const onCollapsedChange = args.onCollapsedChange as unknown as ReturnType<
      typeof fn
    >;

    // Collapse the aside to its rail (collapsedSize 6) via the visible button.
    await userEvent.click(toggle);
    await waitFor(() => {
      expect(onCollapsedChange).toHaveBeenCalledWith(true);
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(6);
    });

    const collapsedNow = Number(handle.getAttribute("aria-valuenow"));
    // The handle advertises the locked state (drives the recipe's cursor reset).
    expect(handle).toHaveAttribute("data-resize-locked", "true");

    onSizeChange.mockClear();
    onSizeChangeEnd.mockClear();
    onCollapsedChange.mockClear();

    // Keyboard resize is locked: arrows / Home / End do nothing while collapsed.
    handle.focus();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}{End}{Home}");

    // Pointer drag is locked too (same fireEvent technique as PointerDragResize).
    const rect = handle.getBoundingClientRect();
    const startX = rect.x + rect.width / 2;
    const y = rect.y + rect.height / 2;
    const pointer = { pointerId: 1, pointerType: "mouse", button: 0 };
    fireEvent.pointerDown(handle, { ...pointer, clientX: startX, clientY: y });
    fireEvent.pointerMove(document, {
      ...pointer,
      clientX: startX + 120,
      clientY: y,
    });
    fireEvent.pointerUp(document, {
      ...pointer,
      clientX: startX + 120,
      clientY: y,
    });

    // Nothing moved, nothing fired, and the aside is still collapsed.
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(collapsedNow);
    });
    expect(onSizeChange).not.toHaveBeenCalled();
    expect(onSizeChangeEnd).not.toHaveBeenCalled();
    expect(onCollapsedChange).not.toHaveBeenCalled();

    // The button reopens it — the lock blocks resizing, not the collapse toggle.
    await userEvent.click(toggle);
    await waitFor(() => {
      expect(onCollapsedChange).toHaveBeenCalledWith(false);
      expect(Number(handle.getAttribute("aria-valuenow"))).toBeGreaterThan(6);
    });
  },
};

// ============================================================
// Persistence — hydrate from any storage; persist on onSizeChangeEnd.
// ============================================================

const PersistenceComponent = () => {
  // Stand-in for a useLocalStorage-style hook: state seeded from "storage".
  const [size, setSize] = useState(25);
  return (
    <Stack gap="400" h="lg">
      <Box data-testid="stored-aside">{`stored aside: ${Math.round(size)}`}</Box>
      <Splitter.Root
        defaultSize={size}
        onSizeChangeEnd={setSize}
        minSize={5}
        maxSize={95}
      >
        <Splitter.Aside>
          <DemoPane bg="indigo.3" title="Aside (hydrated 25%)" />
        </Splitter.Aside>
        <Splitter.Handle />
        <Splitter.Main>
          <DemoPane bg="amber.3" title="Main (hydrated 75%)" />
        </Splitter.Main>
      </Splitter.Root>
    </Stack>
  );
};

export const Persistence: Story = {
  render: () => <PersistenceComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");
    // Hydrated from "storage" (25%), not a 50/50 fallback.
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(25);
    });

    // Move the boundary; the settled value is written back to storage state.
    handle.focus();
    await userEvent.keyboard("{ArrowRight}");
    await waitFor(() => {
      expect(canvas.getByTestId("stored-aside").textContent).not.toBe(
        "stored aside: 25"
      );
    });
  },
};

// ============================================================
// Nested splitters — 3 regions via nesting. The inner splitter places its
// aside on the trailing side (a right panel).
// ============================================================

export const NestedSplitters: Story = {
  render: () => (
    <Box h="xl">
      <Splitter.Root defaultSize={25}>
        <Splitter.Aside>
          <DemoPane bg="indigo.3" title="Aside (outer)" />
        </Splitter.Aside>
        <Splitter.Handle />
        <Splitter.Main>
          <Splitter.Root defaultSize={35}>
            <Splitter.Main>
              <DemoPane bg="amber.3" title="Main" />
            </Splitter.Main>
            <Splitter.Handle />
            <Splitter.Aside>
              <DemoPane bg="rose.3" title="Aside (inner)" />
            </Splitter.Aside>
          </Splitter.Root>
        </Splitter.Main>
      </Splitter.Root>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handles = await canvas.findAllByRole("separator");
    // Each nested splitter contributes one handle.
    await expect(handles.length).toBe(2);
  },
};

// ============================================================
// isDoubleClickDisabled — handle ignores double-click; keyboard unaffected.
// ============================================================

export const DisableDoubleClick: Story = {
  args: {
    isDoubleClickDisabled: true,
    defaultSize: 30,
    minSize: 10,
    maxSize: 90,
  },
  render: (args) => (
    <Box h="sm">
      <Splitter.Root {...args}>
        <Splitter.Aside>
          <DemoPane bg="indigo.3" title="Aside" />
        </Splitter.Aside>
        <Splitter.Handle />
        <Splitter.Main>
          <DemoPane bg="amber.3" title="Main" />
        </Splitter.Main>
      </Splitter.Root>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");

    // Move the boundary off default.
    handle.focus();
    await userEvent.keyboard("{End}");
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBeGreaterThan(30);
    });
    const afterMove = Number(handle.getAttribute("aria-valuenow"));

    // Double-click should be a no-op — the size doesn't snap back.
    await userEvent.dblClick(handle);
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(afterMove);
    });

    // Keyboard still works.
    await userEvent.keyboard("{Home}");
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(10);
    });
  },
};

// ============================================================
// useResponsiveSplitterSizes — token sizes via the companion hook.
// The aside is configured as "xs" (320px); the hook measures the container and
// feeds the equivalent percentage to the component. In a "breakpoint-2xl"
// (1536px) container that is ~21%.
// ============================================================

const ResponsiveSizesHookComponent = () => {
  const { rootProps } = useResponsiveSplitterSizes({
    orientation: "horizontal",
    size: "xs",
    minSize: "3xs",
    maxSize: "lg",
  });
  return (
    <Box w="breakpoint-2xl" h="xl">
      <Splitter.Root {...rootProps} collapsible>
        <Splitter.Aside>
          <DemoPane bg="indigo.3" title="Aside" />
        </Splitter.Aside>
        <Splitter.Handle />
        <Splitter.Main>
          <DemoPane bg="amber.3" title="Main" />
        </Splitter.Main>
      </Splitter.Root>
    </Box>
  );
};

export const ResponsivePixelSizesHook: Story = {
  render: () => <ResponsiveSizesHookComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");

    // "xs" (320px) in a "breakpoint-2xl" (1536px) container → ~21%.
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(21);
    });

    // A keyboard resize settles into the hook's controlled value (no snap-back).
    handle.focus();
    await userEvent.keyboard("{ArrowRight}");
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBeGreaterThan(21);
    });
    const settled = Number(handle.getAttribute("aria-valuenow"));
    await userEvent.keyboard("{Tab}");
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(settled);
    });
  },
};

// ============================================================
// useResponsiveSplitterSizes — responsive by CONTAINER width (object notation).
// The same config resolves against each splitter's OWN width (not the viewport):
// an "xl" (576px) container is below the "breakpoint-md" (768px) threshold (40%),
// a "5xl" (1024px) container is at/above it ("xs"=320px → ~31%).
// ============================================================

const ResponsiveBandDemo = ({ width }: { width: string }) => {
  const { rootProps } = useResponsiveSplitterSizes({
    orientation: "horizontal",
    size: { 0: "40%", "breakpoint-md": "xs" },
  });
  return (
    <Box w={width} h="3xs" borderWidth="25" borderColor="neutral.6">
      <Splitter.Root {...rootProps}>
        <Splitter.Aside>
          <DemoPane bg="indigo.3" title={`Aside @ ${width}`} />
        </Splitter.Aside>
        <Splitter.Handle />
        <Splitter.Main>
          <DemoPane bg="amber.3" title="Main" />
        </Splitter.Main>
      </Splitter.Root>
    </Box>
  );
};

export const ResponsiveByContainerWidth: Story = {
  render: () => (
    <Stack gap="600">
      <ResponsiveBandDemo width="xl" />
      <ResponsiveBandDemo width="5xl" />
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handles = await canvas.findAllByRole("separator");
    expect(handles).toHaveLength(2);

    // "xl" (576px) container is below the "breakpoint-md" threshold → base band, 40%.
    await waitFor(() => {
      expect(Number(handles[0].getAttribute("aria-valuenow"))).toBe(40);
    });
    // "5xl" (1024px) container is at/above "breakpoint-md" → "xs" (320px) → ~31%.
    await waitFor(() => {
      expect(Number(handles[1].getAttribute("aria-valuenow"))).toBe(31);
    });
  },
};

// ============================================================
// useResponsiveSplitterSizes — INTERACTIVE: a Splitter inside a Splitter.
// The OUTER handle resizes the inner splitter's CONTAINER, so dragging it (or
// resizing the window) makes the inner hook re-resolve live. The inner config
// uses "breakpoint-md" as the threshold and "xs" (320px) as the aside size:
// a wide container (≥ 768px) pins the aside to 320px (a small %), a narrow one
// falls back to the base 40% band. Resolution is container-, not viewport-relative.
// ============================================================

const NestedResponsiveComponent = () => {
  const { rootProps } = useResponsiveSplitterSizes({
    orientation: "horizontal",
    size: { 0: "40%", "breakpoint-md": "xs" },
  });
  return (
    <Box w="100%" minW="5xl" h="xl">
      <Splitter.Root defaultSize={15} minSize={15} maxSize={70}>
        <Splitter.Aside>
          <DemoPane bg="neutral.3" title="Aside (outer)" />
        </Splitter.Aside>
        <Splitter.Handle />
        <Splitter.Main>
          <Splitter.Root {...rootProps}>
            <Splitter.Aside>
              <DemoPane bg="indigo.3" title="Aside (responsive)" />
            </Splitter.Aside>
            <Splitter.Handle />
            <Splitter.Main>
              <DemoPane bg="amber.3" title="Main" />
            </Splitter.Main>
          </Splitter.Root>
        </Splitter.Main>
      </Splitter.Root>
    </Box>
  );
};

export const NestedResponsiveSplitter: Story = {
  render: () => <NestedResponsiveComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handles = await canvas.findAllByRole("separator");
    expect(handles).toHaveLength(2);
    const [outer, inner] = handles;

    // Wide inner container (≥ "breakpoint-md") → the aside is pinned to "xs"
    // (320px), which is less than the base 40% band.
    await waitFor(() => {
      expect(Number(inner.getAttribute("aria-valuenow"))).toBeLessThan(40);
    });

    // Drag the outer divider to shrink the inner container below "breakpoint-md"
    // → the inner config falls back to its base 40% band, live.
    outer.focus();
    await userEvent.keyboard("{End}");
    await waitFor(() => {
      expect(Number(inner.getAttribute("aria-valuenow"))).toBe(40);
    });
  },
};

// ============================================================
// useResponsiveSplitterSizes — PERSISTENCE to real localStorage.
// Manual demo (no play assertions): pass `persistKey` and the hook writes the
// user's settled size to localStorage (pixel-first, versioned) via its default
// adapter. Drag + release, then RELOAD the page — the size is restored. The
// readout below polls localStorage so you can watch the stored value update
// live as you drag. Use "Reset stored size" to clear the key and start over.
// ============================================================

const PERSIST_DEMO_KEY = "nimbus:splitter-persistence-demo";

const PersistedResponsiveComponent = () => {
  const { rootProps } = useResponsiveSplitterSizes({
    orientation: "horizontal",
    persistKey: PERSIST_DEMO_KEY,
    size: "xs",
    minSize: "3xs",
    maxSize: "lg",
  });

  // Mirror the persisted value so the reload-and-restore behaviour is visible.
  const [stored, setStored] = useState<string | null>(() =>
    typeof window === "undefined"
      ? null
      : window.localStorage.getItem(PERSIST_DEMO_KEY)
  );
  useEffect(() => {
    const id = window.setInterval(() => {
      setStored(window.localStorage.getItem(PERSIST_DEMO_KEY));
    }, 250);
    return () => window.clearInterval(id);
  }, []);

  const resetStored = () => {
    window.localStorage.removeItem(PERSIST_DEMO_KEY);
    window.location.reload();
  };

  return (
    <Stack gap="400" p="400">
      <Box>
        <Heading size="sm" mb="100">
          Persisted to localStorage
        </Heading>
        <Box mb="200">
          Drag the divider and release, then <strong>reload the page</strong> —
          the size is restored. The settled width is stored in pixels and
          re-converted to a percentage for whatever width the container has on
          the next load.
        </Box>
        <Box
          fontFamily="mono"
          fontSize="350"
          p="200"
          mb="200"
          bg="neutral.2"
          borderRadius="200"
          data-testid="stored-value"
        >
          localStorage["{PERSIST_DEMO_KEY}"] = {stored ?? "(empty)"}
        </Box>
        <Button variant="outline" size="xs" onPress={resetStored}>
          Reset stored size
        </Button>
      </Box>
      <Box w="100%" h="breakpoint-sm" borderWidth="25" borderColor="neutral.6">
        <Splitter.Root {...rootProps} collapsible>
          <Splitter.Aside>
            <DemoPane bg="indigo.3" title="Aside (persisted)" />
          </Splitter.Aside>
          <Splitter.Handle />
          <Splitter.Main>
            <DemoPane bg="amber.3" title="Main" />
          </Splitter.Main>
        </Splitter.Root>
      </Box>
    </Stack>
  );
};

export const PersistedResponsiveSizes: Story = {
  render: () => <PersistedResponsiveComponent />,
};
