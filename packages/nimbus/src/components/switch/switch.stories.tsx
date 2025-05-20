import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./switch";
import { Stack, Box } from "@/components";
import { userEvent, within, expect, fn } from "@storybook/test";
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
    const switchRoot = canvasElement.querySelector('[slot="root"]');

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

export const Disabled: Story = {
  args: {
    isDisabled: true,
    children: "Disabled Switch",
    onChange: fn(),
    // @ts-expect-error: data-testid is not a valid prop
    ["data-testid"]: "disabled-switch",
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    const switchEl = canvas.getByTestId("disabled-switch");
    const switchRoot = canvasElement.querySelector('[slot="root"]');
    const onChange = args.onChange;

    await step("Has disabled attribute", async () => {
      await expect(switchEl).toHaveAttribute("disabled");
      await expect(switchRoot?.getAttribute("data-disabled")).toBe("true");
    });

    await step("Cannot be focused or toggled", async () => {
      await userEvent.tab();
      await expect(switchEl).not.toHaveFocus();

      switchEl.click();
      await expect(onChange).toHaveBeenCalledTimes(0);
    });
  },
};

export const Invalid: Story = {
  args: {
    isInvalid: true,
    children: "Invalid Switch",
    // @ts-expect-error: data-testid is not a valid prop
    ["data-testid"]: "invalid-switch",
  },
  play: async ({ canvasElement, step }) => {
    const switchRoot = canvasElement.querySelector('[slot="root"]');

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
    const switchTrack = canvasElement.querySelector('[slot="track"]');

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

export const Sizes: Story = {
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
