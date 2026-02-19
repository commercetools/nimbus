import type {
  ToastAction,
  ToastOptions,
  ToastPlacement,
  ToastManagerApi,
  ToastPromiseOptions,
} from "./toast.types";
import { getToaster, DEFAULT_PLACEMENT, resetToasters } from "./toast.toasters";

/**
 * Default toast configuration values.
 */
const DEFAULT_DURATION = 6000; // 6 seconds

/**
 * Map consumer-facing `onPress` to Chakra/Zag's internal `onClick`.
 */
function mapAction(
  action: ToastAction | undefined
): { label: string; onClick: () => void } | undefined {
  if (!action) return undefined;
  return { label: action.label, onClick: action.onPress };
}

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
 * - Default duration: 6000ms, consumer-controlled (action does not override)
 */
class ToastManager implements ToastManagerApi {
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

    const duration = safeOptions.duration ?? DEFAULT_DURATION;

    // Enforce closable: true for persistent toasts (duration: Infinity)
    // so the user always has a way to dismiss them.
    const closable =
      safeOptions.closable ?? (duration === Infinity ? true : false);

    // Destructure `action` and `icon` out to prevent our ToastAction (onPress) from
    // leaking into the Chakra options object which expects onClick.
    // `icon` is tunneled through meta so the outlet can access it.
    const { action: consumerAction, icon, ...restOptions } = safeOptions;
    const action = mapAction(consumerAction);

    const toastOptions = {
      ...restOptions,
      action,
      duration,
      pauseOnInteraction: safeOptions.pauseOnInteraction ?? true,
      meta: {
        closable,
        variant: safeOptions.variant ?? "accent-start",
        icon,
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
      const { action, icon, variant, closable, ...rest } = options;
      const metaUpdate: Record<string, unknown> = {};
      if (icon !== undefined) metaUpdate.icon = icon;
      if (variant !== undefined) metaUpdate.variant = variant;
      if (closable !== undefined) metaUpdate.closable = closable;

      toaster.update(id, {
        ...rest,
        action: mapAction(action),
        ...(Object.keys(metaUpdate).length > 0 ? { meta: metaUpdate } : {}),
      });
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
      const mapState = (stateOptions: ToastOptions) => {
        const {
          action: consumerAction,
          icon,
          variant,
          closable,
          ...rest
        } = stateOptions;
        const duration = stateOptions.duration ?? DEFAULT_DURATION;
        const resolvedClosable =
          closable ?? (duration === Infinity ? true : false);
        return {
          ...rest,
          duration,
          action: mapAction(consumerAction),
          meta: {
            closable: resolvedClosable,
            variant: variant ?? "accent-start",
            icon,
          },
        };
      };

      const mapped = {
        loading: mapState(options.loading),
        success: mapState(options.success),
        error: mapState(options.error),
      };
      toaster.promise(promise, mapped);
    }
  }

  /**
   * Reset manager state (for testing only).
   *
   * Clears the ID-to-placement map and resets all underlying toaster
   * instances so tests start from a clean slate.
   */
  public reset(): void {
    this.toastPlacements.clear();
    resetToasters();
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
 *   action: { label: "Undo", onPress: () => {} }
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
