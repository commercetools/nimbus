import {
  createSlotRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "@/type-utils";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusList",
});

export type ListRootSlotProps = HTMLChakraProps<"ul">;
export const ListRootSlot: SlotComponent<HTMLUListElement, ListRootSlotProps> =
  withProvider<HTMLUListElement, ListRootSlotProps>("ul", "root");

export type ListItemSlotProps = HTMLChakraProps<"li">;
export const ListItemSlot: SlotComponent<HTMLLIElement, ListItemSlotProps> =
  withContext<HTMLLIElement, ListItemSlotProps>("li", "item");

export type ListIndicatorSlotProps = HTMLChakraProps<"div">;
export const ListIndicatorSlot: SlotComponent<
  HTMLDivElement,
  ListIndicatorSlotProps
> = withContext<HTMLDivElement, ListIndicatorSlotProps>("div", "indicator");
