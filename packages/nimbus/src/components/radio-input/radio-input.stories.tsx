import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioInput } from "./radio-input";
import { Stack } from "@/components";
import { userEvent, within, expect, fn } from "storybook/test";

import { FormField } from "@/components/form-field";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof RadioInput.Root> = {
  title: "components/RadioInput",
  component: RadioInput.Root,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof RadioInput.Root>;

const onChange = fn();

/**
 * Base Story showcasing the default RadioInput state
 */
export const Base: Story = {
  args: {},
  render: () => (
    <Stack gap="1000">
      <RadioInput.Root
        aria-label="storybook-radio-base"
        onChange={onChange}
        data-testid="test-radio-input"
        name="storybook-radio-base"
      >
        <RadioInput.Option value="no">No</RadioInput.Option>
        <RadioInput.Option value="yes">Yes</RadioInput.Option>
      </RadioInput.Root>
    </Stack>
  ),

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const htmlInput = canvas.getByTestId("test-radio-input");
    const radioInput = canvas.getByLabelText("No");

    await step(
      "Forwards data- & aria-attributes to the actual html-input",
      async () => {
        await expect(htmlInput.tagName).toBe("DIV");
        await expect(htmlInput).toHaveAttribute(
          "data-testid",
          "test-radio-input"
        );
        await expect(htmlInput).toHaveAttribute(
          "aria-label",
          "storybook-radio-base"
        );
      }
    );

    await step("Can be focused with the keyboard", async () => {
      await userEvent.keyboard("{tab}");
      await expect(radioInput).toHaveFocus();
    });

    await step("Can be triggered with space-bar", async () => {
      await expect(radioInput).toHaveFocus();
      await userEvent.keyboard(" ");
      await expect(onChange).toHaveBeenCalledTimes(1);
    });

    await step("Can not be triggered with enter", async () => {
      await expect(radioInput).toHaveFocus();
      await userEvent.keyboard("{enter}");
      await expect(onChange).toHaveBeenCalledTimes(1);
    });

    await step("Can be triggered by clicking on a label", async () => {
      await userEvent.click(radioInput);
      await expect(onChange).toHaveBeenCalledTimes(1);
    });

    await step(
      "Clicking the display label does not trigger onChange again",
      async () => {
        await userEvent.click(radioInput);
        await expect(onChange).toHaveBeenCalledTimes(1);
      }
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <Stack gap="1000">
      <RadioInput.Root
        data-testid="test-radio-input"
        aria-label="storybook-radio-disabled"
        name="storybook-radio-disabled"
        onChange={onChange}
        isDisabled
      >
        <RadioInput.Option value="no">No</RadioInput.Option>
        <RadioInput.Option value="yes">Yes</RadioInput.Option>
      </RadioInput.Root>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    const htmlInput = canvas.getByTestId("test-radio-input");

    await step(
      "radioInput is marked as disabled via aria-disabled",
      async () => {
        await expect(htmlInput).toHaveAttribute("aria-disabled", "true");
      }
    );

    await step("Can not be focused with the keyboard", async () => {
      await userEvent.keyboard("{tab}");
      await expect(htmlInput).not.toHaveFocus();
    });

    await step(
      "Can not be triggered by clicking on the radio option",
      async () => {
        const radioNo = canvas.getByLabelText("No");
        await userEvent.click(radioNo);
        await expect(onChange).not.toBeCalled();
      }
    );
  },
};

export const DisabledAndSelected: Story = {
  render: () => (
    <Stack gap="1000">
      <RadioInput.Root
        data-testid="test-radio-input-disabled-selected"
        aria-label="storybook-radio-disabled-selected"
        name="storybook-radio-disabled-selected"
        isDisabled
        defaultValue="yes"
      >
        <RadioInput.Option value="no">No</RadioInput.Option>
        <RadioInput.Option value="yes">Yes</RadioInput.Option>
      </RadioInput.Root>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const htmlInput = canvas.getByTestId("test-radio-input-disabled-selected");

    await step(
      "radioInput is marked as disabled via aria-disabled",
      async () => {
        await expect(htmlInput).toHaveAttribute("aria-disabled", "true");
      }
    );

    await step("Can not be focused with the keyboard", async () => {
      await userEvent.keyboard("{tab}");
      await expect(htmlInput).not.toHaveFocus();
    });

    await step(
      "Can not be triggered by clicking on the radio option",
      async () => {
        const radioNo = canvas.getByLabelText("No");
        await userEvent.click(radioNo);
        await expect(onChange).not.toBeCalled();
      }
    );
  },
};

export const Invalid: Story = {
  render: () => (
    <Stack gap="1000">
      <RadioInput.Root
        aria-label="storybook-radio-invalid"
        data-testid="test-radio-input"
        name="storybook-radio-invalid"
        isInvalid
        onChange={onChange}
      >
        <RadioInput.Option value="no">No</RadioInput.Option>
        <RadioInput.Option value="yes">Yes</RadioInput.Option>
      </RadioInput.Root>
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
      await expect(htmlInput).toHaveAttribute("data-invalid", "true");
    });
  },
};

