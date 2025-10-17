import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Box,
  FormField,
  type FormFieldProps,
  Select,
  Stack,
  TextInput,
} from "@commercetools/nimbus";
import { userEvent, within, expect } from "storybook/test";

const meta: Meta<typeof FormField.Root> = {
  title: "Components/FormField",
  component: FormField.Root,
  argTypes: {
    direction: {
      options: ["row", "column"],
      control: { type: "radio" },
    },
  },
};

export default meta;

const defaultArgs: FormFieldProps = {
  isInvalid: false,
  isRequired: false,
  isReadOnly: false,
  isDisabled: false,
  direction: "column",
};

const sizes: FormFieldProps["size"][] = ["sm", "md"];

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof FormField.Root>;

/**
 * Base story
 * Demonstrates the most basic implementation
 * Uses the args pattern for dynamic control panel inputs
 */
export const Base: Story = {
  args: defaultArgs,
  render: (args) => {
    return (
      <FormField.Root {...args} data-testid="field-root">
        <FormField.Label>Input Label (column)</FormField.Label>
        <FormField.Input>
          <TextInput placeholder="Enter some text here" type="text" />
        </FormField.Input>
        <FormField.Error>
          An error text which should only appear if the field gets an isInvalid
          prop
        </FormField.Error>
      </FormField.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByText("Input Label (column)");
    const input = canvas.getByRole("textbox");

    await step("Label is rendered", async () => {
      await expect(label).toBeInTheDocument();
    });

    await step("Input is rendered correctly", async () => {
      await expect(input).toBeInTheDocument();
      await expect(input.tagName).toBe("INPUT");
    });

    await step("Error message is not in the DOM", async () => {
      await expect(canvas.queryByText(/An error text/)).not.toBeInTheDocument();
    });

    await step("Input is linked to label", async () => {
      await expect(input).toHaveAttribute("aria-labelledby", label.id);
    });
  },
};

/**
 * Sizes story
 */
export const Sizes: Story = {
  args: defaultArgs,
  render: (args) => {
    return (
      <Stack direction="column">
        {sizes.map((size) => (
          <FormField.Root
            key={size as string}
            {...args}
            size={size}
            data-testid="field-root"
          >
            <FormField.Label>Input Label (column)</FormField.Label>
            <FormField.Input>
              <TextInput placeholder="Enter some text here" type="text" />
            </FormField.Input>
            <FormField.Description>I am descriptive</FormField.Description>
            <FormField.Error>
              An error text which should only appear if the field gets an
              isInvalid prop
            </FormField.Error>
          </FormField.Root>
        ))}
      </Stack>
    );
  },
};

export const WithDescription: Story = {
  args: defaultArgs,
  render: (args) => {
    return (
      <FormField.Root {...args} data-testid="form-field">
        <FormField.Label>Input Label (column)</FormField.Label>
        <FormField.Input>
          <TextInput
            placeholder="Enter some text here"
            type="text"
            data-testid="text-input"
          />
        </FormField.Input>
        <FormField.Description>
          Above you see a regular text input, fill it with text and hope that it
          validates.
        </FormField.Description>
        <FormField.Error>
          An error text which should only appear if the field gets an isInvalid
          prop
        </FormField.Error>
      </FormField.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");
    const description = canvas.getByText(/Above you see a regular text input/);

    await step("FormField has a visible description text", async () => {
      await expect(description).toBeInTheDocument();
      await expect(description).toBeVisible();
    });

    await step("Description text is linked to input", async () => {
      await expect(input).toHaveAttribute("aria-describedby", description.id);
    });
  },
};

export const RowDirection: Story = {
  args: {
    ...defaultArgs,
    direction: "row",
  },
  render: (args) => {
    return (
      <FormField.Root {...args} data-testid="row-form-field">
        <FormField.Label>Input Label (row)</FormField.Label>
        <FormField.Input>
          <TextInput
            placeholder="Enter some text here"
            type="text"
            data-testid="row-input"
          />
        </FormField.Input>
        <FormField.Description>
          Above you see a regular text input, fill it with text and hope that it
          validates.
        </FormField.Description>
        <FormField.Error>
          An error text which should only appear if the field gets an isInvalid
          prop
        </FormField.Error>
      </FormField.Root>
    );
  },
};

export const Invalid: Story = {
  args: {
    ...defaultArgs,
    isInvalid: true,
  },
  render: (args) => {
    return (
      <FormField.Root {...args} data-testid="invalid-form-field">
        <FormField.Label>Input Label (row)</FormField.Label>
        <FormField.Input>
          <TextInput placeholder="Enter some text here" type="text" />
        </FormField.Input>
        <FormField.Description>
          Above you see a regular text input, fill it with text and hope that it
          validates.
        </FormField.Description>
        <FormField.Error>
          An error text which should only appear if the field gets an isInvalid
          prop
        </FormField.Error>
      </FormField.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");
    const errorMessage = canvas.getByText(/An error text/);

    await step("Error message is visible + linked to input", async () => {
      await expect(errorMessage).toBeVisible();
      await expect(input.getAttribute("aria-describedby")).toContain(
        errorMessage.id
      );
    });

    await step("Input has invalid attributes", async () => {
      await expect(input).toHaveAttribute("data-invalid", "true");
    });
  },
};

export const Required: Story = {
  args: {
    ...defaultArgs,
    isRequired: true,
  },
  render: (args) => {
    return (
      <FormField.Root {...args} data-testid="required-form-field">
        <FormField.Label>Input Label (row)</FormField.Label>
        <FormField.Input>
          <TextInput placeholder="Enter some text here" type="text" />
        </FormField.Input>
        <FormField.Description>
          Above you see a regular text input, fill it with text and hope that it
          validates.
        </FormField.Description>
        <FormField.Error>
          An error text which should only appear if the field gets an isInvalid
          prop
        </FormField.Error>
      </FormField.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByText(/Input Label/);
    const input = canvas.getByRole("textbox");

    await step("Label should indicate required field", async () => {
      await expect(label.innerHTML).toContain("*");
    });

    await step("Input has required attribute", async () => {
      await expect(input).toHaveAttribute("aria-required");
    });
  },
};

export const MoreInfoBox: Story = {
  args: defaultArgs,
  render: (args) => {
    return (
      <FormField.Root {...args}>
        <FormField.Label>Input Label (row)</FormField.Label>
        <FormField.Input>
          <TextInput placeholder="Enter some text here" type="text" />
        </FormField.Input>
        <FormField.Description>
          Above you see a regular text input, fill it with text and hope that it
          validates.
        </FormField.Description>
        <FormField.Error>
          An error text which should only appear if the field gets an isInvalid
          prop
        </FormField.Error>
        <FormField.InfoBox>
          Show me in a tooltip box or something
        </FormField.InfoBox>
      </FormField.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const infoButton = canvas.getByRole("button");

    await step("InfoButton is visible", async () => {
      await expect(infoButton).toBeInTheDocument();
    });

    await step("InfoButton click opens InfoBox", async () => {
      await userEvent.click(infoButton);
      const infoBox = within(document.body).getByText(/Show me in a tooltip/);
      await expect(infoBox).toBeInTheDocument();
    });

    await step("Esc closes the InfoBox", async () => {
      await userEvent.keyboard("{Escape}");
      const infoBoxAfterEscape = within(document.body).queryByText(
        /Show me in a tooltip/
      );
      await expect(infoBoxAfterEscape).not.toBeInTheDocument();
    });
  },
};

export const LongLabel: Story = {
  args: {
    ...defaultArgs,
    direction: "row",
  },
  render: (args) => {
    return (
      <Box width="384px">
        <FormField.Root {...args} data-testid="long-label-form-field">
          <FormField.Label>Super long Input Label (row)</FormField.Label>
          <FormField.Input>
            <TextInput
              placeholder="Enter some text here"
              type="text"
              data-testid="long-label-input"
            />
          </FormField.Input>
          <FormField.Description>
            Above you see a regular text input, fill it with text and hope that
            it validates.
          </FormField.Description>
          <FormField.Error>
            An error text which should only appear if the field gets an
            isInvalid prop
          </FormField.Error>
          <FormField.InfoBox>
            {new Array(48)
              .fill("Show me in a tooltip box or something")
              .join(" ")}
          </FormField.InfoBox>
        </FormField.Root>
      </Box>
    );
  },
};

export const UsingASelectInput: Story = {
  args: { ...defaultArgs, isInvalid: true },
  render: (args) => {
    return (
      <Box width="384px">
        <FormField.Root {...args} data-testid="select-form-field">
          <FormField.Label>Super long Input Label (row)</FormField.Label>
          <FormField.Input>
            <Select.Root aria-label="Select a fruit" data-testid="select">
              <Select.Options>
                <Select.Option>Apples</Select.Option>
                <Select.Option>Bananas</Select.Option>
                <Select.Option>Oranges</Select.Option>
                <Select.Option>Cherries</Select.Option>
              </Select.Options>
            </Select.Root>
          </FormField.Input>
          <FormField.Description>
            Above you see a Select input. Click it to open and pick a fruit.
          </FormField.Description>
          <FormField.Error>
            An error text which should only appear if the field gets an
            isInvalid prop
          </FormField.Error>
          <FormField.InfoBox>
            {new Array(48)
              .fill("Show me in a tooltip box or something")
              .join(" ")}
          </FormField.InfoBox>
        </FormField.Root>
      </Box>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByTestId("select");
    const selectTrigger = within(select).getByRole("button");
    const label = canvas.getByText(/Super long Input Label/);
    const description = canvas.getByText(/Above you see a Select input/);
    const error = canvas.getByText(/An error text /);

    await step("All elements are rendered correctly", async () => {
      await expect(select).toBeInTheDocument();
      await expect(label).toBeInTheDocument();
      await expect(description).toBeInTheDocument();
      await expect(error).toBeInTheDocument();
    });

    await step(
      "Label, Description and Error are labeling/describing the Select",
      async () => {
        await expect(select).toHaveAttribute("data-invalid", "true");

        await expect(selectTrigger.getAttribute("aria-labelledby")).toContain(
          label.id
        );
        await expect(selectTrigger.getAttribute("aria-describedby")).toContain(
          error.id
        );
        await expect(selectTrigger.getAttribute("aria-describedby")).toContain(
          error.id
        );
        await expect(selectTrigger.getAttribute("aria-describedby")).toContain(
          description.id
        );
      }
    );
  },
};
