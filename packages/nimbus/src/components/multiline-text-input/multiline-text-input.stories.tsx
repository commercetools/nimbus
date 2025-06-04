import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MultilineTextInput } from "./multiline-text-input";
import type { MultilineTextInputProps } from "./multiline-text-input.types";
import { userEvent, within, expect, fn } from "@storybook/test";
import { Box, Stack, Text } from "@/components";

const meta: Meta<typeof MultilineTextInput> = {
  title: "components/MultilineTextInput",
  component: MultilineTextInput,
};

export default meta;

type Story = StoryObj<typeof MultilineTextInput>;

const inputVariants: MultilineTextInputProps["variant"][] = ["solid", "ghost"];
const inputSize: MultilineTextInputProps["size"][] = ["md", "sm"];

export const Base: Story = {
  args: {
    placeholder: "base multiline text input",
    ["aria-label"]: "test-textarea",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByLabelText("test-textarea");

    await step("Uses a <textarea> element by default", async () => {
      await expect(textarea.tagName).toBe("TEXTAREA");
    });

    await step("Forwards data- & aria-attributes", async () => {
      await expect(textarea).toHaveAttribute("aria-label", "test-textarea");
    });

    await step("Is focusable with <tab> key", async () => {
      await userEvent.tab();
      await expect(textarea).toHaveFocus();
    });

    await step("Can type multiline text", async () => {
      await userEvent.type(textarea, "First line{enter}Second line");
      await expect(textarea).toHaveValue("First line\nSecond line");
      await userEvent.clear(textarea);
    });
  },
};

export const Sizes: Story = {
  args: {
    "aria-label": "test-textarea",
  },
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="flex-start">
        {inputSize.map((size) => (
          <MultilineTextInput
            key={size as string}
            {...args}
            size={size}
            placeholder={`${size as string} textarea`}
          />
        ))}
      </Stack>
    );
  },
};

export const Variants: Story = {
  args: {
    placeholder: "multiline text input",
    ["aria-label"]: "test-textarea",
  },
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="flex-start">
        {inputVariants.map((variant) => (
          <MultilineTextInput
            key={variant as string}
            {...args}
            variant={variant}
            placeholder={`${variant as string} textarea`}
          />
        ))}
      </Stack>
    );
  },
};

export const Required: Story = {
  args: {
    isRequired: true,
    placeholder: "required multiline text input",
    ["aria-label"]: "test-textarea-required",
  },
  render: (args) => {
    return (
      <MultilineTextInput
        {...args}
        placeholder="required multiline text input"
        aria-label="test-textarea-required"
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByLabelText("test-textarea-required");

    await step("Has aria-required attribute", async () => {
      await expect(textarea).toHaveAttribute("aria-required", "true");
    });
  },
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="flex-start">
        {inputVariants.map((variant) => (
          <MultilineTextInput
            key={variant as string}
            {...args}
            variant={variant}
            placeholder={`${variant as string} disabled`}
            aria-label={`${variant as string}-disabled`}
          />
        ))}
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByLabelText("solid-disabled");

    await step("Has disabled attribute", async () => {
      await expect(textarea).toBeDisabled();
    });

    await step("Cannot be focused", async () => {
      await userEvent.tab();
      await expect(textarea).not.toHaveFocus();
    });

    await step("Cannot type text when disabled", async () => {
      await userEvent.type(textarea, "Test");
      await expect(textarea).toHaveValue("");
    });
  },
};

export const Invalid: Story = {
  args: {
    isInvalid: true,
  },
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="flex-start">
        {inputVariants.map((variant) => (
          <MultilineTextInput
            key={variant as string}
            {...args}
            variant={variant}
            placeholder={`${variant as string} invalid`}
            aria-label={`${variant as string}-invalid`}
          />
        ))}
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByLabelText("solid-invalid");

    await step("Has invalid state", async () => {
      await expect(textarea).toHaveAttribute("data-invalid", "true");
    });

    await step("Is still focusable when invalid", async () => {
      await userEvent.tab();
      await expect(textarea).toHaveFocus();
    });

    await step("Can still type when invalid", async () => {
      await userEvent.type(textarea, "Test Input");
      await expect(textarea).toHaveValue("Test Input");
      await userEvent.clear(textarea);
    });
  },
};

