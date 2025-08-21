import React from "react";
import { withContext } from "../pagination.slots";
import { usePaginationContext } from "./pagination.root";
import type {
  PaginationItemProps,
  PaginationItemComponent,
} from "../pagination.types";

const ItemBase = withContext<"li", PaginationItemProps>("li", "item");
const ButtonElement = withContext<"button", Record<string, unknown>>(
  "button",
  "trigger"
);

export const PaginationItem: PaginationItemComponent = React.forwardRef<
  HTMLLIElement,
  PaginationItemProps
>(({ page, isActive, isDisabled, onPageChange, ...rest }, ref) => {
  const context = usePaginationContext();
  const { currentPage, onPageChange: contextOnPageChange } = context;

  const isCurrentPage = isActive ?? page === currentPage;
  const handlePageChange = onPageChange ?? contextOnPageChange;

  const handleClick = () => {
    if (!isDisabled && !isCurrentPage) {
      handlePageChange(page);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (
      (event.key === "Enter" || event.key === " ") &&
      !isDisabled &&
      !isCurrentPage
    ) {
      event.preventDefault();
      handlePageChange(page);
    }
  };

  return (
    <ItemBase ref={ref}>
      <ButtonElement
        type="button"
        tabIndex={isDisabled ? -1 : 0}
        aria-current={isCurrentPage ? "page" : undefined}
        aria-label={`Page ${page}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        data-disabled={isDisabled}
        disabled={isDisabled}
        {...rest}
      >
        {page}
      </ButtonElement>
    </ItemBase>
  );
});
