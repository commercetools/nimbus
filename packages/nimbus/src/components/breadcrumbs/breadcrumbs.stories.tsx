import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Breadcrumbs, Stack, Text } from "@commercetools/nimbus";

/**
 * `Breadcrumbs` displays the hierarchical path to the current page as an
 * ordered list of navigation links. Built on React Aria Components'
 * `Breadcrumbs`/`Breadcrumb`; the last item is treated as the current page
 * automatically.
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

type Story = StoryObj<typeof Breadcrumbs.Root>;

/** Returns the decorative separator elements (aria-hidden spans). */
const getSeparators = (root: HTMLElement) =>
  Array.from(root.querySelectorAll<HTMLElement>('[aria-hidden="true"]'));

/**
 * The default Breadcrumbs usage with three items. The first two are links; the
 * last item is automatically the current page (`aria-current="page"`, no
 * `isCurrent` prop needed).
 */
export const Base: Story = {
  render: () => (
    <Breadcrumbs.Root aria-label="Breadcrumb">
      <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/orders">Orders</Breadcrumbs.Item>
      <Breadcrumbs.Item>Order #123</Breadcrumbs.Item>
    </Breadcrumbs.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders a nav landmark", async () => {
      const nav = canvas.getByRole("navigation", { name: "Breadcrumb" });
      await expect(nav).toBeInTheDocument();
    });

    await step("Renders an ordered list with role=list", async () => {
      const list = canvas.getByRole("list");
      await expect(list.tagName).toBe("OL");
      await expect(list).toHaveAttribute("role", "list");
    });

    await step("Renders one list item per breadcrumb", async () => {
      await expect(canvas.getAllByRole("listitem")).toHaveLength(3);
    });

    await step("Non-current items link to their href", async () => {
      const home = canvas.getByRole("link", { name: "Home" });
      const orders = canvas.getByRole("link", { name: "Orders" });
      await expect(home).toHaveAttribute("href", "/");
      await expect(orders).toHaveAttribute("href", "/orders");
      await expect(home).not.toHaveAttribute("aria-current");
    });

    await step("Last item is the current page, non-interactive", async () => {
      const current = canvas.getByText("Order #123");
      await expect(current).toHaveAttribute("aria-current", "page");
      // Rendered as a <span>, not a navigable anchor.
      await expect(current).not.toHaveAttribute("href");
      await expect(current.tagName).toBe("SPAN");
    });
  },
};

/**
 * Data-driven usage via the declarative `items` API. The last entry is the
 * current page automatically, exactly as with compound children.
 */
export const DeclarativeItems: Story = {
  render: () => (
    <Breadcrumbs.Root
      aria-label="Breadcrumb"
      items={[
        { id: "home", label: "Home", href: "/" },
        { id: "orders", label: "Orders", href: "/orders" },
        { id: "detail", label: "Order #123" },
      ]}
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders one item per entry", async () => {
      await expect(canvas.getAllByRole("listitem")).toHaveLength(3);
      await expect(canvas.getByRole("link", { name: "Home" })).toHaveAttribute(
        "href",
        "/"
      );
    });

    await step("Last entry is current", async () => {
      await expect(canvas.getByText("Order #123")).toHaveAttribute(
        "aria-current",
        "page"
      );
    });
  },
};

/**
 * The two size variants: `sm` and `md` (default). Size controls the font size
 * and the gap between items.
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
            <Breadcrumbs.Item>Order #123</Breadcrumbs.Item>
          </Breadcrumbs.Root>
        </Stack>
      ))}
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("sm renders a smaller font size than md", async () => {
      // Compare the first listitem font-size of each size variant.
      const navs = canvas.getAllByRole("navigation");
      const smItem = within(navs[0]).getAllByRole("listitem")[0];
      const mdItem = within(navs[1]).getAllByRole("listitem")[0];
      const smSize = parseFloat(getComputedStyle(smItem).fontSize);
      const mdSize = parseFloat(getComputedStyle(mdItem).fontSize);
      await expect(smSize).toBeGreaterThan(0);
      await expect(smSize).toBeLessThan(mdSize);
    });
  },
};

/**
 * A custom separator. Any React node may be supplied via the `separator` prop
 * on `Breadcrumbs.Root`; it is decorative and hidden from assistive
 * technologies. The leading separator (before the first item) is not shown.
 */
