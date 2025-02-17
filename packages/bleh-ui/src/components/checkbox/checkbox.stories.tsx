import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./checkbox";
import { Stack } from "@/components";

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
 * Base story
 * Uncontrolled, demonstrates the most basic implementation.
 *
 */
export const Base: Story = {
  render: () => {
    return (
      <Stack>
        {[true, undefined].map((isInvalid) => (
          <Stack>
            {[true, undefined].map((isDisabled, i) => (
              <Stack key={i} direction="column" alignItems="flex-start">
                <Checkbox isDisabled={isDisabled} isInvalid={isInvalid}>
                  Uncontrolled, {isDisabled ? "disabled" : "not disabled"},{" "}
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
