import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Table, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the table renders with expected structure and content
 * @docs-order 1
 */
describe("Table - Basic rendering", () => {
  it("renders table with headers and data", () => {
    const data = [
      { id: "1", name: "Product A", price: "$99.99" },
      { id: "2", name: "Product B", price: "$149.99" },
    ];

    render(
      <NimbusProvider>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Name</Table.ColumnHeader>
              <Table.ColumnHeader>Price</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.price}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </NimbusProvider>
    );

    // Verify table exists
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    // Verify headers
    expect(
      screen.getByRole("columnheader", { name: "Name" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Price" })
    ).toBeInTheDocument();

    // Verify data cells
    expect(screen.getByText("Product A")).toBeInTheDocument();
    expect(screen.getByText("$99.99")).toBeInTheDocument();
    expect(screen.getByText("Product B")).toBeInTheDocument();
    expect(screen.getByText("$149.99")).toBeInTheDocument();
  });

  it("renders table with caption", () => {
    render(
      <NimbusProvider>
        <Table.Root>
          <Table.Caption>Product Inventory</Table.Caption>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Product</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Item 1</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Product Inventory")).toBeInTheDocument();
  });

  it("renders table with footer", () => {
    render(
      <NimbusProvider>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Item</Table.ColumnHeader>
              <Table.ColumnHeader>Amount</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Product</Table.Cell>
              <Table.Cell>$100</Table.Cell>
            </Table.Row>
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.Cell>Total</Table.Cell>
              <Table.Cell>$100</Table.Cell>
            </Table.Row>
          </Table.Footer>
        </Table.Root>
      </NimbusProvider>
    );

    const footer = screen.getByText("Total");
    expect(footer).toBeInTheDocument();
  });
});

/**
 * @docs-section accessibility
 * @docs-title Accessibility Tests
 * @docs-description Test table accessibility features
 * @docs-order 2
 */
describe("Table - Accessibility", () => {
  it("has proper table structure with semantic elements", () => {
    render(
      <NimbusProvider>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Name</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Alice</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </NimbusProvider>
    );

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    // Check for header cells
    const columnHeader = screen.getByRole("columnheader", { name: "Name" });
    expect(columnHeader).toBeInTheDocument();

    // Check for data cells
    const cells = screen.getAllByRole("cell");
    expect(cells).toHaveLength(1);
    expect(cells[0]).toHaveTextContent("Alice");
  });

  it("supports aria-label for table identification", () => {
    render(
      <NimbusProvider>
        <Table.Root aria-label="User directory">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Name</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Alice</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </NimbusProvider>
    );

    const table = screen.getByRole("table", { name: "User directory" });
    expect(table).toBeInTheDocument();
  });

  it("uses caption for table description", () => {
    render(
      <NimbusProvider>
        <Table.Root>
          <Table.Caption>Employee Information</Table.Caption>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Name</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Bob</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Employee Information")).toBeInTheDocument();
  });
});
