import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import { Badge } from "@/components/badge";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the component renders with expected elements
 * @docs-order 1
 */
describe("Badge - Basic rendering", () => {
  it("renders content correctly", () => {
    render(<Badge>Status: Active</Badge>);

    expect(screen.getByText("Status: Active")).toBeInTheDocument();
  });

  it("renders with icon and text", () => {
    render(<Badge>Verified</Badge>);

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
    render(<Badge size="xs">Small Badge</Badge>);

    expect(screen.getByText("Small Badge")).toBeInTheDocument();
  });

  it("renders with specific color palette", () => {
    render(<Badge colorPalette="critical">Error</Badge>);

    expect(screen.getByText("Error")).toBeInTheDocument();
  });
});
