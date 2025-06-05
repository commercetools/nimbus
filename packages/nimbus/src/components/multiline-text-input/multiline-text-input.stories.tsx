import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MultilineTextInput } from "./multiline-text-input";
import type { MultilineTextInputProps } from "./multiline-text-input.types";
import { userEvent, within, expect, fn } from "@storybook/test";
import { Box, Stack, Text, FormField } from "@/components";

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
            Auto-grow with max height + manual resize
          </Text>
          <MultilineTextInput
            {...args}
            maxHeight={3200}
            placeholder="This will grow up to a max height, then scroll if made smaller"
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

export const WithFormField: Story = {
  render: () => {
    const [value, setValue] = useState("");

    return (
      <Stack direction="column" gap="600">
        {/* Basic FormField integration */}
        <Box>
          <Text fontWeight="bold" mb="300">
            Basic FormField Integration
          </Text>
          <FormField.Root data-testid="basic-form-field">
            <FormField.Label>Message</FormField.Label>
            <FormField.Input>
              <MultilineTextInput
                placeholder="Enter your message here..."
                value={value}
                onChange={setValue}
                data-testid="basic-textarea"
              />
            </FormField.Input>
            <FormField.Description>
              This is a multiline text input wrapped in a FormField component.
            </FormField.Description>
          </FormField.Root>
        </Box>

        {/* Required field */}
        <Box>
          <Text fontWeight="bold" mb="300">
            Required Field
          </Text>
          <FormField.Root isRequired data-testid="required-form-field">
            <FormField.Label>Required Message</FormField.Label>
            <FormField.Input>
              <MultilineTextInput
                placeholder="This field is required..."
                data-testid="required-textarea"
              />
            </FormField.Input>
            <FormField.Description>
              Notice the asterisk (*) indicating this field is required.
            </FormField.Description>
          </FormField.Root>
        </Box>

        {/* Invalid field */}
        <Box>
          <Text fontWeight="bold" mb="300">
            Invalid Field
          </Text>
          <FormField.Root isInvalid data-testid="invalid-form-field">
            <FormField.Label>Invalid Message</FormField.Label>
            <FormField.Input>
              <MultilineTextInput
                placeholder="This field has an error..."
                data-testid="invalid-textarea"
              />
            </FormField.Input>
            <FormField.Description>
              This field shows how error styling is applied.
            </FormField.Description>
            <FormField.Error>
              This message is too short. Please provide more details.
            </FormField.Error>
          </FormField.Root>
        </Box>

        {/* Disabled field */}
        <Box>
          <Text fontWeight="bold" mb="300">
            Disabled Field
          </Text>
          <FormField.Root isDisabled data-testid="disabled-form-field">
            <FormField.Label>Disabled Message</FormField.Label>
            <FormField.Input>
              <MultilineTextInput
                placeholder="This field is disabled..."
                defaultValue="This field cannot be edited"
                data-testid="disabled-textarea"
              />
            </FormField.Input>
            <FormField.Description>
              This field is disabled and cannot be interacted with.
            </FormField.Description>
          </FormField.Root>
        </Box>

        {/* Read-only field */}
        <Box>
          <Text fontWeight="bold" mb="300">
            Read-only Field
          </Text>
          <FormField.Root isReadOnly data-testid="readonly-form-field">
            <FormField.Label>Read-only Message</FormField.Label>
            <FormField.Input>
              <MultilineTextInput
                defaultValue="This content is read-only and cannot be modified."
                data-testid="readonly-textarea"
              />
            </FormField.Input>
            <FormField.Description>
              This field is read-only - you can select text but not edit it.
            </FormField.Description>
          </FormField.Root>
        </Box>

        {/* Combined states */}
        <Box>
          <Text fontWeight="bold" mb="300">
            Required + Invalid Field
          </Text>
          <FormField.Root
            isRequired
            isInvalid
            data-testid="required-invalid-form-field"
          >
            <FormField.Label>Critical Message</FormField.Label>
            <FormField.Input>
              <MultilineTextInput
                placeholder="This required field has an error..."
                data-testid="required-invalid-textarea"
              />
            </FormField.Input>
            <FormField.Description>
              This field demonstrates combining required and invalid states.
            </FormField.Description>
            <FormField.Error>
              This required field cannot be empty.
            </FormField.Error>
          </FormField.Root>
        </Box>

        {/* With auto-grow */}
        <Box>
          <Text fontWeight="bold" mb="300">
            Auto-grow with FormField
          </Text>
          <FormField.Root data-testid="autogrow-form-field">
            <FormField.Label>Auto-growing Message</FormField.Label>
            <FormField.Input>
              <MultilineTextInput
                autoGrow
                placeholder="Start typing... this will grow automatically!"
                data-testid="autogrow-textarea"
              />
            </FormField.Input>
            <FormField.Description>
              This textarea will automatically expand as you type more content.
            </FormField.Description>
          </FormField.Root>
        </Box>

        {/* With info box */}
        <Box>
          <Text fontWeight="bold" mb="300">
            With Info Box
          </Text>
          <FormField.Root data-testid="info-form-field">
            <FormField.Label>Message with Help</FormField.Label>
            <FormField.Input>
              <MultilineTextInput
                placeholder="Type your message here..."
                data-testid="info-textarea"
              />
            </FormField.Input>
            <FormField.Description>
              Click the info icon next to the label for more details.
            </FormField.Description>
            <FormField.InfoBox>
              This is a helpful message that provides additional context about
              what should be entered in this field. You can include formatting
              instructions, examples, or other relevant information.
            </FormField.InfoBox>
          </FormField.Root>
        </Box>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Basic integration - label is linked to textarea", async () => {
      const basicTextarea = canvas.getByTestId("basic-textarea");
      const basicLabel = canvas.getByText("Message");

      await expect(basicTextarea).toHaveAttribute(
        "aria-labelledby",
        basicLabel.id
      );
    });

    await step(
      "Basic integration - description is linked to textarea",
      async () => {
        const basicTextarea = canvas.getByTestId("basic-textarea");
        const description = canvas.getByText(
          /This is a multiline text input wrapped/
        );

        await expect(basicTextarea).toHaveAttribute(
          "aria-describedby",
          description.id
        );
      }
    );

    await step("Required field - has required attribute", async () => {
      const requiredTextarea = canvas.getByTestId("required-textarea");
      const requiredLabel = canvas.getByText("Required Message");

      await expect(requiredTextarea).toHaveAttribute("aria-required", "true");
      // Check for asterisk in label
      await expect(requiredLabel.innerHTML).toContain("*");
    });

    await step(
      "Invalid field - has invalid attributes and shows error",
      async () => {
        const invalidTextarea = canvas.getByTestId("invalid-textarea");
        const errorMessage = canvas.getByText(/This message is too short/);

        await expect(invalidTextarea).toHaveAttribute("data-invalid", "true");
        await expect(errorMessage).toBeVisible();
        await expect(
          invalidTextarea.getAttribute("aria-describedby")
        ).toContain(errorMessage.id);
      }
    );

    await step(
      "Disabled field - is disabled and cannot be focused",
      async () => {
        const disabledTextarea = canvas.getByTestId("disabled-textarea");

        await expect(disabledTextarea).toBeDisabled();

        // Try to focus and type - should not work
        await userEvent.tab();
        await expect(disabledTextarea).not.toHaveFocus();

        // Try to type - should not work
        await userEvent.type(disabledTextarea, "Test input");
        await expect(disabledTextarea).toHaveValue(
          "This field cannot be edited"
        );
      }
    );

    await step("Read-only field - has readonly attribute", async () => {
      const readonlyTextarea = canvas.getByTestId("readonly-textarea");

      await expect(readonlyTextarea).toHaveAttribute("readonly");
      await expect(readonlyTextarea).toHaveValue(
        "This content is read-only and cannot be modified."
      );
    });

    await step("Combined states - required + invalid field", async () => {
      const combinedTextarea = canvas.getByTestId("required-invalid-textarea");
      const combinedLabel = canvas.getByText("Critical Message");
      const combinedError = canvas.getByText(
        /This required field cannot be empty/
      );

      await expect(combinedTextarea).toHaveAttribute("aria-required", "true");
      await expect(combinedTextarea).toHaveAttribute("data-invalid", "true");
      await expect(combinedLabel.innerHTML).toContain("*");
      await expect(combinedError).toBeVisible();
    });

    await step("Auto-grow works within FormField", async () => {
      const autogrowTextarea = canvas.getByTestId("autogrow-textarea");
      const initialHeight = autogrowTextarea.clientHeight;

      await userEvent.click(autogrowTextarea);
      await userEvent.type(
        autogrowTextarea,
        "Line 1{enter}Line 2{enter}Line 3{enter}Line 4"
      );

      // Should have grown
      await expect(autogrowTextarea.clientHeight).toBeGreaterThan(
        initialHeight
      );

      // Clean up
      await userEvent.clear(autogrowTextarea);
    });

    await step("Info box functionality works", async () => {
      const infoButton = canvas.getByRole("button", { name: "__MORE INFO" });

      await expect(infoButton).toBeInTheDocument();

      // Click to open info box
      await userEvent.click(infoButton);
      const infoBox = within(document.body).getByText(
        /This is a helpful message/
      );
      await expect(infoBox).toBeInTheDocument();

      // Close with Escape
      await userEvent.keyboard("{Escape}");
      const infoBoxAfterEscape = within(document.body).queryByText(
        /This is a helpful message/
      );
      await expect(infoBoxAfterEscape).not.toBeInTheDocument();
    });

    await step("Textarea functionality works within FormField", async () => {
      const basicTextarea = canvas.getByTestId("basic-textarea");

      await userEvent.click(basicTextarea);
      await userEvent.type(
        basicTextarea,
        "Testing multiline{enter}input functionality"
      );

      await expect(basicTextarea).toHaveValue(
        "Testing multiline\ninput functionality"
      );

      // Clean up
      await userEvent.clear(basicTextarea);
    });
  },
};
