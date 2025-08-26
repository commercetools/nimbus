import { useState, useCallback, useMemo } from "react";
import type {
  UsePaginationProps,
  UsePaginationReturn,
} from "../pagination.types";

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
