/**
 * Dynamic Layout Component
 *
 * Renders the appropriate layout based on the current document's layout property.
 * Falls back to the default AppLayout if no layout is specified or document not found.
 */

import { useRef } from "react";
import { AppLayout } from "./app-layout";
import { NoSidebarLayout } from "./no-sidebar-layout";
import { useActiveDoc } from "@/hooks/useActiveDoc";

type LayoutKind = "app-frame" | "no-sidebar";

export function DynamicLayout() {
  const { doc: activeDoc } = useActiveDoc();

  // Sticky layout choice. `activeDoc` is momentarily `undefined` on every
  // navigation while the next route's doc loads. If the rendered layout changed
  // (or its tree structure toggled) during that window, React would unmount and
  // remount the entire layout shell on every link click — tearing down the
  // AppNavBar, the sidebar, scroll-restoration containers, and the
  // semantic-search Web Worker it owns, just to rebuild them a tick later.
  //
  // So we remember the last resolved layout and keep rendering it through the
  // loading window. The layout component only changes when a freshly resolved
  // doc actually calls for a different one — i.e. when navigating between an
  // app-frame page and a no-sidebar page, where a remount is expected. The
  // per-route content swap is handled inside each layout via <Outlet />, so the
  // shell stays mounted while the content updates.
  const lastLayoutRef = useRef<LayoutKind | null>(null);

  if (activeDoc) {
    lastLayoutRef.current =
      activeDoc.meta.layout === "no-sidebar" ? "no-sidebar" : "app-frame";
  }

  // Default to app-frame on the very first load, before any doc has resolved.
  const layout = lastLayoutRef.current ?? "app-frame";

  return layout === "no-sidebar" ? <NoSidebarLayout /> : <AppLayout />;
}
