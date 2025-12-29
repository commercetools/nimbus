import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Spacer, Stack, Button, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the component renders and applies flexGrow
 * @docs-order 1
 */
describe("Spacer - Basic rendering", () => {
  it("renders spacer element", () => {
    render(
      <NimbusProvider>
        <Stack direction="row">
          <Button>Left</Button>
          <Spacer data-testid="spacer" />
          <Button>Right</Button>
        </Stack>
      </NimbusProvider>
    );

    const spacer = screen.getByTestId("spacer");
    expect(spacer).toBeInTheDocument();
  });

  it("applies flexGrow style", () => {
    render(
      <NimbusProvider>
        <Spacer data-testid="spacer" />
      </NimbusProvider>
    );

    const spacer = screen.getByTestId("spacer");
    expect(spacer).toHaveStyle({ flexGrow: "1" });
  });

  it("renders as a div element", () => {
    render(
      <NimbusProvider>
        <Spacer data-testid="spacer" />
      </NimbusProvider>
    );

    const spacer = screen.getByTestId("spacer");
    expect(spacer.tagName).toBe("DIV");
  });
});

/**
 * @docs-section layout-behavior
 * @docs-title Layout Behavior Tests
 * @docs-description Test spacer behavior in flex layouts
 * @docs-order 2
 */
describe("Spacer - Layout behavior", () => {
  it("works in horizontal flex layout", () => {
    render(
      <NimbusProvider>
        <Stack direction="row" data-testid="container">
          <Button>Left</Button>
          <Spacer data-testid="spacer" />
          <Button>Right</Button>
        </Stack>
      </NimbusProvider>
    );

    const container = screen.getByTestId("container");
    const spacer = screen.getByTestId("spacer");

    expect(container).toBeInTheDocument();
    expect(spacer).toBeInTheDocument();
    expect(spacer).toHaveStyle({ flexGrow: "1" });
  });

  it("works in vertical flex layout", () => {
    render(
      <NimbusProvider>
        <Stack direction="column" data-testid="container" height="400px">
          <Button>Top</Button>
          <Spacer data-testid="spacer" />
          <Button>Bottom</Button>
        </Stack>
      </NimbusProvider>
    );

    const container = screen.getByTestId("container");
    const spacer = screen.getByTestId("spacer");

    expect(container).toBeInTheDocument();
    expect(spacer).toBeInTheDocument();
    expect(spacer).toHaveStyle({ flexGrow: "1" });
  });

  it("supports multiple spacers in same container", () => {
    render(
      <NimbusProvider>
        <Stack direction="row">
          <Button>First</Button>
          <Spacer data-testid="spacer-1" />
          <Button>Second</Button>
          <Spacer data-testid="spacer-2" />
          <Button>Third</Button>
        </Stack>
      </NimbusProvider>
    );

    const spacer1 = screen.getByTestId("spacer-1");
    const spacer2 = screen.getByTestId("spacer-2");

    expect(spacer1).toBeInTheDocument();
    expect(spacer2).toBeInTheDocument();
    expect(spacer1).toHaveStyle({ flexGrow: "1" });
    expect(spacer2).toHaveStyle({ flexGrow: "1" });
  });
});

/**
 * @docs-section custom-styling
 * @docs-title Custom Styling Tests
 * @docs-description Test that Spacer accepts Box props for styling
 * @docs-order 3
 */
describe("Spacer - Custom styling", () => {
  it("accepts backgroundColor prop", () => {
    render(
      <NimbusProvider>
        <Spacer data-testid="spacer" backgroundColor="primary.3" />
      </NimbusProvider>
    );

    const spacer = screen.getByTestId("spacer");
    expect(spacer).toBeInTheDocument();
    // Note: backgroundColor is applied via Chakra's system, actual color computation happens at runtime
  });

  it("accepts borderRadius prop", () => {
    render(
      <NimbusProvider>
        <Spacer data-testid="spacer" borderRadius="200" />
      </NimbusProvider>
    );

    const spacer = screen.getByTestId("spacer");
    expect(spacer).toBeInTheDocument();
  });

  it("accepts border props", () => {
    render(
      <NimbusProvider>
        <Spacer
          data-testid="spacer"
          borderTop="2px dashed"
          borderColor="neutral.6"
        />
      </NimbusProvider>
    );

    const spacer = screen.getByTestId("spacer");
    expect(spacer).toBeInTheDocument();
  });

  it("accepts height prop for vertical spacing", () => {
    render(
      <NimbusProvider>
        <Spacer data-testid="spacer" height="50px" />
      </NimbusProvider>
    );

    const spacer = screen.getByTestId("spacer");
    expect(spacer).toHaveStyle({ height: "50px" });
  });
});

/**
 * @docs-section props-forwarding
 * @docs-title Props Forwarding Tests
 * @docs-description Test that standard HTML attributes are forwarded
 * @docs-order 4
 */
describe("Spacer - Props forwarding", () => {
  it("forwards data attributes", () => {
    render(
      <NimbusProvider>
        <Spacer data-testid="spacer" data-custom="custom-value" />
      </NimbusProvider>
    );

    const spacer = screen.getByTestId("spacer");
    expect(spacer).toHaveAttribute("data-custom", "custom-value");
  });

  it("forwards className prop", () => {
    render(
      <NimbusProvider>
        <Spacer data-testid="spacer" className="custom-class" />
      </NimbusProvider>
    );

    const spacer = screen.getByTestId("spacer");
    expect(spacer).toHaveClass("custom-class");
  });

  it("forwards id prop", () => {
    render(
      <NimbusProvider>
        <Spacer id="custom-id" />
      </NimbusProvider>
    );

    const spacer = document.getElementById("custom-id");
    expect(spacer).toBeInTheDocument();
  });

  it("forwards aria attributes", () => {
    render(
      <NimbusProvider>
        <Spacer data-testid="spacer" aria-label="spacer element" />
      </NimbusProvider>
    );

    const spacer = screen.getByTestId("spacer");
    expect(spacer).toHaveAttribute("aria-label", "spacer element");
  });
});

/**
 * @docs-section ref-forwarding
 * @docs-title Ref Forwarding Tests
 * @docs-description Test that refs are properly forwarded
 * @docs-order 5
 */
describe("Spacer - Ref forwarding", () => {
  it("forwards ref to underlying element", () => {
    const ref = { current: null as HTMLDivElement | null };

    render(
      <NimbusProvider>
        <Spacer ref={ref} />
      </NimbusProvider>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("allows ref access to DOM methods", () => {
    const ref = { current: null as HTMLDivElement | null };

    render(
      <NimbusProvider>
        <Spacer ref={ref} data-testid="spacer" />
      </NimbusProvider>
    );

    expect(ref.current?.getAttribute("data-testid")).toBe("spacer");
  });
});
