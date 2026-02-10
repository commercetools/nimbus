import { Toaster } from "@chakra-ui/react";
import { Toast } from "./toast";
import { toasters } from "./toast.toasters";

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
              /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
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
            );
          }}
        </Toaster>
      ))}
    </>
  );
}
