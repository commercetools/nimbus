import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, fn } from "storybook/test";
import { Alert, type AlertProps, Button, Stack } from "@commercetools/nimbus";

const tones: AlertProps["tone"][] = ["critical", "info", "warning", "positive"];
const variants: AlertProps["variant"][] = ["flat", "outlined"];

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof Alert.Root> = {
  title: "Components/Alert",
  component: Alert.Root,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof Alert.Root>;

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
    const dismissButton = await canvas.findByTestId("dismiss-button");
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

export const TonesShowcase: Story = {
  name: "Showcase: Tones",
  render: () => (
    <Stack direction="column" gap="400" alignItems="flex-start">
      {tones.map((tone) => (
        <Alert.Root
          key={`alert-${tone as string}`}
          tone={tone}
          variant="outlined"
        >
          <Alert.Title>Alert Title ({tone as string})</Alert.Title>
          <Alert.Description>Alert Description</Alert.Description>
          <Alert.Actions>
            <Stack direction="row" gap="8px" alignItems="center">
              <Button variant="outline">Button</Button>
            </Stack>
          </Alert.Actions>
          <Alert.DismissButton
            onPress={() => alert(`Dismissed ${tone as string}`)}
          />
        </Alert.Root>
      ))}
    </Stack>
  ),
};

export const VariantsShowcase: Story = {
  name: "Showcase: Variants",
  render: () => (
    <Stack direction="column" gap="400" alignItems="flex-start">
      {tones.map((tone) => (
        <Stack
          key={`stack-${tone as string}`}
          direction="row"
          gap="400"
          width="100%"
        >
          {variants.map((variant) => (
            <Alert.Root
              key={`alert-${tone as string}-${variant as string}`}
              tone={tone}
              variant={variant}
            >
              <Alert.Title>
                {tone as string} / {variant as string}
              </Alert.Title>
              <Alert.Description>Desc.</Alert.Description>
              <Alert.DismissButton onPress={() => alert("Dismissed")} />
            </Alert.Root>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

export const TitleOnly: Story = {
  name: "Composition: Title Only",
  args: {
    tone: "positive",
    variant: "outlined",
    "data-testid": "alert-title-only",
    children: (
      <>
        <Alert.Title>Title Only Alert</Alert.Title>
        {/* Intentionally omit Description, Actions, DismissButton */}
      </>
    ),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const alert = canvas.getByTestId("alert-title-only");

    await step("Renders only the title", async () => {
      const title = await within(alert).findByText("Title Only Alert");
      expect(title).toBeInTheDocument();
    });

    await step("Does not render other parts", async () => {
      await expect(
        within(alert).queryByText(/Description/i)
      ).not.toBeInTheDocument();
      await expect(
        within(alert).queryByRole("button") // Check for any button
      ).not.toBeInTheDocument();
    });
  },
};

export const DescriptionOnly: Story = {
  name: "Composition: Description Only",
  args: {
    tone: "info",
    variant: "flat",
    "data-testid": "alert-desc-only",
    children: (
      <>
        <Alert.Description>Description Only Alert</Alert.Description>
        {/* Intentionally omit Title, Actions, DismissButton */}
      </>
    ),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const alert = canvas.getByTestId("alert-desc-only");

    await step("Renders only the description", async () => {
      const title = await within(alert).findByText("Description Only Alert");
      expect(title).toBeInTheDocument();
    });

    await step("Does not render other parts", async () => {
      await expect(within(alert).queryByText(/Title/i)).not.toBeInTheDocument();
      await expect(
        within(alert).queryByRole("button") // Check for any button
      ).not.toBeInTheDocument();
    });
  },
};

export const TitleAndActions: Story = {
  name: "Composition: Title and Actions",
  args: {
    tone: "warning",
    variant: "outlined",
    "data-testid": "alert-title-actions",
    children: (
      <>
        <Alert.Title>Title and Actions only</Alert.Title>
        <Alert.Actions>
          <Stack direction="row" gap="8px" alignItems="center">
            <Button variant="outline">Action A</Button>
            <Button variant="ghost">Action B</Button>
          </Stack>
        </Alert.Actions>
        {/* Intentionally omit Description, DismissButton */}
      </>
    ),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const alert = canvas.getByTestId("alert-title-actions");

    await step("Renders title and action buttons", async () => {
      const title = await within(alert).findByText("Title and Actions only");
      expect(title).toBeInTheDocument();

      await expect(
        within(alert).getByRole("button", { name: "Action A" })
      ).toBeInTheDocument();
      await expect(
        within(alert).getByRole("button", { name: "Action B" })
      ).toBeInTheDocument();
    });

    await step("Does not render description or dismiss button", async () => {
      await expect(
        within(alert).queryByText(/Description/i)
      ).not.toBeInTheDocument();
      await expect(
        within(alert).queryByRole("button", { name: /Dismiss/i })
      ).not.toBeInTheDocument();
    });
  },
};

const mockDismissNoActions = fn();
export const NoActions: Story = {
  name: "Composition: Title, Description, Dismiss (No Actions)",
  args: {
    tone: "positive",
    variant: "outlined",
    "data-testid": "alert-no-actions",
    children: (
      <>
        <Alert.Title>Complete Alert (No Actions)</Alert.Title>
        <Alert.Description>
          Title and description are present.
        </Alert.Description>
        {/* Intentionally omit Actions */}
        <Alert.DismissButton
          onPress={mockDismissNoActions}
          data-testid="dismiss-no-actions-button"
        />
      </>
    ),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const alert = canvas.getByTestId("alert-no-actions");
    const dismissButton = await within(alert).findByTestId(
      "dismiss-no-actions-button"
    );

    await step("Renders title, description, and dismiss button", async () => {
      await expect(
        within(alert).getByText("Complete Alert (No Actions)")
      ).toBeInTheDocument();
      await expect(
        within(alert).getByText("Title and description are present.")
      ).toBeInTheDocument();
      await expect(dismissButton).toBeInTheDocument();
      await expect(dismissButton).toHaveAttribute("aria-label", "Dismiss");
    });

    await step("Does not render action buttons", async () => {
      // Check specifically for non-dismiss buttons
      const actionButtons = within(alert)
        .queryAllByRole("button")
        .filter((btn) => btn !== dismissButton);
      await expect(actionButtons.length).toBe(0);
    });

    await step("Dismiss button is clickable and calls onPress", async () => {
      await userEvent.click(dismissButton);
      await expect(mockDismissNoActions).toHaveBeenCalledTimes(1);
    });
  },
};
