import { z } from "zod";
import { documentStateSchema } from "./mdx-document-states";
import { documentAudienceSchema } from "./mdx-document-audiences";

export const TocItemSchema = z.object({
  value: z.string(),
  href: z.string(),
  depth: z.number().int().positive(),
  numbering: z.array(z.number().int().nonnegative()),
  parent: z.string(),
});

export type TocItem = z.infer<typeof TocItemSchema>;

// Define the metadata schema separately for reuse
const metaSchema = z.object({
  /** a unique identifier for this document */
  id: z.string().nonempty(),
  /** the title of the document*/
  title: z.string().nonempty().min(1),
  /** a one sentence description of the file-contents */
  description: z.string(),
  /** the current state of progress of the document */
  documentState: documentStateSchema.optional(),
  /** the audience the document is targeted at */
  documentAudiences: z.array(documentAudienceSchema).min(1).optional(),
  /** menu display order */
  order: z.number().int(),
  /** the path to the file within the repo, from the repo-root */
  repoPath: z.string(),
  /** the name of the package this document belongs to */
  packageName: z.string(),
  /**
   * Array of menu labels
   * e.g. ["Getting Started", "API Reference"]
   */
  menu: z.array(z.string().nonempty()),
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
});

export type DocumentMeta = z.infer<typeof metaSchema>;

/** the schema that is being generated from the mdx-file parser and
 * needed by the app to properly render the document
 */
export const mdxDocumentSchema = z.object({
  meta: metaSchema,
  /** the mdx content as a single string */
  mdx: z.string().nonempty(),
});

export type MdxDocument = z.infer<typeof mdxDocumentSchema>;

const metaSchemaWithoutGeneratedMeta = metaSchema.omit({
  /** generated, based on the file-path starting from the repo-root */
  repoPath: true,
  /** generated, based on the menu-array value*/
  route: true,
  /** generated, parsed from the heading structure of the markdown content */
  toc: true,
  /** generated, based on the closest package.json file */
  packageName: true,
});

/** the schema for validating a payload to generate or modify a file */
export const mdxDocumentPayloadSchema = mdxDocumentSchema.extend({
  meta: metaSchemaWithoutGeneratedMeta,
});

export type MdxDocumentPayload = z.infer<typeof mdxDocumentPayloadSchema>;

// Validation errors refinement
export const getValidationErrors = (input: unknown): string[] => {
  const result = mdxDocumentSchema.safeParse(input);
  if (result.success) return [];

  return result.error.errors.map(
    (error) => `${error.path.join(".")}: ${error.message}`
  );
};
