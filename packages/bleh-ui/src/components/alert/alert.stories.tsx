import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, expect, fn } from "@storybook/test";
import { Alert } from "./alert";
import { Stack } from "./../stack";
import { Button } from "../button";
import type { AlertProps } from "./alert.types";

const tones: AlertProps["tone"][] = ["critical", "info", "warning", "positive"];
const variants: AlertProps["variant"][] = ["flat", "outlined"];

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

// Mock function for dismiss button onPress
const mockOnDismiss = fn();

/**
 * Base story
 * Demonstrates the most basic implementation with all parts.
 * Uses the args pattern for dynamic control panel inputs.
 * Includes interaction tests.
 */
export const Base: Story = {
  args: {
    tone: "positive",
    variant: "outlined",
    "data-testid": "base-alert",
    children: (
      <>
        <Alert.Title>Base Alert Title</Alert.Title>
        <Alert.Description>Base Alert Description</Alert.Description>
        <Alert.Actions>
          <Stack direction="row" gap="8px" alignItems="center">
            <Button variant="outline">Action 1</Button>
            <Button variant="outline">Action 2</Button>
          </Stack>
        </Alert.Actions>
        <Alert.DismissButton
          onPress={mockOnDismiss}
          data-testid="dismiss-button"
        />
      </>
    ),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const alertRoot = canvas.getByTestId("base-alert");
    const dismissButton = canvas.getByTestId("dismiss-button");
    // Find the icon inside the button
    const dismissIcon = within(dismissButton).getByRole("img", {
      hidden: true,
    });

    await step("Renders all parts correctly", async () => {
      await expect(alertRoot).toBeInTheDocument();
      await expect(alertRoot).toHaveAttribute("role", "alert");
      await expect(canvas.getByText("Base Alert Title")).toBeInTheDocument();
      await expect(
        canvas.getByText("Base Alert Description")
      ).toBeInTheDocument();
      await expect(canvas.getByText("Action 1")).toBeInTheDocument();
      await expect(canvas.getByText("Action 2")).toBeInTheDocument();
      await expect(dismissButton).toBeInTheDocument();
      await expect(dismissButton).toHaveAttribute("aria-label", "Dismiss"); // Default label from IconButton
      await expect(dismissIcon).toBeInTheDocument(); // Check if the clear icon is rendered
    });

    await step("Dismiss button is clickable and calls onPress", async () => {
      await userEvent.click(dismissButton);
      await expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });
  },
};

/**
 * Showcase Tones
 */
