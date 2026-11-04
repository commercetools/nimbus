import { createContext, useContext } from "react";
import type { HeaderForm } from "./utils/get-next-header-form";

export type DefaultPageContextValue = {
  form: HeaderForm;
  /** True after the hook has published the first header height. */
  isMeasured: boolean;
  registerHeader: (node: HTMLElement | null) => void;
  registerContent: (node: HTMLElement | null) => void;
};

const defaultContext: DefaultPageContextValue = {
  form: "full",
  isMeasured: false,
  registerHeader: () => {},
  registerContent: () => {},
};

export const DefaultPageContext =
  createContext<DefaultPageContextValue>(defaultContext);

export const useDefaultPageContext = () => useContext(DefaultPageContext);
