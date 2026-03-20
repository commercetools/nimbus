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

// <header> inside a <dialog> does NOT get the `banner` landmark role — it
// becomes a generic element. This is correct: no landmark pollution inside the
// dialog's sectioning context (ARIA spec §5.3.3).
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

// <footer> inside a <dialog> does NOT get the `contentinfo` landmark role —
// it becomes a generic element. This is correct: no landmark pollution inside
// the dialog's sectioning context (ARIA spec §5.3.3).
export const ModalPageFooterSlot: SlotComponent<
  HTMLElement,
  ModalPageFooterSlotProps
> = withContext<HTMLElement, ModalPageFooterSlotProps>("footer", "footer");
