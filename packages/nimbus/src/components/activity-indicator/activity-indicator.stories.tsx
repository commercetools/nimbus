import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ActivityIndicator,
  type ActivityIndicatorProps,
  Alert,
  Box,
  Button,
  Card,
  LoadingSpinner,
  Stack,
  Text,
  TextInput,
} from "@commercetools/nimbus";
import { within, expect } from "storybook/test";
import { DisplayColorPalettes } from "@/utils/display-color-palettes";

const sizes: ActivityIndicatorProps["size"][] = [
  "inherit",
  "2xs",
  "xs",
  "sm",
  "md",
  "lg",
];

const meta: Meta<typeof ActivityIndicator> = {
  title: "Components/ActivityIndicator",
  component: ActivityIndicator,
};

export default meta;

type Story = StoryObj<typeof ActivityIndicator>;

/**
 * Default: decorative (no `aria-label`), `size="inherit"`. Renders a single
 * `<svg>` with three `<circle>` dots inside a `<span>` root.
 */
export const Base: Story = {
  args: {
    "data-testid": "activity-test",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const indicator = canvas.getByTestId("activity-test");

    await step("Uses a <span> root element", async () => {
      await expect(indicator.tagName).toBe("SPAN");
    });

    await step("Renders a single <svg> with three <circle> dots", async () => {
      await expect(indicator.querySelectorAll("svg").length).toBe(1);
      const dots = indicator.querySelectorAll("[data-dot]");
      await expect(dots.length).toBe(3);
      dots.forEach((dot) => expect(dot.tagName.toLowerCase()).toBe("circle"));
    });

    await step("Is decorative by default (aria-hidden, no role)", async () => {
      await expect(indicator).toHaveAttribute("aria-hidden", "true");
      await expect(indicator).not.toHaveAttribute("role");
    });
  },
};

/**
 * When an `aria-label` is provided the indicator becomes a polite live region.
 */
export const Labeled: Story = {
  args: {
    "data-testid": "activity-test",
    "aria-label": "Agent is thinking",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const indicator = canvas.getByTestId("activity-test");

    await step("Exposes role=status and aria-live=polite", async () => {
      await expect(indicator).toHaveAttribute("role", "status");
      await expect(indicator).toHaveAttribute("aria-live", "polite");
    });

    await step("Is not aria-hidden when labeled", async () => {
      await expect(indicator).not.toHaveAttribute("aria-hidden");
    });

    await step("Accessible name matches the label", async () => {
      await expect(
        canvas.getByRole("status", { name: "Agent is thinking" })
      ).toBeInTheDocument();
    });
  },
};

/**
 * The default `inherit` size flows inline with text and scales with the
 * surrounding `font-size`. Fixed sizes reserve a square icon-box footprint.
 */
export const InlineWithText: Story = {
  render: (args) => (
    <Stack direction="column" gap="400" alignItems="flex-start">
      <Text fontSize="sm">
        Thinking <ActivityIndicator {...args} />
      </Text>
      <Text fontSize="xl">
        Thinking <ActivityIndicator {...args} />
      </Text>
    </Stack>
  ),
  args: {},
};

/**
 * All sizes: `inherit` plus the fixed icon-box sizes.
 */
export const Sizes: Story = {
  render: (args) => (
    <Stack direction="row" gap="400" alignItems="center">
      {sizes.map((size) => (
        <ActivityIndicator key={size as string} {...args} size={size} />
      ))}
    </Stack>
  ),
  args: {
    "data-testid": "activity-test",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const indicators = canvas.getAllByTestId("activity-test");

    await step("Renders an indicator for every size", async () => {
      await expect(indicators.length).toBe(sizes.length);
    });

    await step("Each indicator still renders three dots", async () => {
      indicators.forEach((indicator) =>
        expect(indicator.querySelectorAll("[data-dot]").length).toBe(3)
      );
    });
  },
};

/**
 * Placed inside a `TextInput` as a leading (prefix) or trailing (suffix) icon.
 * A fixed `size` reserves the same square icon-box footprint a LoadingSpinner
 * uses at that size, so toggling between the two does not shift the layout.
 *
 * Use the button to toggle between the ActivityIndicator and a LoadingSpinner in
 * both slots, to compare how each reads inside an input.
 */
