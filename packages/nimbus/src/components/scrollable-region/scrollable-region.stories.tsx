import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScrollableRegion, Box, Text, Heading } from "@commercetools/nimbus";
import { useScrollableRegion } from "@/hooks/use-scrollable-region/use-scrollable-region";
import { within, expect, userEvent, waitFor } from "storybook/test";

const meta = {
  title: "Components/ScrollableRegion",
  component: ScrollableRegion,
} satisfies Meta<typeof ScrollableRegion>;

export default meta;
type Story = StoryObj<typeof ScrollableRegion>;

// Helper to generate enough content to cause overflow
const OverflowingContent = () => (
  <>
    {Array.from({ length: 30 }, (_, i) => (
      <Text key={i}>
        Line {i + 1}: Content that causes the container to overflow vertically.
      </Text>
    ))}
  </>
);

const ShortContent = () => <Text>This content does not overflow.</Text>;

// ============================================================
// Default: overflowing with tabIndex, role, aria-label
// ============================================================
export const Default: Story = {
  render: () => (
    <ScrollableRegion aria-label="Log output" style={{ height: "200px" }}>
      <OverflowingContent />
    </ScrollableRegion>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Has tabIndex=0 when overflowing", async () => {
      await waitFor(() => {
        const region = canvas.getByRole("group", { name: "Log output" });
        expect(region).toHaveAttribute("tabindex", "0");
      });
    });

    await step("Has role=group (default) when overflowing", async () => {
      const region = canvas.getByRole("group", { name: "Log output" });
      await expect(region).toHaveAttribute("role", "group");
    });

    await step("Has aria-label when overflowing", async () => {
      const region = canvas.getByRole("group", { name: "Log output" });
      await expect(region).toHaveAttribute("aria-label", "Log output");
    });

    await step("Has overflow style", async () => {
      const region = canvas.getByRole("group", { name: "Log output" });
      await expect(region.style.overflow).toBe("auto");
    });
  },
};

// ============================================================
// NonOverflowing: has role/aria-label but no tabIndex
// ============================================================
export const NonOverflowing: Story = {
  render: () => (
    <ScrollableRegion aria-label="Short content" style={{ height: "200px" }}>
      <ShortContent />
    </ScrollableRegion>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const container = canvas.getByRole("group", { name: "Short content" });

    await step("Does not have tabIndex when not overflowing", async () => {
      await expect(container).not.toHaveAttribute("tabindex");
    });

    await step("Still has role when not overflowing", async () => {
      await expect(container).toHaveAttribute("role", "group");
    });

    await step("Still has aria-label when not overflowing", async () => {
      await expect(container).toHaveAttribute("aria-label", "Short content");
    });

    await step("Renders as a div", async () => {
      await expect(container.tagName).toBe("DIV");
    });
  },
};

// ============================================================
// Role region: applies role="region" via ARIA
// ============================================================
export const RoleRegion: Story = {
  render: () => (
    <ScrollableRegion
      role="region"
      aria-label="Main content area"
      style={{ height: "200px" }}
    >
      <OverflowingContent />
    </ScrollableRegion>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Has role=region when overflowing with role=region",
      async () => {
        await waitFor(() => {
          const region = canvas.getByRole("region", {
            name: "Main content area",
          });
          expect(region).toBeInTheDocument();
        });
      }
    );

    await step("Has aria-label", async () => {
      const region = canvas.getByRole("region", {
        name: "Main content area",
      });
      await expect(region).toHaveAttribute("aria-label", "Main content area");
    });
  },
};

