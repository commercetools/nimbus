import type {
  HTMLChakraProps,
  SlotRecipeProps,
} from "@chakra-ui/react/styled-system";

export type ListRecipeProps = SlotRecipeProps<"nimbusList">;
export type ListRootSlotProps = HTMLChakraProps<"ul", ListRecipeProps>;
export type ListItemSlotProps = HTMLChakraProps<"li">;
export type ListIndicatorSlotProps = HTMLChakraProps<"div">;

export type ListRootProps = ListRootSlotProps & {
  ref?: React.Ref<HTMLUListElement>;
};
export type ListItemProps = ListItemSlotProps;
export type ListIndicatorProps = ListIndicatorSlotProps;
