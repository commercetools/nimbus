import { ModalPageContentSlot } from "../modal-page.slots";
import type { ModalPageContentProps } from "../modal-page.types";
import { PageContent } from "../../page-content/page-content";

/**
 * ModalPage.Content — scrollable content area.
 *
 * Wraps PageContent.Root with the provided variant and columns.
 *
 * @supportsStyleProps
 */
export const ModalPageContent = ({
  ref,
  children,
  variant = "wide",
  columns = "1",
  ...props
}: ModalPageContentProps) => {
  return (
    <ModalPageContentSlot ref={ref} {...props}>
      <PageContent.Root variant={variant} columns={columns}>
        {children}
      </PageContent.Root>
    </ModalPageContentSlot>
  );
};

ModalPageContent.displayName = "ModalPage.Content";
