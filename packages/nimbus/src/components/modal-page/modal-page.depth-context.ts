import { createContext, useContext } from "react";

/**
 * Tracks the nesting depth of ModalPage components.
 * Each ModalPage.Root increments the depth by 1, so stacked modals
 * can progressively inset to show visual depth.
 */
const ModalPageDepthContext = createContext(0);

export const useModalPageDepth = () => useContext(ModalPageDepthContext);
export const ModalPageDepthProvider = ModalPageDepthContext.Provider;
