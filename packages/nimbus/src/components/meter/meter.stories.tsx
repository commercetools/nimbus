import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef } from "react";
import {
  Box,
  Button,
  Flex,
  Meter,
  type MeterProps,
  type MeterSegment,
  Stack,
  Text,
} from "@commercetools/nimbus";
import { within, expect, fn, userEvent } from "storybook/test";
import { DisplayColorPalettes } from "@/utils/display-color-palettes";

const sizes: MeterProps["size"][] = ["2xs", "md"];
const layouts: MeterProps["layout"][] = ["minimal", "inline", "stacked"];
const statePalettes = ["primary", "positive", "warning", "critical"] as const;

const storageSegments: MeterSegment[] = [
  { id: "images", label: "Images", value: 30 },
  { id: "videos", label: "Videos", value: 20 },
];

const gigabytes: Intl.NumberFormatOptions = { style: "unit", unit: "gigabyte" };

/** Filled parts of the track, in DOM order */
const getSegments = (root: HTMLElement) =>
  Array.from(root.querySelectorAll<HTMLElement>(".nimbus-meter__segment"));

/** Visible value text element */
const getValueText = (root: HTMLElement) =>
  root.querySelector<HTMLElement>(".nimbus-meter__value");

/** Legend list element */
const getLegend = (root: HTMLElement) =>
  root.querySelector<HTMLElement>(".nimbus-meter__legend");

/**
 * Replaces console.warn with a mock for the story and restores it afterwards,
 * so expected development warnings can be asserted.
 */
const mockConsoleWarn = () => {
  const originalWarn = console.warn;
  console.warn = fn();
  return () => {
    console.warn = originalWarn;
  };
};

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
// VRT: Meter is not interactive (no focus, hover or overlay states), so the
// snapshotted frames are SmokeTest, Sizes, ColorPalettes, SegmentShowcase and
// RTLSupport. Behavior-only stories stay un-snapshotted (project default).
const meta: Meta<typeof Meter> = {
  title: "Components/Meter",
  component: Meter,
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            // React Aria renders role="meter progressbar" (progressbar is a
            // fallback for browsers without meter support). axe's
            // aria-allowed-attr rule reads the role list as one invalid role
            // and then reports the aria-value* attributes as not allowed.
            // Skip only the meter element; the rule stays on for all others.
            id: "aria-allowed-attr",
            selector: ':not([role~="meter"])',
          },
        ],
      },
    },
  },
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof Meter>;

/**
 * Base story
 * Demonstrates the most basic implementation with a single value
 */
export const Base: Story = {
  args: {
    value: 40,
    label: "CPU usage",
    ["data-testid"]: "meter-test",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const meter = canvas.getByTestId("meter-test");

    await step("Uses a <div> element by default", async () => {
      await expect(meter.tagName).toBe("DIV");
    });

    await step("Has ARIA role 'meter'", async () => {
      await expect(canvas.getByRole("meter")).toBe(meter);
    });

    await step("Exposes the default range and the value", async () => {
      await expect(meter).toHaveAttribute("aria-valuemin", "0");
      await expect(meter).toHaveAttribute("aria-valuemax", "100");
      await expect(meter).toHaveAttribute("aria-valuenow", "40");
    });

    await step("Is labelled by the visible label", async () => {
      await expect(canvas.getByText("CPU usage")).toBeVisible();
      await expect(meter).toHaveAttribute("aria-labelledby");
      await expect(meter).toHaveAccessibleName("CPU usage");
    });

    await step("Shows the formatted value", async () => {
      await expect(getValueText(meter)).toHaveTextContent("40%");
    });

    await step("Draws one filled part with the value's width", async () => {
      const segments = getSegments(meter);
      await expect(segments).toHaveLength(1);
      await expect(segments[0].style.width).toBe("40%");
    });

    await step("Renders no legend for a single value", async () => {
      await expect(getLegend(meter)).toBeNull();
    });
  },
};

/**
 * A meter is not interactive, so keyboard focus skips it
 */
