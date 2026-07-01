import { createRecipeContext } from "@chakra-ui/react/styled-system";
import type { DropZoneRootSlotProps } from "./drop-zone.types";

const { withContext } = createRecipeContext({ key: "nimbusDropZone" });

// DropZone Root - rendered `asChild` onto React Aria's `DropZone` element so
// the recipe's styles apply directly to the RAC element (no intermediate
// wrapper), keeping the forwarded ref pointed at the real drop target.
export const DropZoneRootSlot = withContext<
  HTMLDivElement,
  DropZoneRootSlotProps
>("div");
