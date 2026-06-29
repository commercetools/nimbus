import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, fn } from "storybook/test";
import type { Key } from "react-aria-components";
import {
  Stack,
  Breadcrumbs,
  type BreadcrumbsProps,
  Text,
} from "@commercetools/nimbus";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof Breadcrumbs.Root> = {
  title: "Components/Breadcrumbs",
  component: Breadcrumbs.Root,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof Breadcrumbs.Root>;

const trail = [
  { id: "home", label: "Home", href: "/" },
  { id: "reports", label: "Reports", href: "/reports" },
  { id: "quarterly", label: "Quarterly", href: "/reports/quarterly" },
  { id: "q3", label: "Q3 Summary" },
];

const sizes: BreadcrumbsProps["size"][] = ["sm", "md"];

/**
 * Base story
 * Demonstrates the most basic implementation with static items. The last item
 * omits `href`, so it is rendered as the non-interactive current page.
 */
export const Base: Story = {
  args: {},
  render: () => (
    <Breadcrumbs.Root aria-label="Breadcrumbs">
      <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/reports">Reports</Breadcrumbs.Item>
      <Breadcrumbs.Item>Q3 Summary</Breadcrumbs.Item>
    </Breadcrumbs.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "renders a navigation landmark with an ordered list",
      async () => {
        const nav = canvas.getByRole("navigation", { name: "Breadcrumbs" });
        await expect(nav).toBeInTheDocument();
        const list = canvas.getByRole("list");
        await expect(list).toBeInTheDocument();
        await expect(list.tagName).toBe("OL");
      }
    );

    await step("renders all items", async () => {
      const items = canvas.getAllByRole("listitem");
      await expect(items).toHaveLength(3);
    });

    await step("non-final items are links", async () => {
      const home = canvas.getByRole("link", { name: "Home" });
      const reports = canvas.getByRole("link", { name: "Reports" });
      await expect(home).toHaveAttribute("href", "/");
      await expect(reports).toHaveAttribute("href", "/reports");
    });

    await step("final item is marked as the current page", async () => {
      const current = canvas.getByText("Q3 Summary");
      // React Aria marks the current item with aria-current="page" and renders
      // it as a non-navigable element (no href, aria-disabled).
      await expect(current).toHaveAttribute("aria-current", "page");
      await expect(current).not.toHaveAttribute("href");
      await expect(current).toHaveAttribute("data-current", "true");
    });

    await step("links are reachable via keyboard", async () => {
      await userEvent.tab();
      await expect(canvas.getByRole("link", { name: "Home" })).toHaveFocus();
      await userEvent.tab();
      await expect(canvas.getByRole("link", { name: "Reports" })).toHaveFocus();
    });
  },
};

/**
 * Sizes story
 * Breadcrumbs support `sm` and `md` size variants.
 */
export const Sizes: Story = {
  render: (args) => (
    <Stack direction="column" gap="400" alignItems="flex-start">
      {sizes.map((size) => (
        <Breadcrumbs.Root
          key={size}
          {...args}
          size={size}
          aria-label={`${size} breadcrumbs`}
        >
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/library">Library</Breadcrumbs.Item>
          <Breadcrumbs.Item>Data</Breadcrumbs.Item>
        </Breadcrumbs.Root>
      ))}
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("renders one breadcrumb trail per size", async () => {
      const navs = canvas.getAllByRole("navigation");
      await expect(navs).toHaveLength(sizes.length);
    });
  },
};

/**
 * Dynamic collection
 * Demonstrates the `items` prop with a render function and the `onAction`
 * callback, which fires with the pressed item's `id`. When breadcrumbs drive
 * client-side routing, omit `href` and handle navigation via `onAction`.
 */
export const DynamicCollection: Story = {
  args: {
    onAction: fn(),
  },
  render: ({ onAction }) => (
    <Breadcrumbs.Root
      aria-label="Breadcrumbs"
      items={trail}
      onAction={onAction}
    >
      {(item: (typeof trail)[number]) => (
        <Breadcrumbs.Item>{item.label}</Breadcrumbs.Item>
      )}
    </Breadcrumbs.Root>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);

    await step("renders all items from the collection", async () => {
      await expect(canvas.getAllByRole("listitem")).toHaveLength(trail.length);
    });

    await step(
      "onAction fires with the item id when an item is pressed",
      async () => {
        await userEvent.click(canvas.getByText("Reports"));
        await expect(args.onAction).toHaveBeenCalledWith("reports");
      }
    );
  },
};

/**
 * Disabled
 * The whole trail can be disabled via `isDisabled` on the root.
 */
export const Disabled: Story = {
  render: () => (
    <Breadcrumbs.Root aria-label="Breadcrumbs" isDisabled>
      <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/reports">Reports</Breadcrumbs.Item>
      <Breadcrumbs.Item>Q3 Summary</Breadcrumbs.Item>
    </Breadcrumbs.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("disabled links expose data-disabled", async () => {
      const home = canvas.getByRole("link", { name: "Home" });
      await expect(home).toHaveAttribute("data-disabled");
    });
  },
};

/**
 * Controlled
 * Pressing a breadcrumb truncates the trail to that point — a common
 * application pattern for breadcrumbs that drive navigation state.
 */
export const Controlled: Story = {
  render: () => {
    const [items, setItems] = useState(trail);

    const navigate = (id: Key) => {
      const index = items.findIndex((item) => item.id === id);
      if (index >= 0) {
        setItems(items.slice(0, index + 1));
      }
    };

    return (
      <Stack gap="400" alignItems="flex-start">
        <Breadcrumbs.Root
          aria-label="Breadcrumbs"
          items={items}
          onAction={navigate}
        >
          {(item: (typeof trail)[number]) => (
            <Breadcrumbs.Item>{item.label}</Breadcrumbs.Item>
          )}
        </Breadcrumbs.Root>
        <Text data-testid="count">Items: {items.length}</Text>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("starts with the full trail", async () => {
      await expect(canvas.getByTestId("count")).toHaveTextContent("Items: 4");
    });

    await step("pressing an item truncates the trail", async () => {
      await userEvent.click(canvas.getByText("Reports"));
      await expect(canvas.getByTestId("count")).toHaveTextContent("Items: 2");
    });
  },
};

/**
 * SmokeTest
 * Comprehensive matrix of sizes for visual regression review.
 */
export const SmokeTest: Story = {
  render: () => (
    <Stack gap="600" alignItems="flex-start">
      {sizes.map((size) => (
        <Breadcrumbs.Root key={size} size={size} aria-label={`${size} smoke`}>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/a">Section</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/a/b">Subsection</Breadcrumbs.Item>
          <Breadcrumbs.Item>Current</Breadcrumbs.Item>
        </Breadcrumbs.Root>
      ))}
    </Stack>
  ),
};
