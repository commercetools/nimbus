import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Group, type GroupProps } from "@commercetools/nimbus";
import { within, expect } from "storybook/test";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof Group> = {
  title: "Components/Group",
  component: Group,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof Group>;

/**
 * Base story with comprehensive tests
 * Tests all the core functionality and accessibility requirements
 */
export const Base: Story = {
  args: {
    "aria-label": "Test group for accessibility",
    id: "test-group",
    className: "custom-class",
  } satisfies Partial<GroupProps>,
  render: (args) => (
    <Group {...args}>
      <Button>Action Button</Button>
    </Group>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    // Use a more reliable way to find the group element
    const group = canvas.getByRole("group", {
      name: "Test group for accessibility",
    });

    await step(
      "Group component renders its children within a container element",
      async () => {
        await expect(group).toBeInTheDocument();
        await expect(group).toHaveTextContent("Action Button");

        // Verify the button is rendered inside the group
        const button = canvas.getByRole("button", { name: "Action Button" });
        await expect(button).toBeInTheDocument();
        await expect(group).toContainElement(button);
      }
    );

    await step(
      "Group component applies role='group' to its root element",
      async () => {
        await expect(group).toHaveAttribute("role", "group");
      }
    );

    await step(
      "Group component passes through all props to the underlying DOM element",
      async () => {
        await expect(group).toHaveAttribute(
          "aria-label",
          "Test group for accessibility"
        );
        await expect(group).toHaveAttribute("id", "test-group");
        await expect(group).toHaveClass("custom-class");
      }
    );

    await step(
      "Group component is fully accessible and correctly identifies its contents as a related group to screen readers",
      async () => {
        // Test that the group has proper accessibility attributes
        await expect(group).toHaveAttribute("role", "group");
        await expect(group).toHaveAttribute(
          "aria-label",
          "Test group for accessibility"
        );
      }
    );
  },
};

/**
 * Group with multiple children
 * Tests that the Group component can properly contain and group multiple elements
 */
export const WithMultipleChildren: Story = {
  args: {
    "aria-label": "Button group",
  } satisfies Partial<GroupProps>,
  render: (args) => (
    <Group gap="100" {...args}>
      <Button>First</Button>
      <Button>Second</Button>
      <Button>Third</Button>
    </Group>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole("group", {
      name: "Button group",
    });

    await step("Group renders all children correctly", async () => {
      await expect(group).toHaveTextContent("First");
      await expect(group).toHaveTextContent("Second");
      await expect(group).toHaveTextContent("Third");

      // Verify all buttons are rendered and contained within the group
      const firstButton = canvas.getByRole("button", { name: "First" });
      const secondButton = canvas.getByRole("button", { name: "Second" });
      const thirdButton = canvas.getByRole("button", { name: "Third" });

      await expect(firstButton).toBeInTheDocument();
      await expect(secondButton).toBeInTheDocument();
      await expect(thirdButton).toBeInTheDocument();

      await expect(group).toContainElement(firstButton);
      await expect(group).toContainElement(secondButton);
      await expect(group).toContainElement(thirdButton);
    });

    await step(
      "Group maintains proper grouping semantics with multiple children",
      async () => {
        await expect(group).toHaveAttribute("role", "group");
        const groupByRole = canvas.getByRole("group", {
          name: "Button group",
        });
        await expect(groupByRole).toBeInTheDocument();
      }
    );
  },
};

/**
 * Group without explicit aria-label
 * Tests that the Group component works without explicit labeling but still provides group semantics
 */
export const WithoutAriaLabel: Story = {
  args: {} satisfies Partial<GroupProps>,
  render: (args) => (
    <Group {...args}>
      <Button>Unlabeled Group Button</Button>
    </Group>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole("group");

    await step("Group without aria-label still has proper role", async () => {
      await expect(group).toHaveAttribute("role", "group");
    });

    await step(
      "Group is still accessible via role even without explicit label",
      async () => {
        const groupByRole = canvas.getByRole("group");
        await expect(groupByRole).toBeInTheDocument();
        await expect(groupByRole).toHaveTextContent("Unlabeled Group Button");

        // Verify the button is rendered inside the group
        const button = canvas.getByRole("button", {
          name: "Unlabeled Group Button",
        });
        await expect(button).toBeInTheDocument();
        await expect(group).toContainElement(button);
      }
    );
  },
};
