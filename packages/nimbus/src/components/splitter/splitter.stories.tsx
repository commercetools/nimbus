import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { useState } from "react";
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
    size: {
      control: { type: "radio" },
      options: ["sm", "md", "lg"],
    },
    keyboardStep: {
      control: { type: "range", min: 1, max: 20, step: 1 },
    },
    isDoubleClickDisabled: { control: { type: "boolean" } },
    isDisabled: { control: { type: "boolean" } },
  },
};

export default meta;
type Story = StoryObj<typeof Splitter.Root>;

// ============================================================
// Default (horizontal, 30/70)
// ============================================================

export const Default: Story = {
  args: {
    orientation: "horizontal",
    defaultSizes: { nav: 30, main: 70 },
  },
  render: (args) => (
    <Box h="600px">
      <Splitter.Root {...args}>
        <Splitter.Pane id="nav">
          <DemoPane bg="indigo.3" title="Nav" />
        </Splitter.Pane>
        <Splitter.Handle />
        <Splitter.Pane id="main">
          <DemoPane bg="amber.3" title="Main" />
        </Splitter.Pane>
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
    await expect(handle.getAttribute("aria-valuenow")).toBe("30");
    await expect(handle).toHaveAttribute("aria-valuetext", "30%");
  },
};

// ============================================================
// Vertical orientation
// ============================================================

export const Vertical: Story = {
  args: {
    orientation: "vertical",
    defaultSizes: { top: 40, bottom: 60 },
  },
  render: (args) => (
    <Box h="600px">
      <Splitter.Root {...args}>
        <Splitter.Pane id="top">
          <DemoPane bg="teal.3" title="Top" />
        </Splitter.Pane>
        <Splitter.Handle />
        <Splitter.Pane id="bottom">
          <DemoPane bg="rose.3" title="Bottom" />
        </Splitter.Pane>
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
// Keyboard interaction (arrows + Home/End) — also asserts the
// settled-change channel (onSizesChangeEnd) fires per keypress.
// ============================================================

export const KeyboardInteraction: Story = {
  args: {
    orientation: "horizontal",
    keyboardStep: 5,
    defaultSizes: { nav: 30, main: 70 },
    panes: {
      nav: { minSize: 10 },
      main: { minSize: 20 },
    },
    onSizesChange: fn(),
    onSizesChangeEnd: fn(),
  },
  render: (args) => (
    <Box h="600px">
      <Splitter.Root {...args}>
        <Splitter.Pane id="nav">
          <DemoPane bg="indigo.3" title="Nav" />
        </Splitter.Pane>
        <Splitter.Handle />
        <Splitter.Pane id="main">
          <DemoPane bg="amber.3" title="Main" />
        </Splitter.Pane>
      </Splitter.Root>
    </Box>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");
    handle.focus();
    await expect(handle).toHaveFocus();

    await userEvent.keyboard("{ArrowRight}");
    await expect(args.onSizesChange).toHaveBeenCalled();
    await expect(args.onSizesChangeEnd).toHaveBeenCalled();
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(35);
    });

    await userEvent.keyboard("{ArrowLeft}");
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(30);
    });

    // Home → previous pane shrinks to its minSize.
    await userEvent.keyboard("{Home}");
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(10);
    });

    // End → previous pane grows to (100 - next.minSize).
    await userEvent.keyboard("{End}");
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(80);
    });
  },
};

// ============================================================
// Pointer drag (useMove) — dragging the handle resizes the panes and fires
// the live (onSizesChange) + settled (onSizesChangeEnd) channels. Covers the
// pointer path that the keyboard / collapse stories don't exercise.
// ============================================================

export const PointerDragResize: Story = {
  args: {
    orientation: "horizontal",
    defaultSizes: { nav: 30, main: 70 },
    panes: {
      nav: { minSize: 10 },
      main: { minSize: 10 },
    },
    onSizesChange: fn(),
    onSizesChangeEnd: fn(),
  },
  render: (args) => (
    <Box h="600px">
      <Splitter.Root {...args}>
        <Splitter.Pane id="nav">
          <DemoPane bg="indigo.3" title="Nav" />
        </Splitter.Pane>
        <Splitter.Handle />
        <Splitter.Pane id="main">
          <DemoPane bg="amber.3" title="Main" />
        </Splitter.Pane>
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

    // Live channel fired and the boundary moved right (nav grew past 30%).
    await waitFor(() => {
      expect(args.onSizesChange).toHaveBeenCalled();
      expect(Number(handle.getAttribute("aria-valuenow"))).toBeGreaterThan(30);
    });

    // Drag stayed within the announced upper bound.
    const now = Number(handle.getAttribute("aria-valuenow"));
    expect(now).toBeLessThanOrEqual(
      Number(handle.getAttribute("aria-valuemax"))
    );

    // Settled channel fired on pointer release (the persistence seam).
    await waitFor(() => {
      expect(args.onSizesChangeEnd).toHaveBeenCalled();
    });
  },
};