export const SmokeTest: Story = {
  args: {
    onChange: fn(),
    ["aria-label"]: "test-textarea",
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
            <Text fontWeight="bold">{state.label}</Text>
            {inputSize.map((size) => (
              <Stack
                direction="row"
                key={size as string}
                gap="400"
                alignItems="flex-start"
              >
                {inputVariants.map((variant) => (
                  <Box key={variant as string}>
                    <MultilineTextInput
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

const mockOnChangeRequest = fn();

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const onChangeRequest = (e: string) => {
      setValue(e);
      mockOnChangeRequest(e);
    };

    return (
      <Stack gap="400">
        <MultilineTextInput
          value={value}
          onChange={onChangeRequest}
          placeholder="Type something multiline..."
          aria-label="controlled-textarea"
        />
        <Text data-testid="value-display">Current value: {value}</Text>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByLabelText("controlled-textarea");
    const valueDisplay = canvas.getByTestId("value-display");

    await step("Updates controlled value", async () => {
      await userEvent.type(textarea, "Hello{enter}World");
      await expect(textarea).toHaveValue("Hello\nWorld");
      await expect(valueDisplay).toHaveTextContent(
        "Current value: Hello World"
      );
    });

    await step("Clears controlled value", async () => {
      await userEvent.clear(textarea);
      await expect(textarea).toHaveValue("");
      await expect(valueDisplay).toHaveTextContent("Current value:");
    });

    await step("Does not call onChange with an event", async () => {
      await userEvent.type(textarea, "Hello");
      // Expect the input to never have been called with an object type
      for (const call of mockOnChangeRequest.mock.calls) {
        await expect(typeof call[0]).toBe("string");
      }
    });
  },
};

export const WithRows: Story = {
  args: {
    rows: 5,
    placeholder: "Textarea with 5 rows",
    ["aria-label"]: "test-textarea-rows",
  },
  render: () => {
    return (
      <Stack direction="column" gap="400">
        <Text>Default (no rows specified - should be 1 row):</Text>
        <MultilineTextInput
          placeholder="Default textarea"
          aria-label="default-textarea"
        />
        <Text>With 3 rows:</Text>
        <MultilineTextInput
          rows={3}
          placeholder="Textarea with 3 rows"
          aria-label="rows-3-textarea"
        />
        <Text>With 8 rows:</Text>
        <MultilineTextInput
          rows={8}
          placeholder="Textarea with 8 rows"
          aria-label="rows-8-textarea"
        />
      </Stack>
    );
  },
};

export const AutoGrow: Story = {
  args: {
    autoGrow: true,
    placeholder: "Start typing... This textarea will grow automatically!",
    "aria-label": "autogrow-textarea",
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="flex-start">
        <Box>
          <Text textStyle="sm" color="neutral.11" mb="200">
            Auto-grow with manual resize handle (default behavior)
          </Text>
          <MultilineTextInput {...args} />
        </Box>

        <Box>
          <Text textStyle="sm" color="neutral.11" mb="200">
            Auto-grow with max height (200px) + manual resize
          </Text>
          <MultilineTextInput
            {...args}
            maxHeight={200}
            placeholder="This will grow up to 200px max height, then scroll. You can also resize manually!"
            aria-label="autogrow-limited-textarea"
          />
        </Box>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const autoGrowTextarea = canvas.getByLabelText("autogrow-textarea");
    const limitedTextarea = canvas.getByLabelText("autogrow-limited-textarea");

    await step("Auto-grows when typing content", async () => {
      const initialHeight = autoGrowTextarea.clientHeight;

      await userEvent.click(autoGrowTextarea);
      await userEvent.type(
        autoGrowTextarea,
        "Line 1{enter}Line 2{enter}Line 3{enter}Line 4"
      );

      // Height should have increased
      await expect(autoGrowTextarea.clientHeight).toBeGreaterThan(
        initialHeight
      );
    });

    await step("Auto-shrinks when deleting content", async () => {
      // Record height with content
      const heightWithContent = autoGrowTextarea.clientHeight;

      // Delete some content
      await userEvent.clear(autoGrowTextarea);
      await userEvent.type(autoGrowTextarea, "Just one line");

      // Height should have decreased
      await expect(autoGrowTextarea.clientHeight).toBeLessThan(
        heightWithContent
      );
    });

    await step(
      "Auto-shrinks to minimum when all content is deleted",
      async () => {
        // Clear all content
        await userEvent.clear(autoGrowTextarea);

        // Should shrink to minimal height
        const emptyHeight = autoGrowTextarea.clientHeight;

        // Add content again
        await userEvent.type(
          autoGrowTextarea,
          "Line 1{enter}Line 2{enter}Line 3{enter}Line 4"
        );

        // Should grow again
        await expect(autoGrowTextarea.clientHeight).toBeGreaterThan(
          emptyHeight
        );
      }
    );

    await step("Auto-grow with manual resize shows resize handle", async () => {
      // Check that the default auto-grow textarea still has resize capability
      const computedStyle = window.getComputedStyle(autoGrowTextarea);
      await expect(computedStyle.resize).not.toBe("none");
    });

    await step("Limited auto-grow respects max height", async () => {
      await userEvent.click(limitedTextarea);

      // Add many lines to exceed the limit
      const longText = Array(15).fill("This is a long line of text").join("\n");
      await userEvent.type(limitedTextarea, longText);

      // Height should be limited to approximately 200px
      await expect(limitedTextarea.clientHeight).toBeLessThanOrEqual(220); // Allow some margin
    });

    // Clean up
    await userEvent.clear(autoGrowTextarea);
    await userEvent.clear(limitedTextarea);
  },
};

export const AutoGrowVariants: Story = {
  args: {
    autoGrow: true,
    "aria-label": "test-textarea",
  },
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="flex-start">
        {inputVariants.map((variant) => {
          const variantStr = variant as string;
          return (
            <Box key={variantStr}>
              <Text textStyle="sm" color="neutral.11" mb="200">
                {variantStr} variant with auto-grow/shrink
              </Text>
              <MultilineTextInput
                {...args}
                variant={variant}
                placeholder={`Type or delete text to see ${variantStr} auto-resize...`}
                aria-label={`${variantStr}-autogrow`}
              />
            </Box>
          );
        })}
      </Stack>
    );
  },
};
