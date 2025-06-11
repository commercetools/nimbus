import type { Meta, StoryObj } from "@storybook/react";
import { RadioInputGroup } from "./radio-input-group";
import { Stack } from "@/components";
import { userEvent, within, expect, fn } from "@storybook/test";
import type { RadioInputGroupOptionProps } from "./radio-input-group.types";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof RadioInputGroup.Root> = {
  title: "components/RadioInputGroup",
  component: RadioInputGroup.Root,
  argTypes: {
    direction: {
      options: ["row", "column"],
      control: { type: "radio" },
    },
  },
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<RadioInputGroupOptionProps>;

const onChange = fn();

/**
 * Base Story showcasing the default RadioInput state
 */
export const Base: Story = {
  args: {
    children: "Radio Label",

    // @ts-expect-error: data-testid is not a valid prop
    "data-testid": "test-radio-input",
    "aria-label": "test-label",
  },
  render: (args) => (
    <Stack gap="1000">
      <RadioInputGroup.Root name="storybook-radio-base" onChange={onChange}>
        <RadioInputGroup.Option {...args} />
      </RadioInputGroup.Root>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const htmlLabel = canvasElement.querySelector(
      '[data-slot="root"]'
    ) as HTMLLabelElement;
    const displayLabel = canvasElement.querySelector(
      '[data-slot="label"]'
    ) as HTMLSpanElement;
    const htmlInput = canvas.getByTestId("test-radio-input");

    await step(
      "Forwards data- & aria-attributes to the actual html-input",
      async () => {
        await expect(htmlInput.tagName).toBe("INPUT");
        await expect(htmlInput).toHaveAttribute(
          "data-testid",
          "test-radio-input"
        );
        await expect(htmlInput).toHaveAttribute("aria-label", "test-label");
      }
    );

    await step("Can be focused with the keyboard", async () => {
      await userEvent.keyboard("{tab}");
      await expect(htmlInput).toHaveFocus();
    });

    await step("Can be triggered with space-bar", async () => {
      await expect(htmlInput).toHaveFocus();
      await userEvent.keyboard(" ");
      await expect(onChange).toHaveBeenCalledTimes(1);
    });

    await step("Can not be triggered with enter", async () => {
      await userEvent.keyboard("{enter}");
      await expect(onChange).toHaveBeenCalledTimes(1);
    });

    await step("Can be triggered by clicking on the root label", async () => {
      htmlLabel.click();
      await expect(onChange).toHaveBeenCalledTimes(1);
    });

    await step(
      "Clicking the display label does not trigger onChange again",
      async () => {
        displayLabel.click();
        await expect(onChange).toHaveBeenCalledTimes(1);
      }
    );
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Radio Input",
    // @ts-expect-error: data-testid is not a valid prop
    "data-testid": "test-radio-input",
    isDisabled: true,
    isSelected: false,
  },
  render: (args) => (
    <Stack gap="1000">
      <RadioInputGroup.Root name="storybook-radio-disabled" onChange={onChange}>
        <RadioInputGroup.Option {...args} />
      </RadioInputGroup.Root>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const htmlLabel = canvasElement.querySelector(
      '[data-slot="root"]'
    ) as HTMLLabelElement;
    const htmlInput = canvas.getByTestId("test-radio-input");

    await step("radioInput has html 'disabled' attribute", async () => {
      await expect(htmlInput).toHaveAttribute("disabled");
    });

    await step("Can not be focused with the keyboard", async () => {
      await userEvent.keyboard("{tab}");
      await expect(htmlInput).not.toHaveFocus();
    });

    await step(
      "Can not be triggered by clicking on the root- or label-element",
      async () => {
        await expect(htmlInput).not.toBeChecked();
        htmlLabel.click();
        await expect(htmlInput).not.toBeChecked();
        await expect(onChange).not.toBeCalled();
      }
    );
  },
};

export const Invalid: Story = {
  args: {
    // isInvalid is passed to RadioInputGroup.Option for styling only (e.g., red border).
    // Accessibility (aria-invalid) is handled on radioGroup, not on individual RadioInputGroupOptions
    children: "Invalid Radio Input",
    // @ts-expect-error: data-testid is not a valid prop
    "data-testid": "test-radio-input",
    isInvalid: true,
  },
  render: (args) => (
    <Stack gap="1000">
      <RadioInputGroup.Root
        name="storybook-radio-invalid"
        isInvalid
        onChange={onChange}
      >
        <RadioInputGroup.Option {...args} />
      </RadioInputGroup.Root>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const radioGroup = canvas.getByRole("radiogroup");
    const htmlInput = canvas.getByTestId("test-radio-input");

    await step(
      "radioGroup receives aria-invalid for accessibility",
      async () => {
        await expect(radioGroup).toHaveAttribute("aria-invalid", "true");
      }
    );

    await step("radioInput receives data-invalid for styling", async () => {
      // Checks for data-invalid on the closest parent (data-slot="root")
      const root = htmlInput.closest('[data-slot="root"]');
      await expect(root).toHaveAttribute("data-invalid", "true");
    });
  },
};

export const InvalidAndDisabled: Story = {
  args: {
    children: "Invalid & Disabled Radio Input",
    // @ts-expect-error: data-testid is not a valid prop
    "data-testid": "test-radio-input",
    isInvalid: true,
    isDisabled: true,
  },
  render: (args) => (
    <Stack gap="1000">
      <RadioInputGroup.Root
        name="storybook-radio-invalid-disabled"
        isInvalid
        isDisabled
        onChange={onChange}
      >
        <RadioInputGroup.Option {...args} />
      </RadioInputGroup.Root>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const radioGroup = canvas.getByRole("radiogroup");
    const htmlInput = canvas.getByTestId("test-radio-input");

    await step(
      "radioGroup receives aria-invalid for accessibility",
      async () => {
        await expect(radioGroup).toHaveAttribute("aria-invalid", "true");
      }
    );

    await step("radioInput receives data-invalid for styling", async () => {
      const root = htmlInput.closest('[data-slot="root"]');
      await expect(root).toHaveAttribute("data-invalid", "true");
    });

    await step("radioInput is disabled", async () => {
      await expect(htmlInput).toHaveAttribute("disabled");
      await userEvent.keyboard("{tab}");
      await expect(htmlInput).not.toHaveFocus();
    });
  },
};

export const InvisibleLabel: Story = {
  args: {
    // @ts-expect-error: data-testid is not a valid prop
    "data-testid": "test-radio-input",
    "aria-label": "Radio Input without label",
  },
  render: (args) => (
    <Stack gap="1000">
      <RadioInputGroup.Root name="storybook-radio-no-label">
        <RadioInputGroup.Option {...args} />
      </RadioInputGroup.Root>
    </Stack>
  ),
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    const htmlInput = canvas.getByTestId("test-radio-input");
    await step("Has alternative label", async () => {
      await expect(htmlInput).toHaveAttribute("aria-label", args["aria-label"]);
    });
  },
};

