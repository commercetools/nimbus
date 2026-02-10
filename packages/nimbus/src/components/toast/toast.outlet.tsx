import { Toaster, Toast as ChakraToast } from "@chakra-ui/react";
import { Toast } from "./toast";
import { toasters } from "./toast.toasters";

/**
 * Animation styles for the Ark UI toast wrapper.
 *
 * Ark UI's Toast.Root sets CSS custom properties (--x, --y, --scale, --opacity, --height)
 * on the element to drive enter/exit animations. These transition styles consume those
 * variables. The data-state attribute transitions between "open" and "closed" to
 * differentiate enter vs exit timing.
 *
 * These styles live here (not in the recipe) because the Ark UI wrapper is a separate
 * DOM element from the Nimbus Toast.Root. The wrapper owns the CSS custom properties
 * and data-state attribute, while the recipe styles apply to the inner visual component.
 */
const toastAnimationStyles = {
  pointerEvents: "auto",
  translate: "var(--x) var(--y)",
  scale: "var(--scale)",
  opacity: "var(--opacity)",
  height: "var(--height)",
  willChange: "translate, opacity, scale",
  transition:
    "translate {durations.slower}, scale {durations.slower}, opacity {durations.slower}, height {durations.slower}",
  transitionTimingFunction: "cubic-bezier(0.21, 1.02, 0.73, 1)",
  "&[data-state=closed]": {
    transition:
      "translate {durations.slower}, scale {durations.slower}, opacity {durations.moderate}",
    transitionTimingFunction: "cubic-bezier(0.06, 0.71, 0.55, 1)",
  },
} as const;

/**
 * ToastOutlet - Renders all toast regions.
 *
 * This component renders `<Toaster>` components for all placements,
 * connecting them to the toaster instances created in toast.toasters.ts.
 * Toasts appear when created via the toast() API.
 *
 * Architecture:
 * - Eager rendering: All `<Toaster>` components are rendered on mount
 * - Multi-placement support: Each placement gets its own toaster instance
 * - Chakra UI integration: Uses <Toaster> component with children render function
 * - Animation: ChakraToast.Root wraps content to integrate with Ark UI's
 *   animation lifecycle (CSS custom properties + transition events).
 *   The `unstyled` prop disables Chakra's built-in toast recipe while
 *   `css` applies our custom animation transitions.
 *
 * @internal
 */
export function ToastOutlet() {
  return (
    <>
      {Array.from(toasters.entries()).map(([placement, toaster]) => (
        <Toaster key={placement} toaster={toaster}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(toast: any) => {
            const type = toast.type as
              | "info"
              | "success"
              | "warning"
              | "error"
              | undefined;
            const closable =
              toast.meta?.closable !== undefined
                ? (toast.meta.closable as boolean)
                : true;

            return (
              <ChakraToast.Root unstyled css={toastAnimationStyles}>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <Toast.Root type={type} {...(toast.meta as any)}>
                  {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
                  {toast.description && (
                    <Toast.Description>{toast.description}</Toast.Description>
                  )}
                  {toast.action && (
                    <Toast.ActionTrigger
                      onClick={() => {
                        if (typeof toast.action === "object" && toast.action) {
                          const action = toast.action as {
                            label?: string;
                            onClick?: () => void;
                          };
                          action.onClick?.();
                        }
                      }}
                    >
                      {typeof toast.action === "object" &&
                      toast.action &&
                      "label" in toast.action
                        ? String(toast.action.label)
                        : "Action"}
                    </Toast.ActionTrigger>
                  )}
                  {closable && (
                    <Toast.CloseTrigger
                      onPress={() => toaster.dismiss(toast.id)}
                    />
                  )}
                </Toast.Root>
              </ChakraToast.Root>
            );
          }}
        </Toaster>
      ))}
    </>
  );
}
