import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box, Stack, Switch, Tooltip } from "@commercetools/nimbus";
import { userEvent, within, expect, fn } from "storybook/test";
import { createRef, useState } from "react";

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Switch>;

/**
 * Uncontrolled use
 */
export const Base: Story = {
  args: {
    children: "Switch Label",
    onChange: fn(),
    // @ts-expect-error: data-testid is not a valid prop
    ["data-testid"]: "test-switch",
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const switchEl = canvas.getByTestId("test-switch");
    const switchLabel = canvas.getByText("Switch Label");
    const onChange = args.onChange;

    await step("Forwards data attributes to the input", async () => {
      await expect(switchEl).toHaveAttribute("data-testid", "test-switch");
    });

    await step("Can be focused with the keyboard", async () => {
      await userEvent.tab();
      await expect(switchEl).toHaveFocus();
    });

    await step("Can be toggled with space-bar", async () => {
      await userEvent.keyboard(" ");
      await expect(onChange).toHaveBeenCalledTimes(1);
    });

    await step("Can be toggled by clicking on the label", async () => {
      switchLabel.click();
      await expect(onChange).toHaveBeenCalledTimes(2);
    });
  },
};

/**
 * Tests for accessibility criteria
 */
export const Accessibility: Story = {
  args: {
    children: "Accessible Switch",
    // @ts-expect-error: data-testid is not a valid prop
    ["data-testid"]: "a11y-switch",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const switchEl = canvas.getByTestId("a11y-switch");
    const switchRoot = canvasElement.querySelector('[data-slot="root"]');

    await step("Has proper role", async () => {
      await expect(switchEl).toHaveAttribute("role", "switch");
    });

    await step("Supports keyboard navigation", async () => {
      // Test focus management
      await userEvent.tab();
      await expect(switchEl).toHaveFocus();

      // Test keyboard activation
      await userEvent.keyboard(" ");
      await expect(switchRoot?.getAttribute("data-selected")).toBe("true");

      // Test toggling back
      await userEvent.keyboard(" ");
      await expect(switchRoot?.getAttribute("data-selected")).toBe("false");
    });

    await step("Has accessible name", async () => {
      // Check that the input has an accessible name via the label
      await expect(switchEl).toHaveAccessibleName("Accessible Switch");
    });
  },
};

export const ControlledUse: Story = {
  args: {
    children: "Selected Switch",
    // @ts-expect-error: data-testid is not a valid prop
    ["data-testid"]: "controlled-switch",
  },
  render: (args) => {
    const [value, setValue] = useState<boolean>(false);

    return <Switch isSelected={value} onChange={setValue} {...args} />;
  },
  play: async ({ canvasElement, step }) => {
    const switchRoot = canvasElement.querySelector('[data-slot="root"]');

    if (!switchRoot) {
      throw new Error("Switch root not found");
    }

    await step("Is not in a selected state", async () => {
      await expect(switchRoot.getAttribute("data-selected")).toBe("false");
    });

    await step("Is in selected state", async () => {
      await userEvent.click(switchRoot);
      await expect(switchRoot.getAttribute("data-selected")).toBe("true");
    });
  },
};

/** Disabled (uniform opacity), folded out; off and on dim different track colors, so both shown. */
export const Disabled: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: { onChange: fn() },
  render: (args) => (
    <Stack direction="row" gap="600" alignItems="center">
      <Switch {...args} isDisabled>
        Off, disabled
      </Switch>
      <Switch {...args} isDisabled defaultSelected>
        On, disabled
      </Switch>
    </Stack>
  ),
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    const switches = canvas.getAllByRole("switch");
    const onChange = args.onChange;

    await step("Both switches are disabled", async () => {
      for (const el of switches) {
        await expect(el).toBeDisabled();
        await expect(el.closest('[data-slot="root"]')).toHaveAttribute(
          "data-disabled",
          "true"
        );
      }
    });

    await step("Cannot be focused or toggled", async () => {
      await userEvent.tab();
      for (const el of switches) {
        await expect(el).not.toHaveFocus();
      }
      switches[0].click();
      await expect(onChange).toHaveBeenCalledTimes(0);
    });
  },
};

/** No `data-invalid` recipe rule, so invalid looks identical to default: behavioral only, no snapshot. */
export const Invalid: Story = {
  args: {
    isInvalid: true,
    children: "Invalid Switch",
    // @ts-expect-error: data-testid is not a valid prop
    ["data-testid"]: "invalid-switch",
  },
  play: async ({ canvasElement, step }) => {
    const switchRoot = canvasElement.querySelector('[data-slot="root"]');

    await step("Is in invalid state", async () => {
      await expect(switchRoot).not.toBeNull();
      await expect(switchRoot?.getAttribute("data-invalid")).toBe("true");
    });
  },
};

