import React from "react";
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
      ids={{ viewport: "test-viewport-default" }}
    >
      <OverflowingContent />
    </ScrollArea>
  ),
  play: async ({ canvasElement, step }) => {
    const doc = canvasElement.ownerDocument;

    await step("Viewport is keyboard-focusable when overflowing", async () => {
      await waitFor(() => {
        const viewport = doc.getElementById(
          "test-viewport-default"
        ) as HTMLElement;
        expect(viewport).toBeTruthy();
        expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
      });
    });

    await step("Viewport has tabIndex when overflowing", async () => {
      const viewport = doc.getElementById(
        "test-viewport-default"
      ) as HTMLElement;
      expect(viewport).toHaveAttribute("tabindex", "0");
    });

    await step("Detects vertical overflow via data attribute", async () => {
      const viewport = doc.getElementById("test-viewport-default");
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
      ids={{ viewport: "test-viewport-no-overflow" }}
    >
      <ShortContent />
    </ScrollArea>
  ),
  play: async ({ canvasElement, step }) => {
    const doc = canvasElement.ownerDocument;

    await step("Component renders with short content", async () => {
      await waitFor(() => {
        const viewport = doc.getElementById(
          "test-viewport-no-overflow"
        ) as HTMLElement;
        expect(viewport).toBeTruthy();
      });
    });

    await step(
      "Viewport does not have tabIndex when not overflowing",
      async () => {
        await waitFor(() => {
          const viewport = doc.getElementById(
            "test-viewport-no-overflow"
          ) as HTMLElement;
          expect(viewport).not.toHaveAttribute("tabindex");
        });
      }
    );

    await step("All compound parts are present", async () => {
      expect(canvasElement.querySelector('[data-part="root"]')).toBeTruthy();
      expect(doc.getElementById("test-viewport-no-overflow")).toBeTruthy();
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
        ids={{ viewport: "test-viewport-kbd-focus" }}
      >
        <OverflowingContent />
      </ScrollArea>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const doc = canvasElement.ownerDocument;

    await step("Viewport receives keyboard focus via Tab", async () => {
      await waitFor(() => {
        const viewport = doc.getElementById(
          "test-viewport-kbd-focus"
        ) as HTMLElement;
        expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
      });
      await userEvent.tab();
      const viewport = doc.getElementById("test-viewport-kbd-focus");
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
      orientation="vertical"
      ids={{ viewport: "test-viewport-vert-only" }}
    >
      <Box w="100%">
        {Array.from({ length: 6 }, (_, i) => (
          <Text key={i} fontSize="sm" whiteSpace="nowrap">
            Row {i + 1}:{" "}
            {"intentionally-wider-than-viewport-content ".repeat(3)}
          </Text>
        ))}
      </Box>
    </ScrollArea>
  ),
  play: async ({ canvasElement, step }) => {
    const doc = canvasElement.ownerDocument;

    await step("Detects vertical overflow", async () => {
      await waitFor(() => {
        const viewport = doc.getElementById("test-viewport-vert-only");
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

    await step("Horizontal overflow is actively suppressed", async () => {
      const viewport = doc.getElementById(
        "test-viewport-vert-only"
      ) as HTMLElement;
      // Viewport clips the x-axis so overflowing children can't be scrolled to.
      expect(window.getComputedStyle(viewport).overflowX).toBe("hidden");
      // Content wrapper is sized to the viewport, not to its widest child.
      const content = viewport.querySelector(
        '[data-part="content"]'
      ) as HTMLElement;
      expect(content.clientWidth).toBe(viewport.clientWidth);
    });
  },
};

// ============================================================
// Full-width cards with one deliberately over-sized child, rendered side by
// side under both the default `"both"` orientation and explicit `"vertical"`
// orientation. Demonstrates how each handles the same content:
// - `"both"`: the wide card overflows and the horizontal scrollbar surfaces.
// - `"vertical"`: the wide card is clipped at the viewport, no horizontal
//   scrollbar, and `w=100%` siblings still stay at viewport width.
// ============================================================
const VerticalWithHorizontalOverflowCards = () =>
  Array.from({ length: 6 }, (_, i) => {
    const setting =
      i === 0 ? 'w="150%"' : i === 1 ? "no width prop" : 'w="100%"';
    const headline =
      i === 0
        ? "Intentionally wider than the viewport to demonstrate a child that legitimately exceeds the scroll area width"
        : i === 1
          ? "Intrinsic auto width — block fills the parent content box the same way an explicit 100% does, without setting any size"
          : "Explicit full width — the common pattern for list rows that should always match the scroll area's visible width";
    const outcome =
      i === 0
        ? "expected: overflows, horizontal scrollbar surfaces under orientation=both"
        : i === 1
          ? "expected: fills viewport, stays aligned with w=100% siblings"
          : "expected: fills viewport regardless of any over-sized sibling";
    return (
      <Box
        key={i}
        w={i === 0 ? "150%" : i === 1 ? undefined : "100%"}
        p="300"
        mb="200"
        border="solid-25"
        borderColor="neutral.6"
        borderRadius="200"
        bg="neutral.2"
      >
        <Text fontSize="xs" color="neutral.11">
          {setting}
        </Text>
        <Text fontSize="sm" fontWeight="bold" truncate>
          {headline}
        </Text>
        <Text fontSize="xs" color="neutral.11">
          {outcome}
        </Text>
      </Box>
    );
  });

export const VerticalWithHorizontalOverflow: Story = {
  render: () => (
    <Box display="flex" gap="600" alignItems="flex-start">
      <Box w="320px">
        <Text fontSize="sm" fontWeight="bold" mb="100">
          orientation=&quot;both&quot; (default)
        </Text>
        <Text fontSize="xs" color="neutral.11" mb="300">
          The first card is w=150%, so it overflows the viewport. A horizontal
          scrollbar appears and the card is scrollable. Other w=100% siblings
          stay at viewport width.
        </Text>
        <ScrollArea
          maxH="300px"
          w="320px"
          ids={{ viewport: "test-viewport-both" }}
        >
          <VerticalWithHorizontalOverflowCards />
        </ScrollArea>
      </Box>
      <Box w="320px">
        <Text fontSize="sm" fontWeight="bold" mb="100">
          orientation=&quot;vertical&quot;
        </Text>
        <Text fontSize="xs" color="neutral.11" mb="300">
          Same content, but the horizontal axis is actively clipped. The wide
          first card is cut at the viewport edge, no horizontal scrollbar
          appears, and the vertical scroll still works.
        </Text>
        <ScrollArea
          maxH="300px"
          w="320px"
          orientation="vertical"
          ids={{ viewport: "test-viewport-vertical" }}
        >
          <VerticalWithHorizontalOverflowCards />
        </ScrollArea>
      </Box>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const doc = canvasElement.ownerDocument;

    const getInstance = (viewportId: string) => {
      const viewport = doc.getElementById(viewportId) as HTMLElement;
      const root = viewport.closest('[data-part="root"]') as HTMLElement;
      const content = viewport.querySelector(
        '[data-part="content"]'
      ) as HTMLElement;
      const cards = Array.from(
        content.querySelectorAll(":scope > div")
      ) as HTMLElement[];
      const scrollbars = Array.from(
        root.querySelectorAll('[data-part="scrollbar"]')
      ) as HTMLElement[];
      const visibleHorizontalScrollbar = scrollbars.find(
        (sb) =>
          sb.getAttribute("data-orientation") === "horizontal" &&
          window.getComputedStyle(sb).display !== "none"
      );
      return { viewport, content, cards, visibleHorizontalScrollbar };
    };

    await step(
      "Both instances pin their content wrapper to viewport width",
      async () => {
        await waitFor(() => {
          for (const id of ["test-viewport-both", "test-viewport-vertical"]) {
            const { viewport, content } = getInstance(id);
            expect(content.clientWidth).toBe(viewport.clientWidth);
          }
        });
      }
    );

    await step(
      "Both instances keep w=100% siblings at viewport width",
      async () => {
        for (const id of ["test-viewport-both", "test-viewport-vertical"]) {
          const { viewport, cards } = getInstance(id);
          cards.slice(1).forEach((card) => {
            expect(card.offsetWidth).toBe(viewport.clientWidth);
          });
        }
      }
    );

    await step(
      "orientation=both: wide card overflows and horizontal scrollbar is shown",
      async () => {
        const { viewport, cards, visibleHorizontalScrollbar } =
          getInstance("test-viewport-both");
        expect(cards[0].offsetWidth).toBeGreaterThan(viewport.clientWidth);
        expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth);
        expect(visibleHorizontalScrollbar).toBeTruthy();
      }
    );

    await step(
      "orientation=vertical: wide card is clipped and no horizontal scrollbar is shown",
      async () => {
        const { viewport, visibleHorizontalScrollbar } = getInstance(
          "test-viewport-vertical"
        );
        expect(window.getComputedStyle(viewport).overflowX).toBe("hidden");
        expect(visibleHorizontalScrollbar).toBeUndefined();
      }
    );
  },
};

// ============================================================
// Horizontal counterpart of VerticalWithHorizontalOverflow. Row of cards
// rendered under both the default `"both"` orientation and explicit
// `"horizontal"` orientation, covering intrinsic-height, over-sized, and
// full-height children.
// ============================================================
const HorizontalWithVerticalOverflowCards = () =>
  Array.from({ length: 6 }, (_, i) => {
    const setting =
      i === 0 ? 'h="260px"' : i === 1 ? "no height prop" : 'h="100%"';
    const headline =
      i === 0
        ? "Intentionally taller than the viewport to demonstrate a child that legitimately exceeds the scroll area height"
        : i === 1
          ? "Intrinsic auto height — block sizes to its own content, shorter than the viewport"
          : "Explicit full height — the common pattern for row items that should always match the scroll area's visible height";
    const outcome =
      i === 0
        ? "expected: overflows, vertical scrollbar surfaces under orientation=both"
        : i === 1
          ? "expected: shorter than viewport, aligned to the top"
          : "expected: fills viewport height regardless of any over-sized sibling";
    return (
      <Box
        key={i}
        h={i === 0 ? "260px" : i === 1 ? undefined : "100%"}
        w="220px"
        flexShrink="0"
        alignSelf="flex-start"
        p="300"
        border="solid-25"
        borderColor="neutral.6"
        borderRadius="200"
        bg="neutral.2"
      >
        <Text fontSize="xs" color="neutral.11">
          {setting}
        </Text>
        <Text fontSize="sm" fontWeight="bold" truncate>
          {headline}
        </Text>
        <Text fontSize="xs" color="neutral.11">
          {outcome}
        </Text>
      </Box>
    );
  });

export const HorizontalWithVerticalOverflow: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap="600">
      <Box>
        <Text fontSize="sm" fontWeight="bold" mb="100">
          orientation=&quot;both&quot; (default)
        </Text>
        <Text fontSize="xs" color="neutral.11" mb="300">
          The first item is h=260px, so it overflows the viewport. A vertical
          scrollbar appears and the item is scrollable. Other h=100% siblings
          stay at viewport height.
        </Text>
        <ScrollArea
          h="200px"
          w="500px"
          ids={{ viewport: "test-viewport-h-both" }}
        >
          <Box display="flex" gap="200" h="200px">
            <HorizontalWithVerticalOverflowCards />
          </Box>
        </ScrollArea>
      </Box>
      <Box>
        <Text fontSize="sm" fontWeight="bold" mb="100">
          orientation=&quot;horizontal&quot;
        </Text>
        <Text fontSize="xs" color="neutral.11" mb="300">
          Same content, but the vertical axis is actively clipped. The tall
          first item is cut at the viewport edge, no vertical scrollbar appears,
          and the horizontal scroll still works.
        </Text>
        <ScrollArea
          h="200px"
          w="500px"
          orientation="horizontal"
          ids={{ viewport: "test-viewport-h-horizontal" }}
        >
          <Box display="flex" gap="200" h="200px">
            <HorizontalWithVerticalOverflowCards />
          </Box>
        </ScrollArea>
      </Box>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const doc = canvasElement.ownerDocument;

    const getInstance = (viewportId: string) => {
      const viewport = doc.getElementById(viewportId) as HTMLElement;
      const root = viewport.closest('[data-part="root"]') as HTMLElement;
      const content = viewport.querySelector(
        '[data-part="content"]'
      ) as HTMLElement;
      const row = content.querySelector(":scope > div") as HTMLElement;
      const cards = Array.from(
        row.querySelectorAll(":scope > div")
      ) as HTMLElement[];
      const scrollbars = Array.from(
        root.querySelectorAll('[data-part="scrollbar"]')
      ) as HTMLElement[];
      const visibleVerticalScrollbar = scrollbars.find(
        (sb) =>
          sb.getAttribute("data-orientation") === "vertical" &&
          window.getComputedStyle(sb).display !== "none"
      );
      return { viewport, cards, visibleVerticalScrollbar };
    };

    await step(
      "Both instances keep h=100% siblings at viewport height",
      async () => {
        await waitFor(() => {
          for (const id of [
            "test-viewport-h-both",
            "test-viewport-h-horizontal",
          ]) {
            const { viewport, cards } = getInstance(id);
            cards.slice(2).forEach((card) => {
              expect(card.offsetHeight).toBe(viewport.clientHeight);
            });
          }
        });
      }
    );

    await step(
      "orientation=both: tall card overflows and vertical scrollbar is shown",
      async () => {
        const { viewport, cards, visibleVerticalScrollbar } = getInstance(
          "test-viewport-h-both"
        );
        expect(cards[0].offsetHeight).toBeGreaterThan(viewport.clientHeight);
        expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
        expect(visibleVerticalScrollbar).toBeTruthy();
      }
    );

    await step(
      "orientation=horizontal: tall card is clipped and no vertical scrollbar is shown",
      async () => {
        const { viewport, visibleVerticalScrollbar } = getInstance(
          "test-viewport-h-horizontal"
        );
        expect(window.getComputedStyle(viewport).overflowY).toBe("hidden");
        expect(visibleVerticalScrollbar).toBeUndefined();
      }
    );
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
      ids={{ viewport: "test-viewport-horiz-only" }}
    >
      <WideContent />
    </ScrollArea>
  ),
  play: async ({ canvasElement, step }) => {
    const doc = canvasElement.ownerDocument;

    await step("Detects horizontal overflow", async () => {
      await waitFor(() => {
        const viewport = doc.getElementById("test-viewport-horiz-only");
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
    <ScrollArea maxH="200px" maxW="400px" orientation="both">
      <OverflowingContent />
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
    <Box display="flex" gap="600" flexWrap="wrap">
      <Box>
        <Text fontSize="sm" mb="200" fontWeight="bold">
          Vertical
        </Text>
        <ScrollArea maxH="200px" w="400px" variant="always">
          <OverflowingContent />
        </ScrollArea>
      </Box>
      <Box>
        <Text fontSize="sm" mb="200" fontWeight="bold">
          Horizontal
        </Text>
        <ScrollArea maxW="400px" orientation="horizontal" variant="always">
          <WideContent />
        </ScrollArea>
      </Box>
      <Box>
        <Text fontSize="sm" mb="200" fontWeight="bold">
          Both axes
        </Text>
        <ScrollArea
          maxH="200px"
          maxW="400px"
          orientation="both"
          variant="always"
        >
          <OverflowingContent />
          <WideContent />
        </ScrollArea>
      </Box>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const roots = () =>
      Array.from(canvasElement.querySelectorAll('[data-part="root"]'));

    await step("All three scroll areas render", async () => {
      await waitFor(() => {
        expect(roots()).toHaveLength(3);
      });
    });

    await step(
      "Vertical: scrollbar has opacity 1 and gutter reserves space",
      async () => {
        const root = roots()[0];
        const scrollbar = root.querySelector(
          '[data-part="scrollbar"]'
        ) as HTMLElement;
        const viewport = root.querySelector(
          '[data-part="viewport"]'
        ) as HTMLElement;
        expect(window.getComputedStyle(scrollbar).opacity).toBe("1");
        const vpRect = viewport.getBoundingClientRect();
        const sbRect = scrollbar.getBoundingClientRect();
        expect(vpRect.right).toBeLessThanOrEqual(sbRect.left);
      }
    );

    await step(
      "Horizontal: scrollbar has opacity 1 and gutter reserves space",
      async () => {
        const root = roots()[1];
        const scrollbar = root.querySelector(
          '[data-part="scrollbar"]'
        ) as HTMLElement;
        const viewport = root.querySelector(
          '[data-part="viewport"]'
        ) as HTMLElement;
        expect(window.getComputedStyle(scrollbar).opacity).toBe("1");
        const vpRect = viewport.getBoundingClientRect();
        const sbRect = scrollbar.getBoundingClientRect();
        expect(vpRect.bottom).toBeLessThanOrEqual(sbRect.top);
      }
    );
  },
};

// ============================================================
// Custom styling: style props on root, content padding via Box
// ============================================================
export const CustomStyling: Story = {
  render: () => (
    <ScrollArea maxH="200px" w="400px" bg="neutral.2" borderRadius="300">
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
          <ScrollArea maxH="150px" w="250px" size={size} orientation="vertical">
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
        <ScrollArea maxH="200px" w="400px" value={scrollArea}>
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
// Sticky content in panel: always vs hover with sticky row
// ============================================================
const HeaderFooterLayout = ({
  variant,
  label,
}: {
  variant: "always" | "hover";
  label: string;
}) => (
  <Box w="400px" border="solid-25" borderColor="neutral.6" borderRadius="200">
    <Box
      p="200"
      bg="neutral.3"
      borderBottom="solid-25"
      borderColor="neutral.6"
      display="flex"
      justifyContent="space-between"
    >
      <Text fontWeight="bold" fontSize="sm">
        Header — {label}
      </Text>
      <Text fontSize="sm" color="neutral.11">
        Action
      </Text>
    </Box>
    <ScrollArea maxH="200px" variant={variant}>
      {Array.from({ length: 20 }, (_, i) => (
        <React.Fragment key={i}>
          {i === 2 && (
            <Box
              position="sticky"
              top="0"
              bg="primary.2"
              p="200"
              borderBottom="solid-25"
              borderColor="primary.7"
              display="flex"
              justifyContent="space-between"
              zIndex="1"
            >
              <Text fontWeight="bold" fontSize="sm">
                Sticky row
              </Text>
            </Box>
          )}
          <Box
            p="200"
            borderBottom="solid-25"
            borderColor="neutral.4"
            display="flex"
            justifyContent="space-between"
          >
            <Text fontSize="sm">Row {i + 1}</Text>
            <Text fontSize="sm" color="neutral.11">
              Detail
            </Text>
          </Box>
        </React.Fragment>
      ))}
    </ScrollArea>
    <Box
      p="200"
      bg="neutral.3"
      borderTop="solid-25"
      borderColor="neutral.6"
      display="flex"
      justifyContent="space-between"
    >
      <Text fontSize="sm">Footer</Text>
      <Text fontSize="sm" color="neutral.11">
        20 items
      </Text>
    </Box>
  </Box>
);

export const StickyContentInPanel: Story = {
  render: () => (
    <Box display="flex" gap="600" flexWrap="wrap">
      <HeaderFooterLayout variant="always" label="always" />
      <HeaderFooterLayout variant="hover" label="hover" />
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    await step("Both layouts render", async () => {
      await waitFor(() => {
        const roots = canvasElement.querySelectorAll('[data-part="root"]');
        expect(roots).toHaveLength(2);
      });
    });

    await step("Scrollbar paints above content (z-index)", async () => {
      const scrollbar = canvasElement.querySelector(
        '[data-part="scrollbar"]'
      ) as HTMLElement;
      expect(window.getComputedStyle(scrollbar).zIndex).toBe("1");
    });
  },
};

// ============================================================
// Content padding: padding props forwarded to inner Content slot
// ============================================================
export const ContentPadding: Story = {
  render: () => (
    <Box display="flex" gap="600" flexWrap="wrap">
      {(["always", "hover"] as const).map((variant) => (
        <Box key={variant}>
          <Text fontSize="sm" mb="200" fontWeight="bold">
            variant=&quot;{variant}&quot;
          </Text>
          <Box display="flex" gap="400">
            <Box>
              <Text fontSize="xs" mb="100" color="neutral.11">
                No padding
              </Text>
              <ScrollArea
                maxH="200px"
                w="300px"
                variant={variant}
                bg="neutral.2"
              >
                <OverflowingContent />
              </ScrollArea>
            </Box>
            <Box>
              <Text fontSize="xs" mb="100" color="neutral.11">
                p=&quot;400&quot; (forwarded to content)
              </Text>
              <ScrollArea
                maxH="200px"
                w="300px"
                variant={variant}
                bg="neutral.2"
                p="400"
              >
                <OverflowingContent />
              </ScrollArea>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    await step("Padding is applied to the content slot, not root", async () => {
      // 2 variants × 2 padding states = 4 ScrollArea instances
      await waitFor(() => {
        const roots = canvasElement.querySelectorAll('[data-part="root"]');
        expect(roots).toHaveLength(4);
      });

      const contents = canvasElement.querySelectorAll('[data-part="content"]');
      expect(contents).toHaveLength(4);

      // Padded content elements (index 1 and 3) should have non-zero padding
      const paddedContent = contents[1] as HTMLElement;
      const paddedStyles = window.getComputedStyle(paddedContent);
      expect(paddedStyles.paddingTop).not.toBe("0px");

      // Unpadded content elements (index 0 and 2) should have no padding
      const unpaddedContent = contents[0] as HTMLElement;
      const unpaddedStyles = window.getComputedStyle(unpaddedContent);
      expect(unpaddedStyles.paddingTop).toBe("0px");
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
