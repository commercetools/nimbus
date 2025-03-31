import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./alert";
import { Stack } from "./../stack";
import { Button } from "../button";
import type { AlertProps } from "./alert.types";

const tones: AlertProps["tone"][] = ["critical", "info", "warning", "positive"];
const variants: AlertProps["variant"][] = ["plain", "solid"];

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
        <Alert.Dismiss onClick={() => alert("Dismissed")} />
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
        {tones.map((tone) => (
          <Alert key={`alert-${tone as string}`} tone={tone} variant="solid">
            <Alert.Title>Alert Title</Alert.Title>
            <Alert.Description>Alert Description</Alert.Description>
            <Alert.Actions>
              <Stack direction="row" gap="8px" alignItems="center">
                <Button variant="outline">Dismiss</Button>
                <Button variant="outline">Button</Button>
              </Stack>
            </Alert.Actions>
            <Alert.Dismiss onClick={() => alert("Dismissed")} />
          </Alert>
        ))}
      </Stack>
    );
  },

  args: {},
};

/**
 * Showcase Variants
 */
export const Variants: Story = {
  render: () => {
    return (
      <Stack direction="column" gap="400">
        {tones.map((tone) => (
          <Stack
            key={`stack-${tone as string}`}
            direction="row"
            gap="400"
            alignItems="center"
          >
            {variants.map((variant) => {
              return (
                <Alert
                  key={`alert-${tone as string}-${variant as string}`}
                  tone={tone}
                  variant={variant}
                >
                  <Alert.Title>Alert Title</Alert.Title>
                  <Alert.Description>Alert Description</Alert.Description>
                  <Alert.Actions>
                    <Stack direction="row" gap="8px" alignItems="center">
                      <Button variant="outline">Dismiss</Button>
                      <Button variant="outline">Button</Button>
                    </Stack>
                  </Alert.Actions>
                  <Alert.Dismiss onClick={() => alert("Dismissed")} />
                </Alert>
              );
            })}
          </Stack>
        ))}
      </Stack>
    );
  },

  args: {},
};

export const PartialChildren: Story = {
  render: () => {
    return (
      <Stack direction="column" gap="400">
        {/* Alert with only a Title */}
        <Alert tone="positive" variant="solid">
          <Alert.Title>Title Only</Alert.Title>
        </Alert>

        {/* Alert with only a Description */}
        <Alert tone="info" variant="solid">
          <Alert.Description>Description Only</Alert.Description>
        </Alert>

        {/* Alert with Title and Actions, but no Description */}
        <Alert tone="warning" variant="solid">
          <Alert.Title>Title and Actions, no Description</Alert.Title>
          <Alert.Actions>
            <Stack direction="row" gap="8px" alignItems="center">
              <Button variant="outline">Whatever</Button>
              <Button variant="solid">We</Button>
              <Button variant="subtle">Want</Button>
              <Button variant="ghost">Here</Button>
            </Stack>
          </Alert.Actions>
        </Alert>

        {/* Alert with only a Dismiss icon */}
        <Alert tone="critical" variant="solid">
          <Alert.Dismiss onClick={() => alert("Dismissed")} />
        </Alert>

        {/* Alert with Title, Description, and Dismiss but no actions */}
        <Alert tone="positive" variant="solid">
          <Alert.Title>A More Complete Alert</Alert.Title>
          <Alert.Description>
            We have both title and description here!
          </Alert.Description>
          <Alert.Dismiss onClick={() => alert("Dismissed")} />
        </Alert>
      </Stack>
    );
  },
  args: {},
};
