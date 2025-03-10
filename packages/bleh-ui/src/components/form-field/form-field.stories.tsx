import type { Meta, StoryObj } from "@storybook/react";
import { FormField } from "./form-field";
import { Stack } from "./../stack";
import { Input } from "react-aria-components";
import { Box, Heading } from "@/components";

const meta: Meta<typeof FormField.Root> = {
  title: "components/FormField",
  component: FormField.Root,
};

export default meta;

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
  args: {},
  render: () => {
    return (
      <FormField.Root>
        <FormField.Label>Input Label (column)</FormField.Label>
        <FormField.Input>
          <Input type="text" />
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
  args: {},
  render: () => {
    return (
      <FormField.Root>
        <FormField.Label>Input Label (row)</FormField.Label>
        <FormField.Input>
          <Input type="text" />
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
