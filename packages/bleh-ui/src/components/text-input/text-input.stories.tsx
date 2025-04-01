import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TextInput } from "./text-input";
import type { TextInputProps } from "./text-input.types";
import { userEvent, within, expect, fn } from "@storybook/test";
import { Box, Stack, Text } from "@/components";

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
    size: "md",
    variant: "solid",
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
      await userEvent.type(input, "Base text input");
      await expect(input).toHaveValue("Base text input");
      await userEvent.clear(input);
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
            variant="solid"
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
            size="md"
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
  args: {
    isDisabled: true,
  },
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
            size="md"
          />
        ))}
      </Stack>
    );
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
            size="md"
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
      await userEvent.clear(input);
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
      { label: "Disabled", props: { isDisabled: true } },
      { label: "Invalid", props: { isInvalid: true } },
      {
        label: "Invalid & Disabled",
        props: { isInvalid: true, isDisabled: true },
      },
    ];

    return (
      <Stack gap="600">
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

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const onChangeRequest = (e: string) => {
      setValue(e);
    };

    return (
      <Stack gap="400">
        <TextInput
          value={value}
          onChange={onChangeRequest}
          placeholder="Type something..."
          aria-label="controlled-input"
          size="md"
          variant="solid"
        />
        <Text data-testid="value-display">Current value: {value}</Text>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("controlled-input");
    const valueDisplay = canvas.getByTestId("value-display");

    await step("Updates controlled value", async () => {
      await userEvent.type(input, "Hello");
      await expect(input).toHaveValue("Hello");
      await expect(valueDisplay).toHaveTextContent("Current value: Hello");
    });

    await step("Clears controlled value", async () => {
      await userEvent.clear(input);
      await expect(input).toHaveValue("");
      await expect(valueDisplay).toHaveTextContent("Current value:");
    });
  },
};

export const InputTypes: Story = {
  render: (args) => {
    const inputTypes = [
      "date",
      "datetime-local",
      "email",
      "month",
      "number",
      "password",
      "search",
      "tel",
      "text",
      "time",
      "url",
      "week",
    ] as const;
    return (
      <Stack direction="column" gap="400">
        {inputTypes.map((type) => (
          <TextInput
            key={type}
            {...args}
            placeholder={type}
            type={type}
            size="md"
            variant="solid"
          />
        ))}
      </Stack>
    );
  },
};