// ============================================================
// Keyboard focus ring
// ============================================================
export const KeyboardFocusRing: Story = {
  render: () => (
    <Box>
      <Text>Press Tab to focus the scrollable region below:</Text>
      <ScrollableRegion
        aria-label="Focusable region"
        style={{ height: "200px", marginTop: "16px" }}
      >
        <OverflowingContent />
      </ScrollableRegion>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Region becomes focusable when overflowing", async () => {
      await waitFor(() => {
        const region = canvas.getByRole("group", {
          name: "Focusable region",
        });
        expect(region).toHaveAttribute("tabindex", "0");
      });
    });

    await step("Can receive keyboard focus via Tab", async () => {
      await userEvent.tab();
      const region = canvas.getByRole("group", { name: "Focusable region" });
      await waitFor(() => {
        expect(region).toHaveFocus();
      });
    });
  },
};

// ============================================================
// Custom scrollable: scroll
// ============================================================
export const OverflowScroll: Story = {
  render: () => (
    <ScrollableRegion
      aria-label="Always-scrollbar region"
      scrollable="scroll"
      style={{ height: "200px" }}
    >
      <OverflowingContent />
    </ScrollableRegion>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Has overflow: scroll", async () => {
      await waitFor(() => {
        const region = canvas.getByRole("group", {
          name: "Always-scrollbar region",
        });
        expect(region.style.overflow).toBe("scroll");
      });
    });
  },
};

// ============================================================
// Vertical-only overflow
// ============================================================
export const VerticalOnly: Story = {
  render: () => (
    <ScrollableRegion
      aria-label="Vertical scroll"
      scrollable="y-auto"
      style={{ height: "200px" }}
    >
      <OverflowingContent />
    </ScrollableRegion>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Has overflowY: auto, overflowX: hidden", async () => {
      await waitFor(() => {
        const region = canvas.getByRole("group", {
          name: "Vertical scroll",
        });
        expect(region.style.overflowY).toBe("auto");
        expect(region.style.overflowX).toBe("hidden");
      });
    });

    await step("Detects vertical overflow", async () => {
      const region = canvas.getByRole("group", { name: "Vertical scroll" });
      await expect(region).toHaveAttribute("tabindex", "0");
    });
  },
};

// ============================================================
// Horizontal-only overflow
// ============================================================
const WideContent = () => (
  <Box style={{ whiteSpace: "nowrap" }}>
    {Array.from({ length: 5 }, (_, i) => (
      <Text key={i}>{"Long horizontal content ".repeat(20)}</Text>
    ))}
  </Box>
);

export const HorizontalOnly: Story = {
  render: () => (
    <ScrollableRegion
      aria-label="Horizontal scroll"
      scrollable="x-auto"
      style={{ width: "300px" }}
    >
      <WideContent />
    </ScrollableRegion>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Has overflowX: auto, overflowY: hidden", async () => {
      await waitFor(() => {
        const region = canvas.getByRole("group", {
          name: "Horizontal scroll",
        });
        expect(region.style.overflowX).toBe("auto");
        expect(region.style.overflowY).toBe("hidden");
      });
    });

    await step("Detects horizontal overflow", async () => {
      const region = canvas.getByRole("group", {
        name: "Horizontal scroll",
      });
      await expect(region).toHaveAttribute("tabindex", "0");
    });
  },
};

// ============================================================
// Hook standalone usage
// ============================================================
const HookDemo = () => {
  const { ref, isOverflowing, containerProps } = useScrollableRegion({
    "aria-label": "Hook demo",
  });

  return (
    <div>
      <Text>{isOverflowing ? "Overflowing" : "Not overflowing"}</Text>
      <div
        ref={ref}
        {...containerProps}
        style={{ ...containerProps.style, height: "150px" }}
      >
        <OverflowingContent />
      </div>
    </div>
  );
};

export const HookUsage: Story = {
  render: () => <HookDemo />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Hook detects overflow", async () => {
      await waitFor(() => {
        expect(canvas.getByText("Overflowing")).toBeInTheDocument();
      });
    });

    await step("Hook provides tabIndex on overflowing element", async () => {
      const container = canvas.getByRole("group", { name: "Hook demo" });
      await expect(container).toHaveAttribute("tabindex", "0");
    });

    await step("Hook provides role on overflowing element", async () => {
      const container = canvas.getByRole("group", { name: "Hook demo" });
      await expect(container).toHaveAttribute("role", "group");
    });
  },
};

