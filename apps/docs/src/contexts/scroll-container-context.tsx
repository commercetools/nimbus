import {
  createContext,
  useContext,
  useMemo,
  type RefObject,
  type ReactNode,
} from "react";

interface ScrollContainerContextValue {
  mainViewportRef: RefObject<HTMLElement | null>;
  sidebarViewportRef: RefObject<HTMLElement | null>;
}

const ScrollContainerContext =
  createContext<ScrollContainerContextValue | null>(null);

const fallbackRef: RefObject<HTMLElement | null> = { current: null };

export function ScrollContainerProvider({
  children,
  mainViewportRef,
  sidebarViewportRef,
}: {
  children: ReactNode;
  mainViewportRef: RefObject<HTMLElement | null>;
  sidebarViewportRef?: RefObject<HTMLElement | null>;
}) {
  const value = useMemo(
    () => ({
      mainViewportRef,
      sidebarViewportRef: sidebarViewportRef ?? fallbackRef,
    }),
    [mainViewportRef, sidebarViewportRef]
  );

  return (
    <ScrollContainerContext.Provider value={value}>
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
    console.warn(
      "useSidebarViewport called outside ScrollContainerProvider — returning fallback ref"
    );
    return fallbackRef;
  }
  return ctx.sidebarViewportRef;
}
