import { ArrowBack } from "@commercetools/nimbus-icons";
import { Text } from "../../text/text";
import { ModalPageTopBarSlot } from "../modal-page.slots";
import type { ModalPageTopBarProps } from "../modal-page.types";
import { IconButton } from "../../icon-button/icon-button";
import { useLocalizedStringFormatter } from "@/hooks";
import { modalPageMessagesStrings } from "../modal-page.messages";

/**
 * ModalPage.TopBar — breadcrumb navigation row.
 *
 * Renders a back button (uses React Aria `slot="close"` to hook into dialog close)
 * followed by the current path label.
 *
 * @supportsStyleProps
 */
export const ModalPageTopBar = ({
  ref,
  previousPathLabel,
  currentPathLabel,
  ...props
}: ModalPageTopBarProps) => {
  const msg = useLocalizedStringFormatter(modalPageMessagesStrings);

  return (
    <ModalPageTopBarSlot ref={ref} {...props}>
      <IconButton
        slot="close"
        size="xs"
        variant="ghost"
        aria-label={msg.format("backButton", { previousPathLabel })}
        autoFocus
      >
        <ArrowBack />
      </IconButton>
      <Text color="neutral.11" textStyle="sm" aria-hidden="true">
        {previousPathLabel}
      </Text>
      {/* Separator is decorative — hidden from screen readers */}
      <Text color="neutral.11" textStyle="sm" aria-hidden="true">
        /
      </Text>
      <Text textStyle="sm" fontWeight="medium" aria-current="page">
        {currentPathLabel}
      </Text>
    </ModalPageTopBarSlot>
  );
};

ModalPageTopBar.displayName = "ModalPage.TopBar";
