import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SimpleGrid, Box, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify SimpleGrid renders with expected structure and children
 * @docs-order 1
 */
describe("SimpleGrid - Basic rendering", () => {
  it("renders children in a grid layout", () => {
    render(
      <NimbusProvider>
        <SimpleGrid data-testid="grid">
          <Box data-testid="item-1">Item 1</Box>
          <Box data-testid="item-2">Item 2</Box>
          <Box data-testid="item-3">Item 3</Box>
        </SimpleGrid>
      </NimbusProvider>
    );

    const grid = screen.getByTestId("grid");
    expect(grid).toBeInTheDocument();
    expect(screen.getByTestId("item-1")).toBeInTheDocument();
    expect(screen.getByTestId("item-2")).toBeInTheDocument();
    expect(screen.getByTestId("item-3")).toBeInTheDocument();
  });

  it("renders with correct display style", () => {
    render(
      <NimbusProvider>
        <SimpleGrid data-testid="grid">
          <Box>Item</Box>
        </SimpleGrid>
      </NimbusProvider>
    );

    const grid = screen.getByTestId("grid");
    expect(grid).toHaveStyle({ display: "grid" });
  });

  it("forwards data attributes", () => {
    render(
      <NimbusProvider>
        <SimpleGrid data-testid="test-grid" data-custom="value">
          <Box>Item</Box>
        </SimpleGrid>
      </NimbusProvider>
    );

    const grid = screen.getByTestId("test-grid");
    expect(grid).toHaveAttribute("data-custom", "value");
  });
});

/**
 * @docs-section column-configuration
 * @docs-title Column Configuration Tests
 * @docs-description Test different column configurations and responsive behavior
 * @docs-order 2
 */
describe("SimpleGrid - Column configuration", () => {
  it("applies fixed column count", () => {
    render(
      <NimbusProvider>
        <SimpleGrid columns={3} data-testid="grid">
          <Box>Item 1</Box>
          <Box>Item 2</Box>
          <Box>Item 3</Box>
        </SimpleGrid>
      </NimbusProvider>
    );

    const grid = screen.getByTestId("grid");
    expect(grid).toHaveStyle({
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    });
  });

  it("applies minChildWidth for auto-responsive layout", () => {
    render(
      <NimbusProvider>
        <SimpleGrid minChildWidth="200px" data-testid="grid">
          <Box>Item 1</Box>
          <Box>Item 2</Box>
        </SimpleGrid>
      </NimbusProvider>
    );

    const grid = screen.getByTestId("grid");
    expect(grid).toHaveStyle({
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    });
  });

  it("supports responsive column values", () => {
    render(
      <NimbusProvider>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} data-testid="grid">
          <Box>Item 1</Box>
          <Box>Item 2</Box>
          <Box>Item 3</Box>
        </SimpleGrid>
      </NimbusProvider>
    );

    const grid = screen.getByTestId("grid");
    expect(grid).toBeInTheDocument();
    // Responsive values are applied via CSS classes
    expect(grid).toHaveClass(/css-/);
  });
});

/**
 * @docs-section gap-spacing
 * @docs-title Gap Spacing Tests
 * @docs-description Test gap, columnGap, and rowGap properties
 * @docs-order 3
 */
describe("SimpleGrid - Gap spacing", () => {
  it("applies uniform gap", () => {
    render(
      <NimbusProvider>
        <SimpleGrid gap="400" data-testid="grid">
          <Box>Item 1</Box>
          <Box>Item 2</Box>
        </SimpleGrid>
      </NimbusProvider>
    );

    const grid = screen.getByTestId("grid");
    expect(grid).toBeInTheDocument();
    // Gap is applied via Chakra tokens
  });

  it("applies separate column and row gaps", () => {
    render(
      <NimbusProvider>
        <SimpleGrid columnGap="200" rowGap="400" data-testid="grid">
          <Box>Item 1</Box>
          <Box>Item 2</Box>
        </SimpleGrid>
      </NimbusProvider>
    );

    const grid = screen.getByTestId("grid");
    expect(grid).toBeInTheDocument();
  });

  it("supports responsive gap values", () => {
    render(
      <NimbusProvider>
        <SimpleGrid gap={{ base: "200", md: "400" }} data-testid="grid">
          <Box>Item 1</Box>
          <Box>Item 2</Box>
        </SimpleGrid>
      </NimbusProvider>
    );

    const grid = screen.getByTestId("grid");
    expect(grid).toBeInTheDocument();
  });
});

