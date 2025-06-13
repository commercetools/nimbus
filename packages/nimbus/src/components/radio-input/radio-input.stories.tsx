import type { Meta, StoryObj } from "@storybook/react";
import { RadioInputGroup } from "./radio-input";
import { Stack } from "@/components";
import { userEvent, within, expect, fn } from "@storybook/test";

import { FormField } from "@/components/form-field";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof RadioInputGroup.Root> = {
  title: "components/RadioInput",
  component: RadioInputGroup.Root,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof RadioInputGroup.Root>;

const onChange = fn();

/**
 * Base Story showcasing the default RadioInput state
 */
export const Base: Story = {
  args: {},
  render: () => (
    <Stack gap="1000">
      <RadioInputGroup.Root
        name="storybook-radio-base"
        onChange={onChange}
        data-testid="test-radio-input"
        aria-label="test-label"
      >
        <RadioInputGroup.Option value="no">No</RadioInputGroup.Option>
        <RadioInputGroup.Option value="yes">Yes</RadioInputGroup.Option>
      </RadioInputGroup.Root>
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
        await expect(htmlInput).toHaveAttribute("aria-label", "test-label");
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
      <RadioInputGroup.Root
        data-testid="test-radio-input"
        name="storybook-radio-disabled"
        onChange={onChange}
        isDisabled
      >
        <RadioInputGroup.Option value="no">No</RadioInputGroup.Option>
        <RadioInputGroup.Option value="yes">Yes</RadioInputGroup.Option>
      </RadioInputGroup.Root>
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
      <RadioInputGroup.Root
        data-testid="test-radio-input-disabled-selected"
        name="storybook-radio-disabled-selected"
        isDisabled
        defaultValue="yes"
      >
        <RadioInputGroup.Option value="no">No</RadioInputGroup.Option>
        <RadioInputGroup.Option value="yes">Yes</RadioInputGroup.Option>
      </RadioInputGroup.Root>
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
      <RadioInputGroup.Root
        name="storybook-radio-invalid"
        data-testid="test-radio-input"
        aria-label="test-label"
        isInvalid
        onChange={onChange}
      >
        <RadioInputGroup.Option value="no">No</RadioInputGroup.Option>
        <RadioInputGroup.Option value="yes">Yes</RadioInputGroup.Option>
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
      await expect(htmlInput).toHaveAttribute("data-invalid", "true");
    });
  },
};

export const InvalidAndSelected: Story = {
  render: () => (
    <Stack gap="1000">
      <RadioInputGroup.Root
        name="storybook-radio-invalid-selected"
        data-testid="test-radio-input-invalid-selected"
        aria-label="test-label"
        isInvalid
        defaultValue="yes"
        onChange={onChange}
      >
        <RadioInputGroup.Option value="no">No</RadioInputGroup.Option>
        <RadioInputGroup.Option value="yes">Yes</RadioInputGroup.Option>
      </RadioInputGroup.Root>
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
      <RadioInputGroup.Root
        name="storybook-radio-invalid-disabled"
        data-testid="test-radio-input-invalid-disabled"
        aria-label="test-label"
        isInvalid
        isDisabled
        defaultValue="yes"
        onChange={onChange}
      >
        <RadioInputGroup.Option value="no">No</RadioInputGroup.Option>
        <RadioInputGroup.Option value="yes">Yes</RadioInputGroup.Option>
      </RadioInputGroup.Root>
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
      <RadioInputGroup.Root
        name="storybook-radio-no-label"
        data-testid="test-radio-input"
        aria-label="test-label"
      >
        <RadioInputGroup.Option
          value="no"
          aria-label="No"
        ></RadioInputGroup.Option>
      </RadioInputGroup.Root>
    </Stack>
  ),
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    const htmlInput = canvas.getByTestId("test-radio-input");
    await step("Has alternative label", async () => {
      await expect(htmlInput).toHaveAttribute("aria-label", "test-label");
    });
  },
};

export const Orientation: Story = {
  render: () => (
    <Stack gap="1000">
      {/* Horizontal (default) */}
      <RadioInputGroup.Root name="storybook-radio-grouping-direction-horizontal">
        <RadioInputGroup.Option value="yes" key="input5">
          Yes
        </RadioInputGroup.Option>
        <RadioInputGroup.Option value="no" key="input6">
          No
        </RadioInputGroup.Option>
        <RadioInputGroup.Option value="probably" key="input7">
          Probably
        </RadioInputGroup.Option>
        <RadioInputGroup.Option value="meh" key="input8">
          Meh
        </RadioInputGroup.Option>
      </RadioInputGroup.Root>

      <hr />
      {/* Vertical */}
      <RadioInputGroup.Root
        name="storybook-radio-grouping-direction-vertical"
        orientation="vertical"
      >
        <RadioInputGroup.Option value="ja" key="input1-vert">
          Ja
        </RadioInputGroup.Option>
        <RadioInputGroup.Option value="nein " key="input2-vert">
          Nein
        </RadioInputGroup.Option>
        <RadioInputGroup.Option value="wahrscheinlich" key="input3-vert">
          Wahrscheinlich
        </RadioInputGroup.Option>
        <RadioInputGroup.Option value="naja" key="input4-vert">
          Naja
        </RadioInputGroup.Option>
      </RadioInputGroup.Root>
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
        <RadioInputGroup.Root name="artist">
          <RadioInputGroup.Option value="dreamy">
            Dreamy Dave
          </RadioInputGroup.Option>
          <RadioInputGroup.Option value="cure">The Cure</RadioInputGroup.Option>
          <RadioInputGroup.Option value="gaga">
            Lady Gaga
          </RadioInputGroup.Option>
        </RadioInputGroup.Root>
      </FormField.Input>
      <FormField.Description>Pick your favorite artist.</FormField.Description>
    </FormField.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    // FormField elements
    const formLabel = canvas.getByText("Favorite Artist");

    // RadioInputGroup elements
    const radioGroup = canvas.getByRole("radiogroup");
    const radioDreamyDave = canvas.getByLabelText("Dreamy Dave");
    const radioTheCure = canvas.getByLabelText("The Cure");
    const radioLadyGaga = canvas.getByLabelText("Lady Gaga");

    await step("FormField renders the label for the field", async () => {
      await expect(formLabel).toBeInTheDocument();
      await expect(formLabel).toBeVisible();
    });

    await step(
      "RadioInputGroup renders a radio group with correct ARIA attributes",
      async () => {
        const labelledby = radioGroup.getAttribute("aria-labelledby");
        const describedby = radioGroup.getAttribute("aria-describedby");
      }
    );

    await step(
      "RadioInputGroup renders all radio options as accessible inputs",
      async () => {
        await expect(radioDreamyDave).toBeInTheDocument();
        await expect(radioTheCure).toBeInTheDocument();
        await expect(radioLadyGaga).toBeInTheDocument();
      }
    );

    await step(
      "RadioInputGroup allows selecting only one option at a time",
      async () => {
        await userEvent.click(radioTheCure);
        await expect(radioTheCure).toBeChecked();
        await expect(radioDreamyDave).not.toBeChecked();
        await expect(radioLadyGaga).not.toBeChecked();
      }
    );
  },
};
