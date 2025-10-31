/**
 * Zod schemas for documentation validation
 */

import { z } from "zod";

// Define the base type for recursive schema
type TocItem = {
  value: string;
  depth: number;
  children?: TocItem[];
};

// Recursive schema using z.lazy with proper typing
export const tocItemSchema: z.ZodType<TocItem> = z.lazy(() =>
  z.object({
    value: z.string(),
    depth: z.number(),
    children: z.array(tocItemSchema).optional(),
  })
);

export const mdxFileMetaSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  order: z.number().default(999),
  menu: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  lifecycleState: z.string().optional(),
  documentState: z.string().optional(),
  figmaLink: z.string().optional(),
  repoPath: z.string(),
  route: z.string(),
  toc: z.array(tocItemSchema),
});

export const mdxDocumentSchema = z.object({
  meta: mdxFileMetaSchema,
  mdx: z.string(),
});

export const routeInfoSchema = z.object({
  path: z.string(),
  id: z.string(),
  title: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  chunkName: z.string(),
});

export const categoryInfoSchema = z.object({
  id: z.string(),
  label: z.string(),
  order: z.number(),
  items: z.array(routeInfoSchema),
});

const navigationItemSchema = z.object({
  label: z.string(),
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      path: z.string(),
    })
  ),
});

export const routeManifestSchema = z.object({
  routes: z.array(routeInfoSchema),
  categories: z.array(categoryInfoSchema),
  navigation: z.record(z.string(), navigationItemSchema),
});
