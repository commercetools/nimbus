import type {
  HTMLChakraProps,
  SlotRecipeProps,
} from "@chakra-ui/react/styled-system";
import type { ReactNode, Ref } from "react";
import type {
  ListBoxProps as RaListBoxProps,
  ListBoxItemProps as RaListBoxItemProps,
  ListBoxSectionProps as RaListBoxSectionProps,
} from "react-aria-components";
import type { OmitInternalProps } from "@/type-utils";

// ============================================================
// RECIPE PROPS
// ============================================================

type ListBoxRecipeProps = {
  /**
   * Size of the list box, affecting row height, font size and spacing.
   * @default "md"
   */
  size?: SlotRecipeProps<"nimbusListBox">["size"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type ListBoxRootSlotProps = HTMLChakraProps<"div", ListBoxRecipeProps>;

export type ListBoxItemSlotProps = HTMLChakraProps<"div">;

export type ListBoxSectionSlotProps = HTMLChakraProps<"div">;

export type ListBoxSectionHeaderSlotProps = HTMLChakraProps<"header">;

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the `ListBox.Root` component.
 *
 * Wraps React Aria's `ListBox`, providing keyboard navigation, single and
 * multiple selection, type-ahead, and opt-in drag-and-drop. Supports both
 * static composition (nested `ListBox.Item` children) and dynamic collections
 * (`items` plus a render function).
 *
 * @template T - The item object type when using dynamic collections.
 */
export type ListBoxRootProps<T extends object = object> = Omit<
  RaListBoxProps<T>,
  "className" | "style"
> &
  OmitInternalProps<ListBoxRootSlotProps, "children" | "slot"> & {
    /**
     * The list box's contents — either nested `ListBox.Item` /
     * `ListBox.Section` elements (static) or a render function when using the
     * `items` prop (dynamic).
     */
    children?: RaListBoxProps<T>["children"];
    /**
     * Ref to the root list box element.
     */
    ref?: Ref<HTMLDivElement>;
  };

/**
 * Props for the `ListBox.Item` component.
 *
 * Represents a single option in the list box. Participates in keyboard
 * navigation, selection, and type-ahead. May render arbitrary content via
 * `children`.
 */
export type ListBoxItemProps = Omit<RaListBoxItemProps, "className" | "style"> &
  OmitInternalProps<ListBoxItemSlotProps, "children" | "slot" | "id"> & {
    /**
     * The content of the item — typically a plain text label, but can include
     * icons or other inline elements.
     */
    children?: ReactNode;
    /**
     * Ref to the list box item element.
     */
    ref?: Ref<HTMLDivElement>;
  };

/**
 * Props for the `ListBox.Section` component.
 *
 * Groups related `ListBox.Item` elements under a labelled heading. Supports
 * both static children and dynamic collections via the `items` prop.
 *
 * @template T - The item object type when using dynamic collections.
 */
export type ListBoxSectionProps<T extends object = object> = Omit<
  RaListBoxSectionProps<T>,
  "className" | "style"
> &
  OmitInternalProps<ListBoxSectionSlotProps, "children" | "slot"> & {
    /**
     * Visible label rendered in the section header above the grouped items.
     * When omitted the section is still accessible but has no visual heading.
     */
    title?: ReactNode;
    /**
     * The section's contents — nested `ListBox.Item` elements (static) or a
     * render function when using the `items` prop (dynamic).
     */
    children?: RaListBoxSectionProps<T>["children"];
    /**
     * Ref to the section container element.
     */
    ref?: Ref<HTMLDivElement>;
  };
