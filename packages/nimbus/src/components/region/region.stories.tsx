import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  ScrollArea,
  Splitter,
  Stack,
  Text,
} from "@commercetools/nimbus";
import { userEvent, within, expect, waitFor } from "storybook/test";
import { Region } from "./region";
import { useRegion } from "./use-region";

/**
 * `Region` is a headless, component-agnostic primitive for named regions: a
 * `Region.Provider` scope, `Region.Outlet`s as named render targets, and
 * `useRegion(name)` to project content into them (and read a `value` an outlet
 * publishes — e.g. control callbacks). It is standalone; the last story composes
 * it with a `Splitter` to build a shell-owned, remotely-controlled side panel
 * without the Splitter knowing anything about regions.
 */
const meta: Meta<typeof Region.Provider> = {
  title: "Components/Region",
  component: Region.Provider,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Region.Provider>;

/** A consumer authored far from the outlet that projects into it by name. */
const Projector = () => {
  const { Region: Sidebar } = useRegion("demo-sidebar");
  return (
    <Sidebar>
      <Box data-testid="projected" p="200" bg="teal.3">
        Projected into the named outlet.
      </Box>
    </Sidebar>
  );
};

export const ProjectIntoNamedOutlet: Story = {
  render: () => (
    <Region.Provider>
      <Stack direction="row" gap="400">
        <Box flexGrow="1" p="200" bg="amber.3">
          <Box mb="200">Content area (authors the projected node)</Box>
          <Projector />
        </Box>
        <Box id="sidebar-host" w="240px" minH="160px" bg="neutral.3" p="200">
          <Region.Outlet name="demo-sidebar" />
        </Box>
      </Stack>
    </Region.Provider>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step(
      "Content authored in one place paints at the outlet",
      async () => {
        const host = canvasElement.querySelector<HTMLElement>("#sidebar-host")!;
        const projected = canvas.getByTestId("projected");
        await expect(host.contains(projected)).toBe(true);
      }
    );
  },
};

/** Toggling the projected content mounts/unmounts it at the outlet. */
const ToggleProjector = () => {
  const { Region: Slot } = useRegion("toggle-slot");
  return (
    <Stack gap="200">
      <Slot>
        <Box data-testid="toggle-content" p="200" bg="purple.3">
          Now you see me.
        </Box>
      </Slot>
    </Stack>
  );
};

export const NullBeforeOutletMounts: Story = {
  render: () => {
    const Demo = () => {
      const { node } = useRegion("toggle-slot");
      return (
        <Stack gap="300">
          <Box data-testid="node-status">
            {node ? "outlet-present" : "outlet-absent"}
          </Box>
          <ToggleProjector />
          <Region.Outlet name="toggle-slot" data-testid="slot-outlet" />
        </Stack>
      );
    };
    return (
      <Region.Provider>
        <Demo />
      </Region.Provider>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Region resolves once the outlet mounts", async () => {
      await waitFor(() =>
        expect(canvas.getByTestId("node-status").textContent).toBe(
          "outlet-present"
        )
      );
    });
    await step("Projected content lands inside the outlet", async () => {
      const outlet = canvas.getByTestId("slot-outlet");
      await expect(outlet.contains(canvas.getByTestId("toggle-content"))).toBe(
        true
      );
    });
  },
};

// ============================================================
// Composition: a shell-owned, remotely-controlled side panel
// (Splitter + Region — the Splitter has no knowledge of regions)
// ============================================================

/** Control surface a consumer reads from the region's published value. */
type PanelControls = {
  isCollapsed: boolean;
  expand: () => void;
  collapse: () => void;
  toggle: () => void;
};

/**
 * A consumer that owns no splitter markup. It reads the region's `value` for the
 * panel controls and projects content into the aside via the region portal —
 * the shell-owned-sidebar pattern.
 */
const SidePanelConsumer = () => {
  const { Region: Aside, value } = useRegion<PanelControls>("app-side-panel");
  // Depend on the STABLE callbacks, not the whole value object (which changes
  // identity on every collapse) — otherwise this effect would ping-pong.
  const expand = value?.expand;
  const collapse = value?.collapse;
  const toggle = value?.toggle;
  useEffect(() => {
    expand?.();
    return () => collapse?.();
  }, [expand, collapse]);

  return (
    <Stack gap="200">
      <Button data-testid="toggle-panel" onPress={() => toggle?.()}>
        Toggle panel
      </Button>
      <Aside>
        {/* ScrollArea contains overflow so a collapsed (0-width) pane isn't a
            bare scrollable region — matches the Splitter's own pane pattern. */}
        <ScrollArea h="100%" w="100%">
          <Box data-testid="panel-content" p="300" bg="teal.3" minH="100%">
            <Text>Agent panel — authored in main, painted in the aside.</Text>
          </Box>
        </ScrollArea>
      </Aside>
    </Stack>
  );
};

/** The shell: composes Splitter + Region and publishes the collapse controls. */
const ShellSidePanel = () => {
  const [open, setOpen] = useState(false);

  // Stable callbacks (identity never changes), value memoized on the reactive bit.
  const commands = useRef({
    expand: () => setOpen(true),
    collapse: () => setOpen(false),
    toggle: () => setOpen((o) => !o),
  }).current;
  const controller = useMemo<PanelControls>(
    () => ({ isCollapsed: !open, ...commands }),
    [open, commands]
  );

  return (
    <Region.Provider>
      <Box h="360px" width="100%" borderWidth="25" borderColor="neutral.6">
        <Splitter.Root
          collapsible
          collapsed={!open}
          onCollapsedChange={(c) => setOpen(!c)}
          defaultSize={30}
          minSize={20}
          collapsedSize={0}
        >
          <Splitter.Main>
            <Box p="400" bg="amber.3" h="100%">
              <Text>Main content</Text>
              <SidePanelConsumer />
            </Box>
          </Splitter.Main>
          <Splitter.Handle />
          <Splitter.Aside id="shell-aside">
            <Region.Outlet name="app-side-panel" value={controller} />
          </Splitter.Aside>
        </Splitter.Root>
      </Box>
    </Region.Provider>
  );
};

export const ShellOwnedSidePanel: Story = {
  render: () => <ShellSidePanel />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const aside = canvasElement.querySelector<HTMLElement>("#shell-aside")!;
    const asideWidth = () => parseFloat(aside.style.width);

    await step(
      "Content projects into the aside from the main pane",
      async () => {
        await expect(aside.contains(canvas.getByTestId("panel-content"))).toBe(
          true
        );
      }
    );

    await step(
      "Consumer opens the panel on mount via published expand()",
      async () => {
        await waitFor(() => expect(asideWidth()).toBeGreaterThan(0));
      }
    );

    await step("Published toggle() callback collapses the panel", async () => {
      await userEvent.click(canvas.getByTestId("toggle-panel"));
      await waitFor(() => expect(asideWidth()).toBe(0));
    });
  },
};
