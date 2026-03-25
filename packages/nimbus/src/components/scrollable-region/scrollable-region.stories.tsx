import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScrollableRegion, Box, Text, Heading } from "@commercetools/nimbus";
import { within, expect, userEvent, waitFor } from "storybook/test";

const meta: Meta<typeof ScrollableRegion> = {
  title: "Components/ScrollableRegion",
  component: ScrollableRegion,
  tags: ["autodocs"],
};

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
    <ScrollableRegion aria-label="Log output" h="200px">
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
    <ScrollableRegion aria-label="Short content" h="200px">
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
    <ScrollableRegion role="region" aria-label="Main content area" h="200px">
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

    await step("Renders as <section> for role=region", async () => {
      const region = canvas.getByRole("region", {
        name: "Main content area",
      });
      await expect(region.tagName).toBe("SECTION");
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
      <ScrollableRegion aria-label="Focusable region" h="200px" mt="400">
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
      h="200px"
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
      h="200px"
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
  <Box whiteSpace="nowrap">
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
      w="300px"
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
// With aria-labelledby
// ============================================================
export const WithAriaLabelledBy: Story = {
  render: () => (
    <Box>
      <Heading id="log-heading">Application Logs</Heading>
      <ScrollableRegion aria-labelledby="log-heading" h="200px">
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
// Box style props
// ============================================================
export const WithBoxProps: Story = {
  render: () => (
    <ScrollableRegion
      aria-label="Styled region"
      p="400"
      bg="neutral.2"
      maxH="200px"
      borderRadius="md"
    >
      <OverflowingContent />
    </ScrollableRegion>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Accepts Chakra style props", async () => {
      await waitFor(() => {
        const region = canvas.getByRole("group", {
          name: "Styled region",
        });
        expect(region).toHaveAttribute("tabindex", "0");
      });
    });

    await step("Renders as a div (default for role=group)", async () => {
      const region = canvas.getByRole("group", { name: "Styled region" });
      await expect(region.tagName).toBe("DIV");
    });
  },
};

// ============================================================
// SmokeTest: renders all prop combinations without errors
// ============================================================
export const SmokeTest: Story = {
  render: () => (
    <Box display="flex" gap="400" flexWrap="wrap">
      {/* role × scrollable matrix */}
      <Box>
        <Text fontSize="sm">group + auto (default)</Text>
        <ScrollableRegion aria-label="group auto" h="80px" w="180px">
          <OverflowingContent />
        </ScrollableRegion>
      </Box>
      <Box>
        <Text fontSize="sm">group + scroll</Text>
        <ScrollableRegion
          aria-label="group scroll"
          scrollable="scroll"
          h="80px"
          w="180px"
        >
          <OverflowingContent />
        </ScrollableRegion>
      </Box>
      <Box>
        <Text fontSize="sm">group + y-auto</Text>
        <ScrollableRegion
          aria-label="group y-auto"
          scrollable="y-auto"
          h="80px"
          w="180px"
        >
          <OverflowingContent />
        </ScrollableRegion>
      </Box>
      <Box>
        <Text fontSize="sm">group + x-auto</Text>
        <ScrollableRegion
          aria-label="group x-auto"
          scrollable="x-auto"
          h="80px"
          w="180px"
        >
          <WideContent />
        </ScrollableRegion>
      </Box>
      <Box>
        <Text fontSize="sm">group + none</Text>
        <ScrollableRegion
          aria-label="group none"
          scrollable="none"
          h="80px"
          w="180px"
        >
          <OverflowingContent />
        </ScrollableRegion>
      </Box>
      <Box>
        <Text fontSize="sm">region + auto</Text>
        <ScrollableRegion
          role="region"
          aria-label="region auto"
          h="80px"
          w="180px"
        >
          <OverflowingContent />
        </ScrollableRegion>
      </Box>
      <Box>
        <Text fontSize="sm">region + scroll</Text>
        <ScrollableRegion
          role="region"
          aria-label="region scroll"
          scrollable="scroll"
          h="80px"
          w="180px"
        >
          <OverflowingContent />
        </ScrollableRegion>
      </Box>

      {/* aria-labelledby */}
      <Box>
        <Text fontSize="sm">aria-labelledby</Text>
        <Heading id="smoke-heading" fontSize="sm">
          Labelled
        </Heading>
        <ScrollableRegion aria-labelledby="smoke-heading" h="80px" w="180px">
          <OverflowingContent />
        </ScrollableRegion>
      </Box>

      {/* non-overflowing */}
      <Box>
        <Text fontSize="sm">non-overflowing</Text>
        <ScrollableRegion aria-label="no overflow" h="80px" w="180px">
          <ShortContent />
        </ScrollableRegion>
      </Box>

      {/* Box style props */}
      <Box>
        <Text fontSize="sm">with style props</Text>
        <ScrollableRegion
          aria-label="styled"
          h="80px"
          w="180px"
          p="200"
          bg="neutral.2"
          borderRadius="sm"
        >
          <OverflowingContent />
        </ScrollableRegion>
      </Box>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("All variants render without errors", async () => {
      await waitFor(() => {
        expect(
          canvas.getByRole("group", { name: "group auto" })
        ).toBeInTheDocument();
      });
    });
  },
};