export const NotFocusable: Story = {
  render: () => (
    <Stack direction="column" gap="400" alignItems="stretch">
      <Button>Before</Button>
      <Meter value={50} label="Disk usage" />
      <Button>After</Button>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Tab moves from the first button to the second", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Before" }));
      await userEvent.tab();
      await expect(canvas.getByRole("button", { name: "After" })).toHaveFocus();
    });

    await step("No part of the meter is focusable", async () => {
      const meter = canvas.getByRole("meter");
      await expect(meter).not.toHaveAttribute("tabindex");
      await expect(meter.querySelectorAll("[tabindex]")).toHaveLength(0);
    });
  },
};

/**
 * Custom range with minValue and maxValue
 */
export const CustomRange: Story = {
  args: {
    value: 35,
    minValue: 10,
    maxValue: 60,
    label: "Temperature",
    formatOptions: { style: "unit", unit: "celsius" },
  },
  play: async ({ canvasElement, step }) => {
    const meter = within(canvasElement).getByRole("meter");

    await step("Exposes the custom range", async () => {
      await expect(meter).toHaveAttribute("aria-valuemin", "10");
      await expect(meter).toHaveAttribute("aria-valuemax", "60");
      await expect(meter).toHaveAttribute("aria-valuenow", "35");
    });

    await step("Fill width is relative to the range", async () => {
      await expect(getSegments(meter)[0].style.width).toBe("50%");
    });

    await step("Shows the value in the given unit", async () => {
      await expect(getValueText(meter)).toHaveTextContent("35°C");
    });
  },
};

/**
 * Value formatting with formatOptions and valueLabel
 */
export const ValueFormatting: Story = {
  render: () => (
    <Stack direction="column" gap="400" alignItems="stretch">
      <Meter data-testid="percent" value={72} label="Default (percent)" />
      <Meter
        data-testid="unit"
        value={50}
        label="Unit"
        formatOptions={gigabytes}
      />
      <Meter
        data-testid="value-label"
        value={50}
        label="Custom value label"
        valueLabel="50 of 100 GB"
      />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Formats as percent by default", async () => {
      const meter = canvas.getByTestId("percent");
      await expect(getValueText(meter)).toHaveTextContent("72%");
      await expect(meter).toHaveAttribute("aria-valuetext", "72%");
    });

    await step("Formats with the given unit", async () => {
      const meter = canvas.getByTestId("unit");
      await expect(getValueText(meter)).toHaveTextContent("50 GB");
      await expect(meter).toHaveAttribute("aria-valuetext", "50 GB");
    });

    await step("valueLabel replaces the value text", async () => {
      const meter = canvas.getByTestId("value-label");
      await expect(getValueText(meter)).toHaveTextContent("50 of 100 GB");
      await expect(meter).toHaveAttribute("aria-valuetext", "50 of 100 GB");
    });
  },
};

/**
 * Values outside the range are clamped
 */
export const Clamping: Story = {
  render: () => (
    <Stack direction="column" gap="400" alignItems="stretch">
      <Meter data-testid="above" value={150} label="Above maximum" />
      <Meter data-testid="below" value={-10} label="Below minimum" />
      <Meter
        data-testid="empty-range"
        value={50}
        minValue={50}
        maxValue={50}
        label="Empty range"
      />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("A value above the maximum fills 100%", async () => {
      const meter = canvas.getByTestId("above");
      await expect(getSegments(meter)[0].style.width).toBe("100%");
      await expect(meter).toHaveAttribute("aria-valuenow", "100");
    });

    await step("A value below the minimum fills 0%", async () => {
      const meter = canvas.getByTestId("below");
      await expect(getSegments(meter)).toHaveLength(0);
      await expect(meter).toHaveAttribute("aria-valuenow", "0");
    });

    await step("An empty range fills 0% without errors", async () => {
      const meter = canvas.getByTestId("empty-range");
      await expect(getSegments(meter)).toHaveLength(0);
    });
  },
};

