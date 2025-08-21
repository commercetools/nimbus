import {
  PaginationItemSlot,
  PaginationEllipsisSlot,
} from "../pagination.slots";
import type {
  PaginationEllipsisProps,
  PaginationEllipsisComponent,
} from "../pagination.types";

export const PaginationEllipsis: PaginationEllipsisComponent = ({
  children = "…",
  direction = "end",
  ref,
  ...rest
}: PaginationEllipsisProps) => {
  const contextualLabel =
    direction === "start"
      ? "More pages before current page"
      : "More pages after current page";

  return (
    <PaginationItemSlot role="listitem" page={0}>
      <PaginationEllipsisSlot
        ref={ref}
        aria-label={contextualLabel}
        role="separator"
        aria-orientation="horizontal"
        {...rest}
      >
        {children}
      </PaginationEllipsisSlot>
    </PaginationItemSlot>
  );
};
