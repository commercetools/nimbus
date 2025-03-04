import type { Meta, StoryObj } from "@storybook/react";
import { TextInput } from "./text-input";
import type { TextInputProps } from "./text-input.types";
import { userEvent, within, expect, fn } from "@storybook/test";
import { Box, Stack } from "@/components";

const meta: Meta<typeof TextInput> = {
  title: "components/TextInput",
  component: TextInput,
};

export default meta;

type Story = StoryObj<typeof TextInput>;

const inputVariants: TextInputProps["variant"][] = ["solid", "ghost"];
const inputSize: TextInputProps["size"][] = ["md", "sm"];

export const Base: Story = {
  args: {
    placeholder: "base text input",
    ["aria-label"]: "test-input",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("test-input");

    await step("Uses an <input> element by default", async () => {
      await expect(input.tagName).toBe("INPUT");
    });

    await step("Forwards data- & aria-attributes", async () => {
      await expect(input).toHaveAttribute("aria-label", "test-input");
    });

    await step("Is focusable with <tab> key", async () => {
      await userEvent.tab();
      await expect(input).toHaveFocus();
    });

    await step("Can type text", async () => {
      await userEvent.type(input, "Hello World");
      await expect(input).toHaveValue("Hello World");
    });
  },
};

export const Sizes: Story = {
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {inputSize.map((size) => (
          <TextInput
            key={size as string}
            {...args}
            size={size}
            placeholder={size as string}
          />
        ))}
      </Stack>
    );
  },
};

export const Variants: Story = {
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {inputVariants.map((variant) => (
          <TextInput
            key={variant as string}
            {...args}
            variant={variant}
            placeholder={variant as string}
          />
        ))}
      </Stack>
    );
  },
  args: {
    placeholder: "text input",
  },
};

export const Disabled: Story = {
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {inputVariants.map((variant) => (
          <TextInput
            key={variant as string}
            {...args}
            variant={variant}
            placeholder={variant as string}
            aria-label={`${variant as string}-disabled`}
          />
        ))}
      </Stack>
    );
  },
  args: {
    disabled: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("solid-disabled");

    await step("Has disabled attribute", async () => {
      await expect(input).toBeDisabled();
    });

    await step("Cannot be focused", async () => {
      await userEvent.tab();
      await expect(input).not.toHaveFocus();
    });

    await step("Cannot type text when disabled", async () => {
      await userEvent.type(input, "Test");
      await expect(input).toHaveValue("");
    });
  },
};

export const Invalid: Story = {
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {inputVariants.map((variant) => (
          <TextInput
            key={variant as string}
            {...args}
            variant={variant}
            placeholder={variant as string}
            aria-label={`${variant as string}-invalid`}
          />
        ))}
      </Stack>
    );
  },
  args: {
    isInvalid: true,
    placeholder: "Invalid input",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("solid-invalid");

    await step("Has invalid state", async () => {
      await expect(input).toHaveAttribute("data-invalid", "true");
    });

    await step("Is still focusable when invalid", async () => {
      await userEvent.tab();
      await expect(input).toHaveFocus();
    });

    await step("Can still type when invalid", async () => {
      await userEvent.type(input, "Test Input");
      await expect(input).toHaveValue("Test Input");
    });
  },
};

export const SmokeTest: Story = {
  args: {
    placeholder: "Text Input",
    onChange: fn(),
    ["aria-label"]: "test-input",
  },
  render: (args) => {
    const states = [
      { label: "Default", props: {} },
      { label: "Disabled", props: { disabled: true } },
      { label: "Invalid", props: { isInvalid: true } },
      {
        label: "Invalid & Disabled",
        props: { isInvalid: true, disabled: true },
      },
    ];

    return (
      <Stack gap="1200">
        {states.map((state) => (
          <Stack key={state.label} direction="column" gap="400">
            {inputSize.map((size) => (
              <Stack
                direction="row"
                key={size as string}
                gap="400"
                alignItems="center"
              >
                {inputVariants.map((variant) => (
                  <Box key={variant as string}>
                    <TextInput
                      {...args}
                      {...state.props}
                      variant={variant}
                      size={size}
                      placeholder={`${variant as string} ${size as string} ${state.label}`}
                    />
                  </Box>
                ))}
              </Stack>
            ))}
          </Stack>
        ))}
      </Stack>
    );
  },
};
