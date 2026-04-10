import { ModalPageTitleSlot } from "../modal-page.slots";
import type { ModalPageTitleProps } from "../modal-page.types";
import { Heading } from "../../heading/heading";

/**
 * ModalPage.Title — the page title heading. Renders as an `h2` element.
 *
 * Wraps the React Aria `Heading` component with `slot="title"` so the
 * parent Dialog automatically uses it as the accessible name (aria-labelledby).
 *
 * @supportsStyleProps
 */
export const ModalPageTitle = ({
  ref,
  children,
  ...props
}: ModalPageTitleProps) => {
  return (
    <ModalPageTitleSlot ref={ref} {...props}>
      <Heading slot="title" as="h2">
        {children}
      </Heading>
    </ModalPageTitleSlot>
  );
};

ModalPageTitle.displayName = "ModalPage.Title";
