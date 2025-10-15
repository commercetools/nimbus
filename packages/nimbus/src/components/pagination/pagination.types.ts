export type PaginationProps = {
  /**
   * Total number of items across all pages
   */
  totalItems: number;
  /**
   * Current active page number (1-based indexing)
   * @default 1
   */
  currentPage?: number;
  /**
   * Number of items to display per page
   * @default 10
   */
  pageSize?: number;
  /**
   * Available page size options for user selection
   * @default [10, 20, 50, 100]
   */
  pageSizeOptions?: number[];
  /**
   * Callback fired when the page number changes
   */
  onPageChange?: (page: number) => void;
  /**
   * Callback fired when the page size changes
   */
  onPageSizeChange?: (pageSize: number) => void;
  /**
   * Custom aria-label for the pagination navigation
   * @default "Pagination navigation"
   */
  "aria-label"?: string;
  /**
   * Whether to show page number input for direct navigation
   * @default false
   */
  enablePageInput?: boolean;
  /**
   * Whether to show page size selector dropdown
   * @default false
   */
  enablePageSizeSelector?: boolean;
};