// ============================================================
// Per-pane constraints — minSize on each side bounds the single boundary.
// The upper bound is the complement of the partner's minSize (no maxSize knob).
// ============================================================

export const PerPaneConstraints: Story = {
  args: {
    orientation: "horizontal",
    keyboardStep: 100,
    defaultSizes: { nav: 30, main: 70 },
    panes: {
      nav: { minSize: 15 },
      main: { minSize: 25 },
    },
  },
  render: (args) => (
    <Box h="600px">
      <Splitter.Root {...args}>
        <Splitter.Pane id="nav">
          <DemoPane bg="indigo.3" title="Nav (min 15)" />
        </Splitter.Pane>
        <Splitter.Handle />
        <Splitter.Pane id="main">
          <DemoPane bg="amber.3" title="Main (min 25)" />
        </Splitter.Pane>
      </Splitter.Root>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");

    // aria-valuemin = panes.nav.minSize; aria-valuemax = 100 - panes.main.minSize.
    await expect(handle).toHaveAttribute("aria-valuemin", "15");
    await expect(handle).toHaveAttribute("aria-valuemax", "75");

    handle.focus();
    // Large jump right → clamps at 100 - main.minSize (75).
    await userEvent.keyboard("{End}");
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(75);
    });
    // Large jump left → clamps at nav.minSize (15).
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
    defaultSizes: { nav: 30, main: 70 },
  },
  render: (args) => (
    <Box h="600px">
      <Splitter.Root {...args}>
        <Splitter.Pane id="nav">
          <DemoPane bg="indigo.3" title="Nav" />
        </Splitter.Pane>
        <Splitter.Handle />
        <Splitter.Pane id="main">
          <DemoPane bg="amber.3" title="Main" />
        </Splitter.Pane>
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
// ARIA — aria-controls points at previous Pane's DOM id.
// ============================================================

export const AriaControlsAttribute: Story = {
  args: {
    defaultSizes: { nav: 30, main: 70 },
  },
  render: (args) => (
    <Box h="400px">
      <Splitter.Root {...args}>
        <Splitter.Pane id="nav">
          <DemoPane bg="indigo.3" title="Nav" />
        </Splitter.Pane>
        <Splitter.Handle />
        <Splitter.Pane id="main">
          <DemoPane bg="amber.3" title="Main" />
        </Splitter.Pane>
      </Splitter.Root>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");
    const ariaControls = handle.getAttribute("aria-controls");
    await expect(ariaControls).toBeTruthy();

    // aria-controls should point at the *previous* pane (first DOM sibling).
    const navPane = canvasElement.querySelector(`#${ariaControls!}`);
    await expect(navPane).toBeTruthy();
    await expect(navPane!.textContent).toContain("Nav");
  },
};

// ============================================================
// Double-click restores the boundary to its initial position.
// ============================================================

export const DoubleClickRestoresDefaults: Story = {
  args: {
    defaultSizes: { nav: 30, main: 70 },
    panes: {
      nav: { minSize: 10 },
      main: { minSize: 10 },
    },
    onSizesChangeEnd: fn(),
  },
  render: (args) => (
    <Box h="600px">
      <Splitter.Root {...args}>
        <Splitter.Pane id="nav">
          <DemoPane bg="indigo.3" title="Nav (default 30)" />
        </Splitter.Pane>
        <Splitter.Handle />
        <Splitter.Pane id="main">
          <DemoPane bg="amber.3" title="Main (default 70)" />
        </Splitter.Pane>
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
    expect(args.onSizesChangeEnd).toHaveBeenCalled();
  },
};

// ============================================================
// Double-click restores correctly even when an initial size is 0
// (regression guard for the falsy restore guard).
// ============================================================

export const RestoreDefaultsWithZeroSize: Story = {
  args: {
    defaultSizes: { nav: 0, main: 100 },
    panes: {
      nav: { minSize: 0 },
      main: { minSize: 0 },
    },
  },
  render: (args) => (
    <Box h="400px">
      <Splitter.Root {...args}>
        <Splitter.Pane id="nav">
          <DemoPane bg="indigo.3" title="Nav (default 0)" />
        </Splitter.Pane>
        <Splitter.Handle />
        <Splitter.Pane id="main">
          <DemoPane bg="amber.3" title="Main (default 100)" />
        </Splitter.Pane>
      </Splitter.Root>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(0);
    });

    // Grow nav off 0, then double-click to restore back to 0.
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
    defaultSizes: { nav: 31.25, main: 68.75 },
  },
  render: (args) => (
    <Box h="400px">
      <Splitter.Root {...args}>
        <Splitter.Pane id="nav">
          <DemoPane bg="indigo.3" title="Nav (31.25%)" />
        </Splitter.Pane>
        <Splitter.Handle />
        <Splitter.Pane id="main">
          <DemoPane bg="amber.3" title="Main (68.75%)" />
        </Splitter.Pane>
      </Splitter.Root>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");

    // aria-valuenow rounds for AT, but the applied layout keeps full precision.
    await expect(handle).toHaveAttribute("aria-valuenow", "31");
    const ariaControls = handle.getAttribute("aria-controls");
    const navPane = canvasElement.querySelector<HTMLElement>(
      `#${ariaControls!}`
    );
    await expect(navPane).toBeTruthy();
    await waitFor(() => {
      expect(navPane!.style.width).toBe("31.25%");
    });
  },
};