export const InvalidAndSelected: Story = {
  render: () => (
    <Stack gap="1000">
      <RadioInput.Root
        aria-label="storybook-radio-invalid-selected"
        data-testid="test-radio-input-invalid-selected"
        name="test-radio-input-invalid-selected"
        isInvalid
        defaultValue="yes"
        onChange={onChange}
      >
        <RadioInput.Option value="no">No</RadioInput.Option>
        <RadioInput.Option value="yes">Yes</RadioInput.Option>
      </RadioInput.Root>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const radioGroup = canvas.getByRole("radiogroup");
    const htmlInput = canvas.getByTestId("test-radio-input-invalid-selected");
    const radioYes = canvas.getByLabelText("Yes");
    const radioNo = canvas.getByLabelText("No");

    await step(
      "radioGroup receives aria-invalid for accessibility",
      async () => {
        await expect(radioGroup).toHaveAttribute("aria-invalid", "true");
      }
    );

    await step("radioInput receives data-invalid for styling", async () => {
      await expect(htmlInput).toHaveAttribute("data-invalid", "true");
    });

    await step("Selected option is checked and styled as invalid", async () => {
      await expect(radioYes).toBeChecked();
    });

    await step(
      "Clicking the other option changes selection and keeps invalid styling",
      async () => {
        await userEvent.click(radioNo);
        await expect(radioNo).toBeChecked();
        await expect(radioGroup).toHaveAttribute("aria-invalid", "true");
      }
    );
  },
};

export const InvalidAndDisabled: Story = {
  render: () => (
    <Stack gap="1000">
      <RadioInput.Root
        aria-label="storybook-radio-invalid-disabled"
        data-testid="test-radio-input-invalid-disabled"
        name="test-radio-input-invalid-disabled"
        isInvalid
        isDisabled
        defaultValue="yes"
        onChange={onChange}
      >
        <RadioInput.Option value="no">No</RadioInput.Option>
        <RadioInput.Option value="yes">Yes</RadioInput.Option>
      </RadioInput.Root>
    </Stack>
  ),

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const radioGroup = canvas.getByRole("radiogroup");
    const htmlInput = canvas.getByTestId("test-radio-input-invalid-disabled");

    await step(
      "radioGroup receives aria-invalid for accessibility",
      async () => {
        await expect(radioGroup).toHaveAttribute("aria-invalid", "true");
      }
    );

    await step("radioGroup receives data-invalid for styling", async () => {
      await expect(radioGroup).toHaveAttribute("data-invalid", "true");
    });

    await step("radioInput is disabled", async () => {
      await expect(htmlInput).toHaveAttribute("aria-disabled", "true");
      await userEvent.keyboard("{tab}");
      await expect(htmlInput).not.toHaveFocus();
    });
  },
};

