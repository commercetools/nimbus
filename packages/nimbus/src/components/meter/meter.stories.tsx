import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef } from "react";
import {
  Box,
  Button,
  Flex,
  Meter,
  type MeterRootProps,
  type MeterSegment,
  Stack,
  Text,
} from "@commercetools/nimbus";
import { within, expect, fn, userEvent } from "storybook/test";
import { DisplayColorPalettes } from "@/utils/display-color-palettes";

const sizes: MeterRootProps["size"][] = ["sm", "md", "lg"];
const layouts: MeterRootProps["layout"][] = ["stacked", "inline"];
const statePalettes = ["primary", "positive", "warning", "critical"] as const;

const storageSegments: MeterSegment[] = [
  { id: "images", label: "Images", value: 30 },
  { id: "videos", label: "Videos", value: 20 },
];

const gigabytes: Intl.NumberFormatOptions = { style: "unit", unit: "gigabyte" };

type MeterWithPartsProps = MeterRootProps & {
  /** Content of `Meter.Label`; without it, the label part is left out */
  label?: string;
};

/**
 * Meter with every part in the default order. Most stories test what Root
 * computes, so they share this composition. `Meter.Legend` renders nothing
 * for a single value.
 */
const MeterWithParts = ({ label, ...rootProps }: MeterWithPartsProps) => (
  <Meter.Root {...rootProps}>
    {label && <Meter.Label>{label}</Meter.Label>}
    <Meter.Value />
    <Meter.Track />
    <Meter.Legend />
  </Meter.Root>
);

/** Filled parts of the track, in DOM order */
const getSegments = (root: HTMLElement) =>
  Array.from(root.querySelectorAll<HTMLElement>(".nimbus-meter__segment"));

/** Visible value text element */
const getValueText = (root: HTMLElement) =>
  root.querySelector<HTMLElement>(".nimbus-meter__value");

/**
 * Share of the track in percent that a segment's CSS width is based on, also
 * when the width subtracts the segment's share of the gaps
 */
const getWidthPercent = (segment: HTMLElement) =>
  Number(/([\d.]+)%/.exec(segment.style.width)?.[1]);

/** Track element */
const getTrack = (root: HTMLElement) =>
  root.querySelector<HTMLElement>(".nimbus-meter__track")!;

/** Legend list element */
const getLegend = (root: HTMLElement) =>
  root.querySelector<HTMLElement>(".nimbus-meter__legend");

