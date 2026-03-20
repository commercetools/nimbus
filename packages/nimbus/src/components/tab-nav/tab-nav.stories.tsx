import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Box, Stack, TabNav, Text } from "@commercetools/nimbus";

/**
 * `TabNav` provides URL-based navigation styled as tabs.
 */
const meta: Meta<typeof TabNav.Root> = {
  title: "Components/TabNav",
  component: TabNav.Root,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["tabs"],
      description: "Visual style variant of the tab navigation",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the tab navigation items",
    },
  },
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof meta>;

/**
 * The default TabNav usage with three navigation items.
 * Demonstrates the tab-styled navigation pattern for route-based navigation.
 * The first item is marked as current with `aria-current="page"`.
 */
export const Base: Story = {
  render: () => (
    <TabNav.Root aria-label="Order navigation">
      <TabNav.Item href="/orders/123/general" isCurrent>
        General
      </TabNav.Item>
      <TabNav.Item href="/orders/123/items">Items</TabNav.Item>
      <TabNav.Item href="/orders/123/shipping">Shipping</TabNav.Item>
    </TabNav.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders a nav landmark", async () => {
      const nav = canvas.getByRole("navigation");
      await expect(nav).toBeInTheDocument();
    });

    await step("Renders all navigation links as anchor elements", async () => {
      const links = canvas.getAllByRole("link");
      await expect(links).toHaveLength(3);
      for (const link of links) {
        await expect(link.tagName).toBe("A");
      }
    });

    await step("Active item has aria-current='page'", async () => {
      const generalLink = canvas.getByRole("link", { name: "General" });
      await expect(generalLink).toHaveAttribute("aria-current", "page");
    });

    await step(
      "Inactive items do not have aria-current attribute",
      async () => {
        const inactiveItem1 = canvas.getByRole("link", { name: "Items" });
        const inactiveItem2 = canvas.getByRole("link", { name: "Shipping" });
        await expect(inactiveItem1).not.toHaveAttribute("aria-current");
        await expect(inactiveItem2).not.toHaveAttribute("aria-current");
      }
    );
  },
};

/**
 * Demonstrates the three size variants: `sm`, `md` (default), and `lg`.
 * Size controls font size and padding on each item, matching the Tabs size scale.
 */
export const Sizes: Story = {
  render: () => (
    <Stack direction="column" gap="800">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Stack key={size} direction="column" gap="300">
          <Text fontWeight="600">{size}</Text>
          <TabNav.Root aria-label={`Order navigation (${size})`} size={size}>
            <TabNav.Item href="/orders/123/general" isCurrent>
              General
            </TabNav.Item>
            <TabNav.Item href="/orders/123/items">Items</TabNav.Item>
            <TabNav.Item href="/orders/123/shipping">Shipping</TabNav.Item>
          </TabNav.Root>
        </Stack>
      ))}
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("All three size variants render nav landmarks", async () => {
      const navs = canvas.getAllByRole("navigation");
      await expect(navs).toHaveLength(3);
    });
  },
};

/**
 * Demonstrates the `tabs` visual variant applied to the navigation.
 * TabNav currently ships with a single `tabs` variant — the default style.
 */
export const Variants: Story = {
  render: () => (
    <Stack direction="column" gap="300">
      <Text fontWeight="600">tabs (default)</Text>
      <TabNav.Root aria-label="Order navigation" variant="tabs">
        <TabNav.Item href="/orders/123/general" isCurrent>
          General
        </TabNav.Item>
        <TabNav.Item href="/orders/123/items">Items</TabNav.Item>
        <TabNav.Item href="/orders/123/shipping">Shipping</TabNav.Item>
      </TabNav.Root>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders nav landmark with tabs variant", async () => {
      const nav = canvas.getByRole("navigation");
      await expect(nav).toBeInTheDocument();
    });
  },
};

/**
 * Demonstrates that TabNav uses standard sequential Tab key navigation —
 * NOT roving tabindex with arrow key cycling.
 *
 * This is the critical semantic distinction from the `Tabs` component:
 * - `Tabs` (role="tablist"): Arrow keys cycle through tabs (roving tabindex)
 * - `TabNav` (<nav> + <a>): Only Tab key moves focus (sequential navigation)
 *
 * Arrow key presses should NOT change focus in TabNav.
 */