// ============================================================
// Enter on focused handle toggles collapse (uncontrolled).
// ============================================================

export const CollapsibleByKeyboard: Story = {
  args: {
    defaultSizes: { nav: 30, main: 70 },
    panes: {
      nav: { minSize: 10, collapsible: true },
      main: { minSize: 20 },
    },
    onCollapsedPaneChange: fn(),
  },
  render: (args) => (
    <Box h="600px">
      <Splitter.Root {...args}>
        <Splitter.Pane id="nav">
          <DemoPane bg="indigo.3" title="Nav (collapsible)" />
        </Splitter.Pane>
        <Splitter.Handle />
        <Splitter.Pane id="main">
          <DemoPane bg="amber.3" title="Main" />
        </Splitter.Pane>
      </Splitter.Root>
    </Box>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");
    handle.focus();

    await userEvent.keyboard("{Enter}");
    await waitFor(() => {
      expect(args.onCollapsedPaneChange).toHaveBeenCalledWith("nav");
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(0);
    });

    // Regression: bounds are collapse-aware, so the collapsed value (0) stays
    // within [valuemin, valuemax]. nav is collapsible → valuemin = min(10, 0) = 0;
    // main has minSize 20 and isn't collapsible → valuemax = 100 - 20 = 80.
    const min = Number(handle.getAttribute("aria-valuemin"));
    const max = Number(handle.getAttribute("aria-valuemax"));
    const now = Number(handle.getAttribute("aria-valuenow"));
    expect(min).toBe(0);
    expect(max).toBe(80);
    expect(now).toBeGreaterThanOrEqual(min);
    expect(now).toBeLessThanOrEqual(max);

    await userEvent.keyboard("{Enter}");
    await waitFor(() => {
      expect(args.onCollapsedPaneChange).toHaveBeenCalledWith(null);
      expect(Number(handle.getAttribute("aria-valuenow"))).toBeGreaterThan(0);
    });
  },
};

// ============================================================
// Controlled collapse — a button outside the splitter drives collapsedPane.
// ============================================================