/**
 * Multiple segments of one total
 */
export const Segments: Story = {
  args: {
    label: "Storage",
    maxValue: 100,
    formatOptions: gigabytes,
    segments: storageSegments,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const meter = canvas.getByRole("meter");

    await step("Renders exactly one meter", async () => {
      await expect(canvas.getAllByRole("meter")).toHaveLength(1);
      // The meter is the only element with an explicit role
      const withRole = canvasElement.querySelectorAll("[role]");
      await expect(Array.from(withRole)).toEqual([meter]);
    });

    await step("aria-valuenow is the sum of the segments", async () => {
      await expect(meter).toHaveAttribute("aria-valuenow", "50");
    });

    await step("aria-valuetext summarizes all segments in order", async () => {
      await expect(meter).toHaveAttribute(
        "aria-valuetext",
        "50 GB (Images: 30 GB, Videos: 20 GB)"
      );
    });

    await step("Shows the formatted total as value text", async () => {
      await expect(getValueText(meter)).toHaveTextContent("50 GB");
    });

    await step("Draws each segment with a proportional width", async () => {
      const segments = getSegments(meter);
      await expect(segments.map((s) => s.style.width)).toEqual(["30%", "20%"]);
    });

    await step("Segments have no role of their own", async () => {
      for (const segment of getSegments(meter)) {
        await expect(segment).not.toHaveAttribute("role");
      }
    });

    await step("Legend lists every segment in order", async () => {
      const items = Array.from(getLegend(canvasElement)!.children);
      await expect(items).toHaveLength(2);
      await expect(items[0]).toHaveTextContent("Images");
      await expect(items[0]).toHaveTextContent("30 GB");
      await expect(items[1]).toHaveTextContent("Videos");
      await expect(items[1]).toHaveTextContent("20 GB");
    });

    await step("Legend is visible but hidden from assistive tech", async () => {
      const legend = getLegend(canvasElement)!;
      await expect(legend).toBeVisible();
      await expect(legend).toHaveAttribute("aria-hidden", "true");
    });
  },
};

/**
 * Segment edge cases: overflow, negative values, zero values, empty list
 */
export const SegmentEdgeCases: Story = {
  beforeEach: mockConsoleWarn,
  render: () => (
    <Stack direction="column" gap="600" alignItems="stretch">
      <Meter
        data-testid="overflow"
        label="Overflow"
        segments={[
          { id: "a", label: "A", value: 60 },
          { id: "b", label: "B", value: 60 },
        ]}
      />
      <Meter
        data-testid="negative"
        label="Negative"
        segments={[
          { id: "a", label: "A", value: -10 },
          { id: "b", label: "B", value: 20 },
        ]}
      />
      <Meter
        data-testid="zero"
        label="Zero"
        segments={[
          { id: "a", label: "A", value: 30 },
          { id: "b", label: "B", value: 0 },
        ]}
      />
      <Meter data-testid="empty" label="Empty" segments={[]} />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Overflowing segments are cut at 100%", async () => {
      const meter = canvas.getByTestId("overflow");
      const widths = getSegments(meter).map((s) => s.style.width);
      await expect(widths).toEqual(["60%", "40%"]);
      await expect(meter).toHaveAttribute("aria-valuenow", "100");
    });

    await step("Overflow logs a development warning", async () => {
      await expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("exceeds the range")
      );
    });

    await step("Negative values count as 0", async () => {
      const meter = canvas.getByTestId("negative");
      await expect(getSegments(meter).map((s) => s.style.width)).toEqual([
        "20%",
      ]);
      await expect(meter).toHaveAttribute("aria-valuenow", "20");
    });

    await step("Negative values log a development warning", async () => {
      await expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("negative")
      );
    });

    await step("A zero segment is not drawn but is in the legend", async () => {
      const meter = canvas.getByTestId("zero");
      // Default percent format: each segment is formatted as its share of the range
      await expect(meter).toHaveAttribute(
        "aria-valuetext",
        "30% (A: 30%, B: 0%)"
      );
      await expect(getSegments(meter)).toHaveLength(1);
      const legendItems = getLegend(meter.parentElement!)!.children;
      await expect(legendItems).toHaveLength(2);
    });

    await step("An empty list renders an empty track", async () => {
      const meter = canvas.getByTestId("empty");
      await expect(getSegments(meter)).toHaveLength(0);
      await expect(meter).toHaveAttribute("aria-valuenow", "0");
    });
  },
};

