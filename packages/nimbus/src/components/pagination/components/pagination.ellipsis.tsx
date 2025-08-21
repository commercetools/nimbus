import React from "react";
import { withContext } from "../pagination.slots";
import type {
  PaginationEllipsisProps,
  PaginationEllipsisComponent,
} from "../pagination.types";

const ListItemBase = withContext<"li", PaginationEllipsisProps>("li", "item");

const EllipsisBase = withContext<"span", Record<string, unknown>>(
  "span",
  "ellipsis"
);

export const PaginationEllipsis: PaginationEllipsisComponent = React.forwardRef<
  HTMLSpanElement,
  PaginationEllipsisProps
>(({ children = "…", direction = "end", ...rest }, ref) => {
  const contextualLabel =
    direction === "start"
      ? "More pages before current page"
      : "More pages after current page";

  return (
    <ListItemBase role="listitem">
      <EllipsisBase
        ref={ref}
        aria-label={contextualLabel}
        role="separator"
        aria-orientation="horizontal"
        {...rest}
      >
        {children}
      </EllipsisBase>
    </ListItemBase>
  );
});
