import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { InlineSvg, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-usage
 * @docs-title Basic Usage Tests
 * @docs-description Verify InlineSvg renders SVG content correctly from string data
 * @docs-order 1
 */
describe("InlineSvg - Basic usage", () => {
  it("renders valid SVG content from string", () => {
    const svgData = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="currentColor"/>
    </svg>`;

    render(
      <NimbusProvider>
        <InlineSvg data={svgData} size="md" data-testid="inline-svg" />
      </NimbusProvider>
    );

    const svg = screen.getByTestId("inline-svg");
    expect(svg).toBeInTheDocument();
    expect(svg.tagName).toBe("svg");
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    expect(svg.querySelector("circle")).toBeInTheDocument();
  });

  it("preserves SVG attributes from the source", () => {
    const svgData = `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7v10l10 5 10-5V7z"/>
    </svg>`;

    render(
      <NimbusProvider>
        <InlineSvg data={svgData} size="md" data-testid="inline-svg" />
      </NimbusProvider>
    );

    const svg = screen.getByTestId("inline-svg");
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    expect(svg).toHaveAttribute("stroke", "currentColor");
    expect(svg.querySelector("path")).toBeInTheDocument();
  });

  it("handles invalid SVG gracefully", () => {
    // Suppress expected warning when invalid SVG is passed
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const invalidSvg = "This is not valid SVG markup";

    render(
      <NimbusProvider>
        <InlineSvg data={invalidSvg} size="md" data-testid="inline-svg" />
      </NimbusProvider>
    );

    // Component should not render when SVG is invalid
    expect(screen.queryByTestId("inline-svg")).not.toBeInTheDocument();

    // Verify the warning was called and restore
    expect(consoleSpy).toHaveBeenCalledWith(
      "InlineSvg: No SVG element found in markup"
    );
    consoleSpy.mockRestore();
  });
});

/**
 * @docs-section security
 * @docs-title Security Tests
 * @docs-description Verify SVG sanitization removes malicious content
 * @docs-order 2
 */
describe("InlineSvg - Security", () => {
  it("removes script tags from SVG", () => {
    const maliciousSvg = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <script>alert('XSS')</script>
      <circle cx="12" cy="12" r="10" fill="currentColor"/>
    </svg>`;

    render(
      <NimbusProvider>
        <InlineSvg data={maliciousSvg} size="md" data-testid="inline-svg" />
      </NimbusProvider>
    );

    const svg = screen.getByTestId("inline-svg");
    expect(svg.querySelector("script")).not.toBeInTheDocument();
  });

  it("removes event handlers from SVG elements", () => {
    const maliciousSvg = `<svg viewBox="0 0 24 24" onclick="alert('XSS')" xmlns="http://www.w3.org/2000/svg">
      <path onclick="alert('XSS2')" d="M12 2L2 7v10l10 5 10-5V7z" fill="currentColor"/>
    </svg>`;

    render(
      <NimbusProvider>
        <InlineSvg data={maliciousSvg} size="md" data-testid="inline-svg" />
      </NimbusProvider>
    );

    const svg = screen.getByTestId("inline-svg");
    expect(svg).not.toHaveAttribute("onclick");

    const path = svg.querySelector("path");
    expect(path).not.toHaveAttribute("onclick");
  });

  it("removes style tags from SVG", () => {
    const maliciousSvg = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <style>body { display: none; }</style>
      <circle cx="12" cy="12" r="10" fill="currentColor"/>
    </svg>`;

    render(
      <NimbusProvider>
        <InlineSvg data={maliciousSvg} size="md" data-testid="inline-svg" />
      </NimbusProvider>
    );

    const svg = screen.getByTestId("inline-svg");
    expect(svg.querySelector("style")).not.toBeInTheDocument();
  });
});

/**
 * @docs-section styling
 * @docs-title Styling Tests
 * @docs-description Verify size variants and color customization
 * @docs-order 3
 */
describe("InlineSvg - Styling", () => {
  it("applies size variants", () => {
    const svgData = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="currentColor"/>
    </svg>`;

    const { rerender } = render(
      <NimbusProvider>
        <InlineSvg data={svgData} size="sm" data-testid="inline-svg" />
      </NimbusProvider>
    );

    expect(screen.getByTestId("inline-svg")).toBeInTheDocument();

    rerender(
      <NimbusProvider>
        <InlineSvg data={svgData} size="lg" data-testid="inline-svg" />
      </NimbusProvider>
    );

    expect(screen.getByTestId("inline-svg")).toBeInTheDocument();
  });

  it("preserves multi-color SVG attributes", () => {
    const multiColorSvg = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="24" height="24" fill="#e11d48"/>
      <circle cx="12" cy="12" r="5" fill="#10b981"/>
    </svg>`;

    render(
      <NimbusProvider>
        <InlineSvg data={multiColorSvg} size="md" data-testid="inline-svg" />
      </NimbusProvider>
    );

    const svg = screen.getByTestId("inline-svg");
    const rect = svg.querySelector("rect");
    const circle = svg.querySelector("circle");

    expect(rect).toHaveAttribute("fill", "#e11d48");
    expect(circle).toHaveAttribute("fill", "#10b981");
  });

  it("always renders as svg element", () => {
    const svgData = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="currentColor"/>
    </svg>`;

    render(
      <NimbusProvider>
        <InlineSvg data={svgData} size="md" data-testid="inline-svg" />
      </NimbusProvider>
    );

    const element = screen.getByTestId("inline-svg");
    expect(element.tagName.toLowerCase()).toBe("svg");
  });
});

/**
 * @docs-section accessibility
 * @docs-title Accessibility Tests
 * @docs-description Verify accessibility attributes and presentation role
 * @docs-order 4
 */
describe("InlineSvg - Accessibility", () => {
  it("renders with presentation role", () => {
    const svgData = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="currentColor"/>
    </svg>`;

    render(
      <NimbusProvider>
        <InlineSvg data={svgData} size="md" />
      </NimbusProvider>
    );

    const svg = screen.getByRole("presentation");
    expect(svg).toBeInTheDocument();
  });
});

/**
 * @docs-section complex-svg
 * @docs-title Complex SVG Tests
 * @docs-description Verify handling of complex SVG structures
 * @docs-order 5
 */
describe("InlineSvg - Complex SVG", () => {
  it("handles SVG with multiple paths and elements", () => {
    const complexSvg = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7v10l10 5 10-5V7z"/>
      <polyline points="7.5 4.21 12 6.81 16.5 4.21"/>
      <line x1="12" x2="12" y1="22.08" y2="12"/>
    </svg>`;

    render(
      <NimbusProvider>
        <InlineSvg data={complexSvg} size="md" data-testid="inline-svg" />
      </NimbusProvider>
    );

    const svg = screen.getByTestId("inline-svg");
    expect(svg.querySelector("path")).toBeInTheDocument();
    expect(svg.querySelector("polyline")).toBeInTheDocument();
    expect(svg.querySelector("line")).toBeInTheDocument();
  });

  it("preserves nested SVG groups", () => {
    const groupedSvg = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g fill="currentColor">
        <circle cx="8" cy="12" r="3"/>
        <circle cx="16" cy="12" r="3"/>
      </g>
    </svg>`;

    render(
      <NimbusProvider>
        <InlineSvg data={groupedSvg} size="md" data-testid="inline-svg" />
      </NimbusProvider>
    );

    const svg = screen.getByTestId("inline-svg");
    const group = svg.querySelector("g");
    expect(group).toBeInTheDocument();
    expect(group?.querySelectorAll("circle")).toHaveLength(2);
  });
});