/** Formatted value of each legend item, in order */
const getLegendValues = (root: HTMLElement) =>
  Array.from(getLegend(root)?.children ?? []).map(
    (item) => item.lastElementChild?.textContent
  );

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
// snapshotted frames are SmokeTest, Sizes, ColorPalettes, SegmentShowcase,
// RTLSupport, TextStyle and
// Thresholds. Behavior-only stories stay un-snapshotted (project default).
const meta: Meta<typeof Meter.Root> = {
  title: "Components/Meter",
  component: Meter.Root,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof Meter.Root>;

/**
 * Base story
 * Demonstrates the most basic implementation with a single value
 */
export const Base: Story = {
  render: () => (
    <MeterWithParts value={40} label="CPU usage" data-testid="meter-test" />
  ),
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

    await step("Meter.Legend renders nothing for a single value", async () => {
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
      <MeterWithParts value={50} label="Disk usage" />
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
  render: () => (
    <MeterWithParts
      value={35}
      minValue={10}
      maxValue={60}
      label="Temperature"
      formatOptions={{ style: "unit", unit: "celsius" }}
    />
  ),
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
      <MeterWithParts
        data-testid="percent"
        value={72}
        label="Default (percent)"
      />
      <MeterWithParts
        data-testid="unit"
        value={50}
        label="Unit"
        formatOptions={gigabytes}
      />
      <MeterWithParts
        data-testid="value-label"
        value={50}
        label="Custom value label"
        valueLabel="50 of 100 GB"
      />
      <MeterWithParts
        data-testid="empty-value-label"
        value={60}
        label="Empty value label"
        valueLabel=""
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

    await step(
      "An empty valueLabel counts as not set: the visible and announced text match",
      async () => {
        const meter = canvas.getByTestId("empty-value-label");
        await expect(getValueText(meter)).toHaveTextContent("60%");
        await expect(meter).toHaveAttribute("aria-valuetext", "60%");
      }
    );
  },
};

/**
 * Children of Meter.Value replace the visible text only; assistive technology
 * announces valueLabel. Without valueLabel, a development warning is logged.
 * Not snapshotted: the text styles are covered by `TextStyle`.
 */
export const CustomValueContent: Story = {
  beforeEach: mockConsoleWarn,
  render: () => (
    <Stack direction="column" gap="400" alignItems="stretch">
      <Meter.Root
        data-testid="with-value-label"
        value={50}
        valueLabel="50 of 100 GB"
      >
        <Meter.Label>Storage</Meter.Label>
        <Meter.Value>
          <strong>50</strong> of 100 GB
        </Meter.Value>
        <Meter.Track />
      </Meter.Root>
      <Meter.Root data-testid="without-value-label" value={30}>
        <Meter.Label>Seats</Meter.Label>
        <Meter.Value>
          <strong>3</strong> of 10 seats
        </Meter.Value>
        <Meter.Track />
      </Meter.Root>
      <Meter.Root data-testid="empty-children" value={40}>
        <Meter.Label>Empty children</Meter.Label>
        <Meter.Value>{false}</Meter.Value>
        <Meter.Track />
      </Meter.Root>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const valueWarnings = () =>
      (console.warn as ReturnType<typeof fn>).mock.calls
        .map(([message]) => String(message))
        .filter((message) => message.startsWith("Meter.Value:"));

    await step("Children replace the visible value text", async () => {
      const value = getValueText(canvas.getByTestId("with-value-label"));
      await expect(value).toHaveTextContent("50 of 100 GB");
      await expect(value?.querySelector("strong")).toHaveTextContent("50");
    });

    await step("Assistive technology announces valueLabel", async () => {
      await expect(canvas.getByTestId("with-value-label")).toHaveAttribute(
        "aria-valuetext",
        "50 of 100 GB"
      );
    });

    await step(
      "Without valueLabel, the formatted total is announced",
      async () => {
        await expect(canvas.getByTestId("without-value-label")).toHaveAttribute(
          "aria-valuetext",
          "30%"
        );
      }
    );

    await step(
      "Children that render nothing leave the formatted total in place",
      async () => {
        const meter = canvas.getByTestId("empty-children");
        await expect(getValueText(meter)).toHaveTextContent("40%");
        await expect(meter).toHaveAttribute("aria-valuetext", "40%");
      }
    );

    await step("Children without valueLabel log one warning", async () => {
      // Only the second meter: the first one has a valueLabel, and the third
      // one has no children that render anything
      await expect(valueWarnings()).toHaveLength(1);
    });
  },
};

/**
 * Values outside the range are clamped, including `Infinity` (for example
 * `used / limit` with a limit of 0)
 */
export const Clamping: Story = {
  render: () => (
    <Stack direction="column" gap="400" alignItems="stretch">
      <MeterWithParts data-testid="above" value={150} label="Above maximum" />
      <MeterWithParts data-testid="below" value={-10} label="Below minimum" />
      <MeterWithParts
        data-testid="empty-range"
        value={50}
        minValue={50}
        maxValue={50}
        label="Empty range"
      />
      <MeterWithParts
        data-testid="infinity"
        value={Infinity}
        label="Infinity"
      />
      <MeterWithParts
        data-testid="negative-infinity"
        value={-Infinity}
        label="Negative infinity"
      />
      <MeterWithParts data-testid="not-a-number" value={NaN} label="NaN" />
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

    await step("Infinity fills 100%", async () => {
      const meter = canvas.getByTestId("infinity");
      await expect(getSegments(meter)[0].style.width).toBe("100%");
      await expect(meter).toHaveAttribute("aria-valuenow", "100");
      await expect(getValueText(meter)).toHaveTextContent("100%");
    });

    await step("-Infinity and NaN fill 0%", async () => {
      for (const testId of ["negative-infinity", "not-a-number"]) {
        const meter = canvas.getByTestId(testId);
        await expect(getSegments(meter)).toHaveLength(0);
        await expect(meter).toHaveAttribute("aria-valuenow", "0");
        await expect(getValueText(meter)).toHaveTextContent("0%");
      }
    });
  },
};

/**
 * Decimal values keep their exact value: the announced value has no rounding
 * errors, and a threshold applies at its own value
 */
export const DecimalValues: Story = {
  render: () => (
    <Stack direction="column" gap="400" alignItems="stretch">
      <MeterWithParts
        data-testid="threshold-boundary"
        label="Value equals the threshold"
        value={0.1}
        maxValue={1}
        formatOptions={{ style: "decimal", maximumFractionDigits: 20 }}
        thresholds={[{ from: 0.1, colorPalette: "warning" }]}
      />
      <MeterWithParts
        data-testid="decimal-range"
        label="Decimal range"
        value={0.3}
        minValue={0.1}
        maxValue={0.7}
        formatOptions={{ style: "decimal", maximumFractionDigits: 20 }}
      />
      {/* Zero-size color reference, out of the layout */}
      <Box
        data-testid="reference-warning"
        bg="warning.9"
        position="absolute"
        width="0"
        height="0"
      />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("The announced value is the exact value", async () => {
      const meter = canvas.getByTestId("threshold-boundary");
      await expect(meter).toHaveAttribute("aria-valuenow", "0.1");
      await expect(meter).toHaveAttribute("aria-valuetext", "0.1");
      await expect(getValueText(meter)).toHaveTextContent("0.1");
    });

    await step("A threshold applies at its own value", async () => {
      const [segment] = getSegments(canvas.getByTestId("threshold-boundary"));
      const reference = canvas.getByTestId("reference-warning");
      await expect(getComputedStyle(segment).backgroundColor).toBe(
        getComputedStyle(reference).backgroundColor
      );
    });

    await step("A decimal range keeps the exact value", async () => {
      const meter = canvas.getByTestId("decimal-range");
      await expect(meter).toHaveAttribute("aria-valuenow", "0.3");
      await expect(getValueText(meter)).toHaveTextContent("0.3");
    });
  },
};

/**
 * Multiple segments of one total
 */
export const Segments: Story = {
  render: () => (
    <MeterWithParts
      label="Storage"
      maxValue={100}
      formatOptions={gigabytes}
      segments={storageSegments}
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const meter = canvas.getByRole("meter");

    await step("Renders exactly one meter", async () => {
      await expect(canvas.getAllByRole("meter")).toHaveLength(1);
      // No element inside the meter has an explicit role. Scoped to the meter
      // because other stories can leave portaled elements (e.g. toast
      // regions) in the canvas.
      await expect(meter.querySelectorAll("[role]")).toHaveLength(0);
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
      await expect(segments.map(getWidthPercent)).toEqual([30, 20]);
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
 * Segment geometry: the gaps between segments must not make the fill longer
 * than the value. Not snapshotted: measured in the play function.
 */
export const SegmentGeometry: Story = {
  render: () => (
    <Stack direction="column" gap="600" width="400px">
      {sizes.map((size) => (
        <MeterWithParts
          key={size as string}
          data-testid={`meter-${size}`}
          size={size}
          label={`Three segments, size ${size}`}
          segments={[
            { id: "a", label: "A", value: 20 },
            { id: "b", label: "B", value: 20 },
            { id: "c", label: "C", value: 10 },
          ]}
        />
      ))}
      <MeterWithParts
        data-testid="full"
        label="Full"
        segments={[
          { id: "a", label: "A", value: 70 },
          { id: "b", label: "B", value: 30 },
        ]}
      />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    for (const size of sizes) {
      await step(`Size ${size}: the fill ends at the total (50%)`, async () => {
        const meter = canvas.getByTestId(`meter-${size}`);
        const track = getTrack(meter).getBoundingClientRect();
        const segments = getSegments(meter).map((segment) =>
          segment.getBoundingClientRect()
        );
        const fillEnd = segments[segments.length - 1].right;
        await expect(
          Math.abs(fillEnd - (track.left + track.width * 0.5))
        ).toBeLessThan(0.5);
      });
    }

    await step("Equal values get equal widths", async () => {
      const [a, b] = getSegments(canvas.getByTestId("meter-md")).map(
        (segment) => segment.getBoundingClientRect().width
      );
      await expect(Math.abs(a - b)).toBeLessThan(0.5);
    });

    await step("A full meter fills the whole track", async () => {
      const meter = canvas.getByTestId("full");
      const track = getTrack(meter).getBoundingClientRect();
      const segments = getSegments(meter);
      const last = segments[segments.length - 1].getBoundingClientRect();
      await expect(Math.abs(last.right - track.right)).toBeLessThan(0.5);
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
      <MeterWithParts
        data-testid="overflow"
        label="Overflow"
        segments={[
          { id: "a", label: "A", value: 60 },
          { id: "b", label: "B", value: 60 },
        ]}
      />
      <MeterWithParts
        data-testid="negative"
        label="Negative"
        segments={[
          { id: "a", label: "A", value: -10 },
          { id: "b", label: "B", value: 20 },
        ]}
      />
      <MeterWithParts
        data-testid="zero"
        label="Zero"
        segments={[
          { id: "a", label: "A", value: 30 },
          { id: "b", label: "B", value: 0 },
        ]}
      />
      <MeterWithParts data-testid="empty" label="Empty" segments={[]} />
      <MeterWithParts
        data-testid="exact-fit"
        label="Exact fit"
        maxValue={0.3}
        segments={[
          { id: "a", label: "A", value: 0.1 },
          { id: "b", label: "B", value: 0.2 },
        ]}
      />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Overflowing segments are cut at 100%", async () => {
      const meter = canvas.getByTestId("overflow");
      const widths = getSegments(meter).map(getWidthPercent);
      await expect(widths).toEqual([60, 40]);
      await expect(meter).toHaveAttribute("aria-valuenow", "100");
    });

    await step("Overflowing segments show the drawn amount", async () => {
      const meter = canvas.getByTestId("overflow");
      await expect(meter).toHaveAttribute(
        "aria-valuetext",
        "100% (A: 60%, B: 40%)"
      );
      await expect(getLegendValues(meter)).toEqual(["60%", "40%"]);
    });

    await step("Overflow logs a development warning", async () => {
      await expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("exceeds the range")
      );
    });

    await step("Negative values count as 0", async () => {
      const meter = canvas.getByTestId("negative");
      await expect(getSegments(meter).map(getWidthPercent)).toEqual([20]);
      await expect(meter).toHaveAttribute("aria-valuenow", "20");
      await expect(meter).toHaveAttribute(
        "aria-valuetext",
        "20% (A: 0%, B: 20%)"
      );
      await expect(getLegendValues(meter)).toEqual(["0%", "20%"]);
    });

    await step("Negative values log a development warning", async () => {
      await expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("negative")
      );
    });

    await step("Each warning is logged once per meter", async () => {
      const messages = (console.warn as ReturnType<typeof fn>).mock.calls.map(
        ([message]) => String(message)
      );
      await expect(
        messages.filter((message) => message.includes("exceeds the range"))
      ).toHaveLength(1);
      await expect(
        messages.filter((message) => message.includes("must not be negative"))
      ).toHaveLength(1);
    });

    await step("A zero segment is not drawn but is in the legend", async () => {
      const meter = canvas.getByTestId("zero");
      // Default percent format: each segment is formatted as its share of the range
      await expect(meter).toHaveAttribute(
        "aria-valuetext",
        "30% (A: 30%, B: 0%)"
      );
      await expect(getSegments(meter)).toHaveLength(1);
      const legendItems = getLegend(meter)!.children;
      await expect(legendItems).toHaveLength(2);
    });

    await step("An empty list renders an empty track", async () => {
      const meter = canvas.getByTestId("empty");
      await expect(getSegments(meter)).toHaveLength(0);
      await expect(meter).toHaveAttribute("aria-valuenow", "0");
    });

    await step(
      "Floating-point rounding errors are not an overflow",
      async () => {
        // 0.1 + 0.2 is 0.30000000000000004. Only the Overflow meter may log
        // the overflow warning, so it is logged once in total.
        const meter = canvas.getByTestId("exact-fit");
        await expect(getSegments(meter)).toHaveLength(2);
        const messages = (console.warn as ReturnType<typeof fn>).mock.calls.map(
          ([message]) => String(message)
        );
        await expect(
          messages.filter((message) => message.includes("exceeds the range"))
        ).toHaveLength(1);
      }
    );
  },
};

/**
 * Semantic color palettes for a single value.
 * Not snapshotted: the fill colors are covered by `ColorPalettes`.
 */
export const SemanticColors: Story = {
  render: () => (
    <Stack direction="column" gap="400" alignItems="stretch">
      {statePalettes.map((palette) => (
        <Flex key={palette} gap="400" alignItems="center">
          <MeterWithParts
            value={70}
            data-testid={`meter-${palette}`}
            label={palette}
            colorPalette={palette}
          />
          <Box
            data-testid={`reference-${palette}`}
            bg={`${palette}.9`}
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

const storageThresholds = [
  // Out of order on purpose: the order must not matter
  { from: 95, colorPalette: "critical" as const },
  { from: 80, colorPalette: "warning" as const },
];

/**
 * Thresholds: the fill color follows the threshold the value reaches
 */
export const Thresholds: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack direction="column" gap="400" alignItems="stretch">
      {[50, 80, 94, 95, 120].map((value) => (
        <MeterWithParts
          key={value}
          data-testid={`meter-${value}`}
          label={`Storage at ${value}`}
          value={value}
          thresholds={storageThresholds}
        />
      ))}
      {/* Zero-size color references, out of the layout so they leave no gap */}
      {(["primary", "warning", "critical"] as const).map((palette) => (
        <Box
          key={palette}
          data-testid={`reference-${palette}`}
          bg={`${palette}.9`}
          position="absolute"
          width="0"
          height="0"
        />
      ))}
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const fillColor = (value: number) =>
      getComputedStyle(getSegments(canvas.getByTestId(`meter-${value}`))[0])
        .backgroundColor;
    const referenceColor = (palette: string) =>
      getComputedStyle(canvas.getByTestId(`reference-${palette}`))
        .backgroundColor;

    const expected: Array<[number, string]> = [
      [50, "primary"],
      [80, "warning"],
      [94, "warning"],
      [95, "critical"],
      // Clamped to 100, which is above the last threshold
      [120, "critical"],
    ];
    for (const [value, palette] of expected) {
      await step(`Value ${value} uses the ${palette} palette`, async () => {
        await expect(fillColor(value)).toBe(referenceColor(palette));
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
      <MeterWithParts
        data-testid="explicit"
        label="Explicit colors"
        segments={[
          { id: "ok", label: "Healthy", value: 40, colorPalette: "positive" },
          { id: "warn", label: "Degraded", value: 20, colorPalette: "warning" },
        ]}
      />
      <Box data-testid="reference-warning" bg="warning.9" w="0" h="0" />
      <MeterWithParts
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
        getLegend(meter)!.querySelectorAll<HTMLElement>(
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
            <Meter.Root value={60} size={size} aria-label="Usage">
              <Meter.Track />
            </Meter.Root>
            <MeterWithParts value={60} label="Usage" size={size} />
            <MeterWithParts
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
 * Text style: the default follows `size`, the `textStyle` style prop on Root
 * changes every part, and on one part it changes only that part.
 */
export const TextStyle: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack direction="column" alignItems="stretch" width="100%" gap="800">
      <MeterWithParts
        data-testid="size-lg"
        size="lg"
        label="Default for size lg"
        value={62}
      />
      <MeterWithParts
        data-testid="root-md"
        size="sm"
        textStyle="md"
        label="textStyle md on Root, size sm"
        formatOptions={gigabytes}
        segments={storageSegments}
      />
      <Meter.Root data-testid="value-xl" value={96} size="sm">
        <Meter.Label>textStyle xl on Meter.Value only</Meter.Label>
        <Meter.Value textStyle="xl" fontWeight="700" />
        <Meter.Track />
      </Meter.Root>
      {/* Zero-size references for the computed font sizes */}
      {(["sm", "md", "xl"] as const).map((textStyle) => (
        <Text
          key={textStyle}
          data-testid={`reference-${textStyle}`}
          textStyle={textStyle}
          position="absolute"
          width="0"
          height="0"
          overflow="hidden"
        >
          x
        </Text>
      ))}
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const fontSize = (element: HTMLElement) =>
      getComputedStyle(element).fontSize;
    const reference = (textStyle: string) =>
      fontSize(canvas.getByTestId(`reference-${textStyle}`));

    await step("Without textStyle, size lg uses text style md", async () => {
      const meter = canvas.getByTestId("size-lg");
      await expect(fontSize(canvas.getByText("Default for size lg"))).toBe(
        reference("md")
      );
      await expect(fontSize(getValueText(meter)!)).toBe(reference("md"));
    });

    await step("textStyle on Root applies to every part", async () => {
      const meter = canvas.getByTestId("root-md");
      await expect(
        fontSize(canvas.getByText("textStyle md on Root, size sm"))
      ).toBe(reference("md"));
      await expect(fontSize(getValueText(meter)!)).toBe(reference("md"));
      await expect(fontSize(getLegend(meter)!)).toBe(reference("md"));
    });

    await step(
      "textStyle on Meter.Value applies only to the value",
      async () => {
        const meter = canvas.getByTestId("value-xl");
        await expect(fontSize(getValueText(meter)!)).toBe(reference("xl"));
        // size sm keeps its default text style (xs) for the label
        await expect(
          fontSize(canvas.getByText("textStyle xl on Meter.Value only"))
        ).not.toBe(reference("xl"));
      }
    );
  },
};

/**
 * SmokeTest: layout × mode (single value / segments).
 * The layout moves the label, value text and legend, so both modes are
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
            <MeterWithParts value={45} label="CPU usage" layout={layout} />
            <MeterWithParts
              label="Storage"
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
        <MeterWithParts
          value={70}
          label={palette}
          colorPalette={palette}
          size="sm"
        />
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
      <MeterWithParts
        label="One segment"
        segments={[{ id: "a", label: "Used", value: 40 }]}
      />
      <MeterWithParts
        label="Two segments"
        formatOptions={gigabytes}
        segments={storageSegments}
      />
      <MeterWithParts
        label="Four segments"
        formatOptions={gigabytes}
        segments={[
          { id: "images", label: "Images", value: 30 },
          { id: "videos", label: "Videos", value: 20 },
          { id: "apps", label: "Apps", value: 15 },
          { id: "system", label: "System", value: 10 },
        ]}
      />
      <MeterWithParts
        label="Zero segment"
        segments={[
          { id: "a", label: "Active", value: 30 },
          { id: "b", label: "Archived", value: 0 },
        ]}
      />
      <MeterWithParts
        label="Overflow"
        segments={[
          { id: "a", label: "A", value: 70 },
          { id: "b", label: "B", value: 50 },
        ]}
      />
      <MeterWithParts
        label="Default color sequence (repeats after six)"
        segments={["1", "2", "3", "4", "5", "6", "7"].map((id) => ({
          id,
          label: `Part ${id}`,
          value: 14,
        }))}
      />
      <MeterWithParts
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
 * RTL mirrors the label and value, the segment order and the legend
 */
export const RTLSupport: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack direction="column" alignItems="stretch" width="100%" gap="600">
      {(["ltr", "rtl"] as const).map((dir) => (
        <Stack key={dir} dir={dir} direction="column" gap="400">
          <MeterWithParts
            label={`Storage (${dir})`}
            formatOptions={gigabytes}
            segments={storageSegments}
          />
          <MeterWithParts
            value={45}
            label={`CPU usage (${dir})`}
            layout="inline"
          />
        </Stack>
      ))}
    </Stack>
  ),
};

/**
 * ReducedMotion: the width transition of segments is removed under
 * `prefers-reduced-motion: reduce`. A CSS media query cannot be mocked, so
 * the play function asserts that the compiled stylesheet ships the rule, not
 * the computed style of the reduced-motion state. Not snapshotted: a
 * transition has no static visual.
 */
export const ReducedMotion: Story = {
  render: () => <MeterWithParts value={50} label="Reduced motion" />,
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
  render: () => (
    <Stack direction="column" alignItems="stretch" width="100%" gap="800">
      {layouts.map((layout) => (
        <MeterWithParts
          key={layout as string}
          value={45}
          data-testid={`meter-${layout}`}
          label={`Usage - ${layout}`}
          layout={layout}
        />
      ))}
      {layouts.map((layout) => (
        // Same parts in reverse order: the layout must not change
        <Meter.Root
          key={`reversed-${layout as string}`}
          data-testid={`reversed-${layout}`}
          layout={layout}
          segments={storageSegments}
        >
          <Meter.Legend />
          <Meter.Track />
          <Meter.Value />
          <Meter.Label>{`Reversed - ${layout}`}</Meter.Label>
        </Meter.Root>
      ))}
      <Meter.Root data-testid="track-only" value={45} aria-label="Usage">
        <Meter.Track />
      </Meter.Root>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const box = (element: HTMLElement) => element.getBoundingClientRect();

    await step("Stacked: label and value are above the track", async () => {
      const meter = canvas.getByTestId("meter-stacked");
      const label = canvas.getByText("Usage - stacked");
      await expect(label).toBeVisible();
      await expect(getValueText(meter)).toBeVisible();
      await expect(box(label).bottom).toBeLessThanOrEqual(
        box(getTrack(meter)).top
      );
      await expect(box(getValueText(meter)!).bottom).toBeLessThanOrEqual(
        box(getTrack(meter)).top
      );
    });

    await step("Inline: label, track and value share one line", async () => {
      const meter = canvas.getByTestId("meter-inline");
      const label = box(canvas.getByText("Usage - inline"));
      const bar = box(getTrack(meter));
      const value = box(getValueText(meter)!);
      await expect(label.right).toBeLessThanOrEqual(bar.left);
      await expect(bar.right).toBeLessThanOrEqual(value.left);
      // Each text overlaps the bar vertically, so all three are on one line
      for (const text of [label, value]) {
        await expect(text.top).toBeLessThan(bar.bottom);
        await expect(text.bottom).toBeGreaterThan(bar.top);
      }
    });

    await step("Stacked: the order of the parts does not matter", async () => {
      const meter = canvas.getByTestId("reversed-stacked");
      const label = box(canvas.getByText("Reversed - stacked"));
      const value = box(getValueText(meter)!);
      const bar = box(getTrack(meter));
      const legend = box(getLegend(meter)!);
      await expect(label.right).toBeLessThanOrEqual(value.left);
      await expect(label.bottom).toBeLessThanOrEqual(bar.top);
      await expect(value.bottom).toBeLessThanOrEqual(bar.top);
      await expect(bar.bottom).toBeLessThanOrEqual(legend.top);
    });

    await step("Inline: the order of the parts does not matter", async () => {
      const meter = canvas.getByTestId("reversed-inline");
      const label = box(canvas.getByText("Reversed - inline"));
      const bar = box(getTrack(meter));
      const value = box(getValueText(meter)!);
      const legend = box(getLegend(meter)!);
      await expect(label.right).toBeLessThanOrEqual(bar.left);
      await expect(bar.right).toBeLessThanOrEqual(value.left);
      await expect(bar.bottom).toBeLessThanOrEqual(legend.top);
    });

    await step(
      "Only the track: no empty space for left-out parts",
      async () => {
        const meter = canvas.getByTestId("track-only");
        await expect(getTrack(meter)).toBeVisible();
        await expect(getValueText(meter)).toBeNull();
        await expect(box(meter).height).toBe(box(getTrack(meter)).height);
      }
    );

    await step("Only the track: aria-label names the meter", async () => {
      const meter = canvas.getByTestId("track-only");
      await expect(meter).toHaveAccessibleName("Usage");
      await expect(meter).toHaveAttribute("aria-valuenow", "45");
      await expect(meter).toHaveAttribute("aria-valuetext", "45%");
    });
  },
};

/**
 * Development warnings for parts that are left out: React Aria's warning for
 * a missing name, and Meter's warning for segments without a legend.
 */
export const MissingParts: Story = {
  beforeEach: mockConsoleWarn,
  parameters: {
    a11y: {
      // Set in `options`, not in `config.rules`: a story's own `config.rules`
      // would replace the global rule list (see `.storybook/preview.tsx`)
      options: {
        rules: {
          // The first meter has no name on purpose, to check React Aria's
          // warning. Every other rule stays on for this story.
          "aria-meter-name": { enabled: false },
        },
      },
    },
  },
  render: () => (
    <Stack direction="column" gap="600" alignItems="stretch">
      <Meter.Root value={40}>
        <Meter.Track />
      </Meter.Root>
      <Meter.Root aria-label="Storage" segments={storageSegments}>
        <Meter.Track />
      </Meter.Root>
      <MeterWithParts label="With legend" segments={storageSegments} />
      <Meter.Root aria-label="Single value" value={40}>
        <Meter.Track />
      </Meter.Root>
    </Stack>
  ),
  play: async ({ step }) => {
    const warnings = () =>
      (console.warn as ReturnType<typeof fn>).mock.calls.map(([message]) =>
        String(message)
      );

    await step("A meter without a name logs React Aria's warning", async () => {
      await expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("aria-label or aria-labelledby")
      );
    });

    await step("Segments without Meter.Legend log one warning", async () => {
      const legendWarnings = warnings().filter((message) =>
        message.includes("<Meter.Legend>")
      );
      // Only the second meter: the third has a legend, the fourth one value
      await expect(legendWarnings).toHaveLength(1);
    });
  },
};

/**
 * Naming with Meter.Label and an extra aria-labelledby on Root: the visible
 * label stays part of the name, and the referenced element adds context.
 * Not snapshotted: no visual difference to `Base`.
 */
export const LabelWithContext: Story = {
  render: () => (
    <Stack direction="column" gap="400" alignItems="stretch">
      <Text id="plan-heading" fontWeight="600">
        Business plan
      </Text>
      <Meter.Root value={40} aria-labelledby="plan-heading">
        <Meter.Label>Storage</Meter.Label>
        <Meter.Value />
        <Meter.Track />
      </Meter.Root>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const meter = within(canvasElement).getByRole("meter");

    await step("Meter.Label stays linked next to aria-labelledby", async () => {
      const ids = meter.getAttribute("aria-labelledby")?.split(" ") ?? [];
      await expect(ids).toHaveLength(2);
      await expect(ids).toContain("plan-heading");
      await expect(document.getElementById(ids[0])).toHaveTextContent(
        "Storage"
      );
    });

    await step("The name starts with the visible label", async () => {
      await expect(meter).toHaveAccessibleName("Storage Business plan");
    });
  },
};

/**
 * Every part forwards its ref to its own element
 */
export const RefForwarding: Story = {
  render: () => {
    const rootRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);
    const valueRef = useRef<HTMLSpanElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const legendRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
      for (const [name, ref] of Object.entries({
        root: rootRef,
        label: labelRef,
        value: valueRef,
        track: trackRef,
        legend: legendRef,
      })) {
        ref.current?.setAttribute("data-ref", name);
      }
    }, []);

    return (
      <Meter.Root ref={rootRef} segments={storageSegments}>
        <Meter.Label ref={labelRef}>With refs</Meter.Label>
        <Meter.Value ref={valueRef} />
        <Meter.Track ref={trackRef} />
        <Meter.Legend ref={legendRef} />
      </Meter.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const meter = within(canvasElement).getByRole("meter");
    const byRef = (name: string) =>
      canvasElement.querySelector<HTMLElement>(`[data-ref="${name}"]`);

    await step("Root ref is attached to the meter element", async () => {
      await expect(byRef("root")).toBe(meter);
    });

    await step("Each part ref is attached to its own element", async () => {
      await expect(byRef("label")?.tagName).toBe("SPAN");
      await expect(byRef("label")).toHaveTextContent("With refs");
      await expect(byRef("value")).toBe(getValueText(meter));
      await expect(byRef("track")).toBe(getTrack(meter));
      await expect(byRef("legend")).toBe(getLegend(meter));
    });
  },
};
