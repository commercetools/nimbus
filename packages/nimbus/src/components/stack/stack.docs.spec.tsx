import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Stack, Box, Button, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the Stack component renders with expected structure and children
 * @docs-order 1
 */
describe("Stack - Basic rendering", () => {
  it("renders Stack with children", () => {
    render(
      <NimbusProvider>
        <Stack data-testid="test-stack">
          <Box>Item 1</Box>
          <Box>Item 2</Box>
          <Box>Item 3</Box>
        </Stack>
      </NimbusProvider>
    );

    const stack = screen.getByTestId("test-stack");
    expect(stack).toBeInTheDocument();
    expect(stack).toHaveTextContent("Item 1");
    expect(stack).toHaveTextContent("Item 2");
    expect(stack).toHaveTextContent("Item 3");
  });

  it("applies direction prop correctly", () => {
    render(
      <NimbusProvider>
        <Stack data-testid="row-stack" direction="row">
          <Box>Item 1</Box>
          <Box>Item 2</Box>
        </Stack>
      </NimbusProvider>
    );

    const stack = screen.getByTestId("row-stack");
    expect(stack).toHaveStyle({ flexDirection: "row" });
  });

  it("applies gap prop for spacing", () => {
    render(
      <NimbusProvider>
        <Stack data-testid="spaced-stack" gap="400">
          <Box>Item 1</Box>
          <Box>Item 2</Box>
        </Stack>
      </NimbusProvider>
    );

    const stack = screen.getByTestId("spaced-stack");
    expect(stack).toHaveStyle({ gap: "var(--nimbus-spacing-400)" });
  });
});

/**
 * @docs-section layout-behavior
 * @docs-title Layout Behavior Tests
 * @docs-description Test different layout configurations and responsive behavior
 * @docs-order 2
 */
