import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Box,
  FormField,
  Icon,
  IconButton,
  SearchInput,
  Stack,
  Text,
} from "@commercetools/nimbus";
import { userEvent, within, expect, fn } from "storybook/test";
import { Tune, Visibility } from "@commercetools/nimbus-icons";

const meta: Meta<typeof SearchInput> = {
  title: "Components/SearchInput",
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

    await step("Forwards aria-attributes", async () => {
      await expect(input).toHaveAttribute("aria-label", "test-search-input");
    });

    await step("Is focusable with <tab> key", async () => {
      await userEvent.tab();
      await expect(input).toHaveFocus();
    });

    await step(
      "Clicking the field (icon / padding, not just the input) focuses the input",
      async () => {
        input.blur();
        await expect(input).not.toHaveFocus();
        // The root wraps the icon + padding; clicking it should focus the input.
        const root = canvasElement.querySelector<HTMLElement>(
          ".nimbus-search-input__root"
        );
        await expect(root).not.toBeNull();
        await userEvent.click(root!);
        await expect(input).toHaveFocus();
      }
    );

    await step("Can type text", async () => {
      await userEvent.type(input, "Search query");
      await expect(input).toHaveValue("Search query");
      await userEvent.clear(input);
    });

    await step("Clear button appears when typing", async () => {
      await expect(canvas.queryByRole("button")).not.toBeInTheDocument();
      await userEvent.type(input, "test");
      await expect(canvas.getByRole("button")).toBeVisible();
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
    defaultValue: "Some search text",
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
      await expect(input).toHaveValue("Some search text");
    });

    await step("Clear button is disabled when input is disabled", async () => {
      // Scope the button query to this input's root slot, which also
      // contains the clear button. The story renders multiple variants, so an
      // unscoped query would be ambiguous.
      const searchFieldContainer = input.closest<HTMLElement>(
        ".nimbus-search-input__root"
      );
      if (!searchFieldContainer)
        throw new Error("Could not find SearchField container");

      const containerScope = within(searchFieldContainer);
      const clearButton = containerScope.getByRole("button");
      await expect(clearButton).toBeDisabled();
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

/** Distinct composite: undimmed field (no `data-readonly` rule) + disabled clear button. */
export const ReadOnly: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
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

    await step("Clear button is disabled when input is readonly", async () => {
      const clearButton = canvas.getByRole("button");
      await expect(clearButton).toBeDisabled();
    });

    // Blur the click-focused input so no stray focus ring lands in the snapshot.
    input.blur();
  },
};

/** Focus ring (`_focusWithin`) the matrix can't render; caret hidden for determinism. */
export const Focused: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <SearchInput defaultValue="Focused search" aria-label="focused-search" />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("focused-search");

    // Caret blink is browser-native, not a CSS/JS animation Chromatic can pause;
    // caret-color inherits, so hiding it here cascades to the input.
    canvasElement.style.caretColor = "transparent";

    await userEvent.tab();
    await expect(input).toHaveFocus();
  },
};

/** Value-driven clear button (absent from the empty matrix): enabled + disabled surfaces. */
export const WithClearButton: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack direction="row" gap="400" alignItems="center">
      <SearchInput defaultValue="Search query" aria-label="clear-enabled" />
      <SearchInput
        defaultValue="Search query"
        isDisabled
        aria-label="clear-disabled"
      />
    </Stack>
  ),
};

/** RTL mirrors the layout: the leading search icon and trailing clear button swap sides. */
export const RTLSupport: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack direction="column" gap="400">
      <Box>
        <Text mb="200">LTR direction (left-to-right)</Text>
        <SearchInput defaultValue="Search query" aria-label="ltr-search" />
      </Box>
      <Box dir="rtl" width="100%">
        <Text mb="200" textAlign="right">
          RTL direction (right-to-left)
        </Text>
        <SearchInput defaultValue="Search query" aria-label="rtl-search" />
      </Box>
    </Stack>
  ),
};

/** Resting-chrome matrix: state x size x variant, empty. No colorPalette axis (fixed tokens). */
export const SmokeTest: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
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

    await step("Clear button is not rendered when input is empty", async () => {
      await expect(canvas.queryByRole("button")).not.toBeInTheDocument();
    });

    await step("Clear button appears when typing", async () => {
      await userEvent.type(input, "search");
      await expect(canvas.getByRole("button")).toBeVisible();
    });

    await step("Clear button clears the input", async () => {
      const clearButton = canvas.getByRole("button");
      await userEvent.click(clearButton);
      await expect(input).toHaveValue("");
    });

    await step("Clear button is removed again after clearing", async () => {
      await expect(canvas.queryByRole("button")).not.toBeInTheDocument();
    });

    await step("Focus stays on the input after clearing", async () => {
      await expect(input).toHaveFocus();
    });
  },
};

