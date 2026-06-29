import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Breadcrumbs, Stack, Text } from "@commercetools/nimbus";

/**
 * `Breadcrumbs` displays the hierarchical path to the current page as an
 * ordered list of navigation links.
 */
const meta: Meta<typeof Breadcrumbs.Root> = {
  title: "Components/Breadcrumbs",
  component: Breadcrumbs.Root,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md"],
      description: "Size of the breadcrumb items",
    },
  },
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof Breadcrumbs.Root>;

/**
 * The default Breadcrumbs usage with three items. The first two are links and
 * the last item is marked as the current page with `isCurrent`.
 */
export const Base: Story = {
  render: () => (
    <Breadcrumbs.Root aria-label="Breadcrumb">
      <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/orders">Orders</Breadcrumbs.Item>
      <Breadcrumbs.Item isCurrent>Order #123</Breadcrumbs.Item>
    </Breadcrumbs.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders a nav landmark", async () => {
      const nav = canvas.getByRole("navigation", { name: "Breadcrumb" });
      await expect(nav).toBeInTheDocument();
    });

    await step("Renders an ordered list", async () => {
      const list = canvas.getByRole("list");
      await expect(list.tagName).toBe("OL");
    });

    await step("Renders one list item per breadcrumb", async () => {
      const items = canvas.getAllByRole("listitem");
      await expect(items).toHaveLength(3);
    });

    await step("Link items point to their href", async () => {
      const home = canvas.getByRole("link", { name: "Home" });
      const orders = canvas.getByRole("link", { name: "Orders" });
      await expect(home).toHaveAttribute("href", "/");
      await expect(orders).toHaveAttribute("href", "/orders");
    });

    await step("Current item is text with aria-current='page'", async () => {
      const current = canvas.getByText("Order #123");
      await expect(current).toHaveAttribute("aria-current", "page");
    });

    await step("Current item is not a link (no href)", async () => {
      const current = canvas.getByText("Order #123");
      await expect(current).not.toHaveAttribute("href");
      // An <a> without href exposes no `link` role, so it is non-interactive.
      await expect(
        canvas.queryByRole("link", { name: "Order #123" })
      ).not.toBeInTheDocument();
    });
  },
};

/**
 * Demonstrates the two size variants: `sm` and `md` (default). Size controls
 * the font size and gap between items.
 */
export const Sizes: Story = {
  render: () => (
    <Stack direction="column" gap="600">
      {(["sm", "md"] as const).map((size) => (
        <Stack key={size} direction="column" gap="200">
          <Text fontWeight="600">{size}</Text>
          <Breadcrumbs.Root aria-label={`Breadcrumb (${size})`} size={size}>
            <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
            <Breadcrumbs.Item href="/orders">Orders</Breadcrumbs.Item>
            <Breadcrumbs.Item isCurrent>Order #123</Breadcrumbs.Item>
          </Breadcrumbs.Root>
        </Stack>
      ))}
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Both size variants render nav landmarks", async () => {
      const navs = canvas.getAllByRole("navigation");
      await expect(navs).toHaveLength(2);
    });
  },
};

/**
 * Demonstrates a custom separator. Any React node may be supplied via the
 * `separator` prop on `Breadcrumbs.Root`; it is decorative and hidden from
 * assistive technologies.
 */
export const CustomSeparator: Story = {
  render: () => (
    <Breadcrumbs.Root aria-label="Breadcrumb" separator="›">
      <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/catalog">Catalog</Breadcrumbs.Item>
      <Breadcrumbs.Item isCurrent>Shoes</Breadcrumbs.Item>
    </Breadcrumbs.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders the nav landmark", async () => {
      await expect(
        canvas.getByRole("navigation", { name: "Breadcrumb" })
      ).toBeInTheDocument();
    });

    await step("Current item renders with the expected label", async () => {
      const current = canvas.getByText("Shoes");
      await expect(current).toHaveAttribute("aria-current", "page");
    });
  },
};

