import type { Meta, StoryObj } from "@storybook/react-vite";
import { useLayoutEffect, useRef, useState } from "react";
import { SkeletonText, Stack, Box, Text, Select } from "@commercetools/nimbus";
import { within, expect } from "storybook/test";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 *
 * Query strategy note: SkeletonText is decorative and `aria-hidden` by design,
 * so it exposes no accessible role. Every play function below queries by
 * `data-testid` intentionally (per the query-preference order in
 * docs/file-type-guidelines/stories.md, testid is the correct fallback for
 * non-interactive, role-less elements).
 */
const meta: Meta<typeof SkeletonText> = {
  title: "Components/SkeletonText",
  component: SkeletonText,
};

export default meta;

type Story = StoryObj<typeof SkeletonText>;

/**
 * Default — a multi-line text skeleton renders 3 lines by default.
 */
export const Default: Story = {
  render: () => (
    <SkeletonText data-testid="skeleton-text-default" width="7200" />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const container = canvas.getByTestId("skeleton-text-default");

    await step("Renders the default number of lines (3)", async () => {
      await expect(container.children).toHaveLength(3);
    });

    await step(
      "Root container is hidden from assistive technology",
      async () => {
        await expect(container).toHaveAttribute("aria-hidden", "true");
      }
    );
  },
};

/**
 * LineCount — multi-line text skeleton with a configurable line count.
 */
export const LineCount: Story = {
  render: () => (
    <SkeletonText data-testid="skeleton-text-root" lines={4} width="7200" />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const container = canvas.getByTestId("skeleton-text-root");

    await step("Renders the requested number of child lines", async () => {
      await expect(container.children).toHaveLength(4);
    });

    await step(
      "Root container is hidden from assistive technology",
      async () => {
        await expect(container).toHaveAttribute("aria-hidden", "true");
      }
    );
  },
};

/**
 * LastLine — verifies the last line of SkeletonText is narrower than the
 * preceding full-width lines, mimicking a real paragraph ending.
 */
export const LastLine: Story = {
  render: () => (
    <SkeletonText
      data-testid="skeleton-text-narrow"
      lines={3}
      lastLineWidth="40%"
      width="7200"
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const container = canvas.getByTestId("skeleton-text-narrow");

    await step("Renders the correct number of child lines", async () => {
      await expect(container.children).toHaveLength(3);
    });

    await step("Renders the last line narrower than the others", async () => {
      // Each child is a `1lh` line-box; the actual bar is its child. Measure the
      // bars, not the (always full-width) line-boxes.
      const firstBar = container.children[0].firstElementChild as HTMLElement;
      const lastBar = container.children[container.children.length - 1]
        .firstElementChild as HTMLElement;
      await expect(lastBar.offsetWidth).toBeLessThan(firstBar.offsetWidth);
    });
  },
};

/**
 * StyleMatch — the `textStyle` prop makes the placeholder mirror real text of
 * that style: each line is a `1lh` line-box with a `0.75em` (≈ cap-height) bar
 * centered in it, so the bars sit where glyphs sit and the pitch scales with the
 * style. Compared here at `body` and `3xl`. The exact geometry is left to
 * Chromatic to snapshot rather than asserted in a play function.
 */
export const StyleMatch: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack gap="600">
      <SkeletonText textStyle="body" width="7200" />
      <SkeletonText textStyle="3xl" width="7200" />
    </Stack>
  ),
};

/** Nimbus text-style presets that carry a font-size + line-height, small→large. */
const TEXT_STYLES = [
  "caption",
  "detail",
  "body",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
] as const;

const SAMPLE_PARAGRAPH =
  "The quick brown fox jumps over the lazy dog while a placeholder waits " +
  "patiently beside it. Loading states should feel calm and predictable, so " +
  "the skeleton bars sit on the very same lines the real text will fill once " +
  "the data finally arrives.";

// Guide colors, theme-neutral so they read on light and dark backgrounds.
const BAND_LINE = "rgba(127,127,127,0.35)"; // line-box boundary, every 1lh
const CENTER_LINE = "rgba(59,130,246,0.6)"; // line-box vertical center, at 0.5lh

