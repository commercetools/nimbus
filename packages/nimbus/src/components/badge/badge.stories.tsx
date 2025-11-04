import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, type BadgeProps, Stack } from "@commercetools/nimbus";
import { SentimentSatisfied as DemoIcon } from "@commercetools/nimbus-icons";
import { within, expect } from "storybook/test";
import { DisplayColorPalettes } from "@/utils/display-color-palettes";

const sizes: BadgeProps["size"][] = ["2xs", "xs", "md"];

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof Badge>;
/**
 * Base story
 * Demonstrates the most basic implementation
 * Uses the args pattern for dynamic control panel inputs
 */

export const Base: Story = {
  args: {
    children: "Demo Badge",
    size: "md",
    colorPalette: "grass",
    ["data-testid"]: "badge-test",
    ["aria-label"]: "badge",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByTestId("badge-test");

    await step("Uses a <span> element by default", async () => {
      await expect(link.tagName).toBe("SPAN");
    });
    await step("Forwards data- & aria-attributes", async () => {
      await expect(link).toHaveAttribute("data-testid", "badge-test");
      await expect(link).toHaveAttribute("aria-label", "badge");
    });

    await step("Renders children", async () => {
      await expect(link).toHaveTextContent("Demo Badge");
    });
  },
};

/**
 * Showcase Sizes
 */
export const Sizes: Story = {
  args: {},
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {sizes.map((size) => (
          <Badge key={size as string} {...args} size={size}>
            {String(size)}
          </Badge>
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
    size: "xs",
  },
  render: (args) => {
    return (
      <DisplayColorPalettes>
        {(palette) => (
          <Badge {...args} colorPalette={palette}>
            {palette}
          </Badge>
        )}
      </DisplayColorPalettes>
    );
  },
};

/**
 * Showcase Icons
 */
export const WithIcons: Story = {
  args: {
    size: "md",
  },
  render: (args) => {
    const demoText = "Demo Badge";
    return (
      <Stack direction="row" gap="400" alignItems="center">
        <Badge {...args}>
          {demoText} <DemoIcon />
        </Badge>

        <Badge {...args}>
          <DemoIcon /> {demoText}
        </Badge>

        <Badge {...args}>
          <DemoIcon /> {demoText} <DemoIcon />
        </Badge>
      </Stack>
    );
  },
};
