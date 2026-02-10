import type {
  ToastOptions,
  ToastPlacement,
  IToastManager,
  ToastPromiseOptions,
} from "./toast.types";
import { getToaster, DEFAULT_PLACEMENT } from "./toast.toasters";

/**
 * Default toast configuration values.
 */
const DEFAULT_DURATION = 6000; // 6 seconds

/**
 * ToastManager - Singleton class managing multiple toaster instances per placement.
 *
 * Architecture:
 * - Lazy creation: Toasters are created only when first toast for that placement is triggered
 * - ID-to-placement routing: Tracks which toast ID belongs to which placement
 * - Convenience methods: info(), success(), warning(), error() methods
 * - Promise support: promise() method that transitions loading → success/error
 * - Action→duration:0 enforcement: If action is provided, force duration: 0
 * - ARIA role override: Override Chakra's default role="status" with role="alert" for warning/error
 * - Subscribe/notify pattern: Allow ToastOutlet to subscribe to new toaster creation
 */
class ToastManager implements IToastManager {
  private static instance: ToastManager;
  private toastPlacements: Map<string, ToastPlacement> = new Map();

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Get singleton instance of ToastManager.
   */
  public static getInstance(): ToastManager {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager();
    }
    return ToastManager.instance;
  }

  /**
   * Get the placement for a toast (for routing operations).
   * Note: We no longer create toaster instances here - they're created by ToastOutlet.
   */
  private getPlacement(placement?: ToastPlacement): ToastPlacement {
    return this.normalizePlacement(placement);
  }

  /**
   * Get ARIA role and live region attributes based on toast type.
   * Warning and error toasts use role="alert" (assertive),
   * info and success toasts use role="status" (polite).
   */
  private getARIAAttributes(type?: string) {
    if (type === "warning" || type === "error") {
      return {
        role: "alert" as const,
        "aria-live": "assertive" as const,
      };
    }
    return {
      role: "status" as const,
      "aria-live": "polite" as const,
    };
  }

  /**
   * Validate and normalize placement value.
   */
  private normalizePlacement(placement?: ToastPlacement): ToastPlacement {
    const validPlacements: ToastPlacement[] = [
      "top-start",
      "top",
      "top-end",
      "bottom-start",
      "bottom",
      "bottom-end",
    ];

    if (placement && validPlacements.includes(placement)) {
      return placement;
    }

    return DEFAULT_PLACEMENT;
  }

  /**
   * Create a toast and return its ID.
   */
  public create(options: ToastOptions): string {
    // Handle undefined options gracefully
    const safeOptions = options || {};
    const placement = this.getPlacement(safeOptions.placement);
    const toaster = getToaster(placement);

    if (!toaster) {
      throw new Error(`Toaster not found for placement: ${placement}`);
    }

    // Enforce duration: 0 when action is provided (toasts with actions should not auto-dismiss)
    const duration =
      safeOptions.action !== undefined
        ? 0
        : safeOptions.duration !== undefined
          ? safeOptions.duration
          : DEFAULT_DURATION;

    // Get ARIA attributes for the toast type
    const ariaAttributes = this.getARIAAttributes(safeOptions.type);

    // Default pauseOnInteraction to true
    const pauseOnInteraction =
      safeOptions.pauseOnInteraction !== undefined
        ? safeOptions.pauseOnInteraction
        : true;

    const toastOptions = {
      ...safeOptions,
      duration,
      pauseOnInteraction,
      meta: {
        ...safeOptions.meta,
        ...ariaAttributes,
      },
    };

    // Create toast using the toaster instance for this placement
    const id = toaster.create(toastOptions);

    // Track which placement this toast belongs to
    this.toastPlacements.set(id, placement);

    return id;
  }

  /**
   * Update an existing toast.
   */
  public update(id: string, options: Partial<ToastOptions>): void {
    if (!id) return;

    const placement = this.toastPlacements.get(id) || DEFAULT_PLACEMENT;
    const toaster = getToaster(placement);

    if (toaster) {
      toaster.update(id, options);
    }
  }

  /**
   * Dismiss toast(s) with exit animation.
   * If no ID is provided, dismisses all toasts across all placements.
   */
  public dismiss(id?: string): void {
    if (id) {
      const placement = this.toastPlacements.get(id) || DEFAULT_PLACEMENT;
      const toaster = getToaster(placement);

      if (toaster) {
        toaster.dismiss(id);
      }
    } else {
      // Dismiss all toasts across all placements
      const allPlacements: ToastPlacement[] = [
        "top-start",
        "top",
        "top-end",
        "bottom-start",
        "bottom",
        "bottom-end",
      ];

      allPlacements.forEach((placement) => {
        const toaster = getToaster(placement);
        if (toaster) {
          toaster.dismiss();
        }
      });
    }
  }

  /**
   * Remove toast(s) immediately without exit animation.
   * If no ID is provided, removes all toasts across all placements.
   */
  public remove(id?: string): void {
    if (id) {
      const placement = this.toastPlacements.get(id) || DEFAULT_PLACEMENT;
      const toaster = getToaster(placement);

      if (toaster) {
        toaster.remove(id);
      }
      this.toastPlacements.delete(id);
    } else {
      // Remove all toasts across all placements
      const allPlacements: ToastPlacement[] = [
        "top-start",
        "top",
        "top-end",
        "bottom-start",
        "bottom",
        "bottom-end",
      ];

      allPlacements.forEach((placement) => {
        const toaster = getToaster(placement);
        if (toaster) {
          toaster.remove();
        }
      });

      this.toastPlacements.clear();
    }
  }

  /**
   * Create info toast.
   */
  public info(options: Omit<ToastOptions, "type">): string {
    return this.create({ ...options, type: "info" });
  }

  /**
   * Create success toast.
   */
  public success(options: Omit<ToastOptions, "type">): string {
    return this.create({ ...options, type: "success" });
  }

  /**
   * Create warning toast.
   */
  public warning(options: Omit<ToastOptions, "type">): string {
    return this.create({ ...options, type: "warning" });
  }

  /**
   * Create error toast.
   */
  public error(options: Omit<ToastOptions, "type">): string {
    return this.create({ ...options, type: "error" });
  }

  /**
   * Create promise toast with loading/success/error states.
   * The toast will transition from loading → success or loading → error based on promise resolution.
   */
  public promise(
    promise: Promise<unknown>,
    options: ToastPromiseOptions,
    config?: Pick<ToastOptions, "placement">
  ): void {
    const placement = this.getPlacement(config?.placement);
    const toaster = getToaster(placement);

    if (toaster) {
      toaster.promise(promise, options);
    }
  }

  /**
   * Reset manager state (for testing only).
   */
  public reset(): void {
    this.toastPlacements.clear();
  }
}