export const WithDefaultSelected: Story = {
  args: {
    defaultSelected: true,
    children: "Default Selected Switch",
    // @ts-expect-error: data-testid is not a valid prop
    ["data-testid"]: "default-selected",
  },
  play: async ({ canvasElement, step }) => {
    // Check if the track element has data-selected="true"
    const switchTrack = canvasElement.querySelector('[data-slot="track"]');

    await step("Is initially selected from defaultSelected prop", async () => {
      await expect(switchTrack).not.toBeNull();
      await expect(switchTrack?.getAttribute("data-selected")).toBe("true");
    });
  },
};

/**
 * Demonstrate ref forwarding
 */
const switchRef = createRef<HTMLInputElement>();
export const WithRef: Story = {
  args: {
    children: "Switch with ref",
    // @ts-expect-error: data-testid is not a valid prop
    ["data-testid"]: "ref-switch",
  },
  render: (args) => <Switch ref={switchRef} {...args} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const switchEl = canvas.getByTestId("ref-switch");

    await step("Does accept ref's", async () => {
      await expect(switchRef.current).toBe(switchEl);
    });
  },
};

/**
 * Verifies that Switch can trigger a Tooltip when wrapped in Tooltip.Root
 */
export const ToggleWithTooltip: Story = {
  args: {
    children: "Switch with Tooltip",
    onChange: fn(),
  },
  render: (args) => (
    <Tooltip.Root delay={0} closeDelay={0}>
      <Switch {...args} />
      <Tooltip.Content>Switch tooltip text</Tooltip.Content>
    </Tooltip.Root>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );
    const switchRoot = canvasElement.querySelector('[data-slot="root"]');

    if (!switchRoot) {
      throw new Error("Switch root not found");
    }

    await step("Tooltip appears on focus", async () => {
      await userEvent.tab();
      await canvas.findByRole("tooltip", { name: "Switch tooltip text" });
    });

    await step("Switch still toggles while tooltip is shown", async () => {
      await userEvent.keyboard(" ");
      await expect(args.onChange).toHaveBeenCalledTimes(1);
      await expect(switchRoot.getAttribute("data-selected")).toBe("true");
    });
  },
};

/**
 * Snapshots the open tooltip on a switch. Focuses the trigger so the bubble is
 * visible in the frame; Chromatic captures the resting open state.
 */
export const DisplaysTooltip: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: {
    children: "Switch with Tooltip",
  },
  render: (args) => (
    <Tooltip.Root delay={0} closeDelay={0}>
      <Switch {...args} />
      <Tooltip.Content>Switch tooltip text</Tooltip.Content>
    </Tooltip.Root>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );
    await userEvent.tab();
    await canvas.findByRole("tooltip", { name: "Switch tooltip text" });
  },
};

/**
 * Verifies that a disabled Switch (via aria-disabled) can still trigger a Tooltip
 * but does not toggle its state.
 */
export const WithTooltipDisabled: Story = {
  args: {
    children: "Disabled Switch with Tooltip",
    onChange: fn(),
  },
  render: (args) => (
    <Tooltip.Root delay={0} closeDelay={0}>
      <Switch {...args} aria-disabled={true} />
      <Tooltip.Content>Disabled switch tooltip</Tooltip.Content>
    </Tooltip.Root>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );
    const switchRoot = canvasElement.querySelector('[data-slot="root"]');

    if (!switchRoot) {
      throw new Error("Switch root not found");
    }

    await step("Shows disabled styling", async () => {
      await expect(switchRoot.getAttribute("data-disabled")).toBe("true");
    });

    await step("Tooltip appears on focus", async () => {
      (switchRoot as HTMLElement).focus();
      await canvas.findByRole("tooltip", { name: "Disabled switch tooltip" });
    });

    await step("Switch does not toggle when clicked", async () => {
      await userEvent.click(switchRoot);
      await expect(args.onChange).toHaveBeenCalledTimes(0);
      await expect(switchRoot.getAttribute("data-selected")).toBe("false");
    });
  },
};

/** Size axis (sm / md); independent of on/off, so its own story (no matrix). */
export const Sizes: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: {
    children: "Switch Label",
  },
  render: (args) => (
    <Stack>
      <Box>
        <Switch size="sm" {...args} />
      </Box>
      <Box>
        <Switch size="md" {...args} />
      </Box>
    </Stack>
  ),
};

/** Track focus ring (keyboard-only via useFocusRing); one focus surface. */
export const Focused: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: { children: "Focused Switch" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole("switch")).toHaveFocus();
  },
};

/** On/off track surfaces (neutral vs primary + thumb position); independent of size. */
export const States: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack direction="row" gap="600" alignItems="center">
      <Switch>Off</Switch>
      <Switch defaultSelected>On</Switch>
    </Stack>
  ),
};
