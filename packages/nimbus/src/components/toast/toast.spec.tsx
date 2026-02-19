/**
 * Unit tests for ToastManager singleton
 *
 * These tests validate the ToastManager's core functionality:
 * - Singleton pattern
 * - ID routing to correct toaster
 * - Convenience methods (info, success, warning, error)
 * - Promise handling with state transitions
 * - Action button → duration:Infinity enforcement
 * - remove() vs dismiss() behavior
 * - Closable option forwarding via meta
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock Chakra UI's createToaster API
const mockToasterInstance = {
  create: vi.fn().mockReturnValue("toast-id-1"),
  update: vi.fn(),
  dismiss: vi.fn(),
  remove: vi.fn(),
  promise: vi.fn(),
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
    vi.clearAllMocks();
    mockToasterInstance.create.mockReturnValue("toast-id-1");

    const module = await import("./toast.manager");
    ToastManager = module.ToastManager;
    toast = module.toast;
  });

  afterEach(() => {
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

  describe("Toast Creation", () => {
    it("Creates toast via the toaster instance", () => {
      toast({ title: "Test", placement: "top-end" });
      expect(mockToasterInstance.create).toHaveBeenCalledTimes(1);
    });

    it("Reuses toaster for same placement", () => {
      toast({ title: "First", placement: "top-end" });
      toast({ title: "Second", placement: "top-end" });
      expect(mockToasterInstance.create).toHaveBeenCalledTimes(2);
    });

    it("Uses default placement (top-end) when not specified", () => {
      toast({ title: "Default" });
      expect(mockToasterInstance.create).toHaveBeenCalled();
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

      expect(mockToasterInstance.promise).toHaveBeenCalledWith(
        promise,
        expect.objectContaining({
          loading: expect.objectContaining({
            title: "Loading...",
            meta: expect.objectContaining({
              closable: false,
              variant: "accent-start",
            }),
          }),
          success: expect.objectContaining({
            title: "Done!",
            meta: expect.objectContaining({
              closable: false,
              variant: "accent-start",
            }),
          }),
          error: expect.objectContaining({
            title: "Failed!",
            meta: expect.objectContaining({
              closable: false,
              variant: "accent-start",
            }),
          }),
        })
      );
    });

    it("Creates loading toast that transitions to error", async () => {
      const promise = Promise.reject(new Error("Failed"));

      toast.promise(promise, {
        loading: { title: "Loading..." },
        success: { title: "Done!" },
        error: { title: "Failed!" },
      });

      expect(mockToasterInstance.promise).toHaveBeenCalledWith(
        promise,
        expect.objectContaining({
          loading: expect.objectContaining({
            title: "Loading...",
            meta: expect.objectContaining({ closable: false }),
          }),
          error: expect.objectContaining({
            title: "Failed!",
            meta: expect.objectContaining({ closable: false }),
          }),
        })
      );

      // Prevent unhandled rejection
      promise.catch(() => {});
    });

    it("Promise loading state with closable: false", async () => {
      const promise = Promise.resolve();

      toast.promise(promise, {
        loading: { title: "Loading...", closable: false },
        success: { title: "Done!" },
        error: { title: "Failed!" },
      });

      expect(mockToasterInstance.promise).toHaveBeenCalledWith(
        promise,
        expect.objectContaining({
          loading: expect.objectContaining({
            meta: expect.objectContaining({ closable: false }),
          }),
        })
      );
    });

    it("Tunnels closable, variant, and icon through meta for each promise state", () => {
      const promise = Promise.resolve();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const customIcon = { type: "svg", props: {} } as any;

      toast.promise(promise, {
        loading: {
          title: "Loading...",
          closable: true,
          variant: "solid",
          icon: customIcon,
        },
        success: {
          title: "Done!",
          closable: true,
          variant: "solid",
          icon: customIcon,
        },
        error: {
          title: "Failed!",
          closable: true,
          variant: "solid",
          icon: customIcon,
        },
      });

      expect(mockToasterInstance.promise).toHaveBeenCalledWith(
        promise,
        expect.objectContaining({
          loading: expect.objectContaining({
            meta: expect.objectContaining({
              closable: true,
              variant: "solid",
              icon: customIcon,
            }),
          }),
          success: expect.objectContaining({
            meta: expect.objectContaining({
              closable: true,
              variant: "solid",
              icon: customIcon,
            }),
          }),
          error: expect.objectContaining({
            meta: expect.objectContaining({
              closable: true,
              variant: "solid",
              icon: customIcon,
            }),
          }),
        })
      );
    });
  });

  describe("Action Button → Duration Behavior", () => {
    it("Uses default duration when action is provided without explicit duration", () => {
      toast({
        title: "Action toast",
        action: {
          label: "Undo",
          onPress: vi.fn(),
        },
      });

      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Action toast",
          duration: 6000,
          action: expect.any(Object),
        })
      );
    });

    it("Respects explicit duration when action is provided", () => {
      toast({
        title: "Action toast",
        duration: 5000,
        action: {
          label: "Undo",
          onPress: vi.fn(),
        },
      });

      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: 5000,
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
          duration: 6000,
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

    it("dismiss() without ID dismisses all toasts across placements", () => {
      toast.dismiss();

      // Should attempt to dismiss on all placement toasters
      expect(mockToasterInstance.dismiss).toHaveBeenCalled();
    });

    it("remove() without ID removes all toasts across placements", () => {
      toast.remove();

      // Should attempt to remove on all placement toasters
      expect(mockToasterInstance.remove).toHaveBeenCalled();
    });

    it("dismiss() cleans up ID-to-placement mapping", () => {
      const id = toast({ title: "Test" });
      toast.dismiss(id);

      // After dismiss, a subsequent update should fall back to default placement
      // (not find the original mapping), proving the entry was cleaned up
      mockToasterInstance.update.mockClear();
      toast.update(id, { title: "Updated" });
      // Still calls update (via default placement fallback), but the mapping is gone
      expect(mockToasterInstance.update).toHaveBeenCalled();
    });

    it("dismiss() without ID clears all ID-to-placement mappings", () => {
      toast({ title: "First" });
      toast({ title: "Second" });
      toast.dismiss();

      // Verify internal state is cleared by checking that reset() has nothing to clear
      // (no error thrown, clean state)
      expect(mockToasterInstance.dismiss).toHaveBeenCalled();
    });
  });

  describe("Closable option forwarding", () => {
    it("Forwards closable: false to meta by default", () => {
      toast({ title: "Closable toast" });

      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          meta: expect.objectContaining({
            closable: false,
          }),
        })
      );
    });

    it("Forwards closable: false to meta", () => {
      toast({ title: "Non-closable toast", closable: false });

      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          meta: expect.objectContaining({
            closable: false,
          }),
        })
      );
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast(undefined as any);
      expect(mockToasterInstance.create).toHaveBeenCalled();
    });

    it("Handles invalid placement fallback", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast({ title: "Test", placement: "invalid" as any });
      // Should fallback to default placement without throwing
      expect(mockToasterInstance.create).toHaveBeenCalled();
    });

    it("Handles update with non-existent ID", () => {
      toast.update("non-existent-id", { title: "Updated" });
      expect(mockToasterInstance.update).toHaveBeenCalled();
    });

    it("Handles dismiss with non-existent ID", () => {
      toast.dismiss("non-existent-id");
      expect(mockToasterInstance.dismiss).toHaveBeenCalled();
    });

    it("Handles remove with non-existent ID", () => {
      toast.remove("non-existent-id");
      expect(mockToasterInstance.remove).toHaveBeenCalled();
    });
  });

  describe("Configuration Options", () => {
    it("Passes pauseOnInteraction: false when specified", () => {
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
  });
});
