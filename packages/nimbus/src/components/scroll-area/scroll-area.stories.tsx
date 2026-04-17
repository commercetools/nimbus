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

    await step(
      "Horizontal scrollbar is hidden when only Y overflows",
      async () => {
        await waitFor(() => {
          const scrollbars = Array.from(
            canvasElement.querySelectorAll('[data-part="scrollbar"]')
          );
          const horizontal = scrollbars.find(
            (sb) => sb.getAttribute("data-orientation") === "horizontal"
          );
          expect(horizontal).toBeTruthy();
          expect(window.getComputedStyle(horizontal!).display).toBe("none");
        });
      }
    );

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
    <Box>
      <Text fontSize="xs" color="neutral.11" mb="200">
        When no <code>orientation</code> prop is set and content overflows on
        both axes, both scrollbars and the corner are rendered. Guards against
        the default silently reverting to a single-axis value.
      </Text>
      <ScrollArea
        maxH="200px"
        maxW="400px"
        ids={{ viewport: "test-viewport-default-both" }}
      >
        <OverflowingContent />
        <WideContent />
      </ScrollArea>
    </Box>
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
// DefaultChildSizing: the default orientation produces predictable child
// geometry — a w=100% sibling stays at viewport width even next to a
// legitimately over-sized child, a fit-content child sizes to its own
// contents, and a pixel child is sized literally. Guards the core bug fix
// that pinned the content wrapper to viewport width.
// ============================================================
export const DefaultChildSizing: Story = {
  render: () => (
    <Box>
      <Text fontSize="xs" color="neutral.11" mb="200" maxW="320px">
        Asserts the core child-sizing contract under the default orientation: a{" "}
        <code>w=100%</code> sibling stays at viewport width even next to a
        nowrap descendant that forces horizontal overflow, a{" "}
        <code>fit-content</code> child sizes to its own contents, and a pixel
        child is honored literally.
      </Text>
      <ScrollArea
        maxH="300px"
        w="320px"
        ids={{ viewport: "test-viewport-child-sizing" }}
      >
        <Box display="flex" flexDirection="column" gap="200">
          <Box w="100%" h="40px" bg="neutral.3" id="sizing-w-100" />
          <Box w="fit-content" px="300" py="200" bg="neutral.3" id="sizing-fit">
            <Text fontSize="xs">fit-content</Text>
          </Box>
          <Box w="200px" h="40px" bg="neutral.3" id="sizing-pixel" />
          <Box display="flex" gap="100" id="sizing-flex-row">
            <Box flex="1" h="40px" bg="neutral.3" />
            <Box flex="2" h="40px" bg="neutral.4" />
          </Box>
          <Box whiteSpace="nowrap" id="sizing-nowrap">
            <Text fontSize="sm">
              {"intentionally-long-unwrappable-token-".repeat(6)}
            </Text>
          </Box>
        </Box>
      </ScrollArea>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const doc = canvasElement.ownerDocument;

    await step(
      "w=100% child matches viewport width regardless of an over-sized sibling",
      async () => {
        await waitFor(() => {
          const viewport = doc.getElementById(
            "test-viewport-child-sizing"
          ) as HTMLElement;
          const wFull = viewport.querySelector("#sizing-w-100") as HTMLElement;
          expect(wFull.offsetWidth).toBe(viewport.clientWidth);
        });
      }
    );

    await step("fit-content child sizes to its own contents", async () => {
      const viewport = doc.getElementById(
        "test-viewport-child-sizing"
      ) as HTMLElement;
      const fit = viewport.querySelector("#sizing-fit") as HTMLElement;
      expect(fit.offsetWidth).toBeGreaterThan(0);
      expect(fit.offsetWidth).toBeLessThan(viewport.clientWidth);
    });

    await step("Explicit pixel width is honored literally", async () => {
      const viewport = doc.getElementById(
        "test-viewport-child-sizing"
      ) as HTMLElement;
      const pixel = viewport.querySelector("#sizing-pixel") as HTMLElement;
      expect(pixel.offsetWidth).toBe(200);
    });

    await step(
      "Flex row composes flex=1 and flex=2 ratios at viewport width",
      async () => {
        const viewport = doc.getElementById(
          "test-viewport-child-sizing"
        ) as HTMLElement;
        const flexRow = viewport.querySelector(
          "#sizing-flex-row"
        ) as HTMLElement;
        expect(flexRow.offsetWidth).toBe(viewport.clientWidth);
        const [first, second] = Array.from(flexRow.children) as HTMLElement[];
        expect(second.offsetWidth).toBeGreaterThan(first.offsetWidth);
      }
    );

    await step(
      "A nowrap descendant still creates viewport overflow so the horizontal scrollbar surfaces",
      async () => {
        const viewport = doc.getElementById(
          "test-viewport-child-sizing"
        ) as HTMLElement;
        expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth);
      }
    );
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
// Custom styling: non-padding style props are routed to the root, not to
// the viewport or the content slot.
// ============================================================
export const CustomStyling: Story = {
  render: () => (
    <Box>
      <Text fontSize="xs" color="neutral.11" mb="200" maxW="500px">
        Non-padding style props (<code>bg</code>, <code>border</code>,{" "}
        <code>borderRadius</code>, <code>boxShadow</code>, <code>m</code>) land
        on the root. The viewport and content slot stay visually untouched so
        overlay scrollbars paint correctly over the themed root.
      </Text>
      <ScrollArea
        maxH="200px"
        w="400px"
        bg="neutral.2"
        borderRadius="300"
        border="solid-25"
        borderColor="primary.9"
        boxShadow="4"
        m="200"
        ids={{ viewport: "test-viewport-custom" }}
      >
        <Box p="200">
          <OverflowingContent />
        </Box>
      </ScrollArea>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const doc = canvasElement.ownerDocument;

    const getParts = () => {
      const viewport = doc.getElementById(
        "test-viewport-custom"
      ) as HTMLElement;
      const root = viewport.closest('[data-part="root"]') as HTMLElement;
      const content = viewport.querySelector(
        '[data-part="content"]'
      ) as HTMLElement;
      return {
        root,
        viewport,
        content,
        rootStyle: window.getComputedStyle(root),
        viewportStyle: window.getComputedStyle(viewport),
        contentStyle: window.getComputedStyle(content),
      };
    };

    await step(
      "Root reflects every style prop with non-default values",
      async () => {
        await waitFor(() => {
          const { rootStyle } = getParts();
          expect(rootStyle.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
          expect(rootStyle.borderRadius).not.toBe("0px");
          expect(rootStyle.borderTopWidth).not.toBe("0px");
          expect(rootStyle.borderTopColor).not.toBe("rgba(0, 0, 0, 0)");
          expect(rootStyle.boxShadow).not.toBe("none");
          expect(rootStyle.marginTop).not.toBe("0px");
        });
      }
    );

    await step(
      "Viewport and content slot do not inherit root-only style props",
      async () => {
        const { viewportStyle, contentStyle } = getParts();
        expect(viewportStyle.backgroundColor).toBe("rgba(0, 0, 0, 0)");
        expect(viewportStyle.borderTopWidth).toBe("0px");
        expect(viewportStyle.boxShadow).toBe("none");
        expect(contentStyle.backgroundColor).toBe("rgba(0, 0, 0, 0)");
        expect(contentStyle.borderTopWidth).toBe("0px");
        expect(contentStyle.marginTop).toBe("0px");
      }
    );
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
const ExternalControlHarness = () => {
  const scrollArea = useScrollArea({
    ids: { viewport: "test-viewport" },
  });
  return (
    <Box>
      <Text fontSize="xs" color="neutral.11" mb="200" maxW="500px">
        An externally created scroll-area machine is passed to the{" "}
        <code>value</code> prop. Buttons call <code>scrollTo</code> and{" "}
        <code>scrollToEdge</code> on the hook; the readout reflects{" "}
        <code>hasOverflowY</code>.
      </Text>
      <Box display="flex" gap="200" mb="200">
        <button
          type="button"
          data-testid="external-scroll-to-100"
          onClick={() => scrollArea.scrollTo({ top: 100 })}
        >
          scrollTo top=100
        </button>
        <button
          type="button"
          data-testid="external-scroll-to-bottom"
          onClick={() => scrollArea.scrollToEdge({ edge: "bottom" })}
        >
          scrollToEdge bottom
        </button>
        <span data-testid="external-has-overflow-y">
          hasOverflowY: {String(scrollArea.hasOverflowY)}
        </span>
      </Box>
      <ScrollArea maxH="200px" w="400px" value={scrollArea}>
        <OverflowingContent />
      </ScrollArea>
    </Box>
  );
};

export const ExternalControl: Story = {
  render: () => <ExternalControlHarness />,
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

    await step(
      "hasOverflowY from the hook reflects viewport state",
      async () => {
        const readout = canvasElement.querySelector(
          '[data-testid="external-has-overflow-y"]'
        ) as HTMLElement;
        expect(readout.textContent).toContain("true");
      }
    );

    await step("scrollTo moves the viewport scroll position", async () => {
      const viewport = doc.getElementById("test-viewport") as HTMLElement;
      const button = canvasElement.querySelector(
        '[data-testid="external-scroll-to-100"]'
      ) as HTMLButtonElement;
      expect(viewport.scrollTop).toBe(0);
      await userEvent.click(button);
      await waitFor(() => {
        expect(viewport.scrollTop).toBeGreaterThan(0);
      });
    });

    await step("scrollToEdge bottom scrolls to the end", async () => {
      const viewport = doc.getElementById("test-viewport") as HTMLElement;
      const button = canvasElement.querySelector(
        '[data-testid="external-scroll-to-bottom"]'
      ) as HTMLButtonElement;
      await userEvent.click(button);
      await waitFor(() => {
        expect(
          viewport.scrollTop + viewport.clientHeight
        ).toBeGreaterThanOrEqual(viewport.scrollHeight - 1);
      });
    });
  },
};

// ============================================================
// DynamicContent: adding children after mount flips the data-overflow and
// tabIndex state. Regression test for useScrollAreaContext reactivity.
// ============================================================
const DynamicContentHarness = () => {
  const [rows, setRows] = React.useState(2);
  return (
    <Box>
      <Text fontSize="xs" color="neutral.11" mb="200" maxW="500px">
        Adding or removing children after mount must flip the{" "}
        <code>data-overflow-*</code> attributes and the viewport's{" "}
        <code>tabindex</code>. Guards the reactivity of overflow detection.
      </Text>
      <Box display="flex" gap="200" mb="200">
        <button
          type="button"
          data-testid="dynamic-add"
          onClick={() => setRows((n) => n + 20)}
        >
          add rows
        </button>
        <button
          type="button"
          data-testid="dynamic-reset"
          onClick={() => setRows(2)}
        >
          reset
        </button>
      </Box>
      <ScrollArea
        maxH="200px"
        w="400px"
        ids={{ viewport: "test-viewport-dynamic" }}
      >
        {Array.from({ length: rows }, (_, i) => (
          <Text key={i} fontSize="sm">
            Row {i + 1}
          </Text>
        ))}
      </ScrollArea>
    </Box>
  );
};

export const DynamicContent: Story = {
  render: () => <DynamicContentHarness />,
  play: async ({ canvasElement, step }) => {
    const doc = canvasElement.ownerDocument;

    await step("Initial state: no overflow, no tabIndex", async () => {
      await waitFor(() => {
        const viewport = doc.getElementById(
          "test-viewport-dynamic"
        ) as HTMLElement;
        expect(viewport).toBeTruthy();
        expect(viewport.scrollHeight).toBe(viewport.clientHeight);
        expect(viewport).not.toHaveAttribute("tabindex");
      });
    });

    await step(
      "After adding rows: overflow detected and tabIndex flips to 0",
      async () => {
        await userEvent.click(
          canvasElement.querySelector(
            '[data-testid="dynamic-add"]'
          ) as HTMLButtonElement
        );
        await waitFor(() => {
          const viewport = doc.getElementById(
            "test-viewport-dynamic"
          ) as HTMLElement;
          expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
          expect(viewport).toHaveAttribute("tabindex", "0");
        });
      }
    );

    await step("After resetting: tabIndex is removed again", async () => {
      await userEvent.click(
        canvasElement.querySelector(
          '[data-testid="dynamic-reset"]'
        ) as HTMLButtonElement
      );
      await waitFor(() => {
        const viewport = doc.getElementById(
          "test-viewport-dynamic"
        ) as HTMLElement;
        expect(viewport.scrollHeight).toBe(viewport.clientHeight);
        expect(viewport).not.toHaveAttribute("tabindex");
      });
    });
  },
};

// ============================================================
// ForwardsApi: public-API surface tests — root ref, ids map, and polymorphic
// `as`. Each is advertised by the types; these prove they actually work.
// ============================================================
const ForwardsApiHarness = () => {
  const rootRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (rootRef.current) {
      rootRef.current.setAttribute("data-ref-landed", "true");
    }
  }, []);
  return (
    <Box>
      <Text fontSize="xs" color="neutral.11" mb="200" maxW="500px">
        Proves the public-API surface actually works: the root <code>ref</code>{" "}
        lands on the root element, <code>as=&quot;section&quot;</code> renders
        the root as a <code>&lt;section&gt;</code>, and every key in the{" "}
        <code>ids</code> map reaches the DOM.
      </Text>
      <ScrollArea
        as="section"
        ref={rootRef}
        maxH="200px"
        w="400px"
        ids={{
          root: "test-forwards-root",
          viewport: "test-forwards-viewport",
          content: "test-forwards-content",
        }}
      >
        <OverflowingContent />
      </ScrollArea>
    </Box>
  );
};

export const ForwardsApi: Story = {
  render: () => <ForwardsApiHarness />,
  play: async ({ canvasElement, step }) => {
    const doc = canvasElement.ownerDocument;

    await step("Root ref lands on the root element", async () => {
      await waitFor(() => {
        const root = doc.getElementById("test-forwards-root") as HTMLElement;
        expect(root).toBeTruthy();
        expect(root).toHaveAttribute("data-ref-landed", "true");
        expect(root).toHaveAttribute("data-part", "root");
      });
    });

    await step(
      "Polymorphic `as` renders root as the requested tag",
      async () => {
        const root = doc.getElementById("test-forwards-root") as HTMLElement;
        expect(root.tagName).toBe("SECTION");
      }
    );

    await step("All ids in the `ids` map reach the DOM", async () => {
      for (const id of [
        "test-forwards-root",
        "test-forwards-viewport",
        "test-forwards-content",
      ]) {
        expect(doc.getElementById(id)).toBeTruthy();
      }
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
const paddingPropCases = [
  {
    prop: "p",
    viewportId: "test-pad-p",
    expected: { top: true, right: true, bottom: true, left: true },
  },
  {
    prop: "px",
    viewportId: "test-pad-px",
    expected: { top: false, right: true, bottom: false, left: true },
  },
  {
    prop: "py",
    viewportId: "test-pad-py",
    expected: { top: true, right: false, bottom: true, left: false },
  },
  {
    prop: "pt",
    viewportId: "test-pad-pt",
    expected: { top: true, right: false, bottom: false, left: false },
  },
  {
    prop: "pb",
    viewportId: "test-pad-pb",
    expected: { top: false, right: false, bottom: true, left: false },
  },
  {
    prop: "ps",
    viewportId: "test-pad-ps",
    expected: { top: false, right: false, bottom: false, left: true },
  },
  {
    prop: "pe",
    viewportId: "test-pad-pe",
    expected: { top: false, right: true, bottom: false, left: false },
  },
  {
    prop: "paddingInline",
    viewportId: "test-pad-paddingInline",
    expected: { top: false, right: true, bottom: false, left: true },
  },
  {
    prop: "paddingBlock",
    viewportId: "test-pad-paddingBlock",
    expected: { top: true, right: false, bottom: true, left: false },
  },
] as const;

export const ContentPadding: Story = {
  render: () => (
    <Box>
      <Text fontSize="xs" color="neutral.11" mb="300" maxW="600px">
        Every padding prop is forwarded to the inner{" "}
        <code>[data-part=&quot;content&quot;]</code> slot so the scrollbar
        overlays the padded area, not the gutter. Root always has zero padding.
      </Text>
      <Box display="flex" gap="400" flexWrap="wrap">
        {paddingPropCases.map(({ prop, viewportId }) => (
          <Box key={prop}>
            <Text fontSize="xs" mb="100" color="neutral.11">
              {prop}=&quot;400&quot;
            </Text>
            <ScrollArea
              maxH="200px"
              w="260px"
              bg="neutral.2"
              ids={{ viewport: viewportId }}
              {...{ [prop]: "400" }}
            >
              <OverflowingContent />
            </ScrollArea>
          </Box>
        ))}
        <Box>
          <Text fontSize="xs" mb="100" color="neutral.11">
            no padding (control)
          </Text>
          <ScrollArea
            maxH="200px"
            w="260px"
            bg="neutral.2"
            ids={{ viewport: "test-pad-none" }}
          >
            <OverflowingContent />
          </ScrollArea>
        </Box>
      </Box>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const doc = canvasElement.ownerDocument;

    await step(
      "Control case: no padding on root or content when no padding prop is set",
      async () => {
        await waitFor(() => {
          const viewport = doc.getElementById("test-pad-none") as HTMLElement;
          const root = viewport.closest('[data-part="root"]') as HTMLElement;
          const content = viewport.querySelector(
            '[data-part="content"]'
          ) as HTMLElement;
          const rootStyles = window.getComputedStyle(root);
          const contentStyles = window.getComputedStyle(content);
          (
            [
              "paddingTop",
              "paddingRight",
              "paddingBottom",
              "paddingLeft",
            ] as const
          ).forEach((side) => {
            expect(rootStyles[side]).toBe("0px");
            expect(contentStyles[side]).toBe("0px");
          });
        });
      }
    );

    for (const { prop, viewportId, expected } of paddingPropCases) {
      await step(
        `${prop} is forwarded to content and not applied to root`,
        async () => {
          const viewport = doc.getElementById(viewportId) as HTMLElement;
          const root = viewport.closest('[data-part="root"]') as HTMLElement;
          const content = viewport.querySelector(
            '[data-part="content"]'
          ) as HTMLElement;
          const rootStyles = window.getComputedStyle(root);
          const contentStyles = window.getComputedStyle(content);
          const sides = [
            ["paddingTop", expected.top],
            ["paddingRight", expected.right],
            ["paddingBottom", expected.bottom],
            ["paddingLeft", expected.left],
          ] as const;
          sides.forEach(([side, shouldBePadded]) => {
            expect(rootStyles[side]).toBe("0px");
            if (shouldBePadded) {
              expect(contentStyles[side]).not.toBe("0px");
            } else {
              expect(contentStyles[side]).toBe("0px");
            }
          });
        }
      );
    }
  },
};
