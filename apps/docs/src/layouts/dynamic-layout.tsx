/**
 * Dynamic Layout Component
 *
 * Renders the appropriate layout based on the current document's layout property.
 * Falls back to the default AppLayout if no layout is specified or document not found.
 */

import { Suspense } from "react";
import { LoadingSpinner } from "@commercetools/nimbus";
import { AppLayout } from "./app-layout";
import { NoSidebarLayout } from "./no-sidebar-layout";
import { useActiveDoc } from "@/hooks/useActiveDoc";

export function DynamicLayout() {
  const { doc: activeDoc } = useActiveDoc();

  // Show loading state while document is being fetched
  if (!activeDoc) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <AppLayout />
      </Suspense>
    );
  }

  // Get layout from document metadata, default to 'app-frame'
  const layout = activeDoc.meta.layout || "app-frame";

  // Render the appropriate layout based on the document's layout property
  switch (layout) {
    case "no-sidebar":
      return <NoSidebarLayout />;
    case "app-frame":
    default:
      return <AppLayout />;
  }
}
