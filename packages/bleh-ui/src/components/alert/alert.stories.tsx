import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./alert";
import { Stack } from "./../stack";
import { Button } from "../button";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof Alert> = {
  title: "components/Alert",
  component: Alert,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof Alert>;

/**
 * Base story
 * Demonstrates the most basic implementation
 * Uses the args pattern for dynamic control panel inputs
 */
export const Base: Story = {
  args: {
    tone: "positive",
    variant: "solid",
    children: (
      <>
        <Alert.Title>Alert Title</Alert.Title>
        <Alert.Description>Alert Description</Alert.Description>
        <Alert.Actions>
          <Stack direction="row" gap="8px" alignItems="center">
            <Button variant="outline">Dismiss</Button>
            <Button variant="outline">Button</Button>
          </Stack>
        </Alert.Actions>
        <Alert.Dismiss onClick={() => console.log("woooo")} />
      </>
    ),
  },
};

/**
 * Showcase Tones
 */
export const Sizes: Story = {
  render: () => {
    return (
      <Stack direction="column" gap="400" alignItems="center">
        {["critical", "info", "warning", "positive"].map((tone) => (
          <Alert key={`alert-${tone}`} tone={tone} variant="solid">
            <Alert.Title>Alert Title</Alert.Title>
            <Alert.Description>Alert Description</Alert.Description>
            <Alert.Actions>
              <Stack direction="row" gap="8px" alignItems="center">
                <Button variant="outline">Dismiss</Button>
                <Button variant="outline">Button</Button>
              </Stack>
            </Alert.Actions>
            <Alert.Dismiss onClick={() => console.log("woooo")} />
          </Alert>
        ))}
      </Stack>
    );
  },

  args: {
    children: "Demo Alert",
  },
};

/**
 * Showcase Variants
 */
export const Variants: Story = {
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {[].map((variant) => (
          <Alert key={variant} {...args} variant={variant} />
        ))}
      </Stack>
    );
  },

  args: {
    children: "Demo Alert",
  },
};

/**
 * Showcase Colors
 */
export const Colors: Story = {
  render: (args) => {
    return (
      <Stack>
        {[].map((colorPalette) => (
          <Stack
            key={colorPalette}
            direction="row"
            gap="400"
            alignItems="center"
          >
            {[].map((variant) => (
              <Alert
                key={variant}
                {...args}
                variant={variant}
                colorPalette={colorPalette}
              />
            ))}
          </Stack>
        ))}
      </Stack>
    );
  },

  args: {
    children: "Demo Alert",
  },
};
