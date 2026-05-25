import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { useRef } from "react";
import { Box, Button, Heading, ScrollArea, Stack } from "@commercetools/nimbus";
import { userEvent, within, expect, fn, waitFor } from "storybook/test";
import { Splitter } from "./splitter";
import { useSplitterLayout } from "./hooks/use-splitter-layout";

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
    keyboardStep: {
      control: { type: "range", min: 1, max: 20, step: 1 },
    },
    disableDoubleClick: { control: { type: "boolean" } },
  },
};

export default meta;
type Story = StoryObj<typeof Splitter.Root>;

// ============================================================
// Default (horizontal, balanced 50/50, no constraints)
// ============================================================

export const Default: Story = {
  args: {
    orientation: "horizontal",
    panes: {
      nav: { defaultSize: 30 },
      main: { defaultSize: 70 },
    },
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
  },
};

// ============================================================
// Vertical orientation
// ============================================================

export const Vertical: Story = {
  args: {
    orientation: "vertical",
    panes: {
      top: { defaultSize: 40 },
      bottom: { defaultSize: 60 },
    },
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
// Keyboard interaction (arrows + Home/End)
// ============================================================

export const KeyboardInteraction: Story = {
  args: {
    orientation: "horizontal",
    keyboardStep: 5,
    panes: {
      nav: { defaultSize: 30, minSize: 10 },
      main: { defaultSize: 70, minSize: 20 },
    },
    onSizesChange: fn(),
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
// Per-pane min/max constraints clamp drag and keyboard
// ============================================================

export const PerPaneConstraints: Story = {
  args: {
    orientation: "horizontal",
    keyboardStep: 100,
    panes: {
      nav: { defaultSize: 30, minSize: 15, maxSize: 50 },
      main: { defaultSize: 70, minSize: 25 },
    },
  },
  render: (args) => (
    <Box h="600px">
      <Splitter.Root {...args}>
        <Splitter.Pane id="nav">
          <DemoPane bg="indigo.3" title="Nav (min 15, max 50)" />
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

    // aria-valuemin reflects panes.nav.minSize, aria-valuemax = 100 - panes.main.minSize, capped by panes.nav.maxSize.
    await expect(handle).toHaveAttribute("aria-valuemin", "15");
    await expect(handle).toHaveAttribute("aria-valuemax", "50");

    handle.focus();
    // Large jump right → clamps at nav.maxSize (50).
    await userEvent.keyboard("{End}");
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(50);
    });
    // Large jump left → clamps at nav.minSize (15).
    await userEvent.keyboard("{Home}");
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(15);
    });
  },
};

// ============================================================
// Disabled state — both panes disabled removes the handle from tab order.
// ============================================================

export const DisabledBothPanes: Story = {
  args: {
    panes: {
      nav: { defaultSize: 30, disabled: true },
      main: { defaultSize: 70, disabled: true },
    },
  },
  render: (args) => (
    <Box h="600px">
      <Splitter.Root {...args}>
        <Splitter.Pane id="nav">
          <DemoPane bg="indigo.3" title="Nav (disabled)" />
        </Splitter.Pane>
        <Splitter.Handle />
        <Splitter.Pane id="main">
          <DemoPane bg="amber.3" title="Main (disabled)" />
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
    panes: {
      nav: { defaultSize: 30 },
      main: { defaultSize: 70 },
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
    const ariaControls = handle.getAttribute("aria-controls");
    await expect(ariaControls).toBeTruthy();

    // aria-controls should point at the *previous* pane (first DOM sibling).
    const navPane = canvasElement.querySelector(`#${ariaControls!}`);
    await expect(navPane).toBeTruthy();
    await expect(navPane!.textContent).toContain("Nav");
  },
};

// ============================================================
// Double-click toggles collapse on adjacent collapsible pane.
// ============================================================

export const CollapsibleByDoubleClick: Story = {
  args: {
    panes: {
      nav: { defaultSize: 30, minSize: 10, collapsible: true },
      main: { defaultSize: 70, minSize: 20 },
    },
    onCollapse: fn(),
    onExpand: fn(),
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

    await userEvent.dblClick(handle);
    await waitFor(() => {
      expect(args.onCollapse).toHaveBeenCalledWith("nav");
    });
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(0);
    });

    await userEvent.dblClick(handle);
    await waitFor(() => {
      expect(args.onExpand).toHaveBeenCalledWith("nav");
    });
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(30);
    });
  },
};

// ============================================================
// Enter on focused handle toggles collapse.
// ============================================================

export const CollapsibleByKeyboard: Story = {
  args: {
    panes: {
      nav: { defaultSize: 30, minSize: 10, collapsible: true },
      main: { defaultSize: 70, minSize: 20 },
    },
    onCollapse: fn(),
    onExpand: fn(),
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
      expect(args.onCollapse).toHaveBeenCalledWith("nav");
    });

    await userEvent.keyboard("{Enter}");
    await waitFor(() => {
      expect(args.onExpand).toHaveBeenCalledWith("nav");
    });
  },
};

// ============================================================
// Collapse / Expand callbacks fire with the right ids.
// ============================================================

