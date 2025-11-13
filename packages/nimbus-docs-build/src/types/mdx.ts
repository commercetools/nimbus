/**
 * TypeScript type definitions for MDX documents
 */
import { z } from "zod";
import {
  mdxDocumentSchema,
  mdxDocumentPayloadSchema,
  TocItemSchema,
  TabMetadataSchema,
  layoutTypes,
  routeInfoSchema,
  categoryInfoSchema,
  routeManifestSchema,
} from "../schemas/mdx-document.js";

export type MdxDocument = z.infer<typeof mdxDocumentSchema>;
export type MdxDocumentPayload = z.infer<typeof mdxDocumentPayloadSchema>;
export type TocItem = z.infer<typeof TocItemSchema>;
export type TabMetadata = z.infer<typeof TabMetadataSchema>;
export type LayoutType = (typeof layoutTypes)[number];

export type RouteInfo = z.infer<typeof routeInfoSchema>;
export type CategoryInfo = z.infer<typeof categoryInfoSchema>;
export type RouteManifest = z.infer<typeof routeManifestSchema>;

// Convenience type aliases
export type MdxFileMeta = MdxDocument["meta"];
export type MdxViews = MdxDocument["views"];
