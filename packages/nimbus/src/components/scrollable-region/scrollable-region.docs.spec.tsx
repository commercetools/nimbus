import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  ScrollableRegion,
  Box,
  Heading,
  Text,
  NimbusProvider,
} from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the ScrollableRegion component renders with expected accessibility attributes
 * @docs-order 1
 */
describe("ScrollableRegion - Basic rendering", () => {
  it("renders with role=group by default", () => {
    render(
      <NimbusProvider>
        <ScrollableRegion aria-label="Log output" h="200px">
          <Text>Content</Text>
        </ScrollableRegion>
      </NimbusProvider>
    );

    const region = screen.getByRole("group", { name: "Log output" });
    expect(region).toBeInTheDocument();
    expect(region.tagName).toBe("DIV");
  });

  it("renders as section element with role=region", () => {
    render(
      <NimbusProvider>
        <ScrollableRegion role="region" aria-label="Main content" h="200px">
          <Text>Content</Text>
        </ScrollableRegion>
      </NimbusProvider>
    );

    const region = screen.getByRole("region", { name: "Main content" });
    expect(region).toBeInTheDocument();
    expect(region.tagName).toBe("SECTION");
  });

  it("renders children content", () => {
    render(
      <NimbusProvider>
        <ScrollableRegion aria-label="Test region" h="200px">
          <Text>Hello world</Text>
        </ScrollableRegion>
      </NimbusProvider>
    );

    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });
});

/**
 * @docs-section aria-attributes
 * @docs-title ARIA Attribute Tests
 * @docs-description Test accessible name patterns with aria-label and aria-labelledby
 * @docs-order 2
 */
describe("ScrollableRegion - ARIA attributes", () => {
  it("applies aria-label", () => {
    render(
      <NimbusProvider>
        <ScrollableRegion aria-label="Log output" h="200px">
          <Text>Content</Text>
        </ScrollableRegion>
      </NimbusProvider>
    );

    const region = screen.getByRole("group", { name: "Log output" });
    expect(region).toHaveAttribute("aria-label", "Log output");
  });

  it("applies aria-labelledby", () => {
    render(
      <NimbusProvider>
        <Box>
          <Heading id="logs-heading">Application Logs</Heading>
          <ScrollableRegion aria-labelledby="logs-heading" h="200px">
            <Text>Content</Text>
          </ScrollableRegion>
        </Box>
      </NimbusProvider>
    );

    const region = screen.getByRole("group", { name: "Application Logs" });
    expect(region).toHaveAttribute("aria-labelledby", "logs-heading");
  });
});

/**
 * @docs-section analytics-id
 * @docs-title Analytics ID Tests
 * @docs-description Verify support for persistent IDs used in tracking and analytics
 * @docs-order 3
 */
describe("ScrollableRegion - Analytics ID", () => {
  it("supports custom id for analytics", () => {
    const PERSISTENT_ID = "analytics-scrollable-region";

    render(
      <NimbusProvider>
        <ScrollableRegion
          id={PERSISTENT_ID}
          aria-label="Tracked region"
          h="200px"
        >
          <Text>Content</Text>
        </ScrollableRegion>
      </NimbusProvider>
    );

    const region = screen.getByRole("group", { name: "Tracked region" });
    expect(region).toHaveAttribute("id", PERSISTENT_ID);
  });
});
