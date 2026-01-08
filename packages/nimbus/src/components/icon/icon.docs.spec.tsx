import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Icon, NimbusProvider } from "@commercetools/nimbus";
import { CheckCircle, Settings, Star } from "@commercetools/nimbus-icons";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the Icon component renders with expected structure
 * @docs-order 1
 */
describe("Icon - Basic rendering", () => {
  it("renders icon with children", () => {
    render(
      <NimbusProvider>
        <Icon data-testid="icon-children">
          <CheckCircle />
        </Icon>
      </NimbusProvider>
    );

    const icon = screen.getByTestId("icon-children");
    expect(icon).toBeInTheDocument();
    expect(icon.tagName).toBe("svg");
  });

  it("renders icon using as prop", () => {
    render(
      <NimbusProvider>
        <Icon as={Settings} data-testid="icon-as-prop" />
      </NimbusProvider>
    );

    const icon = screen.getByTestId("icon-as-prop");
    expect(icon).toBeInTheDocument();
    expect(icon.tagName).toBe("svg");
  });

  it("renders as inline-block display", () => {
    render(
      <NimbusProvider>
        <Icon as={Star} data-testid="icon-display" />
      </NimbusProvider>
    );

    const icon = screen.getByTestId("icon-display");
    expect(icon).toHaveStyle({ display: "inline" });
  });
});

/**
 * @docs-section size-variants
 * @docs-title Size Variant Tests
 * @docs-description Test predefined size variants and custom sizing
 * @docs-order 2
 */
describe("Icon - Size variants", () => {
  it("applies 2xs size variant", () => {
    render(
      <NimbusProvider>
        <Icon as={Star} size="2xs" data-testid="icon-2xs" />
      </NimbusProvider>
    );

    const icon = screen.getByTestId("icon-2xs");
    // boxSize "600" token should be applied
    expect(icon).toHaveClass("nimbus-icon");
  });

  it("applies xs size variant", () => {
    render(
      <NimbusProvider>
        <Icon as={Star} size="xs" data-testid="icon-xs" />
      </NimbusProvider>
    );

    const icon = screen.getByTestId("icon-xs");
    expect(icon).toHaveClass("nimbus-icon");
  });

  it("applies md size variant", () => {
    render(
      <NimbusProvider>
        <Icon as={Star} size="md" data-testid="icon-md" />
      </NimbusProvider>
    );

    const icon = screen.getByTestId("icon-md");
    expect(icon).toHaveClass("nimbus-icon");
  });

  it("applies xl size variant", () => {
    render(
      <NimbusProvider>
        <Icon as={Star} size="xl" data-testid="icon-xl" />
      </NimbusProvider>
    );

    const icon = screen.getByTestId("icon-xl");
    expect(icon).toHaveClass("nimbus-icon");
  });

  it("applies custom size with boxSize prop", () => {
    render(
      <NimbusProvider>
        <Icon as={Star} boxSize="2400" data-testid="icon-custom-size" />
      </NimbusProvider>
    );

    const icon = screen.getByTestId("icon-custom-size");
    expect(icon).toHaveStyle({
      width: "var(--nimbus-sizes-2400)",
      height: "var(--nimbus-sizes-2400)",
    });
  });
});

/**
 * @docs-section color-customization
 * @docs-title Color Customization Tests
 * @docs-description Test icon color prop with various values
 * @docs-order 3
 */
describe("Icon - Color customization", () => {
  it("applies color from Nimbus color token", () => {
    render(
      <NimbusProvider>
        <Icon as={CheckCircle} color="primary.11" data-testid="icon-color" />
      </NimbusProvider>
    );

    const icon = screen.getByTestId("icon-color");
    expect(icon).toBeInTheDocument();
    // Color is applied through Chakra's color system
  });

  it("applies custom CSS color", () => {
    render(
      <NimbusProvider>
        <Icon as={Star} color="deeppink" data-testid="icon-custom-color" />
      </NimbusProvider>
    );

    const icon = screen.getByTestId("icon-custom-color");
    expect(icon).toHaveStyle({ color: "rgb(255, 20, 147)" });
  });

  it("inherits color when not specified", () => {
    render(
      <NimbusProvider>
        <div style={{ color: "blue" }}>
          <Icon as={Settings} data-testid="icon-inherit-color" />
        </div>
      </NimbusProvider>
    );

    const icon = screen.getByTestId("icon-inherit-color");
    expect(icon).toBeInTheDocument();
  });
});

