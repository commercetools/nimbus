import { ChevronLeft } from "@commercetools/nimbus-icons";
import { PaginationItemSlot, PaginationTriggerSlot } from "../pagination.slots";
import { usePaginationContext } from "./pagination.root";
import type {
  PaginationPrevTriggerProps,
  PaginationPrevTriggerComponent,
} from "../pagination.types";

export const PaginationPrevTrigger: PaginationPrevTriggerComponent = ({
  isDisabled,
  onPageChange,
  "aria-label": ariaLabel = "Previous page",
  children,
  ref,
  ...rest
}: PaginationPrevTriggerProps) => {
  const context = usePaginationContext();
  const { currentPage, onPageChange: contextOnPageChange } = context;

  const handlePageChange = onPageChange ?? contextOnPageChange;
  const disabled = isDisabled ?? currentPage <= 1;

  const handleClick = () => {
    if (!disabled) {
      handlePageChange(currentPage - 1);
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
        {children ?? <ChevronLeft />}
      </PaginationTriggerSlot>
    </PaginationItemSlot>
  );
};
