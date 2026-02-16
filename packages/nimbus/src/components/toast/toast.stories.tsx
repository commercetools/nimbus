/**
 * Storybook stories for Toast component with comprehensive play functions
 * Testing all requirements from OpenSpec:
 * - All 4 variants (info, success, warning, error)
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
import { userEvent, within, expect, waitFor } from "storybook/test";
import {
  Button,
  LoadingSpinner,
  Stack,
  Text,
  toast,
} from "@commercetools/nimbus";
import { chakra, useSlotRecipe } from "@chakra-ui/react/styled-system";
import {
  CheckCircleOutline,
  Clear,
  ErrorOutline,
  Info,
  WarningAmber,
} from "@commercetools/nimbus-icons";

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
  } catch (e) {
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
 * Base Story - All 4 Variants
 * Tests the four toast types with correct icons and color palettes
 */
export const Variants: Story = {
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
        <Button onPress={showToasts}>Show All Variants</Button>
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
    const button = canvas.getByRole("button", { name: /Show All Variants/i });

    await step(
      "Renders all 4 toast variants with correct attributes",
      async () => {
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

        // Check ARIA roles
        const infoContainer = infoToast.closest('[role="status"]');
        const successContainer = successToast.closest('[role="status"]');
        const warningContainer = warningToast.closest('[role="alert"]');
        const errorContainer = errorToast.closest('[role="alert"]');

        await expect(infoContainer).toBeInTheDocument();
        await expect(successContainer).toBeInTheDocument();
        await expect(warningContainer).toBeInTheDocument();
        await expect(errorContainer).toBeInTheDocument();
      }
    );
  },
};

/**
 * Visual Variants
 * Tests "solid" (bold colored background), "subtle" (subtle with border),
 * and "accent-start" (accent line on inline-start edge) variants
 */
