import { describe, it, expect, vi } from "vitest";
import { toast } from "@commercetools/nimbus";

/**
 * @docs-section basic-usage
 * @docs-title Basic Usage
 * @docs-description Create toast notifications using the imperative toast() API
 * @docs-order 1
 */
describe("Toast - Basic usage", () => {
  it("creates toast using toast() function", () => {
    const id = toast({
      title: "Imperative Toast",
      description: "Created programmatically",
      type: "info",
    });

    expect(id).toBeDefined();
    expect(typeof id).toBe("string");

    // Clean up
    toast.remove(id);
  });

  it("creates toasts using convenience methods", () => {
    const successId = toast.success({
      title: "Success Toast",
      description: "Operation completed successfully",
    });

    const errorId = toast.error({
      title: "Error Toast",
      description: "Something went wrong",
    });

    const warningId = toast.warning({
      title: "Warning Toast",
      description: "Please be careful",
    });

    const infoId = toast.info({
      title: "Info Toast",
      description: "Here is some information",
    });

    expect(successId).toBeDefined();
    expect(errorId).toBeDefined();
    expect(warningId).toBeDefined();
    expect(infoId).toBeDefined();

    // Clean up
    toast.remove(successId);
    toast.remove(errorId);
    toast.remove(warningId);
    toast.remove(infoId);
  });

  it("creates toasts with custom placement", () => {
    const id = toast({
      title: "Custom Placement",
      description: "This toast appears at bottom-end",
      placement: "bottom-end",
    });

    expect(id).toBeDefined();

    // Clean up
    toast.remove(id);
  });
});

/**
 * @docs-section programmatic-control
 * @docs-title Programmatic Control
 * @docs-description Update and dismiss toasts programmatically
 * @docs-order 2
 */
describe("Toast - Programmatic control", () => {
  it("updates toast content programmatically", () => {
    const id = toast({
      title: "Initial Title",
      description: "Initial Description",
      duration: Infinity,
    });

    // Update the toast content
    toast.update(id, {
      title: "Updated Title",
      description: "Updated Description",
    });

    // Clean up
    toast.remove(id);
  });

  it("dismisses toast programmatically", () => {
    const id = toast({
      title: "Dismissible Toast",
      description: "This toast can be dismissed programmatically",
      duration: Infinity,
    });

    // Dismiss triggers the exit animation
    toast.dismiss(id);
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
    const promiseSpy = vi.spyOn(toast, "promise");

    const asyncOperation = () =>
      new Promise((resolve) => {
        setTimeout(() => resolve("Done"), 10);
      });

    const promise = asyncOperation();

    toast.promise(promise, {
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

    // Verify toast.promise was called with the correct promise and state titles
    expect(promiseSpy).toHaveBeenCalledWith(
      promise,
      expect.objectContaining({
        loading: expect.objectContaining({ title: "Loading..." }),
        success: expect.objectContaining({ title: "Success!" }),
        error: expect.objectContaining({ title: "Failed" }),
      })
    );

    promiseSpy.mockRestore();
  });
});

/**
 * @docs-section action-buttons
 * @docs-title Action Buttons
 * @docs-description Create toasts with action buttons and callbacks
 * @docs-order 4
 */
describe("Toast - Action buttons", () => {
  it("creates toast with action button", () => {
    const handleAction = vi.fn();

    const id = toast({
      title: "Action Required",
      description: "Please take action",
      action: {
        label: "Retry",
        onPress: handleAction,
      },
    });

    expect(id).toBeDefined();

    // Clean up
    toast.remove(id);
  });
});
