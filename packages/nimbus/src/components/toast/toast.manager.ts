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

const VALID_PLACEMENTS: ToastPlacement[] = [
  "top-start",
  "top-end",
  "bottom-start",
  "bottom-end",
];

/**
 * ToastManager - Singleton class managing multiple toaster instances per placement.
 *
 * Architecture:
 * - ID-to-placement routing: Tracks which toast ID belongs to which placement
 * - Convenience methods: info(), success(), warning(), error() methods
 * - Promise support: promise() method that transitions loading → success/error
 * - Action→duration:Infinity enforcement: If action is provided, force duration: Infinity
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
   * Validate and normalize placement value.
   */
  private normalizePlacement(placement?: ToastPlacement): ToastPlacement {
    if (placement && VALID_PLACEMENTS.includes(placement)) {
      return placement;
    }
    return DEFAULT_PLACEMENT;
  }

  /**
   * Create a toast and return its ID.
   */
  public create(options: ToastOptions): string {
    const safeOptions = options || {};
    const placement = this.normalizePlacement(safeOptions.placement);
    const toaster = getToaster(placement);

    if (!toaster) {
      throw new Error(`Toaster not found for placement: ${placement}`);
    }

    // Enforce duration: Infinity when action is provided (toasts with actions should not auto-dismiss)
    const duration =
      safeOptions.action !== undefined
        ? Infinity
        : safeOptions.duration !== undefined
          ? safeOptions.duration
          : DEFAULT_DURATION;

    // Enforce closable: true for persistent toasts (duration: Infinity)
    // so the user always has a way to dismiss them.
    const closable =
      safeOptions.closable ?? (duration === Infinity ? true : false);

    const toastOptions = {
      ...safeOptions,
      duration,
      pauseOnInteraction: safeOptions.pauseOnInteraction ?? true,
      meta: {
        closable,
        variant: safeOptions.variant ?? "accent-start",
        ...safeOptions.meta,
      },
    };

    const id = toaster.create(toastOptions);
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
      this.toastPlacements.delete(id);
    } else {
      VALID_PLACEMENTS.forEach((placement) => {
        const toaster = getToaster(placement);
        if (toaster) {
          toaster.dismiss();
        }
      });
      this.toastPlacements.clear();
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
      VALID_PLACEMENTS.forEach((placement) => {
        const toaster = getToaster(placement);
        if (toaster) {
          toaster.remove();
        }
      });
      this.toastPlacements.clear();
    }
  }

  public info(options: Omit<ToastOptions, "type">): string {
    return this.create({ ...options, type: "info" });
  }

  public success(options: Omit<ToastOptions, "type">): string {
    return this.create({ ...options, type: "success" });
  }

  public warning(options: Omit<ToastOptions, "type">): string {
    return this.create({ ...options, type: "warning" });
  }

  public error(options: Omit<ToastOptions, "type">): string {
    return this.create({ ...options, type: "error" });
  }

  /**
   * Create promise toast with loading/success/error states.
   */
  public promise(
    promise: Promise<unknown>,
    options: ToastPromiseOptions,
    config?: Pick<ToastOptions, "placement">
  ): void {
    const placement = this.normalizePlacement(config?.placement);
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

const manager = ToastManager.getInstance();

/**
 * Imperative toast API.
 *
 * @example
 * ```tsx
 * // Create toast
 * const id = toast({ title: "Success", description: "Operation completed", type: "success" });
 *
 * // Convenience methods
 * toast.info({ title: "Information", description: "Something happened" });
 * toast.success({ title: "Success", description: "Operation completed" });
 * toast.warning({ title: "Warning", description: "Please review" });
 * toast.error({ title: "Error", description: "Something went wrong" });
 *
 * // With variant (default is "solid")
 * toast.info({ title: "Subtle info", description: "Additional context", variant: "subtle" });
 * toast.success({ title: "Bold success", description: "Changes saved", variant: "solid" });
 *
 * // With close button (off by default)
 * toast.info({ title: "Closable", description: "Can be dismissed", closable: true });
 *
 * // With action button
 * toast({
 *   title: "Action required",
 *   description: "File was deleted",
 *   action: { label: "Undo", onClick: () => {} }
 * });
 *
 * // Promise pattern
 * toast.promise(fetchData(), {
 *   loading: { title: "Loading...", description: "Please wait" },
 *   success: { title: "Done!", description: "Data loaded" },
 *   error: { title: "Failed!", description: "Could not load data" }
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
    reset: () => manager.reset(),
  }
);

// Export ToastManager class for testing
export { ToastManager };
