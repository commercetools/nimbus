/**
 * Lazy-loaded Heavy Components
 *
 * Components that are heavy or rarely used are lazy-loaded
 * to improve initial bundle size
 */

import { lazy } from "react";

// Heavy documentation components
export const PropsTable = lazy(
  () => import("@/components/document-renderer/components/props-table")
);

export const LiveCodeEditor = lazy(
  () => import("@/components/document-renderer/components/live-code-editor")
);

export const TokenDemo = lazy(
  () => import("@/components/document-renderer/components/token-demos")
);

export const CategoryOverview = lazy(
  () => import("@/components/document-renderer/components/category-overview")
);

export const IconSearch = lazy(
  () =>
    import(
      "@/components/document-renderer/components/token-demos/icon-search/icon-search"
    )
);