const ControlledCollapseComponent = ({
  onChange,
}: {
  onChange?: (id: string | null) => void;
}) => {
  const [collapsed, setCollapsed] = useState<string | null>(null);
  return (
    <Stack gap="400" h="500px">
      <Button
        onPress={() => {
          const next = collapsed === "nav" ? null : "nav";
          setCollapsed(next);
          onChange?.(next);
        }}
        data-testid="toggle-btn"
      >
        Toggle nav
      </Button>
      <Splitter.Root
        defaultSizes={{ nav: 30, main: 70 }}
        panes={{
          nav: { minSize: 10, collapsible: true },
          main: { minSize: 20 },
        }}
        collapsedPane={collapsed}
        onCollapsedPaneChange={setCollapsed}
      >
        <Splitter.Pane id="nav">
          <DemoPane bg="indigo.3" title="Nav" />
        </Splitter.Pane>
        <Splitter.Handle />
        <Splitter.Pane id="main">
          <DemoPane bg="amber.3" title="Main" />
        </Splitter.Pane>
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
        .getByText("Nav")
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
// Controlled collapse + drag + double-click restore — restore must land on
// the mount-time sizes (30/70), not the pre-collapse sizes (50/50), even
// though collapse is controlled. Regression for the controlled-restore path.
// ============================================================

const ControlledRestoreComponent = () => {
  const [collapsed, setCollapsed] = useState<string | null>(null);
  return (
    <Box h="500px">
      <Splitter.Root
        defaultSizes={{ nav: 30, main: 70 }}
        keyboardStep={5}
        panes={{
          nav: { minSize: 10, collapsible: true },
          main: { minSize: 20 },
        }}
        collapsedPane={collapsed}
        onCollapsedPaneChange={setCollapsed}
      >
        <Splitter.Pane id="nav">
          <DemoPane bg="indigo.3" title="Nav" />
        </Splitter.Pane>
        <Splitter.Handle />
        <Splitter.Pane id="main">
          <DemoPane bg="amber.3" title="Main" />
        </Splitter.Pane>
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

    // Drag the boundary off its mount default (30 → 50) via keyboard.
    handle.focus();
    await userEvent.keyboard(
      "{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}"
    );
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(50);
    });

    // Collapse nav (controlled — Enter drives onCollapsedPaneChange → state).
    await userEvent.keyboard("{Enter}");
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(0);
    });

    // Double-click restores to the mount-time sizes (30), not pre-collapse 50.
    await userEvent.dblClick(handle);
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(30);
    });
  },
};

// ============================================================
// Controlled sizes — a button outside the splitter sets `sizes`; the layout
// updates in place (no remount), so stateful pane content is preserved. Drag /
// keyboard stay live internally and settle through onSizesChangeEnd.
// ============================================================

const ControlledSizesComponent = () => {
  const [sizes, setSizes] = useState<Record<string, number>>({
    nav: 30,
    main: 70,
  });
  return (
    <Stack gap="400" h="500px">
      <Button
        onPress={() => setSizes({ nav: 60, main: 40 })}
        data-testid="set-sizes-btn"
      >
        Set nav to 60
      </Button>
      <Splitter.Root
        sizes={sizes}
        onSizesChangeEnd={setSizes}
        panes={{ nav: { minSize: 10 }, main: { minSize: 10 } }}
      >
        <Splitter.Pane id="nav">
          <DemoPane bg="indigo.3" title="Nav">
            {/* Uncontrolled input: its value survives only if the pane is not
                remounted when `sizes` changes in place. */}
            <input data-testid="nav-input" aria-label="Note" defaultValue="" />
          </DemoPane>
        </Splitter.Pane>
        <Splitter.Handle />
        <Splitter.Pane id="main">
          <DemoPane bg="amber.3" title="Main" />
        </Splitter.Pane>
      </Splitter.Root>
    </Stack>
  );
};

export const ControlledSizes: Story = {
  render: () => <ControlledSizesComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(30);
    });

    // Give the pane's input state that a remount would lose.
    const input = canvas.getByTestId<HTMLInputElement>("nav-input");
    await userEvent.type(input, "preserve-me");
    expect(input).toHaveValue("preserve-me");

    // External control sets sizes; the layout reflects it in place.
    await userEvent.click(canvas.getByTestId("set-sizes-btn"));
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(60);
    });

    // The input kept its value → the pane was not remounted.
    expect(canvas.getByTestId<HTMLInputElement>("nav-input")).toHaveValue(
      "preserve-me"
    );
  },
};

// ============================================================
// Resize is locked while a pane is collapsed — drag + arrow/Home/End do
// nothing and the pane stays at collapsedSize. It's reopened via Enter,
// double-click, or the controlled prop, never by resizing.
// ============================================================

