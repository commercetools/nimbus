import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ActivityIndicator,
  type ActivityIndicatorProps,
  Box,
  Stack,
  Text,
  TextInput,
} from "@commercetools/nimbus";
import { within, expect } from "storybook/test";

const sizes: ActivityIndicatorProps["size"][] = [
  "inherit",
  "2xs",
  "xs",
  "sm",
  "md",
  "lg",
];

const colorPalettes: ActivityIndicatorProps["colorPalette"][] = [
  "primary",
  "white",
];

const meta: Meta<typeof ActivityIndicator> = {
  title: "Components/ActivityIndicator",
  component: ActivityIndicator,
};

export default meta;

type Story = StoryObj<typeof ActivityIndicator>;

/**
 * Default: decorative (no `aria-label`), em-relative sizing. Renders three
 * dot spans inside a span root.
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

    await step("Renders exactly three dot spans", async () => {
      const dots = indicator.querySelectorAll("[data-dot]");
      await expect(dots.length).toBe(3);
      dots.forEach((dot) => expect(dot.tagName).toBe("SPAN"));
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
 * The fixed `size` reserves a square icon-box footprint, so the indicator drops
 * into the input's icon slot like any other icon while an agent is working.
 */
export const InsideInput: Story = {
  render: () => (
    <Stack direction="column" gap="400" alignItems="flex-start" width="320px">
      <TextInput
        aria-label="Agent response, generating (leading indicator)"
        defaultValue="Generating a response"
        isReadOnly
        leadingElement={<ActivityIndicator size="sm" />}
      />
      <TextInput
        aria-label="Agent response, generating (trailing indicator)"
        defaultValue="Generating a response"
        isReadOnly
        trailingElement={<ActivityIndicator size="sm" />}
      />
    </Stack>
  ),
};

/**
 * One color palette for a light background and one for a dark background.
 */
export const ColorPalettes: Story = {
  render: (args) => (
    <Box backgroundColor="blackAlpha.5">
      <Stack direction="row" gap="400" alignItems="center">
        {colorPalettes.map((colorPalette) => (
          <ActivityIndicator
            key={colorPalette as string}
            {...args}
            colorPalette={colorPalette}
          />
        ))}
      </Stack>
    </Box>
  ),
  args: {},
};
