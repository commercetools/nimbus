import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box, Stack } from "@commercetools/nimbus";
import { within, expect, waitFor } from "storybook/test";
import { Region } from "./region";
import { useRegion } from "./use-region";

/**
 * `Region` is a headless, component-agnostic primitive for named regions: a
 * `Region.Provider` scope, `Region.Outlet`s as named render targets, and
 * `useRegion(name)` to project content into them. The `Splitter` consumes it,
 * but it stands alone — these stories exercise it without any Splitter.
 */
const meta: Meta<typeof Region.Provider> = {
  title: "Components/Region",
  component: Region.Provider,
  parameters: { layout: "padded" },
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = canvasElement.querySelector<HTMLElement>("#sidebar-host")!;
    const projected = canvas.getByTestId("projected");
    // Authored under the content area, painted inside the sidebar outlet.
    await expect(host.contains(projected)).toBe(true);
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Once the outlet mounts, useRegion resolves its node and content paints in.
    await waitFor(() =>
      expect(canvas.getByTestId("node-status").textContent).toBe(
        "outlet-present"
      )
    );
    const outlet = canvas.getByTestId("slot-outlet");
    await expect(outlet.contains(canvas.getByTestId("toggle-content"))).toBe(
      true
    );
  },
};