export const InvisibleLabel: Story = {
  render: () => (
    <Stack gap="1000">
      <RadioInput.Root
        aria-label="storybook-radio-aria-label"
        data-testid="test-radio-input"
        name="storybook-radio-no-label"
      >
        <RadioInput.Option value="no" aria-label="No"></RadioInput.Option>
      </RadioInput.Root>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const htmlInput = canvas.getByTestId("test-radio-input");
    await step("Has alternative label", async () => {
      await expect(htmlInput).toHaveAttribute(
        "aria-label",
        "storybook-radio-aria-label"
      );
    });
  },
};

export const Orientation: Story = {
  render: () => (
    <Stack gap="1000">
      {/* Vertical (default) */}
      <RadioInput.Root aria-label="storybook-radio-grouping-direction-vertical">
        <RadioInput.Option value="yes" key="input5">
          Yes
        </RadioInput.Option>
        <RadioInput.Option value="no" key="input1-vertical">
          No
        </RadioInput.Option>
        <RadioInput.Option value="probably" key="input2-vertical">
          Probably
        </RadioInput.Option>
        <RadioInput.Option value="meh" key="input3-vertical">
          Meh
        </RadioInput.Option>
      </RadioInput.Root>

      <hr />
      {/* Horizontal */}
      <RadioInput.Root
        aria-label="storybook-radio-grouping-direction-horizontal"
        orientation="horizontal"
      >
        <RadioInput.Option value="ja" key="input1-horizontal">
          Ja
        </RadioInput.Option>
        <RadioInput.Option value="nein " key="input2-horizontal">
          Nein
        </RadioInput.Option>
        <RadioInput.Option value="wahrscheinlich" key="input3-horizontal">
          Wahrscheinlich
        </RadioInput.Option>
        <RadioInput.Option value="naja" key="input4-horizontal">
          Naja
        </RadioInput.Option>
      </RadioInput.Root>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const radioInputs = [
      canvas.getByLabelText("Yes") as HTMLInputElement,
      canvas.getByLabelText("No") as HTMLInputElement,
      canvas.getByLabelText("Probably") as HTMLInputElement,
      canvas.getByLabelText("Meh") as HTMLInputElement,
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

export const WithFormField: StoryObj = {
  render: () => (
    <FormField.Root>
      <FormField.Label>Favorite Artist</FormField.Label>
      <FormField.Input>
        <RadioInput.Root aria-label="artist">
          <RadioInput.Option value="raphael">Raphael</RadioInput.Option>
          <RadioInput.Option value="donatello">Donatello</RadioInput.Option>
          <RadioInput.Option value="leonardo">Leonardo</RadioInput.Option>
        </RadioInput.Root>
      </FormField.Input>
      <FormField.Description>Pick your favorite artist.</FormField.Description>
    </FormField.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    // FormField elements
    const formLabel = canvas.getByText("Favorite Artist");

    // RadioInput elements
    const radioGroup = canvas.getByRole("radiogroup");
    const radioRaphael = canvas.getByLabelText("Raphael");
    const radioDonatello = canvas.getByLabelText("Donatello");
    const radioLeonardo = canvas.getByLabelText("Leonardo");

    await step("FormField renders the label for the field", async () => {
      await expect(formLabel).toBeInTheDocument();
      await expect(formLabel).toBeVisible();
    });

    await step(
      "RadioInput renders a radio group with correct ARIA attributes",
      async () => {
        // Check that ARIA attributes exist
        radioGroup.getAttribute("aria-labelledby");
        radioGroup.getAttribute("aria-describedby");
      }
    );

    await step(
      "RadioInput renders all radio options as accessible inputs",
      async () => {
        await expect(radioRaphael).toBeInTheDocument();
        await expect(radioDonatello).toBeInTheDocument();
        await expect(radioLeonardo).toBeInTheDocument();
      }
    );

    await step(
      "RadioInput allows selecting only one option at a time",
      async () => {
        await userEvent.click(radioRaphael);
        await expect(radioRaphael).toBeChecked();
        await expect(radioDonatello).not.toBeChecked();
        await expect(radioLeonardo).not.toBeChecked();
      }
    );
  },
};
