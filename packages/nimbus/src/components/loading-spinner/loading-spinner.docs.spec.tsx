import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingSpinner, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the component renders with the expected accessibility attributes
 * @docs-order 1
 */
describe("LoadingSpinner - Basic rendering", () => {
  it("renders with default accessibility attributes", () => {
    render(
      <NimbusProvider>
        <LoadingSpinner />
      </NimbusProvider>
    );

    // Verify role and default label
    const spinner = screen.getByRole("progressbar");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute("aria-label", "Loading");
  });

  it("renders with a custom accessible label", () => {
    render(
      <NimbusProvider>
        <LoadingSpinner aria-label="Loading products" />
      </NimbusProvider>
    );

    expect(
      screen.getByRole("progressbar", { name: "Loading products" })
    ).toBeInTheDocument();
  });

  it("renders with different sizes", () => {
    const { rerender } = render(
      <NimbusProvider>
        <LoadingSpinner size="sm" />
      </NimbusProvider>
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    rerender(
      <NimbusProvider>
        <LoadingSpinner size="lg" />
      </NimbusProvider>
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
