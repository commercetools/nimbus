import { ListBoxLoadMoreItem as RaListBoxLoadMoreItem } from "react-aria-components";
import { LoadingSpinner } from "@/components/loading-spinner/loading-spinner";
import { extractStyleProps } from "@/utils";
import { ListBoxLoaderSlot } from "../list-box.slots";
import type { ListBoxLoadMoreProps } from "../list-box.types";

/**
 * ListBox.LoadMore - An async load-more sentinel.
 *
 * Wraps React Aria's `ListBoxLoadMoreItem`. While `isLoading` is true it renders
 * a non-selectable, non-focusable loading spinner row at the end of the list.
 * Fills the "in-list loading" gap the existing lists don't cover (they only
 * show a trigger spinner).
 *
 * @supportsStyleProps
 */
export const ListBoxLoadMore = (props: ListBoxLoadMoreProps) => {
  const { children, ...restProps } = props;
  const [styleProps, functionalProps] = extractStyleProps(restProps);

  return (
    <ListBoxLoaderSlot asChild {...styleProps}>
      <RaListBoxLoadMoreItem {...functionalProps}>
        {children ?? <LoadingSpinner size="xs" />}
      </RaListBoxLoadMoreItem>
    </ListBoxLoaderSlot>
  );
};

ListBoxLoadMore.displayName = "ListBox.LoadMore";
