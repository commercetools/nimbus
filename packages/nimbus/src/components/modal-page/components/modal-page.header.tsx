import { ModalPageHeaderSlot } from "../modal-page.slots";
import type { ModalPageHeaderProps } from "../modal-page.types";

/**
 * ModalPage.Header — header section, 2-column grid (title | actions).
 *
 * @supportsStyleProps
 */
export const ModalPageHeader = ({
  ref,
  children,
  ...props
}: ModalPageHeaderProps) => {
  return (
    <ModalPageHeaderSlot ref={ref} {...props}>
      {children}
    </ModalPageHeaderSlot>
  );
};

ModalPageHeader.displayName = "ModalPage.Header";
