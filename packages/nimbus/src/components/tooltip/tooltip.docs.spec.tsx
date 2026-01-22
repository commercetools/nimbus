import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tooltip, Button, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the tooltip renders and displays content on interaction
 * @docs-order 1
 */
describe("Tooltip - Basic rendering", () => {
  it("renders trigger element", () => {
    render(
      <NimbusProvider>
        <Tooltip.Root>
          <Button>Hover me</Button>
          <Tooltip.Content>Tooltip text</Tooltip.Content>
        </Tooltip.Root>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("button", { name: /hover me/i })
    ).toBeInTheDocument();
  });

  it("shows tooltip content on focus", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Tooltip.Root>
          <Button>Hover me</Button>
          <Tooltip.Content>Tooltip text</Tooltip.Content>
        </Tooltip.Root>
      </NimbusProvider>
    );

    // Focus the button using tab
    await user.tab();

    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
      expect(screen.getByText("Tooltip text")).toBeInTheDocument();
    });
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test focus interactions (hover tests require browser environment)
 * @docs-order 2
 */
describe("Tooltip - Interactions", () => {
  it("shows tooltip on focus", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Tooltip.Root>
          <Button>Action Button</Button>
          <Tooltip.Content>Action tooltip</Tooltip.Content>
        </Tooltip.Root>
      </NimbusProvider>
    );

    // Use userEvent.tab() instead of element.focus() to avoid act() warnings
    await user.tab();

    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
      expect(screen.getByText("Action tooltip")).toBeInTheDocument();
    });
  });

  it("hides tooltip when focus leaves", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Tooltip.Root>
          <Button>First</Button>
          <Tooltip.Content>First tooltip</Tooltip.Content>
        </Tooltip.Root>
        <Button>Second</Button>
      </NimbusProvider>
    );

    // Focus first button
    await user.tab();
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    // Focus second button
    await user.tab();
    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });
});

/**
 * @docs-section placement
 * @docs-title Testing Placement
 * @docs-description Verify tooltip positioning
 * @docs-order 3
 */
describe("Tooltip - Placement", () => {
  it("renders with top placement", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Tooltip.Root>
          <Button>Trigger</Button>
          <Tooltip.Content placement="top">Top tooltip</Tooltip.Content>
        </Tooltip.Root>
      </NimbusProvider>
    );

    // Tab to focus the button
    await user.tab();

    await waitFor(() => {
      const tooltip = screen.getByRole("tooltip");
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent("Top tooltip");
    });
  });
});

/**
 * @docs-section portal-content
 * @docs-title Testing with Portal Content
 * @docs-description Tooltips render in a portal, so query from document when needed
 * @docs-order 4
 */
describe("Tooltip - Portal rendering", () => {
  it("renders tooltip in portal", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Tooltip.Root>
          <Button>Show tooltip</Button>
          <Tooltip.Content>Portal content</Tooltip.Content>
        </Tooltip.Root>
      </NimbusProvider>
    );

    // Use userEvent.tab() instead of element.focus() to avoid act() warnings
    await user.tab();

    // Wait for portal content to appear
    await waitFor(() => {
      const tooltip = screen.getByRole("tooltip");
      expect(tooltip).toBeInTheDocument();
    });
  });
});

/**
 * @docs-section delay-timing
 * @docs-title Testing Custom Delay Timing
 * @docs-description Verify delay configuration works as expected
 * @docs-order 5
 */
describe("Tooltip - Timing", () => {
  it("respects custom delay", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Tooltip.Root delay={0} closeDelay={0}>
          <Button>Instant</Button>
          <Tooltip.Content>Shows immediately</Tooltip.Content>
        </Tooltip.Root>
      </NimbusProvider>
    );

    // Use userEvent.tab() instead of element.focus() to avoid act() warnings
    await user.tab();

    // With delay={0}, tooltip should appear immediately
    await waitFor(
      () => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      },
      { timeout: 100 }
    );
  });
});
