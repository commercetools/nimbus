import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchInput } from "./search-input";
import { userEvent, within, expect, fn } from "storybook/test";
import { Box, Stack, Text, FormField } from "@/components";

const meta: Meta<typeof SearchInput> = {
  title: "components/SearchInput",
  component: SearchInput,
};

export default meta;

type Story = StoryObj<typeof SearchInput>;

const inputVariants = ["solid", "ghost"] as const;
const inputSize = ["md", "sm"] as const;

export const Base: Story = {
  args: {
    placeholder: "Search...",
    ["aria-label"]: "test-search-input",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("searchbox");

    await step("Uses a search input element", async () => {
      await expect(input.tagName).toBe("INPUT");
      await expect(input).toHaveAttribute("type", "search");
    });

    await step("Forwards data- & aria-attributes", async () => {
      await expect(input).toHaveAttribute("aria-label", "test-search-input");
    });

    await step("Is focusable with <tab> key", async () => {
      await userEvent.tab();
      await expect(input).toHaveFocus();
    });

    await step("Can type text", async () => {
      await userEvent.type(input, "Search query");
      await expect(input).toHaveValue("Search query");
      await userEvent.clear(input);
    });

    await step("Clear button appears when typing", async () => {
      await userEvent.type(input, "test");
      const clearButton = canvas.getByRole("button");
      await expect(clearButton).toBeInTheDocument();
      await userEvent.clear(input);
    });
  },
};

