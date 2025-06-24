import { createContext, useContext } from "react";

export const LocaleContext = createContext<string>("en-US");

export const useLocale = () => useContext(LocaleContext);