export const InsideInput: Story = {
  render: () => {
    const [showSpinner, setShowSpinner] = useState(false);

    const indicator = showSpinner ? (
      <LoadingSpinner size="xs" aria-label="Generating a response" />
    ) : (
      <ActivityIndicator size="xs" />
    );

    return (
      <Stack direction="column" gap="400" alignItems="flex-start" width="320px">
        <Button
          variant="outline"
          size="xs"
          onPress={() => setShowSpinner((prev) => !prev)}
        >
          {showSpinner ? "Show activity indicator" : "Show loading spinner"}
        </Button>
        <TextInput
          aria-label="Agent response, generating (leading indicator)"
          defaultValue="Generating a response"
          isReadOnly
          leadingElement={indicator}
        />
        <TextInput
          aria-label="Agent response, generating (trailing indicator)"
          defaultValue="Generating a response"
          isReadOnly
          trailingElement={indicator}
        />
      </Stack>
    );
  },
};

const fixedSizes = ["2xs", "xs", "sm", "md", "lg"] as const;

// Box footprint token per fixed size (matches LoadingSpinner's scale points).
const sizeToBox: Record<(typeof fixedSizes)[number], string> = {
  "2xs": "350",
  xs: "500",
  sm: "600",
  md: "800",
  lg: "1000",
};

/**
 * Calibration aid. Per fixed size, from left to right:
 * the LoadingSpinner (box outlined green), the ActivityIndicator (box outlined
 * red), and the two overlaid (dots on top of the spinner) — both boxes are the
 * same square footprint, so the outlines should coincide.
 */
export const SizeCalibration: Story = {
  render: () => (
    <Stack direction="column" gap="600" alignItems="flex-start">
      {fixedSizes.map((size) => (
        <Stack key={size} direction="row" gap="800" alignItems="center">
          <Text width="800" fontWeight="600">
            {size}
          </Text>
          <LoadingSpinner
            size={size}
            aria-label={`Spinner ${size}`}
            outline="1px solid"
            outlineColor="positive.9"
          />
          <ActivityIndicator
            size={size}
            outline="1px solid"
            outlineColor="critical.9"
          />
          {/* Fixed-size container; both children absolutely positioned and
              filling it, so the boxes coincide exactly. */}
          <Box position="relative" boxSize={sizeToBox[size]}>
            <LoadingSpinner
              size={size}
              aria-label={`Spinner overlay ${size}`}
              position="absolute"
              inset="0"
              outline="1px solid"
              outlineColor="positive.9"
            />
            <ActivityIndicator
              size={size}
              position="absolute"
              inset="0"
              outline="1px solid"
              outlineColor="critical.9"
            />
          </Box>
        </Stack>
      ))}
    </Stack>
  ),
};

/**
 * The indicator across every Nimbus color palette (semantic, brand, and system
 * groups), rendered at a fixed `md` size. The dots fill with the palette's
 * `colorPalette.11` shade. The `primary` and `white` aliases remap to their
 * alpha palettes for overlaying colored surfaces.
 */
export const ColorPalettes: Story = {
  render: () => (
    <DisplayColorPalettes>
      {(palette) => (
        <ActivityIndicator key={palette} size="md" colorPalette={palette} />
      )}
    </DisplayColorPalettes>
  ),
};

// --- Exploration aid (temporary) ---------------------------------------------
// Compares candidate dot geometries on the 24×24 icon grid so we can pick the
// final drawing. Each variant is an inline <svg> (the component hardcodes one
// set of coordinates). Tweak `r`/`cx` here and judge live via Storybook HMR.
// Dots stay at the clean integer r=3 (⌀6) — no half-pixel radii (they
// anti-alias badly). The variable is *spacing*: push the outer dots toward the
// grid edges to widen the gaps between dots.
const dotGeometries = [
  {
    label: "Current",
    r: 3,
    cx: [5, 12, 19],
    note: "r=3 (⌀6) · cx 5/12/19 · ~1px gaps, 2px outer padding",
  },
  {
    label: "Wider gap",
    r: 3,
    cx: [4, 12, 20],
    note: "r=3 (⌀6) · cx 4/12/20 · ~2px gaps, ~1px outer padding",
  },
  {
    label: "Outer dots to edges",
    r: 3,
    cx: [3, 12, 21],
    note: "r=3 (⌀6) · cx 3/12/21 · outer dots flush to edges, ~3px gaps",
  },
] as const;

const dotDelays = ["0s", "0.15s", "0.3s"];
const dotOpacities = [0.4, 0.6, 0.8];

// Keycap emojis so colleagues can vote on a variant by number.
const keycaps = ["1️⃣", "2️⃣", "3️⃣", "4️⃣"];

// One alert tone per geometry variant (for the color-inheritance row).
const alertTones = ["critical", "warning", "positive"] as const;

// Derived geometry metrics (in 24-grid units): outer horizontal padding (grid
// edge → outer dot edge), dot diameter, and gap between adjacent dot edges.
const metrics = (r: number, cx: readonly number[]) => ({
  pad: cx[0] - r,
  dia: 2 * r,
  gap: cx[1] - r - (cx[0] + r),
});