export const Sizes: Story = {
  args: {
    ["aria-label"]: "test-search-input",
  },
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {inputSize.map((size) => (
          <SearchInput
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
  args: {
    placeholder: "Search...",
    ["aria-label"]: "test-search-input",
  },
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {inputVariants.map((variant) => (
          <SearchInput
            key={variant as string}
            {...args}
            variant={variant}
            placeholder={variant as string}
          />
        ))}
      </Stack>
    );
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
          <SearchInput
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
  args: {
    isInvalid: true,
  },
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {inputVariants.map((variant) => (
          <SearchInput
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
      await userEvent.type(input, "Test Search");
      await expect(input).toHaveValue("Test Search");
      await userEvent.clear(input);
    });
  },
};

export const ReadOnly: Story = {
  args: {
    isReadOnly: true,
    defaultValue: "Read-only search",
    ["aria-label"]: "readonly-search",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("searchbox");

    await step("Has readonly attribute", async () => {
      await expect(input).toHaveAttribute("readonly");
      await expect(input).toHaveValue("Read-only search");
    });

    await step("Cannot type when readonly", async () => {
      await userEvent.click(input);
      await userEvent.type(input, "new text");
      await expect(input).toHaveValue("Read-only search");
    });
  },
};

export const SmokeTest: Story = {
  args: {
    onChange: fn(),
    ["aria-label"]: "test-search-input",
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
                    <SearchInput
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
const mockOnSubmitRequest = fn();
const mockOnClearRequest = fn();

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const onChangeRequest = (v: string) => {
      setValue(v);
      mockOnChangeRequest(v);
    };

    return (
      <Stack gap="400">
        <SearchInput
          value={value}
          onChange={onChangeRequest}
          placeholder="Type something..."
          aria-label="controlled-search-input"
        />
        <Text data-testid="value-display">Current value: {value}</Text>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("searchbox");
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

    await step("Does not call onChange with an event", async () => {
      await userEvent.type(input, "Hello");
      // Expect the input to never have been called with an object type
      for (const call of mockOnChangeRequest.mock.calls) {
        await expect(typeof call[0]).toBe("string");
      }
    });
  },
};

export const WithEventHandlers: Story = {
  render: () => {
    const [currentValue, setCurrentValue] = useState("");
    const [submittedValue, setSubmittedValue] = useState("");
    const [clearedCount, setClearedCount] = useState(0);

    return (
      <Stack gap="400">
        <SearchInput
          placeholder="Type and press Enter..."
          value={currentValue}
          onChange={(value) => {
            setCurrentValue(value);
            mockOnChangeRequest(value);
          }}
          onSubmit={(value) => {
            setSubmittedValue(value);
            mockOnSubmitRequest(value);
          }}
          onClear={() => {
            setClearedCount((c) => c + 1);
            mockOnClearRequest();
          }}
          aria-label="event-handler-search"
        />
        <Box fontSize="sm">
          <Text data-testid="current-value">Current: {currentValue}</Text>
          <Text data-testid="submitted-value">Submitted: {submittedValue}</Text>
          <Text data-testid="cleared-count">Cleared: {clearedCount} times</Text>
        </Box>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("searchbox");

    await step("onChange fires when typing", async () => {
      await userEvent.type(input, "test");
      const currentDisplay = canvas.getByTestId("current-value");
      await expect(currentDisplay).toHaveTextContent("Current: test");
      await expect(mockOnChangeRequest).toHaveBeenCalled();
    });

    await step("onSubmit fires when pressing Enter", async () => {
      await userEvent.keyboard("{Enter}");
      const submittedDisplay = canvas.getByTestId("submitted-value");
      await expect(submittedDisplay).toHaveTextContent("Submitted: test");
      await expect(mockOnSubmitRequest).toHaveBeenCalledWith("test");
    });

    await step("onClear fires when clicking clear button", async () => {
      const clearButton = canvas.getByRole("button");
      await userEvent.click(clearButton);
      const clearedDisplay = canvas.getByTestId("cleared-count");
      await expect(clearedDisplay).toHaveTextContent("Cleared: 1 times");
      await expect(mockOnClearRequest).toHaveBeenCalled();
    });
  },
};

export const ClearButton: Story = {
  render: () => {
    const [value, setValue] = useState("");

    return (
      <Stack gap="400">
        <SearchInput
          value={value}
          onChange={setValue}
          placeholder="Type to see clear button..."
          aria-label="clear-button-test"
        />
        <Text fontSize="sm" color="neutral.11">
          The clear button only appears when the input has a value
        </Text>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("searchbox");

    await step("Clear button appears when typing", async () => {
      await userEvent.type(input, "search");
      const clearButton = canvas.getByRole("button");
      await expect(clearButton).toBeInTheDocument();
    });

    await step("Clear button clears the input", async () => {
      const clearButton = canvas.getByRole("button");
      await userEvent.click(clearButton);
      await expect(input).toHaveValue("");
    });
  },
};

export const KeyboardNavigation: Story = {
  args: {
    placeholder: "Test keyboard navigation...",
    ["aria-label"]: "keyboard-test",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Tab focuses the search input", async () => {
      await userEvent.tab();
      const input = canvas.getByRole("searchbox");
      await expect(input).toHaveFocus();
    });

    await step("Type some text", async () => {
      const input = canvas.getByRole("searchbox");
      await userEvent.type(input, "keyboard test");
      await expect(input).toHaveValue("keyboard test");
    });

    await step("Clear button is visible but not in tab order", async () => {
      const clearButton = canvas.getByRole("button");
      await expect(clearButton).toBeInTheDocument();
      await expect(clearButton).toHaveAttribute("tabindex", "-1");
    });

    await step("Click clear button to clear input", async () => {
      const clearButton = canvas.getByRole("button");
      await userEvent.click(clearButton);
      const input = canvas.getByRole("searchbox");
      await expect(input).toHaveValue("");
    });

    await step("Escape clears the input", async () => {
      const input = canvas.getByRole("searchbox");
      await userEvent.click(input);
      await userEvent.type(input, "test escape");
      await expect(input).toHaveValue("test escape");
      await userEvent.keyboard("{Escape}");
      await expect(input).toHaveValue("");
    });
  },
};

export const DefaultValue: Story = {
  args: {
    defaultValue: "Initial search query",
    ["aria-label"]: "default-value-search",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("searchbox");

    await step("Has default value on mount", async () => {
      await expect(input).toHaveValue("Initial search query");
    });

    await step("Clear button visible with default value", async () => {
      const clearButton = canvas.getByRole("button");
      await expect(clearButton).toBeInTheDocument();
    });

    await step("Can modify default value", async () => {
      await userEvent.clear(input);
      await userEvent.type(input, "New query");
      await expect(input).toHaveValue("New query");
    });
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
            <FormField.Label>Search</FormField.Label>
            <FormField.Input>
              <SearchInput
                placeholder="Search for items..."
                value={value}
                onChange={setValue}
                data-testid="basic-search-input"
              />
            </FormField.Input>
            <FormField.Description>
              This is a search input wrapped in a FormField component.
            </FormField.Description>
          </FormField.Root>
        </Box>

        {/* Required field */}
        <Box>
          <Text fontWeight="bold" mb="300">
            Required Field
          </Text>
          <FormField.Root isRequired data-testid="required-form-field">
            <FormField.Label>Required Search</FormField.Label>
            <FormField.Input>
              <SearchInput
                placeholder="This field is required..."
                data-testid="required-search-input"
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
            <FormField.Label>Invalid Search</FormField.Label>
            <FormField.Input>
              <SearchInput
                placeholder="This field has an error..."
                data-testid="invalid-search-input"
              />
            </FormField.Input>
            <FormField.Description>
              This field shows how error styling is applied.
            </FormField.Description>
            <FormField.Error>
              Search query must be at least 3 characters.
            </FormField.Error>
          </FormField.Root>
        </Box>

        {/* Disabled field */}
        <Box>
          <Text fontWeight="bold" mb="300">
            Disabled Field
          </Text>
          <FormField.Root isDisabled data-testid="disabled-form-field">
            <FormField.Label>Disabled Search</FormField.Label>
            <FormField.Input>
              <SearchInput
                placeholder="This field is disabled..."
                defaultValue="example search"
                data-testid="disabled-search-input"
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
            <FormField.Label>Read-only Search</FormField.Label>
            <FormField.Input>
              <SearchInput
                defaultValue="fixed search query"
                data-testid="readonly-search-input"
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
            <FormField.Label>Critical Search</FormField.Label>
            <FormField.Input>
              <SearchInput
                placeholder="This required field has an error..."
                data-testid="required-invalid-search-input"
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

        {/* With info box */}
        <Box>
          <Text fontWeight="bold" mb="300">
            With Info Box
          </Text>
          <FormField.Root data-testid="info-form-field">
            <FormField.Label>Product Search</FormField.Label>
            <FormField.Input>
              <SearchInput
                placeholder="Search for products..."
                data-testid="info-search-input"
              />
            </FormField.Input>
            <FormField.Description>
              Click the info icon next to the label for more details.
            </FormField.Description>
            <FormField.InfoBox>
              Enter keywords to search for products. You can search by name,
              SKU, or description. Use quotes for exact matches and wildcards
              (*) for partial matches.
            </FormField.InfoBox>
          </FormField.Root>
        </Box>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Basic integration - input is rendered", async () => {
      const basicFormField = canvas.getByTestId("basic-form-field");
      await expect(basicFormField).toBeInTheDocument();

      const basicInput = basicFormField.querySelector('input[type="search"]');
      await expect(basicInput).toBeInTheDocument();
    });

    await step("Basic integration - can type in the field", async () => {
      const basicFormField = canvas.getByTestId("basic-form-field");
      const basicInput = basicFormField.querySelector(
        'input[type="search"]'
      ) as HTMLInputElement;

      await userEvent.click(basicInput);
      await userEvent.type(basicInput, "test");
      await expect(basicInput).toHaveValue("test");
      await userEvent.clear(basicInput);
    });

    await step("Required field - displays asterisk in label", async () => {
      const requiredFormField = canvas.getByTestId("required-form-field");
      const requiredInput = requiredFormField.querySelector(
        'input[type="search"]'
      ) as HTMLInputElement;
      const requiredLabel = canvas.getByText("Required Search");

      await expect(requiredInput).toBeInTheDocument();
      // Check for asterisk in label
      await expect(requiredLabel.innerHTML).toContain("*");
    });

    await step(
      "Invalid field - has invalid attributes and shows error",
      async () => {
        const invalidFormField = canvas.getByTestId("invalid-form-field");
        const invalidInput = invalidFormField.querySelector(
          'input[type="search"]'
        ) as HTMLInputElement;
        const errorMessage = canvas.getByText(
          /Search query must be at least 3 characters/
        );

        await expect(invalidInput.parentElement).toHaveAttribute(
          "data-invalid",
          "true"
        );
        await expect(errorMessage).toBeVisible();
      }
    );

    await step(
      "Disabled field - is disabled and cannot be focused",
      async () => {
        const disabledFormField = canvas.getByTestId("disabled-form-field");
        const disabledInput = disabledFormField.querySelector(
          'input[type="search"]'
        ) as HTMLInputElement;

        await expect(disabledInput).toBeDisabled();

        // Try to focus and type - should not work
        await userEvent.tab();
        await expect(disabledInput).not.toHaveFocus();

        // Try to type - should not work
        await userEvent.type(disabledInput, "test");
        await expect(disabledInput).toHaveValue("example search");
      }
    );

    await step("Read-only field - has readonly attribute", async () => {
      const readonlyFormField = canvas.getByTestId("readonly-form-field");
      const readonlyInput = readonlyFormField.querySelector(
        'input[type="search"]'
      ) as HTMLInputElement;

      await expect(readonlyInput).toHaveAttribute("readonly");
      await expect(readonlyInput).toHaveValue("fixed search query");
    });

    await step("Combined states - required + invalid field", async () => {
      const combinedFormField = canvas.getByTestId(
        "required-invalid-form-field"
      );
      const combinedInput = combinedFormField.querySelector(
        'input[type="search"]'
      ) as HTMLInputElement;
      const combinedLabel = canvas.getByText("Critical Search");
      const combinedError = canvas.getByText(
        /This required field cannot be empty/
      );

      await expect(combinedInput).toBeInTheDocument();
      await expect(combinedInput.parentElement).toHaveAttribute(
        "data-invalid",
        "true"
      );
      await expect(combinedLabel.innerHTML).toContain("*");
      await expect(combinedError).toBeVisible();
    });

    await step("Search functionality works within FormField", async () => {
      const basicFormField = canvas.getByTestId("basic-form-field");
      const basicInput = basicFormField.querySelector(
        'input[type="search"]'
      ) as HTMLInputElement;

      await userEvent.click(basicInput);
      await userEvent.type(basicInput, "test query");

      await expect(basicInput).toHaveValue("test query");

      // Clear button should appear
      const clearButton = basicFormField.querySelector(
        "button"
      ) as HTMLButtonElement;
      await expect(clearButton).toBeInTheDocument();

      // Clean up
      await userEvent.click(clearButton);
      await expect(basicInput).toHaveValue("");
    });

    await step("Info box is present", async () => {
      const infoButton = canvas.getByRole("button", { name: "__MORE INFO" });
      await expect(infoButton).toBeInTheDocument();
    });
  },
};
