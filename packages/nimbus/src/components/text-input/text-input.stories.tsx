import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextInput } from "./text-input";
import type { TextInputProps } from "./text-input.types";
import { userEvent, within, expect, fn } from "storybook/test";
import { Box, Stack, Text } from "@/components";
import {
  Search,
  Visibility,
  VisibilityOff,
  AddReaction,
} from "@commercetools/nimbus-icons";

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
      await userEvent.type(input, "Base text input");
      await expect(input).toHaveValue("Base text input");
      await userEvent.clear(input);
    });
  },
};

export const Sizes: Story = {
  args: {
    "aria-label": "test-input",
  },
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
  args: {
    placeholder: "text input",
    ["aria-label"]: "test-input",
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
          />
        ))}
      </Stack>
    );
  },
};

export const Required: Story = {
  args: {
    isRequired: true,
    placeholder: "required text input",
    ["aria-label"]: "test-input-required",
  },
  render: (args) => {
    return (
      <TextInput
        {...args}
        placeholder="required text input"
        aria-label="test-input-required"
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("test-input-required");

    await step("Has aria-required attribute", async () => {
      await expect(input).toHaveAttribute("aria-required", "true");
    });
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
        <TextInput
          value={value}
          onChange={onChangeRequest}
          placeholder="Type something..."
          aria-label="controlled-input"
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

    await step("Does not call onChange with an event", async () => {
      await userEvent.type(input, "Hello");
      // Expect the input to never have been called with an object type
      for (const call of mockOnChangeRequest.mock.calls) {
        await expect(typeof call[0]).toBe("string");
      }
    });
  },
};

export const WithLeadingElement: Story = {
  args: {
    placeholder: "Search...",
    leadingElement: <AddReaction />,
    "aria-label": "search-input",
  },
};

export const WithTrailingElement: Story = {
  args: {
    placeholder: "Enter password",
    trailingElement: <Visibility style={{ cursor: "pointer" }} />,
    "aria-label": "password-input",
  },
};

export const InteractiveElements: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordValue, setPasswordValue] = useState("");

    const handleClear = () => {
      setValue("");
    };

    const togglePassword = () => {
      setShowPassword(!showPassword);
    };

    return (
      <Stack direction="column" gap="800">
        <Text>Interactive search with clear button</Text>
        <TextInput
          placeholder="Search for products"
          leadingElement={<Search />}
          trailingElement={
            value ? (
              <Box
                cursor="pointer"
                onClick={handleClear}
                aria-label="Clear search"
                role="button"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                ✕
              </Box>
            ) : null
          }
          value={value}
          onChange={setValue}
          aria-label="interactive-search-input"
        />

        <Text mt="400">Interactive password visibility toggle</Text>
        <TextInput
          placeholder="Enter password"
          type={showPassword ? "text" : "password"}
          value={passwordValue}
          onChange={setPasswordValue}
          trailingElement={
            <Box
              cursor="pointer"
              onClick={togglePassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
              role="button"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </Box>
          }
          aria-label="interactive-password-input"
        />
      </Stack>
    );
  },
};

export const WithBothElements: Story = {
  args: {
    placeholder: "Search for products",
    leadingElement: <AddReaction />,
    trailingElement: <AddReaction />,
    "aria-label": "search-with-clear-input",
  },
};

export const WithBothElementsDifferentSizes: Story = {
  render: () => {
    return (
      <Stack direction="column" gap="400">
        {inputSize.map((size) => (
          <TextInput
            key={String(size)}
            size={size}
            placeholder={`Size ${size}`}
            leadingElement={<Search />}
            trailingElement={<Box cursor="pointer">Clear</Box>}
            aria-label={`size-${size}-input`}
          />
        ))}
      </Stack>
    );
  },
};

export const RTLSupport: Story = {
  render: () => {
    return (
      <Stack direction="column" gap="400">
        <Box>
          <Text mb="200">LTR direction (left-to-right)</Text>
          <TextInput
            placeholder="Search in LTR"
            leadingElement={<Search />}
            trailingElement={<Box cursor="pointer">Clear</Box>}
            aria-label="ltr-input"
          />
        </Box>
        <Box dir="rtl" width="100%">
          <Text mb="200" textAlign="right">
            RTL direction (right-to-left)
          </Text>
          <TextInput
            placeholder="Search in RTL"
            leadingElement={<Search />}
            trailingElement={<Box cursor="pointer">Clear</Box>}
            aria-label="rtl-input"
          />
        </Box>
      </Stack>
    );
  },
};

export const InputTypes: Story = {
  args: {
    ["aria-label"]: "test-input",
  },
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
          <TextInput key={type} {...args} placeholder={type} type={type} />
        ))}
      </Stack>
    );
  },
};

export const WithElementsInsideInput: Story = {
  render: () => {
    return (
      <Stack gap="500">
        <Box>
          <Text as="h3" mb="300">
            Elements inside input border
          </Text>
          <Text mb="300">With leading element:</Text>
          <TextInput
            placeholder="Leading element inside input"
            leadingElement={<Search />}
            aria-label="with-leading"
          />
        </Box>

        <Box>
          <Text mb="300">With trailing element:</Text>
          <TextInput
            placeholder="Trailing element inside input"
            trailingElement={<Visibility />}
            aria-label="with-trailing"
          />
        </Box>

        <Box>
          <Text mb="300">With both elements:</Text>
          <TextInput
            placeholder="Both elements inside input"
            leadingElement={<Search />}
            trailingElement={<Visibility />}
            aria-label="with-both"
          />
        </Box>

        <Box>
          <Text as="h3" mb="300">
            Focus State
          </Text>
          <Text mb="300">Focus ring appears around the entire input:</Text>
          <TextInput
            placeholder="Click to focus"
            leadingElement={<Search />}
            trailingElement={<Visibility />}
            aria-label="focus-demo"
          />
        </Box>

        <Box>
          <Text mb="300">Autofocused input with elements:</Text>
          <TextInput
            placeholder="Already focused"
            leadingElement={<Search />}
            trailingElement={<Visibility />}
            aria-label="autofocus-demo"
            autoFocus
          />
        </Box>

        <Box>
          <Text as="h3" mb="300">
            Disabled State
          </Text>
          <TextInput
            placeholder="Disabled input"
            leadingElement={<Search />}
            trailingElement={<Visibility />}
            aria-label="disabled-demo"
            isDisabled
          />
        </Box>

        <Box>
          <Text as="h3" mb="300">
            Invalid State
          </Text>
          <TextInput
            placeholder="Invalid input"
            leadingElement={<Search />}
            trailingElement={<Visibility />}
            aria-label="invalid-demo"
            data-invalid="true"
          />
        </Box>
      </Stack>
    );
  },
};
