import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressBar, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the component renders with expected elements and accessibility attributes
 * @docs-order 1
 */
describe("ProgressBar - Basic rendering", () => {
  it("renders progress bar element", () => {
    render(
      <NimbusProvider>
        <ProgressBar value={50} label="Loading" />
      </NimbusProvider>
    );

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
  });

  it("renders with correct aria-label from label prop", () => {
    render(
      <NimbusProvider>
        <ProgressBar value={75} label="Upload progress" />
      </NimbusProvider>
    );

    const progressBar = screen.getByRole("progressbar", {
      name: /upload progress/i,
    });
    expect(progressBar).toBeInTheDocument();
  });

  it("renders with aria-label when provided", () => {
    render(
      <NimbusProvider>
        <ProgressBar value={50} layout="minimal" aria-label="File processing" />
      </NimbusProvider>
    );

    expect(
      screen.getByRole("progressbar", { name: /file processing/i })
    ).toBeInTheDocument();
  });

  it("has correct aria-valuenow attribute", () => {
    render(
      <NimbusProvider>
        <ProgressBar value={60} label="Progress" />
      </NimbusProvider>
    );

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "60");
  });
});

/**
 * @docs-section value-ranges
 * @docs-title Testing Value Ranges
 * @docs-description Test different value ranges and custom min/max values
 * @docs-order 2
 */
describe("ProgressBar - Value ranges", () => {
  it("handles default range (0-100)", () => {
    render(
      <NimbusProvider>
        <ProgressBar value={50} label="Progress" />
      </NimbusProvider>
    );

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "50");
    expect(progressBar).toHaveAttribute("aria-valuemin", "0");
    expect(progressBar).toHaveAttribute("aria-valuemax", "100");
  });

  it("handles custom min and max values", () => {
    render(
      <NimbusProvider>
        <ProgressBar value={50} minValue={0} maxValue={200} label="Custom" />
      </NimbusProvider>
    );

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "50");
    expect(progressBar).toHaveAttribute("aria-valuemin", "0");
    expect(progressBar).toHaveAttribute("aria-valuemax", "200");
  });

  it("handles boundary values", () => {
    const { rerender } = render(
      <NimbusProvider>
        <ProgressBar value={0} label="Start" />
      </NimbusProvider>
    );

    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0"
    );

    rerender(
      <NimbusProvider>
        <ProgressBar value={100} label="Complete" />
      </NimbusProvider>
    );

    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100"
    );
  });
});

/**
 * @docs-section indeterminate-state
 * @docs-title Testing Indeterminate State
 * @docs-description Test indeterminate progress behavior
 * @docs-order 3
 */
describe("ProgressBar - Indeterminate state", () => {
  it("renders indeterminate progress", () => {
    render(
      <NimbusProvider>
        <ProgressBar isIndeterminate label="Loading" />
      </NimbusProvider>
    );

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
  });

  it("does not have aria-valuenow when indeterminate", () => {
    render(
      <NimbusProvider>
        <ProgressBar isIndeterminate label="Processing" />
      </NimbusProvider>
    );

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).not.toHaveAttribute("aria-valuenow");
  });
});

/**
 * @docs-section dynamic-updates
 * @docs-title Testing Dynamic Value Updates
 * @docs-description Test that the progress bar reflects value changes
 * @docs-order 4
 */
describe("ProgressBar - Dynamic updates", () => {
  it("updates aria-valuenow when value prop changes", () => {
    const { rerender } = render(
      <NimbusProvider>
        <ProgressBar value={25} label="Progress" />
      </NimbusProvider>
    );

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "25");

    rerender(
      <NimbusProvider>
        <ProgressBar value={75} label="Progress" />
      </NimbusProvider>
    );

    expect(progressBar).toHaveAttribute("aria-valuenow", "75");
  });

  it("handles incremental updates", () => {
    const { rerender } = render(
      <NimbusProvider>
        <ProgressBar value={0} label="Upload" />
      </NimbusProvider>
    );

    let progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "0");

    // Simulate incremental progress updates
    [25, 50, 75, 100].forEach((value) => {
      rerender(
        <NimbusProvider>
          <ProgressBar value={value} label="Upload" />
        </NimbusProvider>
      );

      progressBar = screen.getByRole("progressbar");
      expect(progressBar).toHaveAttribute("aria-valuenow", String(value));
    });
  });
});

/**
 * @docs-section layout-variants
 * @docs-title Testing Layout Variants
 * @docs-description Test different layout configurations
 * @docs-order 5
 */
describe("ProgressBar - Layout variants", () => {
  it("renders stacked layout (default)", () => {
    render(
      <NimbusProvider>
        <ProgressBar value={50} layout="stacked" label="Stacked" />
      </NimbusProvider>
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders inline layout", () => {
    render(
      <NimbusProvider>
        <ProgressBar value={50} layout="inline" label="Inline" />
      </NimbusProvider>
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders minimal layout with aria-label", () => {
    render(
      <NimbusProvider>
        <ProgressBar
          value={50}
          layout="minimal"
          aria-label="Minimal progress"
        />
      </NimbusProvider>
    );

    expect(
      screen.getByRole("progressbar", { name: /minimal progress/i })
    ).toBeInTheDocument();
  });
});

/**
 * @docs-section format-options
 * @docs-title Testing Custom Format Options
 * @docs-description Test custom number formatting
 * @docs-order 6
 */
describe("ProgressBar - Format options", () => {
  it("renders with percentage format", () => {
    render(
      <NimbusProvider>
        <ProgressBar
          value={75}
          label="Percentage"
          formatOptions={{ style: "percent" }}
        />
      </NimbusProvider>
    );

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "75");
  });

  it("renders with currency format", () => {
    render(
      <NimbusProvider>
        <ProgressBar
          value={1500}
          maxValue={2000}
          label="Budget"
          formatOptions={{ style: "currency", currency: "USD" }}
        />
      </NimbusProvider>
    );

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "1500");
    expect(progressBar).toHaveAttribute("aria-valuemax", "2000");
  });

  it("renders with unit format", () => {
    render(
      <NimbusProvider>
        <ProgressBar
          value={42}
          maxValue={100}
          label="Storage"
          formatOptions={{ style: "unit", unit: "gigabyte" }}
        />
      </NimbusProvider>
    );

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "42");
  });
});
