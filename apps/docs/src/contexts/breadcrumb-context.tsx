import { createContext, useContext, useRef, ReactNode } from "react";
import { BreadcrumbItem } from "@/components/navigation/breadcrumb/breadcrumb.types";

type BreadcrumbContextValue = {
  previousParts: BreadcrumbItem[];
  setPreviousParts: (parts: BreadcrumbItem[]) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const previousPartsRef = useRef<BreadcrumbItem[]>([]);

  const setPreviousParts = (parts: BreadcrumbItem[]) => {
    previousPartsRef.current = parts;
  };

  const value = {
    previousParts: previousPartsRef.current,
    setPreviousParts,
  };

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbContext() {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error(
      "useBreadcrumbContext must be used within BreadcrumbProvider"
    );
  }
  return context;
}
