import { useContext } from "react";
import { WindowSplitterContext } from "../components/window-splitter.context";

export const useWindowSplitterContext = () => {
  const context = useContext(WindowSplitterContext);
  if (!context) {
    throw new Error(
      "useWindowSplitterContext must be used within a WindowSplitter.Root"
    );
  }
  return context;
};
