import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { within, userEvent, expect } from "storybook/test";
import { CollapsibleMotion } from "./collapsible-motion";
import { Button } from "../button";
import { Text } from "../text";
import { Box } from "../box";

const meta: Meta<typeof CollapsibleMotion.Root> = {
  title: "Components/Layout/CollapsibleMotion",
  component: CollapsibleMotion.Root,
  parameters: {
    docs: {
      description: {
        component:
          "A pragmatic implementation of smooth collapsible content with accessibility support.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic uncontrolled example with compound component pattern
 */
export const Basic: Story = {
  render: () => (
    <CollapsibleMotion.Root defaultExpanded={false}>
      <CollapsibleMotion.Trigger>
        <Button mb={4}>Toggle Content</Button>
      </CollapsibleMotion.Trigger>
      <CollapsibleMotion.Content>
        <Box p={4} bg="gray.50" borderRadius="md">
          <Text>
            This is collapsible content that will smoothly expand and collapse.
            The animation uses CSS transitions for optimal performance.
          </Text>
        </Box>
      </CollapsibleMotion.Content>
    </CollapsibleMotion.Root>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    const content = canvas.getByText(/This is collapsible content/);

    // Initially collapsed
    expect(content).not.toBeVisible();
    expect(button).toHaveAttribute("aria-expanded", "false");

    // Click to expand
    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");

    // Wait for animation to complete
    await new Promise((resolve) => setTimeout(resolve, 250));
    expect(content).toBeVisible();
  },
};

/**
 * Controlled example where parent manages the state
 */
export const Controlled: Story = {
  render: () => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <div>
        <Button onClick={() => setIsExpanded(!isExpanded)} mb={4}>
          {isExpanded ? "Collapse" : "Expand"} Content (External Control)
        </Button>
        <CollapsibleMotion.Root
          isExpanded={isExpanded}
          onExpandedChange={setIsExpanded}
        >
          <CollapsibleMotion.Trigger>
            <Button mb={4}>Toggle Content (Internal Control)</Button>
          </CollapsibleMotion.Trigger>
          <CollapsibleMotion.Content>
            <Box p={4} bg="blue.50" borderRadius="md">
              <Text>
                This is controlled collapsible content. The parent component
                manages the expanded state and can react to changes.
              </Text>
            </Box>
          </CollapsibleMotion.Content>
        </CollapsibleMotion.Root>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const externalButton = canvas.getByText(/External Control/);
    const internalButton = canvas.getByText(/Internal Control/);

    // Verify controlled state works with external button
    await userEvent.click(externalButton);
    expect(internalButton).toHaveAttribute("aria-expanded", "true");

    // Verify controlled state works with internal button
    await userEvent.click(internalButton);
    expect(internalButton).toHaveAttribute("aria-expanded", "false");
  },
};

/**
 * Controlled example where no trigger is supplied
 */
export const ControlledNoTrigger: Story = {
  render: () => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <div>
        <Button onClick={() => setIsExpanded(!isExpanded)} mb={4}>
          {isExpanded ? "Collapse" : "Expand"} Content (External Control)
        </Button>
        <CollapsibleMotion.Root
          isExpanded={isExpanded}
          onExpandedChange={setIsExpanded}
        >
          <CollapsibleMotion.Content>
            <Box p={4} bg="blue.50" borderRadius="md">
              <Text>
                This is controlled collapsible content. The parent component
                manages the expanded state and can react to changes.
              </Text>
            </Box>
          </CollapsibleMotion.Content>
        </CollapsibleMotion.Root>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify controlled state works with external button
    const externalButton = canvas.getByText(/Expand Content/);
    await userEvent.click(externalButton);

    //expect content to be visible
    expect(
      canvas.getByText(/This is controlled collapsible content/)
    ).toBeVisible();
  },
};

/**
 * Example with custom minimum height when collapsed
 *
 * TODO: This does not work yet but is here as a reminder. We need to wait for RAC to release support for this PR: https://github.com/adobe/react-spectrum/pull/8867
 */
export const WithMinHeight: Story = {
  render: () => (
    <CollapsibleMotion.Root defaultExpanded={false}>
      <CollapsibleMotion.Trigger>
        <Button mb={4}>Toggle Content</Button>
      </CollapsibleMotion.Trigger>
      <CollapsibleMotion.Content>
        <Box p={4} border="2px solid pink" minH="200px">
          <Text mb={4}>
            This content has a minimum height of 60px when collapsed, so it's
            never completely hidden.
          </Text>
          <Text>
            This allows for partial visibility of content even when collapsed,
            which can be useful for preview purposes.
          </Text>
        </Box>
      </CollapsibleMotion.Content>
    </CollapsibleMotion.Root>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    // Content should have minimum height even when collapsed
    expect(button).toHaveAttribute("aria-expanded", "false");

    // Expand to verify full functionality
    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
  },
};

/**
 * Example showing disabled state
 */
export const Disabled: Story = {
  render: () => (
    <CollapsibleMotion.Root isDisabled={true} defaultExpanded={false}>
      <CollapsibleMotion.Trigger>
        <Button mb={4}>Toggle Content (Disabled)</Button>
      </CollapsibleMotion.Trigger>
      <CollapsibleMotion.Content>
        <Box p={4} bg="red.50" borderRadius="md">
          <Text>
            This content is disabled and cannot be expanded or collapsed.
          </Text>
        </Box>
      </CollapsibleMotion.Content>
    </CollapsibleMotion.Root>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    // Button should be disabled
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-expanded", "false");

    // Clicking should have no effect
    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  },
};

/**
 * Example with dynamic content that changes size
 */
export const DynamicContent: Story = {
  render: () => {
    const [contentLength, setContentLength] = useState<
      "short" | "medium" | "long"
    >("short");

    const contentMap = {
      short: "Short content",
      medium:
        "This is medium length content that should cause the collapsible container to resize accordingly when expanded.",
      long: "This is very long content that demonstrates how the CollapsibleMotion component handles dynamic content changes. The component automatically re-measures the content height using ResizeObserver when the content changes, ensuring smooth transitions even when the content size varies dynamically.",
    };

    return (
      <div>
        <Box mb="16px">
          <Button
            onClick={() => setContentLength("short")}
            mr={2}
            variant={contentLength === "short" ? "solid" : "outline"}
            size="xs"
          >
            Short
          </Button>
          <Button
            onClick={() => setContentLength("medium")}
            mr={2}
            variant={contentLength === "medium" ? "solid" : "outline"}
            size="xs"
          >
            Medium
          </Button>
          <Button
            onClick={() => setContentLength("long")}
            variant={contentLength === "long" ? "solid" : "outline"}
            size="xs"
          >
            Long
          </Button>
        </Box>

        <CollapsibleMotion.Root defaultExpanded={true}>
          <CollapsibleMotion.Trigger>
            <Button mb={4}>Toggle Dynamic Content</Button>
          </CollapsibleMotion.Trigger>
          <CollapsibleMotion.Content>
            <Box p={4} bg="orange.50" borderRadius="md">
              <Text>{contentMap[contentLength]}</Text>
            </Box>
          </CollapsibleMotion.Content>
        </CollapsibleMotion.Root>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const longButton = canvas.getByText("Long");
    const toggleButton = canvas.getByText(/Toggle Dynamic Content/);

    // Change content to long
    await userEvent.click(longButton);

    // Collapse and expand to test dynamic resizing
    await userEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");

    // Verify long content is visible
    expect(canvas.getByText(/This is very long content/)).toBeVisible();
  },
};

/**
 * Accessibility test - demonstrates proper ARIA attributes and focus management
 */
export const AccessibilityTest: Story = {
  render: () => (
    <CollapsibleMotion.Root defaultExpanded={false}>
      <CollapsibleMotion.Trigger>
        <Button mb={4}>Accessible Toggle Button</Button>
      </CollapsibleMotion.Trigger>
      <CollapsibleMotion.Content>
        <Box p={4} bg="teal.50" borderRadius="md">
          <Text mb={4}>
            This example demonstrates proper accessibility features:
          </Text>
          <ul>
            <li>Proper ARIA attributes (aria-expanded, aria-controls)</li>
            <li>Focus management for screen readers</li>
            <li>Keyboard navigation support</li>
            <li>Content is not focusable when collapsed</li>
            <li>ResizeObserver for efficient content measurement</li>
          </ul>
        </Box>
      </CollapsibleMotion.Content>
    </CollapsibleMotion.Root>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    const content = canvas.getByText(/This example demonstrates/);

    // Test ARIA attributes
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-controls");

    // Expand and test again
    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");

    // Wait for animation
    await new Promise((resolve) => setTimeout(resolve, 250));

    // Content should be accessible when expanded
    const expandedPanel = content.closest('[aria-hidden="false"]');
    if (expandedPanel) {
      expect(expandedPanel).not.toHaveAttribute("tabindex", "-1");
    }
  },
};
