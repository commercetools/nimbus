import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
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
      options: ["underline", "rounded", "pill"],
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
type Story = StoryObj<typeof TabNav.Root>;

type NavItem = {
  href: string;
  label: string;
  isDisabled?: boolean;
  target?: string;
  rel?: string;
};

const ORDER_ITEMS: NavItem[] = [
  { href: "/orders/123/general", label: "General" },
  { href: "/orders/123/items", label: "Items" },
  { href: "/orders/123/shipping", label: "Shipping" },
];

/**
 * A `TabNav` whose active item is tracked in local state. Clicking any item
 * moves `aria-current="page"` — and therefore the sliding highlight — exactly
 * like a router does in a real app.
 *
 * In production, `isCurrent` is derived from the route (e.g. `useMatch`). In an
 * isolated story there is no router, so without this wrapper `isCurrent` would
 * be frozen on a single item and the highlight could never slide. Routing this
 * through one helper keeps every story interactive instead of needing a
 * separate "animated" demo story.
 */
const InteractiveTabNav = ({
  items = ORDER_ITEMS,
  ...props
}: Omit<ComponentProps<typeof TabNav.Root>, "children"> & {
  items?: NavItem[];
}) => {
  const [activePath, setActivePath] = useState(items[0].href);

  return (
    <TabNav.Root aria-label="Order navigation" {...props}>
      {items.map((item) => (
        <TabNav.Item
          key={item.href}
          href={item.href}
          target={item.target}
          rel={item.rel}
          isDisabled={item.isDisabled}
          isCurrent={activePath === item.href}
          onClick={(e) => {
            // Let external (`target="_blank"`) links navigate normally;
            // intercept same-page navigation so the Storybook iframe doesn't
            // reload and the active item can move instead.
            if (item.target) return;
            e.preventDefault();
            if (!item.isDisabled) setActivePath(item.href);
          }}
        >
          {item.label}
        </TabNav.Item>
      ))}
    </TabNav.Root>
  );
};

/**
 * The default TabNav usage with three navigation items.
 *
 * The active highlight is a single indicator that slides between items as the
 * active item changes (a thin underline bar for the default `underline`
 * variant). The indicator is `aria-hidden` and non-focusable, so
 * `aria-current`, focus rings, and keyboard order are unaffected, and it snaps
 * (no slide) under `prefers-reduced-motion: reduce`.
 *
 * Click between the items to see the underline slide.
 */
