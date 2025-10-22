import { defineMessages } from "react-intl";

export const messages = defineMessages({
  pagination: {
    id: "Nimbus.Pagination.pagination",
    description: "aria-label for the pagination navigation element",
    defaultMessage: "Pagination",
  },
  itemsPerPage: {
    id: "Nimbus.Pagination.itemsPerPage",
    description: "aria-label for the items per page selector",
    defaultMessage: "Items per page",
  },
  itemsPerPageText: {
    id: "Nimbus.Pagination.itemsPerPageText",
    description: "text label displayed next to the page size selector",
    defaultMessage: "items per page",
  },
  goToPreviousPage: {
    id: "Nimbus.Pagination.goToPreviousPage",
    description: "aria-label for the previous page button",
    defaultMessage: "Go to previous page",
  },
  currentPage: {
    id: "Nimbus.Pagination.currentPage",
    description: "aria-label for the current page input field",
    defaultMessage: "Current page",
  },
  page: {
    id: "Nimbus.Pagination.page",
    description: "text label displayed before the page number",
    defaultMessage: "Page",
  },
  ofTotalPages: {
    id: "Nimbus.Pagination.ofTotalPages",
    description: "text showing total pages count after current page input",
    defaultMessage: "of {totalPages}",
  },
  goToNextPage: {
    id: "Nimbus.Pagination.goToNextPage",
    description: "aria-label for the next page button",
    defaultMessage: "Go to next page",
  },
});
