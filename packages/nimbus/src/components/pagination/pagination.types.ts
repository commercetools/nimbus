import type { ReactNode } from "react";

export interface PaginationProps {
  /** Total number of items */
  totalItems: number;
  /** Current page (1-based) */
  currentPage?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Available page size options */
  pageSizeOptions?: number[];
  /** Callback when page changes */
  onPageChange?: (page: number) => void;
  /** Callback when page size changes */
  onPageSizeChange?: (pageSize: number) => void;
  /** Whether the pagination is disabled */
  isDisabled?: boolean;
  /** Custom aria-label for the navigation */
  "aria-label"?: string;
  /** Size variant for the pagination controls */
  size?: "sm" | "md";
  /** Children (render prop for custom content) */
  children?: ReactNode;
}

export interface PaginationState {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  startItem: number;
  endItem: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface UsePaginationProps {
  totalItems: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export interface UsePaginationReturn extends PaginationState {
  goToPage: (page: number) => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  setPageSize: (pageSize: number) => void;
}
