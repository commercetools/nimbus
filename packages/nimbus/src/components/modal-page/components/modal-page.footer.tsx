import { ModalPageFooterSlot } from "../modal-page.slots";
import type { ModalPageFooterProps } from "../modal-page.types";

/**
 * ModalPage.Footer — footer slot, typically containing action buttons.
 *
 * @supportsStyleProps
 */
export const ModalPageFooter = ({
  ref,
  children,
  ...props
}: ModalPageFooterProps) => {
  return (
    <ModalPageFooterSlot ref={ref} {...props}>
      {children}
    </ModalPageFooterSlot>
  );
};

ModalPageFooter.displayName = "ModalPage.Footer";
