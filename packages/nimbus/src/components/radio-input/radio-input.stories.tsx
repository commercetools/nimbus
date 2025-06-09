import type { Meta, StoryObj } from "@storybook/react";
import { RadioInput } from "./radio-input";
import { RadioGroup } from "./radio-group";
import { Stack } from "@/components";
import { userEvent, within, expect, fn } from "@storybook/test";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof RadioInput> = {
  title: "components/RadioInput",
  component: RadioInput,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof RadioInput>;

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
      <RadioGroup name="storybook-radio-base" onChange={onChange}>
        <RadioInput {...args} />
      </RadioGroup>
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
    onChange: fn(),
  },
  render: (args) => (
    <Stack gap="1000">
      <RadioGroup name="storybook-radio-disabled">
        <RadioInput {...args} />
      </RadioGroup>
    </Stack>
  ),
  play: async ({ canvasElement, step, args }) => {
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
        await expect(args.onChange).not.toBeCalled();
      }
    );
  },
};

export const Invalid: Story = {
  args: {
    // isInvalid is passed to RadioInput for styling only (e.g., red border).
    // Accessibility (aria-invalid) is handled on radioGroup, not on individual radioInputs
    children: "Invalid Radio Input",
    // @ts-expect-error: data-testid is not a valid prop
    "data-testid": "test-radio-input",
    onChange: fn(),
    isInvalid: true,
  },
  render: (args) => (
    <Stack gap="1000">
      <RadioGroup name="storybook-radio-invalid" isInvalid>
        <RadioInput {...args} />
      </RadioGroup>
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
    onChange: fn(),
    isInvalid: true,
    isDisabled: true,
  },
  render: (args) => (
    <Stack gap="1000">
      <RadioGroup name="storybook-radio-invalid-disabled" isInvalid isDisabled>
        <RadioInput {...args} />
      </RadioGroup>
    </Stack>
  ),
  play: async ({ canvasElement, step, args }) => {
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
      <RadioGroup name="storybook-radio-no-label">
        <RadioInput {...args} />
      </RadioGroup>
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

export const Group: Story = {
  args: {},
  render: () => (
    <RadioGroup name="storybook-radio-grouping-horizontal">
      <Stack direction="row" gap="800">
        <RadioInput value="option1">Option 1</RadioInput>
        <RadioInput value="option2">Option 2</RadioInput>
        <RadioInput value="option3">Option 3</RadioInput>
        <RadioInput value="option4">Option 4</RadioInput>
      </Stack>
    </RadioGroup>
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
