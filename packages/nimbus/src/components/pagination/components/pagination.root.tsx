import React, { createContext, useContext } from "react";
import { withProvider } from "../pagination.slots";
import type {
  PaginationProps,
  PaginationRootComponent,
} from "../pagination.types";

interface PaginationContextValue {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount: number;
  showFirstLast: boolean;
}

const PaginationContext = createContext<PaginationContextValue | null>(null);

export const usePaginationContext = () => {
  const context = useContext(PaginationContext);
  if (!context) {
    throw new Error(
      "Pagination components must be used within Pagination.Root"
    );
  }
  return context;
};

const NavRoot = withProvider<"nav", PaginationProps>("nav", "root");

export const PaginationRoot: PaginationRootComponent = React.forwardRef<
  HTMLElement,
  PaginationProps
>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      siblingCount = 1,
      showFirstLast = true,
      "aria-label": ariaLabel = "Pagination navigation",
      children,
      ...rest
    },
    ref
  ) => {
    const contextValue: PaginationContextValue = {
      currentPage,
      totalPages,
      onPageChange,
      siblingCount,
      showFirstLast,
    };

    // Enhanced aria-label with context
    const enhancedAriaLabel = `${ariaLabel}, page ${currentPage} of ${totalPages}`;
    const descriptionId = `${ariaLabel.replace(/\s+/g, "-").toLowerCase()}-description`;

    return (
      <PaginationContext.Provider value={contextValue}>
        <NavRoot
          ref={ref as React.Ref<HTMLElement>}
          aria-label={enhancedAriaLabel}
          aria-describedby={descriptionId}
          role="navigation"
          {...rest}
        >
          {children}
          <span
            id={descriptionId}
            style={{
              position: "absolute",
              width: "1px",
              height: "1px",
              padding: 0,
              margin: "-1px",
              overflow: "hidden",
              clip: "rect(0, 0, 0, 0)",
              whiteSpace: "nowrap",
              border: 0,
            }}
          >
            Use arrow keys to navigate between pages, or press Enter to select a
            page
          </span>
        </NavRoot>
      </PaginationContext.Provider>
    );
  }
);
