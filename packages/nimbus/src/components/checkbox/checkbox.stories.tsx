import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox, Stack } from "@commercetools/nimbus";
import { userEvent, within, expect, fn } from "storybook/test";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof Checkbox>;

/**
 * Base Story showcasing the default Checkbox state
 */
export const Base: Story = {
  args: {
    children: "Checkbox Label",
    onChange: fn(),
    // @ts-expect-error: data-testid is not a valid prop
    "data-testid": "test-checkbox",
    "aria-label": "test-label",
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const htmlLabel = canvasElement.querySelector(
      '[data-slot="root"]'
    ) as HTMLLabelElement;
    const displayLabel = canvasElement.querySelector(
      '[data-slot="label"]'
    ) as HTMLSpanElement;
    const checkboxElement = canvas.getByTestId("test-checkbox");
    const inputElement = checkboxElement.querySelector(
      "input"
    ) as HTMLInputElement;
    const onChange = args.onChange;

    await step(
      "Forwards data- & aria-attributes to the checkbox element",
      async () => {
        await expect(checkboxElement.tagName).toBe("LABEL");
        await expect(checkboxElement).toHaveAttribute(
          "data-testid",
          "test-checkbox"
        );
        await expect(inputElement).toHaveAttribute("aria-label", "test-label");
      }
    );

    await step("Can be focused with the keyboard", async () => {
      await userEvent.keyboard("{tab}");
      await expect(inputElement).toHaveFocus();
    });

    await step("Can be triggered with space-bar", async () => {
      await userEvent.keyboard(" ");
      await expect(onChange).toHaveBeenCalledTimes(1);
      await userEvent.keyboard(" ");
      await expect(onChange).toHaveBeenCalledTimes(2);
    });
    await step("Can be triggered with enter", async () => {
      await userEvent.keyboard("{enter}");
      await expect(onChange).toHaveBeenCalledTimes(3);
    });

    await step("Can be triggered by clicking on root & label", async () => {
      htmlLabel.click();
      await expect(onChange).toHaveBeenCalledTimes(4);
      displayLabel.click();
      await expect(onChange).toHaveBeenCalledTimes(5);
    });
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Checkbox",
    // @ts-expect-error: data-testid is not a valid prop
    "data-testid": "test-checkbox",
    isDisabled: true,
    isSelected: false,
    onChange: fn(),
  },

  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    const htmlLabel = canvasElement.querySelector(
      '[data-slot="root"]'
    ) as HTMLLabelElement;
    const checkboxElement = canvas.getByTestId("test-checkbox");

    await step("checkbox element has disabled state", async () => {
      await expect(checkboxElement).toHaveAttribute("data-disabled", "true");
    });

    await step("Can not be focused with the keyboard", async () => {
      await userEvent.keyboard("{tab}");
      await expect(checkboxElement).not.toHaveFocus();
    });

    await step(
      "Can not be triggered by clicking on the root- or label-element",
      async () => {
        //await expect(checkboxElement).toBeDisabled();
        await expect(checkboxElement).not.toBeChecked();
        htmlLabel.click();
        await expect(checkboxElement).not.toBeChecked();
        await expect(args.onChange).not.toBeCalled();
      }
    );
  },
};

export const Invalid: Story = {
  args: {
    children: "Invalid Checkbox",
    // @ts-expect-error: data-testid is not a valid prop
    "data-testid": "test-checkbox",
    isInvalid: true,
    onChange: fn(),
  },

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const checkboxElement = canvas.getByTestId("test-checkbox");
    await step("checkbox element has invalid state", async () => {
      await expect(checkboxElement).toHaveAttribute("data-invalid", "true");
    });
  },
};

export const InvisibleLabel: Story = {
  args: {
    // @ts-expect-error: data-testid is not a valid prop
    "data-testid": "test-checkbox",
    "aria-label": "Checkbox without label",
  },

  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    const checkboxElement = canvas.getByTestId("test-checkbox");
    const inputElement = checkboxElement.querySelector(
      "input"
    ) as HTMLInputElement;
    await step("Has alternative label", async () => {
      await expect(inputElement).toHaveAttribute(
        "aria-label",
        args["aria-label"]
      );
    });
  },
};

export const StyleProps: Story = {
  args: {
    children: "I have an inline margin of 40px",
    // @ts-expect-error: data-testid is not a valid prop
    "data-testid": "test-checkbox",
    "aria-label": "Checkbox without label",
    mx: "40px",
  },

  play: async ({ canvasElement, step }) => {
    const htmlLabel = canvasElement.querySelector(
      '[data-slot="root"]'
    ) as HTMLLabelElement;
    await step("Passes style props as expected", async () => {
      await expect(
        getComputedStyle(htmlLabel).getPropertyValue("margin-inline")
      ).toBe("40px");
    });
  },
};

/**
 * Smoke Test
 * This story attempts to capture all visual permutations
 */
export const SmokeTest: Story = {
  render: () => {
    return (
      <Stack gap="1000">
        {[false, true].map((isInvalid, j) => (
          <Stack direction="row" key={j}>
            {[false, true].map((isDisabled, i) => (
              <Stack
                width="1/2"
                key={i}
                direction="column"
                alignItems="flex-start"
              >
                <Checkbox
                  isSelected={false}
                  isDisabled={isDisabled}
                  isInvalid={isInvalid}
                >
                  Unchecked, {isDisabled ? "disabled" : "not disabled"},{" "}
                  {isInvalid ? "invalid" : ""}
                </Checkbox>

                <Checkbox
                  isDisabled={isDisabled}
                  isInvalid={isInvalid}
                  isSelected
                >
                  Checked, {isDisabled ? "disabled" : "not disabled"},{" "}
                  {isInvalid ? "invalid" : ""}
                </Checkbox>

                <Checkbox
                  isDisabled={isDisabled}
                  isInvalid={isInvalid}
                  isIndeterminate
                >
                  Indeterminate, {isDisabled ? "disabled" : "not disabled"},{" "}
                  {isInvalid ? "invalid" : ""}
                </Checkbox>
              </Stack>
            ))}
          </Stack>
        ))}
      </Stack>
    );
  },
};