export const KeyboardNavigation: Story = {
  render: () => (
    <TabNav.Root aria-label="Order navigation">
      <TabNav.Item href="/orders/123/general" isCurrent>
        General
      </TabNav.Item>
      <TabNav.Item href="/orders/123/items">Items</TabNav.Item>
      <TabNav.Item href="/orders/123/shipping">Shipping</TabNav.Item>
    </TabNav.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Tab key moves focus to first link", async () => {
      const firstLink = canvas.getByRole("link", { name: "General" });
      await userEvent.tab();
      await expect(firstLink).toHaveFocus();
    });

    await step(
      "ArrowRight does NOT move focus (no roving tabindex)",
      async () => {
        const firstLink = canvas.getByRole("link", { name: "General" });
        // Confirm first link has focus from previous step
        await expect(firstLink).toHaveFocus();

        // Press ArrowRight — should NOT move focus to second link
        await userEvent.keyboard("{ArrowRight}");

        // First link should still have focus
        await expect(firstLink).toHaveFocus();

        const secondLink = canvas.getByRole("link", { name: "Items" });
        await expect(secondLink).not.toHaveFocus();
      }
    );

    await step(
      "ArrowLeft does NOT move focus (no roving tabindex)",
      async () => {
        const firstLink = canvas.getByRole("link", { name: "General" });
        await expect(firstLink).toHaveFocus();

        await userEvent.keyboard("{ArrowLeft}");

        // Focus should remain on first link
        await expect(firstLink).toHaveFocus();
      }
    );

    await step(
      "Tab key moves focus to second link (sequential nav)",
      async () => {
        const secondLink = canvas.getByRole("link", { name: "Items" });
        await userEvent.tab();
        await expect(secondLink).toHaveFocus();
      }
    );

    await step(
      "Tab key moves focus to third link (sequential nav)",
      async () => {
        const thirdLink = canvas.getByRole("link", { name: "Shipping" });
        await userEvent.tab();
        await expect(thirdLink).toHaveFocus();
      }
    );
  },
};

/**
 * Demonstrates `isDisabled` on individual items. Disabled items are visually
 * dimmed, cannot be clicked, and are removed from the tab sequence.
 * React Aria's `useLink` handles the disabled behaviour.
 */
export const WithDisabledItem: Story = {
  render: () => (
    <TabNav.Root aria-label="Order navigation">
      <TabNav.Item href="/orders/123/general" isCurrent>
        General
      </TabNav.Item>
      <TabNav.Item href="/orders/123/items">Items</TabNav.Item>
      <TabNav.Item href="/orders/123/shipping" isDisabled>
        Shipping
      </TabNav.Item>
    </TabNav.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Disabled item has no href", async () => {
      const disabledItem = canvas.getByRole("link", { name: "Shipping" });
      await expect(disabledItem).not.toHaveAttribute("href");
    });

    await step("Disabled item has aria-disabled attribute", async () => {
      const disabledItem = canvas.getByRole("link", { name: "Shipping" });
      await expect(disabledItem).toHaveAttribute("aria-disabled", "true");
    });

    await step("Non-disabled items retain their href", async () => {
      const activeItem = canvas.getByRole("link", { name: "General" });
      const normalItem = canvas.getByRole("link", { name: "Items" });
      await expect(activeItem).toHaveAttribute("href", "/orders/123/general");
      await expect(normalItem).toHaveAttribute("href", "/orders/123/items");
    });

    await step(
      "Tab key skips the disabled item (not in tab sequence)",
      async () => {
        const generalLink = canvas.getByRole("link", { name: "General" });
        const itemsLink = canvas.getByRole("link", { name: "Items" });
        const shippingLink = canvas.getByRole("link", { name: "Shipping" });

        // Tab to first focusable link
        await userEvent.tab();
        await expect(generalLink).toHaveFocus();

        // Tab to second focusable link — disabled Shipping should be skipped
        await userEvent.tab();
        await expect(itemsLink).toHaveFocus();

        // Shipping is never focused
        await expect(shippingLink).not.toHaveFocus();
      }
    );
  },
};

/**
 * Demonstrates `target` and `rel` props for opening a navigation item in a
 * new browser tab — standard anchor semantics, e.g. for external references.
 */
