import { Close as CloseIcon } from "@commercetools/nimbus-icons";
import { TagGroupTagSlot } from "../tag-group.slots";
import { useLocalizedStringFormatter } from "@/hooks";
import { tagGroupMessagesStrings } from "../tag-group.messages";

import type { TagGroupTagComponent } from "../tag-group.types";
import { IconButton } from "@/components";

/**
 * TagGroup.Tag - Individual tag component that can be selected, removed, or used for display
 *
 * @supportsStyleProps
 */
export const TagGroupTag: TagGroupTagComponent = ({
  children,
  ref,
  ...rest
}) => {
  const msg = useLocalizedStringFormatter(tagGroupMessagesStrings);
  const textValue = typeof children === "string" ? children : undefined;
  return (
    <TagGroupTagSlot ref={ref} textValue={textValue} {...rest}>
      {({ allowsRemoving, isSelected, selectionMode }) => (
        <>
          {children}
          {allowsRemoving &&
            selectionMode !== "multiple" &&
            selectionMode !== "single" && (
              <IconButton
                size="2xs"
                variant={isSelected ? "solid" : "ghost"}
                slot="remove"
                colorPalette={isSelected ? undefined : "neutral"}
                aria-label={msg.format("removeTag")}
              >
                <CloseIcon />
              </IconButton>
            )}
        </>
      )}
    </TagGroupTagSlot>
  );
};

TagGroupTag.displayName = "TagGroup.Tag";
