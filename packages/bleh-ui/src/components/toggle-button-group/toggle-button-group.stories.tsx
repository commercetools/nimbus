import type { Meta, StoryObj } from "@storybook/react";
import { ToggleButtonGroup } from "./toggle-button-group";
import { Stack } from "../stack";
import { userEvent, within, expect, fn } from "@storybook/test";

/**
 * Storybook metadata configuration
 */
const meta: Meta<typeof ToggleButtonGroup> = {
  title: "components/ToggleButtonGroup",
  component: ToggleButtonGroup,
};

export default meta;

/**
 * Story type for TypeScript support
 */
type Story = StoryObj<typeof ToggleButtonGroup>;

const defaultChildren = (
  <>
    <ToggleButtonGroup.Button id="left">Left</ToggleButtonGroup.Button>
    <ToggleButtonGroup.Button id="center">Center</ToggleButtonGroup.Button>
    <ToggleButtonGroup.Button id="right">Right</ToggleButtonGroup.Button>
  </>
);

type ToggleButtonGroupSize = "md" | "xs"; // Replace with actual derived type if possible
type ToggleButtonGroupTone = "primary" | "critical" | "neutral"; // Replace with actual derived type

const sizes: ToggleButtonGroupSize[] = ["md", "xs"];
const tones: ToggleButtonGroupTone[] = ["primary", "critical", "neutral"];

/**
 * Base story
 *
 * Demonstrates the most basic implementation with interaction tests.
 */
export const Base: Story = {
  args: {
    size: "md",
    tone: "critical",
    children: defaultChildren,
    onSelectionChange: fn(),
    "aria-label": "Test Button Group",
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    // Get the group by its accessible name
    const group = canvas.getByRole("radiogroup", {
      name: /Test Button Group/i,
    });
    const buttons = within(group).getAllByRole("radio");
    const [leftButton, centerButton, rightButton] = buttons;
    const onSelectionChange = args.onSelectionChange as ReturnType<typeof fn>;

    await step("Initial Rendering", async () => {
      await expect(group).toBeInTheDocument();
      await expect(buttons).toHaveLength(3);
      // RAC ToggleButton uses aria-checked for selection state
      await expect(leftButton).toHaveAttribute("aria-checked", "false");
      await expect(centerButton).toHaveAttribute("aria-checked", "false");
      await expect(rightButton).toHaveAttribute("aria-checked", "false");
      await expect(onSelectionChange).not.toHaveBeenCalled();
    });

    await step(
      "Keyboard Navigation (Tab into group, Arrows between buttons)",
      async () => {
        await userEvent.tab(); // Tab into the group (focuses the first button)
        await expect(leftButton).toHaveFocus();

        await userEvent.keyboard("{ArrowRight}");
        await expect(centerButton).toHaveFocus();

        await userEvent.keyboard("{ArrowRight}");
        await expect(rightButton).toHaveFocus();

        await userEvent.keyboard("{ArrowLeft}");
        await expect(centerButton).toHaveFocus();
      }
    );

    await step("Keyboard Selection (Space)", async () => {
      // centerButton currently has focus
      await userEvent.keyboard("{ }"); // Press Space
      await expect(centerButton).toHaveAttribute("aria-checked", "true");
      await expect(leftButton).toHaveAttribute("aria-checked", "false"); // Should deselect others in single-select mode
      await expect(onSelectionChange).toHaveBeenCalledTimes(1);

      // Select another button
      await userEvent.keyboard("{ArrowLeft}"); // Move focus to leftButton
      await expect(leftButton).toHaveFocus();
      await userEvent.keyboard("{ }"); // Press Space
      await expect(leftButton).toHaveAttribute("aria-checked", "true");
      await expect(centerButton).toHaveAttribute("aria-checked", "false");
      await expect(onSelectionChange).toHaveBeenCalledTimes(2);

      // Deselect by pressing again (common toggle behavior)
      await userEvent.keyboard("{ }"); // Press Space
      await expect(leftButton).toHaveAttribute("aria-checked", "false");
      await expect(onSelectionChange).toHaveBeenCalledTimes(3);
    });

    // Reset selection for next step
    await userEvent.click(leftButton); // Click to select 'left'
    onSelectionChange.mockClear(); // Clear mock history

    await step("Mouse Selection", async () => {
      await userEvent.click(rightButton);
      await expect(rightButton).toHaveAttribute("aria-checked", "true");
      await expect(leftButton).toHaveAttribute("aria-checked", "false");
      await expect(centerButton).toHaveAttribute("aria-checked", "false");
      await expect(onSelectionChange).toHaveBeenCalledTimes(1);

      // Click again to deselect
      await userEvent.click(rightButton);
      await expect(rightButton).toHaveAttribute("aria-checked", "false");
      await expect(onSelectionChange).toHaveBeenCalledTimes(2);
    });
  },
};

/**
 * Disabled Group Story
 *
 * Tests behavior when the entire group is disabled, with one button visually selected.
 */
