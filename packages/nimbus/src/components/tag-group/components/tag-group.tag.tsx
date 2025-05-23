import { Close as CloseIcon } from "@commercetools/nimbus-icons";
import { TagGroupTagSlot } from "../tag-group.slots";

import type { TagGroupTagComponent } from "../tag-group.types";
import { IconButton } from "@/components";

export const TagGroupTag: TagGroupTagComponent = ({
  children,
  ref,
  ...rest
}) => {
  const textValue = typeof children === "string" ? children : undefined;
  return (
    <TagGroupTagSlot ref={ref} textValue={textValue} {...rest}>
      {({ allowsRemoving, isSelected, selectionMode }) => (
        <>
          {children}
          {allowsRemoving &&
            selectionMode !== "multiple" &&
            selectionMode !== "single" && (
              // @ts-expect-error aria props are handled by ButtonContext internally in IconButton
              <IconButton
                size="2xs"
                variant={isSelected ? "solid" : "ghost"}
                slot="remove"
                tone={isSelected ? undefined : "neutral"}
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
