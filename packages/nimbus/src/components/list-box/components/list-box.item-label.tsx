import { forwardRef } from "react";
import { ListBoxItemLabelSlot } from "../list-box.slots";
import type { ListBoxItemLabelProps } from "../list-box.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const ListBoxItemLabel = forwardRef<
  HTMLSpanElement,
  ListBoxItemLabelProps
>(({ children, ...props }, ref) => {
  const [styleProps, restProps] = extractStyleProps(props);

  return (
    <ListBoxItemLabelSlot ref={ref} {...styleProps} {...restProps}>
      {children}
    </ListBoxItemLabelSlot>
  );
});

ListBoxItemLabel.displayName = "ListBoxItemLabel";
