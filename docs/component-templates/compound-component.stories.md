# Compound Component Stories Template

Template for compound component Storybook stories. Replace: ComponentName,
component-name, componentName

```tsx
/**
 * Template for compound component Storybook stories
 * Replace: ComponentName, component-name, componentName
 */

import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, expect } from "storybook/test";
import { useState } from "react";
import { ComponentName } from "./component-name";

const meta: Meta<typeof ComponentName.Root> = {
  title: "Components/{CATEGORY}/ComponentName",
  component: ComponentName.Root,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["outline", "filled", "ghost"],
      description: "Visual variant of the component",
    },
    size: {
      control: { type: "radio" },
      options: ["sm", "md", "lg"],
      description: "Size of the component",
    },
    isDisabled: {
      control: "boolean",
      description: "Whether the component is disabled",
    },
    isOpen: {
      control: "boolean",
      description: "Whether the component is open (controlled)",
    },
    defaultIsOpen: {
      control: "boolean",
      description: "Default open state (uncontrolled)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default story - simplest usage
 */
export const Default: Story = {
  render: (args) => (
    <ComponentName.Root {...args}>
      <ComponentName.Trigger>Open ComponentName</ComponentName.Trigger>
      <ComponentName.Content>
        <ComponentName.Item value="option1">Option 1</ComponentName.Item>
        <ComponentName.Item value="option2">Option 2</ComponentName.Item>
        <ComponentName.Item value="option3">Option 3</ComponentName.Item>
      </ComponentName.Content>
    </ComponentName.Root>
  ),
};

/**
 * Variants - visual permutations
 */
export const Outline: Story = {
  args: {
    variant: "outline",
  },
  render: (args) => (
    <ComponentName.Root {...args}>
      <ComponentName.Trigger>Outline Variant</ComponentName.Trigger>
      <ComponentName.Content>
        <ComponentName.Item value="1">Item 1</ComponentName.Item>
        <ComponentName.Item value="2">Item 2</ComponentName.Item>
      </ComponentName.Content>
    </ComponentName.Root>
  ),
};

export const Filled: Story = {
  args: {
    variant: "filled",
  },
  render: (args) => (
    <ComponentName.Root {...args}>
      <ComponentName.Trigger>Filled Variant</ComponentName.Trigger>
      <ComponentName.Content>
        <ComponentName.Item value="1">Item 1</ComponentName.Item>
        <ComponentName.Item value="2">Item 2</ComponentName.Item>
      </ComponentName.Content>
    </ComponentName.Root>
  ),
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
  },
  render: (args) => (
    <ComponentName.Root {...args}>
      <ComponentName.Trigger>Ghost Variant</ComponentName.Trigger>
      <ComponentName.Content>
        <ComponentName.Item value="1">Item 1</ComponentName.Item>
        <ComponentName.Item value="2">Item 2</ComponentName.Item>
      </ComponentName.Content>
    </ComponentName.Root>
  ),
};

/**
 * Sizes
 */
export const Small: Story = {
  args: {
    size: "sm",
  },
  render: (args) => (
    <ComponentName.Root {...args}>
      <ComponentName.Trigger>Small Size</ComponentName.Trigger>
      <ComponentName.Content>
        <ComponentName.Item value="1">Small Item 1</ComponentName.Item>
        <ComponentName.Item value="2">Small Item 2</ComponentName.Item>
      </ComponentName.Content>
    </ComponentName.Root>
  ),
};

export const Medium: Story = {
  args: {
    size: "md",
  },
  render: (args) => (
    <ComponentName.Root {...args}>
      <ComponentName.Trigger>Medium Size</ComponentName.Trigger>
      <ComponentName.Content>
        <ComponentName.Item value="1">Medium Item 1</ComponentName.Item>
        <ComponentName.Item value="2">Medium Item 2</ComponentName.Item>
      </ComponentName.Content>
    </ComponentName.Root>
  ),
};

export const Large: Story = {
  args: {
    size: "lg",
  },
  render: (args) => (
    <ComponentName.Root {...args}>
      <ComponentName.Trigger>Large Size</ComponentName.Trigger>
      <ComponentName.Content>
        <ComponentName.Item value="1">Large Item 1</ComponentName.Item>
        <ComponentName.Item value="2">Large Item 2</ComponentName.Item>
      </ComponentName.Content>
    </ComponentName.Root>
  ),
};

/**
 * States
 */
export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
  render: (args) => (
    <ComponentName.Root {...args}>
      <ComponentName.Trigger>Disabled ComponentName</ComponentName.Trigger>
      <ComponentName.Content>
        <ComponentName.Item value="1">Item 1</ComponentName.Item>
        <ComponentName.Item value="2">Item 2</ComponentName.Item>
      </ComponentName.Content>
    </ComponentName.Root>
  ),
};

/**
 * Controlled mode example
 */
export const Controlled: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>();

    return (
      <div>
        <p>Open: {isOpen ? "true" : "false"}</p>
        <p>Selected: {selectedValue || "none"}</p>

        <ComponentName.Root
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          value={selectedValue}
          onChange={setSelectedValue}
        >
          <ComponentName.Trigger>
            Controlled ComponentName
          </ComponentName.Trigger>
          <ComponentName.Content>
            <ComponentName.Item value="option1">Option 1</ComponentName.Item>
            <ComponentName.Item value="option2">Option 2</ComponentName.Item>
            <ComponentName.Item value="option3">Option 3</ComponentName.Item>
          </ComponentName.Content>
        </ComponentName.Root>
      </div>
    );
  },
};

/**
 * Interactive story with play function
 * REQUIRED for all interactive compound components
 */
export const Interactive: Story = {
  render: () => (
    <ComponentName.Root>
      <ComponentName.Trigger>Interactive ComponentName</ComponentName.Trigger>
      <ComponentName.Content>
        <ComponentName.Item value="option1">Option 1</ComponentName.Item>
        <ComponentName.Item value="option2">Option 2</ComponentName.Item>
        <ComponentName.Item value="option3">Option 3</ComponentName.Item>
      </ComponentName.Content>
    </ComponentName.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Initial state", async () => {
      // Verify component renders
      const trigger = canvas.getByText("Interactive ComponentName");
      await expect(trigger).toBeInTheDocument();
      await expect(trigger).not.toBeDisabled();

      // Verify content is initially hidden
      expect(canvas.queryByText("Option 1")).not.toBeInTheDocument();
    });

    await step("Open component", async () => {
      const trigger = canvas.getByText("Interactive ComponentName");

      // Click to open
      await userEvent.click(trigger);

      // Wait for content to appear
      await expect(canvas.getByText("Option 1")).toBeInTheDocument();
      await expect(canvas.getByText("Option 2")).toBeInTheDocument();
      await expect(canvas.getByText("Option 3")).toBeInTheDocument();
    });

    await step("Select option", async () => {
      const option2 = canvas.getByText("Option 2");

      // Click option
      await userEvent.click(option2);

      // Verify selection (add assertions based on expected behavior)
      // Example: verify content closes, trigger shows selected value, etc.
    });

    await step("Keyboard navigation", async () => {
      const trigger = canvas.getByText("Interactive ComponentName");

      // Focus trigger with tab
      await userEvent.tab();
      await expect(trigger).toHaveFocus();

      // Open with Enter
      await userEvent.keyboard("{Enter}");
      await expect(canvas.getByText("Option 1")).toBeInTheDocument();

      // Navigate with arrow keys
      await userEvent.keyboard("{ArrowDown}");
      // Add assertion for focus state

      await userEvent.keyboard("{ArrowDown}");
      // Add assertion for focus state

      // Select with Enter
      await userEvent.keyboard("{Enter}");
      // Add assertion for selection
    });

    await step("Escape key closes", async () => {
      const trigger = canvas.getByText("Interactive ComponentName");

      // Open again
      await userEvent.click(trigger);
      await expect(canvas.getByText("Option 1")).toBeInTheDocument();

      // Press Escape
      await userEvent.keyboard("{Escape}");

      // Verify content is hidden
      expect(canvas.queryByText("Option 1")).not.toBeInTheDocument();
    });

    await step("Accessibility", async () => {
      const trigger = canvas.getByText("Interactive ComponentName");

      // Verify ARIA attributes
      await expect(trigger).toHaveAttribute("aria-haspopup");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");

      // Open and check expanded state
      await userEvent.click(trigger);
      await expect(trigger).toHaveAttribute("aria-expanded", "true");

      // Verify content has proper roles
      const options = canvas.getAllByRole("option"); // Adjust based on component
      expect(options).toHaveLength(3);
    });
  },
};

/**
 * Complex example with multiple features
 */
export const ComplexExample: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "2rem" }}>
      <ComponentName.Root variant="outline" size="sm">
        <ComponentName.Trigger>Small Outline</ComponentName.Trigger>
        <ComponentName.Content>
          <ComponentName.Item value="1">Item 1</ComponentName.Item>
          <ComponentName.Item value="2" isDisabled>
            Disabled Item
          </ComponentName.Item>
          <ComponentName.Item value="3">Item 3</ComponentName.Item>
        </ComponentName.Content>
      </ComponentName.Root>

      <ComponentName.Root variant="filled" size="md">
        <ComponentName.Trigger>Medium Filled</ComponentName.Trigger>
        <ComponentName.Content>
          <ComponentName.Item value="a">Option A</ComponentName.Item>
          <ComponentName.Item value="b">Option B</ComponentName.Item>
        </ComponentName.Content>
      </ComponentName.Root>

      <ComponentName.Root variant="ghost" size="lg">
        <ComponentName.Trigger>Large Ghost</ComponentName.Trigger>
        <ComponentName.Content>
          <ComponentName.Item value="x">Choice X</ComponentName.Item>
          <ComponentName.Item value="y">Choice Y</ComponentName.Item>
          <ComponentName.Item value="z">Choice Z</ComponentName.Item>
        </ComponentName.Content>
      </ComponentName.Root>
    </div>
  ),
};

/**
 * Edge cases and error states
 */
export const EdgeCases: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Empty content */}
      <ComponentName.Root>
        <ComponentName.Trigger>Empty Content</ComponentName.Trigger>
        <ComponentName.Content>{/* No items */}</ComponentName.Content>
      </ComponentName.Root>

      {/* Single item */}
      <ComponentName.Root>
        <ComponentName.Trigger>Single Item</ComponentName.Trigger>
        <ComponentName.Content>
          <ComponentName.Item value="only">Only Option</ComponentName.Item>
        </ComponentName.Content>
      </ComponentName.Root>

      {/* All items disabled */}
      <ComponentName.Root>
        <ComponentName.Trigger>All Disabled</ComponentName.Trigger>
        <ComponentName.Content>
          <ComponentName.Item value="1" isDisabled>
            Disabled 1
          </ComponentName.Item>
          <ComponentName.Item value="2" isDisabled>
            Disabled 2
          </ComponentName.Item>
        </ComponentName.Content>
      </ComponentName.Root>

      {/* Long content */}
      <ComponentName.Root>
        <ComponentName.Trigger>Long Content</ComponentName.Trigger>
        <ComponentName.Content>
          <ComponentName.Item value="long">
            This is a very long option text that might wrap or overflow
          </ComponentName.Item>
          <ComponentName.Item value="short">Short</ComponentName.Item>
        </ComponentName.Content>
      </ComponentName.Root>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Test empty content", async () => {
      const emptyTrigger = canvas.getByText("Empty Content");
      await userEvent.click(emptyTrigger);

      // Verify behavior with no items
      // Add assertions based on expected behavior
    });

    await step("Test single item", async () => {
      const singleTrigger = canvas.getByText("Single Item");
      await userEvent.click(singleTrigger);

      const onlyOption = canvas.getByText("Only Option");
      await expect(onlyOption).toBeInTheDocument();
    });

    await step("Test all disabled items", async () => {
      const disabledTrigger = canvas.getByText("All Disabled");
      await userEvent.click(disabledTrigger);

      // Verify disabled items can't be selected
      const disabled1 = canvas.getByText("Disabled 1");
      const disabled2 = canvas.getByText("Disabled 2");

      await expect(disabled1).toHaveAttribute("aria-disabled", "true");
      await expect(disabled2).toHaveAttribute("aria-disabled", "true");
    });
  },
};
```

## Key Requirements for Compound Component Stories

1. **Meta Configuration**: Use `ComponentName.Root` as the main component for
   controls
2. **Complete Variants**: Cover all variant and size combinations
3. **State Coverage**: Include disabled, controlled/uncontrolled modes
4. **Interactive Testing**: MANDATORY play functions testing user interactions
5. **Keyboard Navigation**: Test arrow keys, Enter, Escape, Tab navigation
6. **Accessibility Testing**: Verify ARIA attributes and screen reader support
7. **Edge Cases**: Test empty content, single items, all disabled states
8. **Complex Examples**: Show multiple variants together and real-world usage
9. **Controlled Examples**: Demonstrate controlled vs uncontrolled patterns
10. **Error Handling**: Test boundary conditions and error states

## Testing Guidelines

When testing compound components, focus on:

- **User interactions**: All ways users can interact with the component (click,
  hover, keyboard)
- **State changes**: How the component responds to different states and
  transitions
- **Accessibility**: Keyboard navigation, screen reader support, and ARIA
  attributes
- **Boundary conditions**: Edge cases like disabled states, empty data, or error
  conditions

Test each compound component's unique interaction patterns while ensuring
consistent behavior across the design system.
