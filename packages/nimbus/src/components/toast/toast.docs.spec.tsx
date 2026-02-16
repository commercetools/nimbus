import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast, NimbusProvider, Button } from "@commercetools/nimbus";

/**
 * @docs-section basic-usage
 * @docs-title Basic Usage
 * @docs-description Create toast notifications using the imperative toast() API
 * @docs-order 1
 */
describe("Toast - Basic usage", () => {
  it("creates toast using toast() function", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Button
          onPress={() => {
            toast({
              title: "Imperative Toast",
              description: "Created programmatically",
              type: "info",
            });
          }}
        >
          Show Toast
        </Button>
      </NimbusProvider>
    );

    const button = screen.getByRole("button", { name: "Show Toast" });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Imperative Toast")).toBeInTheDocument();
    });
  });

  it("creates toasts using convenience methods", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Button
          onPress={() => {
            toast.success({
              title: "Success Toast",
              description: "Operation completed successfully",
            });
          }}
        >
          Show Success
        </Button>
      </NimbusProvider>
    );

    const button = screen.getByRole("button", { name: "Show Success" });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Success Toast")).toBeInTheDocument();
    });
  });

  it("creates toasts with custom placement", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Button
          onPress={() => {
            toast({
              title: "Custom Placement",
              description: "This toast appears at bottom-end",
              placement: "bottom-end",
            });
          }}
        >
          Show Toast
        </Button>
      </NimbusProvider>
    );

    const button = screen.getByRole("button", { name: "Show Toast" });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Custom Placement")).toBeInTheDocument();
    });
  });
});

/**
 * @docs-section programmatic-control
 * @docs-title Programmatic Control
 * @docs-description Update and dismiss toasts programmatically
 * @docs-order 2
 */
describe("Toast - Programmatic control", () => {
  it("updates toast content programmatically", async () => {
    const user = userEvent.setup();
    let toastId: string | null = null;

    render(
      <NimbusProvider>
        <Button
          onPress={() => {
            toastId = toast({
              title: "Initial Title",
              description: "Initial Description",
              duration: 0,
            });
          }}
        >
          Create Toast
        </Button>
        <Button
          onPress={() => {
            if (toastId) {
              toast.update(toastId, {
                title: "Updated Title",
                description: "Updated Description",
              });
            }
          }}
        >
          Update Toast
        </Button>
      </NimbusProvider>
    );

    const createButton = screen.getByRole("button", { name: "Create Toast" });
    await user.click(createButton);

    await waitFor(() => {
      expect(screen.getByText("Initial Title")).toBeInTheDocument();
    });

    const updateButton = screen.getByRole("button", { name: "Update Toast" });
    await user.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText("Updated Title")).toBeInTheDocument();
    });
  });

  it("dismisses toast programmatically", async () => {
    const user = userEvent.setup();
    let toastId: string | null = null;

    render(
      <NimbusProvider>
        <Button
          onPress={() => {
            toastId = toast({
              title: "Dismissible Toast",
              description: "This toast can be dismissed programmatically",
              duration: 0,
            });
          }}
        >
          Create Toast
        </Button>
        <Button
          onPress={() => {
            if (toastId) {
              toast.dismiss(toastId);
            }
          }}
        >
          Dismiss Toast
        </Button>
      </NimbusProvider>
    );

    const createButton = screen.getByRole("button", { name: "Create Toast" });
    await user.click(createButton);

    await waitFor(() => {
      expect(screen.getByText("Dismissible Toast")).toBeInTheDocument();
    });

    const dismissButton = screen.getByRole("button", {
      name: "Dismiss Toast",
    });
    await user.click(dismissButton);
  });
});

/**
 * @docs-section promise-pattern
 * @docs-title Promise Pattern
 * @docs-description Use toast.promise() for async operation states
 * @docs-order 3
 */
describe("Toast - Promise pattern", () => {
  it("shows loading then success states", async () => {
    const user = userEvent.setup();

    const asyncOperation = () =>
      new Promise((resolve) => {
        setTimeout(() => resolve("Done"), 100);
      });

    render(
      <NimbusProvider>
        <Button
          onPress={() => {
            toast.promise(asyncOperation(), {
              loading: {
                title: "Loading...",
                description: "Please wait",
                closable: false,
              },
              success: {
                title: "Success!",
                description: "Operation completed",
                type: "success",
              },
              error: {
                title: "Failed",
                description: "Something went wrong",
                type: "error",
              },
            });
          }}
        >
          Start Operation
        </Button>
      </NimbusProvider>
    );

    const button = screen.getByRole("button", { name: "Start Operation" });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Success!")).toBeInTheDocument();
    });
  });
});

/**
 * @docs-section action-buttons
 * @docs-title Action Buttons
 * @docs-description Create toasts with action buttons and callbacks
 * @docs-order 4
 */
describe("Toast - Action buttons", () => {
  it("creates toast with action button", async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();

    render(
      <NimbusProvider>
        <Button
          onPress={() => {
            toast({
              title: "Action Required",
              description: "Please take action",
              action: {
                label: "Retry",
                onClick: handleAction,
              },
            });
          }}
        >
          Show Action Toast
        </Button>
      </NimbusProvider>
    );

    const button = screen.getByRole("button", { name: "Show Action Toast" });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
    });

    const actionButton = screen.getByRole("button", { name: "Retry" });
    await user.click(actionButton);

    expect(handleAction).toHaveBeenCalled();
  });
});
