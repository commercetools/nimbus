import type { Meta, StoryObj } from "@storybook/react";
import { FormField, type FormFieldProps } from "./index";
import { Box, TextInput, Select } from "@/components";

const meta: Meta<typeof FormField.Root> = {
  title: "components/FormField",
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
      <FormField.Root {...args}>
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
};

export const WithDescription: Story = {
  args: defaultArgs,
  render: (args) => {
    return (
      <FormField.Root {...args}>
        <FormField.Label>Input Label (column)</FormField.Label>
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
};

export const RowDirection: Story = {
  args: {
    ...defaultArgs,
    direction: "row",
  },
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
      </FormField.Root>
    );
  },
};

export const Required: Story = {
  args: {
    ...defaultArgs,
    isRequired: true,
  },
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
      </FormField.Root>
    );
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
};

export const LongLabel: Story = {
  args: {
    ...defaultArgs,
    direction: "row",
  },
  render: (args) => {
    return (
      <Box width="384px">
        <FormField.Root {...args}>
          <FormField.Label>Super long Input Label (row)</FormField.Label>
          <FormField.Input>
            <TextInput placeholder="Enter some text here" type="text" />
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
  args: defaultArgs,
  render: (args) => {
    return (
      <Box width="384px">
        <FormField.Root {...args}>
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
