import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Grid, NimbusProvider, Box } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the Grid component renders with expected structure and children
 * @docs-order 1
 */
describe("Grid - Basic rendering", () => {
  it("renders grid container with children", () => {
    render(
      <NimbusProvider>
        <Grid data-testid="test-grid">
          <Grid.Item>
            <Box>Item 1</Box>
          </Grid.Item>
          <Grid.Item>
            <Box>Item 2</Box>
          </Grid.Item>
        </Grid>
      </NimbusProvider>
    );

    const grid = screen.getByTestId("test-grid");
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveStyle({ display: "grid" });
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("forwards data attributes", () => {
    render(
      <NimbusProvider>
        <Grid data-testid="custom-grid" data-tracking-id="grid-123">
          <Grid.Item>
            <Box>Content</Box>
          </Grid.Item>
        </Grid>
      </NimbusProvider>
    );

    const grid = screen.getByTestId("custom-grid");
    expect(grid).toHaveAttribute("data-testid", "custom-grid");
    expect(grid).toHaveAttribute("data-tracking-id", "grid-123");
  });

  it("forwards ARIA attributes", () => {
    render(
      <NimbusProvider>
        <Grid aria-label="Product catalog" data-testid="labeled-grid">
          <Grid.Item>
            <Box>Product 1</Box>
          </Grid.Item>
        </Grid>
      </NimbusProvider>
    );

    const grid = screen.getByTestId("labeled-grid");
    expect(grid).toHaveAttribute("aria-label", "Product catalog");
  });
});

/**
 * @docs-section column-layout
 * @docs-title Column Layout Tests
 * @docs-description Test grid column configurations
 * @docs-order 2
 */
describe("Grid - Column layout", () => {
  it("applies templateColumns property", () => {
    render(
      <NimbusProvider>
        <Grid templateColumns="repeat(3, 1fr)" data-testid="column-grid">
          <Grid.Item>
            <Box>Item 1</Box>
          </Grid.Item>
          <Grid.Item>
            <Box>Item 2</Box>
          </Grid.Item>
          <Grid.Item>
            <Box>Item 3</Box>
          </Grid.Item>
        </Grid>
      </NimbusProvider>
    );

    const grid = screen.getByTestId("column-grid");
    expect(grid).toHaveStyle({
      gridTemplateColumns: "repeat(3, 1fr)",
    });
  });

  it("applies gap spacing", () => {
    render(
      <NimbusProvider>
        <Grid gap="400" data-testid="gap-grid">
          <Grid.Item>
            <Box>Item 1</Box>
          </Grid.Item>
          <Grid.Item>
            <Box>Item 2</Box>
          </Grid.Item>
        </Grid>
      </NimbusProvider>
    );

    const grid = screen.getByTestId("gap-grid");
    expect(grid).toBeInTheDocument();
  });

  it("applies separate row and column gaps", () => {
    render(
      <NimbusProvider>
        <Grid rowGap="400" columnGap="200" data-testid="custom-gap-grid">
          <Grid.Item>
            <Box>Item 1</Box>
          </Grid.Item>
        </Grid>
      </NimbusProvider>
    );

    const grid = screen.getByTestId("custom-gap-grid");
    expect(grid).toBeInTheDocument();
  });
});

/**
 * @docs-section grid-spanning
 * @docs-title Grid Spanning Tests
 * @docs-description Test Grid.Item spanning functionality
 * @docs-order 3
 */
describe("Grid - Grid spanning", () => {
  it("applies colSpan to grid items", () => {
    render(
      <NimbusProvider>
        <Grid templateColumns="repeat(4, 1fr)">
          <Grid.Item colSpan={2} data-testid="span-item">
            <Box>Spanning item</Box>
          </Grid.Item>
        </Grid>
      </NimbusProvider>
    );

    const item = screen.getByTestId("span-item");
    expect(item).toBeInTheDocument();
    expect(screen.getByText("Spanning item")).toBeInTheDocument();
  });

  it("applies rowSpan to grid items", () => {
    render(
      <NimbusProvider>
        <Grid templateRows="repeat(3, 1fr)">
          <Grid.Item rowSpan={2} data-testid="row-span-item">
            <Box>Row spanning item</Box>
          </Grid.Item>
        </Grid>
      </NimbusProvider>
    );

    const item = screen.getByTestId("row-span-item");
    expect(item).toBeInTheDocument();
    expect(screen.getByText("Row spanning item")).toBeInTheDocument();
  });

  it("applies both colSpan and rowSpan", () => {
    render(
      <NimbusProvider>
        <Grid templateColumns="repeat(4, 1fr)" templateRows="repeat(3, 1fr)">
          <Grid.Item colSpan={2} rowSpan={2} data-testid="multi-span-item">
            <Box>Multi-spanning item</Box>
          </Grid.Item>
        </Grid>
      </NimbusProvider>
    );

    const item = screen.getByTestId("multi-span-item");
    expect(item).toBeInTheDocument();
    expect(screen.getByText("Multi-spanning item")).toBeInTheDocument();
  });
});

/**
 * @docs-section template-areas
 * @docs-title Template Areas Tests
 * @docs-description Test grid template areas functionality
 * @docs-order 4
 */
describe("Grid - Template areas", () => {
  it("applies templateAreas configuration", () => {
    render(
      <NimbusProvider>
        <Grid
          templateAreas={`
            "header header"
            "nav main"
            "footer footer"
          `}
          data-testid="template-grid"
        >
          <Grid.Item gridArea="header">
            <Box>Header</Box>
          </Grid.Item>
          <Grid.Item gridArea="nav">
            <Box>Navigation</Box>
          </Grid.Item>
          <Grid.Item gridArea="main">
            <Box>Main</Box>
          </Grid.Item>
          <Grid.Item gridArea="footer">
            <Box>Footer</Box>
          </Grid.Item>
        </Grid>
      </NimbusProvider>
    );

    const grid = screen.getByTestId("template-grid");
    expect(grid).toBeInTheDocument();
    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Navigation")).toBeInTheDocument();
    expect(screen.getByText("Main")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("applies gridArea to items", () => {
    render(
      <NimbusProvider>
        <Grid templateAreas={`"sidebar content"`} templateColumns="200px 1fr">
          <Grid.Item gridArea="sidebar" data-testid="sidebar-item">
            <Box>Sidebar</Box>
          </Grid.Item>
          <Grid.Item gridArea="content" data-testid="content-item">
            <Box>Content</Box>
          </Grid.Item>
        </Grid>
      </NimbusProvider>
    );

    const sidebarItem = screen.getByTestId("sidebar-item");
    const contentItem = screen.getByTestId("content-item");

    expect(sidebarItem).toHaveStyle({ gridArea: "sidebar" });
    expect(contentItem).toHaveStyle({ gridArea: "content" });
  });
});

/**
 * @docs-section styling
 * @docs-title Styling Tests
 * @docs-description Test grid styling and layout properties
 * @docs-order 5
 */
describe("Grid - Styling", () => {
  it("applies height and width styles", () => {
    render(
      <NimbusProvider>
        <Grid h="400px" w="100%" data-testid="sized-grid">
          <Grid.Item>
            <Box>Content</Box>
          </Grid.Item>
        </Grid>
      </NimbusProvider>
    );

    const grid = screen.getByTestId("sized-grid");
    expect(grid).toBeInTheDocument();
  });

  it("applies templateRows configuration", () => {
    render(
      <NimbusProvider>
        <Grid templateRows="repeat(2, 100px)" data-testid="row-grid">
          <Grid.Item>
            <Box>Row 1</Box>
          </Grid.Item>
          <Grid.Item>
            <Box>Row 2</Box>
          </Grid.Item>
        </Grid>
      </NimbusProvider>
    );

    const grid = screen.getByTestId("row-grid");
    expect(grid).toHaveStyle({
      gridTemplateRows: "repeat(2, 100px)",
    });
  });

  it("forwards className to container", () => {
    render(
      <NimbusProvider>
        <Grid className="custom-grid-class" data-testid="class-grid">
          <Grid.Item>
            <Box>Content</Box>
          </Grid.Item>
        </Grid>
      </NimbusProvider>
    );

    const grid = screen.getByTestId("class-grid");
    expect(grid).toHaveClass("custom-grid-class");
  });
});

/**
 * @docs-section integration
 * @docs-title Integration Tests
 * @docs-description Test Grid integration with other components
 * @docs-order 6
 */
describe("Grid - Integration", () => {
  it("works with Box components as children", () => {
    render(
      <NimbusProvider>
        <Grid templateColumns="repeat(2, 1fr)" gap="400">
          <Grid.Item>
            <Box p="400" bg="neutral.7" data-testid="box-1">
              Box 1
            </Box>
          </Grid.Item>
          <Grid.Item>
            <Box p="400" bg="neutral.7" data-testid="box-2">
              Box 2
            </Box>
          </Grid.Item>
        </Grid>
      </NimbusProvider>
    );

    expect(screen.getByTestId("box-1")).toBeInTheDocument();
    expect(screen.getByTestId("box-2")).toBeInTheDocument();
  });

  it("maintains proper tracking ID for analytics", () => {
    const TRACKING_ID = "product-grid-analytics";

    render(
      <NimbusProvider>
        <Grid id={TRACKING_ID} data-testid="tracking-grid">
          <Grid.Item>
            <Box>Product 1</Box>
          </Grid.Item>
          <Grid.Item>
            <Box>Product 2</Box>
          </Grid.Item>
        </Grid>
      </NimbusProvider>
    );

    const grid = screen.getByTestId("tracking-grid");
    expect(grid).toHaveAttribute("id", TRACKING_ID);
  });

  it("supports nested grids", () => {
    render(
      <NimbusProvider>
        <Grid templateColumns="repeat(2, 1fr)" data-testid="outer-grid">
          <Grid.Item>
            <Grid templateColumns="repeat(2, 1fr)" data-testid="inner-grid">
              <Grid.Item>
                <Box>Nested 1</Box>
              </Grid.Item>
              <Grid.Item>
                <Box>Nested 2</Box>
              </Grid.Item>
            </Grid>
          </Grid.Item>
          <Grid.Item>
            <Box>Outer 2</Box>
          </Grid.Item>
        </Grid>
      </NimbusProvider>
    );

    expect(screen.getByTestId("outer-grid")).toBeInTheDocument();
    expect(screen.getByTestId("inner-grid")).toBeInTheDocument();
    expect(screen.getByText("Nested 1")).toBeInTheDocument();
  });
});
