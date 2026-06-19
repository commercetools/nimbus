import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ActivityIndicator, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the indicator renders and exposes the expected accessibility semantics
 * @docs-order 1
 */
describe("ActivityIndicator - Basic rendering", () => {
  it("is decorative by default (aria-hidden, no role)", () => {
    render(
      <NimbusProvider>
        <ActivityIndicator data-testid="indicator" />
      </NimbusProvider>
    );

    const indicator = screen.getByTestId("indicator");
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveAttribute("aria-hidden", "true");
    expect(indicator).not.toHaveAttribute("role");
  });

  it("renders three dot elements", () => {
    render(
      <NimbusProvider>
        <ActivityIndicator data-testid="indicator" />
      </NimbusProvider>
    );

    const dots = screen.getByTestId("indicator").querySelectorAll("[data-dot]");
    expect(dots).toHaveLength(3);
  });
});
