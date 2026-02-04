import { z } from "zod";
import { lifecycleStates } from "./lifecycle-states";

export const TocItemSchema = z.object({
  value: z.string(),
  href: z.string(),
  depth: z.number(),
  numbering: z.array(z.number()),
  parent: z.string(),
});

/** Available layout types for MDX documents */
export const layoutTypes = ["app-frame", "no-sidebar"] as const;

/** Schema for tab metadata describing available views for a document */
export const TabMetadataSchema = z.object({
  /** Unique key for the view (e.g., "overview", "api", "examples") */
  key: z.string(),
  /** Display title for the tab */
  title: z.string(),
  /** Sort order for tabs (ascending) */
  order: z.number(),
});

/** Schema for a single view (e.g., overview, api, dev) containing MDX content and TOC */
const viewSchema = z.object({
  /** the mdx content as a single string */
  mdx: z.string(),
  /** table of contents of the document */
  toc: z.array(TocItemSchema),
});

/** the schema that is being generated from the mdx-file parser and
 * needed by the app to properly rennder the document
 */
export const mdxDocumentSchema = z.object({
  meta: z.object({
    /** a unique identifier for this document */
    id: z.string(),
    /** the title of the document*/
    title: z.string(),
    /** the exact export name of the component (e.g., "CollapsibleMotion", "ComboBox") */
    exportName: z.string().optional(),
    /** a one sentence descirption of the file-contents */
    description: z.string(),
    /** the lifecycle state of the component/feature */
    lifecycleState: z.enum(lifecycleStates).optional(),
    /** menu display order */
    order: z.number(),
    /** the path to the file within the repo, from the repo-root */
    repoPath: z.string(),
    /**
     * Array of menu labels
     * e.g. ["Getting Started", "API Reference"]
     */
    menu: z.array(z.string()),
    /** unique, browser-route, generated from the menu array */
    route: z.string(),
    /** tags one might use to search for this page */
    tags: z.array(z.string()),
    /** table of contents of the document */
    toc: z.array(TocItemSchema),
    /** icon associated with this document */
    icon: z.string().optional(),
    /** a link to a figma-design or -node */
    figmaLink: z.string().url().optional(),
    /** layout type - defaults to 'app-frame' if not specified */
    layout: z.enum(layoutTypes).optional().default("app-frame"),
    /** array of available tabs/views for this document */
    tabs: z.array(TabMetadataSchema).default([]),
  }),
  /** the mdx content as a single string (main/default view) */
  mdx: z.string(),
  /** map of view key to view content (e.g., { "overview": {...}, "api": {...} }) */
  views: z.record(z.string(), viewSchema).default({}),
});

const metaSchemaWithoutGeneratedMeta = mdxDocumentSchema.shape.meta.omit({
  /** generated, based on the file-path starting from the repo-root */
  repoPath: true,
  /** generated, based on the menu-array value*/
  route: true,
  /** generated, parsed from the heading structure of the markdown content */
  toc: true,
});

/** the schema for validating a payload to generate or modify a file */
export const mdxDocumentPayloadSchema = mdxDocumentSchema.extend({
  meta: metaSchemaWithoutGeneratedMeta,
});
