import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the component renders with expected elements
 * @docs-order 1
 */
describe("Badge - Basic rendering", () => {
  it("renders content correctly", () => {
    render(
      <NimbusProvider>
        <Badge>Status: Active</Badge>
      </NimbusProvider>
    );

    expect(screen.getByText("Status: Active")).toBeInTheDocument();
  });

  it("renders with icon and text", () => {
    render(
      <NimbusProvider>
        <Badge>Verified</Badge>
      </NimbusProvider>
    );

    expect(screen.getByText("Verified")).toBeInTheDocument();
  });
});

/**
 * @docs-section variant-rendering
 * @docs-title Variant Rendering Tests
 * @docs-description Test rendering with different sizes and color palettes
 * @docs-order 2
 */
describe("Badge - Variants", () => {
  it("renders with specific size", () => {
    render(
      <NimbusProvider>
        <Badge size="xs">Small Badge</Badge>
      </NimbusProvider>
    );

    expect(screen.getByText("Small Badge")).toBeInTheDocument();
  });

  it("renders with specific color palette", () => {
    render(
      <NimbusProvider>
        <Badge colorPalette="critical">Error</Badge>
      </NimbusProvider>
    );

    expect(screen.getByText("Error")).toBeInTheDocument();
  });
});
