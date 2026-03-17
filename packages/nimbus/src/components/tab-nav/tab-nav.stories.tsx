import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { TabNav } from "@commercetools/nimbus";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof TabNav.Root> = {
  title: "Components/TabNav",
  component: TabNav.Root,
  argTypes: {
    variant: {
      control: "select",
      options: ["tabs"],
      description: "Visual style variant of the tab navigation",
    },
  },
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof TabNav.Root>;

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
};

/**
 * Demonstrates the `aria-current="page"` attribute that identifies the active
 * navigation item. This is the correct semantic pattern for navigation links —
 * NOT `aria-selected` (which is for widgets like Tabs).
 *
 * Screen readers announce the active item as "current page" to users.
 */
export const WithActiveItem: Story = {
  render: () => (
    <TabNav.Root aria-label="Order navigation">
      <TabNav.Item
        href="/orders/123/general"
        isCurrent
        data-testid="active-item"
      >
        General
      </TabNav.Item>
      <TabNav.Item href="/orders/123/items" data-testid="inactive-item-1">
        Items
      </TabNav.Item>
      <TabNav.Item href="/orders/123/shipping" data-testid="inactive-item-2">
        Shipping
      </TabNav.Item>
    </TabNav.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Active item has aria-current='page' attribute", async () => {
      const activeItem = canvas.getByTestId("active-item");
      await expect(activeItem).toHaveAttribute("aria-current", "page");
    });

    await step(
      "Inactive items do not have aria-current attribute",
      async () => {
        const inactiveItem1 = canvas.getByTestId("inactive-item-1");
        const inactiveItem2 = canvas.getByTestId("inactive-item-2");
        await expect(inactiveItem1).not.toHaveAttribute("aria-current");
        await expect(inactiveItem2).not.toHaveAttribute("aria-current");
      }
    );

    await step("All items render as anchor elements", async () => {
      const links = canvas.getAllByRole("link");
      await expect(links).toHaveLength(3);
      for (const link of links) {
        await expect(link.tagName).toBe("A");
      }
    });

    await step("Root renders as a nav landmark", async () => {
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
      <TabNav.Item href="/orders/123/general" isCurrent data-testid="link-1">
        General
      </TabNav.Item>
      <TabNav.Item href="/orders/123/items" data-testid="link-2">
        Items
      </TabNav.Item>
      <TabNav.Item href="/orders/123/shipping" data-testid="link-3">
        Shipping
      </TabNav.Item>
    </TabNav.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Tab key moves focus to first link", async () => {
      const firstLink = canvas.getByTestId("link-1");
      await userEvent.tab();
      await expect(firstLink).toHaveFocus();
    });

    await step(
      "ArrowRight does NOT move focus (no roving tabindex)",
      async () => {
        const firstLink = canvas.getByTestId("link-1");
        // Confirm first link has focus from previous step
        await expect(firstLink).toHaveFocus();

        // Press ArrowRight — should NOT move focus to second link
        await userEvent.keyboard("{ArrowRight}");

        // First link should still have focus
        await expect(firstLink).toHaveFocus();

        const secondLink = canvas.getByTestId("link-2");
        await expect(secondLink).not.toHaveFocus();
      }
    );

    await step(
      "ArrowLeft does NOT move focus (no roving tabindex)",
      async () => {
        const firstLink = canvas.getByTestId("link-1");
        await expect(firstLink).toHaveFocus();

        await userEvent.keyboard("{ArrowLeft}");

        // Focus should remain on first link
        await expect(firstLink).toHaveFocus();
      }
    );

    await step(
      "Tab key moves focus to second link (sequential nav)",
      async () => {
        const secondLink = canvas.getByTestId("link-2");
        await userEvent.tab();
        await expect(secondLink).toHaveFocus();
      }
    );

    await step(
      "Tab key moves focus to third link (sequential nav)",
      async () => {
        const thirdLink = canvas.getByTestId("link-3");
        await userEvent.tab();
        await expect(thirdLink).toHaveFocus();
      }
    );
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