export const Base: Story = {
  render: () => <InteractiveTabNav aria-label="Order navigation" />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const getIndicator = () =>
      canvasElement.querySelector<HTMLElement>('nav [aria-hidden="true"]');

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

    await step(
      "Clicking an item moves aria-current and slides the highlight",
      async () => {
        const indicator = getIndicator();
        await expect(indicator).toBeInTheDocument();

        let initialTransform = "";
        await waitFor(() => {
          initialTransform = indicator!.style.transform;
          expect(initialTransform).not.toBe("");
        });

        const itemsLink = canvas.getByRole("link", { name: "Items" });
        await userEvent.click(itemsLink);
        await expect(itemsLink).toHaveAttribute("aria-current", "page");

        // The previously-active item is no longer current...
        const generalLink = canvas.getByRole("link", { name: "General" });
        await expect(generalLink).not.toHaveAttribute("aria-current");

        // ...and the single indicator re-measures to the new position.
        await waitFor(() => {
          const next = indicator!.style.transform;
          expect(next).not.toBe("");
          expect(next).not.toBe(initialTransform);
        });
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
          <InteractiveTabNav
            aria-label={`Order navigation (${size})`}
            size={size}
          />
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
 * TabNav ships with three visual variants:
 *
 * - `underline` (default) — an underline strip; visually twinned with the
 *   `Tabs` `underline` variant.
 * - `rounded` — a soft rounded-rect highlight on the active item.
 * - `pill` — a fully-rounded capsule highlight on the active item.
 *
 * The `rounded` and `pill` variants drop the baseline and add a small gap
 * between items. Their active highlight is themeable via `colorPalette`
 * (defaulting to `primary`). Click between items in any variant to see the
 * highlight slide.
 */
export const Variants: Story = {
  render: () => (
    <Stack direction="column" gap="600">
      {(["underline", "rounded", "pill"] as const).map((variant) => (
        <Stack key={variant} direction="column" gap="300">
          <Text fontWeight="600">
            {variant}
            {variant === "underline" ? " (default)" : ""}
          </Text>
          <InteractiveTabNav
            aria-label={`Order navigation (${variant})`}
            variant={variant}
          />
        </Stack>
      ))}
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders all three variant nav landmarks", async () => {
      const navs = canvas.getAllByRole("navigation");
      await expect(navs).toHaveLength(3);
    });

    await step("Active item carries aria-current in each variant", async () => {
      const activeLinks = canvas.getAllByRole("link", { name: "General" });
      await expect(activeLinks).toHaveLength(3);
      for (const link of activeLinks) {
        await expect(link).toHaveAttribute("aria-current", "page");
      }
    });
  },
};

/**
 * The `rounded` variant renders a soft rounded-rect highlight behind the active
 * item — the look the docs navbar uses. Inactive items rest in a neutral color
 * and brighten to the active palette on hover; the active highlight is driven by
 * the `colorPalette` (defaulting to `primary`), so it themes with the
 * surrounding palette.
 */
export const Rounded: Story = {
  render: () => (
    <InteractiveTabNav
      aria-label="Order navigation"
      variant="rounded"
      items={[
        { href: "/orders/123/general", label: "General" },
        { href: "/orders/123/items", label: "Items" },
        { href: "/orders/123/shipping", label: "Shipping", isDisabled: true },
      ]}
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Active item has aria-current='page'", async () => {
      const generalLink = canvas.getByRole("link", { name: "General" });
      await expect(generalLink).toHaveAttribute("aria-current", "page");
    });

    await step("Hovering an inactive item is non-destructive", async () => {
      const itemsLink = canvas.getByRole("link", { name: "Items" });
      await userEvent.hover(itemsLink);
      await expect(itemsLink).not.toHaveAttribute("aria-current");
    });

    await step("Disabled item is dimmed and not focusable", async () => {
      const disabledLink = canvas.getByRole("link", { name: "Shipping" });
      await expect(disabledLink).toHaveAttribute("aria-disabled", "true");
      await expect(disabledLink).not.toHaveAttribute("href");
    });
  },
};

/**
 * The `pill` variant is the `rounded` look with a fully-rounded capsule
 * highlight and a little extra horizontal padding, so the active item reads as
 * a pill.
 */
export const Pill: Story = {
  render: () => (
    <InteractiveTabNav aria-label="Order navigation" variant="pill" />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders nav landmark with pill variant", async () => {
      const nav = canvas.getByRole("navigation");
      await expect(nav).toBeInTheDocument();
    });

    await step("Active item has aria-current='page'", async () => {
      const generalLink = canvas.getByRole("link", { name: "General" });
      await expect(generalLink).toHaveAttribute("aria-current", "page");
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
  render: () => <InteractiveTabNav aria-label="Order navigation" />,
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
    <InteractiveTabNav
      aria-label="Order navigation"
      items={[
        { href: "/orders/123/general", label: "General" },
        { href: "/orders/123/items", label: "Items" },
        { href: "/orders/123/shipping", label: "Shipping", isDisabled: true },
      ]}
    />
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
    <InteractiveTabNav
      aria-label="Order navigation"
      items={[
        { href: "/orders/123/general", label: "General" },
        { href: "/orders/123/items", label: "Items" },
        {
          href: "https://example.com/docs",
          label: "Docs ↗",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      ]}
    />
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
 * The legacy `tabs` variant name is still accepted as a deprecated alias for
 * `underline`, so existing code keeps working without changes.
 */
export const DeprecatedVariantAlias: Story = {
  render: () => (
    <InteractiveTabNav aria-label="Order navigation" variant="tabs" />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Deprecated `tabs` alias still renders the nav", async () => {
      await expect(canvas.getByRole("navigation")).toBeInTheDocument();
      await expect(
        canvas.getByRole("link", { name: "General" })
      ).toHaveAttribute("aria-current", "page");
    });
  },
};

/**
 * Comprehensive smoke test showing multiple navigation items with one active
 * item. Validates the complete rendering of the TabNav component.
 */
export const SmokeTest: Story = {
  render: () => (
    <InteractiveTabNav
      aria-label="Page navigation"
      items={[
        { href: "/page/overview", label: "Overview" },
        { href: "/page/details", label: "Details" },
        { href: "/page/history", label: "History" },
        { href: "/page/settings", label: "Settings" },
      ]}
    />
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