// ============================================================
// With aria-labelledby
// ============================================================
export const WithAriaLabelledBy: Story = {
  render: () => (
    <Box>
      <Heading id="log-heading">Application Logs</Heading>
      <ScrollableRegion
        aria-labelledby="log-heading"
        style={{ height: "200px" }}
      >
        <OverflowingContent />
      </ScrollableRegion>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Has aria-labelledby when overflowing", async () => {
      await waitFor(() => {
        const region = canvas.getByRole("group", {
          name: "Application Logs",
        });
        expect(region).toHaveAttribute("aria-labelledby", "log-heading");
      });
    });
  },
};

// ============================================================
// SmokeTest: covers role × scrollable prop matrix
// ============================================================
export const SmokeTest: Story = {
  render: () => (
    <Box display="flex" gap="16px" flexWrap="wrap">
      <Box>
        <Text>role=group, scrollable=auto</Text>
        <ScrollableRegion
          aria-label="Group auto"
          style={{ height: "100px", width: "200px" }}
        >
          <OverflowingContent />
        </ScrollableRegion>
      </Box>
      <Box>
        <Text>role=group, scrollable=scroll</Text>
        <ScrollableRegion
          aria-label="Group scroll"
          scrollable="scroll"
          style={{ height: "100px", width: "200px" }}
        >
          <OverflowingContent />
        </ScrollableRegion>
      </Box>
      <Box>
        <Text>role=region, scrollable=auto</Text>
        <ScrollableRegion
          role="region"
          aria-label="Region auto"
          style={{ height: "100px", width: "200px" }}
        >
          <OverflowingContent />
        </ScrollableRegion>
      </Box>
      <Box>
        <Text>role=region, scrollable=scroll</Text>
        <ScrollableRegion
          role="region"
          aria-label="Region scroll"
          scrollable="scroll"
          style={{ height: "100px", width: "200px" }}
        >
          <OverflowingContent />
        </ScrollableRegion>
      </Box>
      <Box>
        <Text>aria-labelledby</Text>
        <Heading id="smoke-heading" fontSize="sm">
          Labelled Region
        </Heading>
        <ScrollableRegion
          aria-labelledby="smoke-heading"
          style={{ height: "100px", width: "200px" }}
        >
          <OverflowingContent />
        </ScrollableRegion>
      </Box>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("All overflowing variants have tabIndex=0", async () => {
      await waitFor(() => {
        const groupAuto = canvas.getByRole("group", { name: "Group auto" });
        expect(groupAuto).toHaveAttribute("tabindex", "0");
      });

      const groupScroll = canvas.getByRole("group", { name: "Group scroll" });
      await expect(groupScroll).toHaveAttribute("tabindex", "0");

      const regionAuto = canvas.getByRole("region", { name: "Region auto" });
      await expect(regionAuto).toHaveAttribute("tabindex", "0");

      const regionScroll = canvas.getByRole("region", {
        name: "Region scroll",
      });
      await expect(regionScroll).toHaveAttribute("tabindex", "0");

      const labelled = canvas.getByRole("group", {
        name: "Labelled Region",
      });
      await expect(labelled).toHaveAttribute("tabindex", "0");
    });

    await step("Region variants have role=region", async () => {
      const regionAuto = canvas.getByRole("region", { name: "Region auto" });
      await expect(regionAuto).toHaveAttribute("role", "region");

      const regionScroll = canvas.getByRole("region", {
        name: "Region scroll",
      });
      await expect(regionScroll).toHaveAttribute("role", "region");
    });

    await step("Group variants have role=group", async () => {
      const groupAuto = canvas.getByRole("group", { name: "Group auto" });
      await expect(groupAuto).toHaveAttribute("role", "group");
    });
  },
};
