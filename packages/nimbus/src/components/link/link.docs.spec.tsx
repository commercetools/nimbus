import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Link, NimbusProvider } from "@commercetools/nimbus";
import type { NimbusRouterConfig } from "../nimbus-provider/nimbus-provider.types";

/**
 * Mock router to prevent JSDOM "Not implemented: navigation" warnings
 * when tests click on links or trigger navigation via keyboard.
 */
const mockRouter: NimbusRouterConfig = {
  navigate: vi.fn(),
};

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the Link component renders with expected elements and attributes
 * @docs-order 1
 */
describe("Link - Basic rendering", () => {
  it("renders a link with text content", () => {
    render(
      <NimbusProvider>
        <Link href="/dashboard">Go to Dashboard</Link>
      </NimbusProvider>
    );

    const link = screen.getByRole("link", { name: "Go to Dashboard" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/dashboard");
  });

  it("renders with custom href", () => {
    render(
      <NimbusProvider>
        <Link href="https://commercetools.com">Visit Site</Link>
      </NimbusProvider>
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://commercetools.com");
  });

  it("forwards ref to anchor element", () => {
    const ref = { current: null };
    render(
      <NimbusProvider>
        <Link href="/page" ref={ref}>
          Link with Ref
        </Link>
      </NimbusProvider>
    );

    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });
});

/**
 * @docs-section navigation
 * @docs-title Navigation Tests
 * @docs-description Test link navigation behavior and click handling
 * @docs-order 2
 */
describe("Link - Navigation", () => {
  it("handles click events", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <NimbusProvider router={mockRouter}>
        <Link href="/page" onClick={handleClick}>
          Clickable Link
        </Link>
      </NimbusProvider>
    );

    const link = screen.getByRole("link");
    await user.click(link);

    expect(handleClick).toHaveBeenCalled();
  });

  it("supports keyboard activation with Enter key", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <NimbusProvider router={mockRouter}>
        <Link href="/page" onClick={handleClick}>
          Keyboard Link
        </Link>
      </NimbusProvider>
    );

    const link = screen.getByRole("link");
    link.focus();
    await user.keyboard("{Enter}");

    expect(handleClick).toHaveBeenCalled();
  });

  it("is focusable with Tab key", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Link href="/page">Focusable Link</Link>
      </NimbusProvider>
    );

    const link = screen.getByRole("link");
    await user.tab();

    expect(link).toHaveFocus();
  });
});

/**
 * @docs-section external-links
 * @docs-title External Link Tests
 * @docs-description Test external link behavior with target and rel attributes
 * @docs-order 3
 */
describe("Link - External links", () => {
  it("opens external links in new tab with proper security attributes", () => {
    render(
      <NimbusProvider>
        <Link
          href="https://external-site.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          External Link
        </Link>
      </NimbusProvider>
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("supports download attribute for file downloads", () => {
    render(
      <NimbusProvider>
        <Link href="/files/report.pdf" download="report.pdf">
          Download Report
        </Link>
      </NimbusProvider>
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("download", "report.pdf");
  });
});

/**
 * @docs-section size-variants
 * @docs-title Size Variant Tests
 * @docs-description Verify different size options render correctly
 * @docs-order 4
 */
describe("Link - Size variants", () => {
  it("renders with extra small size", () => {
    render(
      <NimbusProvider>
        <Link href="/page" size="xs">
          Extra Small Link
        </Link>
      </NimbusProvider>
    );

    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
  });

  it("renders with small size", () => {
    render(
      <NimbusProvider>
        <Link href="/page" size="sm">
          Small Link
        </Link>
      </NimbusProvider>
    );

    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
  });

  it("renders with medium size (default)", () => {
    render(
      <NimbusProvider>
        <Link href="/page" size="md">
          Medium Link
        </Link>
      </NimbusProvider>
    );

    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
  });
});

/**
 * @docs-section font-color-variants
 * @docs-title Font Color Variant Tests
 * @docs-description Verify different font color options render correctly
 * @docs-order 5
 */
describe("Link - Font color variants", () => {
  it("renders with primary color", () => {
    render(
      <NimbusProvider>
        <Link href="/page" fontColor="primary">
          Primary Link
        </Link>
      </NimbusProvider>
    );

    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
  });

  it("renders with inherited color", () => {
    render(
      <NimbusProvider>
        <Link href="/page" fontColor="inherit">
          Inherited Color Link
        </Link>
      </NimbusProvider>
    );

    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
  });
});

/**
 * @docs-section accessibility
 * @docs-title Accessibility Tests
 * @docs-description Verify accessibility features and ARIA attributes
 * @docs-order 6
 */
describe("Link - Accessibility", () => {
  it("supports aria-label for icon-only links", () => {
    render(
      <NimbusProvider>
        <Link href="/profile" aria-label="View user profile">
          👤
        </Link>
      </NimbusProvider>
    );

    const link = screen.getByRole("link", { name: "View user profile" });
    expect(link).toBeInTheDocument();
  });

  it("supports custom id for tracking", () => {
    render(
      <NimbusProvider>
        <Link href="/page" id="nav-dashboard-link">
          Dashboard
        </Link>
      </NimbusProvider>
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("id", "nav-dashboard-link");
  });

  it("supports data attributes for testing", () => {
    render(
      <NimbusProvider>
        <Link href="/page" data-testid="custom-link">
          Test Link
        </Link>
      </NimbusProvider>
    );

    const link = screen.getByTestId("custom-link");
    expect(link).toBeInTheDocument();
  });
});

/**
 * @docs-section special-links
 * @docs-title Special Link Types Tests
 * @docs-description Test email, phone, and other special link types
 * @docs-order 7
 */
describe("Link - Special link types", () => {
  it("creates mailto links correctly", () => {
    render(
      <NimbusProvider>
        <Link href="mailto:support@example.com">Email Support</Link>
      </NimbusProvider>
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "mailto:support@example.com");
  });

  it("creates tel links correctly", () => {
    render(
      <NimbusProvider>
        <Link href="tel:+1234567890">Call Us</Link>
      </NimbusProvider>
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "tel:+1234567890");
  });
});
