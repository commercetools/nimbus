import { useMemo } from "react";
import { Select } from "../select";
import { Text } from "../text";
import { IconButton } from "../icon-button";
import { NumberInput } from "../number-input";
import { Flex } from "../flex";
import { Stack } from "../stack";
import { ChevronLeft, ChevronRight } from "@commercetools/nimbus-icons";
import { usePagination } from "./utils/use-pagination";
import type { PaginationProps } from "./pagination.types";

/**
 * # Pagination
 *
 * A component that allows users to navigate through pages and control page size.
 * Combines a page size selector and page navigator for comprehensive pagination control.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/pagination}
 */
export const Pagination = (props: PaginationProps) => {
  const {
    totalItems,
    currentPage,
    pageSize,
    pageSizeOptions = [10, 20, 50, 100],
    onPageChange,
    onPageSizeChange,
    isDisabled = false,
    "aria-label": ariaLabel = "Pagination",
    size = "md",
  } = props;

  const pagination = usePagination({
    totalItems,
    currentPage,
    pageSize,
    onPageChange,
    onPageSizeChange,
  });

  // Prepare page size options for select
  const pageSizeSelectOptions = useMemo(
    () =>
      pageSizeOptions.map((size) => ({
        id: size.toString(),
        name: `${size}`,
      })),
    [pageSizeOptions]
  );

  const handlePageSizeChange = (key: React.Key | null) => {
    if (key) {
      const newPageSize = parseInt(key.toString(), 10);
      pagination.setPageSize(newPageSize);
    }
  };

  return (
    <Stack gap="400" direction={{ base: "column", sm: "row" }} align="center">
      {/* Page Size Selector */}
      <Flex align="center" gap="200">
        <Select.Root
          isClearable={false}
          selectedKey={pagination.pageSize.toString()}
          onSelectionChange={handlePageSizeChange}
          size={size}
          aria-label="Items per page"
        >
          <Select.Options>
            {pageSizeSelectOptions.map((option) => (
              <Select.Option key={option.id} id={option.id}>
                {option.name}
              </Select.Option>
            ))}
          </Select.Options>
        </Select.Root>
        <Text>items per page</Text>
      </Flex>
      <Flex flexGrow="1" />
      {/* Page Navigator */}
      <Flex align="center" gap="200" role="navigation" aria-label={ariaLabel}>
        <IconButton
          onClick={pagination.goToPreviousPage}
          isDisabled={isDisabled || !pagination.hasPreviousPage}
          size={size === "sm" ? "2xs" : "md"}
          variant="ghost"
          tone="primary"
          aria-label="Go to previous page"
        >
          <ChevronLeft />
        </IconButton>

        <Flex align="center" gap="100">
          <Text fontSize="sm" color="neutral.12">
            Page
          </Text>
          <NumberInput
            value={pagination.currentPage}
            onChange={(value) => pagination.goToPage(value)}
            minValue={1}
            maxValue={pagination.totalPages}
            isDisabled={isDisabled}
            width="10ch"
            aria-label="Current page"
          />
          <Text fontSize="sm" color="neutral.12">
            of {pagination.totalPages.toLocaleString()}
          </Text>
        </Flex>

        <IconButton
          onClick={pagination.goToNextPage}
          isDisabled={isDisabled || !pagination.hasNextPage}
          size={size === "sm" ? "2xs" : "md"}
          variant="ghost"
          tone="primary"
          aria-label="Go to next page"
        >
          <ChevronRight />
        </IconButton>
      </Flex>
    </Stack>
  );
};

// Manually assign a displayName for debugging purposes
Pagination.displayName = "Pagination";
