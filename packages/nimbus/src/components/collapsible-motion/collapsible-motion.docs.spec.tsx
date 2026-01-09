import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  CollapsibleMotion,
  NimbusProvider,
  Button,
  Box,
  Text,
} from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the component renders with expected elements and initial state
 * @docs-order 1
 */
describe("CollapsibleMotion - Basic rendering", () => {
  it("renders trigger and content", () => {
    render(
      <NimbusProvider>
        <CollapsibleMotion.Root defaultExpanded={false}>
          <CollapsibleMotion.Trigger asChild>
            <Button>Toggle</Button>
          </CollapsibleMotion.Trigger>
          <CollapsibleMotion.Content>
            <Text>Collapsible content</Text>
          </CollapsibleMotion.Content>
        </CollapsibleMotion.Root>
      </NimbusProvider>
    );

    expect(screen.getByRole("button", { name: /toggle/i })).toBeInTheDocument();
    expect(screen.getByText(/collapsible content/i)).toBeInTheDocument();
  });

  it("renders with correct initial expanded state", () => {
    render(
      <NimbusProvider>
        <CollapsibleMotion.Root defaultExpanded={false}>
          <CollapsibleMotion.Trigger asChild>
            <Button>Toggle</Button>
          </CollapsibleMotion.Trigger>
          <CollapsibleMotion.Content>
            <Text>Content</Text>
          </CollapsibleMotion.Content>
        </CollapsibleMotion.Root>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("renders with defaultExpanded true", () => {
    render(
      <NimbusProvider>
        <CollapsibleMotion.Root defaultExpanded={true}>
          <CollapsibleMotion.Trigger asChild>
            <Button>Toggle</Button>
          </CollapsibleMotion.Trigger>
          <CollapsibleMotion.Content>
            <Text>Content</Text>
          </CollapsibleMotion.Content>
        </CollapsibleMotion.Root>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-expanded", "true");
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test user interactions like clicking the trigger to expand/collapse
 * @docs-order 2
 */
describe("CollapsibleMotion - Interactions", () => {
  it("toggles expanded state when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <CollapsibleMotion.Root defaultExpanded={false}>
          <CollapsibleMotion.Trigger asChild>
            <Button>Toggle</Button>
          </CollapsibleMotion.Trigger>
          <CollapsibleMotion.Content>
            <Box data-testid="content">
              <Text>Collapsible content</Text>
            </Box>
          </CollapsibleMotion.Content>
        </CollapsibleMotion.Root>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");

    // Initially collapsed
    expect(button).toHaveAttribute("aria-expanded", "false");

    // Click to expand
    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");

    // Click to collapse
    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("calls onExpandedChange callback when toggled", async () => {
    const user = userEvent.setup();
    const handleExpandedChange = vi.fn();

    render(
      <NimbusProvider>
        <CollapsibleMotion.Root
          defaultExpanded={false}
          onExpandedChange={handleExpandedChange}
        >
          <CollapsibleMotion.Trigger asChild>
            <Button>Toggle</Button>
          </CollapsibleMotion.Trigger>
          <CollapsibleMotion.Content>
            <Text>Content</Text>
          </CollapsibleMotion.Content>
        </CollapsibleMotion.Root>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleExpandedChange).toHaveBeenCalledWith(true);
  });

  it("supports keyboard interaction with Enter key", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <CollapsibleMotion.Root defaultExpanded={false}>
          <CollapsibleMotion.Trigger asChild>
            <Button>Toggle</Button>
          </CollapsibleMotion.Trigger>
          <CollapsibleMotion.Content>
            <Text>Content</Text>
          </CollapsibleMotion.Content>
        </CollapsibleMotion.Root>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    button.focus();
    await user.keyboard("{Enter}");

    expect(button).toHaveAttribute("aria-expanded", "true");
  });
});

/**
 * @docs-section controlled-mode
 * @docs-title Controlled Mode Tests
 * @docs-description Test controlled state management with isExpanded prop
 * @docs-order 3
 */
describe("CollapsibleMotion - Controlled mode", () => {
  it("respects controlled isExpanded prop", async () => {
    const { rerender } = render(
      <NimbusProvider>
        <CollapsibleMotion.Root isExpanded={false}>
          <CollapsibleMotion.Trigger asChild>
            <Button>Toggle</Button>
          </CollapsibleMotion.Trigger>
          <CollapsibleMotion.Content>
            <Text>Content</Text>
          </CollapsibleMotion.Content>
        </CollapsibleMotion.Root>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-expanded", "false");

    // Update to expanded - wait for animation state updates
    rerender(
      <NimbusProvider>
        <CollapsibleMotion.Root isExpanded={true}>
          <CollapsibleMotion.Trigger asChild>
            <Button>Toggle</Button>
          </CollapsibleMotion.Trigger>
          <CollapsibleMotion.Content>
            <Text>Content</Text>
          </CollapsibleMotion.Content>
        </CollapsibleMotion.Root>
      </NimbusProvider>
    );

    await waitFor(() => {
      expect(button).toHaveAttribute("aria-expanded", "true");
    });
  });

  it("calls onExpandedChange in controlled mode", async () => {
    const user = userEvent.setup();
    const handleExpandedChange = vi.fn();

    render(
      <NimbusProvider>
        <CollapsibleMotion.Root
          isExpanded={false}
          onExpandedChange={handleExpandedChange}
        >
          <CollapsibleMotion.Trigger asChild>
            <Button>Toggle</Button>
          </CollapsibleMotion.Trigger>
          <CollapsibleMotion.Content>
            <Text>Content</Text>
          </CollapsibleMotion.Content>
        </CollapsibleMotion.Root>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleExpandedChange).toHaveBeenCalledWith(true);
  });
});

/**
 * @docs-section disabled-state
 * @docs-title Disabled State Tests
 * @docs-description Verify disabled state prevents interactions
 * @docs-order 4
 */
describe("CollapsibleMotion - Disabled state", () => {
  it("renders trigger as disabled when isDisabled is true", () => {
    render(
      <NimbusProvider>
        <CollapsibleMotion.Root isDisabled={true} defaultExpanded={false}>
          <CollapsibleMotion.Trigger asChild>
            <Button>Toggle</Button>
          </CollapsibleMotion.Trigger>
          <CollapsibleMotion.Content>
            <Text>Content</Text>
          </CollapsibleMotion.Content>
        </CollapsibleMotion.Root>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("does not toggle state when disabled trigger is clicked", async () => {
    const user = userEvent.setup();
    const handleExpandedChange = vi.fn();

    render(
      <NimbusProvider>
        <CollapsibleMotion.Root
          isDisabled={true}
          defaultExpanded={false}
          onExpandedChange={handleExpandedChange}
        >
          <CollapsibleMotion.Trigger asChild>
            <Button>Toggle</Button>
          </CollapsibleMotion.Trigger>
          <CollapsibleMotion.Content>
            <Text>Content</Text>
          </CollapsibleMotion.Content>
        </CollapsibleMotion.Root>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    // Should not change state or call callback
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(handleExpandedChange).not.toHaveBeenCalled();
  });
});

/**
 * @docs-section accessibility
 * @docs-title Accessibility Tests
 * @docs-description Verify ARIA attributes and accessibility features
 * @docs-order 5
 */
describe("CollapsibleMotion - Accessibility", () => {
  it("sets correct ARIA attributes on trigger", () => {
    render(
      <NimbusProvider>
        <CollapsibleMotion.Root defaultExpanded={false}>
          <CollapsibleMotion.Trigger asChild>
            <Button>Toggle</Button>
          </CollapsibleMotion.Trigger>
          <CollapsibleMotion.Content>
            <Text>Content</Text>
          </CollapsibleMotion.Content>
        </CollapsibleMotion.Root>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-controls");
  });

  it("updates aria-expanded when toggled", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <CollapsibleMotion.Root defaultExpanded={false}>
          <CollapsibleMotion.Trigger asChild>
            <Button>Toggle</Button>
          </CollapsibleMotion.Trigger>
          <CollapsibleMotion.Content>
            <Text>Content</Text>
          </CollapsibleMotion.Content>
        </CollapsibleMotion.Root>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");

    // Initially false
    expect(button).toHaveAttribute("aria-expanded", "false");

    // After click, should be true
    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it("supports custom id for tracking", () => {
    const trackingId = "test-collapsible-motion";
    render(
      <NimbusProvider>
        <CollapsibleMotion.Root id={trackingId} defaultExpanded={false}>
          <CollapsibleMotion.Trigger asChild>
            <Button>Toggle</Button>
          </CollapsibleMotion.Trigger>
          <CollapsibleMotion.Content>
            <Text>Content</Text>
          </CollapsibleMotion.Content>
        </CollapsibleMotion.Root>
      </NimbusProvider>
    );

    const root = screen.getByRole("button").closest("div");
    expect(root).toHaveAttribute("id", trackingId);
  });
});

/**
 * @docs-section without-trigger
 * @docs-title External Control Tests
 * @docs-description Test using CollapsibleMotion without an internal trigger
 * @docs-order 6
 */
describe("CollapsibleMotion - Without trigger", () => {
  it("works with external control and no trigger component", async () => {
    const user = userEvent.setup();

    const TestComponent = () => {
      const [isExpanded, setIsExpanded] = React.useState(false);

      return (
        <NimbusProvider>
          <Button onPress={() => setIsExpanded(!isExpanded)}>
            External Toggle
          </Button>
          <CollapsibleMotion.Root isExpanded={isExpanded}>
            <CollapsibleMotion.Content>
              <Text>Content controlled externally</Text>
            </CollapsibleMotion.Content>
          </CollapsibleMotion.Root>
        </NimbusProvider>
      );
    };

    render(<TestComponent />);

    const externalButton = screen.getByRole("button", {
      name: /external toggle/i,
    });
    const content = screen.getByText(/content controlled externally/i);

    // Initially collapsed (not visible due to Presence)
    expect(content).toBeInTheDocument();

    // Click external button to expand
    await user.click(externalButton);

    // Content should be visible after animation
    await waitFor(() => {
      expect(content).toBeVisible();
    });
  });
});