/**
 * LineHeightAlignment — an educational, interactive tool (not a behavioral test)
 * for verifying that the placeholder shares the vertical rhythm of real text.
 *
 * Real text and its SkeletonText sit side by side at the same width and text
 * style, over guides that track the live line-height: a faint line at every
 * line-box boundary (`1lh`) and an accent line at each box's vertical center
 * (`0.5lh`). Because each skeleton line is a `1lh` box with a `0.75em`
 * (≈ cap-height) bar centered in it, every bar's center lands on an accent line —
 * one bar per box — mirroring how CSS seats real glyphs. Switch the text style to
 * confirm the whole thing scales. Kept as a design reference for how the
 * `textStyle`-driven sizing works.
 */
export const LineHeightAlignment: Story = {
  render: () => {
    const [styleKey, setStyleKey] = useState<string>("body");
    const [{ fontSize, lineHeight }, setMetrics] = useState({
      fontSize: 0,
      lineHeight: 0,
    });
    const probeRef = useRef<HTMLDivElement>(null);

    // Read the resolved metrics off the live element so the readout can't drift
    // if the textStyle tokens are ever retuned.
    useLayoutEffect(() => {
      const el = probeRef.current;
      if (!el) return;
      const cs = getComputedStyle(el);
      const fs = parseFloat(cs.fontSize);
      const lh = parseFloat(cs.lineHeight);
      setMetrics((prev) =>
        prev.fontSize === fs && prev.lineHeight === lh
          ? prev
          : { fontSize: fs, lineHeight: lh }
      );
    }, [styleKey]);

    const bar = fontSize ? Math.round(fontSize * 0.75 * 100) / 100 : 0;

    // Layered guides that track the live line-height via the `lh` unit: a
    // boundary line at every `1lh`, plus an accent line at each band's midpoint
    // (`0.5lh`). A centered bar's vertical center sits on the accent line.
    const guides = [
      `repeating-linear-gradient(to bottom, ${BAND_LINE} 0, ${BAND_LINE} 1px, transparent 1px, transparent 1lh)`,
      `repeating-linear-gradient(to bottom, transparent 0, transparent calc(0.5lh - 0.5px), ${CENTER_LINE} calc(0.5lh - 0.5px), ${CENTER_LINE} calc(0.5lh + 0.5px), transparent calc(0.5lh + 0.5px), transparent 1lh)`,
    ].join(", ");

    return (
      <Stack gap="500" padding="600" width="820px">
        <Text fontWeight="700" fontSize="18px">
          SkeletonText · line-height alignment
        </Text>
        <Text fontSize="14px" color="neutral.11">
          Real text vs. its SkeletonText placeholder at the same width and text
          style. Faint lines mark each line-box boundary (every line-height);
          the blue line marks the box's vertical center. A correctly sized
          placeholder puts a cap-height bar centered on the blue line — one per
          box — matching the rhythm of the real text beside it. Switch styles to
          confirm it scales.
        </Text>

        <Select.Root
          selectedKey={styleKey}
          onSelectionChange={(k) => k != null && setStyleKey(String(k))}
          aria-label="Text style"
          width="260px"
        >
          <Select.Options>
            {TEXT_STYLES.map((k) => (
              <Select.Option key={k} id={k}>
                {k}
              </Select.Option>
            ))}
          </Select.Options>
        </Select.Root>

        {fontSize > 0 && (
          <Text fontSize="13px" color="neutral.11">
            <strong>{styleKey}</strong> — font-size {fontSize}px · line-height{" "}
            {lineHeight}px · bar 0.75em ≈ <strong>{bar}px</strong>
          </Text>
        )}

        <Box display="grid" gridTemplateColumns="1fr 1fr" columnGap="800">
          <Text fontWeight="700" fontSize="13px" color="neutral.11">
            Real text
          </Text>
          <Text fontWeight="700" fontSize="13px" color="neutral.11">
            SkeletonText
          </Text>
        </Box>

        {/* Guides live on the container that carries the text style, so `1lh`
            resolves to the selected style. Content starts at y=0 so line 1 and
            bar 1 land in the first band. */}
        <Box
          ref={probeRef}
          textStyle={styleKey}
          display="grid"
          gridTemplateColumns="1fr 1fr"
          columnGap="800"
          style={{ backgroundImage: guides }}
        >
          <Text textStyle={styleKey} margin="0">
            {SAMPLE_PARAGRAPH}
          </Text>
          <SkeletonText textStyle={styleKey} lines={8} width="100%" />
        </Box>
      </Stack>
    );
  },
};
