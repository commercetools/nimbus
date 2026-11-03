import { createContext, useContext } from "react";
import type { HeaderForm } from "./utils/get-next-header-form";

export type DefaultPageContextValue = {
  form: HeaderForm;
  registerHeader: (node: HTMLElement | null) => void;
  registerContent: (node: HTMLElement | null) => void;
};

const defaultContext: DefaultPageContextValue = {
  form: "full",
  registerHeader: () => {},
  registerContent: () => {},
};

export const DefaultPageContext =
  createContext<DefaultPageContextValue>(defaultContext);

export const useDefaultPageContext = () => useContext(DefaultPageContext);