const GeometrySvg = ({
  r,
  cx,
  size,
  showGrid = true,
  inline = false,
  inheritColor = false,
}: {
  r: number;
  cx: readonly number[];
  size: string;
  showGrid?: boolean;
  inline?: boolean;
  // When true, don't pin a color — the dots use `currentColor`, so they inherit
  // the surrounding text color (e.g. an Alert's tone).
  inheritColor?: boolean;
}) => (
  <Box
    as={inline ? "span" : undefined}
    boxSize={size}
    color={inheritColor ? undefined : "ctviolet.11"}
    outline={showGrid ? "1px solid" : undefined}
    outlineColor="neutral.6"
    display={inline ? "inline-flex" : undefined}
    verticalAlign={inline ? "middle" : undefined}
  >
    <svg
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      fill="none"
      style={{ overflow: "visible" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {cx.map((x, i) => (
        <circle
          key={i}
          cx={x}
          cy={12}
          r={r}
          fill="currentColor"
          style={{
            opacity: dotOpacities[i],
            transformBox: "fill-box",
            animationName: "activity-bounce",
            animationDuration: "0.9s",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDelay: dotDelays[i],
          }}
        />
      ))}
    </svg>
  </Box>
);

/**
 * Exploration aid (temporary): candidate dot geometries on the 24×24 icon grid.
 *
 * - Top section: each variant large (80px) for judging shape, plus at the real
 *   `md` (32px) size. The box outline marks the 24-grid edges so outer padding
 *   is visible.
 * - Middle section: each variant inside a `TextInput` as a leading icon at the
 *   `xs` (20px) slot size, captioned with its derived pad/diameter/gap metrics.
 * - Card section: each variant inside an outlined Card, inline at `1em`
 *   prepended before "Thinking" with its keycap.
 * - Alert section: each variant inside an alert of a different tone
 *   (critical/warning/positive). The dots use `currentColor`, so they inherit
 *   the alert's tone — a stand-in for the component inheriting `colorPalette`.
 */
export const SvgGeometryComparison: Story = {
  render: () => (
    <Stack direction="column" gap="1200" alignItems="flex-start">
      <Stack direction="row" gap="1600" alignItems="flex-start">
        {dotGeometries.map((g) => (
          <Stack key={g.label} direction="column" gap="400" alignItems="center">
            <Text fontWeight="600">{g.label}</Text>
            <GeometrySvg r={g.r} cx={g.cx} size="80px" />
            <GeometrySvg r={g.r} cx={g.cx} size="32px" />
            <Text
              fontSize="xs"
              color="neutral.11"
              maxWidth="160px"
              textAlign="center"
            >
              {g.note}
            </Text>
          </Stack>
        ))}
      </Stack>

      <Stack direction="column" gap="400" width="320px">
        {dotGeometries.map((g, i) => {
          const m = metrics(g.r, g.cx);
          return (
            <TextInput
              key={g.label}
              aria-label={`${g.label} in input`}
              defaultValue={`${keycaps[i]} pad ${m.pad}px · ⌀${m.dia}px · gap ${m.gap}px ${keycaps[i]}`}
              isReadOnly
              leadingElement={
                <GeometrySvg r={g.r} cx={g.cx} size="20px" showGrid={false} />
              }
            />
          );
        })}
      </Stack>

      <Stack direction="column" gap="400" alignItems="flex-start">
        {dotGeometries.map((g, i) => (
          <Card.Root key={g.label} variant="outlined" size="md">
            <Text fontSize="xl">
              <GeometrySvg
                r={g.r}
                cx={g.cx}
                size="1em"
                showGrid={false}
                inline
              />{" "}
              Thinking {keycaps[i]}
            </Text>
          </Card.Root>
        ))}
      </Stack>

      {/* One row per alert tone, each showing all three geometry variants in
          that single color (easier to compare geometry). The dots use
          `currentColor` (inheritColor), so they inherit the alert's tone. */}
      <Stack direction="column" gap="400" alignItems="flex-start">
        {alertTones.map((tone) => (
          <Stack key={tone} direction="row" gap="400" alignItems="flex-start">
            {dotGeometries.map((g, i) => (
              <Alert.Root key={g.label} variant="outlined" colorPalette={tone}>
                <Alert.Title>
                  <GeometrySvg
                    r={g.r}
                    cx={g.cx}
                    size="1em"
                    showGrid={false}
                    inline
                    inheritColor
                  />{" "}
                  Thinking {keycaps[i]}
                </Alert.Title>
              </Alert.Root>
            ))}
          </Stack>
        ))}
      </Stack>
    </Stack>
  ),
};
