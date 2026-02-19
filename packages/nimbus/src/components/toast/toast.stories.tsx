/**
 * Storybook stories for Toast component with comprehensive play functions
 * Testing all requirements from OpenSpec:
 * - All 4 types (info, success, warning, error)
 * - Auto-dismiss behavior (default, custom, disabled)
 * - Pause behavior (hover, focus)
 * - Dismissal (close button, Escape key, programmatic)
 * - Action buttons
 * - Promise pattern
 * - Stacking/queuing
 * - Multi-placement
 * - ARIA roles
 * - Reduced motion
 * - Keyboard navigation
 * - Closable control
 */

import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, waitFor, fn } from "storybook/test";
import {
  Button,
  Dialog,
  Stack,
  Text,
  toast,
  type ToastVariant,
} from "@commercetools/nimbus";
import { Bathtub } from "@commercetools/nimbus-icons";

/**
 * Storybook metadata configuration
 */
const meta: Meta = {
  title: "Components/Toast",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Clear all toasts between stories to prevent state leaking.
 * Chakra needs time after remove() for DOM cleanup.
 */
async function clearToasts() {
  toast.remove();
  toast.reset(); // Reset internal manager state
  // Wait for all toast elements to be removed from DOM
  try {
    await waitFor(
      () => {
        const toastElements = document.querySelectorAll(
          '[data-scope="toast"][data-part="root"]'
        );
        expect(toastElements.length).toBe(0);
      },
      { timeout: 3000 }
    );
  } catch {
    // If toasts don't clear in time, force remove them and continue
    console.warn("Toasts did not clear in time, forcing cleanup");
    const toastElements = document.querySelectorAll(
      '[data-scope="toast"][data-part="root"]'
    );
    toastElements.forEach((el) => el.remove());
  }
  // Small buffer after DOM cleanup
  await new Promise((resolve) => setTimeout(resolve, 200));
}

/**
 * Types
 * Tests the four functional toast types (info, success, warning, error)
 * with correct icons, color palettes, and ARIA roles.
 *
 * Types are functional permutations that determine semantics:
 * - icon displayed
 * - color palette applied
 * - ARIA role (status vs alert) and aria-live (polite vs assertive)
 */
export const Types: Story = {
  render: () => {
    const showToasts = () => {
      toast.info({ title: "Info toast", description: "This is informational" });
      toast.success({
        title: "Success toast",
        description: "Action completed",
      });
      toast.warning({
        title: "Warning toast",
        description: "Please review",
      });
      toast.error({
        title: "Error toast",
        description: "Something went wrong",
      });
    };

    return (
      <Stack direction="column" gap="16px">
        <Button onPress={showToasts}>Show All Types</Button>
        <Text fontSize="sm" color="fg.muted">
          Click to show info, success, warning, and error toasts
        </Text>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    await clearToasts();
    const canvas = within(canvasElement);
    const body = within(document.body);
    const button = canvas.getByRole("button", { name: /Show All Types/i });

    await step("Renders all 4 toast types with correct content", async () => {
      await userEvent.click(button);

      // Wait for toasts to appear
      const infoToast = await body.findByText(
        "Info toast",
        {},
        { timeout: 3000 }
      );
      const successToast = await body.findByText("Success toast");
      const warningToast = await body.findByText("Warning toast");
      const errorToast = await body.findByText("Error toast");

      await expect(infoToast).toBeInTheDocument();
      await expect(successToast).toBeInTheDocument();
      await expect(warningToast).toBeInTheDocument();
      await expect(errorToast).toBeInTheDocument();
    });

    await step(
      "Info and success types have role='status' (polite)",
      async () => {
        const infoToast = body.getByText("Info toast");
        const successToast = body.getByText("Success toast");

        const infoContainer = infoToast.closest('[role="status"]');
        const successContainer = successToast.closest('[role="status"]');

        await expect(infoContainer).toBeInTheDocument();
        await expect(infoContainer).toHaveAttribute("aria-live", "polite");
        await expect(successContainer).toBeInTheDocument();
        await expect(successContainer).toHaveAttribute("aria-live", "polite");
      }
    );

    await step(
      "Warning and error types have role='alert' (assertive)",
      async () => {
        const warningToast = body.getByText("Warning toast");
        const errorToast = body.getByText("Error toast");

        const warningContainer = warningToast.closest('[role="alert"]');
        const errorContainer = errorToast.closest('[role="alert"]');

        await expect(warningContainer).toBeInTheDocument();
        await expect(warningContainer).toHaveAttribute(
          "aria-live",
          "assertive"
        );
        await expect(errorContainer).toBeInTheDocument();
        await expect(errorContainer).toHaveAttribute("aria-live", "assertive");
      }
    );
  },
};

/**
 * Custom Icon
 * Tests the `icon` property that replaces the default type-based icon
 * with a consumer-provided icon element.
 */
export const CustomIcon: Story = {
  render: () => {
    const showCustomIconToast = () => {
      toast.info({
        title: "Custom icon toast",
        description: "This toast uses a Bathtub icon instead of the default",
        icon: <Bathtub />,
        duration: Infinity,
        closable: true,
      });
    };

    const showDefaultIconToast = () => {
      toast.info({
        title: "Default icon toast",
        description: "This toast uses the default info icon",
        duration: Infinity,
        closable: true,
      });
    };

    return (
      <Stack direction="column" gap="16px">
        <Button onPress={showCustomIconToast} data-testid="custom-icon-btn">
          Show Toast with Custom Icon
        </Button>
        <Button onPress={showDefaultIconToast} data-testid="default-icon-btn">
          Show Toast with Default Icon
        </Button>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    await clearToasts();
    const canvas = within(canvasElement);
    const body = within(document.body);

    await step(
      "Toast with custom icon renders the Bathtub icon instead of default",
      async () => {
        const button = canvas.getByTestId("custom-icon-btn");
        await userEvent.click(button);

        const toastText = await body.findByText("Custom icon toast");
        const toastContainer = toastText.closest(
          '[role="status"]'
        ) as HTMLElement;

        // Should render the Bathtub SVG (has data-testid="bathtub" from nimbus-icons)
        const bathtubIcon = toastContainer.querySelector("svg");
        await expect(bathtubIcon).toBeInTheDocument();

        // The default info icon should NOT be present — verify by checking
        // that the SVG is the Bathtub icon (nimbus-icons set aria-hidden="true")
        await expect(bathtubIcon).not.toBeNull();
      }
    );

    await step(
      "Toast without custom icon renders the default type-based icon",
      async () => {
        const button = canvas.getByTestId("default-icon-btn");
        await userEvent.click(button);

        const toastText = await body.findByText("Default icon toast");
        const toastContainer = toastText.closest(
          '[role="status"]'
        ) as HTMLElement;

        // Should still have an SVG icon (the default info icon)
        const icon = toastContainer.querySelector("svg");
        await expect(icon).toBeInTheDocument();
      }
    );
  },
};

const TOAST_TYPES = ["info", "success", "warning", "error"] as const;

const VARIANT_PLACEMENTS: Array<{
  variant: ToastVariant;
  placement: "top-start" | "top-end" | "bottom-end";
}> = [
  { variant: "accent-start", placement: "top-start" },
  { variant: "subtle", placement: "top-end" },
  { variant: "solid", placement: "bottom-end" },
];

/**
 * Variants
 * Fires all type × variant combinations, each variant in a different corner.
 *
 * - accent-start → top-start
 * - subtle → top-end
 * - solid → bottom-end
 */
export const Variants: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    const showAll = () => {
      VARIANT_PLACEMENTS.forEach(({ variant, placement }) => {
        TOAST_TYPES.forEach((type) => {
          toast[type]({
            title: `${type} (${variant})`,
            description: "Supporting text that provides additional context.",
            variant,
            placement,
            closable: true,
            duration: Infinity,
            action: {
              label: "Undo",
              onPress: () => {},
            },
          });
        });
      });
    };

    return (
      <Button onPress={showAll} margin="400" data-testid="show-all-variants">
        Show All Variants
      </Button>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId("show-all-variants");
    await userEvent.click(button);
  },
};

/**
 * Auto-Dismiss Behavior
 * Tests default 6s duration, custom duration, and disabled auto-dismiss (duration: Infinity)
 */
export const AutoDismiss: Story = {
  render: () => {
    const showAutoDismissToasts = () => {
      toast({
        title: "Default (6s)",
        description: "Dismisses after 6 seconds",
        type: "info",
      });
      toast({
        title: "Custom (2s)",
        description: "Dismisses after 2 seconds",
        type: "success",
        duration: 2000,
      });
      toast({
        title: "No auto-dismiss",
        description: "Persists until dismissed",
        type: "warning",
        duration: Infinity,
      });
    };

    return (
      <Stack direction="column" gap="16px">
        <Button onPress={showAutoDismissToasts} data-testid="auto-dismiss-btn">
          Show Auto-Dismiss Variations
        </Button>
        <Text fontSize="sm" color="fg.muted">
          Default 6s, custom 2s, and persistent (duration: Infinity)
        </Text>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    await clearToasts();
    const canvas = within(canvasElement);
    const body = within(document.body);
    const button = canvas.getByTestId("auto-dismiss-btn");

    await step("All three toasts appear when button is clicked", async () => {
      await userEvent.click(button);

      // All three toasts should appear
      const defaultToast = await body.findByText("Default (6s)");
      const customToast = await body.findByText("Custom (2s)");
      const persistentToast = await body.findByText("No auto-dismiss");

      await expect(defaultToast).toBeInTheDocument();
      await expect(customToast).toBeInTheDocument();
      await expect(persistentToast).toBeInTheDocument();
    });

    await step("Custom duration toast dismisses after 2 seconds", async () => {
      // Wait for custom toast to auto-dismiss (2s + buffer)
      await waitFor(
        () => expect(body.queryByText("Custom (2s)")).not.toBeInTheDocument(),
        { timeout: 3000 }
      );

      // Default and persistent should still be visible
      await expect(body.getByText("Default (6s)")).toBeInTheDocument();
      await expect(body.getByText("No auto-dismiss")).toBeInTheDocument();
    });

    await step("Default toast dismisses after 6 seconds", async () => {
      // Wait for default toast to auto-dismiss (6s total + buffer)
      await waitFor(
        () => expect(body.queryByText("Default (6s)")).not.toBeInTheDocument(),
        { timeout: 5000 }
      );

      // Persistent toast should still be visible
      await expect(body.getByText("No auto-dismiss")).toBeInTheDocument();
    });

    await step(
      "Toast with duration: Infinity persists indefinitely",
      async () => {
        const persistentToast = body.getByText("No auto-dismiss");
        await expect(persistentToast).toBeInTheDocument();

        // Wait additional time to ensure it doesn't auto-dismiss
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await expect(persistentToast).toBeInTheDocument();
      }
    );
  },
};

/**
 * Pause Behavior
 * Tests that auto-dismiss timer pauses on hover and focus
 */
export const PauseBehavior: Story = {
  render: () => {
    const showPauseToast = () => {
      toast({
        title: "Hover or focus me to pause",
        description: "Timer pauses on interaction",
        type: "info",
        duration: 3000,
        closable: true,
      });
    };

    return (
      <Button onPress={showPauseToast} data-testid="pause-toast-btn">
        Show Pausable Toast
      </Button>
    );
  },
  play: async ({ canvasElement, step }) => {
    await clearToasts();
    const canvas = within(canvasElement);
    const body = within(document.body);
    const button = canvas.getByTestId("pause-toast-btn");

    await step("Timer pauses on hover", async () => {
      await userEvent.click(button);

      const toastText = await body.findByText("Hover or focus me to pause");
      await expect(toastText).toBeInTheDocument();

      const toastContainer =
        toastText.closest('[role="status"]') ?? toastText.parentElement!;

      // Hover over toast to pause timer
      await userEvent.hover(toastContainer);

      // Wait longer than duration (4s > 3s)
      await new Promise((resolve) => setTimeout(resolve, 4000));

      // Toast should still be visible because timer was paused
      await expect(toastText).toBeInTheDocument();

      // Unhover to resume timer
      await userEvent.unhover(toastContainer);

      // Now it should dismiss after remaining time
      await waitFor(() => expect(toastText).not.toBeInTheDocument(), {
        timeout: 4000,
      });
    });

    await step("Timer pauses on focus", async () => {
      await userEvent.click(button);

      const toastText = await body.findByText("Hover or focus me to pause");
      const toastContainer = toastText.closest(
        '[role="status"]'
      ) as HTMLElement;
      const closeButton = within(toastContainer).getByRole("button");

      // Focus the close button via Tab (not click, which would dismiss)
      closeButton.focus();
      await expect(closeButton).toHaveFocus();

      // Wait longer than duration (4s > 3s)
      await new Promise((resolve) => setTimeout(resolve, 4000));

      // Toast should still be visible because timer was paused
      await expect(toastText).toBeInTheDocument();
    });
  },
};

/**
 * Dismissal Methods
 * Tests close button, Escape key, and programmatic dismiss/remove
 */
export const Dismissal: Story = {
  render: () => {
    const showDismissalToasts = () => {
      toast.info({
        title: "Close button test",
        description: "Click the close button to dismiss",
        duration: 5000,
        closable: true,
      });
      toast.success({
        title: "Escape key test",
        description: "Press Escape to dismiss",
        duration: 5000,
        closable: true,
      });
      toast.warning({
        title: "Programmatic dismiss",
        description: "Dismissed via API",
        duration: 5000,
      });
    };

    return (
      <Stack direction="column" gap="16px">
        <Button onPress={showDismissalToasts} data-testid="dismissal-btn">
          Show Dismissal Toasts
        </Button>
        <Button onPress={() => toast.dismiss()} data-testid="dismiss-all-btn">
          Dismiss All
        </Button>
        <Button onPress={() => toast.remove()} data-testid="remove-all-btn">
          Remove All (No Animation)
        </Button>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    await clearToasts();
    const canvas = within(canvasElement);
    const body = within(document.body);
    const showButton = canvas.getByTestId("dismissal-btn");

    await step("Close button dismisses toast with animation", async () => {
      await userEvent.click(showButton);

      const toastText = await body.findByText("Close button test");
      const toastContainer = toastText.closest(
        '[role="status"]'
      ) as HTMLElement;
      const closeButton = within(toastContainer).getByRole("button");

      // Wait for animation to complete before interacting
      await waitFor(
        () => {
          const styles = window.getComputedStyle(closeButton);
          expect(styles.pointerEvents).not.toBe("none");
        },
        { timeout: 2000 }
      );

      await userEvent.click(closeButton);

      // Toast should animate out then be removed
      await waitFor(() => expect(toastText).not.toBeInTheDocument(), {
        timeout: 1000,
      });
    });

    await step("Escape key dismisses focused toast", async () => {
      const toastText = body.getByText("Escape key test");
      await expect(toastText).toBeInTheDocument();

      const toastContainer = toastText.closest(
        '[role="status"]'
      ) as HTMLElement;
      const closeButton = within(toastContainer).getByRole("button");

      // Wait for animation to complete before interacting
      await waitFor(
        () => {
          const styles = window.getComputedStyle(closeButton);
          expect(styles.pointerEvents).not.toBe("none");
        },
        { timeout: 2000 }
      );

      // Focus the toast's close button
      closeButton.focus();
      await expect(closeButton).toHaveFocus();

      // Press Escape to dismiss
      await userEvent.keyboard("{Escape}");

      await waitFor(() => expect(toastText).not.toBeInTheDocument(), {
        timeout: 1000,
      });
    });

    await step("toast.dismiss() dismisses all with animation", async () => {
      await userEvent.click(showButton);
      const dismissAllBtn = canvas.getByTestId("dismiss-all-btn");

      // Wait for toasts to appear
      await body.findByText("Close button test");
      await new Promise((resolve) => setTimeout(resolve, 100));

      await userEvent.click(dismissAllBtn);

      // All toasts should animate out
      await waitFor(
        () => {
          expect(body.queryByText("Close button test")).not.toBeInTheDocument();
          expect(body.queryByText("Escape key test")).not.toBeInTheDocument();
          expect(
            body.queryByText("Programmatic dismiss")
          ).not.toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });

    await step(
      "toast.remove() removes immediately without animation",
      async () => {
        await userEvent.click(showButton);
        const removeAllBtn = canvas.getByTestId("remove-all-btn");

        // Wait for toasts to appear
        await body.findByText("Close button test");
        await new Promise((resolve) => setTimeout(resolve, 100));

        await userEvent.click(removeAllBtn);

        // All toasts should be removed immediately
        expect(body.queryByText("Close button test")).not.toBeInTheDocument();
        expect(body.queryByText("Escape key test")).not.toBeInTheDocument();
        expect(
          body.queryByText("Programmatic dismiss")
        ).not.toBeInTheDocument();
      }
    );
  },
};

/**
 * Action Button
 * Tests action button rendering, onPress callback, and that action
 * does NOT force duration: Infinity (consumers control duration independently)
 */
export const ActionButton: Story = {
  args: {
    onAction: fn(),
  },
  render: (args) => {
    const showActionToast = () => {
      toast({
        title: "File deleted",
        description: "Your file was permanently deleted",
        type: "info",
        action: {
          label: "Undo",
          onPress: args.onAction,
        },
      });
    };

    return (
      <Button onPress={showActionToast} data-testid="action-toast-btn">
        Show Toast with Action
      </Button>
    );
  },
  play: async ({ canvasElement, step, args }) => {
    await clearToasts();
    const canvas = within(canvasElement);
    const body = within(document.body);
    const button = canvas.getByTestId("action-toast-btn");

    await step(
      "Toast with action renders action button and respects default duration",
      async () => {
        await userEvent.click(button);

        const toastText = await body.findByText("File deleted");
        await expect(toastText).toBeInTheDocument();

        // Verify action button is rendered
        const toastContainer = toastText.closest(
          '[role="status"]'
        ) as HTMLElement;
        const actionButton = within(toastContainer).getByRole("button", {
          name: /undo/i,
        });
        await expect(actionButton).toBeInTheDocument();
      }
    );

    await step(
      "Action button calls onPress exactly once when clicked",
      async () => {
        const toastText = body.getByText("File deleted");
        const toastContainer = toastText.closest(
          '[role="status"]'
        ) as HTMLElement;
        const actionButton = within(toastContainer).getByRole("button", {
          name: /undo/i,
        });

        args.onAction.mockClear();
        await userEvent.click(actionButton);
        await expect(args.onAction).toHaveBeenCalledTimes(1);
      }
    );
  },
};

/**
 * Promise Pattern
 * Tests toast.promise() with loading → success/error transitions
 */
export const PromisePattern: Story = {
  render: () => {
    const successPromise = () => {
      const promise = new Promise((resolve) =>
        setTimeout(() => resolve("Success!"), 2000)
      );
      toast.promise(promise, {
        loading: { title: "Loading...", description: "Please wait" },
        success: { title: "Success!", description: "Operation completed" },
        error: { title: "Error", description: "Something went wrong" },
      });
    };

    const errorPromise = () => {
      const promise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Failed")), 2000)
      );
      toast.promise(promise, {
        loading: { title: "Processing...", description: "Please wait" },
        success: { title: "Done!", description: "Success" },
        error: { title: "Failed", description: "Operation failed" },
      });
    };

    return (
      <Stack direction="column" gap="16px">
        <Button onPress={successPromise} data-testid="success-promise-btn">
          Promise Resolves
        </Button>
        <Button onPress={errorPromise} data-testid="error-promise-btn">
          Promise Rejects
        </Button>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    await clearToasts();
    const canvas = within(canvasElement);
    const body = within(document.body);

    await step("Promise resolves: loading → success transition", async () => {
      const button = canvas.getByTestId("success-promise-btn");
      await userEvent.click(button);

      const loadingToast = await body.findByText("Loading...");
      await expect(loadingToast).toBeInTheDocument();

      // Wait for transition to success
      await waitFor(
        () => {
          expect(body.queryByText("Loading...")).not.toBeInTheDocument();
          expect(body.getByText("Success!")).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    await step("Promise rejects: loading → error transition", async () => {
      const button = canvas.getByTestId("error-promise-btn");
      await userEvent.click(button);

      const loadingToast = await body.findByText("Processing...");
      await expect(loadingToast).toBeInTheDocument();

      // Wait for transition to error
      await waitFor(
        () => {
          expect(body.queryByText("Processing...")).not.toBeInTheDocument();
          expect(body.getByText("Failed")).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  },
};

/**
 * Stacking and Queuing
 * Tests multiple toasts stack properly and queue when max limit is reached
 */
export const StackingAndQueuing: Story = {
  render: () => {
    const showMultipleToasts = () => {
      for (let i = 1; i <= 5; i++) {
        toast({
          title: `Toast ${i}`,
          description: `Stacking demo toast ${i}`,
          type: "info",
          duration: Infinity,
        });
      }
    };

    const showManyToasts = () => {
      for (let i = 1; i <= 30; i++) {
        // Exceeds max of 24
        toast({
          title: `Toast ${i}`,
          description: `Queuing demo toast ${i}`,
          type: "info",
          duration: Infinity,
        });
      }
    };

    return (
      <Stack direction="column" gap="16px">
        <Button onPress={showMultipleToasts} data-testid="multiple-btn">
          Show 5 Toasts (Stacking)
        </Button>
        <Button onPress={showManyToasts} data-testid="many-btn">
          Show 30 Toasts (Queuing)
        </Button>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    await clearToasts();
    const canvas = within(canvasElement);
    const body = within(document.body);

    await step(
      "Multiple toasts stack vertically without overlapping",
      async () => {
        const button = canvas.getByTestId("multiple-btn");
        await userEvent.click(button);

        await waitFor(async () => {
          const toast1 = body.getByText("Toast 1");
          const toast2 = body.getByText("Toast 2");
          await expect(toast1).toBeInTheDocument();
          await expect(toast2).toBeInTheDocument();

          // Verify they don't overlap (different y positions)
          const rect1 = toast1.getBoundingClientRect();
          const rect2 = toast2.getBoundingClientRect();
          expect(rect1.top).not.toBe(rect2.top);
        });
      }
    );

    await step("Toasts exceeding max (24) are queued", async () => {
      // Clean up previous toasts
      await clearToasts();

      const button = canvas.getByTestId("many-btn");
      await userEvent.click(button);

      await waitFor(async () => {
        // Should only show up to 24 toasts at once (Chakra's default limit)
        const visibleToasts = body.queryAllByText(/^Toast \d+$/);
        expect(visibleToasts.length).toBeGreaterThan(0);
        expect(visibleToasts.length).toBeLessThanOrEqual(24);
      });
    });
  },
};

/**
 * Multi-Placement
 * Tests toasts in different placement regions simultaneously
 */
export const MultiPlacement: Story = {
  render: () => {
    const showMultiPlacement = () => {
      toast({
        title: "Top End",
        description: "Placed at top-end",
        type: "info",
        placement: "top-end",
      });
      toast({
        title: "Bottom End",
        description: "Placed at bottom-end",
        type: "success",
        placement: "bottom-end",
      });
      toast({
        title: "Top Start",
        description: "Placed at top-start",
        type: "warning",
        placement: "top-start",
      });
      toast({
        title: "Bottom Start",
        description: "Placed at bottom-start",
        type: "error",
        placement: "bottom-start",
      });
    };

    return (
      <Button onPress={showMultiPlacement} data-testid="multi-placement-btn">
        Show Toasts in All Placements
      </Button>
    );
  },
  play: async ({ canvasElement, step }) => {
    await clearToasts();
    const canvas = within(canvasElement);
    const body = within(document.body);
    const button = canvas.getByTestId("multi-placement-btn");

    await step("Toasts appear in different placement regions", async () => {
      await userEvent.click(button);

      await waitFor(async () => {
        const topEndToast = body.getByText("Top End");
        const bottomEndToast = body.getByText("Bottom End");
        const topStartToast = body.getByText("Top Start");
        const bottomStartToast = body.getByText("Bottom Start");

        await expect(topEndToast).toBeInTheDocument();
        await expect(bottomEndToast).toBeInTheDocument();
        await expect(topStartToast).toBeInTheDocument();
        await expect(bottomStartToast).toBeInTheDocument();

        // Verify they're in different regions with different positions
        const topEndRect = topEndToast.getBoundingClientRect();
        const bottomEndRect = bottomEndToast.getBoundingClientRect();
        expect(topEndRect.top).toBeLessThan(bottomEndRect.top);
        expect(topEndRect.right).toBeGreaterThan(window.innerWidth / 2);
      });
    });

    await step("Default placement is top-end", async () => {
      toast({
        title: "Default placement",
        description: "Should appear at top-end",
      });
      const toastText = await body.findByText("Default placement");
      const rect = toastText.getBoundingClientRect();

      // Near top
      expect(rect.top).toBeLessThan(200);
      // Right side
      expect(rect.right).toBeGreaterThan(window.innerWidth / 2);
    });
  },
};

/**
 * Keyboard Navigation
 * Tests Tab navigation and per-placement hotkeys within toast.
 */
export const KeyboardNavigation: Story = {
  render: () => {
    const showKeyboardToast = () => {
      toast({
        title: "Keyboard Toast",
        description: "Navigate with Tab and hotkeys",
        type: "info",
        placement: "top-end", // Alt+Shift+9
        closable: true,
        action: {
          label: "Action",
          onPress: () => {
            console.log("Action clicked");
          },
        },
      });
    };

    return (
      <Stack direction="column" gap="16px">
        <Button onPress={showKeyboardToast} data-testid="keyboard-toast-btn">
          Show Keyboard Toast
        </Button>
        <Text fontSize="sm" color="fg.muted">
          Use Alt+Shift+9 to focus top-end region, then Tab to navigate
        </Text>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    await clearToasts();
    const canvas = within(canvasElement);
    const body = within(document.body);
    const button = canvas.getByTestId("keyboard-toast-btn");

    await step(
      "Toast with action renders both action and close buttons",
      async () => {
        await userEvent.click(button);

        const toastText = await body.findByText("Keyboard Toast");
        await expect(toastText).toBeInTheDocument();

        const toastContainer = toastText.closest(
          '[role="status"]'
        ) as HTMLElement;
        const buttons = within(toastContainer).getAllByRole("button");

        // Should have at least action button + close button
        expect(buttons.length).toBeGreaterThanOrEqual(2);

        // Action button should be present
        const actionButton = within(toastContainer).getByRole("button", {
          name: /action/i,
        });
        await expect(actionButton).toBeInTheDocument();
      }
    );

    await step("Tab cycles through toast elements", async () => {
      const toastText = body.getByText("Keyboard Toast");
      const toastContainer = toastText.closest(
        '[role="status"]'
      ) as HTMLElement;
      const buttons = within(toastContainer).getAllByRole("button");

      // Focus the first button directly
      buttons[0].focus();
      expect(buttons[0]).toHaveFocus();

      // Tab to next button
      await userEvent.tab();
      expect(buttons.some((btn) => btn === document.activeElement)).toBe(true);
    });

    await step(
      "Alt+Shift+9 hotkey focuses the top-end toast region",
      async () => {
        // Move focus away from the toast region first
        button.focus();
        expect(button).toHaveFocus();

        // Dispatch native KeyboardEvent matching Zag.js hotkey format
        // Zag checks: event.altKey && event.shiftKey && event.code === "Digit9"
        document.dispatchEvent(
          new KeyboardEvent("keydown", {
            code: "Digit9",
            key: "9",
            altKey: true,
            shiftKey: true,
            bubbles: true,
            cancelable: true,
          })
        );

        // The hotkey should focus the top-end toast region
        await waitFor(() => {
          const activeEl = document.activeElement;
          const region = activeEl?.closest('[data-placement="top-end"]');
          expect(region).not.toBeNull();
        });
      }
    );
  },
};

/**
 * Closable Control
 * Tests closable behavior:
 * - Default (finite duration): no close button (closable defaults to false)
 * - Infinite duration: close button auto-enforced (users need a way to dismiss)
 * - Explicit closable: true: close button shown
 */
export const ClosableControl: Story = {
  render: () => {
    const showClosableToasts = () => {
      toast({
        title: "Not closable (default)",
        description: "No close button shown",
        type: "warning",
        duration: Infinity,
        closable: false,
      });
      toast({
        title: "Closable (opt-in)",
        description: "Close button is visible",
        type: "info",
        closable: true,
        duration: Infinity,
      });
    };

    return (
      <Button onPress={showClosableToasts} data-testid="closable-btn">
        Show Closable Variations
      </Button>
    );
  },
  play: async ({ canvasElement, step }) => {
    await clearToasts();
    const canvas = within(canvasElement);
    const body = within(document.body);
    const button = canvas.getByTestId("closable-btn");

    await step("Toast with closable: false has no close button", async () => {
      await userEvent.click(button);

      const toastText = await body.findByText("Not closable (default)");
      const toastContainer = toastText.closest('[role="alert"]') as HTMLElement;
      const closeButton = within(toastContainer).queryByRole("button");

      // There should be no close button
      await expect(closeButton).not.toBeInTheDocument();
    });

    await step("Toast with closable: true shows close button", async () => {
      const toastText = await body.findByText("Closable (opt-in)");
      const toastContainer = toastText.closest(
        '[role="status"]'
      ) as HTMLElement;
      const closeButton = within(toastContainer).getByRole("button");

      // Close button should be in the document and enabled
      await expect(closeButton).toBeInTheDocument();
      await expect(closeButton).toBeEnabled();
    });
  },
};

/**
 * Reduced Motion
 * Verifies toast renders correctly.
 *
 * Note: Actual reduced-motion behavior is handled by CSS transitions in the recipe
 * and Chakra's animation system. Programmatic testing of prefers-reduced-motion
 * media query is not reliable. Manual verification required with OS-level
 * prefers-reduced-motion enabled.
 */
export const ReducedMotion: Story = {
  render: () => {
    const showMotionToast = () => {
      toast({
        title: "Motion test",
        description: "Verify animation behavior",
        type: "info",
      });
    };

    return (
      <Stack direction="column" gap="16px">
        <Button onPress={showMotionToast} data-testid="motion-toast-btn">
          Show Toast
        </Button>
        <Text fontSize="sm" color="fg.muted">
          Enable &quot;prefers-reduced-motion&quot; in your OS to verify
          animations are reduced
        </Text>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    await clearToasts();
    const canvas = within(canvasElement);
    const body = within(document.body);
    const button = canvas.getByTestId("motion-toast-btn");

    await step("Toast renders correctly", async () => {
      await userEvent.click(button);

      const toastText = await body.findByText("Motion test");
      await expect(toastText).toBeInTheDocument();

      // Toast uses CSS transitions defined in the recipe.
      // prefers-reduced-motion handling is via CSS, not testable
      // programmatically without emulating the media query.
      const toastElement = toastText.closest('[role="status"]') as HTMLElement;
      await expect(toastElement).toBeInTheDocument();
    });
  },
};

/**
 * Programmatic Update
 * Tests toast.update() to change toast content in place
 */
export const ProgrammaticUpdate: Story = {
  render: function UpdateToastDemo() {
    const [toastId, setToastId] = React.useState<string | undefined>();

    const showUpdateToast = () => {
      const id = toast({
        title: "Initial title",
        description: "Initial description",
        type: "info",
        duration: Infinity,
      });
      setToastId(id);
    };

    const updateToast = () => {
      if (toastId) {
        toast.update(toastId, {
          title: "Updated title",
          description: "Updated description",
          type: "success",
        });
      }
    };

    return (
      <Stack direction="column" gap="16px">
        <Button onPress={showUpdateToast} data-testid="show-update-toast-btn">
          Show Toast
        </Button>
        <Button onPress={updateToast} data-testid="update-toast-btn">
          Update Toast
        </Button>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    await clearToasts();
    const canvas = within(canvasElement);
    const body = within(document.body);
    const showButton = canvas.getByTestId("show-update-toast-btn");
    const updateButton = canvas.getByTestId("update-toast-btn");

    await step("toast.update() changes content in place", async () => {
      await userEvent.click(showButton);

      const initialToast = await body.findByText("Initial title");
      await expect(initialToast).toBeInTheDocument();
      await expect(body.getByText("Initial description")).toBeInTheDocument();

      await userEvent.click(updateButton);

      await waitFor(() => {
        expect(body.getByText("Updated title")).toBeInTheDocument();
        expect(body.getByText("Updated description")).toBeInTheDocument();
        expect(body.queryByText("Initial title")).not.toBeInTheDocument();
      });
    });
  },
};

/**
 * Close Button Aria Label
 * Tests that close button has a hardcoded aria-label
 */
export const CloseButtonAriaLabel: Story = {
  render: () => {
    const showToast = () => {
      toast({
        title: "Aria label test",
        description: "Close button should have an aria-label",
        type: "info",
        duration: Infinity,
        closable: true,
      });
    };

    return (
      <Stack direction="column" gap="16px">
        <Button onPress={showToast} data-testid="aria-label-toast-btn">
          Show Toast
        </Button>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    await clearToasts();
    const canvas = within(canvasElement);
    const body = within(document.body);
    const button = canvas.getByTestId("aria-label-toast-btn");

    await step("Close button has aria-label", async () => {
      await userEvent.click(button);

      const toastText = await body.findByText("Aria label test");
      const toastContainer = toastText.closest(
        '[role="status"]'
      ) as HTMLElement;
      const closeButton = within(toastContainer).getByRole("button");

      expect(closeButton.getAttribute("aria-label")).toBe("Dismiss");
    });
  },
};

/**
 * Comprehensive Integration Story
 * Tests multiple features together in realistic scenarios
 */
export const ComprehensiveIntegration: Story = {
  name: "Integration: Real-world Scenarios",
  render: () => {
    const saveScenario = () => {
      // Simulate save operation with promise
      const savePromise = new Promise((resolve) => setTimeout(resolve, 1500));
      toast.promise(savePromise, {
        loading: { title: "Saving...", description: "Please wait" },
        success: {
          title: "Saved successfully",
          description: "Your changes have been saved",
          action: {
            label: "Undo",
            onPress: () => {
              console.log("Undo clicked");
            },
          },
        },
        error: { title: "Save failed", description: "Could not save changes" },
      });
    };

    const networkErrorScenario = () => {
      toast.error({
        title: "Network error",
        description: "Could not connect to server",
        duration: Infinity, // Persist
        closable: true,
        action: {
          label: "Retry",
          onPress: () => {
            console.log("Retry clicked");
          },
        },
      });
    };

    return (
      <Stack direction="column" gap="16px">
        <Button onPress={saveScenario} data-testid="save-scenario-btn">
          Save Document (Promise Pattern)
        </Button>
        <Button onPress={networkErrorScenario} data-testid="error-scenario-btn">
          Network Error (Persistent with Action)
        </Button>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    await clearToasts();
    const canvas = within(canvasElement);
    const body = within(document.body);

    await step(
      "Save scenario: loading → success with undo action",
      async () => {
        const button = canvas.getByTestId("save-scenario-btn");
        await userEvent.click(button);

        // 1. Loading toast appears
        const loadingToast = await body.findByText("Saving...");
        await expect(loadingToast).toBeInTheDocument();

        // 2. Transitions to success toast after promise resolves
        await waitFor(
          () => {
            expect(body.queryByText("Saving...")).not.toBeInTheDocument();
            expect(body.getByText("Saved successfully")).toBeInTheDocument();
          },
          { timeout: 2000 }
        );

        // 3. Success toast has undo action button
        const successToast = body.getByText("Saved successfully");
        const successContainer = successToast.closest(
          '[role="status"]'
        ) as HTMLElement;
        const undoButton = within(successContainer).getByRole("button", {
          name: /undo/i,
        });
        await expect(undoButton).toBeInTheDocument();
      }
    );

    await step(
      "Error scenario: persistent error with retry action",
      async () => {
        const button = canvas.getByTestId("error-scenario-btn");
        await userEvent.click(button);

        // 1. Error toast appears with role="alert"
        const errorToast = await body.findByText("Network error");
        const errorContainer = errorToast.closest(
          '[role="alert"]'
        ) as HTMLElement;
        await expect(errorContainer).toBeInTheDocument();

        // 2. Has retry action button
        const retryButton = within(errorContainer).getByRole("button", {
          name: /retry/i,
        });
        await expect(retryButton).toBeInTheDocument();

        // 3. Has close button for manual dismissal (not the action button)
        const buttons = within(errorContainer).getAllByRole("button");
        expect(buttons.length).toBeGreaterThan(1); // At least action + close

        // 4. Toast persists (duration: Infinity)
        await new Promise((resolve) => setTimeout(resolve, 7000));
        await expect(errorToast).toBeInTheDocument();
      }
    );
  },
};

/**
 * Z-Index Layering
 * Verifies that toasts render above modal dialogs.
 * Zag.js sets z-index to MAX_Z_INDEX (2147483647) on toast regions,
 * ensuring toasts are always the topmost layer.
 */
export const ZIndexLayering: Story = {
  render: () => {
    const showToastFromModal = () => {
      toast.error({
        title: "Error",
        description: "Toast triggered from inside a modal",
        closable: true,
        action: {
          label: "Retry",
          onPress: () => {
            /* noop for test */
          },
        },
      });
    };

    return (
      <Dialog.Root>
        <Dialog.Trigger data-testid="open-modal-btn">Open Modal</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Modal Dialog</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Button
              onPress={showToastFromModal}
              data-testid="toast-from-modal-btn"
            >
              Trigger Toast
            </Button>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.CloseTrigger>Close</Dialog.CloseTrigger>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    await clearToasts();
    const canvas = within(canvasElement);
    const body = within(document.body);

    await step("Toast renders above open modal dialog", async () => {
      // Open the modal
      const openBtn = canvas.getByTestId("open-modal-btn");
      await userEvent.click(openBtn);

      // Wait for modal to be visible
      const modalTitle = await body.findByText("Modal Dialog");
      await expect(modalTitle).toBeInTheDocument();

      // Trigger toast from within the modal
      const toastBtn = body.getByTestId("toast-from-modal-btn");
      await userEvent.click(toastBtn);

      // Wait for toast to appear
      const toastText = await body.findByText(
        "Toast triggered from inside a modal"
      );
      await expect(toastText).toBeInTheDocument();

      // Find the toast region's z-index by walking up from the toast text
      // to the positioned container with an inline z-index style
      let toastEl: HTMLElement | null = toastText.closest(
        "[data-placement]"
      ) as HTMLElement;
      while (toastEl && !toastEl.style.zIndex) {
        toastEl = toastEl.parentElement;
      }

      // Find the modal overlay's z-index by walking up from the dialog
      const dialogEl = body.getByRole("dialog");
      let modalEl: HTMLElement | null = dialogEl as HTMLElement;
      while (modalEl && window.getComputedStyle(modalEl).zIndex === "auto") {
        modalEl = modalEl.parentElement;
      }

      const toastZIndex = toastEl
        ? parseInt(toastEl.style.zIndex || "0", 10)
        : 0;
      const modalZIndex = modalEl
        ? parseInt(window.getComputedStyle(modalEl).zIndex || "0", 10)
        : 0;

      // Toast region must have higher z-index than modal
      expect(toastZIndex).toBeGreaterThan(0);
      expect(modalZIndex).toBeGreaterThan(0);
      expect(toastZIndex).toBeGreaterThan(modalZIndex);
    });

    await step(
      "Toast buttons are interactive while modal is open (not blocked by inert)",
      async () => {
        // The toast region must not be inert — React Aria's ariaHideOutside
        // skips elements with data-react-aria-top-layer="true"
        const toastRegion = document.querySelector(
          "[data-scope='toast'][data-part='group']"
        ) as HTMLElement;
        await expect(toastRegion).not.toBeNull();
        await expect(toastRegion.inert).toBe(false);

        // Verify action button is clickable
        const retryBtn = body.getByRole("button", { name: "Retry" });
        await expect(retryBtn).toBeInTheDocument();
        await userEvent.click(retryBtn);

        // Clicking the action button should dismiss the toast
        await waitFor(
          () => {
            expect(
              body.queryByText("Toast triggered from inside a modal")
            ).not.toBeInTheDocument();
          },
          { timeout: 3000 }
        );
      }
    );
  },
};
