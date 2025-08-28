import { useState, useCallback, useMemo } from "react";

export interface PaginationState {
  /** Total number of items across all pages */
  totalItems: number;
  /** Current active page (1-based) */
  currentPage: number;
  /** Number of items displayed per page */
  pageSize: number;
  /** Total number of pages available */
  totalPages: number;
  /** Index of the first item on current page (1-based) */
  startItem: number;
  /** Index of the last item on current page (1-based) */
  endItem: number;
  /** Whether there is a previous page available */
  hasPreviousPage: boolean;
  /** Whether there is a next page available */
  hasNextPage: boolean;
}

export interface UsePaginationProps {
  /** Total number of items to paginate */
  totalItems: number;
  /** Initial current page (1-based), defaults to 1 */
  currentPage?: number;
  /** Initial number of items per page, defaults to 10 */
  pageSize?: number;
  /** Callback fired when the current page changes */
  onPageChange?: (page: number) => void;
  /** Callback fired when the page size changes */
  onPageSizeChange?: (pageSize: number) => void;
}

export interface UsePaginationReturn extends PaginationState {
  /** Navigate to a specific page number (1-based) */
  goToPage: (page: number) => void;
  /** Navigate to the previous page, if available */
  goToPreviousPage: () => void;
  /** Navigate to the next page, if available */
  goToNextPage: () => void;
  /** Change the number of items displayed per page */
  setPageSize: (pageSize: number) => void;
}

/**
 * # usePagination
 *
 * Custom hook that provides pagination state management and navigation controls.
 *
 * Supports both controlled and uncontrolled modes:
 * - Controlled: Parent component manages currentPage state via props and callbacks
 * - Uncontrolled: Hook manages internal currentPage state automatically
 *
 * @param props - Configuration object for pagination behavior
 * @param props.totalItems - Total number of items to paginate
 * @param props.currentPage - Current page number (controlled mode). If undefined, uses uncontrolled mode
 * @param props.pageSize - Number of items per page (defaults to 20)
 * @param props.onPageChange - Callback fired when page changes
 * @param props.onPageSizeChange - Callback fired when page size changes
 *
 * @returns Object containing pagination state and navigation functions:
 * - totalItems: Total number of items
 * - currentPage: Current active page number (1-based)
 * - pageSize: Number of items per page
 * - totalPages: Total number of pages
 * - startItem: First item number on current page
 * - endItem: Last item number on current page
 * - hasPreviousPage: Whether previous page exists
 * - hasNextPage: Whether next page exists
 * - goToPage: Function to navigate to specific page
 * - goToPreviousPage: Function to navigate to previous page
 * - goToNextPage: Function to navigate to next page
 * - setPageSize: Function to change page size
 *
 */
export function usePagination({
  totalItems,
  currentPage: controlledCurrentPage,
  pageSize: controlledPageSize = 20,
  onPageChange,
  onPageSizeChange,
}: UsePaginationProps): UsePaginationReturn {
  // Internal state for uncontrolled mode
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(controlledPageSize);

  // Determine if controlled or uncontrolled
  const isControlled = controlledCurrentPage !== undefined;
  const currentPage = isControlled
    ? controlledCurrentPage
    : internalCurrentPage;
  const pageSize = controlledPageSize ?? internalPageSize;

  // Calculate pagination values
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Ensure currentPage is within valid bounds
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));

  const startItem = Math.min((validCurrentPage - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(validCurrentPage * pageSize, totalItems);

  const hasPreviousPage = validCurrentPage > 1;
  const hasNextPage = validCurrentPage < totalPages;

  // Page navigation functions
  const goToPage = useCallback(
    (page: number) => {
      const newPage = Math.max(1, Math.min(page, totalPages));

      if (!isControlled) {
        setInternalCurrentPage(newPage);
      }

      onPageChange?.(newPage);
    },
    [totalPages, isControlled, onPageChange]
  );

  const goToPreviousPage = useCallback(() => {
    if (hasPreviousPage) {
      goToPage(validCurrentPage - 1);
    }
  }, [hasPreviousPage, validCurrentPage, goToPage]);

  const goToNextPage = useCallback(() => {
    if (hasNextPage) {
      goToPage(validCurrentPage + 1);
    }
  }, [hasNextPage, validCurrentPage, goToPage]);

  const setPageSize = useCallback(
    (newPageSize: number) => {
      const newTotalPages = Math.ceil(totalItems / newPageSize);
      const newPage = Math.min(validCurrentPage, newTotalPages);

      setInternalPageSize(newPageSize);

      if (!isControlled && newPage !== validCurrentPage) {
        setInternalCurrentPage(newPage);
      }

      onPageSizeChange?.(newPageSize);

      if (newPage !== validCurrentPage) {
        onPageChange?.(newPage);
      }
    },
    [totalItems, validCurrentPage, isControlled, onPageChange, onPageSizeChange]
  );

  return useMemo(
    () => ({
      totalItems,
      currentPage: validCurrentPage,
      pageSize,
      totalPages,
      startItem,
      endItem,
      hasPreviousPage,
      hasNextPage,
      goToPage,
      goToPreviousPage,
      goToNextPage,
      setPageSize,
    }),
    [
      totalItems,
      validCurrentPage,
      pageSize,
      totalPages,
      startItem,
      endItem,
      hasPreviousPage,
      hasNextPage,
      goToPage,
      goToPreviousPage,
      goToNextPage,
      setPageSize,
    ]
  );
}
