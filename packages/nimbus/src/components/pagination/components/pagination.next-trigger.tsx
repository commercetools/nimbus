import { ChevronRight } from "@commercetools/nimbus-icons";
import { PaginationItemSlot, PaginationTriggerSlot } from "../pagination.slots";
import { usePaginationContext } from "./pagination.root";
import type {
  PaginationNextTriggerProps,
  PaginationNextTriggerComponent,
} from "../pagination.types";

export const PaginationNextTrigger: PaginationNextTriggerComponent = ({
  isDisabled,
  onPageChange,
  "aria-label": ariaLabel = "Next page",
  children,
  ref,
  ...rest
}: PaginationNextTriggerProps) => {
  const context = usePaginationContext();
  const {
    currentPage,
    totalPages,
    onPageChange: contextOnPageChange,
  } = context;

  const handlePageChange = onPageChange ?? contextOnPageChange;
  const disabled = isDisabled ?? currentPage >= totalPages;

  const handleClick = () => {
    if (!disabled) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <PaginationItemSlot page={0}>
      <PaginationTriggerSlot
        ref={ref}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        onClick={handleClick}
        {...rest}
      >
        {children ?? <ChevronRight />}
      </PaginationTriggerSlot>
    </PaginationItemSlot>
  );
};
