/**
 * Unit tests for ToastManager singleton
 *
 * These tests validate the ToastManager's core functionality:
 * - Lazy toaster creation per placement
 * - ID routing to correct toaster
 * - Convenience methods (info, success, warning, error)
 * - Promise handling with state transitions
 * - Action button → duration:0 enforcement
 * - remove() vs dismiss() behavior
 * - Per-placement hotkey mapping
 * - ARIA role override for warning/error types
 * - Subscribe/notify pattern for ToastOutlet
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { ToasterStore } from "./toast.types";

// Mock Chakra UI's createToaster API
const mockToasterInstance = {
  create: vi.fn().mockReturnValue("toast-id-1"),
  update: vi.fn(),
  dismiss: vi.fn(),
  remove: vi.fn(),
  promise: vi.fn(),
  success: vi.fn().mockReturnValue("toast-id-success"),
  error: vi.fn().mockReturnValue("toast-id-error"),
  info: vi.fn().mockReturnValue("toast-id-info"),
  warning: vi.fn().mockReturnValue("toast-id-warning"),
  pause: vi.fn(),
  resume: vi.fn(),
  isActive: vi.fn(),
  getState: vi.fn(() => ({
    toasts: [],
  })),
};

const mockCreateToaster = vi.fn(() => mockToasterInstance);

vi.mock("@chakra-ui/react", () => ({
  createToaster: mockCreateToaster,
}));

// Import after mocking to ensure mock is used
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ToastManager: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let toast: any;

describe("ToastManager", () => {
  beforeEach(async () => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    mockCreateToaster.mockClear();
    mockToasterInstance.create.mockClear();
    mockToasterInstance.update.mockClear();
    mockToasterInstance.dismiss.mockClear();
    mockToasterInstance.remove.mockClear();
    mockToasterInstance.promise.mockClear();

    // Reset ID counter
    mockToasterInstance.create.mockReturnValue("toast-id-1");
    mockToasterInstance.success.mockReturnValue("toast-id-success");
    mockToasterInstance.error.mockReturnValue("toast-id-error");
    mockToasterInstance.info.mockReturnValue("toast-id-info");
    mockToasterInstance.warning.mockReturnValue("toast-id-warning");

    // Dynamic import to get fresh module
    const module = await import("./toast.manager");
    ToastManager = module.ToastManager;
    toast = module.toast;
  });

  afterEach(() => {
    // Clean up singleton state between tests
    if (ToastManager.getInstance) {
      const instance = ToastManager.getInstance();
      if (instance && typeof instance.reset === "function") {
        instance.reset();
      }
    }
  });

  describe("Singleton Pattern", () => {
    it("Returns the same instance on multiple calls", () => {
      const instance1 = ToastManager.getInstance();
      const instance2 = ToastManager.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe("Lazy Toaster Creation", () => {
    it("Does not create any toasters initially", () => {
      expect(mockCreateToaster).not.toHaveBeenCalled();
    });

    it("Creates toaster on first toast for a placement", () => {
      toast({ title: "Test", placement: "top-end" });

      expect(mockCreateToaster).toHaveBeenCalledTimes(1);
      expect(mockCreateToaster).toHaveBeenCalledWith(
        expect.objectContaining({
          placement: "top-end",
        })
      );
    });

    it("Reuses existing toaster for same placement", () => {
      toast({ title: "First", placement: "top-end" });
      toast({ title: "Second", placement: "top-end" });

      // Should only create one toaster
      expect(mockCreateToaster).toHaveBeenCalledTimes(1);
      expect(mockToasterInstance.create).toHaveBeenCalledTimes(2);
    });

    it("Creates separate toasters for different placements", () => {
      toast({ title: "Top", placement: "top-end" });
      toast({ title: "Bottom", placement: "bottom-end" });

      expect(mockCreateToaster).toHaveBeenCalledTimes(2);
      expect(mockCreateToaster).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ placement: "top-end" })
      );
      expect(mockCreateToaster).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ placement: "bottom-end" })
      );
    });

    it("Uses default placement when not specified", () => {
      toast({ title: "Default" });

      expect(mockCreateToaster).toHaveBeenCalledWith(
        expect.objectContaining({
          placement: "top-end", // Default placement
        })
      );
    });
  });

  describe("ID Routing", () => {
    it("Routes toast update to correct placement toaster", () => {
      const id = toast({ title: "Original", placement: "top-end" });
      toast.update(id, { title: "Updated" });

      expect(mockToasterInstance.update).toHaveBeenCalledWith(
        id,
        expect.objectContaining({ title: "Updated" })
      );
    });

    it("Routes toast dismiss to correct placement toaster", () => {
      const id = toast({ title: "Test", placement: "bottom-end" });
      toast.dismiss(id);

      expect(mockToasterInstance.dismiss).toHaveBeenCalledWith(id);
    });

    it("Routes toast remove to correct placement toaster", () => {
      const id = toast({ title: "Test", placement: "bottom-start" });
      toast.remove(id);

      expect(mockToasterInstance.remove).toHaveBeenCalledWith(id);
    });

    it("Handles cross-placement operations", () => {
      const id1 = toast({ title: "Top", placement: "top-end" });
      const id2 = toast({ title: "Bottom", placement: "bottom-end" });

      // Create separate toaster instances for testing
      const topToaster = { ...mockToasterInstance };
      const bottomToaster = { ...mockToasterInstance };

      mockCreateToaster
        .mockReturnValueOnce(topToaster)
        .mockReturnValueOnce(bottomToaster);

      toast.dismiss(id1);
      toast.dismiss(id2);

      // Both toasters should have dismiss called
      expect(mockToasterInstance.dismiss).toHaveBeenCalledTimes(2);
    });
  });

  describe("Convenience Methods", () => {
    it("toast.info() creates info toast", () => {
      toast.info({ title: "Info message" });

      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Info message",
          type: "info",
        })
      );
    });

    it("toast.success() creates success toast", () => {
      toast.success({ title: "Success message" });

      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Success message",
          type: "success",
        })
      );
    });

    it("toast.warning() creates warning toast", () => {
      toast.warning({ title: "Warning message" });

      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Warning message",
          type: "warning",
        })
      );
    });

    it("toast.error() creates error toast", () => {
      toast.error({ title: "Error message" });

      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Error message",
          type: "error",
        })
      );
    });

    it("Convenience methods respect placement option", () => {
      toast.success({ title: "Success", placement: "bottom-start" });

      expect(mockCreateToaster).toHaveBeenCalledWith(
        expect.objectContaining({
          placement: "bottom-start",
        })
      );
    });

    it("Convenience methods respect duration option", () => {
      toast.error({ title: "Error", duration: 10000 });

      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Error",
          type: "error",
          duration: 10000,
        })
      );
    });
  });

  describe("Promise Pattern", () => {
    it("Creates loading toast that transitions to success", async () => {
      const promise = Promise.resolve("Success");

      toast.promise(promise, {
        loading: { title: "Loading..." },
        success: { title: "Done!" },
        error: { title: "Failed!" },
      });

      expect(mockToasterInstance.promise).toHaveBeenCalledWith(promise, {
        loading: { title: "Loading..." },
        success: { title: "Done!" },
        error: { title: "Failed!" },
      });
    });

    it("Creates loading toast that transitions to error", async () => {
      const promise = Promise.reject(new Error("Failed"));

      toast.promise(promise, {
        loading: { title: "Loading..." },
        success: { title: "Done!" },
        error: { title: "Failed!" },
      });

      expect(mockToasterInstance.promise).toHaveBeenCalledWith(promise, {
        loading: { title: "Loading..." },
        success: { title: "Done!" },
        error: { title: "Failed!" },
      });

      // Prevent unhandled rejection
      promise.catch(() => {});
    });

    it("Promise toast respects placement option", () => {
      const promise = Promise.resolve();

      toast.promise(
        promise,
        {
          loading: { title: "Loading..." },
          success: { title: "Done!" },
          error: { title: "Failed!" },
        },
        { placement: "bottom-end" }
      );

      expect(mockCreateToaster).toHaveBeenCalledWith(
        expect.objectContaining({
          placement: "bottom-end",
        })
      );
    });

    it("Promise loading state has closable: false", async () => {
      const promise = Promise.resolve();

      toast.promise(promise, {
        loading: { title: "Loading...", closable: false },
        success: { title: "Done!" },
        error: { title: "Failed!" },
      });

      expect(mockToasterInstance.promise).toHaveBeenCalledWith(
        promise,
        expect.objectContaining({
          loading: expect.objectContaining({ closable: false }),
        })
      );
    });
  });

  describe("Action Button → Duration:0 Enforcement", () => {
    it("Sets duration: 0 when action is provided", () => {
      toast({
        title: "Action toast",
        action: {
          label: "Undo",
          onClick: vi.fn(),
        },
      });

      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Action toast",
          duration: 0, // Should be enforced
          action: expect.any(Object),
        })
      );
    });

    it("Overrides explicit duration when action is provided", () => {
      toast({
        title: "Action toast",
        duration: 5000,
        action: {
          label: "Undo",
          onClick: vi.fn(),
        },
      });

      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: 0, // Should override the 5000
        })
      );
    });

    it("Respects custom duration when no action", () => {
      toast({
        title: "Normal toast",
        duration: 10000,
      });

      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: 10000,
        })
      );
    });

    it("Uses default duration (6000ms) when not specified", () => {
      toast({ title: "Default duration" });

      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: 6000, // Default
        })
      );
    });
  });

  describe("remove() vs dismiss()", () => {
    it("dismiss() calls underlying toaster dismiss with animation", () => {
      const id = toast({ title: "Test" });
      toast.dismiss(id);

      expect(mockToasterInstance.dismiss).toHaveBeenCalledWith(id);
      expect(mockToasterInstance.remove).not.toHaveBeenCalled();
    });

    it("remove() calls underlying toaster remove without animation", () => {
      const id = toast({ title: "Test" });
      toast.remove(id);

      expect(mockToasterInstance.remove).toHaveBeenCalledWith(id);
      expect(mockToasterInstance.dismiss).not.toHaveBeenCalled();
    });

    it("dismiss() without ID dismisses all toasts", () => {
      toast({ title: "First", placement: "top-end" });
      toast({ title: "Second", placement: "bottom-end" });

      toast.dismiss();

      // Should call dismiss on both toasters
      expect(mockToasterInstance.dismiss).toHaveBeenCalledTimes(2);
    });

    it("remove() without ID removes all toasts", () => {
      toast({ title: "First", placement: "top-end" });
      toast({ title: "Second", placement: "bottom-end" });

      toast.remove();

      // Should call remove on both toasters
      expect(mockToasterInstance.remove).toHaveBeenCalledTimes(2);
    });
  });

  describe("Per-Placement Hotkey Mapping", () => {
    it("Maps top-end to Alt+Shift+9 (numpad position)", () => {
      const manager = ToastManager.getInstance();
      const hotkey = manager.getHotkeyForPlacement?.("top-end");

      expect(hotkey).toBe("Alt+Shift+9");
    });

    it("Maps top to Alt+Shift+8 (numpad position)", () => {
      const manager = ToastManager.getInstance();
      const hotkey = manager.getHotkeyForPlacement?.("top");

      expect(hotkey).toBe("Alt+Shift+8");
    });

    it("Maps top-start to Alt+Shift+7 (numpad position)", () => {
      const manager = ToastManager.getInstance();
      const hotkey = manager.getHotkeyForPlacement?.("top-start");

      expect(hotkey).toBe("Alt+Shift+7");
    });

    it("Maps bottom-end to Alt+Shift+3 (numpad position)", () => {
      const manager = ToastManager.getInstance();
      const hotkey = manager.getHotkeyForPlacement?.("bottom-end");

      expect(hotkey).toBe("Alt+Shift+3");
    });

    it("Maps bottom to Alt+Shift+2 (numpad position)", () => {
      const manager = ToastManager.getInstance();
      const hotkey = manager.getHotkeyForPlacement?.("bottom");

      expect(hotkey).toBe("Alt+Shift+2");
    });

    it("Maps bottom-start to Alt+Shift+1 (numpad position)", () => {
      const manager = ToastManager.getInstance();
      const hotkey = manager.getHotkeyForPlacement?.("bottom-start");

      expect(hotkey).toBe("Alt+Shift+1");
    });

    it("Only active placements have registered hotkeys", () => {
      toast({ title: "Test", placement: "top-end" });

      const manager = ToastManager.getInstance();
      const activeHotkeys = manager.getActiveHotkeys?.();

      expect(activeHotkeys).toContain("Alt+Shift+9");
      expect(activeHotkeys).not.toContain("Alt+Shift+1"); // bottom-start not created
    });
  });

  describe("ARIA Role Override", () => {
    it("Sets role=alert for warning type", () => {
      toast.warning({ title: "Warning" });

      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "warning",
          meta: expect.objectContaining({
            role: "alert",
            "aria-live": "assertive",
          }),
        })
      );
    });

    it("Sets role=alert for error type", () => {
      toast.error({ title: "Error" });

      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "error",
          meta: expect.objectContaining({
            role: "alert",
            "aria-live": "assertive",
          }),
        })
      );
    });

    it("Uses role=status for info type", () => {
      toast.info({ title: "Info" });

      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "info",
          meta: expect.objectContaining({
            role: "status",
            "aria-live": "polite",
          }),
        })
      );
    });

    it("Uses role=status for success type", () => {
      toast.success({ title: "Success" });

      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "success",
          meta: expect.objectContaining({
            role: "status",
            "aria-live": "polite",
          }),
        })
      );
    });
  });

  describe("Subscribe/Notify Pattern", () => {
    it("Notifies subscribers when new toaster is created", () => {
      const subscriber = vi.fn();
      const manager = ToastManager.getInstance();

      manager.subscribe?.(subscriber);
      toast({ title: "Test", placement: "top-end" });

      expect(subscriber).toHaveBeenCalledWith(
        expect.objectContaining({
          placement: "top-end",
          toaster: expect.any(Object),
        })
      );
    });

    it("Notifies multiple subscribers", () => {
      const subscriber1 = vi.fn();
      const subscriber2 = vi.fn();
      const manager = ToastManager.getInstance();

      manager.subscribe?.(subscriber1);
      manager.subscribe?.(subscriber2);
      toast({ title: "Test", placement: "bottom-end" });

      expect(subscriber1).toHaveBeenCalled();
      expect(subscriber2).toHaveBeenCalled();
    });

    it("Allows unsubscribing", () => {
      const subscriber = vi.fn();
      const manager = ToastManager.getInstance();

      const unsubscribe = manager.subscribe?.(subscriber);
      unsubscribe?.();

      toast({ title: "Test", placement: "top-end" });

      expect(subscriber).not.toHaveBeenCalled();
    });

    it("Does not notify for existing toaster", () => {
      const subscriber = vi.fn();
      const manager = ToastManager.getInstance();

      toast({ title: "First", placement: "top-end" });
      manager.subscribe?.(subscriber);
      toast({ title: "Second", placement: "top-end" }); // Same placement

      // Should not notify because toaster already exists
      expect(subscriber).not.toHaveBeenCalled();
    });

    it("Provides access to all active toasters", () => {
      toast({ title: "Top", placement: "top-end" });
      toast({ title: "Bottom", placement: "bottom-end" });

      const manager = ToastManager.getInstance();
      const toasters = manager.getToasters?.();

      expect(toasters).toHaveLength(2);
      expect(toasters?.map((t: ToasterStore) => t.placement)).toEqual([
        "top-end",
        "bottom-end",
      ]);
    });
  });

  describe("Edge Cases", () => {
    it("Handles undefined title gracefully", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast({ title: undefined as any });

      expect(mockToasterInstance.create).toHaveBeenCalled();
    });

    it("Handles empty string title", () => {
      toast({ title: "" });

      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({ title: "" })
      );
    });

    it("Handles missing options object", () => {
      // Testing runtime behavior with undefined options
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast(undefined as any);

      expect(mockToasterInstance.create).toHaveBeenCalled();
    });

    it("Handles invalid placement fallback", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast({ title: "Test", placement: "invalid" as any });

      // Should fallback to default placement
      expect(mockCreateToaster).toHaveBeenCalledWith(
        expect.objectContaining({
          placement: expect.stringMatching(/top|bottom/),
        })
      );
    });

    it("Handles update with non-existent ID", () => {
      toast.update("non-existent-id", { title: "Updated" });

      // Should not throw, just silently fail or handle gracefully
      expect(mockToasterInstance.update).toHaveBeenCalled();
    });

    it("Handles dismiss with non-existent ID", () => {
      toast.dismiss("non-existent-id");

      // Should not throw
      expect(mockToasterInstance.dismiss).toHaveBeenCalled();
    });

    it("Handles remove with non-existent ID", () => {
      toast.remove("non-existent-id");

      // Should not throw
      expect(mockToasterInstance.remove).toHaveBeenCalled();
    });
  });

  describe("Configuration Options", () => {
    it("Passes pauseOnPageIdle to toaster", () => {
      toast({ title: "Test", pauseOnPageIdle: true });

      expect(mockCreateToaster).toHaveBeenCalledWith(
        expect.objectContaining({
          pauseOnPageIdle: true,
        })
      );
    });

    it("Passes pauseOnInteraction to toaster", () => {
      toast({ title: "Test", pauseOnInteraction: false });

      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          pauseOnInteraction: false,
        })
      );
    });

    it("Uses default pauseOnInteraction: true", () => {
      toast({ title: "Test" });

      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          pauseOnInteraction: true,
        })
      );
    });

    it("Uses default pauseOnPageIdle: true", () => {
      toast({ title: "Test" });

      expect(mockCreateToaster).toHaveBeenCalledWith(
        expect.objectContaining({
          pauseOnPageIdle: true,
        })
      );
    });
  });
});
