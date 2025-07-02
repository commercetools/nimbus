import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressBar } from "./progress-bar";
import { Stack } from "./../stack";
import type { ProgressBarProps } from "./progress-bar.types";
import { within, expect } from "storybook/test";
import { Box } from "@/components";

const sizes: ProgressBarProps["size"][] = ["2xs", "md"];
const variants: ProgressBarProps["variant"][] = ["solid", "contrast"];
const layouts: ProgressBarProps["layout"][] = ["plain", "inline", "stacked"];
const colors: Array<
  "amber" | "blue" | "grass" | "slate" | "tomato" | "primary"
> = ["primary", "tomato", "grass", "amber", "blue", "slate"];

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof ProgressBar> = {
  title: "components/ProgressBar",
  component: ProgressBar,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof ProgressBar>;

/**
 * Base story
 * Demonstrates the most basic implementation
 * Uses the args pattern for dynamic control panel inputs
 */
export const Base: Story = {
  args: {
    value: 75,
    label: "Progress",
    ["data-testid"]: "progress-bar-test",
    ["aria-label"]: "Loading progress",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const progressBar = canvas.getByTestId("progress-bar-test");

    await step("Uses a <div> element by default", async () => {
      await expect(progressBar.tagName).toBe("DIV");
    });

    await step("Has ARIA role='progressbar'", async () => {
      await expect(progressBar).toHaveAttribute("role", "progressbar");
    });

    await step("Forwards data- & aria-attributes", async () => {
      await expect(progressBar).toHaveAttribute(
        "data-testid",
        "progress-bar-test"
      );
      await expect(progressBar).toHaveAttribute(
        "aria-label",
        "Loading progress"
      );
    });

    await step("Shows progress value", async () => {
      await expect(progressBar).toHaveAttribute("aria-valuenow", "75");
    });
  },
};

/**
 * Showcase Sizes
 */
export const Sizes: Story = {
  args: {
    value: 60,
    label: "Progress",
    layout: "stacked",
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="600" alignItems="stretch">
        {sizes.map((size) => (
          <Stack key={size as string} direction="column" gap="200">
            <span style={{ fontSize: "12px", fontWeight: "500" }}>
              Size: {size}
            </span>
            <ProgressBar {...args} size={size} />
          </Stack>
        ))}
      </Stack>
    );
  },
};

/**
 * Showcase Variants
 */
export const Variants: Story = {
  args: {
    value: 45,
    label: "Loading",
    size: "md",
    layout: "stacked",
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="600" alignItems="stretch">
        {variants.map((variant) => (
          <Box
            key={variant as string}
            bg={variant === "contrast" ? "primary" : undefined}
            p="400"
          >
            <Stack direction="column" gap="200">
              <ProgressBar
                {...args}
                variant={variant}
                label={`"${variant}" variant`}
              />
            </Stack>
          </Box>
        ))}
      </Stack>
    );
  },
};

/**
 * Showcase Layouts
 */
export const Layouts: Story = {
  args: {
    value: 45,
    label: "Loading",
    size: "md",
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="600" alignItems="stretch">
        {layouts.map((layout) => (
          <Stack key={layout as string} direction="column" gap="200">
            <span style={{ fontSize: "12px", fontWeight: "500" }}>
              Layout: {layout}
            </span>
            <ProgressBar {...args} layout={layout} />
          </Stack>
        ))}
      </Stack>
    );
  },
};

/**
 * Showcase Possible Colors
 */
export const Colors: Story = {
  args: {
    value: 70,
    label: "Progress",
    layout: "stacked",
    size: "md",
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="stretch">
        {colors.map((color) => (
          <Stack>
            <Box
              p="400"
              outline="1px solid"
              outlineOffset="-1px"
              outlineColor={color}
            >
              <ProgressBar
                key={color as string}
                {...args}
                colorPalette={color}
              />
            </Box>
            <Box bg={color} p="400">
              <ProgressBar
                variant="contrast"
                key={color as string}
                {...args}
                colorPalette={color}
              />
            </Box>
          </Stack>
        ))}
      </Stack>
    );
  },
};

/**
 * Indeterminate State
 */
export const Indeterminate: Story = {
  args: {
    isIndeterminate: true,
    label: "Loading...",
    layout: "stacked",
    size: "md",
    colorPalette: "primary",
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="600" alignItems="stretch">
        {layouts.map((layout) => (
          <Stack key={layout as string} direction="column" gap="200">
            <span style={{ fontSize: "12px", fontWeight: "500" }}>
              Layout: {layout}
            </span>
            <ProgressBar {...args} layout={layout} />
          </Stack>
        ))}
      </Stack>
    );
  },
};

/**
 * Different Value Ranges
 */
export const ValueRanges: Story = {
  args: {
    label: "Progress",
    layout: "stacked",
    size: "md",
    colorPalette: "primary",
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="stretch">
        <ProgressBar {...args} value={25} />
        <ProgressBar {...args} value={50} />
        <ProgressBar {...args} value={75} />
        <ProgressBar {...args} value={100} />
        <ProgressBar
          {...args}
          value={15}
          minValue={0}
          maxValue={20}
          label="Custom range (15/20)"
        />
      </Stack>
    );
  },
};

/**
 * Custom Formatting
 */
export const CustomFormatting: Story = {
  args: {
    value: 750,
    minValue: 0,
    maxValue: 1000,
    label: "Progress",
    layout: "stacked",
    size: "md",
    colorPalette: "primary",
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="stretch">
        <ProgressBar
          {...args}
          formatOptions={{ style: "decimal" }}
          label="Decimal format"
        />
        <ProgressBar
          {...args}
          formatOptions={{ style: "percent", minimumFractionDigits: 1 }}
          label="Percent with decimals"
        />
        <ProgressBar
          {...args}
          value={42}
          maxValue={100}
          formatOptions={{ style: "unit", unit: "percent" }}
          label="Unit format"
        />
      </Stack>
    );
  },
};
