import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link, type LinkProps, Stack, Text } from "@commercetools/nimbus";
import { OpenInNew as DemoIcon } from "@commercetools/nimbus-icons";
import { userEvent, within, expect, fn } from "storybook/test";
import { createRef } from "react";

const sizes: LinkProps["size"][] = ["xs", "sm", "md"];
const fontColors: LinkProps["fontColor"][] = ["primary", "inherit"];

/** `fontColor` has no default, so unset is a third rendering, not an alias. */
const smokeFontColors: LinkProps["fontColor"][] = [
  undefined,
  ...fontColors,
] as const;

/**
 * The Link component allows a user to navigate to a different page or resource.
 */
const meta: Meta<typeof Link> = {
  title: "Components/Link",
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
  // VRT: the only frame with `fontColor` and `size` both unset.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: {
    children: "Demo Link",
    onClick: fn(),
    ["data-testid"]: "link-test",
    ["aria-label"]: "link-to-somewhere",
    href: "#",
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

    link.blur();
  },
};

/**
 * Showcase the focus ring
 */
export const Focused: Story = {
  // VRT: the ring is expected in this capture.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: {
    children: "Demo Link",
    href: "#",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Shows a focus ring when tabbed to", async () => {
      await userEvent.tab();
      await expect(canvas.getByRole("link")).toHaveFocus();
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
  // VRT: snapshotted for the inline-in-text layout, not the colors.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: (args) => {
    return (
      <Stack direction="column">
        {fontColors.map((color) => (
          <Text key={color as string}>
            This is a "{color as string}" <Link {...args} fontColor={color} />{" "}
            in action.
          </Text>
        ))}
      </Stack>
    );
  },

  args: {
    children: "Link",
  },
};

/**
 * Showcase a link with a leading icon
 */
export const WithIcon: Story = {
  // VRT: the only frame with an icon child, which base's `inline-flex` exists for.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: {
    href: "https://commercetools.com",
    target: "_blank",
    rel: "noopener noreferrer",
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="flex-start">
        {sizes.map((size) => (
          <Link key={size as string} {...args} size={size}>
            <DemoIcon />
            Documentation
          </Link>
        ))}
      </Stack>
    );
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

export const WithCustomHref: Story = {
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

export const SmokeTest: Story = {
  // VRT: independent axes, but one frame is cheaper than two showcases.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: {
    children: "Demo Link",
    ["data-testid"]: "smoke-test",
  },
  render: (args) => {
    return (
      <Stack gap="1200">
        {smokeFontColors.map((color, index) => (
          <Stack key={index} direction="row" gap="400">
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
