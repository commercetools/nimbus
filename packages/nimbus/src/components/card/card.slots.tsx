import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "../../type-utils/slot-types";
import type {
  CardContentSlotProps,
  CardHeaderSlotProps,
  CardRootSlotProps,
} from "./card.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusCard",
});

/**
 * Root component that provides the styling context for the Card component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const CardRoot: SlotComponent<HTMLDivElement, CardRootSlotProps> =
  withProvider<HTMLDivElement, CardRootSlotProps>("div", "root");

export const CardHeader: SlotComponent<HTMLDivElement, CardHeaderSlotProps> =
  withContext<HTMLDivElement, CardHeaderSlotProps>("div", "header");

export const CardContent: SlotComponent<HTMLDivElement, CardContentSlotProps> =
  withContext<HTMLDivElement, CardContentSlotProps>("div", "content");
