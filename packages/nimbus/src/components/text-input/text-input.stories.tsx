import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Box,
  Icon,
  IconButton,
  Stack,
  Text,
  TextInput,
  type TextInputProps,
} from "@commercetools/nimbus";
import { userEvent, within, expect, fn } from "storybook/test";
import {
  Search,
  Visibility,
  AddReaction,
  AddBox,
  Close,
} from "@commercetools/nimbus-icons";

const meta: Meta<typeof TextInput> = {
  title: "Components/TextInput",
  component: TextInput,
};

export default meta;

type Story = StoryObj<typeof TextInput>;

const inputVariants: TextInputProps["variant"][] = ["solid", "ghost"];
const inputSize = ["md", "sm"] as const;

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

export const LeadingAndTrailingElements: Story = {
  render: () => {
    const examples: Array<{
      label: string;
      props?: React.ComponentProps<typeof TextInput>;
      getProps?: (size: "sm" | "md") => React.ComponentProps<typeof TextInput>;
    }> = [
      {
        label: "Leading Icon",
        props: {
          placeholder: "Search...",
          leadingElement: <Search />,
          "aria-label": "search-input",
        },
      },
      {
        label: "Trailing Icon",
        props: {
          placeholder: "Enter password",
          trailingElement: <Visibility />,
          "aria-label": "password-input",
        },
      },
      {
        label: "Both Icons",
        props: {
          placeholder: "Search for products",
          leadingElement: <Icon as={Search} />,
          trailingElement: <Icon as={AddBox} />,
          "aria-label": "search-with-clear-input",
        },
      },
      {
        label: "IconButton Elements",
        getProps: (size: "sm" | "md") => ({
          placeholder: "Advanced search",
          leadingElement: (
            <IconButton
              size={size === "sm" ? "2xs" : "xs"}
              colorPalette="primary"
              variant="ghost"
              aria-label="search options"
            >
              <Icon as={AddReaction} />
            </IconButton>
          ),
          trailingElement: (
            <IconButton
              size={size === "sm" ? "2xs" : "xs"}
              colorPalette="primary"
              variant="ghost"
              aria-label="clear"
            >
              <Icon as={Close} />
            </IconButton>
          ),
          "aria-label": "advanced-search-input",
        }),
      },
    ];

    return (
      <Stack direction="column" gap="600">
        {inputSize.map((size) => (
          <Stack key={size as string} direction="column" gap="400">
            <Text fontWeight="semibold">Size: {size as string}</Text>
            <Stack direction="column" gap="300">
              {examples.map((example) => (
                <Stack
                  key={`${size as string}-${example.label}`}
                  direction="column"
                  gap="200"
                >
                  <Text fontSize="sm" color="neutral.11">
                    {example.label}
                  </Text>
                  <Stack direction="row" gap="400" alignItems="center">
                    {inputVariants.map((variant) => (
                      <Stack
                        key={variant as string}
                        direction="column"
                        gap="100"
                      >
                        <Text fontSize="xs" color="neutral.10">
                          {variant as string}
                        </Text>
                        <TextInput
                          {...(example.getProps
                            ? example.getProps(size)
                            : example.props)}
                          size={size}
                          variant={variant}
                        />
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Stack>
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
            leadingElement={<Icon as={Search} />}
            trailingElement={<Icon as={AddBox} />}
            aria-label="ltr-input"
          />
        </Box>
        <Box dir="rtl" width="100%">
          <Text mb="200" textAlign="right">
            RTL direction (right-to-left)
          </Text>
          <TextInput
            placeholder="Search in RTL"
            leadingElement={<Icon as={Search} />}
            trailingElement={<Icon as={AddBox} />}
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

/**
 * Demonstrates TextInput consuming context from React Aria's TextField.
 * This validates the useContextProps integration.
 */
export const WithinReactAriaContext: Story = {
  render: () => {
    return (
      <TextInput.Context.Provider
        value={{ isDisabled: true, isRequired: true, isReadOnly: true }}
      >
        <TextInput
          aria-label="email address"
          type="email"
          placeholder="Enter your email"
        />
      </TextInput.Context.Provider>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Enter your email");

    await step(
      "TextInput consumes required prop from TextField context",
      async () => {
        // Verify TextInput receives required attribute from TextField context
        await expect(input).toHaveAttribute("aria-required", "true");
      }
    );

    await step(
      "TextInput consumes disabled prop from TextField context",
      async () => {
        // Verify TextInput receives disabled attribute from TextField context
        await expect(input).toBeDisabled();
      }
    );

    await step(
      "TextInput consumes readonly prop from TextField context",
      async () => {
        // Verify TextInput receives readonly attribute from TextField context
        await expect(input).toHaveAttribute("readonly");
      }
    );
  },
};

/**
 * Demonstrates local TextInput props overriding props from React Aria's InputContext.
 */
export const OverrideContextWithLocalProps: Story = {
  render: () => {
    return (
      <TextInput.Context.Provider
        value={{ isDisabled: true, isRequired: true, isReadOnly: true }}
      >
        <TextInput
          aria-label="email address"
          type="email"
          placeholder="Enter your email"
          isDisabled={false}
          isRequired={false}
          isReadOnly={false}
        />
      </TextInput.Context.Provider>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Enter your email");

    await step(
      "TextInput local props override context required prop",
      async () => {
        // Verify TextInput's local isRequired={false} overrides context isRequired={true}
        await expect(input).not.toHaveAttribute("aria-required");
      }
    );

    await step(
      "TextInput local props override context disabled prop",
      async () => {
        // Verify TextInput's local isDisabled={false} overrides context isDisabled={true}
        await expect(input).not.toBeDisabled();
      }
    );

    await step(
      "TextInput local props override context readonly prop",
      async () => {
        // Verify TextInput's local isReadOnly={false} overrides context isReadOnly={true}
        await expect(input).not.toHaveAttribute("readonly");
      }
    );
  },
};