/**
 * Empty field with a trailing button, per size (#2057). With no value there is
 * no clear button, so the button sits at the field's trailing edge.
 */
export const EmptyWithTrailingElement: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack direction="column" gap="400" alignItems="flex-start">
      {inputSize.map((size) => (
        <SearchInput
          key={size}
          size={size}
          placeholder={`Search (${size})`}
          aria-label={`empty-trailing-${size}`}
          trailingElement={
            <IconButton
              size={size === "sm" ? "2xs" : "xs"}
              colorPalette="primary"
              variant="ghost"
              aria-label="filter results"
            >
              <Icon as={Tune} />
            </IconButton>
          }
        />
      ))}
    </Stack>
  ),
};

/**
 * Regression for #2057: an empty field must not reserve space for the clear
 * button, so a trailing element sits at the field's trailing edge.
 */
export const TrailingElementAlignment: Story = {
  render: () => (
    <SearchInput
      aria-label="trailing-alignment"
      trailingElement={
        <IconButton
          size="xs"
          colorPalette="primary"
          variant="ghost"
          aria-label="filter results"
        >
          <Icon as={Tune} />
        </IconButton>
      }
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("searchbox");
    const root = canvasElement.querySelector<HTMLElement>(
      ".nimbus-search-input__root"
    )!;
    const trailingSlot = root.querySelector<HTMLElement>(
      ".nimbus-search-input__trailingElement"
    )!;

    // Right edge of the root's content box (no real border: it is a box-shadow).
    const contentEnd = () =>
      root.getBoundingClientRect().right -
      parseFloat(window.getComputedStyle(root).paddingRight);

    await step(
      "Empty: trailing element sits at the trailing edge",
      async () => {
        await expect(canvas.queryByLabelText("Clear search input")).toBeNull();
        await expect(trailingSlot.getBoundingClientRect().right).toBeCloseTo(
          contentEnd(),
          0
        );
      }
    );

    await step(
      "With value: clear button follows the trailing element",
      async () => {
        await userEvent.type(input, "query");
        const clearButton = canvas.getByLabelText("Clear search input");
        await expect(clearButton.getBoundingClientRect().right).toBeCloseTo(
          contentEnd(),
          0
        );
        await expect(trailingSlot.getBoundingClientRect().right).toBeLessThan(
          clearButton.getBoundingClientRect().left
        );
      }
    );
  },
};

/**
 * Space between the end of the input and what follows it: the trailing element
 * (less the gap) or the field's content edge. 0 means the placeholder can use
 * all of the field's free space.
 */
const spaceAfterInput = (root: HTMLElement) => {
  const rootStyle = window.getComputedStyle(root);
  const trailing = root.querySelector(".nimbus-search-input__trailingElement");
  const end = trailing
    ? trailing.getBoundingClientRect().left - parseFloat(rootStyle.columnGap)
    : root.getBoundingClientRect().right - parseFloat(rootStyle.paddingRight);
  return end - root.querySelector("input")!.getBoundingClientRect().right;
};

/**
 * The field's outline keeps its width when the clear button appears or goes
 * away. Fields are sized by their content, so any change would show.
 */
export const StableWidth: Story = {
  render: () => (
    <Stack direction="column" gap="400" alignItems="flex-start">
      {inputSize.map((size) => (
        <SearchInput key={size} size={size} aria-label={`stable-${size}`} />
      ))}
      {inputSize.map((size) => (
        <SearchInput
          key={size}
          size={size}
          aria-label={`stable-trailing-${size}`}
          trailingElement={
            <IconButton
              size={size === "sm" ? "2xs" : "xs"}
              colorPalette="primary"
              variant="ghost"
              aria-label={`filter results ${size}`}
            >
              <Icon as={Tune} />
            </IconButton>
          }
        />
      ))}
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const inputs = canvas.getAllByRole("searchbox");
    const rootOf = (input: HTMLElement) =>
      input.closest<HTMLElement>(".nimbus-search-input__root")!;
    const widthOf = (input: HTMLElement) =>
      rootOf(input).getBoundingClientRect().width;
    const emptyWidths = inputs.map(widthOf);

    await step(
      "Empty: the input reaches the trailing element or the field's edge",
      async () => {
        for (const input of inputs) {
          await expect(spaceAfterInput(rootOf(input))).toBeCloseTo(0, 0);
        }
      }
    );

    await step("Width does not change when typing", async () => {
      for (const [i, input] of inputs.entries()) {
        await userEvent.type(input, "query");
        await expect(
          within(rootOf(input)).getByLabelText("Clear search input")
        ).toBeVisible();
        await expect(widthOf(input)).toBeCloseTo(emptyWidths[i], 1);
      }
    });

    await step("Width does not change when clearing", async () => {
      for (const [i, input] of inputs.entries()) {
        await userEvent.click(
          within(rootOf(input)).getByLabelText("Clear search input")
        );
        await expect(input).toHaveValue("");
        await expect(widthOf(input)).toBeCloseTo(emptyWidths[i], 1);
      }
    });
  },
};

