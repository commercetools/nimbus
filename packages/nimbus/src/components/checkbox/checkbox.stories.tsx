/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./checkbox";
import { Stack } from "@/components";
import { userEvent, within, expect, fn } from "@storybook/test";

const meta: Meta<typeof Checkbox> = {
  title: "components/Checkbox",
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
    const htmlInput = canvas.getByTestId("test-checkbox");
    const onChange = args.onChange;

    await step(
      "Forwards data- & aria-attributes to the actual html-input",
      async () => {
        await expect(htmlInput.tagName).toBe("INPUT");
        await expect(htmlInput).toHaveAttribute("data-testid", "test-checkbox");
        await expect(htmlInput).toHaveAttribute("aria-label", "test-label");
      }
    );

    await step("Can be focused with the keyboard", async () => {
      await userEvent.keyboard("{tab}");
      await expect(htmlInput).toHaveFocus();
    });

    await step("Can be triggered with space-bar", async () => {
      await userEvent.keyboard(" ");
      await expect(onChange).toHaveBeenCalledTimes(1);
      await userEvent.keyboard(" ");
      await expect(onChange).toHaveBeenCalledTimes(2);
    });
    await step("Can not be triggered with enter", async () => {
      await userEvent.keyboard("{enter}");
      await expect(onChange).toHaveBeenCalledTimes(2);
    });

    await step("Can be triggered by clicking on root & label", async () => {
      htmlLabel.click();
      await expect(onChange).toHaveBeenCalledTimes(3);
      displayLabel.click();
      await expect(onChange).toHaveBeenCalledTimes(4);
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
    const htmlInput = canvas.getByTestId("test-checkbox");

    await step("input has html 'disabled' attribute", async () => {
      await expect(htmlInput).toHaveAttribute("disabled");
    });

    await step("Can not be focused with the keyboard", async () => {
      await userEvent.keyboard("{tab}");
      await expect(htmlInput).not.toHaveFocus();
    });

    await step(
      "Can not be triggered by clicking on the root- or label-element",
      async () => {
        //await expect(htmlInput).toBeDisabled();
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
    children: "Invalid Checkbox",
    // @ts-expect-error: data-testid is not a valid prop
    "data-testid": "test-checkbox",
    isInvalid: true,
    onChange: fn(),
  },

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const htmlInput = canvas.getByTestId("test-checkbox");
    await step("html input state is invalid", async () => {
      await expect(htmlInput).toBeInvalid();
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
    const htmlInput = canvas.getByTestId("test-checkbox");
    await step("Has alternative label", async () => {
      await expect(htmlInput).toHaveAttribute("aria-label", args["aria-label"]);
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
    await step("Has alternative label", async () => {
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
