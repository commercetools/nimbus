import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Separator, Box, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the Separator component renders with expected accessibility attributes
 * @docs-order 1
 */
describe("Separator - Basic rendering", () => {
  it("renders with separator role", () => {
    render(
      <NimbusProvider>
        <Separator data-testid="separator-test" />
      </NimbusProvider>
    );

    const separator = screen.getByTestId("separator-test");
    expect(separator).toHaveAttribute("role", "separator");
  });

  it("renders horizontal separator by default", () => {
    render(
      <NimbusProvider>
        <Separator data-testid="separator-horizontal" />
      </NimbusProvider>
    );

    const separator = screen.getByTestId("separator-horizontal");
    // Horizontal is default, so aria-orientation is not set
    expect(separator).not.toHaveAttribute("aria-orientation");
  });

  it("renders vertical separator with aria-orientation", () => {
    render(
      <NimbusProvider>
        <Separator orientation="vertical" data-testid="separator-vertical" />
      </NimbusProvider>
    );

    const separator = screen.getByTestId("separator-vertical");
    expect(separator).toHaveAttribute("aria-orientation", "vertical");
  });
});

/**
 * @docs-section layout-integration
 * @docs-title Layout Integration Tests
 * @docs-description Test Separator integration with common layout patterns
 * @docs-order 2
 */
describe("Separator - Layout integration", () => {
  it("renders within content sections", () => {
    render(
      <NimbusProvider>
        <Box>
          <Box data-testid="content-above">Content above</Box>
          <Separator data-testid="separator-divider" />
          <Box data-testid="content-below">Content below</Box>
        </Box>
      </NimbusProvider>
    );

    expect(screen.getByTestId("content-above")).toBeInTheDocument();
    expect(screen.getByTestId("separator-divider")).toBeInTheDocument();
    expect(screen.getByTestId("content-below")).toBeInTheDocument();
  });
});

/**
 * @docs-section accessibility
 * @docs-title Accessibility Tests
 * @docs-description Verify accessibility attributes and non-interactive behavior
 * @docs-order 3
 */
describe("Separator - Accessibility", () => {
  it("is not focusable", () => {
    render(
      <NimbusProvider>
        <Separator data-testid="separator-non-focusable" />
      </NimbusProvider>
    );

    const separator = screen.getByTestId("separator-non-focusable");
    // Separators are presentational and should not be in the tab order
    expect(separator).not.toHaveAttribute("tabindex");
  });

  it("supports custom id for analytics", () => {
    const PERSISTENT_ID = "analytics-separator";

    render(
      <NimbusProvider>
        <Separator id={PERSISTENT_ID} />
      </NimbusProvider>
    );

    const separator = screen.getByRole("separator");
    expect(separator).toHaveAttribute("id", PERSISTENT_ID);
  });
});