/**
 * Fields narrower than the input's default width (192px, token 4800). The
 * input must shrink so its text, the trailing element and the clear button
 * stay inside the field.
 */
export const NarrowField: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack direction="column" gap="400" alignItems="flex-start">
      {inputSize.map((size) => (
        <SearchInput
          key={size}
          size={size}
          width="4800"
          defaultValue="Search query"
          aria-label={`narrow-${size}`}
        />
      ))}
      <SearchInput
        width="4800"
        defaultValue="Search query"
        aria-label="narrow-trailing"
        trailingElement={
          <IconButton
            size="xs"
            colorPalette="primary"
            variant="ghost"
            aria-label="filter results"
          >
            <Icon as={Tune} />
          </IconButton>
        }
      />
      <SearchInput
        width="4800"
        placeholder="Search products by name or SKU"
        aria-label="narrow-placeholder"
      />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const roots = Array.from(
      canvasElement.querySelectorAll<HTMLElement>(".nimbus-search-input__root")
    );

    await step("Everything in the field stays inside its outline", async () => {
      for (const root of roots) {
        const outline = root.getBoundingClientRect();
        const input = root.querySelector("input")!;
        for (const child of [...Array.from(root.children), input]) {
          const box = child.getBoundingClientRect();
          await expect(Math.round(box.left)).toBeGreaterThanOrEqual(
            Math.round(outline.left)
          );
          await expect(Math.round(box.right)).toBeLessThanOrEqual(
            Math.round(outline.right)
          );
        }
      }
    });

    await step(
      "Empty: the placeholder can use the space up to the field's edge",
      async () => {
        const emptyRoot = roots.find(
          (root) => !root.querySelector("input")!.value
        )!;
        await expect(spaceAfterInput(emptyRoot)).toBeCloseTo(0, 0);
      }
    );
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
      await expect(clearButton).toBeVisible();
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
      await expect(canvas.getByRole("button")).toBeVisible();
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

        await expect(
          invalidInput.closest(".nimbus-search-input__root")
        ).toHaveAttribute("data-invalid", "true");
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
      await expect(
        combinedInput.closest(".nimbus-search-input__root")
      ).toHaveAttribute("data-invalid", "true");
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

/**
 * Leading and trailing adornments across both sizes and variants.
 *
 * `leadingElement` defaults to the search icon, so the first row is what every
 * other story renders; the remaining rows replace it, remove it, or add trailing
 * content. Each input carries a value so the built-in clear button is visible and
 * its spacing against a trailing element is captured.
 */
