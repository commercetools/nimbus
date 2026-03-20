import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TabNav, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the TabNav component renders a nav landmark with anchor links
 * @docs-order 1
 */
describe("TabNav - Basic rendering", () => {
  it("renders a navigation landmark with links", () => {
    render(
      <NimbusProvider>
        <TabNav.Root aria-label="Order navigation">
          <TabNav.Item href="/orders/123/general" isCurrent>
            General
          </TabNav.Item>
          <TabNav.Item href="/orders/123/items">Items</TabNav.Item>
          <TabNav.Item href="/orders/123/shipping">Shipping</TabNav.Item>
        </TabNav.Root>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("navigation", { name: "Order navigation" })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(3);
  });

  it("renders items as anchor elements with correct href", () => {
    render(
      <NimbusProvider>
        <TabNav.Root aria-label="Order navigation">
          <TabNav.Item href="/orders/123/general">General</TabNav.Item>
          <TabNav.Item href="/orders/123/items">Items</TabNav.Item>
        </TabNav.Root>
      </NimbusProvider>
    );

    expect(screen.getByRole("link", { name: "General" })).toHaveAttribute(
      "href",
      "/orders/123/general"
    );
    expect(screen.getByRole("link", { name: "Items" })).toHaveAttribute(
      "href",
      "/orders/123/items"
    );
  });
});

/**
 * @docs-section active-item
 * @docs-title Active Item Tests
 * @docs-description Verify aria-current="page" is applied correctly to the active navigation item
 * @docs-order 2
 */
describe("TabNav - Active item", () => {
  it("sets aria-current='page' on the active item", () => {
    render(
      <NimbusProvider>
        <TabNav.Root aria-label="Order navigation">
          <TabNav.Item href="/orders/123/general" isCurrent>
            General
          </TabNav.Item>
          <TabNav.Item href="/orders/123/items">Items</TabNav.Item>
        </TabNav.Root>
      </NimbusProvider>
    );

    expect(screen.getByRole("link", { name: "General" })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("does not set aria-current on inactive items", () => {
    render(
      <NimbusProvider>
        <TabNav.Root aria-label="Order navigation">
          <TabNav.Item href="/orders/123/general" isCurrent>
            General
          </TabNav.Item>
          <TabNav.Item href="/orders/123/items">Items</TabNav.Item>
          <TabNav.Item href="/orders/123/shipping">Shipping</TabNav.Item>
        </TabNav.Root>
      </NimbusProvider>
    );

    expect(screen.getByRole("link", { name: "Items" })).not.toHaveAttribute(
      "aria-current"
    );
    expect(screen.getByRole("link", { name: "Shipping" })).not.toHaveAttribute(
      "aria-current"
    );
  });

  it("does not use aria-selected (navigation, not widget)", () => {
    render(
      <NimbusProvider>
        <TabNav.Root aria-label="Order navigation">
          <TabNav.Item href="/orders/123/general" isCurrent>
            General
          </TabNav.Item>
        </TabNav.Root>
      </NimbusProvider>
    );

    expect(screen.getByRole("link", { name: "General" })).not.toHaveAttribute(
      "aria-selected"
    );
  });
});

/**
 * @docs-section disabled-items
 * @docs-title Disabled Item Tests
 * @docs-description Verify disabled items are marked inaccessible and removed from tab order
 * @docs-order 3
 */
describe("TabNav - Disabled items", () => {
  it("marks disabled items with aria-disabled='true'", () => {
    render(
      <NimbusProvider>
        <TabNav.Root aria-label="Order navigation">
          <TabNav.Item href="/orders/123/general">General</TabNav.Item>
          <TabNav.Item href="/orders/123/shipping" isDisabled>
            Shipping
          </TabNav.Item>
        </TabNav.Root>
      </NimbusProvider>
    );

    const disabledItem = screen.getByRole("link", { name: "Shipping" });
    expect(disabledItem).toHaveAttribute("aria-disabled", "true");
  });

  it("disabled items have no tabIndex (excluded from tab sequence by browser)", () => {
    render(
      <NimbusProvider>
        <TabNav.Root aria-label="Order navigation">
          <TabNav.Item href="/orders/123/general">General</TabNav.Item>
          <TabNav.Item href="/orders/123/shipping" isDisabled>
            Shipping
          </TabNav.Item>
        </TabNav.Root>
      </NimbusProvider>
    );

    // React Aria sets no tabIndex on the disabled anchor — the browser excludes it
    const disabledItem = screen.getByRole("link", { name: "Shipping" });
    expect(disabledItem).not.toHaveAttribute("tabindex");
  });
});

/**
 * @docs-section external-links
 * @docs-title External Link Tests
 * @docs-description Verify target and rel attributes for external navigation items
 * @docs-order 4
 */
describe("TabNav - External links", () => {
  it("applies target and rel to external link items", () => {
    render(
      <NimbusProvider>
        <TabNav.Root aria-label="Order navigation">
          <TabNav.Item href="/orders/123/general" isCurrent>
            General
          </TabNav.Item>
          <TabNav.Item
            href="https://docs.example.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Docs ↗
          </TabNav.Item>
        </TabNav.Root>
      </NimbusProvider>
    );

    const externalLink = screen.getByRole("link", { name: "Docs ↗" });
    expect(externalLink).toHaveAttribute("target", "_blank");
    expect(externalLink).toHaveAttribute("rel", "noopener noreferrer");
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Verify click handling and keyboard activation
 * @docs-order 5
 */
describe("TabNav - Interactions", () => {
  it("calls onClick handler when a link is clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <NimbusProvider>
        <TabNav.Root aria-label="Order navigation">
          <TabNav.Item href="/orders/123/general" onClick={handleClick}>
            General
          </TabNav.Item>
        </TabNav.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("link", { name: "General" }));
    expect(handleClick).toHaveBeenCalled();
  });

  it("is focusable with Tab key", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <TabNav.Root aria-label="Order navigation">
          <TabNav.Item href="/orders/123/general">General</TabNav.Item>
        </TabNav.Root>
      </NimbusProvider>
    );

    await user.tab();
    expect(screen.getByRole("link", { name: "General" })).toHaveFocus();
  });
});

/**
 * @docs-section accessibility
 * @docs-title Accessibility Tests
 * @docs-description Verify accessible labels and ID support
 * @docs-order 6
 */
describe("TabNav - Accessibility", () => {
  it("supports aria-label on the root for landmark identification", () => {
    render(
      <NimbusProvider>
        <TabNav.Root aria-label="Order navigation">
          <TabNav.Item href="/orders/123/general">General</TabNav.Item>
        </TabNav.Root>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("navigation", { name: "Order navigation" })
    ).toBeInTheDocument();
  });

  it("supports a persistent id on the root for tracking", () => {
    render(
      <NimbusProvider>
        <TabNav.Root id="order-tab-nav" aria-label="Order navigation">
          <TabNav.Item href="/orders/123/general">General</TabNav.Item>
        </TabNav.Root>
      </NimbusProvider>
    );

    expect(screen.getByRole("navigation")).toHaveAttribute(
      "id",
      "order-tab-nav"
    );
  });
});
