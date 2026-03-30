import {
  createContext,
  useContext,
  type RefObject,
  type ReactNode,
} from "react";

interface ScrollContainerContextValue {
  mainViewportRef: RefObject<HTMLElement | null>;
  sidebarViewportRef: RefObject<HTMLElement | null>;
}

const ScrollContainerContext =
  createContext<ScrollContainerContextValue | null>(null);

export function ScrollContainerProvider({
  children,
  mainViewportRef,
  sidebarViewportRef,
}: {
  children: ReactNode;
  mainViewportRef: RefObject<HTMLElement | null>;
  sidebarViewportRef?: RefObject<HTMLElement | null>;
}) {
  const fallbackRef = { current: null };
  return (
    <ScrollContainerContext.Provider
      value={{
        mainViewportRef,
        sidebarViewportRef: sidebarViewportRef ?? fallbackRef,
      }}
    >
      {children}
    </ScrollContainerContext.Provider>
  );
}

export function useMainViewport(): RefObject<HTMLElement | null> {
  const ctx = useContext(ScrollContainerContext);
  if (!ctx) {
    throw new Error(
      "useMainViewport must be used within ScrollContainerProvider"
    );
  }
  return ctx.mainViewportRef;
}

export function useSidebarViewport(): RefObject<HTMLElement | null> {
  const ctx = useContext(ScrollContainerContext);
  if (!ctx) {
    throw new Error(
      "useSidebarViewport must be used within ScrollContainerProvider"
    );
  }
  return ctx.sidebarViewportRef;
}
