import { ModalPageContentSlot } from "../modal-page.slots";
import type { ModalPageContentProps } from "../modal-page.types";

/**
 * ModalPage.Content — scrollable content area.
 *
 * @supportsStyleProps
 */
export const ModalPageContent = ({
  ref,
  children,
  ...props
}: ModalPageContentProps) => {
  return (
    <ModalPageContentSlot ref={ref} {...props}>
      {children}
    </ModalPageContentSlot>
  );
};

ModalPageContent.displayName = "ModalPage.Content";