/**
 * Demonstrates `isDisabled` on an individual item. Disabled items are visually
 * dimmed, cannot be activated, and carry `aria-disabled="true"`.
 */
export const WithDisabledItem: Story = {
  render: () => (
    <Breadcrumbs.Root aria-label="Breadcrumb">
      <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/orders" isDisabled>
        Orders
      </Breadcrumbs.Item>
      <Breadcrumbs.Item isCurrent>Order #123</Breadcrumbs.Item>
    </Breadcrumbs.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Disabled item has aria-disabled", async () => {
      const disabled = canvas.getByRole("link", { name: "Orders" });
      await expect(disabled).toHaveAttribute("aria-disabled", "true");
    });

    await step("Disabled item has no href", async () => {
      const disabled = canvas.getByRole("link", { name: "Orders" });
      await expect(disabled).not.toHaveAttribute("href");
    });
  },
};

/**
 * Demonstrates keyboard navigation. Breadcrumbs use standard sequential Tab key
 * navigation (no roving tabindex). The current (last) item is non-interactive
 * and is skipped in the tab sequence.
 */
export const KeyboardNavigation: Story = {
  render: () => (
    <Breadcrumbs.Root aria-label="Breadcrumb">
      <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/orders">Orders</Breadcrumbs.Item>
      <Breadcrumbs.Item isCurrent>Order #123</Breadcrumbs.Item>
    </Breadcrumbs.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Tab moves focus to the first link", async () => {
      const home = canvas.getByRole("link", { name: "Home" });
      await userEvent.tab();
      await expect(home).toHaveFocus();
    });

    await step("Tab moves focus to the second link", async () => {
      const orders = canvas.getByRole("link", { name: "Orders" });
      await userEvent.tab();
      await expect(orders).toHaveFocus();
    });

    await step("Current item is not focusable (skipped)", async () => {
      const current = canvas.getByText("Order #123");
      await userEvent.tab();
      await expect(current).not.toHaveFocus();
    });
  },
};

/**
 * Demonstrates `target` and `rel` for opening a breadcrumb in a new browser
 * tab — standard anchor semantics for external references.
 */
export const WithExternalLink: Story = {
  render: () => (
    <Breadcrumbs.Root aria-label="Breadcrumb">
      <Breadcrumbs.Item
        href="https://example.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Example ↗
      </Breadcrumbs.Item>
      <Breadcrumbs.Item isCurrent>Current page</Breadcrumbs.Item>
    </Breadcrumbs.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("External link has target=_blank", async () => {
      const external = canvas.getByRole("link", { name: "Example ↗" });
      await expect(external).toHaveAttribute("target", "_blank");
    });

    await step("External link has rel=noopener noreferrer", async () => {
      const external = canvas.getByRole("link", { name: "Example ↗" });
      await expect(external).toHaveAttribute("rel", "noopener noreferrer");
    });
  },
};

/**
 * Comprehensive smoke test with a deeper hierarchy and a single current item.
 */
export const SmokeTest: Story = {
  render: () => (
    <Breadcrumbs.Root aria-label="Breadcrumb">
      <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/products/apparel">Apparel</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/products/apparel/shoes">Shoes</Breadcrumbs.Item>
      <Breadcrumbs.Item isCurrent>Running shoes</Breadcrumbs.Item>
    </Breadcrumbs.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders nav landmark", async () => {
      await expect(canvas.getByRole("navigation")).toBeInTheDocument();
    });

    await step("Renders all five list items", async () => {
      await expect(canvas.getAllByRole("listitem")).toHaveLength(5);
    });

    await step("Only the last item is current", async () => {
      const current = canvas.getByText("Running shoes");
      await expect(current).toHaveAttribute("aria-current", "page");

      const home = canvas.getByRole("link", { name: "Home" });
      await expect(home).not.toHaveAttribute("aria-current");
    });

    await step("Link items keep their href", async () => {
      await expect(
        canvas.getByRole("link", { name: "Products" })
      ).toHaveAttribute("href", "/products");
    });
  },
};
