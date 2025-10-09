export type PaginationProps = {
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
};