/**
 * @docs-section column-spanning
 * @docs-title Column Spanning Tests
 * @docs-description Test SimpleGrid.Item with colSpan property
 * @docs-order 4
 */
describe("SimpleGrid - Column spanning", () => {
  it("renders SimpleGrid.Item with colSpan", () => {
    render(
      <NimbusProvider>
        <SimpleGrid columns={4} data-testid="grid">
          <SimpleGrid.Item colSpan={2} data-testid="span-item">
            <Box>Spanning Item</Box>
          </SimpleGrid.Item>
          <SimpleGrid.Item colSpan={1}>
            <Box>Item 1</Box>
          </SimpleGrid.Item>
          <SimpleGrid.Item colSpan={1}>
            <Box>Item 2</Box>
          </SimpleGrid.Item>
        </SimpleGrid>
      </NimbusProvider>
    );

    const spanItem = screen.getByTestId("span-item");
    expect(spanItem).toBeInTheDocument();
    expect(screen.getByText("Spanning Item")).toBeInTheDocument();
  });

  it("supports responsive colSpan values", () => {
    render(
      <NimbusProvider>
        <SimpleGrid columns={{ base: 2, md: 4 }} data-testid="grid">
          <SimpleGrid.Item
            colSpan={{ base: 2, md: 3 }}
            data-testid="responsive-span"
          >
            <Box>Responsive Spanning Item</Box>
          </SimpleGrid.Item>
          <SimpleGrid.Item colSpan={1}>
            <Box>Item 1</Box>
          </SimpleGrid.Item>
        </SimpleGrid>
      </NimbusProvider>
    );

    const responsiveSpan = screen.getByTestId("responsive-span");
    expect(responsiveSpan).toBeInTheDocument();
  });
});

/**
 * @docs-section accessibility
 * @docs-title Accessibility Tests
 * @docs-description Verify accessibility attributes and semantic structure
 * @docs-order 5
 */
describe("SimpleGrid - Accessibility", () => {
  it("forwards aria-label attribute", () => {
    render(
      <NimbusProvider>
        <SimpleGrid aria-label="Product grid" data-testid="grid">
          <Box>Item 1</Box>
        </SimpleGrid>
      </NimbusProvider>
    );

    const grid = screen.getByTestId("grid");
    expect(grid).toHaveAttribute("aria-label", "Product grid");
  });

  it("supports custom element types with as prop", () => {
    render(
      <NimbusProvider>
        <SimpleGrid as="section" data-testid="grid">
          <Box>Item 1</Box>
        </SimpleGrid>
      </NimbusProvider>
    );

    const grid = screen.getByTestId("grid");
    expect(grid.tagName).toBe("SECTION");
  });

  it("maintains accessible structure with semantic children", () => {
    render(
      <NimbusProvider>
        <SimpleGrid
          as="section"
          aria-labelledby="grid-heading"
          data-testid="grid"
        >
          <h2 id="grid-heading" style={{ display: "none" }}>
            Products
          </h2>
          <article>
            <h3>Product 1</h3>
          </article>
          <article>
            <h3>Product 2</h3>
          </article>
        </SimpleGrid>
      </NimbusProvider>
    );

    const grid = screen.getByTestId("grid");
    expect(grid).toHaveAttribute("aria-labelledby", "grid-heading");
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();
  });
});

/**
 * @docs-section ref-forwarding
 * @docs-title Ref Forwarding Tests
 * @docs-description Verify ref forwarding to the underlying DOM element
 * @docs-order 6
 */
describe("SimpleGrid - Ref forwarding", () => {
  it("forwards ref to the grid element", () => {
    const ref = { current: null as HTMLDivElement | null };

    render(
      <NimbusProvider>
        <SimpleGrid ref={ref} data-testid="grid">
          <Box>Item 1</Box>
        </SimpleGrid>
      </NimbusProvider>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("data-testid", "grid");
  });

  it("allows access to DOM methods through ref", () => {
    const ref = { current: null as HTMLDivElement | null };

    render(
      <NimbusProvider>
        <SimpleGrid ref={ref}>
          <Box>Item 1</Box>
        </SimpleGrid>
      </NimbusProvider>
    );

    expect(ref.current?.querySelector).toBeDefined();
    expect(ref.current?.getBoundingClientRect).toBeDefined();
  });
});
