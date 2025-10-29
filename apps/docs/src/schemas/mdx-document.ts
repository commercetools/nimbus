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

/** Schema for a single view (design or dev) containing MDX content and TOC */
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
    /** whether this document has a developer view (.dev.mdx file) */
    hasDevView: z.boolean().optional().default(false),
  }),
  /** the mdx content as a single string (design/default view) */
  mdx: z.string(),
  /** optional developer view content */
  devView: viewSchema.optional(),
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