export const DisabledGroup: Story = {
  args: {
    ...Base.args, // Reuse args from Base
    isDisabled: true,
    selectedKeys: ["center"], // Set the middle button as initially selected
    onSelectionChange: fn(),
    "aria-label": "Disabled Test Group",
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole("radiogroup", {
      name: /Disabled Test Group/i,
    });
    const buttons = within(group).getAllByRole("radio");
    const [leftButton, centerButton, rightButton] = buttons;
    const onSelectionChange = args.onSelectionChange as ReturnType<typeof fn>;

    await step("Initial Render shows default selection visually", async () => {
      // Check that the defaultValue is reflected in aria-checked state
      await expect(centerButton).toHaveAttribute("aria-checked", "true");
      await expect(leftButton).toHaveAttribute("aria-checked", "false");
      await expect(rightButton).toHaveAttribute("aria-checked", "false");
    });

    await step("Buttons are functionally disabled", async () => {
      await expect(leftButton).toBeDisabled();
      await expect(centerButton).toBeDisabled();
      await expect(rightButton).toBeDisabled();
    });

    await step("Cannot focus buttons via keyboard", async () => {
      // Try tabbing - focus should skip the disabled group
      await userEvent.tab();
      await expect(leftButton).not.toHaveFocus();
      await expect(centerButton).not.toHaveFocus();
      await expect(rightButton).not.toHaveFocus();
    });

    await step("Cannot change selection via click", async () => {
      // Click the selected button
      await userEvent.click(centerButton);
      // State should not change
      await expect(centerButton).toHaveAttribute("aria-checked", "true");
      await expect(onSelectionChange).not.toHaveBeenCalled();

      // Click a non-selected button
      await userEvent.click(leftButton);
      // State should not change
      await expect(leftButton).toHaveAttribute("aria-checked", "false");
      await expect(centerButton).toHaveAttribute("aria-checked", "true"); // Still selected
      await expect(onSelectionChange).not.toHaveBeenCalled();
    });
  },
};

/**
 * Default Selection Story
 *
 * Tests behavior when a value is pre-selected.
 */
export const DefaultSelection: Story = {
  args: {
    ...Base.args, // Reuse args from Base
    selectedKeys: ["center"], // Set the middle button as initially selected
    onSelectionChange: fn(), // Ensure separate mock for this story
    "aria-label": "Default Selection Test Group",
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole("radiogroup", {
      name: /Default Selection Test Group/i,
    });
    const buttons = within(group).getAllByRole("radio");
    const [leftButton, centerButton, rightButton] = buttons;
    const onSelectionChange = args.onSelectionChange as ReturnType<typeof fn>;

    await step("Initial Render shows default selection", async () => {
      await expect(centerButton).toHaveAttribute("aria-checked", "true");
      await expect(leftButton).toHaveAttribute("aria-checked", "false");
      await expect(rightButton).toHaveAttribute("aria-checked", "false");
    });

    await step("Can change selection via click", async () => {
      await userEvent.click(leftButton);
      // await expect(leftButton).toHaveAttribute("aria-checked", "true");
      // await expect(centerButton).toHaveAttribute("aria-checked", "false");
      await expect(onSelectionChange).toHaveBeenCalledTimes(1);
      await expect(onSelectionChange).toHaveBeenLastCalledWith(
        new Set(["left"])
      );
    });
  },
};

/**
 * Showcase Sizes - Minimal test focusing on rendering
 */
export const Sizes: Story = {
  render: (args) => (
    <Stack direction="row" gap="400" alignItems="center">
      {sizes.map((size) => (
        <ToggleButtonGroup
          key={size}
          {...args}
          size={size}
          aria-label={`Size ${size} Group`}
        >
          {defaultChildren}
        </ToggleButtonGroup>
      ))}
    </Stack>
  ),
  args: {
    onSelectionChange: fn(), // Add mock even if not testing interaction heavily here
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    // Simple check: ensure both groups render
    await step("Render groups for each size", async () => {
      const groups = canvas.getAllByRole("radiogroup");
      await expect(groups).toHaveLength(sizes.length);
      // Optionally check a button exists in each
      await expect(
        within(groups[0]).getAllByRole("radio").length
      ).toBeGreaterThan(0);
      await expect(
        within(groups[1]).getAllByRole("radio").length
      ).toBeGreaterThan(0);
    });
  },
};

/**
 * Showcase Tones - Minimal test focusing on rendering
 */
export const Tones: Story = {
  render: (args) => (
    <Stack>
      {tones.map((tone) => (
        <ToggleButtonGroup
          key={tone}
          {...args}
          tone={tone}
          aria-label={`Tone ${tone} Group`}
        >
          {defaultChildren}
        </ToggleButtonGroup>
      ))}
    </Stack>
  ),
  args: {
    size: "md",
    onSelectionChange: fn(),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    // Ensure all groups render
    await step("Render groups for each tone", async () => {
      const groups = canvas.getAllByRole("radiogroup");
      await expect(groups).toHaveLength(tones.length);
      // Optionally check a button exists in each
      await expect(
        within(groups[0]).getAllByRole("radio").length
      ).toBeGreaterThan(0);
      await expect(
        within(groups[1]).getAllByRole("radio").length
      ).toBeGreaterThan(0);
      await expect(
        within(groups[2]).getAllByRole("radio").length
      ).toBeGreaterThan(0);
    });
  },
};