/**
 * Singleton instance of ToastManager.
 */
const manager = ToastManager.getInstance();

/**
 * Imperative toast API.
 *
 * @example
 * ```tsx
 * // Create toast
 * const id = toast({ title: "Success", type: "success" });
 *
 * // Convenience methods
 * toast.info({ title: "Information" });
 * toast.success({ title: "Success" });
 * toast.warning({ title: "Warning" });
 * toast.error({ title: "Error" });
 *
 * // With action button
 * toast({
 *   title: "Action required",
 *   action: { label: "Undo", onClick: () => {} }
 * });
 *
 * // Promise pattern
 * toast.promise(fetchData(), {
 *   loading: { title: "Loading..." },
 *   success: { title: "Done!" },
 *   error: { title: "Failed!" }
 * });
 *
 * // Dismiss
 * toast.dismiss(id);
 * toast.dismiss(); // Dismiss all
 *
 * // Remove immediately
 * toast.remove(id);
 * toast.remove(); // Remove all
 * ```
 */
export const toast = Object.assign(
  (options: ToastOptions) => manager.create(options),
  {
    info: (options: Omit<ToastOptions, "type">) => manager.info(options),
    success: (options: Omit<ToastOptions, "type">) => manager.success(options),
    warning: (options: Omit<ToastOptions, "type">) => manager.warning(options),
    error: (options: Omit<ToastOptions, "type">) => manager.error(options),
    promise: (
      promise: Promise<unknown>,
      options: ToastPromiseOptions,
      config?: Pick<ToastOptions, "placement">
    ) => manager.promise(promise, options, config),
    update: (id: string, options: Partial<ToastOptions>) =>
      manager.update(id, options),
    dismiss: (id?: string) => manager.dismiss(id),
    remove: (id?: string) => manager.remove(id),
  }
);

// Export ToastManager class for testing
export { ToastManager };
