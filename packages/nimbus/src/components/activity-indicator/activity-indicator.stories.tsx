import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ActivityIndicator,
  type ActivityIndicatorProps,
  Box,
  Button,
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