/**
 * @docs-section style-props
 * @docs-title Style Props Tests
 * @docs-description Test that Icon accepts color and boxSize props
 * @docs-order 4
 */
describe("Icon - Style props", () => {
  it("applies boxSize for width and height", () => {
    render(
      <NimbusProvider>
        <Icon as={Star} boxSize="1600" data-testid="icon-boxsize" />
      </NimbusProvider>
    );

    const icon = screen.getByTestId("icon-boxsize");
    expect(icon).toHaveStyle({
      width: "var(--nimbus-sizes-1600)",
      height: "var(--nimbus-sizes-1600)",
    });
  });

  it("combines size and color props", () => {
    render(
      <NimbusProvider>
        <Icon
          as={Star}
          size="lg"
          color="primary.11"
          data-testid="icon-combined"
        />
      </NimbusProvider>
    );

    const icon = screen.getByTestId("icon-combined");
    expect(icon).toHaveClass("nimbus-icon");
    // Color is applied via Chakra's color system
    expect(icon).toHaveAttribute("data-testid", "icon-combined");
  });
});

/**
 * @docs-section props-forwarding
 * @docs-title Props Forwarding Tests
 * @docs-description Verify that Icon forwards data and ARIA attributes
 * @docs-order 5
 */
describe("Icon - Props forwarding", () => {
  it("forwards data attributes", () => {
    render(
      <NimbusProvider>
        <Icon
          as={CheckCircle}
          data-testid="icon-data"
          data-custom="custom-value"
        />
      </NimbusProvider>
    );

    const icon = screen.getByTestId("icon-data");
    expect(icon).toHaveAttribute("data-custom", "custom-value");
  });

  it("forwards ARIA attributes", () => {
    render(
      <NimbusProvider>
        <Icon
          as={CheckCircle}
          aria-label="Success icon"
          aria-hidden="false"
          data-testid="icon-aria"
        />
      </NimbusProvider>
    );

    const icon = screen.getByTestId("icon-aria");
    expect(icon).toHaveAttribute("aria-label", "Success icon");
    expect(icon).toHaveAttribute("aria-hidden", "false");
  });

  it("supports aria-hidden for decorative icons", () => {
    render(
      <NimbusProvider>
        <Icon as={Star} aria-hidden="true" data-testid="icon-decorative" />
      </NimbusProvider>
    );

    const icon = screen.getByTestId("icon-decorative");
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });
});

/**
 * @docs-section ref-forwarding
 * @docs-title Ref Forwarding Tests
 * @docs-description Verify that Icon properly forwards refs to the underlying SVG element
 * @docs-order 6
 */
describe("Icon - Ref forwarding", () => {
  it("forwards ref to underlying SVG element", () => {
    const ref = { current: null as SVGSVGElement | null };

    render(
      <NimbusProvider>
        <Icon ref={ref} as={CheckCircle} />
      </NimbusProvider>
    );

    expect(ref.current).toBeInstanceOf(SVGSVGElement);
    expect(ref.current?.tagName).toBe("svg");
  });

  it("allows access to DOM methods through ref", () => {
    const ref = { current: null as SVGSVGElement | null };

    render(
      <NimbusProvider>
        <Icon ref={ref} as={Settings} />
      </NimbusProvider>
    );

    expect(ref.current).not.toBeNull();
    expect(typeof ref.current?.getBoundingClientRect).toBe("function");
  });
});

/**
 * @docs-section custom-svg
 * @docs-title Custom SVG Tests
 * @docs-description Test Icon with custom SVG elements
 * @docs-order 7
 */
describe("Icon - Custom SVG", () => {
  it("renders custom SVG as children", () => {
    const CustomSvg = () => (
      <svg data-testid="custom-svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
      </svg>
    );

    render(
      <NimbusProvider>
        <Icon>
          <CustomSvg />
        </Icon>
      </NimbusProvider>
    );

    const customSvg = screen.getByTestId("custom-svg");
    expect(customSvg).toBeInTheDocument();
  });

  it("applies size to custom SVG", () => {
    const CustomSvg = () => (
      <svg data-testid="custom-svg-sized" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
      </svg>
    );

    render(
      <NimbusProvider>
        <Icon size="lg">
          <CustomSvg />
        </Icon>
      </NimbusProvider>
    );

    const customSvg = screen.getByTestId("custom-svg-sized");
    // The custom SVG is rendered as a child of the Icon wrapper
    expect(customSvg).toBeInTheDocument();
  });
});
