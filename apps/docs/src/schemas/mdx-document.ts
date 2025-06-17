import { z } from "zod";
import { mdxDocumentStates } from "./mdx-document-states";
import { mdxDocumentAudiences } from "./mdx-document-audiences";
import { lifecycleStates } from "./lifecycle-states";

export const TocItemSchema = z.object({
  value: z.string(),
  href: z.string(),
  depth: z.number(),
  numbering: z.array(z.number()),
  parent: z.string(),
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
    /** the current state of progress of the document */
    documentState: z.enum(mdxDocumentStates).optional(),
    /** the audience the document is targeted at */
    documentAudiences: z.array(z.enum(mdxDocumentAudiences)).optional(),
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
  }),
  /** the mdx content as a single string */
  mdx: z.string(),
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
