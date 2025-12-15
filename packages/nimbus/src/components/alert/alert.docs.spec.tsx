import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Alert, Button, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the alert renders with the expected content and role
 * @docs-order 1
 */
describe("Alert - Basic rendering", () => {
  it("renders the alert message", () => {
    render(
      <NimbusProvider>
        <Alert.Root colorPalette="critical">
          <Alert.Title>Error saving</Alert.Title>
          <Alert.Description>Connection lost</Alert.Description>
        </Alert.Root>
      </NimbusProvider>
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Error saving")).toBeInTheDocument();
    expect(screen.getByText("Connection lost")).toBeInTheDocument();
  });

  it("renders with title only", () => {
    render(
      <NimbusProvider>
        <Alert.Root colorPalette="positive">
          <Alert.Title>Success: Item created.</Alert.Title>
        </Alert.Root>
      </NimbusProvider>
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Success: Item created.")).toBeInTheDocument();
  });

  it("renders with description only", () => {
    render(
      <NimbusProvider>
        <Alert.Root colorPalette="info">
          <Alert.Description>
            System maintenance scheduled for tonight at 02:00 UTC.
          </Alert.Description>
        </Alert.Root>
      </NimbusProvider>
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(
      screen.getByText("System maintenance scheduled for tonight at 02:00 UTC.")
    ).toBeInTheDocument();
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test interactions with actions and dismiss buttons
 * @docs-order 2
 */
describe("Alert - Interactions", () => {
  it("calls the dismiss handler when clicked", async () => {
    const user = userEvent.setup();
    const handleDismiss = vi.fn();

    render(
      <NimbusProvider>
        <Alert.Root>
          <Alert.Title>Notification</Alert.Title>
          <Alert.DismissButton onPress={handleDismiss} />
        </Alert.Root>
      </NimbusProvider>
    );

    const dismissBtn = screen.getByRole("button", { name: /dismiss/i });
    await user.click(dismissBtn);

    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it("handles action clicks", async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();

    render(
      <NimbusProvider>
        <Alert.Root>
          <Alert.Title>Confirmation</Alert.Title>
          <Alert.Actions>
            <Button onPress={handleAction}>Confirm</Button>
          </Alert.Actions>
        </Alert.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("button", { name: "Confirm" }));
    expect(handleAction).toHaveBeenCalled();
  });
});
