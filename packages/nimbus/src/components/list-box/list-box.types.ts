import type { ReactNode } from "react";
import type {
  ListBoxProps as RaListBoxProps,
  ListBoxItemProps as RaListBoxItemProps,
  ListBoxSectionProps as RaListBoxSectionProps,
  ListBoxLoadMoreItemProps as RaListBoxLoadMoreItemProps,
} from "react-aria-components";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
} from "@chakra-ui/react/styled-system";
import type { OmitInternalProps } from "../../type-utils/omit-props";

// ============================================================
// RECIPE PROPS
// ============================================================

type ListBoxRecipeProps = {
  /**
   * Size of the list options, matching the shared Nimbus size scale.
   * @default "md"
   */
  size?: SlotRecipeProps<"nimbusListBox">["size"];
  /**
   * Container treatment. `card` renders a bordered, elevated, scrollable
   * surface for standalone use; `plain` renders a bare list with no surface,
   * for embedding inside an already-carded overlay.
   * @default "card"
   */
  variant?: SlotRecipeProps<"nimbusListBox">["variant"];
  /**
   * Row density. `compact` reduces vertical padding for data-dense lists.
   * @default "comfortable"
   */
  density?: SlotRecipeProps<"nimbusListBox">["density"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type ListBoxRootSlotProps = HTMLChakraProps<
  "div",
  ListBoxRecipeProps & RaListBoxProps<object>
>;
export type ListBoxItemSlotProps = HTMLChakraProps<"div">;
export type ListBoxItemIndicatorSlotProps = HTMLChakraProps<"div">;
export type ListBoxItemLeadingSlotProps = HTMLChakraProps<"div">;
export type ListBoxItemContentSlotProps = HTMLChakraProps<"div">;
export type ListBoxItemTrailingSlotProps = HTMLChakraProps<"div">;
export type ListBoxSectionSlotProps = HTMLChakraProps<"div">;
export type ListBoxSectionHeaderSlotProps = HTMLChakraProps<"div">;
export type ListBoxEmptyStateSlotProps = HTMLChakraProps<"div">;
export type ListBoxLoaderSlotProps = HTMLChakraProps<"div">;

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for `ListBox.Root` — the collection container. Extends React Aria's
 * `ListBoxProps` (selection, sections, `dragAndDropHooks`, `renderEmptyState`,
 * async loading, keyboard behaviour) with Nimbus recipe variants and style props.
 */
export type ListBoxRootProps<T extends object = object> = RaListBoxProps<T> &
  OmitInternalProps<ListBoxRootSlotProps, keyof RaListBoxProps<T>> & {
    /**
     * Ref forwarding to the listbox element.
     */
    ref?: React.Ref<HTMLDivElement>;
  };

/**
 * Props for `ListBox.Item` — a single selectable option. Extends React Aria's
 * `ListBoxItemProps` with optional leading media and trailing content slots.
 */
export type ListBoxItemProps<T extends object = object> = Omit<
  RaListBoxItemProps<T>,
  | "onClick"
  | "translate"
  | "onBlur"
  | "onFocus"
  | "onKeyDown"
  | "onKeyUp"
  | "onMouseDown"
  | "onMouseUp"
> &
  OmitInternalProps<ListBoxItemSlotProps, keyof RaListBoxItemProps<T>> & {
    /**
     * Optional leading media (icon or avatar) rendered before the label.
     */
    leading?: ReactNode;
    /**
     * Optional trailing content (metadata, badge, action) rendered after the
     * label, aligned to the end of the row.
     */
    trailing?: ReactNode;
    /**
     * Ref forwarding to the option element.
     */
    ref?: React.Ref<HTMLDivElement>;
  };

/**
 * Props for `ListBox.Section` — a labelled group of options.
 */
export type ListBoxSectionProps<T extends object = object> =
  RaListBoxSectionProps<T> &
    OmitInternalProps<
      ListBoxSectionSlotProps,
      keyof RaListBoxSectionProps<T>
    > & {
      /**
       * Header text shown above the group.
       */
      label: string;
      /**
       * Ref forwarding to the section element.
       */
      ref?: React.Ref<HTMLDivElement>;
    };

/**
 * Props for `ListBox.LoadMore` — an async load-more sentinel that renders a
 * loading spinner while `isLoading` is true. Wraps React Aria's
 * `ListBoxLoadMoreItem`.
 */
export type ListBoxLoadMoreProps = RaListBoxLoadMoreItemProps &
  OmitInternalProps<ListBoxLoaderSlotProps, keyof RaListBoxLoadMoreItemProps>;
