import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge";
import { Stack } from "./../stack";
import type { BadgeProps } from "./badge.types";
import { SentimentSatisfied as DemoIcon } from "@commercetools/nimbus-icons";
import { within, expect } from "storybook/test";

const sizes: BadgeProps["size"][] = ["2xs", "xs", "md"];
const colors: Array<
  "amber" | "blue" | "grass" | "slate" | "tomato" | "primary"
> = ["primary", "tomato", "grass", "amber", "blue", "slate"];

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
 * Showcase Possible Colors
 */
export const Colors: Story = {
  args: {
    children: "Demo Badge",
    size: "xs",
  },
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {colors.map((color) => (
          <Badge key={color as string} {...args} colorPalette={color} />
        ))}
      </Stack>
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
