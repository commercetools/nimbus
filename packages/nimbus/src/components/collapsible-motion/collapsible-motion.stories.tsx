import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { within, userEvent, expect, waitFor } from "storybook/test";
import { Box, Button, CollapsibleMotion, Text } from "@commercetools/nimbus";

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
    <div>
      <CollapsibleMotion.Root defaultExpanded={false}>
        <CollapsibleMotion.Trigger asChild>
          <Button mb="400">Toggle Content</Button>
        </CollapsibleMotion.Trigger>
        <CollapsibleMotion.Content>
          <Box p="400" bg="neutral.2" borderRadius="md">
            <Text>
              This is collapsible content that will smoothly expand and
              collapse. The animation uses CSS transitions for optimal
              performance.
            </Text>
          </Box>
        </CollapsibleMotion.Content>
      </CollapsibleMotion.Root>
      <hr />
    </div>
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
        <Button onPress={() => setIsExpanded(!isExpanded)} mb="400">
          {isExpanded ? "Collapse" : "Expand"} Content (External Control)
        </Button>
        <CollapsibleMotion.Root
          isExpanded={isExpanded}
          onExpandedChange={setIsExpanded}
        >
          <CollapsibleMotion.Trigger asChild>
            <Button mb="400">Toggle Content (Internal Control)</Button>
          </CollapsibleMotion.Trigger>
          <CollapsibleMotion.Content>
            <Box p="400" bg="blueAlpha.2" borderRadius="md">
              <Text>
                This is controlled collapsible content. The parent component
                manages the expanded state and can react to changes.
              </Text>
            </Box>
          </CollapsibleMotion.Content>
          <hr />
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
        <Button onPress={() => setIsExpanded(!isExpanded)} mb="400">
          {isExpanded ? "Collapse" : "Expand"} Content (External Control)
        </Button>
        <CollapsibleMotion.Root isExpanded={isExpanded}>
          <CollapsibleMotion.Content>
            <Box p="400" bg="greenAlpha.2" borderRadius="md">
              <Text>
                This is controlled collapsible content. The parent component
                manages the expanded state and can react to changes.
              </Text>
            </Box>
          </CollapsibleMotion.Content>
        </CollapsibleMotion.Root>
        <hr />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify controlled state works with external button
    const externalButton = canvas.getByText(/Expand Content/);
    await userEvent.click(externalButton);

    // Wait for animation to complete
    await waitFor(
      () => {
        expect(
          canvas.getByText(/This is controlled collapsible content/)
        ).toBeVisible();
      },
      { timeout: 1000 }
    );
  },
};

/**
 * Example with custom minimum height when collapsed
 *
 * TODO: This does not work yet but is here as a reminder. We need to wait for RAC to release support for this PR: https://github.com/adobe/react-spectrum/pull/8867
 */
export const WithMinHeight: Story = {
  render: () => (
    <div>
      <CollapsibleMotion.Root defaultExpanded={false}>
        <CollapsibleMotion.Trigger asChild>
          <Button mb="400">Toggle Content</Button>
        </CollapsibleMotion.Trigger>
        <CollapsibleMotion.Content>
          <Box
            p="400"
            border="2px solid"
            borderColor="pink.5"
            borderRadius="md"
            bg="pink.1"
          >
            <Text mb="200">
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
      <hr />
    </div>
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
    <div>
      <CollapsibleMotion.Root isDisabled={true} defaultExpanded={false}>
        <CollapsibleMotion.Trigger asChild>
          <Button mb="400">Toggle Content (Disabled)</Button>
        </CollapsibleMotion.Trigger>
        <CollapsibleMotion.Content>
          <Box p="400" bg="neutral.3" borderRadius="md">
            <Text>
              This content is disabled and cannot be expanded or collapsed.
            </Text>
          </Box>
        </CollapsibleMotion.Content>
      </CollapsibleMotion.Root>
      <hr />
    </div>
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
        <Box mb="400">
          <Button
            onPress={() => setContentLength("short")}
            variant={contentLength === "short" ? "solid" : "outline"}
            size="xs"
            mr="200"
          >
            Short
          </Button>
          <Button
            onPress={() => setContentLength("medium")}
            variant={contentLength === "medium" ? "solid" : "outline"}
            size="xs"
            mr="200"
          >
            Medium
          </Button>
          <Button
            onPress={() => setContentLength("long")}
            variant={contentLength === "long" ? "solid" : "outline"}
            size="xs"
          >
            Long
          </Button>
        </Box>

        <CollapsibleMotion.Root defaultExpanded={true}>
          <CollapsibleMotion.Trigger asChild>
            <Button mb="400">Toggle Dynamic Content</Button>
          </CollapsibleMotion.Trigger>
          <CollapsibleMotion.Content>
            <Box p="400" bg="orange.1" borderRadius="md">
              <Text>{contentMap[contentLength]}</Text>
            </Box>
          </CollapsibleMotion.Content>
        </CollapsibleMotion.Root>
        <hr />
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

    // Wait for animation and verify long content is visible
    await waitFor(
      () => {
        expect(canvas.getByText(/This is very long content/)).toBeVisible();
      },
      { timeout: 1000 }
    );
  },
};

// Test case for non-button trigger
export const NonButtonTrigger: Story = {
  render: () => (
    <div>
      <CollapsibleMotion.Root defaultExpanded={false}>
        <CollapsibleMotion.Trigger>
          <Box mb="400" p="200" bg="gray.1" borderRadius="sm" as="pre">
            Non-button trigger
          </Box>
        </CollapsibleMotion.Trigger>
        <CollapsibleMotion.Content>
          <Box p="400" bg="purple.1" borderRadius="md">
            <Text>This is the content of the collapsible motion.</Text>
          </Box>
        </CollapsibleMotion.Content>
      </CollapsibleMotion.Root>
      <hr />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByText(/Non-button trigger/);
    await userEvent.click(button);

    // Wait for animation to complete
    await waitFor(
      () => {
        expect(
          canvas.getByText(/This is the content of the collapsible motion/)
        ).toBeVisible();
      },
      { timeout: 1000 }
    );
  },
};

/**
 * Accessibility test - demonstrates proper ARIA attributes and focus management
 */
export const AccessibilityTest: Story = {
  render: () => (
    <div>
      <CollapsibleMotion.Root defaultExpanded={false}>
        <CollapsibleMotion.Trigger asChild>
          <Button mb="400">Accessible Toggle Button</Button>
        </CollapsibleMotion.Trigger>
        <CollapsibleMotion.Content>
          <Box p="400" bg="teal.1" borderRadius="md">
            <Text mb="400" fontWeight="bold">
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
      <hr />
    </div>
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

/**
 * Example with custom animation of CollapsibleMotion.Content
 */
export const CustomAnimation: Story = {
  render: () => (
    <div>
      <CollapsibleMotion.Root defaultExpanded={true}>
        <CollapsibleMotion.Trigger asChild>
          <Button mb="400">Toggle Content</Button>
        </CollapsibleMotion.Trigger>
        <CollapsibleMotion.Content
          animationName={{
            _open: "ping, gradient-shimmer, fade-in",
            _closed: "progress-indeterminate, fade-out",
          }}
          animationDuration="slowest"
        >
          <Box p="400" bg="neutral.2" borderRadius="md">
            <Text>
              This is collapsible content that will ping in, and slide out.
            </Text>
          </Box>
        </CollapsibleMotion.Content>
      </CollapsibleMotion.Root>
      <hr />
    </div>
  ),
};