export const LeadingAndTrailingElements: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => {
    const examples: Array<{
      label: string;
      getProps: (size: "sm" | "md") => React.ComponentProps<typeof SearchInput>;
    }> = [
      {
        label: "Default leading icon",
        getProps: () => ({
          defaultValue: "Search query",
          "aria-label": "default-leading",
        }),
      },
      {
        label: "Replaced leading icon",
        getProps: () => ({
          defaultValue: "Search query",
          leadingElement: <Icon as={Visibility} aria-hidden="true" />,
          "aria-label": "replaced-leading",
        }),
      },
      {
        label: "No leading element",
        getProps: () => ({
          defaultValue: "Search query",
          leadingElement: null,
          "aria-label": "no-leading",
        }),
      },
      {
        label: "Trailing icon",
        getProps: () => ({
          defaultValue: "Search query",
          trailingElement: <Icon as={Tune} aria-hidden="true" />,
          "aria-label": "trailing-icon",
        }),
      },
      {
        label: "Trailing filter button",
        getProps: (size) => ({
          defaultValue: "Search query",
          trailingElement: (
            <IconButton
              size={size === "sm" ? "2xs" : "xs"}
              colorPalette="primary"
              variant="ghost"
              aria-label="filter results"
            >
              <Icon as={Tune} />
            </IconButton>
          ),
          "aria-label": "trailing-button",
        }),
      },
      {
        label: "Trailing button, disabled field",
        getProps: (size) => ({
          defaultValue: "Search query",
          isDisabled: true,
          trailingElement: (
            <IconButton
              size={size === "sm" ? "2xs" : "xs"}
              colorPalette="primary"
              variant="ghost"
              aria-label="filter results"
              isDisabled
            >
              <Icon as={Tune} />
            </IconButton>
          ),
          "aria-label": "trailing-button-disabled",
        }),
      },
    ];

    return (
      <Stack direction="column" gap="600">
        {inputSize.map((size) => (
          <Stack key={size} direction="column" gap="400">
            <Text fontWeight="semibold">Size: {size}</Text>
            <Stack direction="column" gap="300">
              {examples.map((example) => (
                <Stack
                  key={`${size}-${example.label}`}
                  direction="column"
                  gap="200"
                >
                  <Text fontSize="sm" color="neutral.11">
                    {example.label}
                  </Text>
                  <Stack direction="row" gap="400" alignItems="center">
                    {inputVariants.map((variant) => (
                      <Stack key={variant} direction="column" gap="100">
                        <Text fontSize="xs" color="neutral.10">
                          {variant}
                        </Text>
                        <SearchInput
                          {...example.getProps(size)}
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

/** RTL mirrors the adornment layout: leading and trailing elements swap sides. */
export const RTLSupportWithAdornments: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack direction="column" gap="400">
      <Box>
        <Text mb="200">LTR direction (left-to-right)</Text>
        <SearchInput
          defaultValue="Search query"
          trailingElement={<Icon as={Tune} aria-hidden="true" />}
          aria-label="ltr-adornments"
        />
      </Box>
      <Box dir="rtl" width="100%">
        <Text mb="200" textAlign="right">
          RTL direction (right-to-left)
        </Text>
        <SearchInput
          defaultValue="Search query"
          trailingElement={<Icon as={Tune} aria-hidden="true" />}
          aria-label="rtl-adornments"
        />
      </Box>
    </Stack>
  ),
};

/**
 * A trailing button is the motivating use case: an inline filter control that
 * lives inside the field but owns its own clicks.
 */
export const TrailingElementInteraction: Story = {
  render: () => {
    const onFilter = fn();
    return (
      <SearchInput
        defaultValue="Search query"
        aria-label="search-with-filter"
        trailingElement={
          <IconButton
            size="xs"
            colorPalette="primary"
            variant="ghost"
            aria-label="filter results"
            onPress={onFilter}
            data-testid="filter-button"
          >
            <Icon as={Tune} />
          </IconButton>
        }
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("searchbox");
    const filterButton = canvas.getByLabelText("filter results");

    await step(
      "Trailing element renders in the trailingElement slot",
      async () => {
        await expect(filterButton.parentElement).toHaveClass(
          "nimbus-search-input__trailingElement"
        );
      }
    );

    await step(
      "Trailing button is reachable by keyboard after the input",
      async () => {
        await userEvent.tab();
        await expect(input).toHaveFocus();
        await userEvent.tab();
        await expect(filterButton).toHaveFocus();
      }
    );

    await step("Activating it does not clear the value", async () => {
      await userEvent.click(filterButton);
      await expect(input).toHaveValue("Search query");
    });

    await step("Clicking it does not steal focus to the input", async () => {
      await expect(input).not.toHaveFocus();
    });
  },
};

/**
 * `leadingElement` is configurable: omitted keeps the search icon, an element
 * replaces it, and `null` removes it.
 */
export const LeadingElementConfiguration: Story = {
  render: () => (
    <Stack direction="column" gap="400">
      <SearchInput defaultValue="Default" aria-label="leading-default" />
      <SearchInput
        defaultValue="Replaced"
        aria-label="leading-replaced"
        leadingElement={<Icon as={Visibility} aria-hidden="true" />}
      />
      <SearchInput
        defaultValue="Removed"
        aria-label="leading-removed"
        leadingElement={null}
      />
      <SearchInput
        defaultValue="Interactive"
        aria-label="leading-interactive"
        leadingElement={
          <IconButton
            size="xs"
            colorPalette="primary"
            variant="ghost"
            aria-label="choose scope"
          >
            <Icon as={Tune} />
          </IconButton>
        }
      />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const slot = "nimbus-search-input__leadingElement";

    await step("Omitting the prop keeps the search icon", async () => {
      const field = canvas
        .getByLabelText("leading-default")
        .closest(".nimbus-search-input__root");
      await expect(field?.querySelector(`.${slot} svg`)).toBeInTheDocument();
    });

    await step(
      "Providing an element renders it in the leading slot",
      async () => {
        const field = canvas
          .getByLabelText("leading-replaced")
          .closest(".nimbus-search-input__root");
        await expect(field?.querySelector(`.${slot}`)).toBeInTheDocument();
      }
    );

    await step("Passing null renders no leading slot", async () => {
      const field = canvas
        .getByLabelText("leading-removed")
        .closest(".nimbus-search-input__root");
      await expect(field?.querySelector(`.${slot}`)).not.toBeInTheDocument();
    });

    await step("An interactive leading element receives clicks", async () => {
      const scopeButton = canvas.getByLabelText("choose scope");
      await expect(scopeButton.parentElement).toHaveClass(slot);
      await userEvent.click(scopeButton);
      await expect(scopeButton).toHaveFocus();
    });
  },
};