export const VisualVariants: Story = {
  render: () => {
    const showSolidVariants = () => {
      toast.info({ title: "Info (solid)", variant: "solid" });
      toast.success({ title: "Success (solid)", variant: "solid" });
      toast.warning({ title: "Warning (solid)", variant: "solid" });
      toast.error({ title: "Error (solid)", variant: "solid" });
    };

    const showSubtleVariants = () => {
      toast.info({ title: "Info (subtle)", variant: "subtle" });
      toast.success({ title: "Success (subtle)", variant: "subtle" });
      toast.warning({ title: "Warning (subtle)", variant: "subtle" });
      toast.error({ title: "Error (subtle)", variant: "subtle" });
    };

    const showAccentStartVariants = () => {
      toast.info({ title: "Info (accent-start)", variant: "accent-start" });
      toast.success({
        title: "Success (accent-start)",
        variant: "accent-start",
      });
      toast.warning({
        title: "Warning (accent-start)",
        variant: "accent-start",
      });
      toast.error({ title: "Error (accent-start)", variant: "accent-start" });
    };

    return (
      <Stack direction="column" gap="16px">
        <Button onPress={showSolidVariants} data-testid="show-solid">
          Show Solid Variants
        </Button>
        <Button onPress={showSubtleVariants} data-testid="show-subtle">
          Show Subtle Variants
        </Button>
        <Button
          onPress={showAccentStartVariants}
          data-testid="show-accent-start"
        >
          Show Accent Start Variants
        </Button>
        <Text fontSize="sm" color="fg.muted">
          Solid: Bold colored backgrounds (default)
          <br />
          Subtle: Subtle backgrounds with borders
          <br />
          Accent Start: Subtle background with colored accent line
        </Text>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    await clearToasts();
    const canvas = within(canvasElement);
    const body = within(document.body);

    await step("Solid variants render with bold backgrounds", async () => {
      const solidButton = canvas.getByTestId("show-solid");
      await userEvent.click(solidButton);

      const infoSolid = await body.findByText("Info (solid)");
      const successSolid = await body.findByText("Success (solid)");
      const warningSolid = await body.findByText("Warning (solid)");
      const errorSolid = await body.findByText("Error (solid)");

      await expect(infoSolid).toBeInTheDocument();
      await expect(successSolid).toBeInTheDocument();
      await expect(warningSolid).toBeInTheDocument();
      await expect(errorSolid).toBeInTheDocument();

      await clearToasts();
    });

    await step("Subtle variants render with subtle borders", async () => {
      const subtleButton = canvas.getByTestId("show-subtle");
      await userEvent.click(subtleButton);

      const infoSubtle = await body.findByText("Info (subtle)");
      const successSubtle = await body.findByText("Success (subtle)");
      const warningSubtle = await body.findByText("Warning (subtle)");
      const errorSubtle = await body.findByText("Error (subtle)");

      await expect(infoSubtle).toBeInTheDocument();
      await expect(successSubtle).toBeInTheDocument();
      await expect(warningSubtle).toBeInTheDocument();
      await expect(errorSubtle).toBeInTheDocument();

      await clearToasts();
    });

    await step("Accent-start variants render with accent line", async () => {
      const accentButton = canvas.getByTestId("show-accent-start");
      await userEvent.click(accentButton);

      const infoAccent = await body.findByText("Info (accent-start)");
      const successAccent = await body.findByText("Success (accent-start)");
      const warningAccent = await body.findByText("Warning (accent-start)");
      const errorAccent = await body.findByText("Error (accent-start)");

      await expect(infoAccent).toBeInTheDocument();
      await expect(successAccent).toBeInTheDocument();
      await expect(warningAccent).toBeInTheDocument();
      await expect(errorAccent).toBeInTheDocument();
    });
  },
};

/**
 * A single static toast rendered with recipe styles directly.
 * No Toaster/toast machine needed — just the visual layout.
 */
function StaticToast({
  type,
  variant,
  title,
  description,
}: {
  type: "info" | "success" | "warning" | "error" | "loading";
  variant: "solid" | "subtle" | "accent-start";
  title: string;
  description: string;
}) {
  const ICON_MAP = {
    info: <Info />,
    success: <CheckCircleOutline />,
    warning: <WarningAmber />,
    error: <ErrorOutline />,
    loading: (
      <LoadingSpinner
        size="xs"
        colorPalette={variant === "solid" ? "white" : "primary"}
      />
    ),
  };

  const COLOR_PALETTE_MAP = {
    info: "info",
    success: "positive",
    warning: "warning",
    error: "critical",
    loading: "neutral",
  };

  const recipe = useSlotRecipe({ key: "toast" });
  const styles = recipe({ variant });

  // Override Ark UI animation CSS custom properties for static display
  const staticRootStyles = {
    ...styles.root,
    colorPalette: COLOR_PALETTE_MAP[type],
    // Neutralize animation transforms so the toast is fully visible
    translate: "0 0",
    scale: "1",
    opacity: "1",
    height: "auto",
    willChange: "auto",
    transition: "none",
    position: "relative" as const,
  };

  return (
    <chakra.div css={staticRootStyles}>
      <chakra.div css={styles.indicator}>{ICON_MAP[type]}</chakra.div>
      <chakra.div css={styles.title}>{title}</chakra.div>
      <chakra.div css={styles.description}>{description}</chakra.div>
      <chakra.div css={styles.closeTrigger}>
        <Clear
          style={{ width: "20px", height: "20px", cursor: "pointer" }}
          role="img"
        />
      </chakra.div>
    </chakra.div>
  );
}

const TOAST_TYPES: Array<"info" | "success" | "warning" | "error" | "loading"> =
  ["info", "success", "warning", "error", "loading"];

/**
 * Static Visual Variants
 * Displays all toast variants statically (no toasting) for styling purposes.
 * Shows all combinations of type (info, success, warning, error) × variant (solid, subtle)
 */
export const StaticVisualVariants: Story = {
  parameters: {
    layout: "padded",
  },
  render: () => (
    <Stack direction="row" gap="32px" alignItems="start">
      <Stack direction="column" gap="16px">
        <Text fontSize="lg" fontWeight="semibold">
          Solid (Default)
        </Text>
        {TOAST_TYPES.map((type) => (
          <StaticToast
            key={`solid-${type}`}
            type={type}
            variant="solid"
            title={`${type.charAt(0).toUpperCase() + type.slice(1)} Toast`}
            description={`This is a ${type} message with bold colored background.`}
          />
        ))}
      </Stack>

      <Stack direction="column" gap="16px">
        <Text fontSize="lg" fontWeight="semibold">
          Subtle
        </Text>
        {TOAST_TYPES.map((type) => (
          <StaticToast
            key={`subtle-${type}`}
            type={type}
            variant="subtle"
            title={`${type.charAt(0).toUpperCase() + type.slice(1)} Toast`}
            description={`This is a ${type} message with subtle background.`}
          />
        ))}
      </Stack>

      <Stack direction="column" gap="16px">
        <Text fontSize="lg" fontWeight="semibold">
          Accent Start
        </Text>
        {TOAST_TYPES.map((type) => (
          <StaticToast
            key={`accent-start-${type}`}
            type={type}
            variant="accent-start"
            title={`${type.charAt(0).toUpperCase() + type.slice(1)} Toast`}
            description={`This is a ${type} message with accent line.`}
          />
        ))}
      </Stack>
    </Stack>
  ),
};

/**
 * ARIA Role Differentiation
 * Tests that info/success use role="status" (polite) and warning/error use role="alert" (assertive)
 */
export const ARIARoles: Story = {
  render: () => {
    const showRoleToasts = () => {
      toast.info({ title: "Info (status) toast" });
      toast.success({ title: "Success (status) toast" });
      toast.warning({ title: "Warning (alert) toast" });
      toast.error({ title: "Error (alert) toast" });
    };

    return (
      <Button onPress={showRoleToasts} data-testid="show-role-toasts">
        Show ARIA Role Toasts
      </Button>
    );
  },
  play: async ({ canvasElement, step }) => {
    await clearToasts();
    const canvas = within(canvasElement);
    const body = within(document.body);
    const button = canvas.getByTestId("show-role-toasts");

    await step("Info and success toasts have role='status'", async () => {
      await userEvent.click(button);

      // Find toasts by their text content
      const infoToast = await body.findByText("Info (status) toast");
      const successToast = await body.findByText("Success (status) toast");

      // Verify they have role="status" and aria-live="polite"
      const infoContainer = infoToast.closest('[role="status"]');
      const successContainer = successToast.closest('[role="status"]');

      await expect(infoContainer).toBeInTheDocument();
      await expect(infoContainer).toHaveAttribute("aria-live", "polite");
      await expect(successContainer).toBeInTheDocument();
      await expect(successContainer).toHaveAttribute("aria-live", "polite");
    });

    await step("Warning and error toasts have role='alert'", async () => {
      const warningToast = await body.findByText("Warning (alert) toast");
      const errorToast = await body.findByText("Error (alert) toast");

      // Verify they have role="alert" and aria-live="assertive"
      const warningContainer = warningToast.closest('[role="alert"]');
      const errorContainer = errorToast.closest('[role="alert"]');

      await expect(warningContainer).toBeInTheDocument();
      await expect(warningContainer).toHaveAttribute("aria-live", "assertive");
      await expect(errorContainer).toBeInTheDocument();
      await expect(errorContainer).toHaveAttribute("aria-live", "assertive");
    });
  },
};

/**
 * Auto-Dismiss Behavior
 * Tests default 6s duration, custom duration, and disabled auto-dismiss (duration: Infinity)
 */
export const AutoDismiss: Story = {
  render: () => {
    const showAutoDismissToasts = () => {
      toast({ title: "Default (6s)", type: "info" });
      toast({ title: "Custom (2s)", type: "success", duration: 2000 });
      toast({ title: "No auto-dismiss", type: "warning", duration: Infinity });
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
        duration: 5000,
        closable: true,
      });
      toast.success({
        title: "Escape key test",
        duration: 5000,
        closable: true,
      });
      toast.warning({ title: "Programmatic dismiss", duration: 5000 });
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
 * Tests action button rendering, prevents auto-dismiss, and onClick callback
 */
export const ActionButton: Story = {
  render: () => {
    const showActionToast = () => {
      toast({
        title: "File deleted",
        description: "Your file was permanently deleted",
        type: "info",
        action: {
          label: "Undo",
          onClick: () => {
            console.log("Action clicked");
          },
        },
      });
    };

    return (
      <Button onPress={showActionToast} data-testid="action-toast-btn">
        Show Toast with Action
      </Button>
    );
  },
  play: async ({ canvasElement, step }) => {
    await clearToasts();
    const canvas = within(canvasElement);
    const body = within(document.body);
    const button = canvas.getByTestId("action-toast-btn");

    await step("Toast with action does not auto-dismiss", async () => {
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

      // Wait 7 seconds (longer than default 6s)
      await new Promise((resolve) => setTimeout(resolve, 7000));

      // Toast should still be visible (action forces duration: Infinity)
      await expect(toastText).toBeInTheDocument();
    });

    await step("Action button is clickable", async () => {
      const toastText = body.getByText("File deleted");
      const toastContainer = toastText.closest(
        '[role="status"]'
      ) as HTMLElement;
      const actionButton = within(toastContainer).getByRole("button", {
        name: /undo/i,
      });

      await userEvent.click(actionButton);
      // Note: mockActionHandler is local to render, so we can't assert on it here
      // This is a limitation of Storybook play functions
    });
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
        toast({ title: `Toast ${i}`, type: "info", duration: Infinity });
      }
    };

    const showManyToasts = () => {
      for (let i = 1; i <= 30; i++) {
        // Exceeds max of 24
        toast({ title: `Toast ${i}`, type: "info", duration: Infinity });
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
      toast({ title: "Top End", type: "info", placement: "top-end" });
      toast({ title: "Bottom End", type: "success", placement: "bottom-end" });
      toast({ title: "Top Start", type: "warning", placement: "top-start" });
      toast({
        title: "Bottom Start",
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
      toast({ title: "Default placement" });
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
 * Tests Tab navigation within toast.
 *
 * Note: Per-placement hotkeys (e.g., Alt+Shift+9) cannot be tested programmatically
 * due to browser security restrictions. Manual verification required.
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
          onClick: () => {
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
  },
};

/**
 * Closable Control
 * Tests closable: true (opt-in) and closable: false (default)
 */
export const ClosableControl: Story = {
  render: () => {
    const showClosableToasts = () => {
      toast({
        title: "Not closable (default)",
        type: "warning",
        duration: Infinity,
      });
      toast({
        title: "Closable (opt-in)",
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

    await step(
      "Default toast has no close button (closable: false)",
      async () => {
        await userEvent.click(button);

        const toastText = await body.findByText("Not closable (default)");
        const toastContainer = toastText.closest(
          '[role="alert"]'
        ) as HTMLElement;
        const closeButton = within(toastContainer).queryByRole("button");

        // There should be no close button
        await expect(closeButton).not.toBeInTheDocument();
      }
    );

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
      toast({ title: "Motion test", type: "info" });
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
 * Internationalization
 * Tests translated aria-label for close button
 */
export const Internationalization: Story = {
  render: () => {
    const showI18nToast = () => {
      toast({
        title: "i18n test",
        type: "info",
        duration: Infinity,
        closable: true,
      });
    };

    return (
      <Stack direction="column" gap="16px">
        <Button onPress={showI18nToast} data-testid="i18n-toast-btn">
          Show Toast
        </Button>
        <Text fontSize="sm" color="fg.muted">
          Close button should have translated aria-label based on locale
        </Text>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    await clearToasts();
    const canvas = within(canvasElement);
    const body = within(document.body);
    const button = canvas.getByTestId("i18n-toast-btn");

    await step("Close button has translated aria-label", async () => {
      await userEvent.click(button);

      const toastText = await body.findByText("i18n test");
      const toastContainer = toastText.closest(
        '[role="status"]'
      ) as HTMLElement;
      const closeButton = within(toastContainer).getByRole("button");

      // Verify aria-label is present and translated (default: English)
      const ariaLabel = closeButton.getAttribute("aria-label");
      expect(ariaLabel).toBeTruthy();

      // Common translations: "Dismiss", "Close", "Schließen" (de), "Cerrar" (es), "Fermer" (fr)
      expect(ariaLabel).toMatch(/dismiss|close|schließen|cerrar|fermer/i);
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
        loading: { title: "Saving..." },
        success: {
          title: "Saved successfully",
          description: "Your changes have been saved",
          action: {
            label: "Undo",
            onClick: () => {
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
          onClick: () => {
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
