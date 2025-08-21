import { PaginationItemSlot, PaginationTriggerSlot } from "../pagination.slots";
import { usePaginationContext } from "./pagination.root";
import type {
  PaginationItemProps,
  PaginationItemComponent,
} from "../pagination.types";

export const PaginationItem: PaginationItemComponent = ({
  page,
  isActive,
  isDisabled,
  onPageChange,
  ref,
  ...rest
}: PaginationItemProps) => {
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
    <PaginationItemSlot ref={ref} page={page} {...rest}>
      <PaginationTriggerSlot
        type="button"
        tabIndex={isDisabled ? -1 : 0}
        aria-current={isCurrentPage ? "page" : undefined}
        aria-label={`Page ${page}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        data-disabled={isDisabled}
        disabled={isDisabled}
      >
        {page}
      </PaginationTriggerSlot>
    </PaginationItemSlot>
  );
};