/**
 * Semantic color palettes for a single value.
 * Not snapshotted: the fill colors are covered by `ColorPalettes`.
 */
export const SemanticColors: Story = {
  args: {
    value: 70,
  },
  render: (args) => (
    <Stack direction="column" gap="400" alignItems="stretch">
      {statePalettes.map((palette) => (
        <Flex key={palette} gap="400" alignItems="center">
          <Meter
            {...args}
            data-testid={`meter-${palette}`}
            label={palette}
            colorPalette={palette}
          />
          <Box
            data-testid={`reference-${palette}`}
            bg={`${palette}.11`}
            width="0"
            height="0"
          />
        </Flex>
      ))}
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    for (const palette of statePalettes) {
      await step(`Fill uses the ${palette} palette`, async () => {
        const [segment] = getSegments(canvas.getByTestId(`meter-${palette}`));
        const reference = canvas.getByTestId(`reference-${palette}`);
        await expect(getComputedStyle(segment).backgroundColor).toBe(
          getComputedStyle(reference).backgroundColor
        );
      });
    }
  },
};

/**
 * Segment colors: explicit per-segment palettes and the default sequence
 */
export const SegmentColors: Story = {
  render: () => (
    <Stack direction="column" gap="600" alignItems="stretch">
      <Meter
        data-testid="explicit"
        label="Explicit colors"
        segments={[
          { id: "ok", label: "Healthy", value: 40, colorPalette: "positive" },
          { id: "warn", label: "Degraded", value: 20, colorPalette: "warning" },
        ]}
      />
      <Box data-testid="reference-warning" bg="warning.11" w="0" h="0" />
      <Meter
        data-testid="defaults"
        label="Default colors"
        segments={[
          { id: "a", label: "A", value: 20 },
          { id: "b", label: "B", value: 20 },
          { id: "c", label: "C", value: 20 },
          { id: "d", label: "D", value: 20 },
        ]}
      />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("A segment uses its own colorPalette", async () => {
      const meter = canvas.getByTestId("explicit");
      const warning = getComputedStyle(
        canvas.getByTestId("reference-warning")
      ).backgroundColor;
      await expect(
        getComputedStyle(getSegments(meter)[1]).backgroundColor
      ).toBe(warning);
    });

    await step("The legend swatch matches its segment", async () => {
      const meter = canvas.getByTestId("explicit");
      const segments = getSegments(meter);
      const swatches = Array.from(
        getLegend(meter.parentElement!)!.querySelectorAll<HTMLElement>(
          ".nimbus-meter__legendSwatch"
        )
      );
      await expect(swatches).toHaveLength(2);
      for (const [index, swatch] of swatches.entries()) {
        await expect(getComputedStyle(swatch).backgroundColor).toBe(
          getComputedStyle(segments[index]).backgroundColor
        );
      }
    });

    await step("Adjacent default segments have different colors", async () => {
      const colors = getSegments(canvas.getByTestId("defaults")).map(
        (s) => getComputedStyle(s).backgroundColor
      );
      await expect(colors).toHaveLength(4);
      for (let i = 1; i < colors.length; i++) {
        await expect(colors[i]).not.toBe(colors[i - 1]);
      }
    });
  },
};

/**
 * Showcase Sizes
 */
