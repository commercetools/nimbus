import { PaginationListSlot } from "../pagination.slots";
import type {
  PaginationListProps,
  PaginationListComponent,
} from "../pagination.types";

export const PaginationList: PaginationListComponent = ({
  children,
  ref,
  ...rest
}: PaginationListProps) => {
  return (
    <PaginationListSlot ref={ref} {...rest}>
      {children}
    </PaginationListSlot>
  );
};
