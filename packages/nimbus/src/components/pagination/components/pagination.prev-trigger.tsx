import React from "react";
import { ChevronLeft } from "@commercetools/nimbus-icons";
import { withContext } from "../pagination.slots";
import { usePaginationContext } from "./pagination.root";
import type {
  PaginationPrevTriggerProps,
  PaginationPrevTriggerComponent,
} from "../pagination.types";

const TriggerBase = withContext<"li", PaginationPrevTriggerProps>("li", "item");

const ButtonElement = withContext<"button", Record<string, unknown>>(
  "button",
  "trigger"
);

export const PaginationPrevTrigger: PaginationPrevTriggerComponent =
  React.forwardRef<HTMLButtonElement, PaginationPrevTriggerProps>(
    (
      {
        isDisabled,
        onPageChange,
        "aria-label": ariaLabel = "Previous page",
        children,
        ...rest
      },
      ref
    ) => {
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
        <TriggerBase>
          <ButtonElement
            ref={ref}
            type="button"
            disabled={disabled}
            aria-label={ariaLabel}
            onClick={handleClick}
            {...rest}
          >
            {children ?? <ChevronLeft />}
          </ButtonElement>
        </TriggerBase>
      );
    }
  );
