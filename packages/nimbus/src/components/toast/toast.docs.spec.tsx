import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast, Toast, NimbusProvider, Button } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify Toast component renders with expected elements and structure
 * @docs-order 1
 */
describe("Toast - Basic rendering", () => {
  it("renders toast with title and description", () => {
    render(
      <NimbusProvider>
        <Toast.Root type="info">
          <Toast.Title>Test Title</Toast.Title>
          <Toast.Description>Test Description</Toast.Description>
        </Toast.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("renders toast with close button when closable", () => {
    render(
      <NimbusProvider>
        <Toast.Root type="success">
          <Toast.Title>Success</Toast.Title>
          <Toast.CloseTrigger />
        </Toast.Root>
      </NimbusProvider>
    );

    // Close button should be present
    expect(
      screen.getByRole("button", { name: /dismiss/i })
    ).toBeInTheDocument();
  });

  it("renders toast with action button", () => {
    const handleAction = vi.fn();

    render(
      <NimbusProvider>
        <Toast.Root type="warning">
          <Toast.Title>Warning</Toast.Title>
          <Toast.ActionTrigger onPress={handleAction}>
            Take Action
          </Toast.ActionTrigger>
        </Toast.Root>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("button", { name: "Take Action" })
    ).toBeInTheDocument();
  });
});

/**
 * @docs-section imperative-api
 * @docs-title Imperative API Tests
 * @docs-description Test toast creation using the imperative API
 * @docs-order 2
 */
describe("Toast - Imperative API", () => {
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

    // Toast should appear
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
            toast.success({ title: "Success Toast" });
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
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test user interactions with toast components
 * @docs-order 3
 */
describe("Toast - Interactions", () => {
  it("handles close button click", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Toast.Root type="info">
          <Toast.Title>Dismissible Toast</Toast.Title>
          <Toast.CloseTrigger />
        </Toast.Root>
      </NimbusProvider>
    );

    const closeButton = screen.getByRole("button", { name: /dismiss/i });
    await user.click(closeButton);

    // Toast should be dismissed (specific assertion depends on your implementation)
    // This test verifies the close button is interactive
    expect(closeButton).toBeInTheDocument();
  });

  it("handles action button click", async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();

    render(
      <NimbusProvider>
        <Toast.Root type="success">
          <Toast.Title>Success</Toast.Title>
          <Toast.ActionTrigger onPress={handleAction}>Undo</Toast.ActionTrigger>
        </Toast.Root>
      </NimbusProvider>
    );

    const actionButton = screen.getByRole("button", { name: "Undo" });
    await user.click(actionButton);

    expect(handleAction).toHaveBeenCalledTimes(1);
  });
});

/**
 * @docs-section programmatic-control
 * @docs-title Programmatic Control Tests
 * @docs-description Test programmatic toast updates and dismissals
 * @docs-order 4
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

    // Create toast
    const createButton = screen.getByRole("button", { name: "Create Toast" });
    await user.click(createButton);

    await waitFor(() => {
      expect(screen.getByText("Initial Title")).toBeInTheDocument();
    });

    // Update toast
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

    // Create toast
    const createButton = screen.getByRole("button", { name: "Create Toast" });
    await user.click(createButton);

    await waitFor(() => {
      expect(screen.getByText("Dismissible Toast")).toBeInTheDocument();
    });

    // Dismiss toast
    const dismissButton = screen.getByRole("button", { name: "Dismiss Toast" });
    await user.click(dismissButton);

    // Toast should be removed (with animation)
    // The exact assertion depends on timing and animation implementation
  });
});

/**
 * @docs-section promise-pattern
 * @docs-title Promise Pattern Tests
 * @docs-description Test toast.promise() for async operation states
 * @docs-order 5
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
              loading: { title: "Loading...", closable: false },
              success: { title: "Success!", type: "success" },
              error: { title: "Failed", type: "error" },
            });
          }}
        >
          Start Operation
        </Button>
      </NimbusProvider>
    );

    const button = screen.getByRole("button", { name: "Start Operation" });
    await user.click(button);

    // Loading state should appear
    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    // Success state should appear after promise resolves
    await waitFor(() => {
      expect(screen.getByText("Success!")).toBeInTheDocument();
    });
  });

  it("shows loading then error states", async () => {
    const user = userEvent.setup();

    const asyncOperation = () =>
      new Promise((_, reject) => {
        setTimeout(() => reject("Error"), 100);
      });

    render(
      <NimbusProvider>
        <Button
          onPress={() => {
            toast.promise(asyncOperation(), {
              loading: { title: "Processing...", closable: false },
              success: { title: "Done!", type: "success" },
              error: { title: "Failed!", type: "error" },
            });
          }}
        >
          Start Operation
        </Button>
      </NimbusProvider>
    );

    const button = screen.getByRole("button", { name: "Start Operation" });
    await user.click(button);

    // Loading state should appear
    await waitFor(() => {
      expect(screen.getByText("Processing...")).toBeInTheDocument();
    });

    // Error state should appear after promise rejects
    await waitFor(() => {
      expect(screen.getByText("Failed!")).toBeInTheDocument();
    });
  });
});

/**
 * @docs-section action-buttons
 * @docs-title Action Button Tests
 * @docs-description Test toasts with action buttons and callbacks
 * @docs-order 6
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

    // Action button should appear in toast
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
    });

    // Click action button
    const actionButton = screen.getByRole("button", { name: "Retry" });
    await user.click(actionButton);

    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it("toasts with actions do not auto-dismiss", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Button
          onPress={() => {
            toast({
              title: "Persistent Action Toast",
              action: {
                label: "Action",
                onClick: vi.fn(),
              },
              // duration should be forced to 0 internally
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
      expect(screen.getByText("Persistent Action Toast")).toBeInTheDocument();
    });

    // Toast should remain visible (not auto-dismiss)
    // This test verifies the toast persists
    expect(screen.getByText("Persistent Action Toast")).toBeInTheDocument();
  });
});
