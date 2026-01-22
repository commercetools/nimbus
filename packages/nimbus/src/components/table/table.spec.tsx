/**
 * Unit tests for Table component
 *
 * Tests basic rendering, compound component structure, and ref handling
 * to ensure Jest CommonJS module resolution works correctly.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import { Table } from "./table";
import { createRef } from "react";

describe("Table", () => {
  describe("Base", () => {
    it("Renders table with all parts", () => {
      render(
        <Table.Root data-testid="test-table">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Name</Table.ColumnHeader>
              <Table.ColumnHeader>Age</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>John</Table.Cell>
              <Table.Cell>30</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Jane</Table.Cell>
              <Table.Cell>25</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      );

      expect(screen.getByTestId("test-table")).toBeInTheDocument();
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Age")).toBeInTheDocument();
      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("Jane")).toBeInTheDocument();
    });

    it("Renders table with caption", () => {
      render(
        <Table.Root>
          <Table.Caption>Employee List</Table.Caption>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Data</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      );

      expect(screen.getByText("Employee List")).toBeInTheDocument();
    });

    it("Renders table with footer", () => {
      render(
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Column</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Data</Table.Cell>
            </Table.Row>
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.Cell>Footer Data</Table.Cell>
            </Table.Row>
          </Table.Footer>
        </Table.Root>
      );

      expect(screen.getByText("Footer Data")).toBeInTheDocument();
    });

    it("Forwards data- and aria-attributes", () => {
      render(
        <Table.Root data-testid="test-table" aria-label="test-table">
          <Table.Body>
            <Table.Row>
              <Table.Cell>Content</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      );

      const table = screen.getByTestId("test-table");
      expect(table).toHaveAttribute("data-testid", "test-table");
      expect(table).toHaveAttribute("aria-label", "test-table");
    });
  });

  describe("WithRef", () => {
    it("Forwards ref to Root correctly", () => {
      const tableRef = createRef<HTMLTableElement>();

      render(
        <Table.Root ref={tableRef} data-testid="table-ref">
          <Table.Body>
            <Table.Row>
              <Table.Cell>Content</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      );

      const table = screen.getByTestId("table-ref");
      expect(tableRef.current).toBe(table);
    });
  });

  describe("CompoundComponent", () => {
    it("Has all required sub-components", () => {
      expect(Table.Root).toBeDefined();
      expect(Table.Caption).toBeDefined();
      expect(Table.Header).toBeDefined();
      expect(Table.Body).toBeDefined();
      expect(Table.Footer).toBeDefined();
      expect(Table.Row).toBeDefined();
      expect(Table.ColumnHeader).toBeDefined();
      expect(Table.Cell).toBeDefined();
      expect(Table.ScrollArea).toBeDefined();
    });

    it("Sub-components have correct displayNames", () => {
      expect(Table.Root.displayName).toBe("Table.Root");
      expect(Table.Caption.displayName).toBe("Table.Caption");
      expect(Table.Header.displayName).toBe("Table.Header");
      expect(Table.Body.displayName).toBe("Table.Body");
      expect(Table.Footer.displayName).toBe("Table.Footer");
      expect(Table.Row.displayName).toBe("Table.Row");
      expect(Table.ColumnHeader.displayName).toBe("Table.ColumnHeader");
      expect(Table.Cell.displayName).toBe("Table.Cell");
      expect(Table.ScrollArea.displayName).toBe("Table.ScrollArea");
    });
  });
});
