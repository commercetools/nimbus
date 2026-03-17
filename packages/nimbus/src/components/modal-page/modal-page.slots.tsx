import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "../../type-utils/slot-types";
import type {
  ModalPageRootSlotProps,
  ModalPageTopBarSlotProps,
  ModalPageHeaderSlotProps,
  ModalPageTitleSlotProps,
  ModalPageActionsSlotProps,
  ModalPageContentSlotProps,
  ModalPageFooterSlotProps,
} from "./modal-page.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusModalPage",
});

export const ModalPageRootSlot: SlotComponent<
  HTMLDivElement,
  ModalPageRootSlotProps
> = withProvider<HTMLDivElement, ModalPageRootSlotProps>("div", "root");

export const ModalPageTopBarSlot: SlotComponent<
  HTMLDivElement,
  ModalPageTopBarSlotProps
> = withContext<HTMLDivElement, ModalPageTopBarSlotProps>("div", "topBar");

export const ModalPageHeaderSlot: SlotComponent<
  HTMLElement,
  ModalPageHeaderSlotProps
> = withContext<HTMLElement, ModalPageHeaderSlotProps>("header", "header");

export const ModalPageTitleSlot: SlotComponent<
  HTMLDivElement,
  ModalPageTitleSlotProps
> = withContext<HTMLDivElement, ModalPageTitleSlotProps>("div", "title");

export const ModalPageActionsSlot: SlotComponent<
  HTMLDivElement,
  ModalPageActionsSlotProps
> = withContext<HTMLDivElement, ModalPageActionsSlotProps>("div", "actions");

export const ModalPageContentSlot: SlotComponent<
  HTMLDivElement,
  ModalPageContentSlotProps
> = withContext<HTMLDivElement, ModalPageContentSlotProps>("div", "content");

export const ModalPageFooterSlot: SlotComponent<
  HTMLElement,
  ModalPageFooterSlotProps
> = withContext<HTMLElement, ModalPageFooterSlotProps>("footer", "footer");
