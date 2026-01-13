import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { VisuallyHidden, NimbusProvider, Button } from "@commercetools/nimbus";

/**
 * @docs-section basic-usage
 * @docs-title Basic Usage Tests
 * @docs-description Verify the VisuallyHidden component hides content visually while keeping it accessible
 * @docs-order 1
 */
describe("VisuallyHidden - Basic usage", () => {
  it("renders content that is accessible but visually hidden", () => {
    render(
      <NimbusProvider>
        <VisuallyHidden data-testid="hidden-content">
          Screen reader only text
        </VisuallyHidden>
      </NimbusProvider>
    );

    const element = screen.getByTestId("hidden-content");
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent("Screen reader only text");

    // Verify it's visually hidden
    const styles = window.getComputedStyle(element);
    expect(styles.position).toBe("absolute");
    expect(styles.width).toBe("1px");
    expect(styles.height).toBe("1px");
  });

  it("renders as div by default and as span when specified", () => {
    const { rerender } = render(
      <NimbusProvider>
        <VisuallyHidden data-testid="element">Content</VisuallyHidden>
      </NimbusProvider>
    );

    expect(screen.getByTestId("element").tagName).toBe("DIV");

    rerender(
      <NimbusProvider>
        <VisuallyHidden as="span" data-testid="element">
          Content
        </VisuallyHidden>
      </NimbusProvider>
    );

    expect(screen.getByTestId("element").tagName).toBe("SPAN");
  });

  it("supports skip navigation with isFocusable", () => {
    render(
      <NimbusProvider>
        <VisuallyHidden isFocusable>
          <Button data-testid="skip-button">Skip to content</Button>
        </VisuallyHidden>
      </NimbusProvider>
    );

    expect(screen.getByTestId("skip-button")).toBeInTheDocument();
  });
});

/**
 * @docs-section accessibility
 * @docs-title Accessibility Tests
 * @docs-description Verify ARIA attributes and accessibility patterns
 * @docs-order 2
 */
describe("VisuallyHidden - Accessibility", () => {
  it("forwards ARIA attributes for live regions", () => {
    render(
      <NimbusProvider>
        <VisuallyHidden
          role="status"
          aria-live="polite"
          data-testid="status-region"
        >
          Loading complete
        </VisuallyHidden>
      </NimbusProvider>
    );

    const element = screen.getByTestId("status-region");
    expect(element).toHaveAttribute("role", "status");
    expect(element).toHaveAttribute("aria-live", "polite");
  });

  it("can be used with aria-describedby for form hints", () => {
    render(
      <NimbusProvider>
        <input
          type="text"
          aria-describedby="field-hint"
          data-testid="input-field"
        />
        <VisuallyHidden id="field-hint">
          Enter your full name as it appears on your ID
        </VisuallyHidden>
      </NimbusProvider>
    );

    const input = screen.getByTestId("input-field");
    expect(input).toHaveAttribute("aria-describedby", "field-hint");
  });

  it("provides accessible labels for icon buttons", () => {
    render(
      <NimbusProvider>
        <Button data-testid="icon-button">
          <span aria-hidden="true">⚙️</span>
          <VisuallyHidden>Settings</VisuallyHidden>
        </Button>
      </NimbusProvider>
    );

    const button = screen.getByTestId("icon-button");
    expect(button).toHaveTextContent("Settings");
  });
});