export const WithExternalLink: Story = {
  render: () => (
    <TabNav.Root aria-label="Order navigation">
      <TabNav.Item href="/orders/123/general" isCurrent>
        General
      </TabNav.Item>
      <TabNav.Item href="/orders/123/items">Items</TabNav.Item>
      <TabNav.Item
        href="https://example.com/docs"
        target="_blank"
        rel="noopener noreferrer"
      >
        Docs ↗
      </TabNav.Item>
    </TabNav.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("External link has target=_blank", async () => {
      const externalLink = canvas.getByRole("link", { name: "Docs ↗" });
      await expect(externalLink).toHaveAttribute("target", "_blank");
    });

    await step("External link has rel=noopener noreferrer", async () => {
      const externalLink = canvas.getByRole("link", { name: "Docs ↗" });
      await expect(externalLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  },
};

/**
 * Simulates the primary TabNav use case: client-side view switching with
 * persistent navigation. Clicking a tab updates `aria-current="page"` and
 * swaps the content without a full page reload.
 *
 * In a real app, `isCurrent` is derived from the router (e.g. `useMatch`)
 * and links trigger actual route changes. This story uses local state to
 * reproduce the same behaviour in isolation.
 *
 * Key things to observe:
 * - The nav bar persists while the content area changes
 * - `aria-current="page"` updates on each click
 * - Only one item is active at a time
 */
export const WithViewSwitching: Story = {
  render: () => {
    const items = [
      { href: "/orders/123/general", label: "General" },
      { href: "/orders/123/items", label: "Items" },
      { href: "/orders/123/shipping", label: "Shipping" },
    ] as const;

    const content: Record<string, string> = {
      "/orders/123/general": "General settings and order details.",
      "/orders/123/items": "Line items and quantities.",
      "/orders/123/shipping": "Shipping address and carrier information.",
    };

    const [activePath, setActivePath] = useState<string>(items[0].href);

    return (
      <Stack gap="400">
        <TabNav.Root aria-label="Order navigation">
          {items.map((item) => (
            <TabNav.Item
              key={item.href}
              href={item.href}
              isCurrent={activePath === item.href}
              onClick={(e) => {
                e.preventDefault();
                setActivePath(item.href);
              }}
            >
              {item.label}
            </TabNav.Item>
          ))}
        </TabNav.Root>
        <Box padding="400">{content[activePath]}</Box>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("General is active by default", async () => {
      const generalLink = canvas.getByRole("link", { name: "General" });
      await expect(generalLink).toHaveAttribute("aria-current", "page");
    });

    await step("Clicking Items makes it active", async () => {
      const itemsLink = canvas.getByRole("link", { name: "Items" });
      await userEvent.click(itemsLink);
      await expect(itemsLink).toHaveAttribute("aria-current", "page");
    });

    await step("General is no longer active after switching", async () => {
      const generalLink = canvas.getByRole("link", { name: "General" });
      await expect(generalLink).not.toHaveAttribute("aria-current");
    });

    await step("Content area updates to reflect active tab", async () => {
      await expect(
        canvas.getByText("Line items and quantities.")
      ).toBeInTheDocument();
    });

    await step("Clicking Shipping makes it active", async () => {
      const shippingLink = canvas.getByRole("link", { name: "Shipping" });
      await userEvent.click(shippingLink);
      await expect(shippingLink).toHaveAttribute("aria-current", "page");
    });
  },
};

/**
 * Comprehensive smoke test showing multiple navigation items with one active
 * item. Validates the complete rendering of the TabNav component.
 */
export const SmokeTest: Story = {
  render: () => (
    <TabNav.Root aria-label="Page navigation">
      <TabNav.Item href="/page/overview" isCurrent>
        Overview
      </TabNav.Item>
      <TabNav.Item href="/page/details">Details</TabNav.Item>
      <TabNav.Item href="/page/history">History</TabNav.Item>
      <TabNav.Item href="/page/settings">Settings</TabNav.Item>
    </TabNav.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders nav landmark", async () => {
      const nav = canvas.getByRole("navigation");
      await expect(nav).toBeInTheDocument();
    });

    await step("Renders all navigation links", async () => {
      const links = canvas.getAllByRole("link");
      await expect(links).toHaveLength(4);
    });

    await step("Active item has correct aria-current", async () => {
      const overviewLink = canvas.getByRole("link", { name: "Overview" });
      await expect(overviewLink).toHaveAttribute("aria-current", "page");
    });

    await step("Inactive items lack aria-current", async () => {
      const detailsLink = canvas.getByRole("link", { name: "Details" });
      const historyLink = canvas.getByRole("link", { name: "History" });
      const settingsLink = canvas.getByRole("link", { name: "Settings" });

      await expect(detailsLink).not.toHaveAttribute("aria-current");
      await expect(historyLink).not.toHaveAttribute("aria-current");
      await expect(settingsLink).not.toHaveAttribute("aria-current");
    });

    await step("Links have correct href values", async () => {
      const overviewLink = canvas.getByRole("link", { name: "Overview" });
      const detailsLink = canvas.getByRole("link", { name: "Details" });

      await expect(overviewLink).toHaveAttribute("href", "/page/overview");
      await expect(detailsLink).toHaveAttribute("href", "/page/details");
    });
  },
};
