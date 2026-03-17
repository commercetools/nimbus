import { ModalPageTitleSlot } from "../modal-page.slots";
import type { ModalPageTitleProps } from "../modal-page.types";
import { Heading } from "../../heading/heading";
import { Text } from "../../text/text";

/**
 * ModalPage.Title — renders an h2 heading and an optional subtitle paragraph.
 *
 * @supportsStyleProps
 */
export const ModalPageTitle = ({
  ref,
  title,
  subtitle,
  ...props
}: ModalPageTitleProps) => {
  return (
    <ModalPageTitleSlot ref={ref} {...props}>
      <Heading slot="title" as="h2" textStyle="xl" fontWeight="semibold">
        {title}
      </Heading>
      {subtitle && (
        <Text textStyle="sm" color="neutral.11" mt="100">
          {subtitle}
        </Text>
      )}
    </ModalPageTitleSlot>
  );
};

ModalPageTitle.displayName = "ModalPage.Title";
