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
// DefaultSurfacesBothScrollbars: regression test that the default orientation
// renders a scrollbar for each overflowing axis without `orientation` being
// explicitly set. Guards against a silent regression of the default back to
// a single-axis value.
// ============================================================
export const DefaultSurfacesBothScrollbars: Story = {
  render: () => (
    <ScrollArea
      maxH="200px"
      maxW="400px"
      ids={{ viewport: "test-viewport-default-both" }}
    >
      <OverflowingContent />
      <WideContent />
    </ScrollArea>
  ),
  play: async ({ canvasElement, step }) => {
    const doc = canvasElement.ownerDocument;

    await step("Both axes overflow", async () => {
      await waitFor(() => {
        const viewport = doc.getElementById(
          "test-viewport-default-both"
        ) as HTMLElement;
        expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
        expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth);
      });
    });

    await step(
      "Both scrollbars are rendered and visible with no orientation set",
      async () => {
        const scrollbars = Array.from(
          canvasElement.querySelectorAll('[data-part="scrollbar"]')
        );
        const orientations = scrollbars.map((sb) =>
          sb.getAttribute("data-orientation")
        );
        expect(orientations).toEqual(
          expect.arrayContaining(["vertical", "horizontal"])
        );
        scrollbars.forEach((sb) => {
          expect(window.getComputedStyle(sb).display).not.toBe("none");
        });
      }
    );

    await step("Corner element is rendered", async () => {
      const corner = canvasElement.querySelector('[data-part="corner"]');
      expect(corner).toBeTruthy();
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
      <OverflowingContent />
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
  },
};

// ============================================================
// StrictOrientations: single-axis orientations actively clip the opposite
// axis while preserving predictable sibling sizing. One panel per strict
// orientation, each with an intentionally over-sized child, an intrinsic
// child, and full-size children — so w=100% / h=100% siblings stay at
// viewport size regardless of the over-sized sibling.
// ============================================================
const StrictOrientationCard = ({
  axis,
  index,
}: {
  axis: "width" | "height";
  index: number;
}) => {
  const sizeProp = axis === "width" ? "w" : "h";
  const overSize = axis === "width" ? "150%" : "260px";
  const setting =
    index === 0
      ? `${sizeProp}="${overSize}"`
      : index === 1
        ? `no ${sizeProp} prop`
        : `${sizeProp}="100%"`;
  const headline =
    index === 0
      ? `Intentionally ${axis === "width" ? "wider" : "taller"} than the viewport to demonstrate a child that legitimately exceeds the scroll area ${axis}`
      : index === 1
        ? `Intrinsic auto ${axis} — block sizes to its own content, ${axis === "width" ? "same effective width as an explicit 100%" : "shorter than the viewport"}`
        : `Explicit full ${axis} — the common pattern for items that should always match the scroll area's visible ${axis}`;
  const outcome =
    index === 0
      ? `expected: clipped at the viewport edge under strict orientation`
      : index === 1
        ? `expected: fills viewport ${axis}`
        : `expected: fills viewport ${axis} regardless of any over-sized sibling`;
  return (
    <Box
      w={
        axis === "width"
          ? index === 0
            ? "150%"
            : index === 1
              ? undefined
              : "100%"
          : "220px"
      }
      h={
        axis === "height"
          ? index === 0
            ? "260px"
            : index === 1
              ? undefined
              : "100%"
          : undefined
      }
      flexShrink={axis === "height" ? "0" : undefined}
      alignSelf={axis === "height" ? "flex-start" : undefined}
      p="300"
      mb={axis === "width" ? "200" : undefined}
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
};

export const StrictOrientations: Story = {
  render: () => (
    <Box display="flex" gap="600" alignItems="flex-start">
      <Box w="320px">
        <Text fontSize="sm" fontWeight="bold" mb="100">
          orientation=&quot;vertical&quot;
        </Text>
        <Text fontSize="xs" color="neutral.11" mb="300">
          Horizontal axis is clipped. The w=150% card is cut at the viewport
          edge with no horizontal scrollbar, and w=100% siblings stay at
          viewport width.
        </Text>
        <ScrollArea
          maxH="300px"
          w="320px"
          orientation="vertical"
          ids={{ viewport: "test-viewport-strict-vertical" }}
        >
          {Array.from({ length: 6 }, (_, i) => (
            <StrictOrientationCard key={i} axis="width" index={i} />
          ))}
        </ScrollArea>
      </Box>
      <Box w="500px">
        <Text fontSize="sm" fontWeight="bold" mb="100">
          orientation=&quot;horizontal&quot;
        </Text>
        <Text fontSize="xs" color="neutral.11" mb="300">
          Vertical axis is clipped. The h=260px item is cut at the viewport edge
          with no vertical scrollbar, and h=100% siblings stay at viewport
          height.
        </Text>
        <ScrollArea
          h="200px"
          w="500px"
          orientation="horizontal"
          ids={{ viewport: "test-viewport-strict-horizontal" }}
        >
          <Box display="flex" gap="200" h="200px">
            {Array.from({ length: 6 }, (_, i) => (
              <StrictOrientationCard key={i} axis="height" index={i} />
            ))}
          </Box>
        </ScrollArea>
      </Box>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const doc = canvasElement.ownerDocument;

    const getCards = (viewportId: string, axis: "width" | "height") => {
      const viewport = doc.getElementById(viewportId) as HTMLElement;
      const content = viewport.querySelector(
        '[data-part="content"]'
      ) as HTMLElement;
      const container =
        axis === "height"
          ? (content.querySelector(":scope > div") as HTMLElement)
          : content;
      const cards = Array.from(
        container.querySelectorAll(":scope > div")
      ) as HTMLElement[];
      const scrollbars = Array.from(
        viewport
          .closest('[data-part="root"]')!
          .querySelectorAll('[data-part="scrollbar"]')
      ) as HTMLElement[];
      return { viewport, cards, scrollbars };
    };

    await step(
      "orientation=vertical: w=100% siblings stay at viewport width and x-axis is clipped",
      async () => {
        await waitFor(() => {
          const { viewport, cards, scrollbars } = getCards(
            "test-viewport-strict-vertical",
            "width"
          );
          expect(cards[0].offsetWidth).toBeGreaterThan(viewport.clientWidth);
          cards.slice(1).forEach((card) => {
            expect(card.offsetWidth).toBe(viewport.clientWidth);
          });
          expect(window.getComputedStyle(viewport).overflowX).toBe("hidden");
          const visibleHorizontal = scrollbars.find(
            (sb) =>
              sb.getAttribute("data-orientation") === "horizontal" &&
              window.getComputedStyle(sb).display !== "none"
          );
          expect(visibleHorizontal).toBeUndefined();
        });
      }
    );

    await step(
      "orientation=horizontal: h=100% siblings stay at viewport height and y-axis is clipped",
      async () => {
        const { viewport, cards, scrollbars } = getCards(
          "test-viewport-strict-horizontal",
          "height"
        );
        expect(cards[0].offsetHeight).toBeGreaterThan(viewport.clientHeight);
        cards.slice(2).forEach((card) => {
          expect(card.offsetHeight).toBe(viewport.clientHeight);
        });
        expect(window.getComputedStyle(viewport).overflowY).toBe("hidden");
        const visibleVertical = scrollbars.find(
          (sb) =>
            sb.getAttribute("data-orientation") === "vertical" &&
            window.getComputedStyle(sb).display !== "none"
        );
        expect(visibleVertical).toBeUndefined();
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
