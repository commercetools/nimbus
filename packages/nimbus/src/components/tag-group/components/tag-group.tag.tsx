import { forwardRef, useRef } from "react";
import { Close as CloseIcon } from "@commercetools/nimbus-icons";
import { TagGroupTagSlot } from "../tag-group.slots";
import { ButtonContext, useContextProps, Button } from "react-aria-components";

import type { TagGroupTagComponent } from "../tag-group.types";
import { IconButton } from "@/components";

export const TagGroupTag: TagGroupTagComponent = forwardRef(
  ({ children, ...rest }, ref) => {
    const textValue = typeof children === "string" ? children : undefined;
    return (
      <TagGroupTagSlot ref={ref} textValue={textValue} {...rest}>
        {({ allowsRemoving }) => (
          <>
            {children}
            {allowsRemoving && (
              <IconButton size="2xs" variant="ghost" slot="remove">
                <CloseIcon />
              </IconButton>
            )}
          </>
        )}
      </TagGroupTagSlot>
    );
  }
);

TagGroupTag.displayName = "TagGroup.Tag";
