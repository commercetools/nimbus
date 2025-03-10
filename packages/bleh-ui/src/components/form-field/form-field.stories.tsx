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
      <Stack>
        <Heading>Row Direction</Heading>
        <Box>
          <FormField.Root direction="row">
            <FormField.Label>Label</FormField.Label>
            <FormField.Input>
              <Input />
            </FormField.Input>
            <FormField.Description>Description</FormField.Description>
            <FormField.Error>Error</FormField.Error>
          </FormField.Root>
        </Box>
        <Heading>Column Direction</Heading>
        <Box>
          <FormField.Root direction="column">
            <FormField.Description>Description</FormField.Description>
            <FormField.Error>Error</FormField.Error>
            <FormField.Label>Label</FormField.Label>
            <FormField.Input>
              <Input />
            </FormField.Input>
          </FormField.Root>
        </Box>
      </Stack>
    );
  },
};