export const Sizes: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack direction="column" alignItems="stretch" width="100%" gap="600">
      {sizes.map((size) => (
        <Flex key={size as string} gap="400">
          <Text textStyle="md" fontWeight="500" minWidth="20ch">
            {size as string}
          </Text>
          <Stack direction="column" flexGrow="1" gap="400" alignItems="stretch">
            <Meter value={60} label="Usage" size={size} />
            <Meter
              label="Storage"
              formatOptions={gigabytes}
              segments={storageSegments}
              size={size}
            />
          </Stack>
        </Flex>
      ))}
    </Stack>
  ),
};

/**
 * SmokeTest: layout × mode (single value / segments).
 * The layout moves the header, value text and legend, so both modes are
 * rendered in every layout. `size` and `colorPalette` only scale or recolor
 * and have their own showcases (`Sizes`, `ColorPalettes`).
 */
export const SmokeTest: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack direction="column" alignItems="stretch" width="100%" gap="800">
      {layouts.map((layout) => (
        <Flex key={layout as string} gap="400">
          <Text textStyle="md" fontWeight="500" minWidth="20ch">
            {layout as string}
          </Text>
          <Stack direction="column" flexGrow="1" gap="600" alignItems="stretch">
            <Meter
              value={45}
              label="CPU usage"
              aria-label={layout === "minimal" ? "CPU usage" : undefined}
              layout={layout}
            />
            <Meter
              label="Storage"
              aria-label={layout === "minimal" ? "Storage" : undefined}
              formatOptions={gigabytes}
              segments={storageSegments}
              layout={layout}
            />
          </Stack>
        </Flex>
      ))}
    </Stack>
  ),
};

/**
 * Showcase all color palettes for a single value
 */
export const ColorPalettes: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <DisplayColorPalettes>
      {(palette) => (
        <Meter value={70} label={palette} colorPalette={palette} size="2xs" />
      )}
    </DisplayColorPalettes>
  ),
};

/**
 * Showcase segment variations: 1, 2 and 4 segments, a zero segment, an
 * overflow, the default color sequence and explicit colors
 */
export const SegmentShowcase: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  // The overflow example logs an expected development warning
  beforeEach: mockConsoleWarn,
  render: () => (
    <Stack direction="column" alignItems="stretch" width="100%" gap="600">
      <Meter
        label="One segment"
        segments={[{ id: "a", label: "Used", value: 40 }]}
      />
      <Meter
        label="Two segments"
        formatOptions={gigabytes}
        segments={storageSegments}
      />
      <Meter
        label="Four segments"
        formatOptions={gigabytes}
        segments={[
          { id: "images", label: "Images", value: 30 },
          { id: "videos", label: "Videos", value: 20 },
          { id: "apps", label: "Apps", value: 15 },
          { id: "system", label: "System", value: 10 },
        ]}
      />
      <Meter
        label="Zero segment"
        segments={[
          { id: "a", label: "Active", value: 30 },
          { id: "b", label: "Archived", value: 0 },
        ]}
      />
      <Meter
        label="Overflow"
        segments={[
          { id: "a", label: "A", value: 70 },
          { id: "b", label: "B", value: 50 },
        ]}
      />
      <Meter
        label="Default color sequence (repeats after six)"
        segments={["1", "2", "3", "4", "5", "6", "7"].map((id) => ({
          id,
          label: `Part ${id}`,
          value: 14,
        }))}
      />
      <Meter
        label="Explicit colors"
        segments={[
          { id: "ok", label: "Healthy", value: 50, colorPalette: "positive" },
          { id: "warn", label: "Degraded", value: 25, colorPalette: "warning" },
          { id: "down", label: "Down", value: 10, colorPalette: "critical" },
        ]}
      />
    </Stack>
  ),
};

/**
 * RTL mirrors the header, the segment order and the legend
 */
export const RTLSupport: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack direction="column" alignItems="stretch" width="100%" gap="600">
      {(["ltr", "rtl"] as const).map((dir) => (
        <Stack key={dir} dir={dir} direction="column" gap="400">
          <Meter
            label={`Storage (${dir})`}
            formatOptions={gigabytes}
            segments={storageSegments}
          />
          <Meter value={45} label={`CPU usage (${dir})`} layout="inline" />
        </Stack>
      ))}
    </Stack>
  ),
};

