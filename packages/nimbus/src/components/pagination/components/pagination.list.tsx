import { withContext } from "../pagination.slots";
import type {
  PaginationListProps,
  PaginationListComponent,
} from "../pagination.types";

export const PaginationList: PaginationListComponent = withContext<
  "ol",
  PaginationListProps
>("ol", "list");
