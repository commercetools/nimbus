import React, { createContext } from "react";
import type { DisclosureGroupState } from "react-stately";

// Define types for the item context
export interface ItemContextType {
  isExpanded: boolean;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  panelRef: React.RefObject<HTMLDivElement | null>;
  buttonProps: React.ButtonHTMLAttributes<HTMLButtonElement>;
  panelProps: React.ButtonHTMLAttributes<HTMLButtonElement>;
  isFocusVisible: boolean;
}

// Create and export the contexts
export const ItemContext = createContext<ItemContextType | null>(null);
export const DisclosureGroupStateContext =
  createContext<DisclosureGroupState | null>(null);
