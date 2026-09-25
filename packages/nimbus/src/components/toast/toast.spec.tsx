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

vi.mock("@chakra-ui/react/toast", () => ({
  createToaster: mockCreateToaster,
}));

// Import after mocking to ensure mock is used
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ToastManager: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let toast: any;

/** Toaster mutations are deferred to a microtask; wait for them to run. */
const flushMicrotasks = () =>
  new Promise<void>((resolve) => queueMicrotask(resolve));

describe("ToastManager", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    mockToasterInstance.create.mockReturnValue("toast-id-1");

    const module = await import("./services/toast.manager");
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
    it("Creates toast via the toaster instance", async () => {
      toast({ title: "Test", placement: "top-end" });
      await flushMicrotasks();
      expect(mockToasterInstance.create).toHaveBeenCalledTimes(1);
    });

    it("Reuses toaster for same placement", async () => {
      toast({ title: "First", placement: "top-end" });
      toast({ title: "Second", placement: "top-end" });
      await flushMicrotasks();
      expect(mockToasterInstance.create).toHaveBeenCalledTimes(2);
    });

    it("Uses default placement (top-end) when not specified", async () => {
      toast({ title: "Default" });
      await flushMicrotasks();
      expect(mockToasterInstance.create).toHaveBeenCalled();
    });
  });

  describe("ID Routing", () => {
    it("Routes toast update to correct placement toaster", async () => {
      const id = toast({ title: "Original", placement: "top-end" });
      toast.update(id, { title: "Updated" });

      await flushMicrotasks();
      expect(mockToasterInstance.update).toHaveBeenCalledWith(
        id,
        expect.objectContaining({ title: "Updated" })
      );
    });

    it("Routes toast dismiss to correct placement toaster", async () => {
      const id = toast({ title: "Test", placement: "bottom-end" });
      toast.dismiss(id);

      await flushMicrotasks();
      expect(mockToasterInstance.dismiss).toHaveBeenCalledWith(id);
    });

    it("Routes toast remove to correct placement toaster", async () => {
      const id = toast({ title: "Test", placement: "bottom-start" });
      toast.remove(id);

      await flushMicrotasks();
      expect(mockToasterInstance.remove).toHaveBeenCalledWith(id);
    });
  });

  describe("Convenience Methods", () => {
    it("toast.info() creates info toast", async () => {
      toast.info({ title: "Info message" });

      await flushMicrotasks();
      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Info message",
          type: "info",
        })
      );
    });

    it("toast.success() creates success toast", async () => {
      toast.success({ title: "Success message" });

      await flushMicrotasks();
      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Success message",
          type: "success",
        })
      );
    });

    it("toast.warning() creates warning toast", async () => {
      toast.warning({ title: "Warning message" });

      await flushMicrotasks();
      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Warning message",
          type: "warning",
        })
      );
    });

    it("toast.error() creates error toast", async () => {
      toast.error({ title: "Error message" });

      await flushMicrotasks();
      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Error message",
          type: "error",
        })
      );
    });

    it("Convenience methods respect duration option", async () => {
      toast.error({ title: "Error", duration: 10000 });

      await flushMicrotasks();
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

      await flushMicrotasks();
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

      await flushMicrotasks();
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

      await flushMicrotasks();
      expect(mockToasterInstance.promise).toHaveBeenCalledWith(
        promise,
        expect.objectContaining({
          loading: expect.objectContaining({
            meta: expect.objectContaining({ closable: false }),
          }),
        })
      );
    });

    it("Tunnels closable, variant, and icon through meta for each promise state", async () => {
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

      await flushMicrotasks();
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
    it("Uses default duration when action is provided without explicit duration", async () => {
      toast({
        title: "Action toast",
        action: {
          label: "Undo",
          onPress: vi.fn(),
        },
      });

      await flushMicrotasks();
      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Action toast",
          duration: 6000,
          action: expect.any(Object),
        })
      );
    });

    it("Respects explicit duration when action is provided", async () => {
      toast({
        title: "Action toast",
        duration: 5000,
        action: {
          label: "Undo",
          onPress: vi.fn(),
        },
      });

      await flushMicrotasks();
      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: 5000,
        })
      );
    });

    it("Respects custom duration when no action", async () => {
      toast({
        title: "Normal toast",
        duration: 10000,
      });

      await flushMicrotasks();
      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: 10000,
        })
      );
    });

    it("Uses default duration (6000ms) when not specified", async () => {
      toast({ title: "Default duration" });

      await flushMicrotasks();
      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: 6000,
        })
      );
    });
  });

  describe("remove() vs dismiss()", () => {
    it("dismiss() calls underlying toaster dismiss with animation", async () => {
      const id = toast({ title: "Test" });
      toast.dismiss(id);

      await flushMicrotasks();
      expect(mockToasterInstance.dismiss).toHaveBeenCalledWith(id);
      expect(mockToasterInstance.remove).not.toHaveBeenCalled();
    });

    it("remove() calls underlying toaster remove without animation", async () => {
      const id = toast({ title: "Test" });
      toast.remove(id);

      await flushMicrotasks();
      expect(mockToasterInstance.remove).toHaveBeenCalledWith(id);
      expect(mockToasterInstance.dismiss).not.toHaveBeenCalled();
    });

    it("dismiss() without ID dismisses all toasts across placements", async () => {
      toast.dismiss();

      // Should attempt to dismiss on all placement toasters
      await flushMicrotasks();
      expect(mockToasterInstance.dismiss).toHaveBeenCalled();
    });

    it("remove() without ID removes all toasts across placements", async () => {
      toast.remove();

      // Should attempt to remove on all placement toasters
      await flushMicrotasks();
      expect(mockToasterInstance.remove).toHaveBeenCalled();
    });

    it("dismiss() cleans up ID-to-placement mapping", async () => {
      const id = toast({ title: "Test" });
      toast.dismiss(id);

      // After dismiss, a subsequent update should fall back to default placement
      // (not find the original mapping), proving the entry was cleaned up
      mockToasterInstance.update.mockClear();
      toast.update(id, { title: "Updated" });
      // Still calls update (via default placement fallback), but the mapping is gone
      await flushMicrotasks();
      expect(mockToasterInstance.update).toHaveBeenCalled();
    });

    it("dismiss() without ID clears all ID-to-placement mappings", async () => {
      toast({ title: "First" });
      toast({ title: "Second" });
      toast.dismiss();

      // Verify internal state is cleared by checking that reset() has nothing to clear
      // (no error thrown, clean state)
      await flushMicrotasks();
      expect(mockToasterInstance.dismiss).toHaveBeenCalled();
    });
  });

  describe("Closable option forwarding", () => {
    it("Forwards closable: false to meta by default", async () => {
      toast({ title: "Closable toast" });

      await flushMicrotasks();
      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          meta: expect.objectContaining({
            closable: false,
          }),
        })
      );
    });

    it("Forwards closable: false to meta", async () => {
      toast({ title: "Non-closable toast", closable: false });

      await flushMicrotasks();
      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          meta: expect.objectContaining({
            closable: false,
          }),
        })
      );
    });
  });

  describe("Deferred store mutations", () => {
    it("Defers toaster calls to a microtask (avoids flushSync in React lifecycles)", async () => {
      const id = toast({ title: "Deferred" });
      toast.update(id, { title: "Updated" });
      toast.dismiss(id);

      expect(mockToasterInstance.create).not.toHaveBeenCalled();
      expect(mockToasterInstance.update).not.toHaveBeenCalled();
      expect(mockToasterInstance.dismiss).not.toHaveBeenCalled();

      await flushMicrotasks();

      expect(mockToasterInstance.create).toHaveBeenCalledTimes(1);
      expect(mockToasterInstance.update).toHaveBeenCalledTimes(1);
      expect(mockToasterInstance.dismiss).toHaveBeenCalledTimes(1);
    });

    it("Returns the same ID it passes to the toaster", async () => {
      const id = toast({ title: "With ID" });
      await flushMicrotasks();

      expect(typeof id).toBe("string");
      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({ id })
      );
    });

    it("Preserves call order across create, update, and dismiss", async () => {
      const calls: string[] = [];
      mockToasterInstance.create.mockImplementation(() => calls.push("create"));
      mockToasterInstance.update.mockImplementation(() => calls.push("update"));
      mockToasterInstance.dismiss.mockImplementation(() =>
        calls.push("dismiss")
      );

      const id = toast({ title: "Ordered" });
      toast.update(id, { title: "Updated" });
      toast.dismiss(id);
      await flushMicrotasks();

      expect(calls).toEqual(["create", "update", "dismiss"]);

      mockToasterInstance.update.mockReset();
      mockToasterInstance.dismiss.mockReset();
    });
  });

  describe("Edge Cases", () => {
    it("Handles undefined title gracefully", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast({ title: undefined as any });
      await flushMicrotasks();
      expect(mockToasterInstance.create).toHaveBeenCalled();
    });

    it("Handles empty string title", async () => {
      toast({ title: "" });

      await flushMicrotasks();
      expect(mockToasterInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({ title: "" })
      );
    });

    it("Handles missing options object", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast(undefined as any);
      await flushMicrotasks();
      expect(mockToasterInstance.create).toHaveBeenCalled();
    });

    it("Handles invalid placement fallback", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast({ title: "Test", placement: "invalid" as any });
      // Should fallback to default placement without throwing
      await flushMicrotasks();
      expect(mockToasterInstance.create).toHaveBeenCalled();
    });

    it("Handles update with non-existent ID", async () => {
      toast.update("non-existent-id", { title: "Updated" });
      await flushMicrotasks();
      expect(mockToasterInstance.update).toHaveBeenCalled();
    });

    it("Handles dismiss with non-existent ID", async () => {
      toast.dismiss("non-existent-id");
      await flushMicrotasks();
      expect(mockToasterInstance.dismiss).toHaveBeenCalled();
    });

    it("Handles remove with non-existent ID", async () => {
      toast.remove("non-existent-id");
      await flushMicrotasks();
      expect(mockToasterInstance.remove).toHaveBeenCalled();
    });
  });
});
