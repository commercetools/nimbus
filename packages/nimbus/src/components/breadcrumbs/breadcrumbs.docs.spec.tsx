import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Breadcrumbs, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the Breadcrumbs component renders a nav landmark with an ordered list of links
 * @docs-order 1
 */
describe("Breadcrumbs - Basic rendering", () => {
  it("renders a navigation landmark with an ordered list", () => {
    render(
      <NimbusProvider>
        <Breadcrumbs.Root aria-label="Breadcrumb">
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/orders">Orders</Breadcrumbs.Item>
          <Breadcrumbs.Item isCurrent>Order #123</Breadcrumbs.Item>
        </Breadcrumbs.Root>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("navigation", { name: "Breadcrumb" })
    ).toBeInTheDocument();
    expect(screen.getByRole("list").tagName).toBe("OL");
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("renders link items as anchors with the correct href", () => {
    render(
      <NimbusProvider>
        <Breadcrumbs.Root aria-label="Breadcrumb">
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/orders">Orders</Breadcrumbs.Item>
        </Breadcrumbs.Root>
      </NimbusProvider>
    );

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getByRole("link", { name: "Orders" })).toHaveAttribute(
      "href",
      "/orders"
    );
  });
});

/**
 * @docs-section current-page
 * @docs-title Current Page Tests
 * @docs-description Verify aria-current="page" is applied to the current (last) item and not to ancestors
 * @docs-order 2
 */
describe("Breadcrumbs - Current page", () => {
  it("sets aria-current='page' on the current item", () => {
    render(
      <NimbusProvider>
        <Breadcrumbs.Root aria-label="Breadcrumb">
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item isCurrent>Order #123</Breadcrumbs.Item>
        </Breadcrumbs.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Order #123")).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("renders the current item as non-interactive text, not a link", () => {
    render(
      <NimbusProvider>
        <Breadcrumbs.Root aria-label="Breadcrumb">
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item isCurrent>Order #123</Breadcrumbs.Item>
        </Breadcrumbs.Root>
      </NimbusProvider>
    );

    // An <a> without href exposes no `link` role, so the current page is
    // non-interactive and absent from the list of links.
    expect(
      screen.queryByRole("link", { name: "Order #123" })
    ).not.toBeInTheDocument();
    expect(screen.getByText("Order #123")).not.toHaveAttribute("href");
  });

  it("does not set aria-current on ancestor items", () => {
    render(
      <NimbusProvider>
        <Breadcrumbs.Root aria-label="Breadcrumb">
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/orders">Orders</Breadcrumbs.Item>
          <Breadcrumbs.Item isCurrent>Order #123</Breadcrumbs.Item>
        </Breadcrumbs.Root>
      </NimbusProvider>
    );

    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute(
      "aria-current"
    );
    expect(screen.getByRole("link", { name: "Orders" })).not.toHaveAttribute(
      "aria-current"
    );
  });
});

/**
 * @docs-section disabled-items
 * @docs-title Disabled Item Tests
 * @docs-description Verify disabled items are marked inaccessible and stripped of their href
 * @docs-order 3
 */
describe("Breadcrumbs - Disabled items", () => {
  it("marks disabled items with aria-disabled='true' and strips href", () => {
    render(
      <NimbusProvider>
        <Breadcrumbs.Root aria-label="Breadcrumb">
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/orders" isDisabled>
            Orders
          </Breadcrumbs.Item>
          <Breadcrumbs.Item isCurrent>Order #123</Breadcrumbs.Item>
        </Breadcrumbs.Root>
      </NimbusProvider>
    );

    const disabled = screen.getByRole("link", { name: "Orders" });
    expect(disabled).toHaveAttribute("aria-disabled", "true");
    expect(disabled).not.toHaveAttribute("href");
  });
});

/**
 * @docs-section external-links
 * @docs-title External Link Tests
 * @docs-description Verify target and rel attributes for external breadcrumb items
 * @docs-order 4
 */
describe("Breadcrumbs - External links", () => {
  it("applies target and rel to external link items", () => {
    render(
      <NimbusProvider>
        <Breadcrumbs.Root aria-label="Breadcrumb">
          <Breadcrumbs.Item
            href="https://docs.example.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Docs ↗
          </Breadcrumbs.Item>
          <Breadcrumbs.Item isCurrent>Current page</Breadcrumbs.Item>
        </Breadcrumbs.Root>
      </NimbusProvider>
    );

    const external = screen.getByRole("link", { name: "Docs ↗" });
    expect(external).toHaveAttribute("target", "_blank");
    expect(external).toHaveAttribute("rel", "noopener noreferrer");
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Verify click handling and keyboard focus
 * @docs-order 5
 */
describe("Breadcrumbs - Interactions", () => {
  it("calls onClick when a link is clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <NimbusProvider>
        <Breadcrumbs.Root aria-label="Breadcrumb">
          <Breadcrumbs.Item href="/" onClick={handleClick}>
            Home
          </Breadcrumbs.Item>
          <Breadcrumbs.Item isCurrent>Order #123</Breadcrumbs.Item>
        </Breadcrumbs.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("link", { name: "Home" }));
    expect(handleClick).toHaveBeenCalled();
  });

  it("focuses link items with the Tab key", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Breadcrumbs.Root aria-label="Breadcrumb">
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item isCurrent>Order #123</Breadcrumbs.Item>
        </Breadcrumbs.Root>
      </NimbusProvider>
    );

    await user.tab();
    expect(screen.getByRole("link", { name: "Home" })).toHaveFocus();
  });
});

/**
 * @docs-section accessibility
 * @docs-title Accessibility Tests
 * @docs-description Verify accessible labels and that the widget does not use aria-selected
 * @docs-order 6
 */
describe("Breadcrumbs - Accessibility", () => {
  it("supports aria-label on the root for landmark identification", () => {
    render(
      <NimbusProvider>
        <Breadcrumbs.Root aria-label="Breadcrumb">
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
        </Breadcrumbs.Root>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("navigation", { name: "Breadcrumb" })
    ).toBeInTheDocument();
  });

  it("does not use aria-selected (navigation, not a widget)", () => {
    render(
      <NimbusProvider>
        <Breadcrumbs.Root aria-label="Breadcrumb">
          <Breadcrumbs.Item isCurrent>Order #123</Breadcrumbs.Item>
        </Breadcrumbs.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Order #123")).not.toHaveAttribute("aria-selected");
  });
});
