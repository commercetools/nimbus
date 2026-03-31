import React, { useRef } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  ScrollArea,
  NimbusProvider,
  useScrollArea,
  Box,
  Text,
} from "@commercetools/nimbus";

/** Lines of text that cause vertical overflow in a constrained container. */
const OverflowingContent = () => (
  <>
    {Array.from({ length: 20 }, (_, i) => (
      <Text key={i} fontSize="sm">
        Line {i + 1}
      </Text>
    ))}
  </>
);

/**
 * @docs-section basic-usage
 * @docs-title Basic Usage
 * @docs-description Basic vertical scrollable container
 * @docs-order 1
 */
describe("ScrollArea - Basic usage", () => {
  it("renders children inside a scrollable container", () => {
    render(
      <NimbusProvider>
        <ScrollArea maxH="200px">
          <OverflowingContent />
        </ScrollArea>
      </NimbusProvider>
    );

    expect(screen.getByText("Line 1")).toBeInTheDocument();
  });

  it("renders with always-visible scrollbars", () => {
    const { container } = render(
      <NimbusProvider>
        <ScrollArea maxH="200px" variant="always">
          <OverflowingContent />
        </ScrollArea>
      </NimbusProvider>
    );

    expect(
      container.querySelector('[data-part="scrollbar"]')
    ).toBeInTheDocument();
  });
});

/**
 * @docs-section orientation
 * @docs-title Orientation
 * @docs-description Controlling which scrollbar axes render
 * @docs-order 2
 */
describe("ScrollArea - Orientation", () => {
  it("renders horizontal scrollbar", () => {
    const { container } = render(
      <NimbusProvider>
        <ScrollArea maxW="300px" orientation="horizontal">
          <Box whiteSpace="nowrap">
            <Text>{"Wide content ".repeat(30)}</Text>
          </Box>
        </ScrollArea>
      </NimbusProvider>
    );

    const scrollbar = container.querySelector('[data-part="scrollbar"]');
    expect(scrollbar).toHaveAttribute("data-orientation", "horizontal");
  });

  it("renders both axes with a corner", () => {
    const { container } = render(
      <NimbusProvider>
        <ScrollArea maxH="200px" maxW="300px" orientation="both">
          <Box whiteSpace="nowrap">
            <OverflowingContent />
          </Box>
        </ScrollArea>
      </NimbusProvider>
    );

    const scrollbars = container.querySelectorAll('[data-part="scrollbar"]');
    expect(scrollbars).toHaveLength(2);
    expect(container.querySelector('[data-part="corner"]')).toBeInTheDocument();
  });
});

/**
 * @docs-section programmatic-access
 * @docs-title Programmatic Access
 * @docs-description Accessing the scrollable viewport via ref or external hook
 * @docs-order 3
 */
describe("ScrollArea - Programmatic access", () => {
  it("forwards a ref to the viewport via viewportRef", () => {
    const ref = React.createRef<HTMLDivElement>();

    render(
      <NimbusProvider>
        <ScrollArea maxH="200px" viewportRef={ref}>
          <OverflowingContent />
        </ScrollArea>
      </NimbusProvider>
    );

    expect(ref.current).toHaveAttribute("data-part", "viewport");
    expect(typeof ref.current?.scrollTo).toBe("function");
  });

  it("supports external control via useScrollArea + value prop", () => {
    const ExternalControl = () => {
      const scrollArea = useScrollArea();
      return (
        <ScrollArea maxH="200px" value={scrollArea}>
          <OverflowingContent />
        </ScrollArea>
      );
    };

    render(
      <NimbusProvider>
        <ExternalControl />
      </NimbusProvider>
    );

    expect(screen.getByText("Line 1")).toBeInTheDocument();
  });
});

/**
 * @docs-section content-padding
 * @docs-title Content Padding
 * @docs-description Applying padding via an inner Box wrapper
 * @docs-order 4
 */
describe("ScrollArea - Content padding", () => {
  it("renders padded content via a nested Box", () => {
    render(
      <NimbusProvider>
        <ScrollArea maxH="200px">
          <Box p="200">
            <OverflowingContent />
          </Box>
        </ScrollArea>
      </NimbusProvider>
    );

    expect(screen.getByText("Line 1")).toBeInTheDocument();
  });
});
