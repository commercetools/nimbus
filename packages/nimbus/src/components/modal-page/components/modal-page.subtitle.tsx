import { ModalPageSubtitleSlot } from "../modal-page.slots";
import type { ModalPageSubtitleProps } from "../modal-page.types";

/**
 * ModalPage.Subtitle — optional subtitle text below the page title.
 *
 * @supportsStyleProps
 */
export const ModalPageSubtitle = ({
  ref,
  children,
  ...props
}: ModalPageSubtitleProps) => {
  return (
    <ModalPageSubtitleSlot ref={ref} slot="description" {...props}>
      {children}
    </ModalPageSubtitleSlot>
  );
};

ModalPageSubtitle.displayName = "ModalPage.Subtitle";
