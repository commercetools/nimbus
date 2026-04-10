import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScrollArea, Box, Text, useScrollArea } from "@commercetools/nimbus";
import { expect, userEvent, waitFor } from "storybook/test";

const meta: Meta<typeof ScrollArea> = {
  title: "Components/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const OverflowingContent = () =>
  Array.from({ length: 30 }, (_, i) => (
    <Text key={i} fontSize="sm">
      Line {i + 1}: Content that causes the container to overflow vertically.
    </Text>
  ));

const ShortContent = () => (
  <Text fontSize="sm">This content does not overflow.</Text>
);

const WideContent = () => (
  <Box whiteSpace="nowrap">
    {Array.from({ length: 5 }, (_, i) => (
      <Text key={i} fontSize="sm">
        {"Long horizontal content ".repeat(20)}
      </Text>
    ))}
  </Box>
);

// ============================================================
// Default: overflowing, vertical scrollbar, keyboard focusable
// ============================================================
export const Default: Story = {
  render: () => (
    <ScrollArea
      maxH="200px"
      w="400px"
      variant="always"
      ids={{ viewport: "test-viewport" }}
    >
      <OverflowingContent />
    </ScrollArea>
  ),
  play: async ({ canvasElement, step }) => {
    const doc = canvasElement.ownerDocument;

    await step("Viewport is keyboard-focusable when overflowing", async () => {
      await waitFor(() => {
        const viewport = doc.getElementById("test-viewport") as HTMLElement;
        expect(viewport).toBeTruthy();
        expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
      });
    });

    await step("Viewport has tabIndex when overflowing", async () => {
      const viewport = doc.getElementById("test-viewport") as HTMLElement;
      expect(viewport).toHaveAttribute("tabindex", "0");
    });

    await step("Detects vertical overflow via data attribute", async () => {
      const viewport = doc.getElementById("test-viewport");
      expect(viewport).toHaveAttribute("data-overflow-y");
    });

    await step("Scrollbar is visible", async () => {
      const scrollbar = canvasElement.querySelector('[data-part="scrollbar"]');
      expect(scrollbar).toBeTruthy();
      expect(scrollbar).toHaveAttribute("data-orientation", "vertical");
    });

    await step("Thumb is rendered inside scrollbar", async () => {
      const thumb = canvasElement.querySelector('[data-part="thumb"]');
      expect(thumb).toBeTruthy();
    });
  },
};

// ============================================================
// NonOverflowing: renders correctly with short content
// ============================================================
export const NonOverflowing: Story = {
  render: () => (
    <ScrollArea
      maxH="200px"
      w="400px"
      variant="always"
      ids={{ viewport: "test-viewport" }}
    >
      <ShortContent />
    </ScrollArea>
  ),
  play: async ({ canvasElement, step }) => {
    const doc = canvasElement.ownerDocument;

    await step("Component renders with short content", async () => {
      await waitFor(() => {
        const viewport = doc.getElementById("test-viewport") as HTMLElement;
        expect(viewport).toBeTruthy();
      });
    });

    await step(
      "Viewport does not have tabIndex when not overflowing",
      async () => {
        await waitFor(() => {
          const viewport = doc.getElementById("test-viewport") as HTMLElement;
          expect(viewport).not.toHaveAttribute("tabindex");
        });
      }
    );

    await step("All compound parts are present", async () => {
      expect(canvasElement.querySelector('[data-part="root"]')).toBeTruthy();
      expect(doc.getElementById("test-viewport")).toBeTruthy();
      expect(canvasElement.querySelector('[data-part="content"]')).toBeTruthy();
      expect(
        canvasElement.querySelector('[data-part="scrollbar"]')
      ).toBeTruthy();
    });
  },
};

// ============================================================
// Keyboard focus ring: Tab focuses viewport, ring appears on root
// ============================================================
export const KeyboardFocusRing: Story = {
  render: () => (
    <Box>
      <Text>Press Tab to focus the scroll area below:</Text>
      <ScrollArea
        maxH="200px"
        w="400px"
        mt="400"
        variant="always"
        ids={{ viewport: "test-viewport" }}
      >
        <OverflowingContent />
      </ScrollArea>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const doc = canvasElement.ownerDocument;

    await step("Viewport receives keyboard focus via Tab", async () => {
      await waitFor(() => {
        const viewport = doc.getElementById("test-viewport") as HTMLElement;
        expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
      });
      await userEvent.tab();
      const viewport = doc.getElementById("test-viewport");
      await waitFor(() => {
        expect(viewport).toHaveFocus();
      });
    });

    await step("Focus ring appears on root element", async () => {
      const root = canvasElement.querySelector('[data-part="root"]');
      const rootStyles = window.getComputedStyle(root!);
      expect(rootStyles.outlineColor).toBe("rgb(173, 186, 255)");
      expect(rootStyles.outlineStyle).toBe("solid");
    });
  },
};

// ============================================================
// Vertical only scrolling
// ============================================================
export const VerticalOnly: Story = {
  render: () => (
    <ScrollArea
      maxH="200px"
      w="400px"
      variant="always"
      ids={{ viewport: "test-viewport" }}
    >
      <OverflowingContent />
    </ScrollArea>
  ),
  play: async ({ canvasElement, step }) => {
    const doc = canvasElement.ownerDocument;

    await step("Detects vertical overflow", async () => {
      await waitFor(() => {
        const viewport = doc.getElementById("test-viewport");
        expect(viewport).toHaveAttribute("data-overflow-y");
      });
    });

    await step("Only vertical scrollbar rendered", async () => {
      const scrollbars = canvasElement.querySelectorAll(
        '[data-part="scrollbar"]'
      );
      expect(scrollbars).toHaveLength(1);
      expect(scrollbars[0]).toHaveAttribute("data-orientation", "vertical");
    });
  },
};

// ============================================================
// Horizontal only scrolling
// ============================================================
export const HorizontalOnly: Story = {
  render: () => (
    <ScrollArea
      maxW="400px"
      orientation="horizontal"
      variant="always"
      ids={{ viewport: "test-viewport" }}
    >
      <WideContent />
    </ScrollArea>
  ),
  play: async ({ canvasElement, step }) => {
    const doc = canvasElement.ownerDocument;

    await step("Detects horizontal overflow", async () => {
      await waitFor(() => {
        const viewport = doc.getElementById("test-viewport");
        expect(viewport).toHaveAttribute("data-overflow-x");
      });
    });

    await step("Only horizontal scrollbar rendered", async () => {
      const scrollbars = canvasElement.querySelectorAll(
        '[data-part="scrollbar"]'
      );
      expect(scrollbars).toHaveLength(1);
      expect(scrollbars[0]).toHaveAttribute("data-orientation", "horizontal");
    });
  },
};

// ============================================================
// Both axes scrolling
// ============================================================
export const BothAxes: Story = {
  render: () => (
    <ScrollArea maxH="200px" maxW="400px" orientation="both" variant="always">
      <WideContent />
    </ScrollArea>
  ),
  play: async ({ canvasElement, step }) => {
    await step("Both scrollbars rendered", async () => {
      await waitFor(() => {
        const scrollbars = canvasElement.querySelectorAll(
          '[data-part="scrollbar"]'
        );
        expect(scrollbars).toHaveLength(2);
      });
    });

    await step("Corner element rendered", async () => {
      const corner = canvasElement.querySelector('[data-part="corner"]');
      expect(corner).toBeTruthy();
    });
  },
};

// ============================================================
// Always visible scrollbar variant
// ============================================================
export const AlwaysVisible: Story = {
  render: () => (
    <ScrollArea maxH="200px" w="400px" variant="always">
      <OverflowingContent />
    </ScrollArea>
  ),
  play: async ({ canvasElement, step }) => {
    await step("Scrollbar has opacity 1 (always visible)", async () => {
      await waitFor(() => {
        const scrollbar = canvasElement.querySelector(
          '[data-part="scrollbar"]'
        ) as HTMLElement;
        expect(window.getComputedStyle(scrollbar).opacity).toBe("1");
      });
    });
  },
};

// ============================================================
// Custom styling: style props on root, content padding via Box
// ============================================================
export const CustomStyling: Story = {
  render: () => (
    <ScrollArea
      maxH="200px"
      w="400px"
      bg="neutral.2"
      borderRadius="300"
      variant="always"
    >
      <Box p="200">
        <OverflowingContent />
      </Box>
    </ScrollArea>
  ),
  play: async ({ canvasElement, step }) => {
    await step("Root accepts Chakra style props", async () => {
      await waitFor(() => {
        const root = canvasElement.querySelector(
          '[data-part="root"]'
        ) as HTMLElement;
        const styles = window.getComputedStyle(root);
        expect(styles.borderRadius).not.toBe("0px");
      });
    });
  },
};

// ============================================================
// Scrollbar sizes
// ============================================================
export const Sizes: Story = {
  render: () => (
    <Box display="flex" gap="400" flexWrap="wrap">
      {(["xs", "sm", "md", "lg"] as const).map((size) => (
        <Box key={size}>
          <Text fontSize="sm" mb="200" fontWeight="bold">
            size=&quot;{size}&quot;
          </Text>
          <ScrollArea maxH="150px" w="250px" size={size} variant="always">
            <OverflowingContent />
          </ScrollArea>
        </Box>
      ))}
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    await step("All size variants render", async () => {
      await waitFor(() => {
        const roots = canvasElement.querySelectorAll('[data-part="root"]');
        expect(roots).toHaveLength(4);
      });
    });

    await step("Scrollbar widths increase with size", async () => {
      const scrollbars = canvasElement.querySelectorAll(
        '[data-part="scrollbar"]'
      );
      const widths = Array.from(scrollbars).map((sb) =>
        parseFloat(window.getComputedStyle(sb).width)
      );
      for (let i = 1; i < widths.length; i++) {
        expect(widths[i]).toBeGreaterThan(widths[i - 1]);
      }
    });
  },
};

// ============================================================
// External control via useScrollArea + value prop
// ============================================================
export const ExternalControl: Story = {
  render: () => {
    const scrollArea = useScrollArea({
      ids: { viewport: "test-viewport" },
    });

    return (
      <Box>
        <ScrollArea maxH="200px" w="400px" variant="always" value={scrollArea}>
          <OverflowingContent />
        </ScrollArea>
      </Box>
    );
  },
  play: async ({ canvasElement, step }) => {
    const doc = canvasElement.ownerDocument;

    await step("Renders with RootProvider and detects overflow", async () => {
      await waitFor(() => {
        const viewport = doc.getElementById("test-viewport") as HTMLElement;
        expect(viewport).toBeTruthy();
        expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
      });
    });

    await step("Viewport has tabIndex when overflowing", async () => {
      const viewport = doc.getElementById("test-viewport") as HTMLElement;
      expect(viewport).toHaveAttribute("tabindex", "0");
    });
  },
};

// ============================================================
// Smoke test: all combinations render without errors
// ============================================================
export const SmokeTest: Story = {
  render: () => (
    <Box display="flex" gap="400" flexWrap="wrap">
      <Box>
        <Text fontSize="sm">Vertical overflow</Text>
        <ScrollArea maxH="80px" w="180px" variant="always">
          <OverflowingContent />
        </ScrollArea>
      </Box>

      <Box>
        <Text fontSize="sm">Horizontal overflow</Text>
        <ScrollArea maxW="180px" orientation="horizontal" variant="always">
          <WideContent />
        </ScrollArea>
      </Box>

      <Box>
        <Text fontSize="sm">Both axes</Text>
        <ScrollArea
          maxH="80px"
          maxW="180px"
          orientation="both"
          variant="always"
        >
          <WideContent />
        </ScrollArea>
      </Box>

      <Box>
        <Text fontSize="sm">Non-overflowing</Text>
        <ScrollArea maxH="200px" w="180px" variant="always">
          <ShortContent />
        </ScrollArea>
      </Box>

      <Box>
        <Text fontSize="sm">Hover variant</Text>
        <ScrollArea maxH="80px" w="180px" variant="hover">
          <OverflowingContent />
        </ScrollArea>
      </Box>

      <Box>
        <Text fontSize="sm">Custom styling</Text>
        <ScrollArea
          maxH="80px"
          w="180px"
          bg="neutral.2"
          borderRadius="300"
          variant="always"
        >
          <Box p="200">
            <OverflowingContent />
          </Box>
        </ScrollArea>
      </Box>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    await step("All variants render without errors", async () => {
      await waitFor(() => {
        const roots = canvasElement.querySelectorAll('[data-part="root"]');
        expect(roots).toHaveLength(6);
      });
    });
  },
};
