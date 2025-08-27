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
  /** Custom aria-label for the navigation */
  "aria-label"?: string;
  /** Enables the page number input for direct page navigation */
  enablePageInput?: boolean;
  /** Enables the page size selector dropdown */
  enablePageSizeSelector?: boolean;
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