export const Direction: StoryObj<typeof RadioInputGroup.Root> = {
  args: {
    name: "storybook-radio-grouping-direction",
  },
  render: (args) => (
    <RadioInputGroup.Root {...args}>
      <RadioInputGroup.Option value="option1" key="option1">
        Option 1
      </RadioInputGroup.Option>
      <RadioInputGroup.Option value="option2" key="option2">
        Option 2
      </RadioInputGroup.Option>
      <RadioInputGroup.Option value="option3" key="option3">
        Option 3
      </RadioInputGroup.Option>
      <RadioInputGroup.Option value="option4" key="option4">
        Option 4
      </RadioInputGroup.Option>
    </RadioInputGroup.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const radioInputs = [
      canvas.getByLabelText("Option 1") as HTMLInputElement,
      canvas.getByLabelText("Option 2") as HTMLInputElement,
      canvas.getByLabelText("Option 3") as HTMLInputElement,
      canvas.getByLabelText("Option 4") as HTMLInputElement,
    ];

    for (const [i, radio] of radioInputs.entries()) {
      await step(
        `Select radioInput ${i + 1} and assert only it is selected`,
        async () => {
          await userEvent.click(radio);
          const checkedRadioInputs = radioInputs.filter((r) => r.checked);
          await expect(checkedRadioInputs).toHaveLength(1);
          await expect(checkedRadioInputs[0]).toBe(radio);
        }
      );
    }
  },
};
