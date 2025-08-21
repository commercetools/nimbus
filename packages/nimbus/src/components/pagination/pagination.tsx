import { PaginationRoot } from "./components/pagination.root";
import { PaginationList } from "./components/pagination.list";
import { PaginationItem } from "./components/pagination.item";
import { PaginationEllipsis } from "./components/pagination.ellipsis";
import { PaginationPrevTrigger } from "./components/pagination.prev-trigger";
import { PaginationNextTrigger } from "./components/pagination.next-trigger";

/**
 * Pagination
 * ============================================================
 * Navigation component that allows users to navigate through paginated data
 * with accessibility features and customizable styling.
 */
export const Pagination = {
  Root: PaginationRoot,
  List: PaginationList,
  Item: PaginationItem,
  Ellipsis: PaginationEllipsis,
  PrevTrigger: PaginationPrevTrigger,
  NextTrigger: PaginationNextTrigger,
};

export {
  PaginationRoot as _PaginationRoot,
  PaginationList as _PaginationList,
  PaginationItem as _PaginationItem,
  PaginationEllipsis as _PaginationEllipsis,
  PaginationPrevTrigger as _PaginationPrevTrigger,
  PaginationNextTrigger as _PaginationNextTrigger,
};
