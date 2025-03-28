import type { Meta, StoryObj } from "@storybook/react";
import { Link } from "./link";
import { Box, Stack } from "@/components";
import type { LinkProps } from "./link.types";
import { userEvent, within, expect, fn } from "@storybook/test";
import { createRef } from "react";

const sizes: LinkProps["size"][] = ["xs", "sm", "md"];
const fontColors: LinkProps["fontColor"][] = ["primary", "inherit"];

/**
 * The Link component allows a user to navigate to a different page or resource.
 */
const meta: Meta<typeof Link> = {
  title: "components/Link",
  component: Link,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof Link>;

/**
 * Base story
 * Demonstrates the most basic implementation
 * Uses the args pattern for dynamic control panel inputs
 */
export const Base: Story = {
  args: {
    children: "Demo Link",
    onClick: fn(),
    ["data-testid"]: "link-test",
    ["aria-label"]: "link-to-somewhere",
    ["href"]: "#",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByTestId("link-test");

    await step("Uses an <a> element by default", async () => {
      await expect(link.tagName).toBe("A");
    });

    await step("Forwards data- & aria-attributes", async () => {
      await expect(link).toHaveAttribute("data-testid", "link-test");
      await expect(link).toHaveAttribute("aria-label", "link-to-somewhere");
    });

    await step("Renders children", async () => {
      await expect(link).toHaveTextContent("Demo Link");
    });

    await step("Is focusable with <tab> key", async () => {
      await userEvent.tab();
      await expect(link).toHaveFocus();
    });
  },
};

/**
 * Showcase Sizes
 */
export const Sizes: Story = {
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {sizes.map((size) => (
          <Link key={size as string} {...args} size={size} />
        ))}
      </Stack>
    );
  },

  args: {
    children: "Demo Link",
  },
};

/**
 * Showcase FontColors
 */
export const FontColors: Story = {
  render: (args) => {
    return (
      <Box p="400" bg="primary.3">
        <Stack direction="row" gap="500" alignItems="center">
          {fontColors.map((color) => (
            <p key={color as string} style={{ color: "white" }}>
              This is a {JSON.stringify(color)}{" "}
              <Link key={color as string} {...args} fontColor={color} /> in
              action.
            </p>
          ))}
        </Stack>
      </Box>
    );
  },

  args: {
    children: "Link",
  },
};

/**
 * Showcase asChild
 */
export const AsChild: Story = {
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        <Link {...args}>{args.children}</Link>
      </Stack>
    );
  },

  args: {
    children: <span>I am just a span</span>,
    asChild: true,
    ["data-testid"]: "test",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByTestId("test");

    await step("Uses a <span> element", async () => {
      await expect(link.tagName).toBe("SPAN");
    });

    await step("Is focusable with <tab> key", async () => {
      await userEvent.tab();
      await expect(link).toHaveFocus();
    });
  },
};

/**
 * Showcase withRef
 */
const linkRef = createRef<HTMLAnchorElement>();
export const WithRef: Story = {
  args: {
    children: "Demo Link",
    ["data-testid"]: "ref-test",
  },
  render: (args) => {
    return (
      <Link ref={linkRef} {...args}>
        {args.children}
      </Link>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId("ref-test");

    await step("Does accept ref's", async () => {
      await expect(linkRef.current).toBe(button);
    });
  },
};

export const SmokeTest: Story = {
  args: {
    children: "Demo Link",
    ["data-testid"]: "smoke-test",
  },
  render: (args) => {
    return (
      <Stack gap="1200">
        {fontColors.map((color) => (
          <Stack key={color as string} direction="row" gap="400">
            {sizes.map((size) => (
              <Stack direction="row" key={size as string}>
                <Link {...args} size={size} fontColor={color} />
              </Stack>
            ))}
          </Stack>
        ))}
      </Stack>
    );
  },
};

export const withCustomHref: Story = {
  args: {
    children: "Demo Link",
    href: "https://commercetools.com",
  },
  render: (args) => {
    return <Link {...args}>{args.children}</Link>;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByText("Demo Link");

    await step("Uses the provided href", async () => {
      await expect(link).toHaveAttribute("href", "https://commercetools.com");
    });
  },
};
