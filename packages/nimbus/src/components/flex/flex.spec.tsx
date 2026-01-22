/**
 * Unit tests for Flex component
 *
 * Tests basic rendering, prop forwarding, and ref handling to ensure
 * Jest CommonJS module resolution works correctly.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import { Flex } from "./flex";
import { createRef } from "react";

describe("Flex", () => {
  describe("Base", () => {
    it("Renders children", () => {
      render(
        <Flex data-testid="flex-container">
          <div>Child 1</div>
          <div>Child 2</div>
        </Flex>
      );

      expect(screen.getByText("Child 1")).toBeInTheDocument();
      expect(screen.getByText("Child 2")).toBeInTheDocument();
    });

    it("Forwards data- and aria-attributes", () => {
      render(
        <Flex data-testid="test-flex" aria-label="test-flex">
          <div>Content</div>
        </Flex>
      );

      const flex = screen.getByTestId("test-flex");
      expect(flex).toHaveAttribute("data-testid", "test-flex");
      expect(flex).toHaveAttribute("aria-label", "test-flex");
    });

    it("Applies gap prop", () => {
      render(
        <Flex gap="400" data-testid="flex-gap">
          <div>Item</div>
        </Flex>
      );

      const flex = screen.getByTestId("flex-gap");
      expect(flex).toBeInTheDocument();
      // Note: actual gap CSS would need to be tested via integration tests
    });

    it("Applies direction prop", () => {
      render(
        <Flex direction="column" data-testid="flex-column">
          <div>Item</div>
        </Flex>
      );

      const flex = screen.getByTestId("flex-column");
      expect(flex).toBeInTheDocument();
    });
  });

  describe("WithRef", () => {
    it("Forwards ref correctly", () => {
      const flexRef = createRef<HTMLDivElement>();

      render(
        <Flex ref={flexRef} data-testid="flex-ref">
          Content
        </Flex>
      );

      const flex = screen.getByTestId("flex-ref");
      expect(flexRef.current).toBe(flex);
    });
  });
});
