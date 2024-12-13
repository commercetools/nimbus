import z from "zod";
import {
  mdxDocumentPayloadSchema,
  mdxDocumentSchema,
} from "@/schemas/mdx-document";

export type MdxFileFrontmatter = z.infer<typeof mdxDocumentSchema>;
export type MdxFileFrontmatterPayload = z.infer<
  typeof mdxDocumentPayloadSchema
>;
