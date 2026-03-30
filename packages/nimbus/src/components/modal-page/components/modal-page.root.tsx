import { useCallback } from "react";
import { Drawer } from "../../drawer/drawer";
import { ModalPageRootSlot } from "../modal-page.slots";
import type { ModalPageRootProps } from "../modal-page.types";

/**
 * ModalPage.Root — fullscreen modal page overlay.
 *
 * Renders a right-side Drawer with near-full-width, full-height layout.
 * Provides the slot recipe context for all ModalPage sub-components via a
 * CSS grid container (rows: topBar / header / content / footer).
 *
 * Style props (e.g. `width`) are forwarded to the Drawer.Content panel.
 * The default width is near-fullscreen; consumers can pass a custom `width`
 * to override.
 *
 * Dismissal: backdrop click is disabled (no accidental close on a full-page
 * form). Escape key remains active (isKeyboardDismissDisabled defaults to
 * false), matching standard browser/OS modal behaviour and WCAG 2.1 SC 2.1.2.
 *
 * Exit animations are handled automatically: the Drawer recipe defines
 * [data-exiting] CSS animations (fade-out on overlay, slide-to-right-full on
 * modal), and React Aria's ModalOverlay waits for animationend before
 * unmounting — no manual delay needed.
 */
// Note: Root wraps a Drawer instead of rendering a slot directly, so the
// standard useSlotRecipe / splitVariantProps / extractStyleProps pattern does
// not apply here. Recipe context is provided by ModalPageRootSlot (withProvider).
export const ModalPageRoot = ({
  ref,
  isOpen,
  onClose,
  children,
  width = "calc(100vw - {spacing.1200})",
}: ModalPageRootProps) => {
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <Drawer.Root
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      placement="right"
      // Disable backdrop-click dismissal — fullscreen modal pages must not
      // close on accidental outside click. Escape key remains active.
      isDismissable={false}
    >
      <Drawer.Content width={width}>
        <ModalPageRootSlot ref={ref}>{children}</ModalPageRootSlot>
      </Drawer.Content>
    </Drawer.Root>
  );
};

ModalPageRoot.displayName = "ModalPage.Root";