export const Tones: Story = {
  name: "Tones Showcase",
  render: () => {
    return (
      <Stack direction="column" gap="400" alignItems="flex-start">
        {tones.map((tone) => (
          <Alert
            key={`alert-${tone as string}`}
            tone={tone}
            variant="outlined"
            data-testid={`alert-${tone as string}`}
          >
            <Alert.Title>Alert Title ({tone as string})</Alert.Title>
            <Alert.Description>Alert Description</Alert.Description>
            <Alert.Actions>
              <Stack direction="row" gap="8px" alignItems="center">
                <Button variant="outline">Dismiss</Button>
                <Button variant="outline">Button</Button>
              </Stack>
            </Alert.Actions>
            <Alert.DismissButton
              onPress={() => alert(`Dismissed ${tone as string}`)}
            />
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
  name: "Variants Showcase",
  render: () => {
    return (
      <Stack direction="column" gap="400" alignItems="flex-start">
        {tones.map((tone) => (
          <Stack key={`stack-${tone as string}`} direction="row" gap="400">
            {variants.map((variant) => {
              return (
                <Alert
                  key={`alert-${tone as string}-${variant as string}`}
                  tone={tone}
                  variant={variant}
                  data-testid={`alert-${tone as string}-${variant as string}`}
                >
                  <Alert.Title>
                    {tone as string} / {variant as string}
                  </Alert.Title>
                  <Alert.Description>Alert Description</Alert.Description>
                  <Alert.Actions>
                    <Stack direction="row" gap="8px" alignItems="center">
                      <Button variant="outline">Action</Button>
                    </Stack>
                  </Alert.Actions>
                  <Alert.DismissButton onPress={() => alert("Dismissed")} />
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

// Mock functions for PartialChildren story
const mockDismissDismissOnly = fn();
const mockDismissCompleteNoActions = fn();

/**
 * Showcase Partial Children
 * Tests how the Alert component renders when some parts are omitted.
 */
export const PartialChildren: Story = {
  render: () => {
    // Note: We pass mock functions directly here as 'render' doesn't use 'args'
    return (
      <Stack direction="column" gap="400" alignItems="flex-start" width="100%">
        {/* Alert with only a Title */}
        <Alert
          tone="positive"
          variant="outlined"
          data-testid="alert-title-only"
        >
          <Alert.Title>Title Only</Alert.Title>
          {/* Intentionally omit Description, Actions, DismissButton */}
        </Alert>

        {/* Alert with only a Description */}
        <Alert tone="info" variant="flat" data-testid="alert-desc-only">
          <Alert.Description>Description Only</Alert.Description>
          {/* Intentionally omit Title, Actions, DismissButton */}
        </Alert>

        {/* Alert with Title and Actions, but no Description */}
        <Alert
          tone="warning"
          variant="outlined"
          data-testid="alert-title-actions"
        >
          <Alert.Title>Title and Actions only</Alert.Title>
          <Alert.Actions>
            <Stack direction="row" gap="8px" alignItems="center">
              <Button variant="outline">Whatever</Button>
              <Button variant="outline">We</Button>
              <Button variant="subtle">Want</Button>
              <Button variant="ghost">Here</Button>
            </Stack>
          </Alert.Actions>
          {/* Intentionally omit Description, DismissButton */}
        </Alert>

        {/* Alert with only a Dismiss icon */}
        <Alert tone="critical" variant="flat" data-testid="alert-dismiss-only">
          {/* Intentionally omit Title, Description, Actions */}
          <Alert.DismissButton
            onPress={mockDismissDismissOnly}
            data-testid="dismiss-only-button"
          />
        </Alert>

        {/* Alert with Title, Description, and Dismiss but no actions */}
        <Alert
          tone="positive"
          variant="outlined"
          data-testid="alert-no-actions"
        >
          <Alert.Title>A More Complete Alert (No Actions)</Alert.Title>
          <Alert.Description>
            We have both title and description here!
          </Alert.Description>
          {/* Intentionally omit Actions */}
          <Alert.DismissButton
            onPress={mockDismissCompleteNoActions}
            data-testid="dismiss-no-actions-button"
          />
        </Alert>
      </Stack>
    );
  },
  args: {},
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Title Only: Renders title, omits others", async () => {
      const alert = canvas.getByTestId("alert-title-only");
      await expect(within(alert).getByText("Title Only")).toBeInTheDocument();
      // Use queryBy for elements that shouldn't exist
      await expect(
        within(alert).queryByText(/Description/i)
      ).not.toBeInTheDocument();
      await expect(
        within(alert).queryByRole("button", { name: /Action/i }) // Check for action buttons
      ).not.toBeInTheDocument();
      await expect(
        within(alert).queryByRole("button", { name: /Dismiss/i }) // Check for dismiss button
      ).not.toBeInTheDocument();
    });

    await step(
      "Description Only: Renders description, omits others",
      async () => {
        const alert = canvas.getByTestId("alert-desc-only");
        await expect(
          within(alert).getByText("Description Only")
        ).toBeInTheDocument();
        await expect(
          within(alert).queryByText(/Title/i)
        ).not.toBeInTheDocument();
        await expect(
          within(alert).queryByRole("button", { name: /Action/i })
        ).not.toBeInTheDocument();
        await expect(
          within(alert).queryByRole("button", { name: /Dismiss/i })
        ).not.toBeInTheDocument();
      }
    );

    await step(
      "Title and Actions: Renders title and actions, omits others",
      async () => {
        const alert = canvas.getByTestId("alert-title-actions");
        await expect(
          within(alert).getByText("Title and Actions only")
        ).toBeInTheDocument();
        await expect(within(alert).getByText("Whatever")).toBeInTheDocument(); // Check one action button
        await expect(within(alert).getByText("Here")).toBeInTheDocument(); // Check another action button
        await expect(
          within(alert).queryByText(/Description/i)
        ).not.toBeInTheDocument();
        await expect(
          within(alert).queryByRole("button", { name: /Dismiss/i })
        ).not.toBeInTheDocument();
      }
    );

    await step(
      "Dismiss Only: Renders dismiss button, omits others, button works",
      async () => {
        const alert = canvas.getByTestId("alert-dismiss-only");
        const dismissButton = within(alert).getByTestId("dismiss-only-button");

        await expect(dismissButton).toBeInTheDocument();
        await expect(dismissButton).toHaveAttribute("aria-label", "Dismiss");
        await expect(
          within(alert).queryByText(/Title/i)
        ).not.toBeInTheDocument();
        await expect(
          within(alert).queryByText(/Description/i)
        ).not.toBeInTheDocument();
        await expect(
          within(alert).queryByRole("button", { name: /Action/i }) // Look for non-dismiss buttons
        ).not.toBeInTheDocument();

        // Test click
        await userEvent.click(dismissButton);
        await expect(mockDismissDismissOnly).toHaveBeenCalledTimes(1);
      }
    );

    await step(
      "Complete No Actions: Renders title, description, dismiss, omits actions, dismiss works",
      async () => {
        const alert = canvas.getByTestId("alert-no-actions");
        const dismissButton = within(alert).getByTestId(
          "dismiss-no-actions-button"
        );

        await expect(
          within(alert).getByText("A More Complete Alert (No Actions)")
        ).toBeInTheDocument();
        await expect(
          within(alert).getByText("We have both title and description here!")
        ).toBeInTheDocument();
        await expect(dismissButton).toBeInTheDocument();
        await expect(dismissButton).toHaveAttribute("aria-label", "Dismiss");
        await expect(
          within(alert).queryByRole("button", { name: /Action/i }) // Look for non-dismiss buttons
        ).not.toBeInTheDocument();

        // Test click
        await userEvent.click(dismissButton);
        await expect(mockDismissCompleteNoActions).toHaveBeenCalledTimes(1);
      }
    );
  },
};
