import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  ProgressBar,
  type ProgressBarProps,
  Stack,
  Text,
} from "@commercetools/nimbus";
import { within, expect } from "storybook/test";
import { DisplayColorPalettes } from "@/utils/display-color-palettes";

const sizes: ProgressBarProps["size"][] = ["2xs", "md"];
const variants: ProgressBarProps["variant"][] = ["solid", "contrast"];
const layouts: ProgressBarProps["layout"][] = ["minimal", "inline", "stacked"];

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof ProgressBar> = {
  title: "Components/ProgressBar",
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
      <Stack direction="column" alignItems="stretch" width="100%">
        {sizes.map((size) => (
          <Flex gap="400">
            <Text textStyle="md" fontWeight="500" minWidth="20ch">
              {size as string}
            </Text>
            <Box flexGrow="1">
              <Stack key={size as string} direction="column" gap="200">
                <ProgressBar {...args} size={size} />
              </Stack>
            </Box>
          </Flex>
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
      <Stack direction="column" alignItems="stretch" width="100%" gap="800">
        {layouts.map((layout) => (
          <Flex gap="400">
            <Text textStyle="md" fontWeight="500" minWidth="20ch">
              {layout as string}
            </Text>
            <Box flexGrow="1">
              <Stack key={layout as string} direction="column" gap="200">
                <ProgressBar
                  {...args}
                  label={args.label + " - " + layout}
                  aria-label={
                    layout === "minimal" ? "Loading - minimal" : undefined
                  }
                  layout={layout}
                />
              </Stack>
            </Box>
          </Flex>
        ))}
      </Stack>
    );
  },
};

/**
 * Showcase Possible Color Palettes
 */
export const ColorPalettes: Story = {
  args: {
    value: 70,
    layout: "stacked",
    size: "md",
  },
  render: (args) => {
    return (
      <DisplayColorPalettes>
        {(palette) => (
          <Stack flexDirection="row" w="100%">
            <Box
              p="400"
              outline="1px solid"
              outlineOffset="-1px"
              outlineColor={palette}
              w="45%"
            >
              <ProgressBar {...args} label={palette} colorPalette={palette} />
            </Box>
            <Box bg={palette} p="400" w="45%">
              <ProgressBar
                variant="contrast"
                {...args}
                label={`${palette} - contrast`}
                colorPalette={palette}
              />
            </Box>
          </Stack>
        )}
      </DisplayColorPalettes>
    );
  },
};

/**
 * Dynamic vs Static Progress
 */
export const IsDynamic: Story = {
  args: {
    value: 65,
    label: "Progress",
    layout: "stacked",
    size: "md",
    colorPalette: "primary",
  },
  render: (args) => {
    return (
      <Stack direction="column" alignItems="stretch" width="100%" gap="800">
        <Flex gap="400">
          <Text textStyle="md" fontWeight="500" minWidth="20ch">
            Dynamic (default)
          </Text>
          <Box flexGrow="1">
            <Stack direction="column" gap="200">
              <ProgressBar
                {...args}
                isDynamic={true}
                label="Dynamic progress - File upload"
              />
              <Text textStyle="sm" color="gray.600">
                Represents an active, ongoing process that updates in real-time
                (e.g., file uploads, downloads, loading operations)
              </Text>
            </Stack>
          </Box>
        </Flex>
        <Flex gap="400">
          <Text textStyle="md" fontWeight="500" minWidth="20ch">
            Static
          </Text>
          <Box flexGrow="1">
            <Stack direction="column" gap="200">
              <ProgressBar
                {...args}
                isDynamic={false}
                label="Static progress - Step 3 of 5"
              />
              <Text textStyle="sm" color="gray.600">
                Represents a static progress indicator (e.g., step 3 of 5 in a
                wizard, completion percentage that won't change)
              </Text>
            </Stack>
          </Box>
        </Flex>
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
    size: "md",
  },
  render: (args) => {
    return (
      <Stack direction="column" alignItems="stretch" width="100%" gap="800">
        {layouts.map((layout) => (
          <Flex gap="400">
            <Text textStyle="md" fontWeight="500" minWidth="20ch">
              {layout as string}
            </Text>
            <Box flexGrow="1">
              <Stack key={layout as string} direction="column" gap="200">
                <ProgressBar
                  {...args}
                  label={args.label + " - " + layout}
                  aria-label={
                    layout === "minimal" ? "Loading - minimal" : undefined
                  }
                  layout={layout}
                />
              </Stack>
            </Box>
          </Flex>
        ))}
      </Stack>
    );
  },
};

/**
 * Custom Formatting
 */
export const CustomFormatting: Story = {
  args: {
    value: 755,
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
          formatOptions={{ style: "decimal", minimumFractionDigits: 0 }}
          label="Decimal format"
        />
        <ProgressBar
          {...args}
          formatOptions={{ style: "percent", minimumFractionDigits: 2 }}
          label="Percent with 2 decimals"
        />
        <ProgressBar
          {...args}
          label="Hard Disk Space"
          value={42.55}
          maxValue={100}
          formatOptions={{ style: "unit", unit: "terabyte" }}
        />
      </Stack>
    );
  },
};

/**
 * Progress Simulation
 * Demonstrates simulated progress using useState and useEffect
 */
export const ProgressSimulation: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
      let interval: NodeJS.Timeout;

      if (isRunning && progress < 100) {
        interval = setInterval(
          () => {
            setProgress((prev) => {
              // Random increment between 0.5-3.5
              const newProgress = prev + Math.random() * 3 + 0.5;
              if (newProgress >= 100) {
                setIsRunning(false);
                setIsCompleted(true);
                return 100;
              }
              return newProgress;
            });
          },
          Math.random() * 1000 + 500
        );
      }

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }, [isRunning, progress]);

    const startProgress = () => {
      setIsRunning(true);
      setIsCompleted(false);
    };

    const resetProgress = () => {
      setProgress(0);
      setIsRunning(false);
      setIsCompleted(false);
    };

    const pauseProgress = () => {
      setIsRunning(false);
    };

    return (
      <Stack direction="column" gap="600" alignItems="stretch">
        <Stack direction="row" gap="400">
          <Button
            onClick={startProgress}
            disabled={isRunning || isCompleted}
            variant="solid"
          >
            {isCompleted ? "Completed!" : "Start Progress"}
          </Button>
          <Button
            onClick={pauseProgress}
            disabled={!isRunning}
            variant="outline"
          >
            Pause
          </Button>
          <Button onClick={resetProgress} variant="ghost">
            Reset
          </Button>
        </Stack>

        <Stack direction="column">
          <ProgressBar
            my="800"
            value={progress}
            label="File Upload Progress"
            layout="stacked"
            size="md"
            colorPalette="primary"
          />

          <ProgressBar
            my="800"
            value={progress}
            label="Download Progress"
            layout="inline"
            size="md"
            colorPalette="grass"
          />

          <ProgressBar
            value={progress}
            my="800"
            label="Installation Progress"
            layout="stacked"
            size="2xs"
            colorPalette="blue"
          />
        </Stack>
      </Stack>
    );
  },
};