export const ResizeLockedWhileCollapsed: Story = {
  args: {
    defaultSizes: { nav: 30, main: 70 },
    panes: {
      nav: { minSize: 15, collapsible: true, collapsedSize: 6 },
      main: { minSize: 20 },
    },
    onSizesChange: fn(),
    onSizesChangeEnd: fn(),
    onCollapsedPaneChange: fn(),
  },
  render: (args) => (
    <Box h="600px">
      <Splitter.Root {...args}>
        <Splitter.Pane id="nav">
          <DemoPane bg="indigo.3" title="Nav (collapsible)" />
        </Splitter.Pane>
        <Splitter.Handle />
        <Splitter.Pane id="main">
          <DemoPane bg="amber.3" title="Main" />
        </Splitter.Pane>
      </Splitter.Root>
    </Box>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");

    // The fn() mocks are typed as the bare callback signatures on args, so cast
    // to the mock type to read call state.
    const onSizesChange = args.onSizesChange as unknown as ReturnType<
      typeof fn
    >;
    const onSizesChangeEnd = args.onSizesChangeEnd as unknown as ReturnType<
      typeof fn
    >;
    const onCollapsedPaneChange =
      args.onCollapsedPaneChange as unknown as ReturnType<typeof fn>;

    // Collapse nav to its rail (collapsedSize 6) via Enter.
    handle.focus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => {
      expect(onCollapsedPaneChange).toHaveBeenCalledWith("nav");
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(6);
    });

    const collapsedNow = Number(handle.getAttribute("aria-valuenow"));
    // The handle advertises the locked state (drives the recipe's cursor reset).
    expect(handle).toHaveAttribute("data-resize-locked", "true");

    onSizesChange.mockClear();
    onSizesChangeEnd.mockClear();
    onCollapsedPaneChange.mockClear();

    // Keyboard resize is locked: arrows / Home / End do nothing while collapsed.
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

    // Nothing moved, nothing fired, and the pane is still collapsed.
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(collapsedNow);
    });
    expect(onSizesChange).not.toHaveBeenCalled();
    expect(onSizesChangeEnd).not.toHaveBeenCalled();
    expect(onCollapsedPaneChange).not.toHaveBeenCalled();

    // Enter still expands — the lock blocks resizing, not the collapse toggle.
    await userEvent.keyboard("{Enter}");
    await waitFor(() => {
      expect(onCollapsedPaneChange).toHaveBeenCalledWith(null);
      expect(Number(handle.getAttribute("aria-valuenow"))).toBeGreaterThan(6);
    });
  },
};

// ============================================================
// Persistence — hydrate from any storage; persist on onSizesChangeEnd.
// ============================================================

const PersistenceComponent = () => {
  // Stand-in for a useLocalStorage-style hook: state seeded from "storage".
  const [sizes, setSizes] = useState<Record<string, number>>({
    nav: 25,
    main: 75,
  });
  return (
    <Stack gap="400" h="500px">
      <Box data-testid="stored-nav">{`stored nav: ${Math.round(sizes.nav!)}`}</Box>
      <Splitter.Root
        defaultSizes={sizes}
        onSizesChangeEnd={setSizes}
        panes={{ nav: { minSize: 5 }, main: { minSize: 5 } }}
      >
        <Splitter.Pane id="nav">
          <DemoPane bg="indigo.3" title="Nav (hydrated 25%)" />
        </Splitter.Pane>
        <Splitter.Handle />
        <Splitter.Pane id="main">
          <DemoPane bg="amber.3" title="Main (hydrated 75%)" />
        </Splitter.Pane>
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
      expect(canvas.getByTestId("stored-nav").textContent).not.toBe(
        "stored nav: 25"
      );
    });
  },
};

// ============================================================
// Nested splitters — 3 regions via nesting.
// ============================================================

export const NestedSplitters: Story = {
  render: () => (
    <Box h="600px">
      <Splitter.Root defaultSizes={{ nav: 25, rest: 75 }}>
        <Splitter.Pane id="nav">
          <DemoPane bg="indigo.3" title="Nav" />
        </Splitter.Pane>
        <Splitter.Handle />
        <Splitter.Pane id="rest">
          <Splitter.Root defaultSizes={{ main: 65, aside: 35 }}>
            <Splitter.Pane id="main">
              <DemoPane bg="amber.3" title="Main" />
            </Splitter.Pane>
            <Splitter.Handle />
            <Splitter.Pane id="aside">
              <DemoPane bg="rose.3" title="Aside" />
            </Splitter.Pane>
          </Splitter.Root>
        </Splitter.Pane>
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
    defaultSizes: { nav: 30, main: 70 },
    panes: {
      nav: { minSize: 10 },
      main: { minSize: 10 },
    },
  },
  render: (args) => (
    <Box h="400px">
      <Splitter.Root {...args}>
        <Splitter.Pane id="nav">
          <DemoPane bg="indigo.3" title="Nav" />
        </Splitter.Pane>
        <Splitter.Handle />
        <Splitter.Pane id="main">
          <DemoPane bg="amber.3" title="Main" />
        </Splitter.Pane>
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

    // Double-click should be a no-op — sizes don't snap back.
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
