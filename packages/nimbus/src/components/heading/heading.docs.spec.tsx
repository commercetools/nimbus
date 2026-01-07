import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Heading, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the heading component renders with expected content
 * @docs-order 1
 */
describe("Heading - Basic rendering", () => {
  it("renders heading with text content", () => {
    render(
      <NimbusProvider>
        <Heading>Welcome to Dashboard</Heading>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("heading", { name: "Welcome to Dashboard" })
    ).toBeInTheDocument();
  });

  it("renders with default h2 semantic level", () => {
    render(
      <NimbusProvider>
        <Heading>Default Heading</Heading>
      </NimbusProvider>
    );

    const heading = screen.getByRole("heading", { name: "Default Heading" });
    expect(heading.tagName).toBe("H2");
  });
});

/**
 * @docs-section size-variants
 * @docs-title Size Variant Tests
 * @docs-description Test different size variants to ensure proper rendering
 * @docs-order 2
 */
describe("Heading - Size variants", () => {
  it("renders with small size", () => {
    render(
      <NimbusProvider>
        <Heading size="sm">Small Heading</Heading>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("heading", { name: "Small Heading" })
    ).toBeInTheDocument();
  });

  it("renders with extra large size", () => {
    render(
      <NimbusProvider>
        <Heading size="xl">Extra Large Heading</Heading>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("heading", { name: "Extra Large Heading" })
    ).toBeInTheDocument();
  });

  it("renders with 5xl size", () => {
    render(
      <NimbusProvider>
        <Heading size="5xl">Massive Heading</Heading>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("heading", { name: "Massive Heading" })
    ).toBeInTheDocument();
  });
});

/**
 * @docs-section semantic-levels
 * @docs-title Semantic HTML Level Tests
 * @docs-description Test heading semantic levels for proper document structure
 * @docs-order 3
 */
describe("Heading - Semantic levels", () => {
  it("renders as h1 when specified", () => {
    render(
      <NimbusProvider>
        <Heading as="h1">Page Title</Heading>
      </NimbusProvider>
    );

    const heading = screen.getByRole("heading", {
      level: 1,
      name: "Page Title",
    });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe("H1");
  });

  it("renders as h3 when specified", () => {
    render(
      <NimbusProvider>
        <Heading as="h3">Subsection Title</Heading>
      </NimbusProvider>
    );

    const heading = screen.getByRole("heading", {
      level: 3,
      name: "Subsection Title",
    });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe("H3");
  });

  it("renders as h6 when specified", () => {
    render(
      <NimbusProvider>
        <Heading as="h6">Minor Heading</Heading>
      </NimbusProvider>
    );

    const heading = screen.getByRole("heading", {
      level: 6,
      name: "Minor Heading",
    });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe("H6");
  });
});

/**
 * @docs-section style-props
 * @docs-title Style Props Tests
 * @docs-description Test that style props are properly applied
 * @docs-order 4
 */
describe("Heading - Style props", () => {
  it("applies custom id for analytics tracking", () => {
    const PERSISTENT_ID = "dashboard-title";

    render(
      <NimbusProvider>
        <Heading id={PERSISTENT_ID}>Dashboard</Heading>
      </NimbusProvider>
    );

    const heading = screen.getByRole("heading", { name: "Dashboard" });
    expect(heading).toHaveAttribute("id", PERSISTENT_ID);
  });

  it("applies className for custom styling", () => {
    render(
      <NimbusProvider>
        <Heading className="custom-heading">Styled Heading</Heading>
      </NimbusProvider>
    );

    const heading = screen.getByRole("heading", { name: "Styled Heading" });
    expect(heading).toHaveClass("custom-heading");
  });
});

/**
 * @docs-section accessibility
 * @docs-title Accessibility Tests
 * @docs-description Verify heading accessibility features
 * @docs-order 5
 */
describe("Heading - Accessibility", () => {
  it("provides accessible heading role", () => {
    render(
      <NimbusProvider>
        <Heading>Accessible Heading</Heading>
      </NimbusProvider>
    );

    const heading = screen.getByRole("heading");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveAccessibleName("Accessible Heading");
  });

  it("supports aria-label for screen readers", () => {
    render(
      <NimbusProvider>
        <Heading aria-label="Dashboard Overview">Dashboard</Heading>
      </NimbusProvider>
    );

    const heading = screen.getByRole("heading", { name: "Dashboard Overview" });
    expect(heading).toBeInTheDocument();
  });

  it("maintains proper heading hierarchy", () => {
    render(
      <NimbusProvider>
        <div>
          <Heading as="h1">Main Title</Heading>
          <Heading as="h2">Section Title</Heading>
          <Heading as="h3">Subsection Title</Heading>
        </div>
      </NimbusProvider>
    );

    const h1 = screen.getByRole("heading", { level: 1 });
    const h2 = screen.getByRole("heading", { level: 2 });
    const h3 = screen.getByRole("heading", { level: 3 });

    expect(h1).toBeInTheDocument();
    expect(h2).toBeInTheDocument();
    expect(h3).toBeInTheDocument();
  });
});
