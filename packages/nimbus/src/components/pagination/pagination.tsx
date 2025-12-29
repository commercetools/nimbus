import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "@commercetools/nimbus-icons";
import {
  Flex,
  IconButton,
  NumberInput,
  Select,
  Stack,
  Text,
} from "@/components";
import { usePagination } from "./hooks/use-pagination";
import type { PaginationProps } from "./pagination.types";
import { paginationMessages } from "./pagination.messages";
import { useLocale } from "react-aria-components";

/**
 * # Pagination
 *
 * A component that allows users to navigate through pages and control page size.
 * Combines a page size selector and page navigator for comprehensive pagination control.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/pagination}
 */
export const Pagination = (props: PaginationProps) => {
  const { locale } = useLocale();
  const {
    totalItems,
    currentPage,
    pageSize,
    pageSizeOptions = [10, 20, 50, 100],
    onPageChange,
    onPageSizeChange,
    "aria-label": ariaLabel,
    enablePageInput = true,
    enablePageSizeSelector = true,
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
      {enablePageSizeSelector && (
        <Flex align="center" gap="200">
          <Select.Root
            isClearable={false}
            selectedKey={pagination.pageSize.toString()}
            onSelectionChange={handlePageSizeChange}
            aria-label={paginationMessages.getStringForLocale(
              "itemsPerPage",
              locale
            )}
          >
            <Select.Options>
              {pageSizeSelectOptions.map((option) => (
                <Select.Option key={option.id} id={option.id}>
                  {option.name}
                </Select.Option>
              ))}
            </Select.Options>
          </Select.Root>
          <Text color="neutral.12">
            {paginationMessages.getStringForLocale("itemsPerPageText", locale)}
          </Text>
        </Flex>
      )}
      <Flex flexGrow="1" />
      {/* Page Navigator */}
      <Flex
        align="center"
        gap="200"
        role="navigation"
        aria-label={
          ariaLabel ??
          paginationMessages.getStringForLocale("pagination", locale)
        }
      >
        <IconButton
          onClick={pagination.goToPreviousPage}
          isDisabled={!pagination.hasPreviousPage}
          variant="ghost"
          colorPalette="primary"
          aria-label={paginationMessages.getStringForLocale(
            "goToPreviousPage",
            locale
          )}
        >
          <ChevronLeft />
        </IconButton>

        <Flex align="center" gap="200">
          <Text color="neutral.12">
            {paginationMessages.getStringForLocale("page", locale)}
          </Text>
          {enablePageInput ? (
            <NumberInput
              value={pagination.currentPage}
              onChange={(value: number | undefined) =>
                pagination.goToPage(value || 1)
              }
              minValue={1}
              maxValue={pagination.totalPages}
              step={1}
              isDisabled={false}
              width="9ch"
              aria-label={paginationMessages.getStringForLocale(
                "currentPage",
                locale
              )}
              aria-current="page"
            />
          ) : (
            <Text fontWeight="semibold" color="neutral.12" aria-current="page">
              {pagination.currentPage}
            </Text>
          )}
          <Text color="neutral.12">
            {(() => {
              const ofTotalPagesMessage = paginationMessages.getStringForLocale(
                "ofTotalPages",
                locale
              ) as string | ((args: Record<string, string | number>) => string);
              return typeof ofTotalPagesMessage === "function"
                ? ofTotalPagesMessage({ totalPages: pagination.totalPages })
                : ofTotalPagesMessage;
            })()}
          </Text>
        </Flex>

        <IconButton
          onClick={pagination.goToNextPage}
          isDisabled={!pagination.hasNextPage}
          variant="ghost"
          colorPalette="primary"
          aria-label={paginationMessages.getStringForLocale(
            "goToNextPage",
            locale
          )}
        >
          <ChevronRight />
        </IconButton>
      </Flex>
    </Stack>
  );
};

// Manually assign a displayName for debugging purposes
Pagination.displayName = "Pagination";
