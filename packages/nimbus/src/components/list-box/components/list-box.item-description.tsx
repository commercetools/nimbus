import { forwardRef } from "react";
import { ListBoxItemDescriptionSlot } from "../list-box.slots";
import type { ListBoxItemDescriptionProps } from "../list-box.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const ListBoxItemDescription = forwardRef<
  HTMLSpanElement,
  ListBoxItemDescriptionProps
>(({ children, ...props }, ref) => {
  const [styleProps, restProps] = extractStyleProps(props);

  return (
    <ListBoxItemDescriptionSlot ref={ref} {...styleProps} {...restProps}>
      {children}
    </ListBoxItemDescriptionSlot>
  );
});

ListBoxItemDescription.displayName = "ListBoxItemDescription";