export const CustomSeparator: Story = {
  render: () => (
    <Breadcrumbs.Root aria-label="Breadcrumb" separator="/">
      <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/catalog">Catalog</Breadcrumbs.Item>
      <Breadcrumbs.Item>Shoes</Breadcrumbs.Item>
    </Breadcrumbs.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders the nav landmark", async () => {
      await expect(
        canvas.getByRole("navigation", { name: "Breadcrumb" })
      ).toBeInTheDocument();
    });

    await step("A separator is rendered for each item", async () => {
      const separators = getSeparators(canvasElement);
      await expect(separators).toHaveLength(3);
    });

    await step(
      "Separators show the custom '/' and are decorative",
      async () => {
        for (const sep of getSeparators(canvasElement)) {
          await expect(sep).toHaveTextContent("/");
          await expect(sep).toHaveAttribute("aria-hidden", "true");
        }
      }
    );

    await step("The leading separator is visually hidden", async () => {
      const [first, ...rest] = getSeparators(canvasElement);
      await expect(getComputedStyle(first).display).toBe("none");
      for (const sep of rest) {
        await expect(getComputedStyle(sep).display).not.toBe("none");
      }
    });
  },
};

/**
 * `isDisabled` on an individual item. Disabled items are visually dimmed,
 * cannot be activated, carry `aria-disabled="true"`, and are skipped by Tab.
 */
export const WithDisabledItem: Story = {
  render: () => (
    <Breadcrumbs.Root aria-label="Breadcrumb">
      <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/orders" isDisabled>
        Orders
      </Breadcrumbs.Item>
      <Breadcrumbs.Item href="/orders/123">Order #123</Breadcrumbs.Item>
      <Breadcrumbs.Item>Item detail</Breadcrumbs.Item>
    </Breadcrumbs.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Disabled item has aria-disabled and no href", async () => {
      const disabled = canvas.getByText("Orders");
      await expect(disabled).toHaveAttribute("aria-disabled", "true");
      await expect(disabled).not.toHaveAttribute("href");
    });

    await step("Tab skips the disabled item and the current item", async () => {
      await userEvent.tab();
      await expect(canvas.getByRole("link", { name: "Home" })).toHaveFocus();

      await userEvent.tab();
      // Focus jumps straight to the next enabled link, skipping "Orders".
      await expect(
        canvas.getByRole("link", { name: "Order #123" })
      ).toHaveFocus();
      await expect(canvas.getByText("Orders")).not.toHaveFocus();

      await userEvent.tab();
      // The current (last) item is never focused.
      await expect(canvas.getByText("Item detail")).not.toHaveFocus();
    });
  },
};

/**
 * Keyboard navigation. Breadcrumbs use standard sequential Tab navigation (no
 * roving tabindex). The current (last) item is skipped in the tab sequence.
 */
export const KeyboardNavigation: Story = {
  render: () => (
    <Breadcrumbs.Root aria-label="Breadcrumb">
      <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/orders">Orders</Breadcrumbs.Item>
      <Breadcrumbs.Item>Order #123</Breadcrumbs.Item>
    </Breadcrumbs.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Tab moves focus through the links in order", async () => {
      await userEvent.tab();
      await expect(canvas.getByRole("link", { name: "Home" })).toHaveFocus();
      await userEvent.tab();
      await expect(canvas.getByRole("link", { name: "Orders" })).toHaveFocus();
    });

    await step("Current item is not focusable (skipped)", async () => {
      await userEvent.tab();
      await expect(canvas.getByText("Order #123")).not.toHaveFocus();
    });
  },
};

/**
 * `target` and `rel` for opening a breadcrumb in a new browser tab — standard
 * anchor semantics for external references.
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
      <Breadcrumbs.Item>Current page</Breadcrumbs.Item>
    </Breadcrumbs.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("External link has target and rel", async () => {
      const external = canvas.getByRole("link", { name: "Example ↗" });
      await expect(external).toHaveAttribute("target", "_blank");
      await expect(external).toHaveAttribute("rel", "noopener noreferrer");
    });
  },
};

/**
 * A single-item trail. With only one item, that item is the current page.
 */
export const SingleItem: Story = {
  render: () => (
    <Breadcrumbs.Root aria-label="Breadcrumb">
      <Breadcrumbs.Item>Dashboard</Breadcrumbs.Item>
    </Breadcrumbs.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("The only item is current", async () => {
      await expect(canvas.getAllByRole("listitem")).toHaveLength(1);
      await expect(canvas.getByText("Dashboard")).toHaveAttribute(
        "aria-current",
        "page"
      );
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
      <Breadcrumbs.Item>Running shoes</Breadcrumbs.Item>
    </Breadcrumbs.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders nav landmark and five list items", async () => {
      await expect(canvas.getByRole("navigation")).toBeInTheDocument();
      await expect(canvas.getAllByRole("listitem")).toHaveLength(5);
    });

    await step("Only the last item is current", async () => {
      await expect(canvas.getByText("Running shoes")).toHaveAttribute(
        "aria-current",
        "page"
      );
      await expect(
        canvas.getByRole("link", { name: "Home" })
      ).not.toHaveAttribute("aria-current");
    });
  },
};
