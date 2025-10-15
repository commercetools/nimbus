import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { I18nProvider } from "react-aria";
import { NumberInput } from "./number-input";
import { userEvent, within, expect } from "storybook/test";
import { Box, Stack, Text, FormField, Icon, IconButton } from "@/components";
import {
  AddReaction,
  Search,
  Visibility,
  AddBox,
  Close,
} from "@commercetools/nimbus-icons";

const meta: Meta<typeof NumberInput> = {
  title: "Components/NumberInput",
  component: NumberInput,
};

export default meta;

type Story = StoryObj<typeof NumberInput>;

const inputVariants = ["solid", "ghost"] as const;
const inputSize = ["md", "sm"] as const;

export const Base: Story = {
  args: {
    placeholder: "123",
    ["aria-label"]: "test-number-input",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("test-number-input");

    await step("Uses an <input> element by default", async () => {
      await expect(input.tagName).toBe("INPUT");
    });

    await step("Has type='text' attribute", async () => {
      await expect(input).toHaveAttribute("type", "text");
    });

    await step("Forwards data- & aria-attributes", async () => {
      await expect(input).toHaveAttribute("aria-label", "test-number-input");
    });

    await step("Is focusable with <tab> key", async () => {
      await userEvent.tab();
      await expect(input).toHaveFocus();
    });

    await step("Can type numbers", async () => {
      await userEvent.type(input, "123");
      await expect(input).toHaveValue("123");
      await userEvent.clear(input);
    });

    await step("Handles numeric input properly", async () => {
      await userEvent.type(input, "42");
      await expect(input).toHaveValue("42");
    });
  },
};

export const Sizes: Story = {
  render: () => (
    <Box display="flex" flexDirection="row" gap={8} alignItems="center">
      {inputSize.map((size) => (
        <Box key={String(size)}>
          <Text mb={1} fontSize="sm" fontWeight="medium">
            Size: {String(size)}
          </Text>
          <NumberInput
            size={size}
            placeholder="123"
            aria-label={`Size ${size} number input`}
          />
        </Box>
      ))}
    </Box>
  ),
};

export const Variants: Story = {
  render: () => (
    <Stack align="flex-start">
      {inputVariants.map((variant) => (
        <Box key={String(variant)}>
          <Text mb={1} fontSize="sm" fontWeight="medium">
            Variant: {String(variant)}
          </Text>
          <NumberInput
            variant={variant}
            leadingElement={<Icon as={AddReaction} />}
            trailingElement={<Icon as={AddReaction} />}
            placeholder="123"
            aria-label={`Variant ${variant} number input`}
          />
        </Box>
      ))}
    </Stack>
  ),
};

export const States: Story = {
  render: () => (
    <Stack align="flex-start">
      <Box>
        <Text mb={1} fontSize="sm" fontWeight="medium">
          Default
        </Text>
        <NumberInput placeholder="123" aria-label="Default number input" />
      </Box>
      <Box>
        <Text mb={1} fontSize="sm" fontWeight="medium">
          With value
        </Text>
        <NumberInput defaultValue={123} aria-label="Number input with value" />
      </Box>
      <Box>
        <Text mb={1} fontSize="sm" fontWeight="medium">
          Disabled
        </Text>
        <NumberInput
          placeholder="123"
          isDisabled
          aria-label="Disabled number input"
        />
      </Box>
      <Box>
        <Text mb={1} fontSize="sm" fontWeight="medium">
          Invalid
        </Text>
        <NumberInput
          placeholder="123"
          isInvalid
          aria-label="Invalid number input"
        />
      </Box>
    </Stack>
  ),
};

export const NumberConstraints: Story = {
  render: () => (
    <Stack align="flex-start">
      <Box>
        <Text mb={1} fontSize="sm" fontWeight="medium">
          Min/Max (1-100)
        </Text>
        <NumberInput
          placeholder="Enter 1-100"
          minValue={1}
          maxValue={100}
          aria-label="Min/Max number input"
        />
      </Box>
      <Box>
        <Text mb={1} fontSize="sm" fontWeight="medium">
          Step (increments of 5)
        </Text>
        <NumberInput
          placeholder="Multiples of 5"
          step={5}
          aria-label="Step number input"
        />
      </Box>
      <Box>
        <Text mb={1} fontSize="sm" fontWeight="medium">
          Decimal precision
        </Text>
        <NumberInput
          placeholder="2 decimal places"
          step={0.01}
          aria-label="Decimal precision number input"
        />
      </Box>
    </Stack>
  ),
};

