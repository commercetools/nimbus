import type {
  ListBoxRootSlotProps,
  ListBoxItemSlotProps,
  ListBoxSectionSlotProps,
  ListBoxSectionHeaderSlotProps,
} from "./list-box.slots";
import type { RecipeVariantProps } from "@chakra-ui/react";
import { listBoxSlotRecipe } from "./list-box.recipe";

/**
 * Combines the root slot props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from slots
 * and styling variants from the recipe.
 */
type ListBoxVariantProps = ListBoxRootSlotProps &
  RecipeVariantProps<typeof listBoxSlotRecipe>;

/**
 * Main props interface for the ListBox root component.
 * Extends ListBoxVariantProps to include both slot props and variant props,
 * while adding support for React children.
 */
export interface ListBoxRootProps extends ListBoxVariantProps {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * Props interface for the ListBox item component.
 * Extends the slot props with additional item-specific properties.
 */
export interface ListBoxItemProps extends ListBoxItemSlotProps {
  children?: React.ReactNode;
  value?: string;
  isDisabled?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * Props interface for the ListBox section component.
 * Used for grouping related items together.
 */
export interface ListBoxSectionProps extends ListBoxSectionSlotProps {
  children?: React.ReactNode;
  title?: string;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * Props interface for the ListBox item label component.
 */
export interface ListBoxItemLabelProps {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
}

/**
 * Props interface for the ListBox item description component.
 */
export interface ListBoxItemDescriptionProps {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
}

/**
 * Props interface for the ListBox section header component.
 */
export interface ListBoxSectionHeaderProps
  extends ListBoxSectionHeaderSlotProps {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}