/**
 * ReducedMotion: the width transition of segments is removed under
 * `prefers-reduced-motion: reduce`. A CSS media query cannot be mocked, so
 * the play function asserts that the compiled stylesheet ships the rule.
 * (The computed style can't be asserted: the test harness disables all
 * transitions globally.) Not snapshotted: a transition has no static visual.
 */
export const ReducedMotion: Story = {
  args: {
    value: 50,
    label: "Reduced motion",
  },
  play: async ({ canvasElement, step }) => {
    const [segment] = getSegments(within(canvasElement).getByRole("meter"));

    await step("Ships a prefers-reduced-motion rule for segments", async () => {
      const hashed = Array.from(segment.classList).find((c) =>
        c.startsWith("css-")
      );
      await expect(hashed).toBeTruthy();

      const hasReducedMotionRule = Array.from(document.styleSheets).some(
        (sheet) => {
          let rules: CSSRule[];
          try {
            rules = Array.from(sheet.cssRules);
          } catch {
            return false; // cross-origin sheet - skip
          }
          return rules.some(
            (rule) =>
              rule.cssText.includes("prefers-reduced-motion") &&
              rule.cssText.includes(`.${hashed}`)
          );
        }
      );
      await expect(hasReducedMotionRule).toBe(true);
    });
  },
};

/**
 * Layout behavior. Not snapshotted: layouts are covered by `SmokeTest`.
 */
export const Layouts: Story = {
  args: {
    value: 45,
  },
  render: (args) => (
    <Stack direction="column" alignItems="stretch" width="100%" gap="800">
      {layouts.map((layout) => (
        <Meter
          key={layout as string}
          {...args}
          data-testid={`meter-${layout}`}
          label={layout === "minimal" ? undefined : `Usage - ${layout}`}
          aria-label={layout === "minimal" ? "Usage - minimal" : undefined}
          layout={layout}
        />
      ))}
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const track = (meter: HTMLElement) =>
      meter.querySelector<HTMLElement>(".nimbus-meter__track")!;

    await step("Stacked: label and value are above the track", async () => {
      const meter = canvas.getByTestId("meter-stacked");
      const label = canvas.getByText("Usage - stacked");
      await expect(label).toBeVisible();
      await expect(getValueText(meter)).toBeVisible();
      await expect(label.getBoundingClientRect().bottom).toBeLessThanOrEqual(
        track(meter).getBoundingClientRect().top
      );
    });

    await step("Inline: label, track and value share one line", async () => {
      const meter = canvas.getByTestId("meter-inline");
      const label = canvas.getByText("Usage - inline").getBoundingClientRect();
      const bar = track(meter).getBoundingClientRect();
      const value = getValueText(meter)!.getBoundingClientRect();
      await expect(label.right).toBeLessThanOrEqual(bar.left);
      await expect(bar.right).toBeLessThanOrEqual(value.left);
      await expect(label.top).toBeLessThan(bar.bottom);
      await expect(label.bottom).toBeGreaterThan(bar.top);
    });

    await step("Minimal: only the track is shown", async () => {
      const meter = canvas.getByTestId("meter-minimal");
      await expect(track(meter)).toBeVisible();
      await expect(getValueText(meter)).not.toBeVisible();
    });

    await step("Minimal: aria-label names the meter", async () => {
      await expect(canvas.getByTestId("meter-minimal")).toHaveAccessibleName(
        "Usage - minimal"
      );
    });
  },
};

/**
 * The ref points to the element with role="meter"
 */
export const RefForwarding: Story = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      ref.current?.setAttribute("data-ref-attached", "true");
    }, []);

    return <Meter ref={ref} value={20} label="With ref" />;
  },
  play: async ({ canvasElement, step }) => {
    await step("Ref is attached to the meter element", async () => {
      await expect(within(canvasElement).getByRole("meter")).toHaveAttribute(
        "data-ref-attached",
        "true"
      );
    });
  },
};