export const AllCombinations: Story = {
  render: () => (
    <Stack>
      {inputSize.map((size) => (
        <Box key={String(size)}>
          <Text mb={2} fontSize="lg" fontWeight="bold">
            Size: {String(size)}
          </Text>
          <Stack direction="row" wrap="wrap">
            {inputVariants.map((variant) => (
              <Box key={String(variant)} minW="200px">
                <Text mb={1} fontSize="sm" fontWeight="medium">
                  {String(variant)}
                </Text>
                <Stack>
                  <NumberInput
                    size={size}
                    variant={variant}
                    placeholder="123"
                    aria-label={`${String(variant)} ${String(size)} default`}
                  />
                  <NumberInput
                    size={size}
                    variant={variant}
                    defaultValue={123}
                    aria-label={`${String(variant)} ${String(size)} with value`}
                  />
                  <NumberInput
                    size={size}
                    variant={variant}
                    placeholder="123"
                    isInvalid
                    aria-label={`${String(variant)} ${String(size)} invalid`}
                  />
                  <NumberInput
                    size={size}
                    variant={variant}
                    placeholder="123"
                    isDisabled
                    aria-label={`${String(variant)} ${String(size)} disabled`}
                  />
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  ),
};

export const LeadingAndTrailingElements: Story = {
  render: () => {
    const examples: Array<{
      label: string;
      props?: React.ComponentProps<typeof NumberInput>;
      getProps?: (
        size: "sm" | "md"
      ) => React.ComponentProps<typeof NumberInput>;
    }> = [
      {
        label: "Leading Icon",
        props: {
          placeholder: "Search amount...",
          leadingElement: <Search />,
          "aria-label": "search-number-input",
        },
      },
      {
        label: "Trailing Icon",
        props: {
          placeholder: "Enter quantity",
          trailingElement: <Visibility />,
          "aria-label": "quantity-input",
        },
      },
      {
        label: "Both Icons",
        props: {
          placeholder: "Product price",
          leadingElement: <Icon as={Search} />,
          trailingElement: <Icon as={AddBox} />,
          "aria-label": "price-input",
        },
      },
      {
        label: "IconButton Elements",
        getProps: (size: "sm" | "md") => ({
          placeholder: "Advanced number input",
          leadingElement: (
            <IconButton
              size={size === "sm" ? "2xs" : "xs"}
              tone="primary"
              variant="ghost"
              aria-label="number options"
            >
              <Icon as={AddReaction} />
            </IconButton>
          ),
          trailingElement: (
            <IconButton
              size={size === "sm" ? "2xs" : "xs"}
              tone="primary"
              variant="ghost"
              aria-label="clear"
            >
              <Icon as={Close} />
            </IconButton>
          ),
          "aria-label": "advanced-number-input",
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
                        <NumberInput
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

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<number | undefined>(0);

    return (
      <Box>
        <Text mb={2}>
          Current value: {value !== undefined ? value : "undefined"}
        </Text>
        <NumberInput
          value={value}
          onChange={setValue}
          placeholder="Enter a number"
          aria-label="Controlled number input"
        />
      </Box>
    );
  },
};

export const WithFormField: Story = {
  render: () => {
    const [value, setValue] = useState<number | undefined>();

    return (
      <Stack direction="column" gap="600">
        {/* Basic FormField integration */}
        <Box>
          <Text fontWeight="bold" mb="300">
            Basic FormField Integration
          </Text>
          <FormField.Root data-testid="basic-form-field">
            <FormField.Label>Quantity</FormField.Label>
            <FormField.Input>
              <NumberInput
                placeholder="Enter quantity..."
                value={value}
                onChange={setValue}
                data-testid="basic-number-input"
              />
            </FormField.Input>
            <FormField.Description>
              This is a number input wrapped in a FormField component.
            </FormField.Description>
          </FormField.Root>
        </Box>

        {/* Required field */}
        <Box>
          <Text fontWeight="bold" mb="300">
            Required Field
          </Text>
          <FormField.Root isRequired data-testid="required-form-field">
            <FormField.Label>Required Amount</FormField.Label>
            <FormField.Input>
              <NumberInput
                placeholder="This field is required..."
                data-testid="required-number-input"
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
            <FormField.Label>Invalid Amount</FormField.Label>
            <FormField.Input>
              <NumberInput
                placeholder="This field has an error..."
                data-testid="invalid-number-input"
              />
            </FormField.Input>
            <FormField.Description>
              This field shows how error styling is applied.
            </FormField.Description>
            <FormField.Error>The value must be greater than 0.</FormField.Error>
          </FormField.Root>
        </Box>

        {/* Disabled field */}
        <Box>
          <Text fontWeight="bold" mb="300">
            Disabled Field
          </Text>
          <FormField.Root isDisabled data-testid="disabled-form-field">
            <FormField.Label>Disabled Amount</FormField.Label>
            <FormField.Input>
              <NumberInput
                placeholder="This field is disabled..."
                defaultValue={100}
                data-testid="disabled-number-input"
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
            <FormField.Label>Read-only Amount</FormField.Label>
            <FormField.Input>
              <NumberInput
                defaultValue={250}
                data-testid="readonly-number-input"
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
            <FormField.Label>Critical Amount</FormField.Label>
            <FormField.Input>
              <NumberInput
                placeholder="This required field has an error..."
                data-testid="required-invalid-number-input"
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

        {/* With constraints */}
        <Box>
          <Text fontWeight="bold" mb="300">
            With Number Constraints
          </Text>
          <FormField.Root data-testid="constraints-form-field">
            <FormField.Label>Price (1-1000)</FormField.Label>
            <FormField.Input>
              <NumberInput
                placeholder="Enter price..."
                minValue={1}
                maxValue={1000}
                step={0.01}
                data-testid="constraints-number-input"
              />
            </FormField.Input>
            <FormField.Description>
              Price must be between $1.00 and $1000.00 with 2 decimal places.
            </FormField.Description>
          </FormField.Root>
        </Box>

        {/* With info box */}
        <Box>
          <Text fontWeight="bold" mb="300">
            With Info Box
          </Text>
          <FormField.Root data-testid="info-form-field">
            <FormField.Label>Weight (kg)</FormField.Label>
            <FormField.Input>
              <NumberInput
                placeholder="Enter weight in kg..."
                step={0.1}
                minValue={0}
                data-testid="info-number-input"
              />
            </FormField.Input>
            <FormField.Description>
              Click the info icon next to the label for more details.
            </FormField.Description>
            <FormField.InfoBox>
              Enter the weight in kilograms. The value should be a positive
              number with up to one decimal place. For example: 75.5 kg.
            </FormField.InfoBox>
          </FormField.Root>
        </Box>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Basic integration - label is linked to input", async () => {
      const basicInput = canvas.getByTestId("basic-number-input");
      const basicLabel = canvas.getByText("Quantity");

      await expect(basicInput).toHaveAttribute(
        "aria-labelledby",
        basicLabel.id
      );
    });

    await step(
      "Basic integration - description is linked to input",
      async () => {
        const basicInput = canvas.getByTestId("basic-number-input");
        const description = canvas.getByText(/This is a number input wrapped/);

        await expect(basicInput).toHaveAttribute(
          "aria-describedby",
          description.id
        );
      }
    );

    await step("Required field - has required attribute", async () => {
      const requiredInput = canvas.getByTestId("required-number-input");
      const requiredLabel = canvas.getByText("Required Amount");

      await expect(requiredInput).toHaveAttribute("aria-required", "true");
      // Check for asterisk in label
      await expect(requiredLabel.innerHTML).toContain("*");
    });

    await step(
      "Invalid field - has invalid attributes and shows error",
      async () => {
        const invalidInput = canvas.getByTestId("invalid-number-input");
        const errorMessage = canvas.getByText(
          /The value must be greater than 0/
        );

        await expect(invalidInput).toHaveAttribute("data-invalid", "true");
        await expect(errorMessage).toBeVisible();
        await expect(invalidInput.getAttribute("aria-describedby")).toContain(
          errorMessage.id
        );
      }
    );

    await step(
      "Disabled field - is disabled and cannot be focused",
      async () => {
        const disabledInput = canvas.getByTestId("disabled-number-input");

        await expect(disabledInput).toBeDisabled();

        // Try to focus and type - should not work
        await userEvent.tab();
        await expect(disabledInput).not.toHaveFocus();

        // Try to type - should not work
        await userEvent.type(disabledInput, "123");
        await expect(disabledInput).toHaveValue("100");
      }
    );

    await step("Read-only field - has readonly attribute", async () => {
      const readonlyInput = canvas.getByTestId("readonly-number-input");

      await expect(readonlyInput).toHaveAttribute("readonly");
      await expect(readonlyInput).toHaveValue("250");
    });

    await step("Combined states - required + invalid field", async () => {
      const combinedInput = canvas.getByTestId("required-invalid-number-input");
      const combinedLabel = canvas.getByText("Critical Amount");
      const combinedError = canvas.getByText(
        /This required field cannot be empty/
      );

      await expect(combinedInput).toHaveAttribute("aria-required", "true");
      await expect(combinedInput).toHaveAttribute("data-invalid", "true");
      await expect(combinedLabel.innerHTML).toContain("*");
      await expect(combinedError).toBeVisible();
    });

    await step("Number constraints work within FormField", async () => {
      const constraintsInput = canvas.getByTestId("constraints-number-input");

      await userEvent.click(constraintsInput);
      await userEvent.type(constraintsInput, "50.99");

      await expect(constraintsInput).toHaveValue("50.99");

      // Clean up
      await userEvent.clear(constraintsInput);
    });

    await step("Info box functionality works", async () => {
      const infoButton = canvas.getByRole("button", { name: "__MORE INFO" });

      await expect(infoButton).toBeInTheDocument();

      // Click to open info box
      await userEvent.click(infoButton);
      const infoBox = within(document.body).getByText(
        /Enter the weight in kilograms/
      );
      await expect(infoBox).toBeInTheDocument();

      // Close with Escape
      await userEvent.keyboard("{Escape}");
      const infoBoxAfterEscape = within(document.body).queryByText(
        /Enter the weight in kilograms/
      );
      await expect(infoBoxAfterEscape).not.toBeInTheDocument();
    });

    await step(
      "Number input functionality works within FormField",
      async () => {
        const basicInput = canvas.getByTestId("basic-number-input");

        await userEvent.click(basicInput);
        await userEvent.type(basicInput, "42");

        await expect(basicInput).toHaveValue("42");

        // Clean up
        await userEvent.clear(basicInput);
      }
    );
  },
};

export const LocaleFormatting: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <Box>
        <Text mb={2} fontSize="lg" fontWeight="bold">
          Locale-based Number Formatting
        </Text>
        <Text mb={4} fontSize="sm" color="gray.600">
          NumberInput respects I18nProvider locale for consistent formatting
        </Text>
      </Box>

      <Box>
        <Text mb={2} fontSize="md" fontWeight="medium">
          US Locale (en-US) - Default
        </Text>
        <Stack direction="row" align="flex-start" gap="300">
          <Box>
            <Text mb={1} fontSize="sm">
              Number A
            </Text>
            <NumberInput defaultValue={1234.56} aria-label="US locale number" />
          </Box>
          <Box>
            <Text mb={1} fontSize="sm">
              Number B
            </Text>
            <NumberInput
              defaultValue={9876.54}
              aria-label="US locale number 2"
            />
          </Box>
        </Stack>
      </Box>

      <I18nProvider locale="de-DE">
        <Box>
          <Text mb={2} fontSize="md" fontWeight="medium">
            German Locale (de-DE) - Periods for thousands, comma for decimals
          </Text>
          <Stack direction="row" align="flex-start" gap="300">
            <Box>
              <Text mb={1} fontSize="sm">
                Number A
              </Text>
              <NumberInput
                defaultValue={1234.56}
                aria-label="German locale number"
              />
            </Box>
            <Box>
              <Text mb={1} fontSize="sm">
                Number B
              </Text>
              <NumberInput
                defaultValue={9876.54}
                aria-label="German locale number 2"
              />
            </Box>
          </Stack>
        </Box>
      </I18nProvider>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // US locale formatting (commas for thousands, periods for decimals)
    const usNumber1 =
      canvas.getByLabelText<HTMLInputElement>("US locale number");
    const usNumber2 =
      canvas.getByLabelText<HTMLInputElement>("US locale number 2");
    await expect(usNumber1).toHaveValue("1,234.56");
    await expect(usNumber2).toHaveValue("9,876.54");

    // German locale formatting (periods for thousands, comma for decimals)
    const deNumber1 = canvas.getByLabelText<HTMLInputElement>(
      "German locale number"
    );
    const deNumber2 = canvas.getByLabelText<HTMLInputElement>(
      "German locale number 2"
    );
    // German locale uses periods for thousands and commas for decimals
    await expect(deNumber1.value).toContain("1.234");
    await expect(deNumber1.value).toContain(",56");
    await expect(deNumber2.value).toContain("9.876");
    await expect(deNumber2.value).toContain(",54");
  },
};