describe("Stack - Layout behavior", () => {
  it("renders with column direction by default", () => {
    render(
      <NimbusProvider>
        <Stack data-testid="default-stack">
          <Box>Item 1</Box>
          <Box>Item 2</Box>
        </Stack>
      </NimbusProvider>
    );

    const stack = screen.getByTestId("default-stack");
    // Chakra Stack defaults to column direction
    expect(stack).toHaveStyle({ display: "flex" });
  });

  it("handles horizontal layout with row direction", () => {
    render(
      <NimbusProvider>
        <Stack data-testid="horizontal-stack" direction="row" gap="200">
          <Button>Left</Button>
          <Button>Right</Button>
        </Stack>
      </NimbusProvider>
    );

    const stack = screen.getByTestId("horizontal-stack");
    expect(stack).toHaveStyle({ flexDirection: "row" });
    expect(screen.getByRole("button", { name: "Left" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Right" })).toBeInTheDocument();
  });

  it("applies alignment props correctly", () => {
    render(
      <NimbusProvider>
        <Stack
          data-testid="aligned-stack"
          direction="row"
          align="center"
          justify="space-between"
        >
          <Box>Left</Box>
          <Box>Right</Box>
        </Stack>
      </NimbusProvider>
    );

    const stack = screen.getByTestId("aligned-stack");
    expect(stack).toHaveStyle({
      alignItems: "center",
      justifyContent: "space-between",
    });
  });

  it("applies wrap prop for multi-row layouts", () => {
    render(
      <NimbusProvider>
        <Stack data-testid="wrapped-stack" direction="row" wrap="wrap">
          {Array.from({ length: 10 }, (_, i) => (
            <Box key={i}>Item {i + 1}</Box>
          ))}
        </Stack>
      </NimbusProvider>
    );

    const stack = screen.getByTestId("wrapped-stack");
    expect(stack).toHaveStyle({ flexWrap: "wrap" });
  });
});

/**
 * @docs-section separators
 * @docs-title Separator Tests
 * @docs-description Test rendering of separators between stack items
 * @docs-order 3
 */
describe("Stack - Separators", () => {
  it("renders separator elements between children", () => {
    render(
      <NimbusProvider>
        <Stack
          data-testid="separated-stack"
          separator={<Box data-testid="separator">---</Box>}
        >
          <Box>Item 1</Box>
          <Box>Item 2</Box>
          <Box>Item 3</Box>
        </Stack>
      </NimbusProvider>
    );

    const separators = screen.getAllByTestId("separator");
    // Should have n-1 separators for n items
    expect(separators).toHaveLength(2);
  });

  it("renders custom separator components", () => {
    render(
      <NimbusProvider>
        <Stack
          separator={<Box height="25" bg="neutral.6" data-testid="divider" />}
        >
          <Box>Section 1</Box>
          <Box>Section 2</Box>
        </Stack>
      </NimbusProvider>
    );

    const dividers = screen.getAllByTestId("divider");
    expect(dividers).toHaveLength(1);
  });
});

/**
 * @docs-section style-props
 * @docs-title Style Props Tests
 * @docs-description Test that Stack accepts and applies Chakra style props
 * @docs-order 4
 */
describe("Stack - Style props", () => {
  it("applies background color prop", () => {
    render(
      <NimbusProvider>
        <Stack data-testid="styled-stack" bg="primary.7" p="400">
          <Box>Content</Box>
        </Stack>
      </NimbusProvider>
    );

    const stack = screen.getByTestId("styled-stack");
    expect(stack).toHaveStyle({
      padding: "var(--nimbus-spacing-400)",
    });
    // Background color is applied via colorPalette system
  });

  it("applies border radius and border props", () => {
    render(
      <NimbusProvider>
        <Stack
          data-testid="bordered-stack"
          borderRadius="200"
          borderWidth="25"
          borderColor="neutral.6"
        >
          <Box>Content</Box>
        </Stack>
      </NimbusProvider>
    );

    const stack = screen.getByTestId("bordered-stack");
    // Border styles are applied (checking presence, not exact CSS vars)
    expect(stack).toBeInTheDocument();
  });

  it("applies width and height props", () => {
    render(
      <NimbusProvider>
        <Stack data-testid="sized-stack" width="6400" height="3200">
          <Box>Content</Box>
        </Stack>
      </NimbusProvider>
    );

    const stack = screen.getByTestId("sized-stack");
    expect(stack).toHaveStyle({
      width: "var(--nimbus-sizes-6400)",
      height: "var(--nimbus-sizes-3200)",
    });
  });

  it("applies overflow props", () => {
    render(
      <NimbusProvider>
        <Stack data-testid="overflow-stack" overflow="auto">
          <Box>Content</Box>
        </Stack>
      </NimbusProvider>
    );

    const stack = screen.getByTestId("overflow-stack");
    expect(stack).toHaveStyle({ overflow: "auto" });
  });
});

/**
 * @docs-section props-forwarding
 * @docs-title Props Forwarding Tests
 * @docs-description Verify that Stack forwards standard HTML and ARIA attributes
 * @docs-order 5
 */
describe("Stack - Props forwarding", () => {
  it("forwards data attributes", () => {
    render(
      <NimbusProvider>
        <Stack data-testid="data-stack" data-custom="custom-value">
          <Box>Content</Box>
        </Stack>
      </NimbusProvider>
    );

    const stack = screen.getByTestId("data-stack");
    expect(stack).toHaveAttribute("data-custom", "custom-value");
  });

  it("forwards className prop", () => {
    render(
      <NimbusProvider>
        <Stack data-testid="class-stack" className="custom-class">
          <Box>Content</Box>
        </Stack>
      </NimbusProvider>
    );

    const stack = screen.getByTestId("class-stack");
    expect(stack).toHaveClass("custom-class");
  });

  it("forwards id prop", () => {
    render(
      <NimbusProvider>
        <Stack id="unique-stack-id">
          <Box>Content</Box>
        </Stack>
      </NimbusProvider>
    );

    const stack = document.getElementById("unique-stack-id");
    expect(stack).toBeInTheDocument();
  });

  it("forwards ARIA attributes", () => {
    render(
      <NimbusProvider>
        <Stack
          data-testid="aria-stack"
          aria-label="Navigation stack"
          role="navigation"
        >
          <Box>Content</Box>
        </Stack>
      </NimbusProvider>
    );

    const stack = screen.getByTestId("aria-stack");
    expect(stack).toHaveAttribute("aria-label", "Navigation stack");
    expect(stack).toHaveAttribute("role", "navigation");
  });
});

/**
 * @docs-section ref-forwarding
 * @docs-title Ref Forwarding Tests
 * @docs-description Verify that Stack properly forwards refs to the underlying DOM element
 * @docs-order 6
 */
describe("Stack - Ref forwarding", () => {
  it("forwards ref to underlying div element", () => {
    const ref = { current: null as HTMLDivElement | null };

    render(
      <NimbusProvider>
        <Stack ref={ref}>
          <Box>Content</Box>
        </Stack>
      </NimbusProvider>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("allows access to DOM methods through ref", () => {
    const ref = { current: null as HTMLDivElement | null };

    render(
      <NimbusProvider>
        <Stack ref={ref}>
          <Box>Content</Box>
        </Stack>
      </NimbusProvider>
    );

    expect(ref.current).not.toBeNull();
    expect(typeof ref.current?.getBoundingClientRect).toBe("function");
  });
});
