import z from "zod";
import {
  mdxDocumentPayloadSchema,
  mdxDocumentSchema,
  layoutTypes,
} from "@/schemas/mdx-document";

export type MdxFileFrontmatter = z.infer<typeof mdxDocumentSchema>;
export type MdxFileFrontmatterPayload = z.infer<
  typeof mdxDocumentPayloadSchema
>;

export type { LifecycleState } from "@/schemas/lifecycle-states";
export type LayoutType = (typeof layoutTypes)[number];