export const CollapseExpandCallbacks: Story = {
  args: {
    panes: {
      nav: { defaultSize: 30, collapsible: true },
      main: { defaultSize: 70 },
    },
    onCollapse: fn(),
    onExpand: fn(),
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
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");

    await userEvent.dblClick(handle);
    await waitFor(() => {
      expect(args.onCollapse).toHaveBeenCalledTimes(1);
      expect(args.onCollapse).toHaveBeenCalledWith("nav");
      expect(args.onExpand).not.toHaveBeenCalled();
    });

    await userEvent.dblClick(handle);
    await waitFor(() => {
      expect(args.onExpand).toHaveBeenCalledTimes(1);
      expect(args.onExpand).toHaveBeenCalledWith("nav");
    });
  },
};

// ============================================================
// Persistence — useSplitterLayout with a custom storage adapter.
// ============================================================

const WithPersistenceHookComponent = ({
  onLoaded,
}: {
  onLoaded?: (sizes: Record<string, number>) => void;
}) => {
  // In-memory storage so the story doesn't depend on real localStorage.
  const storeRef = useRef<Record<string, number> | undefined>({
    nav: 25,
    main: 75,
  });
  const layout = useSplitterLayout({
    initialSizes: { nav: 40, main: 60 },
    storage: {
      load: () => storeRef.current,
      save: (sizes) => {
        storeRef.current = sizes;
      },
    },
  });
  // Surface the hydrated default to the play function via a side-channel.
  onLoaded?.(layout.defaultSizes);
  return (
    <Box h="400px">
      <Splitter.Root
        panes={{ nav: { minSize: 10 }, main: { minSize: 10 } }}
        defaultSizes={layout.defaultSizes}
        onSizesChange={layout.onSizesChange}
        __layoutRef={layout.__layoutRef}
      >
        <Splitter.Pane id="nav">
          <DemoPane bg="indigo.3" title="Nav (hydrated 25%)" />
        </Splitter.Pane>
        <Splitter.Handle />
        <Splitter.Pane id="main">
          <DemoPane bg="amber.3" title="Main (hydrated 75%)" />
        </Splitter.Pane>
      </Splitter.Root>
    </Box>
  );
};

export const WithPersistenceHook: Story = {
  render: () => <WithPersistenceHookComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");
    // Hydrated from storage (25%), not the initialSizes default (40%).
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(25);
    });
  },
};

// ============================================================
// Cross-app commands — a button outside the splitter collapses a pane.
// ============================================================

const CrossAppCommandsComponent = () => {
  const layout = useSplitterLayout({ initialSizes: { nav: 30, main: 70 } });
  return (
    <Stack gap="400" h="500px">
      <Button onPress={() => layout.collapse("nav")} data-testid="collapse-btn">
        Collapse nav
      </Button>
      <Splitter.Root
        panes={{
          nav: { minSize: 10, collapsible: true },
          main: { minSize: 20 },
        }}
        defaultSizes={layout.defaultSizes}
        onSizesChange={layout.onSizesChange}
        __layoutRef={layout.__layoutRef}
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

export const CrossAppCommands: Story = {
  render: () => <CrossAppCommandsComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");
    const button = canvas.getByTestId("collapse-btn");

    await userEvent.click(button);
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(0);
    });
  },
};

// ============================================================
// Nested splitters — 3 regions via nesting.
// ============================================================

export const NestedSplitters: Story = {
  render: () => (
    <Box h="600px">
      <Splitter.Root
        panes={{ nav: { defaultSize: 25 }, rest: { defaultSize: 75 } }}
      >
        <Splitter.Pane id="nav">
          <DemoPane bg="indigo.3" title="Nav" />
        </Splitter.Pane>
        <Splitter.Handle />
        <Splitter.Pane id="rest">
          <Splitter.Root
            panes={{ main: { defaultSize: 65 }, aside: { defaultSize: 35 } }}
          >
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
// GracefulPersistence — stored layout with unknown id reconciles gracefully.
// ============================================================

const GracefulPersistenceComponent = () => {
  const storeRef = useRef<Record<string, number>>({
    nav: 20,
    legacyAside: 30, // unknown id from an older release
  });
  const layout = useSplitterLayout({
    initialSizes: { nav: 40, main: 60 },
    storage: {
      load: () => storeRef.current,
      save: (sizes) => {
        storeRef.current = sizes;
      },
    },
  });
  return (
    <Box h="400px">
      <Splitter.Root
        panes={{ nav: { minSize: 5 }, main: { minSize: 5 } }}
        defaultSizes={layout.defaultSizes}
        onSizesChange={layout.onSizesChange}
        __layoutRef={layout.__layoutRef}
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

export const GracefulPersistence: Story = {
  render: () => <GracefulPersistenceComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");
    // Storage had { nav: 20, legacyAside: 30 } (sum 50, > 1% drift)  →  hook
    // falls back to initialSizes { nav: 40, main: 60 }.
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(40);
    });
  },
};

// ============================================================
// disableDoubleClick — handle ignores double-click.
// ============================================================

export const DisableDoubleClick: Story = {
  args: {
    disableDoubleClick: true,
    panes: {
      nav: { defaultSize: 30, collapsible: true },
      main: { defaultSize: 70 },
    },
    onCollapse: fn(),
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
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const handle = await canvas.findByRole("separator");
    await userEvent.dblClick(handle);
    // Double-click is suppressed; keyboard still works.
    await expect(args.onCollapse).not.toHaveBeenCalled();
    handle.focus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => {
      expect(args.onCollapse).toHaveBeenCalledWith("nav");
    });
  },
};
