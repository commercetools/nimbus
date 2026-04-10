import { ModalPageActionsSlot } from "../modal-page.slots";
import type { ModalPageActionsProps } from "../modal-page.types";

/**
 * ModalPage.Actions — action buttons container, aligned to the right of the header.
 *
 * @supportsStyleProps
 */
export const ModalPageActions = ({
  ref,
  children,
  ...props
}: ModalPageActionsProps) => {
  return (
    <ModalPageActionsSlot ref={ref} {...props}>
      {children}
    </ModalPageActionsSlot>
  );
};

ModalPageActions.displayName = "ModalPage.Actions";
