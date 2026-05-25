import { useContext } from "react";
import { SplitterContext } from "../components/splitter.context";

export const useSplitterContext = () => {
  const context = useContext(SplitterContext);
  if (!context) {
    throw new Error("useSplitterContext must be used within a Splitter.Root");
  }
  return context;
};
