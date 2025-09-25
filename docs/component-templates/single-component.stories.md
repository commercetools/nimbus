# Single Component Stories Template

Template for Storybook stories. Replace: ComponentName, component-name,
componentName

```tsx
/**
 * Template for Storybook stories
 * Replace: ComponentName, component-name, componentName
 */

import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, expect } from "storybook/test";
import { ComponentName } from "./component-name";

const meta: Meta<typeof ComponentName> = {
  title: "Components/{CATEGORY}/ComponentName",
  component: ComponentName,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "ghost"],
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
    isLoading: {
      control: "boolean",
      description: "Whether the component is in loading state",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default story - simplest usage
 */
export const Default: Story = {
  args: {
    children: "Default ComponentName",
  },
};

/**
 * Variants - visual permutations
 */
export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Variant",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Variant",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost Variant",
  },
};

/**
 * Sizes
 */
export const Small: Story = {
  args: {
    size: "sm",
    children: "Small Size",
  },
};

export const Medium: Story = {
  args: {
    size: "md",
    children: "Medium Size",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Large Size",
  },
};

/**
 * States
 */
export const Disabled: Story = {
  args: {
    isDisabled: true,
    children: "Disabled State",
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    children: "Loading State",
  },
};

/**
 * Interactive story with play function
 * REQUIRED for all interactive components
 */
export const Interactive: Story = {
  args: {
    children: "Click me",
    onClick: () => console.log("Clicked!"),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Initial state", async () => {
      // Verify component renders
      const element = canvas.getByText("Click me");
      await expect(element).toBeInTheDocument();
      await expect(element).not.toBeDisabled();
    });

    await step("Hover interaction", async () => {
      const element = canvas.getByText("Click me");

      // Test hover
      await userEvent.hover(element);
      // Add assertions for hover state if applicable
    });

    await step("Click interaction", async () => {
      const element = canvas.getByText("Click me");

      // Test click
      await userEvent.click(element);
      // Add assertions for click behavior
    });

    await step("Keyboard navigation", async () => {
      const element = canvas.getByText("Click me");

      // Test keyboard interaction
      await userEvent.tab();
      await expect(element).toHaveFocus();

      // Test Enter key
      await userEvent.keyboard("{Enter}");
      // Add assertions for keyboard activation

      // Test Space key
      await userEvent.keyboard(" ");
      // Add assertions for space activation
    });

    await step("Accessibility", async () => {
      const element = canvas.getByText("Click me");

      // Verify ARIA attributes
      // await expect(element).toHaveAttribute('role', 'button');
      // await expect(element).toHaveAttribute('aria-label');
    });
  },
};

/**
 * Complex example with multiple features
 */
export const ComplexExample: Story = {
  render: () => {
    // For complex examples that need custom rendering
    return (
      <div style={{ display: "flex", gap: "1rem" }}>
        <ComponentName variant="primary" size="sm">
          Small Primary
        </ComponentName>
        <ComponentName variant="secondary" size="md">
          Medium Secondary
        </ComponentName>
        <ComponentName variant="ghost" size="lg">
          Large Ghost
        </ComponentName>
      </div>
    );
  },
};
```

## Compound Component Stories

For compound components, add stories like this:

```tsx
export const CompoundExample: Story = {
  render: () => (
    <ComponentName.Root>
      <ComponentName.Trigger>Open</ComponentName.Trigger>
      <ComponentName.Content>
        <ComponentName.Item value="1">Option 1</ComponentName.Item>
        <ComponentName.Item value="2">Option 2</ComponentName.Item>
        <ComponentName.Item value="3">Option 3</ComponentName.Item>
      </ComponentName.Content>
    </ComponentName.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Open dropdown", async () => {
      const trigger = canvas.getByText("Open");
      await userEvent.click(trigger);

      // Wait for content to appear
      await expect(canvas.getByText("Option 1")).toBeInTheDocument();
    });

    await step("Select option", async () => {
      const option = canvas.getByText("Option 2");
      await userEvent.click(option);

      // Verify selection
      // Add assertions based on expected behavior
    });
  },
};
```
