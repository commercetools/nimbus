import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Meter, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Find the meter by its role and accessible name, and read its value attributes
 * @docs-order 1
 */
describe("Meter - Basic rendering", () => {
  it("renders a meter with an accessible name from the label prop", () => {
    render(
      <NimbusProvider>
        <Meter value={42} label="Storage used" />
      </NimbusProvider>
    );

    const meter = screen.getByRole("meter", { name: /storage used/i });
    expect(meter).toBeInTheDocument();
  });

  it("renders with an accessible name from aria-label when the visible label is hidden", () => {
    render(
      <NimbusProvider>
        <Meter value={42} layout="minimal" aria-label="Storage used" />
      </NimbusProvider>
    );

    expect(
      screen.getByRole("meter", { name: /storage used/i })
    ).toBeInTheDocument();
  });

  it("has the correct aria-valuenow, aria-valuemin, and aria-valuemax attributes", () => {
    render(
      <NimbusProvider>
        <Meter value={42} label="Quota" />
      </NimbusProvider>
    );

    const meter = screen.getByRole("meter");
    expect(meter).toHaveAttribute("aria-valuenow", "42");
    expect(meter).toHaveAttribute("aria-valuemin", "0");
    expect(meter).toHaveAttribute("aria-valuemax", "100");
  });
});

/**
 * @docs-section segments
 * @docs-title Testing a Segmented Meter
 * @docs-description Read the summed value and the announced summary of a meter that shows several segments of one total
 * @docs-order 2
 */
describe("Meter - Segments", () => {
  const storageSegments = [
    { id: "images", label: "Images", value: 30 },
    { id: "videos", label: "Videos", value: 20 },
  ];

  it("sums the segment values into aria-valuenow", () => {
    render(
      <NimbusProvider>
        <Meter
          label="Storage"
          formatOptions={{ style: "unit", unit: "gigabyte" }}
          segments={storageSegments}
        />
      </NimbusProvider>
    );

    expect(screen.getByRole("meter")).toHaveAttribute("aria-valuenow", "50");
  });

  it("announces a summary of every segment through aria-valuetext", () => {
    render(
      <NimbusProvider>
        <Meter
          label="Storage"
          formatOptions={{ style: "unit", unit: "gigabyte" }}
          segments={storageSegments}
        />
      </NimbusProvider>
    );

    expect(screen.getByRole("meter")).toHaveAttribute(
      "aria-valuetext",
      "50 GB (Images: 30 GB, Videos: 20 GB)"
    );
  });

  it("shows the formatted total as the visible value text", () => {
    render(
      <NimbusProvider>
        <Meter
          label="Storage"
          formatOptions={{ style: "unit", unit: "gigabyte" }}
          segments={storageSegments}
        />
      </NimbusProvider>
    );

    expect(screen.getByText("50 GB")).toBeVisible();
  });
});

/**
 * @docs-section format-options
 * @docs-title Testing Custom Value Formatting
 * @docs-description Test the default percent format, a custom unit format, and a fully custom valueLabel
 * @docs-order 3
 */
describe("Meter - Format options", () => {
  it("formats the value as a percent by default", () => {
    render(
      <NimbusProvider>
        <Meter value={72} label="Quota" />
      </NimbusProvider>
    );

    expect(screen.getByText("72%")).toBeVisible();
    expect(screen.getByRole("meter")).toHaveAttribute("aria-valuetext", "72%");
  });

  it("formats the value with a custom unit", () => {
    render(
      <NimbusProvider>
        <Meter
          value={50}
          label="Storage"
          formatOptions={{ style: "unit", unit: "gigabyte" }}
        />
      </NimbusProvider>
    );

    expect(screen.getByText("50 GB")).toBeVisible();
  });

  it("replaces the value text with a custom valueLabel", () => {
    render(
      <NimbusProvider>
        <Meter value={50} label="Storage" valueLabel="50 of 100 GB" />
      </NimbusProvider>
    );

    expect(screen.getByText("50 of 100 GB")).toBeVisible();
    expect(screen.getByRole("meter")).toHaveAttribute(
      "aria-valuetext",
      "50 of 100 GB"
    );
  });
});
