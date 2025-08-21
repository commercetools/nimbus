import React from "react";
import { ChevronRight } from "@commercetools/nimbus-icons";
import { withContext } from "../pagination.slots";
import { usePaginationContext } from "./pagination.root";
import type {
  PaginationNextTriggerProps,
  PaginationNextTriggerComponent,
} from "../pagination.types";

const TriggerBase = withContext<"li", PaginationNextTriggerProps>("li", "item");

const ButtonElement = withContext<"button", Record<string, unknown>>(
  "button",
  "trigger"
);

export const PaginationNextTrigger: PaginationNextTriggerComponent =
  React.forwardRef<HTMLButtonElement, PaginationNextTriggerProps>(
    (
      {
        isDisabled,
        onPageChange,
        "aria-label": ariaLabel = "Next page",
        children,
        ...rest
      },
      ref
    ) => {
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
        <TriggerBase>
          <ButtonElement
            ref={ref}
            type="button"
            disabled={disabled}
            aria-label={ariaLabel}
            onClick={handleClick}
            {...rest}
          >
            {children ?? <ChevronRight />}
          </ButtonElement>
        </TriggerBase>
      );
    }
  );
