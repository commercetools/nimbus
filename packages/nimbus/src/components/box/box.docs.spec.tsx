import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Box, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the component renders with expected content
 * @docs-order 1
 */
describe("Box - Basic rendering", () => {
  it("renders content correctly", () => {
    render(
      <NimbusProvider>
        <Box>Box content</Box>
      </NimbusProvider>
    );

    expect(screen.getByText("Box content")).toBeInTheDocument();
  });

  it("renders with children components", () => {
    render(
      <NimbusProvider>
        <Box>
          <span>Child element</span>
        </Box>
      </NimbusProvider>
    );

    expect(screen.getByText("Child element")).toBeInTheDocument();
  });
});

/**
 * @docs-section style-props
 * @docs-title Style Props Tests
 * @docs-description Test rendering with various Chakra UI style props
 * @docs-order 2
 */
describe("Box - Style props", () => {
  it("applies custom className", () => {
    render(
      <NimbusProvider>
        <Box className="custom-class">Styled Box</Box>
      </NimbusProvider>
    );

    const box = screen.getByText("Styled Box");
    expect(box).toHaveClass("custom-class");
  });

  it("renders with data attributes for testing", () => {
    render(
      <NimbusProvider>
        <Box data-testid="test-box">Test Box</Box>
      </NimbusProvider>
    );

    expect(screen.getByTestId("test-box")).toBeInTheDocument();
  });
});

/**
 * @docs-section polymorphic-rendering
 * @docs-title Polymorphic Rendering Tests
 * @docs-description Test rendering as different HTML elements
 * @docs-order 3
 */
describe("Box - Polymorphic rendering", () => {
  it("renders as section element", () => {
    render(
      <NimbusProvider>
        <Box as="section" aria-label="Test section">
          Section content
        </Box>
      </NimbusProvider>
    );

    const section = screen.getByRole("region", { name: "Test section" });
    expect(section).toBeInTheDocument();
    expect(section.tagName).toBe("SECTION");
  });

  it("renders as nav element", () => {
    render(
      <NimbusProvider>
        <Box as="nav" aria-label="Test navigation">
          Navigation content
        </Box>
      </NimbusProvider>
    );

    const nav = screen.getByRole("navigation", { name: "Test navigation" });
    expect(nav).toBeInTheDocument();
    expect(nav.tagName).toBe("NAV");
  });

  it("renders as article element", () => {
    render(
      <NimbusProvider>
        <Box as="article">Article content</Box>
      </NimbusProvider>
    );

    const article = screen.getByRole("article");
    expect(article).toBeInTheDocument();
    expect(article.tagName).toBe("ARTICLE");
  });
});

/**
 * @docs-section asChild-composition
 * @docs-title AsChild Composition Tests
 * @docs-description Test style composition with asChild prop
 * @docs-order 4
 */
describe("Box - AsChild composition", () => {
  it("applies styles to child button element", () => {
    render(
      <NimbusProvider>
        <Box asChild>
          <button>Styled Button</button>
        </Box>
      </NimbusProvider>
    );

    const button = screen.getByRole("button", { name: "Styled Button" });
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe("BUTTON");
  });

  it("preserves child link functionality with styles", () => {
    render(
      <NimbusProvider>
        <Box asChild>
          <a href="/test">Styled Link</a>
        </Box>
      </NimbusProvider>
    );

    const link = screen.getByRole("link", { name: "Styled Link" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
  });
});
